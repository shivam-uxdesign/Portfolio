import { useEffect, useId, useMemo, useRef } from 'react';
import { prefixedPortrait } from './portrait';
import { PROPS } from './props';
import { useHeroBridge } from './heroBridge';
import './hats.css';

// Shivam peeking up over the Work cell's bottom edge after you swipe up from
// Hero: the portrait cropped just under the glasses, wearing the current hat,
// two hands gripping the edge. Tapping the head goes back to Hero.

const VIEWBOX = '0 -24 800 518'; // everything above the glasses' lower edge (y≈494), plus headroom for tall hats
const VB_RATIO = 518 / 800;
const TIMELINE_MS = 700;
const HEAD_START = { transform: 'translateY(100%)' };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p: number, a: number, b: number) => cl((p - a) / (b - a));
const easeOutBack = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };

function handSvg(clipId: string, mirrored: boolean) {
  const finger = (x: number) => `<g class="fg" data-x="${x + 8}"><rect x="${x}" y="10" width="16" height="48" rx="8" fill="#F2B48C"/><path d="M${x + 2} 38 h12" stroke="#E3A07B" stroke-width="2" stroke-linecap="round"/><ellipse cx="${x + 8}" cy="18" rx="5" ry="4.5" fill="#F8D3BB"/></g>`;
  return `<svg class="wp-hand" viewBox="0 0 90 120" aria-hidden="true"${mirrored ? ' style="transform:scaleX(-1)"' : ''}><defs><clipPath id="${clipId}"><rect x="-40" y="-80" width="170" height="160"/></clipPath></defs>`
    + `<g clip-path="url(#${clipId})"><g class="hg"><rect x="8" y="48" width="74" height="68" rx="22" fill="#F2B48C"/><ellipse cx="44" cy="80" rx="24" ry="18" fill="#F7C9A8"/><rect x="72" y="60" width="16" height="36" rx="8" fill="#E9A985" transform="rotate(24 80 78)"/></g></g>`
    + `<g class="hg">${[10, 28, 46, 64].map(finger).join('')}</g></svg>`;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function WorkPeek({ onBackToHero }: { onBackToHero: () => void }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // Memoised {__html} objects: React must never re-apply this markup on a
  // re-render, or it would wipe the hat and finger transforms set imperatively.
  const portraitHtml = useMemo(() => ({ __html: prefixedPortrait(`wp${uid}-`) }), [uid]);
  const handsHtml = useMemo(() => ({ __html: handSvg(`wp${uid}-abv0`, false) + handSvg(`wp${uid}-abv1`, true) }), [uid]);

  const inWork = useHeroBridge(s => s.cell === 'work');
  const fromHero = useHeroBridge(s => s.prevCell === 'hero');
  const settled = useHeroBridge(s => s.settled);
  const inOverview = useHeroBridge(s => s.overview > 0);
  const hat = useHeroBridge(s => s.hat);

  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLButtonElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const playedRef = useRef(false);
  const isCloneRef = useRef(false);

  // Paint one frame of the peek timeline (p: 0 hidden → 1 fully peeking).
  const render = (p: number) => {
    progressRef.current = p;
    const head = headRef.current, handsEl = handsRef.current;
    if (!head || !handsEl) return;
    const rise = easeOutBack(seg(p, 0, 0.55));
    head.style.transform = `translateY(${((1 - rise) * 100).toFixed(2)}%)`;
    const look = seg(p, 0.3, 0.6);
    head.querySelectorAll('.pupil').forEach(pu => pu.setAttribute('transform', `translate(0 ${(-5 * look).toFixed(2)})`));
    // Hands: pop up with open palms, then fold the fingers over the edge.
    const a = seg(p, 0.45, 0.66), c = seg(p, 0.72, 1);
    handsEl.querySelectorAll<SVGSVGElement>('.wp-hand').forEach(el => {
      el.style.opacity = String(a);
      el.querySelectorAll('.hg').forEach(hg => hg.setAttribute('transform', `translate(0 ${(lerp(30, 0, a) + lerp(0, 26, c)).toFixed(1)}) rotate(${(-lerp(10, 0, a)).toFixed(1)} 45 110)`));
      el.querySelectorAll<SVGGElement>('.fg').forEach((f, j) => {
        const cj = seg(c, j * 0.12, 0.64 + j * 0.12), s = lerp(1, -0.62, cj), sp = (j - 1.5) * lerp(7, 0, seg(c, 0, 0.4));
        const x = f.dataset.x;
        f.setAttribute('transform', `rotate(${sp.toFixed(1)} ${x} 54) translate(0 54) scale(1 ${s.toFixed(3)}) translate(0 -54)`);
      });
    });
  };

  // Size the head and hands from the peek's own width.
  useEffect(() => {
    const root = rootRef.current, handsEl = handsRef.current;
    if (!root || !handsEl) return;
    isCloneRef.current = !!root.closest('[inert]');
    const place = () => {
      const W = root.offsetWidth, H = W * VB_RATIO;
      root.style.height = `${H}px`;
      const w = W * 0.27, h = w * 120 / 90;
      handsEl.querySelectorAll<SVGSVGElement>('.wp-hand').forEach((el, i) => Object.assign(el.style, {
        width: `${w}px`, height: `${h}px`,
        left: `${W / 2 + (i ? 1 : -1) * W * 0.3 - w / 2}px`,
        top: `${H - (80 / 120) * h}px`,
      }));
    };
    place();
    render(progressRef.current);
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wear the hero's current hat.
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    const props = head.querySelector('[data-part=props]');
    if (props) props.innerHTML = hat === 'me' ? '' : PROPS[hat].svg(false);
  }, [hat]);

  // Arrival from Hero → play once; leaving Work resets.
  useEffect(() => {
    if (!inWork) { playedRef.current = false; render(0); return; }
    if (isCloneRef.current || !fromHero || !settled || playedRef.current) return;
    playedRef.current = true;
    if (prefersReducedMotion()) { render(1); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = cl((now - t0) / TIMELINE_MS);
      render(p);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Interrupted (e.g. a pinch starts mid-rise): land on the final pose rather
    // than freezing half-way, since it only plays once per arrival.
    return () => { cancelAnimationFrame(raf); if (progressRef.current < 1) render(1); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inWork, fromHero, settled]);

  const visible = inWork && fromHero && !inOverview && !isCloneRef.current;
  const running = visible && settled;

  // Fingers drum on the edge every ~6s while he's peeking.
  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (progressRef.current < 1) return;
      handsRef.current?.querySelectorAll('.wp-hand').forEach((el, i) =>
        el.querySelectorAll('.fg').forEach((f, j) =>
          f.animate([{ opacity: 1 }, { opacity: 0.75 }, { opacity: 1 }], { duration: 200, delay: (3 - j) * 90 + i * 420 })));
    }, 6000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div
      ref={rootRef}
      className={`work-peek${visible ? '' : ' is-hidden'}${running ? '' : ' paused'}`}
      data-hat={hat}
    >
      <div className="wp-clip">
        <button
          ref={headRef}
          type="button"
          className="wp-head"
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          aria-label="Shivam is peeking. Back to Home"
          onClick={onBackToHero}
          style={HEAD_START}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEWBOX} aria-hidden="true" dangerouslySetInnerHTML={portraitHtml} />
        </button>
      </div>
      <div ref={handsRef} aria-hidden="true" dangerouslySetInnerHTML={handsHtml} />
    </div>
  );
}
