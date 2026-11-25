import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { trackPageview } from '../../lib/analytics';
import { site, trips, useSite, type Travel } from '../../lib/site';
import { themeVars } from '../../lib/theme';
import { pageMeta } from '../../lib/pages';
import { PAL, type WearableId } from './hats/hatsData';
import { pageScroll } from '../../lib/pageScroll';
import { MiniHead, headBox, type Face } from './chrome/MiniHead';
import { setNavSlot, NavSegments } from './chrome/NavRight';
import { TldrView } from './chrome/TldrView';
import './chrome/chrome.css';

// ── The trip between the sheet and an inner page's corner ──
// Everything moves with WAAPI transforms/opacity, so it keeps running on the
// compositor while React mounts the next page (which can block the main
// thread for a few hundred ms on a phone). Pieces, all fixed overlays:
//   clip  — a box with overflow hidden; holds traveler A, so A is cut off at
//           a fixed line (the sheet's edge) while it ducks.
//   A     — his head, drawn *under* the moving card: the card hides it.
//   ghost — an empty card (the page's surface) that rises or sinks.
//   B     — his head again, *over* everything, swapped in once he's clear.
const OUT_MS = 760;
const HOME_MS = 560;
const EASE_OUT = 'cubic-bezier(.33, 1, .68, 1)';
const EASE_IN = 'cubic-bezier(.32, 0, .67, 0)';
const EASE_IN_OUT = 'cubic-bezier(.65, 0, .35, 1)';
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const YANKED: Face = { eyes: 'closed', mouth: 'o', brows: 'up' };
const FLYING: Face = { eyes: 'happy', mouth: 'laugh' };
const HOPPING: Face = { eyes: 'open', mouth: 'o', brows: 'up' };
const IDLE: Face = {};

type Box = { x: number; y: number; w: number; h: number };
/** Where the bar's home head sits (mirrors .pc-bar / .pc-home in chrome.css). */
function navHeadRect(hat: WearableId): Box {
  const md = window.innerWidth >= 768;
  const h = md ? 52 : 46, x = md ? 26 : 14, y = md ? 16 : 10;
  const [, , bw, bh] = headBox(hat);
  return { x, y, w: (h * bw) / bh, h };
}
function setFace(root: Element | null, f: Face) {
  const svg = root?.querySelector('svg.mh') as SVGElement | null;
  if (!svg) return;
  svg.dataset.eyes = f.eyes ?? 'open'; svg.dataset.mouth = f.mouth ?? 'grin'; svg.dataset.brows = f.brows ?? 'none';
}
function place(el: HTMLElement, r: Box) {
  Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, display: 'block' });
}
const at = (ms: number, total: number) => ms / total;
const opacityStep = (from: number, to: number, offset: number): Keyframe[] =>
  [{ opacity: from }, { opacity: from, offset }, { opacity: to, offset: offset + 0.001 }, { opacity: to }];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isHome = path === '/';
  const meta = pageMeta(path);
  const hat = useSite(s => s.hat);
  const worn = useSite(s => s.worn);
  const tldr = useSite(s => s.tldr);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  /** The trip in flight: which way, and whether its motion has finished. */
  const trip = useRef<{ dir: 'out' | 'home'; done: boolean; anims: Animation[] } | null>(null);
  const [navFace, setNavFace] = useState<Face>(IDLE);
  const faceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    trackPageview(location.pathname + location.search + location.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);
  useEffect(() => () => clearTimeout(faceTimer.current), []);

  const clearOverlays = useCallback(() => {
    trip.current?.anims.forEach(a => a.cancel());
    for (const el of [clipRef.current, aRef.current, bRef.current, ghostRef.current]) {
      if (!el) continue;
      el.getAnimations().forEach(a => a.cancel());
      el.style.display = 'none';
    }
  }, []);

  // Out, part 2: the page is mounted and the motion is done → hand over to the real page.
  const settleOut = useCallback(() => {
    const t = trip.current;
    if (!t || t.dir !== 'out' || !t.done || !cardRef.current || !homeRef.current) return;
    cardRef.current.style.visibility = '';
    homeRef.current.style.visibility = '';
    trip.current = null;
    clearOverlays();
    setNavFace(FLYING); clearTimeout(faceTimer.current);
    faceTimer.current = setTimeout(() => setNavFace(IDLE), 900);
  }, [clearOverlays]);

  // Home, part 2: home is mounted and the sink is done → the ghost fades off the sheet.
  const settleHome = useCallback(() => {
    const t = trip.current, ghost = ghostRef.current;
    if (!t || t.dir !== 'home' || !t.done || window.location.pathname !== '/' || !ghost) return;
    trip.current = null;
    for (const el of [clipRef.current, aRef.current, bRef.current]) if (el) { el.getAnimations().forEach(a => a.cancel()); el.style.display = 'none'; }
    const fade = ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
    fade.finished.then(() => { if (!trip.current) clearOverlays(); }, () => {});
  }, [clearOverlays]);

  // ── Out: he ducks behind the rising page, then is yanked up in its corner ──
  const runOut = useCallback((t: Omit<Travel, 'id' | 'dir'>) => {
    const clip = clipRef.current, A = aRef.current, B = bRef.current, ghost = ghostRef.current;
    if (!clip || !A || !B || !ghost) return;
    clearOverlays();
    const from = t.from, E = t.edgeY, N = navHeadRect(t.hat), P = N.y + N.h + 22, H = window.innerHeight;
    const s = N.w / from.w, dx = N.x - from.x;
    const ty = (y: number) => y - from.y; // a top-left y → translateY for A/B
    // Sticker outline (dark pages): sized in the head's own space so it lands at the bar's width after the shrink.
    for (const el of [A, B]) { el.toggleAttribute('data-ring', !!t.dark); el.style.setProperty('--ring', `${0.95 / s}px`); }
    const anims: Animation[] = [];
    const o = { duration: OUT_MS, fill: 'forwards' as FillMode };

    // The ghost: the sheet itself, lifting. It fades in over the sheet's content as it goes.
    Object.assign(ghost.style, { display: 'block', zIndex: '41', height: `${H + 40}px` });
    anims.push(ghost.animate([
      { transform: `translateY(${E}px)`, opacity: 0, easing: EASE_OUT },
      { transform: `translateY(${E - (E - P) * 0.35}px)`, opacity: 1, offset: at(140, OUT_MS), easing: EASE_OUT },
      { transform: `translateY(${P}px)`, opacity: 1, offset: at(400, OUT_MS) },
      { transform: `translateY(${P}px)`, opacity: 1, offset: at(440, OUT_MS), easing: EASE_IN_OUT },
      { transform: 'translateY(0px)', opacity: 1 },
    ], o));
    // A dark page: the lifting sheet darkens as it settles, so the hand-over to the page is not a white-to-black cut.
    if (t.dark) {
      const light = getComputedStyle(ghost).backgroundColor;
      anims.push(ghost.animate([
        { backgroundColor: light, borderTopColor: 'transparent' },
        { backgroundColor: light, borderTopColor: 'transparent', offset: at(300, OUT_MS) },
        { backgroundColor: '#0A0A0B', borderTopColor: 'transparent', offset: at(560, OUT_MS) },
        { backgroundColor: '#0A0A0B', borderTopColor: 'transparent' },
      ], o));
    }

    // His path: duck at the sheet → (hidden) to just under the page's edge in the corner → yanked up, overshoot, settle.
    const flight: Keyframe[] = [
      { transform: 'translate(0px, 0px) scale(1)', easing: EASE_IN },
      { transform: `translate(0px, ${from.h * 0.55}px) scale(1)`, offset: at(220, OUT_MS) },
      { transform: `translate(${dx}px, ${ty(P + 2)}px) scale(${s})`, offset: at(224, OUT_MS) },
      { transform: `translate(${dx}px, ${ty(P + 2)}px) scale(${s})`, offset: at(300, OUT_MS), easing: EASE_OUT },
      { transform: `translate(${dx}px, ${ty(N.y - 9)}px) scale(${s})`, offset: at(520, OUT_MS), easing: EASE_IN_OUT },
      { transform: `translate(${dx}px, ${ty(N.y)}px) scale(${s})`, offset: at(660, OUT_MS) },
      { transform: `translate(${dx}px, ${ty(N.y)}px) scale(${s})` },
    ];
    // His body language: squashed as he's pulled under, stretched as he's yanked, a wobble on landing.
    const wobble: Keyframe[] = [
      { transform: 'rotate(0deg) scale(1, 1)' },
      { transform: 'rotate(0deg) scale(1.04, .93)', offset: at(110, OUT_MS) },
      { transform: 'rotate(0deg) scale(1, 1)', offset: at(220, OUT_MS) },
      { transform: 'rotate(-16deg) scale(.9, 1.22)', offset: at(300, OUT_MS) },
      { transform: 'rotate(7deg) scale(1.06, .9)', offset: at(450, OUT_MS) },
      { transform: 'rotate(-4deg) scale(.98, 1.03)', offset: at(570, OUT_MS) },
      { transform: 'rotate(0deg) scale(1, 1)', offset: at(680, OUT_MS) },
      { transform: 'rotate(0deg) scale(1, 1)' },
    ];
    // A sits in the clip box, cut at the sheet's edge while he ducks.
    // (The corner is above that line, so the box never needs to open.)
    Object.assign(clip.style, { display: 'block', zIndex: '40', height: `${E}px` });
    for (const el of [A, B]) {
      place(el, from);
      anims.push(el.animate(flight, o), (el.firstElementChild as HTMLElement).animate(wobble, o));
    }
    // A (under the page) until he's clear of the page's edge; then B (on top, laughing).
    setFace(A, YANKED); setFace(B, FLYING);
    B.style.zIndex = '42';
    anims.push(B.animate(opacityStep(0, 1, at(420, OUT_MS)), o));

    trip.current = { dir: 'out', done: false, anims };
    anims[0].finished.then(() => { if (trip.current?.anims === anims) { trip.current.done = true; settleOut(); } }, () => {});
  }, [clearOverlays, settleOut]);
  useEffect(() => { trips.out = runOut; return () => { if (trips.out === runOut) trips.out = null; }; }, [runOut]);

  // ── Home: a hop, a dive into the page, and the page sinks back into the sheet ──
  const goHome = useCallback(() => {
    if (trip.current) return;
    const origin = site.get().origin ?? pageMeta(path)?.cell ?? 'work';
    const to = `/#${origin}`;
    const card = cardRef.current, right = rightRef.current, home = homeRef.current;
    const svg = home?.querySelector('svg');
    const clip = clipRef.current, A = aRef.current, B = bRef.current, ghost = ghostRef.current;
    if (reduced() || !card || !right || !home || !svg || !clip || !A || !B || !ghost) { site.set({ returning: true }); navigate(to); return; }
    clearOverlays();
    const r = svg.getBoundingClientRect(), N = { x: r.left, y: r.top, w: r.width, h: r.height };
    const E = window.innerHeight * 0.2, P = N.y + N.h + 22, H = window.innerHeight;
    const anims: Animation[] = [];
    const o = { duration: HOME_MS, fill: 'forwards' as FillMode };
    const sink: Keyframe[] = [
      { transform: 'translateY(0px)', easing: EASE_OUT },
      { transform: `translateY(${P}px)`, offset: at(200, HOME_MS) },
      { transform: `translateY(${P}px)`, offset: at(250, HOME_MS), easing: EASE_IN_OUT },
      { transform: `translateY(${E}px)` },
    ];
    for (const el of [A, B]) { el.toggleAttribute('data-ring', meta?.theme === 'dark'); el.style.setProperty('--ring', window.innerWidth >= 768 ? '1.05px' : '.9px'); }
    card.classList.add('pc-card-moving');
    anims.push(card.animate(sink, o));
    // The ghost rides with the page and fades in over it, becoming an empty
    // card before the page goes, so the switch to home happens under it.
    Object.assign(ghost.style, { display: 'block', zIndex: '41', height: `${H + 40}px` });
    anims.push(ghost.animate(sink.map((k, i) => ({ ...k, opacity: [0, 1, 1, 1][i] })), o));
    anims.push(right.animate([{ opacity: 1 }, { opacity: 0, offset: at(180, HOME_MS) }, { opacity: 0 }], o));

    // His path: hop up, then dive into the page and ride its edge down out of sight.
    const flight: Keyframe[] = [
      { transform: 'translateY(0px)', easing: EASE_OUT },
      { transform: 'translateY(-12px)', offset: at(150, HOME_MS), easing: EASE_IN },
      { transform: `translateY(${P + 8 - N.y}px)`, offset: at(380, HOME_MS), easing: EASE_IN_OUT },
      { transform: `translateY(${E + 8 - N.y}px)` },
    ];
    const wobble: Keyframe[] = [
      { transform: 'rotate(0deg) scale(1, 1)', easing: EASE_OUT },
      { transform: 'rotate(6deg) scale(.96, 1.08)', offset: at(150, HOME_MS) },
      { transform: 'rotate(-4deg) scale(1.03, .94)', offset: at(380, HOME_MS) },
      { transform: 'rotate(-4deg) scale(1.03, .94)' },
    ];
    // A goes under the page (clip box below the card); B on top for the hop.
    Object.assign(clip.style, { display: 'block', zIndex: '0', height: `${H}px` });
    for (const el of [A, B]) { place(el, N); anims.push(el.animate(flight, o), (el.firstElementChild as HTMLElement).animate(wobble, o)); }
    setFace(B, HOPPING); setFace(A, YANKED);
    B.style.zIndex = '42';
    // Swap to A once the page's edge has dropped below his chin.
    anims.push(B.animate(opacityStep(1, 0, at(110, HOME_MS)), o));
    home.style.visibility = 'hidden';

    trip.current = { dir: 'home', done: false, anims };
    // Navigate once the page is covered by the ghost; the ghost keeps sinking while home mounts.
    setTimeout(() => { site.set({ returning: true }); navigate(to); }, 220);
    anims[0].finished.then(() => { if (trip.current?.anims === anims) { trip.current.done = true; settleHome(); } }, () => {});
  }, [navigate, path, clearOverlays, settleHome]);

  // Route changed.
  useLayoutEffect(() => {
    if (isHome) { settleHome(); return; }
    site.set({ tldr: false });
    window.scrollTo(0, 0);
    pageScroll.set(0, 0);
    if (trip.current?.dir === 'out') {
      // The page mounts hidden under the ghost; it's revealed once the ghost is all the way up.
      if (cardRef.current) cardRef.current.style.visibility = 'hidden';
      if (homeRef.current) homeRef.current.style.visibility = 'hidden';
      settleOut();
    }
  }, [path, isHome, settleOut, settleHome]);

  // Scroll → the header's frosted band (--pc-scroll, 0..1) and the progress line (--pc-progress), set straight on the card so nothing re-renders.
  // Embedded pages report from their iframe (EmbeddedCaseStudy); pages that scroll the window report from here.
  const embedded = !!meta?.tldr?.embedded;
  useEffect(() => {
    const paint = ({ y, p }: { y: number; p: number }) => {
      const card = cardRef.current;
      if (!card) return;
      card.style.setProperty('--pc-scroll', String(Math.max(0, Math.min(1, (y - 24) / 72))));
      card.style.setProperty('--pc-progress', p.toFixed(4));
    };
    paint(pageScroll.get());
    const off = pageScroll.subscribe(paint);
    if (isHome || embedded) return off;
    const onScroll = () => {
      const el = document.scrollingElement ?? document.documentElement;
      pageScroll.set(el.scrollTop, Math.min(1, el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { off(); window.removeEventListener('scroll', onScroll); };
  }, [isHome, embedded, path]);

  const overlays = (
    <>
      <div ref={clipRef} className="pc-clip" aria-hidden="true">
        <div ref={aRef} className="pc-trav"><div className="pc-trav-in"><MiniHead hat={worn} /></div></div>
      </div>
      <div ref={ghostRef} className="pc-ghost" style={themeVars(hat)} aria-hidden="true" />
      <div ref={bRef} className="pc-trav" aria-hidden="true"><div className="pc-trav-in"><MiniHead hat={worn} /></div></div>
    </>
  );

  if (isHome) return <><Outlet />{overlays}</>;

  const showTldr = !!meta?.tldr && !meta.tldr.embedded && tldr;
  return (
    <>
      <div className="pc-root">
        {/* What shows above the page while it rises or sinks: the hero's backdrop. */}
        <div className="pc-behind" aria-hidden="true">
          <div className={`sh-glow${hat !== 'me' ? ' on' : ''}`} style={hat !== 'me' ? { '--sh-halo': PAL[hat].halo } as React.CSSProperties : undefined} />
        </div>
        <div ref={cardRef} className="pc-card" data-theme={meta?.theme} style={meta?.theme === 'dark' ? (hat === 'me' ? undefined : { '--primary': PAL[hat].accent, '--accent': PAL[hat].accent } as React.CSSProperties) : themeVars(hat)}>
          <div ref={contentRef} className="pc-content">
            {showTldr ? <TldrView meta={meta!} /> : <Outlet />}
          </div>
          {/* After a scroll, a frosted band keeps the bar readable over the page (opacity follows --pc-scroll). */}
          <div className="pc-band" aria-hidden="true" />
          {meta?.progress && <div className="pc-progress" aria-hidden="true" style={{ '--pc-progress-color': meta.progress } as React.CSSProperties} />}
          {/* The bar: no background, no border. Just his head and the page's controls. */}
          <header className="pc-bar">
            <button
              ref={homeRef}
              type="button"
              className="pc-home"
              aria-label="Home"
              onClick={goHome}
              onPointerEnter={e => { if (e.pointerType === 'mouse') setNavFace({ eyes: 'happy', mouth: 'smile' }); }}
              onPointerLeave={() => setNavFace(IDLE)}
            >
              <MiniHead hat={worn} face={navFace} />
            </button>
            <div ref={rightRef} className="pc-right">
              {meta?.tldr && (
                <NavSegments
                  label="Case study length"
                  options={[{ id: 'full', label: 'Full' }, { id: 'tldr', label: 'TL;DR' }]}
                  value={tldr ? 'tldr' : 'full'}
                  onChange={v => { site.set({ tldr: v === 'tldr' }); window.scrollTo(0, 0); }}
                />
              )}
              <div ref={setNavSlot} className="pc-slot" />
            </div>
          </header>
        </div>
      </div>
      {overlays}
    </>
  );
}
