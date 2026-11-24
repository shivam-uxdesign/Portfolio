import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PROPS } from '../hats/props';
import type { HatId } from '../hats/props';
import './nav.css';

// Navigation idea 1 — the hat rack. One hat per page sits on a slim shelf at the
// bottom of the sheet; the current page's hat is on his head, so its peg is empty.
// Tap a hat and it flies up onto his head while the sheet glides to that page.

export interface ShelfItem { row: number; col: number; label: string; hat: HatId }

// A prop drawn in the portrait's 800×1000 space, cropped to its own bounds.
export const HatIcon = memo(function HatIcon({ hat }: { hat: HatId }) {
  const ref = useRef<SVGGElement>(null);
  const [vb, setVb] = useState('0 0 800 1000');
  const html = useMemo(() => ({ __html: PROPS[hat].svg(false) }), [hat]);
  useLayoutEffect(() => {
    try {
      const b = ref.current?.getBBox();
      if (b && b.width > 0) { const p = Math.max(b.width, b.height) * 0.06; setVb(`${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`); }
    } catch { /* not rendered yet */ }
  }, [hat]);
  return (
    <svg viewBox={vb} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g ref={ref} dangerouslySetInnerHTML={html} />
    </svg>
  );
});

export function HatShelf({ rows, current, away, onPick }: {
  rows: ShelfItem[][];
  current: { row: number; col: number };
  /** Slot whose hat is in flight (hidden until it lands). */
  away: string | null;
  onPick: (item: ShelfItem, from: DOMRect, svg: string) => void;
}) {
  return (
    <nav className="nav-shelf" aria-label="Sections">
      {rows.map((row, r) => (
        <div key={r} className="nav-group">
          {row.map(item => {
            const key = `${item.row}-${item.col}`;
            const here = item.row === current.row && item.col === current.col;
            return (
              <button
                key={key}
                type="button"
                className={`nav-hat${here ? ' here' : ''}${away === key ? ' away' : ''}`}
                aria-label={`Go to ${item.label}`}
                aria-current={here ? 'page' : undefined}
                data-label={item.label}
                onClick={e => {
                  if (here) return;
                  const svg = e.currentTarget.querySelector('svg');
                  onPick(item, (svg ?? e.currentTarget).getBoundingClientRect(), svg?.outerHTML ?? '');
                }}
              >
                <HatIcon hat={item.hat} />
                <span className="nav-peg" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// Fly a copy of the shelf hat to where his head will be. Resolves when it lands.
export function flyHat(svg: string, from: DOMRect, to: { x: number; y: number; w: number }, reduce: boolean): Promise<void> {
  if (reduce || !svg) return Promise.resolve();
  const el = document.createElement('div');
  el.className = 'nav-fly';
  el.innerHTML = svg;
  Object.assign(el.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.appendChild(el);
  const dx = to.x - (from.left + from.width / 2), dy = to.y - (from.top + from.height / 2);
  const k = Math.max(1, to.w / Math.max(1, from.width));
  const anim = el.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.45}px, ${dy * 0.62 - 70}px) scale(${1 + (k - 1) * 0.6}) rotate(-14deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(${k}) rotate(0deg)`, opacity: 1, offset: 0.92 },
    { transform: `translate(${dx}px, ${dy}px) scale(${k}) rotate(0deg)`, opacity: 0 },
  ], { duration: 560, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'forwards' });
  return anim.finished.then(() => el.remove(), () => el.remove());
}
