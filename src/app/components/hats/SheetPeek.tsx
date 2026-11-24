import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { prefixedPortrait } from './portrait';
import { PROPS } from './props';
import type { WearableId } from './hatsData';
import { VIEWBOX, VB_RATIO, lerp, cl, seg, easeOutBack, handSvg, prefersReducedMotion } from './WorkPeek';
import './hats.css';

// Shivam hanging on the sheet's top edge. He is the sheet's home button:
// tap him and the sheet drops back to the full hero.
//
//  • progress 0→1 is the rise (driven live by the sheet drag, or by a timeline
//    on a deep link): brows jump up in surprise, palms pop, fingers fold over.
//  • col 0/1/2 puts him far-left / centre / far-right; changing it plays a
//    hand-over-hand shuffle along the edge.
//  • While active he blinks, drums, follows the pointer, and every 20–30s does
//    a small idle bit (glasses nudge, glance at you, double blink).

// Far-left / centre / far-right, keeping his hands inside the screen.
const COL_X = ['calc(var(--pw) / 2 + 18px)', '50%', 'calc(100% - var(--pw) / 2 - 18px)'];
const SHUFFLE_MS = 460;

export interface SheetPeekProps {
  progress: number;
  col: number;
  hat: WearableId;
  /** Idle life + CSS animations run only while true. */
  active: boolean;
  /** Show the "Home" hint bubble (first deep-link arrival). */
  showTip: boolean;
  onHome: () => void;
  /**
   * The hero portrait itself is the visible head (it slides behind the sheet).
   * This component then only draws the gripping hands and an invisible tap
   * target the size of the portrait.
   */
  handsOnly?: boolean;
  /** Width of the visible head in px (the portrait's width) when handsOnly. */
  width?: number;
}

export function SheetPeek({ progress, col, hat, active, showTip, onHome, handsOnly = false, width }: SheetPeekProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const pre = `sp${uid}-`;
  const portraitHtml = useMemo(() => ({ __html: prefixedPortrait(pre) }), [pre]);
  const handsHtml = useMemo(() => ({ __html: handSvg(`${pre}abv0`, false) + handSvg(`${pre}abv1`, true) }), [pre]);
  const reduce = useMemo(prefersReducedMotion, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLButtonElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const gripRef = useRef(1);            // 1 = fingers folded over the edge, 0 = let go
  const lookRef = useRef({ x: 0, y: 4 }); // where the pupils point (resting: down at the content)
  const [hover, setHover] = useState(false);

  const q = <T extends Element>(part: string) => headRef.current?.querySelector<T>(`[data-part="${part}"]`) ?? null;

  const paintPupils = () => {
    const p = progressRef.current, k = seg(p, 0.3, 0.7);
    const { x, y } = lookRef.current;
    headRef.current?.querySelectorAll('.pupil').forEach(pu => pu.setAttribute('transform', `translate(${(x * k).toFixed(2)} ${(y * k).toFixed(2)})`));
  };

  const paint = () => {
    const head = headRef.current, handsEl = handsRef.current;
    if (!head || !handsEl) return;
    const p = progressRef.current;
    const rise = easeOutBack(seg(p, 0, 0.55));
    head.style.transform = `translateY(${((1 - rise) * 100).toFixed(2)}%)`;
    // Surprise: brows jump while he's coming up, settle as he grips.
    const surprise = Math.sin(Math.PI * seg(p, 0.15, 0.95));
    for (const b of ['brow-l', 'brow-r']) q<SVGGElement>(b)?.setAttribute('transform', `translate(0 ${(-16 * surprise).toFixed(1)})`);
    paintPupils();
    const a = seg(p, 0.45, 0.66), c = seg(p, 0.72, 1) * gripRef.current;
    handsEl.querySelectorAll<SVGSVGElement>('.wp-hand').forEach(el => {
      el.style.opacity = String(a);
      el.querySelectorAll('.hg').forEach(hg => hg.setAttribute('transform', `translate(0 ${(lerp(30, 0, a) + lerp(0, 26, c)).toFixed(1)}) rotate(${(-lerp(10, 0, a)).toFixed(1)} 45 110)`));
      el.querySelectorAll<SVGGElement>('.fg').forEach((f, j) => {
        const cj = seg(c, j * 0.12, 0.64 + j * 0.12), s = lerp(1, -0.62, cj), sp = (j - 1.5) * lerp(7, 0, seg(c, 0, 0.4));
        f.setAttribute('transform', `rotate(${sp.toFixed(1)} ${f.dataset.x} 54) translate(0 54) scale(1 ${s.toFixed(3)}) translate(0 -54)`);
      });
    });
  };

  // Size head + hands from the root's width.
  useEffect(() => {
    const root = rootRef.current, handsEl = handsRef.current;
    if (!root || !handsEl) return;
    const place = () => {
      const W = root.offsetWidth, H = W * VB_RATIO;
      root.style.height = `${H}px`;
      const w = W * 0.27, h = w * 120 / 90;
      handsEl.querySelectorAll<SVGSVGElement>('.wp-hand').forEach((el, i) => Object.assign(el.style, {
        width: `${w}px`, height: `${h}px`, left: `${W / 2 + (i ? 1 : -1) * W * 0.3 - w / 2}px`, top: `${H - (80 / 120) * h}px`,
      }));
    };
    place(); paint();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { progressRef.current = progress; paint(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [progress]);

  // Hat: swap with a little drop-in.
  const firstHat = useRef(true);
  useEffect(() => {
    const props = q<SVGGElement>('props');
    if (!props) return;
    props.innerHTML = hat === 'me' ? '' : PROPS[hat].svg(false);
    if (!firstHat.current && !reduce && hat !== 'me') {
      props.animate([{ transform: 'translateY(-90px)', opacity: 0 }, { transform: 'translateY(6px)', opacity: 1, offset: 0.65 }, { transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' });
    }
    firstHat.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hat]);

  // Column change: glance the way he's going, let go, slide, re-grip.
  const firstCol = useRef(true);
  const prevCol = useRef(col);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.left = COL_X[col] ?? '50%';
    if (firstCol.current || reduce || progressRef.current < 1) { firstCol.current = false; prevCol.current = col; return; }
    const dir = Math.sign(col - prevCol.current) || 1;
    prevCol.current = col;
    lookRef.current = { x: 7 * dir, y: 1 }; paintPupils();
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = cl((now - t0) / SHUFFLE_MS);
      // Fingers lift off early, hang on mid-slide, fold back on arrival.
      gripRef.current = t < 0.2 ? 1 - t / 0.2 * 0.7 : t < 0.75 ? 0.3 + 0.15 * Math.sin((t - 0.2) / 0.55 * Math.PI * 2) : 0.3 + (t - 0.75) / 0.25 * 0.7;
      paint();
      if (t < 1) raf = requestAnimationFrame(step);
      else { gripRef.current = 1; lookRef.current = { x: 0, y: 4 }; paint(); }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); gripRef.current = 1; paint(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col]);

  // Pupils follow the pointer while active.
  useEffect(() => {
    if (!active || reduce || handsOnly) return;
    let idleBack: ReturnType<typeof setTimeout> | null = null;
    const onMove = (e: PointerEvent) => {
      const head = headRef.current;
      if (!head || progressRef.current < 1) return;
      const r = head.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.8;
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 260);
      lookRef.current = { x: dx / d * 7 * m, y: dy / d * 5 * m };
      paintPupils();
      if (idleBack) clearTimeout(idleBack);
      idleBack = setTimeout(() => { lookRef.current = { x: 0, y: 4 }; paintPupils(); }, 2500);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); if (idleBack) clearTimeout(idleBack); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Idle bits every 20–30s, plus finger drumming every ~6s.
  useEffect(() => {
    if (!active || reduce) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const bits = [
      () => q<SVGGElement>('glasses')?.animate([{ transform: 'none' }, { transform: 'translateY(-9px)' }, { transform: 'translateY(-9px)', offset: 0.6 }, { transform: 'none' }], { duration: 700, easing: 'ease-in-out' }),
      () => { lookRef.current = { x: 0, y: 0 }; paintPupils(); setTimeout(() => { lookRef.current = { x: 0, y: 4 }; paintPupils(); }, 1400); },
      () => headRef.current?.querySelectorAll('.eye').forEach(e => e.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' }], { duration: 520 })),
    ];
    const schedule = () => { if (handsOnly) return; t = setTimeout(() => { if (progressRef.current >= 1) bits[Math.floor(Math.random() * bits.length)](); schedule(); }, 20000 + Math.random() * 10000); };
    schedule();
    const drum = setInterval(() => {
      if (progressRef.current < 1) return;
      handsRef.current?.querySelectorAll('.wp-hand').forEach((el, i) =>
        el.querySelectorAll('.fg').forEach((f, j) => f.animate([{ opacity: 1 }, { opacity: 0.75 }, { opacity: 1 }], { duration: 200, delay: (3 - j) * 90 + i * 420 })));
    }, 6000);
    return () => { if (t) clearTimeout(t); clearInterval(drum); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Hover: brows up (the paint loop resets them on the next progress change).
  useEffect(() => {
    if (progressRef.current < 1) return;
    for (const b of ['brow-l', 'brow-r']) q<SVGGElement>(b)?.setAttribute('transform', hover ? 'translate(0 -12)' : 'translate(0 0)');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover]);

  const tipSide = col === 2 ? 'left' : 'right';
  const visible = progress > 0.02;

  return (
    <div
      ref={rootRef}
      className={`work-peek sheet-peek${visible ? '' : ' is-hidden'}${active ? '' : ' paused'}${handsOnly ? ' hands-only' : ''}`}
      data-hat={hat}
      style={handsOnly && width ? ({ '--pw': `${width}px` } as React.CSSProperties) : undefined}
    >
      <div className="wp-clip">
        <button
          ref={headRef}
          type="button"
          className="wp-head"
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          aria-label="Home"
          onClick={onHome}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          style={{ transform: 'translateY(100%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEWBOX} aria-hidden="true" dangerouslySetInnerHTML={portraitHtml} />
        </button>
      </div>
      <div ref={handsRef} aria-hidden="true" dangerouslySetInnerHTML={handsHtml} />
      <span className={`sp-tip sp-tip-${tipSide}${(showTip || hover) && progress >= 1 ? ' on' : ''}`} aria-hidden="true">Home</span>
    </div>
  );
}
