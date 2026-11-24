// Port of the reference prototype's <script>, scoped to one root element.
// Every lookup goes through root.querySelector — nothing touches document-level
// ids, and nothing listens for wheel / keydown / touchmove (the grid owns those).
//
// Expected DOM under `root` (rendered by HatsHero.tsx):
//   .hh-stage                    the orbit stage (hats, ring, bursts live here)
//     svg.hh-me                  the portrait (#bgrect, #bghalo, #props, … inside)
//     button.hat[data-hat=<id>]  one per hat, each holding its icon svg

import { PROPS, PBLADES, type HatId } from './props';
import { HATS, ORDER, PAL, FACE, type WearableId, type Face } from './hatsData';

export interface HatsEngineOptions {
  reducedMotion: boolean;
  /** Park the hats off-screen until flyIn() is called (first-visit intro). */
  deferEntrance?: boolean;
  /** Fired when the visitor puts a hat on (not for the initial 'me' state). */
  onWear?: (hat: HatId) => void;
}

export interface HatsEngine {
  setActive(on: boolean): void;
  setOverview(p: number): void;
  currentHat(): WearableId;
  onHatChange(cb: (hat: WearableId) => void): () => void;
  /** Hats fly in from off-screen to their orbit slots, staggered 60ms. */
  flyIn(): void;
  /**
   * Sheet peek (0 = full hero, 1 = hiding behind the sheet with only the head
   * showing). The host moves the stage; the engine handles the portrait
   * itself: card background fades, the face reacts as it goes, pupils drop.
   */
  setPeek(p: number): void;
  /** Settled in the peek: blink, follow the pointer, small idle bits. */
  setPeekLive(on: boolean): void;
  /** Show a hat without wearing it (no palette/tagline change). null = the worn hat. */
  displayHat(id: WearableId | null): void;
  /** Quick look left (-1) or right (1), e.g. before shuffling along the edge. */
  glance(dir: number): void;
  destroy(): void;
}

interface HatState {
  id: HatId; el: HTMLButtonElement;
  a: number; ph: number; x: number; y: number; vx: number; vy: number; r: number; sc: number;
  tx: number; ty: number; ox: number; oy: number; sx: number; sy: number;
  drag: boolean; land: boolean; hidden: boolean; parked: boolean; moved: number; pointerId: number | null;
}

type GlassState = 'on' | 'up' | 'down' | 'off';

const G: Record<GlassState, string> = {
  on: 'none',
  up: 'translate(0px,-10px)',
  down: 'translate(0px,34px) rotate(-7deg)',
  off: 'translate(46px,488px) rotate(172deg)',
};

const PAW = '<svg viewBox="0 0 20 20" width="20" height="20"><ellipse cx="10" cy="13" rx="5" ry="4" fill="currentColor"/><circle cx="4.5" cy="8" r="2" fill="currentColor"/><circle cx="8" cy="4.5" r="2" fill="currentColor"/><circle cx="12" cy="4.5" r="2" fill="currentColor"/><circle cx="15.5" cy="8" r="2" fill="currentColor"/></svg>';

export function createHatsEngine(root: HTMLElement, opts: HatsEngineOptions): HatsEngine {
  const reduce = opts.reducedMotion;
  const q = <T extends Element>(sel: string) => root.querySelector(sel) as T;

  const stage = q<HTMLElement>('.hh-stage');
  const me = q<SVGSVGElement>('svg.hh-me');
  const glasses = q<SVGGElement>('#glasses');
  const nose = q<SVGPathElement>('#nose');
  const ears = q<SVGGElement>('#ears');
  const hair = q<SVGGElement>('#hair');
  const shake = q<SVGGElement>('#shake');
  const mouth = q<SVGGElement>('#mouth');
  const props = q<SVGGElement>('#props');
  const bgrect = q<SVGRectElement>('#bgrect');
  const bghalo = q<SVGCircleElement>('#bghalo');
  const pupils = Array.from(me.querySelectorAll<SVGGElement>('.pupil'));

  const ring = document.createElement('div');
  ring.className = 'ring';
  stage.appendChild(ring);

  let current: WearableId = 'me';
  let gState: GlassState = 'on';
  let eyeTaps = 0;
  let faceTimer: ReturnType<typeof setTimeout> | null = null;
  let gAnim: Animation | null = null;
  let touched = false;
  let hintHat: HatState | null = null;
  let hintStart = 0;
  let active = false;
  let overview = 0;
  let destroyed = false;
  let raf = 0;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const listeners = new Set<(h: WearableId) => void>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => { timers.delete(t); if (!destroyed) fn(); }, ms);
    timers.add(t);
    return t;
  };

  // ── Expressions ───────────────────────────────────────────────────────────
  mouth.style.transformBox = 'fill-box';
  mouth.style.transformOrigin = '50% 50%';

  function setFace(f: Face, hold = 1700) {
    const b = { eyes: 'open', mouth: 'grin', brows: 'none', blush: 'none', ...FACE[current] };
    const n = { ...b, ...f };
    me.dataset.eyes = n.eyes; me.dataset.mouth = n.mouth; me.dataset.brows = n.brows; me.dataset.blush = n.blush;
    if (faceTimer) clearTimeout(faceTimer);
    faceTimer = hold ? setTimeout(() => setFace({}, 0), hold) : null;
    if (!reduce && hold) mouth.animate([{ transform: 'scale(.85)' }, { transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out' });
  }
  function wobble(el: Element | null, frames: Keyframe[], d = 500) {
    if (!reduce && el && el.animate) el.animate(frames, { duration: d, easing: 'ease-out' });
  }

  // ── Geometry ──────────────────────────────────────────────────────────────
  // The stage lives inside the grid's transformed world (scaled during the
  // overview), so screen measurements are divided by the current scale to get
  // stage-local CSS pixels, which is the space the hats are positioned in.
  const L = { W: 0, H: 0, head: { x: 0, y: 0 }, mag: 0, hs: 60, init: false };
  const scale = () => { const r = stage.getBoundingClientRect(); return stage.offsetWidth ? r.width / stage.offsetWidth : 1; };
  function s2s(x: number, y: number) {
    const m = me.getScreenCTM(), r = stage.getBoundingClientRect(), k = scale() || 1;
    if (!m) return { x: 0, y: 0 };
    return { x: (m.a * x + m.c * y + m.e - r.left) / k, y: (m.b * x + m.d * y + m.f - r.top) / k };
  }
  function local(clientX: number, clientY: number) {
    const r = stage.getBoundingClientRect(), k = scale() || 1;
    return { x: (clientX - r.left) / k, y: (clientY - r.top) / k };
  }
  function layout() {
    L.W = stage.offsetWidth; L.H = stage.offsetHeight;
    if (!L.W || !L.H) return;
    L.head = s2s(400, 250);
    const c = s2s(400, 449), w = me.getBoundingClientRect().width / (scale() || 1);
    L.mag = w * 0.48;
    L.hs = Math.max(46, Math.min(84, L.W * 0.15));
    stage.style.setProperty('--hs', L.hs + 'px');
    const rs = w * 0.85;
    Object.assign(ring.style, { width: rs + 'px', height: rs + 'px', left: (c.x - rs / 2) + 'px', top: (L.head.y + 20 - rs / 2) + 'px' });
  }

  let lastPX = 0, lastPY = 0, mx = 0, my = 0;
  function look(x: number, y: number) {
    const r = me.getBoundingClientRect(), cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.44;
    const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 300);
    let px = dx / d * 7 * m, py = dy / d * 5 * m;
    if (current === 'notes' && me.dataset.brows === 'think') { px = px * 0.25 - 6; py = py * 0.25 + 1; }
    pupils.forEach(p => p.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)})`));
  }
  const onWindowMove = (e: PointerEvent) => {
    if (peekLive && !active) { lastPX = e.clientX; lastPY = e.clientY; look(e.clientX, e.clientY); scheduleLookDown(); return; }
    if (!active) return;
    if (current === 'propeller') { const v = Math.hypot(e.clientX - lastPX, e.clientY - lastPY); if (v > 25) spin(Math.min(0.15, v * 0.0012)); }
    lastPX = e.clientX; lastPY = e.clientY;
    mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
    look(e.clientX, e.clientY);
  };
  window.addEventListener('pointermove', onWindowMove, { passive: true });

  // ── Hats ──────────────────────────────────────────────────────────────────
  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | SVGElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions) => {
    el.addEventListener(type, fn as EventListener, o);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener, o));
  };

  const hats: HatState[] = HATS.map(s => {
    const el = stage.querySelector<HTMLButtonElement>(`button.hat[data-hat="${s.id}"]`)!;
    const h: HatState = {
      id: s.id, el, a: 0, ph: Math.random() * 6, x: 0, y: 0, vx: 0, vy: 0, r: 0, sc: 1,
      tx: 0, ty: 0, ox: 0, oy: 0, sx: 0, sy: 0,
      drag: false, land: false, hidden: false, parked: !!opts.deferEntrance && !reduce, moved: 0, pointerId: null,
    };
    on(el, 'pointerdown', e => {
      // Hats own their gesture: no grid navigation, no browser panning.
      e.preventDefault(); e.stopPropagation();
      if (!e.isPrimary || !active || overview > 0) return;
      h.drag = true; h.moved = 0; h.sx = e.clientX; h.sy = e.clientY; h.pointerId = e.pointerId;
      try { el.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
      const p = local(e.clientX, e.clientY);
      h.ox = p.x - h.x; h.oy = p.y - h.y; h.tx = h.x; h.ty = h.y;
      stage.classList.add('dragging'); interacted();
      if (!raf && active) raf = requestAnimationFrame(tick);
    });
    on(el, 'pointermove', e => {
      if (!h.drag || e.pointerId !== h.pointerId) return;
      const p = local(e.clientX, e.clientY);
      h.tx = p.x - h.ox; h.ty = p.y - h.oy;
      h.moved = Math.max(h.moved, Math.hypot(e.clientX - h.sx, e.clientY - h.sy));
    });
    const end = (e: PointerEvent) => {
      if (!h.drag || e.pointerId !== h.pointerId) return;
      h.drag = false; h.pointerId = null;
      stage.classList.remove('dragging'); ring.classList.remove('hot');
      if (h.moved < 6 || Math.hypot(h.x - L.head.x, h.y - L.head.y) < L.mag) wear(h);
    };
    on(el, 'pointerup', end);
    on(el, 'pointercancel', () => { h.drag = false; h.pointerId = null; stage.classList.remove('dragging'); ring.classList.remove('hot'); });
    // Keyboard: Enter / Space synthesise a click with detail 0.
    on(el, 'click', e => { if (e.detail === 0) wear(h); });
    return h;
  });

  function relayout() {
    const v = ORDER.map(id => hats.find(h => h.id === id)!).filter(h => !h.hidden), n = v.length;
    v.forEach((h, i) => { h.a = (-206 + (n > 1 ? i * 232 / (n - 1) : 116)) * Math.PI / 180; });
  }
  relayout();
  function slot(h: HatState, t: number) {
    const b = reduce ? 0 : 1;
    // On narrow (phone) stages, pull the orbit in so the outer hats keep clear
    // of the grid's edge labels; wider stages match the reference exactly.
    const rx = L.W < 480 ? Math.min(L.W * 0.43, L.W / 2 - L.hs / 2 - 10) : L.W * 0.43;
    return {
      x: L.W / 2 + rx * Math.cos(h.a) + b * (Math.sin(t * 1.1 + h.ph) * 4 + mx * 12),
      y: L.H * 0.52 + L.H * 0.44 * Math.sin(h.a) + b * (Math.cos(t * 1.3 + h.ph) * 5 + my * 8),
    };
  }
  // Off-screen launch point for the intro fly-in: straight out from the stage
  // centre along the hat's orbit angle, well past the cell edge.
  function parkedSpot(h: HatState) {
    const d = Math.max(innerWidth, innerHeight);
    return { x: L.W / 2 + Math.cos(h.a) * d, y: L.H * 0.52 + Math.sin(h.a) * d };
  }
  function place(h: HatState) {
    h.el.style.transform = `translate(${h.x - L.hs / 2}px,${h.y - L.hs / 2}px) rotate(${h.r}deg) scale(${h.sc})`;
  }

  const ro = new ResizeObserver(() => {
    layout();
    if (!L.init && L.W) {
      L.init = true;
      hats.forEach(h => { const s = h.parked ? parkedSpot(h) : slot(h, 0); h.x = s.x; h.y = s.y; place(h); });
    }
  });
  ro.observe(stage);
  const onResize = () => layout();
  window.addEventListener('resize', onResize);

  // ── Frame loop (runs only while active) ─────────────────────────────────────
  let pTh = 0, pW = 0, bladesEl: Element | null = null;
  function spin(v: number) { pW = Math.min(1.1, pW + v); }
  function tick(now: number) {
    raf = 0;
    if (!active || destroyed) return;
    const t = now / 1000;
    let hot = false;
    for (const h of hats) {
      let gx: number, gy: number, k = 0.07, d = 0.8, rt: number, st = 1;
      if (h.drag) {
        gx = h.tx; gy = h.ty;
        const dist = Math.hypot(gx - L.head.x, gy - L.head.y);
        if (dist < L.mag) { const m = (1 - dist / L.mag) * 0.55; gx += (L.head.x - gx) * m; gy += (L.head.y - gy) * m; hot = true; }
        k = 0.32; d = 0.6; rt = Math.max(-28, Math.min(28, h.vx * 2.2)); st = 1.15;
      } else if (h.land) {
        gx = L.head.x; gy = L.head.y; k = 0.25; d = 0.6; rt = 0; st = 1.3;
      } else if (h.parked) {
        const s = parkedSpot(h); gx = s.x; gy = s.y; rt = 0; st = 0.7;
      } else {
        const s = slot(h, t); gx = s.x; gy = s.y; rt = reduce ? 0 : Math.sin(t * 0.9 + h.ph) * 7;
        if (hintHat === h) {
          const p = Math.min(1, (now - hintStart) / 1600), a = Math.sin(p * Math.PI) * 0.45;
          gx += (L.head.x - gx) * a; gy += (L.head.y - gy) * a;
          if (p >= 1) hintHat = null;
        }
      }
      if (reduce) {
        // Reduced motion: no springs, hats sit exactly where they belong.
        h.x = gx; h.y = gy; h.vx = h.vy = 0; h.r = rt; h.sc = h.drag ? 1.15 : 1;
      } else {
        h.vx = (h.vx + (gx - h.x) * k) * d; h.vy = (h.vy + (gy - h.y) * k) * d;
        h.x += h.vx; h.y += h.vy; h.r += (rt - h.r) * 0.15; h.sc += (st - h.sc) * 0.2;
      }
      place(h);
    }
    ring.classList.toggle('hot', hot);
    if (current === 'propeller' && bladesEl) {
      const idle = reduce ? 0 : 0.035;
      pW = pW > idle ? Math.max(idle, pW * 0.985) : pW + (idle - pW) * 0.05;
      pTh += pW; bladesEl.innerHTML = PBLADES(pTh, pW);
    }
    raf = requestAnimationFrame(tick);
  }

  // ── Wearing ───────────────────────────────────────────────────────────────
  function wear(h: HatState) {
    if (h.hidden || !active) return;
    interacted(); h.land = true;
    later(() => {
      h.land = false; h.hidden = true;
      h.el.classList.add('worn'); h.el.tabIndex = -1; h.el.setAttribute('aria-hidden', 'true');
      putBack(); relayout(); apply(h.id, true);
      opts.onWear?.(h.id);
    }, reduce ? 0 : 200);
  }
  function putBack() {
    const p = hats.find(x => x.id === current);
    if (!p) return;
    p.hidden = false; p.el.classList.remove('worn'); p.el.tabIndex = 0; p.el.removeAttribute('aria-hidden');
    p.x = L.head.x; p.y = L.head.y; p.vx = (Math.random() - 0.5) * 14; p.vy = -10;
  }
  function apply(id: WearableId, fx: boolean) {
    current = id; me.dataset.hat = id;
    props.innerHTML = id === 'me' ? '' : PROPS[id].svg(false);
    props.classList.remove('on'); void props.getBoundingClientRect(); props.classList.add('on');
    bladesEl = props.querySelector('.blades');
    if (id === 'propeller') { pW = 0; spin(reduce ? 0 : 0.95); }
    const p = PAL[id];
    bgrect.setAttribute('fill', p.card); bghalo.setAttribute('fill', p.halo);
    root.style.setProperty('--hh-accent', p.accent);
    listeners.forEach(cb => cb(id));
    later(() => look(lastPX || innerWidth / 2, lastPY || innerHeight / 2), 30);
    if (id === 'cat') setFace({ eyes: 'closed', mouth: 'o', brows: 'up' }, 900);
    else if (id === 'helmet') setFace({ eyes: 'happy', mouth: 'laugh' }, 2400);
    else setFace({}, 0);
    if (!fx || reduce || id === 'me') return;
    props.animate([
      { transform: 'translateY(-120px) scale(1.25)', opacity: 0 },
      { transform: 'translateY(8px) scale(1.06,.92)', opacity: 1, offset: 0.6 },
      { transform: 'translateY(-4px) scale(.98,1.03)', offset: 0.8 },
      { transform: 'none' },
    ], { duration: 560, easing: 'cubic-bezier(.3,.7,.4,1)' });
    if (id === 'notes') Array.from(props.querySelectorAll('.note')).forEach((n, i) =>
      n.animate([{ opacity: 0 }, { opacity: 0, offset: 0.01 }, { opacity: 1 }], { duration: 120, delay: i * 90, fill: 'backwards' }));
    const hp = s2s(400, 230), rp = document.createElement('div');
    rp.className = 'ripple'; rp.style.left = hp.x + 'px'; rp.style.top = hp.y + 'px';
    stage.appendChild(rp); later(() => rp.remove(), 950);
    burst(id, hp.x, hp.y);
  }

  // ── Bursts, pop cards, speed lines ───────────────────────────────────────────
  function shape(id: HatId, i: number) {
    const pick = <T,>(a: T[]) => a[i % a.length];
    if (id === 'notes') return `<div style="width:14px;height:14px;background:${pick(['#FFD84D', '#FF9EB5', '#8FD3FF', '#B9F18C'])};border-radius:2px"></div>`;
    if (id === 'party') return `<div style="width:${i % 3 ? 7 : 11}px;height:${i % 3 ? 12 : 7}px;background:${pick(['#FF5FA2', '#FFD84D', '#7BE0C3', '#8FD3FF', '#FF8A5B'])};border-radius:2px"></div>`;
    if (id === 'beret') { const z = 7 + Math.random() * 12; return `<div style="width:${z}px;height:${z}px;background:${pick(['#2F6BFF', '#FFC400', '#14B87A', '#D7263D'])};border-radius:50%"></div>`; }
    if (id === 'cat') return `<div style="color:${i % 2 ? '#C0621A' : '#2E1A0B'}">${PAW}</div>`;
    if (id === 'ninja') { const z = 16 + Math.random() * 20; return `<div style="width:${z}px;height:${z}px;background:#fff;border:1px solid #ddd;border-radius:50%;opacity:.9"></div>`; }
    if (id === 'propeller') return `<div style="width:22px;height:22px;border:3px solid ${pick(['#2F6BFF', '#FF4D4D', '#FFD84D'])};border-radius:50%"></div>`;
    return '';
  }
  function burst(id: HatId, x: number, y: number) {
    if (reduce) return;
    if (id === 'helmet') {
      for (let i = 0; i < 10; i++) {
        const sp = document.createElement('div'); sp.className = 'speed';
        const w = 50 + Math.random() * 140; sp.style.width = w + 'px'; sp.style.top = (L.H * 0.1 + Math.random() * L.H * 0.8) + 'px';
        stage.appendChild(sp);
        sp.animate([{ transform: `translateX(${L.W}px)`, opacity: 0 }, { opacity: 0.45, offset: 0.3 }, { transform: `translateX(${-w - 40}px)`, opacity: 0 }],
          { duration: 420 + Math.random() * 380, delay: i * 45, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'both' }).onfinish = () => sp.remove();
      }
      return;
    }
    if (id === 'party' || id === 'propeller' || id === 'notes') {
      const c = document.createElement('div'); c.className = 'pop';
      c.textContent = id === 'party' ? 'Friday plan: locked ✓' : id === 'notes' ? 'Hmm… what if we test it?' : 'spin: ease-out · 2.4s';
      stage.appendChild(c);
      const cw = c.offsetWidth;
      c.style.left = Math.max(4, Math.min(L.W - cw - 4, x + 24)) + 'px'; c.style.top = Math.max(0, y - 56) + 'px';
      c.animate([{ transform: 'translateY(14px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.2 }, { transform: 'none', opacity: 1, offset: 0.85 }, { transform: 'translateY(-10px)', opacity: 0 }],
        { duration: 2200, easing: 'ease-out' }).onfinish = () => c.remove();
    }
    const n = id === 'cat' ? 9 : id === 'ninja' ? 10 : id === 'party' ? 26 : 14;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div'); p.className = 'p'; p.innerHTML = shape(id, i); stage.appendChild(p);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7, dist = L.W * (0.12 + Math.random() * 0.2), rot = (Math.random() - 0.5) * 540;
      const dx = Math.cos(a) * dist, dy = Math.sin(a) * dist;
      const fall = id === 'party' || id === 'notes' ? L.H * 0.3 : id === 'ninja' ? -20 : id === 'cat' ? 0 : L.H * 0.12, sc = id === 'ninja' ? 1.8 : 1;
      p.animate([
        { transform: `translate(${x}px,${y}px) translate(-50%,-50%) scale(.3)`, opacity: 1 },
        { transform: `translate(${x + dx}px,${y + dy}px) translate(-50%,-50%) scale(${sc}) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${x + dx * 1.15}px,${y + dy + fall}px) translate(-50%,-50%) scale(${sc * 0.9}) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)', delay: id === 'cat' ? i * 70 : 0, fill: 'both' }).onfinish = () => p.remove();
    }
  }

  // ── Glasses ───────────────────────────────────────────────────────────────
  function moveGlasses(to: GlassState) {
    const from = getComputedStyle(glasses).transform, fromT = from === 'none' ? 'none' : from;
    gAnim?.cancel();
    if (reduce) { glasses.style.transform = G[to]; gState = to; return; }
    let frames: Keyframe[], o: KeyframeAnimationOptions;
    if (to === 'off') {
      frames = [{ transform: fromT }, { transform: 'translate(10px,-30px) rotate(-14deg)', offset: 0.18 }, { transform: 'translate(40px,488px) rotate(150deg)', offset: 0.7 }, { transform: 'translate(44px,450px) rotate(166deg)', offset: 0.84 }, { transform: G.off }];
      o = { duration: 1100, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' };
    } else if (gState === 'off') {
      frames = [{ transform: fromT }, { transform: 'translate(20px,-40px) rotate(-20deg)', offset: 0.65 }, { transform: 'none' }];
      o = { duration: 700, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' };
    } else {
      frames = [{ transform: fromT }, { transform: G[to] }];
      o = { duration: to === 'up' ? 160 : 420, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' };
    }
    gAnim = glasses.animate(frames, o); gState = to;
  }

  // ── Face pokes ────────────────────────────────────────────────────────────
  function pt(clientX: number, clientY: number) {
    const m = me.getScreenCTM();
    if (!m) return { x: -1, y: -1 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }
  const inE = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  function zone(x: number, y: number) {
    if (gState === 'off' && x > 300 && x < 580 && y > 860) return 'specs';
    if (x > 258 && x < 542 && y > 388 && y < 492) return 'eyes';
    if (x > 378 && x < 432 && y >= 462 && y < 528) return 'nose';
    if (x > 340 && x < 460 && y >= 528 && y < 615) return 'mouth';
    if (inE(x, y, 294, 516, 42, 36) || inE(x, y, 506, 516, 42, 36)) return 'cheek';
    if (current !== 'me' && y < 360 && x > 180 && x < 700) return 'prop';
    if (current === 'helmet' && inE(x, y, 400, 425, 210, 250)) return 'prop';
    if (inE(x, y, 250, 468, 32, 42) || inE(x, y, 550, 464, 32, 42)) return 'ear';
    if (y < 392 && inE(x, y, 410, 300, 230, 200)) return 'hair';
    if (inE(x, y, 400, 449, 152, 182)) return 'face';
    if (y > 640 && x > 330 && x < 470 && y < 700) return 'neck';
    if (y >= 690 && inE(x, y, 400, 1000, 330, 310)) return 'body';
    return 'bg';
  }
  function pokeProp() {
    const hp = s2s(400, 200);
    if (current === 'propeller') { spin(0.8); setFace({ eyes: 'happy', mouth: 'laugh' }, 1200); burst('propeller', hp.x, hp.y - 80); return; }
    if (current === 'party') { burst('party', hp.x, hp.y); setFace({ eyes: 'happy', mouth: 'laugh' }, 1400); }
    else if (current === 'cat') {
      setFace({ eyes: 'closed', mouth: 'small', brows: 'worried' }, 1200);
      const l = props.querySelector('.catlid');
      l?.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.2)' }, { transform: 'scaleY(.2)', offset: 0.8 }, { transform: 'scaleY(1)' }], { duration: 1000 });
    } else if (current === 'helmet') {
      props.classList.remove('on'); void props.getBoundingClientRect(); props.classList.add('on');
      setFace({ eyes: 'happy', mouth: 'laugh' }, 2200); return;
    } else if (current === 'notes') { setFace({ eyes: 'squint', mouth: 'smile' }, 1200); burst('notes', hp.x, hp.y); }
    else setFace({ eyes: 'happy', mouth: 'smile' }, 1200);
    wobble(props, [{ transform: 'none' }, { transform: 'rotate(-5deg) translateY(-8px)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'none' }], 560);
  }
  function poke(clientX: number, clientY: number) {
    interacted(); look(clientX, clientY);
    const { x, y } = pt(clientX, clientY), z = zone(x, y);
    if (z === 'specs') { eyeTaps = 0; moveGlasses('on'); setFace({ eyes: 'happy', mouth: 'grin' }, 1400); return; }
    if (z === 'eyes') {
      if (gState === 'off') { setFace({ eyes: 'closed', mouth: 'small', brows: 'up' }, 1000); return; }
      eyeTaps++;
      if (eyeTaps === 1) { setFace({ eyes: 'squint', mouth: 'flat', brows: 'down' }, 1400); moveGlasses('up'); later(() => { if (gState === 'up') moveGlasses('on'); }, 180); }
      else if (eyeTaps === 2) { moveGlasses('down'); setFace({ eyes: 'open', mouth: 'small', brows: 'up' }, 2200); }
      else { moveGlasses('off'); setFace({ eyes: 'closed', mouth: 'o', brows: 'worried' }, 1300); eyeTaps = 0; }
      return;
    }
    if (gState === 'down') { moveGlasses('on'); eyeTaps = 0; }
    if (z === 'prop') pokeProp();
    else if (z === 'nose') { setFace({ eyes: 'closed', mouth: 'small', brows: 'up' }, 1100); wobble(nose, [{ transform: 'scale(1)' }, { transform: 'scale(1.25,.8)' }, { transform: 'scale(.92,1.08)' }, { transform: 'scale(1)' }], 420); }
    else if (z === 'mouth') setFace({ eyes: 'happy', mouth: 'tongue' }, 1600);
    else if (z === 'cheek') setFace({ eyes: 'happy', mouth: 'smile', blush: 'hot' }, 1800);
    else if (z === 'ear') { setFace({ eyes: 'open', mouth: 'small', brows: 'up' }, 1200); wobble(ears, [{ transform: 'none' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(-4px)' }, { transform: 'none' }], 500); }
    else if (z === 'hair') { setFace({ eyes: 'open', mouth: 'flat', brows: 'down' }, 1500); wobble(hair, [{ transform: 'none' }, { transform: 'skewX(-4deg) scaleY(1.05)' }, { transform: 'skewX(3deg) scaleY(.98)' }, { transform: 'skewX(-1.5deg) scaleY(1.01)' }, { transform: 'none' }], 600); }
    else if (z === 'face') setFace({ eyes: 'happy', mouth: 'smile' }, 1300);
    else if (z === 'neck' || z === 'body') { setFace({ eyes: 'closed', mouth: 'laugh', brows: 'up' }, 1500); wobble(shake, [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ transform: `translate(${i % 2 ? -5 : 5}px,${i % 2 ? -2 : 1}px)` } as Keyframe)).concat({ transform: 'none' }), 700); }
    else setFace({ eyes: 'open', mouth: 'o', brows: 'up' }, 1300);
  }

  // A poke is a tap: pointer goes down and comes back up without travelling.
  // Nothing here prevents default or stops propagation, so a swipe that starts
  // on the face still reaches the grid and navigates. Secondary touch points
  // (the second finger of a pinch) are ignored entirely.
  let tap: { id: number; x: number; y: number } | null = null;
  on(me, 'pointerdown', e => {
    if (!e.isPrimary || !active || overview > 0) { tap = null; return; }
    tap = { id: e.pointerId, x: e.clientX, y: e.clientY };
    look(e.clientX, e.clientY);
  });
  on(me, 'pointerup', e => {
    const t = tap; tap = null;
    if (!t || t.id !== e.pointerId || !active || overview > 0) return;
    if (Math.hypot(e.clientX - t.x, e.clientY - t.y) > 10) return;
    poke(e.clientX, e.clientY);
  });
  on(me, 'pointercancel', () => { tap = null; });

  // ── Idle hint: one hat drifts toward the head until the visitor interacts ───
  function interacted() { touched = true; }
  const nudge = () => { if (!touched && !reduce && active && !hats.some(h => h.drag)) { hintHat = hats[2]; hintStart = performance.now(); } };
  later(nudge, 2600);
  const hintInterval = setInterval(nudge, 7000);

  apply('me', false);

  // ── Sheet peek ────────────────────────────────────────────────────────────
  let peekP = 0, peekLive = false, peekBucket = -1, shownHat: WearableId | null = null;
  let lookDownT: ReturnType<typeof setTimeout> | null = null, idleT: ReturnType<typeof setTimeout> | null = null;
  const pupilsTo = (x: number, y: number) => pupils.forEach(p => p.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`));
  // Resting gaze in the peek: down at the content.
  const lookDown = () => pupilsTo(0, 5);
  function scheduleLookDown() { if (lookDownT) clearTimeout(lookDownT); lookDownT = setTimeout(() => { if (peekLive) lookDown(); }, 2500); }
  function scheduleIdle() {
    if (idleT) clearTimeout(idleT);
    if (!peekLive || reduce) return;
    idleT = setTimeout(() => {
      if (!peekLive) return;
      const bits = [
        () => glasses.animate([{ transform: 'none' }, { transform: 'translateY(-9px)' }, { transform: 'translateY(-9px)', offset: 0.6 }, { transform: 'none' }], { duration: 700, easing: 'ease-in-out' }),
        () => { pupilsTo(0, 0); setTimeout(() => { if (peekLive) lookDown(); }, 1400); },
        () => me.querySelectorAll('.eye').forEach(e => e.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' }], { duration: 520 })),
      ];
      if (gState === 'on') bits[Math.floor(Math.random() * bits.length)]();
      scheduleIdle();
    }, 20000 + Math.random() * 10000);
  }
  function showProps(id: WearableId, drop: boolean) {
    props.innerHTML = id === 'me' ? '' : PROPS[id].svg(false);
    me.dataset.hat = id;
    bladesEl = props.querySelector('.blades');
    if (drop && !reduce && id !== 'me') props.animate([{ transform: 'translateY(-90px)', opacity: 0 }, { transform: 'translateY(6px)', opacity: 1, offset: 0.65 }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  function cancelDrags() {
    hats.forEach(h => {
      if (!h.drag) return;
      h.drag = false;
      if (h.pointerId != null) { try { h.el.releasePointerCapture(h.pointerId); } catch { /* noop */ } }
      h.pointerId = null;
    });
    stage.classList.remove('dragging'); ring.classList.remove('hot');
  }

  return {
    setActive(v: boolean) {
      if (destroyed || v === active) return;
      active = v;
      root.classList.toggle('paused', !v);
      if (v) { layout(); if (!raf) raf = requestAnimationFrame(tick); }
      else {
        cancelDrags(); tap = null;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }
    },
    setOverview(p: number) {
      if (destroyed) return;
      const was = overview;
      overview = p;
      root.classList.toggle('is-overview', p > 0);
      if (p > 0) { cancelDrags(); tap = null; }
      // A small wave when the overview finishes opening.
      if (p >= 1 && was < 1 && !reduce) setFace({ eyes: 'happy', mouth: 'smile' }, 300);
    },
    currentHat: () => current,
    setPeek(p: number) {
      if (destroyed) return;
      const was = peekP;
      peekP = p;
      root.classList.toggle('peeking', p > 0);
      const bgO = String(Math.max(0, Math.min(1, 1 - p * 1.4)));
      bgrect.style.opacity = bgO; bghalo.style.opacity = bgO;
      if (p > 0 && p < 1) {
        // The face follows the drag, like the prototype.
        const b = p < 0.12 ? 0 : p < 0.42 ? 1 : p < 0.78 ? 2 : 3;
        if (b !== peekBucket) {
          peekBucket = b;
          setFace(([{}, { eyes: 'open', mouth: 'o', brows: 'up' }, { eyes: 'open', mouth: 'small', brows: 'worried' }, { eyes: 'open', mouth: 'grin', brows: 'none' }] as Face[])[b], 0);
        }
        if (p > 0.05) pupilsTo(0, 5 * p);
      } else if (p >= 1 && was < 1) { peekBucket = -1; setFace({ eyes: 'open', mouth: 'grin' }, 0); lookDown(); }
      else if (p <= 0 && was > 0) { peekBucket = -1; setFace({ eyes: 'happy', mouth: 'laugh' }, 1000); pupilsTo(0, 0); }
    },
    setPeekLive(on: boolean) {
      if (destroyed || on === peekLive) return;
      peekLive = on;
      root.classList.toggle('peek-live', on);
      if (on) { lookDown(); scheduleIdle(); }
      else { if (idleT) clearTimeout(idleT); if (lookDownT) clearTimeout(lookDownT); }
    },
    displayHat(id: WearableId | null) {
      if (destroyed) return;
      const next = id ?? current;
      if (next === (shownHat ?? current)) { shownHat = id; return; }
      const drop = id !== null || shownHat !== null;
      shownHat = id;
      showProps(next, drop);
    },
    glance(dir: number) {
      if (destroyed || reduce) return;
      pupilsTo(7 * Math.sign(dir), 1);
      setTimeout(() => { if (peekLive) lookDown(); }, 480);
    },
    onHatChange(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    flyIn() {
      if (destroyed) return;
      const parked = ORDER.map(id => hats.find(h => h.id === id)!).filter(h => h.parked);
      parked.forEach((h, i) => later(() => { h.parked = false; if (active && !raf) raf = requestAnimationFrame(tick); }, i * 60));
    },
    destroy() {
      destroyed = true; active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (faceTimer) clearTimeout(faceTimer);
      timers.forEach(t => clearTimeout(t)); timers.clear();
      if (idleT) clearTimeout(idleT);
      if (lookDownT) clearTimeout(lookDownT);
      clearInterval(hintInterval);
      gAnim?.cancel();
      ro.disconnect();
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('resize', onResize);
      cleanups.forEach(fn => fn());
      listeners.clear();
      stage.querySelectorAll('.ring,.ripple,.p,.pop,.speed').forEach(el => el.remove());
    },
  };
}
