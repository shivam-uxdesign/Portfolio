import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { HatId } from '../hats/props';
import { HatIcon } from './HatIcon';
import './nav.css';

// The sheet's navigation: a 3×2 dot handle under his chin.
//   tap            → opens into a labelled map of every page (the page below makes room)
//   press + slide  → scrub across the dots; the name shows where you'll land; let go to go
//   page change    → the lit dot hops to its new spot and the page's name shows for a moment
const STEP = 26;              // px of finger travel per column / row while scrubbing
const DOT_X = 11, DOT_Y = 10; // dot pitch inside the pill

interface Pos { row: number; col: number }
export interface MapCell { label: string; hat: HatId }

export function PageMap({ current, cells, open, onToggle, onPick, onHeight }: {
  current: Pos;
  cells: MapCell[][];
  open: boolean;
  onToggle: (open: boolean) => void;
  onPick: (p: Pos) => void;
  /** Space the open map takes from the top of the sheet (0 when closed). */
  onHeight: (px: number) => void;
}) {
  const [preview, setPreview] = useState<Pos | null>(null);
  const [flash, setFlash] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const litRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shown = preview ?? current;

  // Page change: the lit dot stretches across to its new spot; the name shows briefly.
  const prev = useRef(current);
  useEffect(() => {
    const p = prev.current;
    prev.current = current;
    if (p.row === current.row && p.col === current.col) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 1500);
    const lit = litRef.current;
    if (lit && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const a = `translate(${p.col * DOT_X}px, ${p.row * DOT_Y}px)`, b = `translate(${current.col * DOT_X}px, ${current.row * DOT_Y}px)`;
      const mid = `translate(${(p.col + current.col) / 2 * DOT_X}px, ${(p.row + current.row) / 2 * DOT_Y}px) scale(${p.col !== current.col ? 2.2 : 1}, ${p.row !== current.row ? 2 : 1})`;
      lit.animate([{ transform: a }, { transform: mid, offset: 0.45 }, { transform: `${b} scale(1.25)`, offset: 0.8 }, { transform: b }], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)' });
    }
    return () => clearTimeout(t);
  }, [current.row, current.col]);

  // Tell the page how far to move down.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!open || !card) { onHeight(0); return; }
    const report = () => onHeight(card.offsetTop + card.offsetHeight + 14);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(card);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Opened from the keyboard: focus the current page's chip.
  const viaKeys = useRef(false);
  useEffect(() => {
    if (open && viaKeys.current) cardRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus({ preventScroll: true });
    viaKeys.current = false;
  }, [open]);

  const target = (e: React.PointerEvent): Pos => {
    const d = drag.current!;
    const dc = Math.round((e.clientX - d.x) / STEP), dr = Math.round((e.clientY - d.y) / STEP);
    return { row: Math.max(0, Math.min(1, current.row + dr)), col: Math.max(0, Math.min(2, current.col + dc)) };
  };

  return (
    <div className={`pm${open ? ' open' : ''}`}>
      <button
        type="button"
        className={`pm-handle${preview || flash ? ' named' : ''}${preview ? ' scrubbing' : ''}`}
        aria-label={open ? 'Close the page map' : `Page map. You are on ${cells[current.row][current.col].label}`}
        aria-expanded={open}
        onClick={e => { if (e.detail === 0) { viaKeys.current = true; onToggle(!open); } }}
        onPointerDown={e => {
          e.stopPropagation(); // not a sheet drag
          if (!e.isPrimary) return;
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* gone */ }
        }}
        onPointerMove={e => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          e.stopPropagation();
          if (open) return;
          if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
          d.moved = true;
          const t = target(e);
          setPreview(p => (p && p.row === t.row && p.col === t.col ? p : t));
        }}
        onPointerUp={e => {
          const d = drag.current;
          e.stopPropagation();
          drag.current = null;
          if (!d || d.id !== e.pointerId) return;
          const t = d.moved && !open ? target(e) : null;
          setPreview(null);
          if (!d.moved) { onToggle(!open); return; }
          if (t && (t.row !== current.row || t.col !== current.col)) onPick(t);
        }}
        onPointerCancel={() => { drag.current = null; setPreview(null); }}
      >
        <span className="pm-pill" aria-hidden="true">
          <span className="pm-dots">{Array.from({ length: 6 }, (_, i) => <span key={i} />)}</span>
          <span ref={litRef} className="pm-lit" style={{ transform: `translate(${shown.col * DOT_X}px, ${shown.row * DOT_Y}px)` }} />
        </span>
        <span className="pm-name" aria-hidden="true">{cells[shown.row][shown.col].label}</span>
      </button>

      <div ref={cardRef} className="pm-card" aria-hidden={!open}>
        <nav aria-label="Pages" ref={el => { if (el) el.inert = !open; }}>
          <ul className="pm-grid">
            {cells.flatMap((row, r) => row.map((cell, c) => {
              const here = r === current.row && c === current.col;
              return (
                <li key={`${r}-${c}`}>
                  <button type="button" className={`pm-chip${here ? ' here' : ''}`} aria-current={here ? 'page' : undefined}
                    onClick={() => { if (!here) onPick({ row: r, col: c }); onToggle(false); }}>
                    <span className="pm-chip-hat"><HatIcon hat={cell.hat} /></span>
                    <span className="pm-chip-label">{cell.label}</span>
                  </button>
                </li>
              );
            }))}
          </ul>
          <p className="pm-foot">Swipe between pages · tap my head to go home</p>
        </nav>
      </div>
    </div>
  );
}
