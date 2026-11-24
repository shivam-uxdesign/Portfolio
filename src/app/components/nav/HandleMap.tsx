import { useEffect, useRef, useState } from 'react';
import './nav.css';

// Navigation — the handle is the map. A 3×2 dot handle that sits under his chin
// (it follows his head from column to column, between his hands).
//   tap            → zoom out to every page (tap again to come back)
//   press + slide  → scrub across the map; the pill shows where you'll land; let go to go
//   page change    → the page's name drops out under the pill for a moment
const STEP = 26; // px of finger travel per column / row while scrubbing

interface Pos { row: number; col: number }

export function HandleMap({ current, labels, x, open, onToggle, onPick }: {
  current: Pos;
  labels: string[][];
  /** Centre of his head, in px from the left of the sheet. */
  x: number;
  open: boolean;
  onToggle: () => void;
  onPick: (p: Pos) => void;
}) {
  const [preview, setPreview] = useState<Pos | null>(null);
  const [flash, setFlash] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);

  // Name the page for a moment whenever it changes.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 1500);
    return () => clearTimeout(t);
  }, [current.row, current.col]);

  const shown = preview ?? current;
  const named = preview !== null || flash;

  const target = (e: React.PointerEvent): Pos => {
    const d = drag.current!;
    const dc = Math.round((e.clientX - d.x) / STEP), dr = Math.round((e.clientY - d.y) / STEP);
    return { row: Math.max(0, Math.min(1, current.row + dr)), col: Math.max(0, Math.min(2, current.col + dc)) };
  };

  return (
    <button
      type="button"
      className={`nav-handle${open ? ' open' : ''}${named ? ' named' : ''}${preview ? ' scrubbing' : ''}`}
      style={{ left: x }}
      aria-label={open ? 'Back to the page' : `Show all sections. You are on ${labels[current.row][current.col]}`}
      aria-expanded={open}
      // Keyboard (Enter/Space) arrives as a click with no pointer.
      onClick={e => { if (e.detail === 0) onToggle(); }}
      onPointerDown={e => {
        e.stopPropagation(); // not a sheet drag
        if (!e.isPrimary) return;
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* gone */ }
      }}
      onPointerMove={e => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId || open) return;
        e.stopPropagation();
        if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
        d.moved = true;
        const t = target(e);
        setPreview(p => (p && p.row === t.row && p.col === t.col ? p : t));
      }}
      onPointerUp={e => {
        const d = drag.current;
        e.stopPropagation();
        if (!d || d.id !== e.pointerId) { drag.current = null; return; }
        const t = d.moved && !open ? target(e) : null;
        drag.current = null;
        setPreview(null);
        if (!d.moved) { onToggle(); return; }
        if (t && (t.row !== current.row || t.col !== current.col)) onPick(t);
      }}
      onPointerCancel={() => { drag.current = null; setPreview(null); }}
    >
      <span className="nav-handle-pill" aria-hidden="true">
        <span className="nav-handle-grid">
          {[0, 1].flatMap(r => [0, 1, 2].map(c => <span key={`${r}-${c}`} className={r === shown.row && c === shown.col ? 'on' : ''} />))}
        </span>
      </span>
      <span className="nav-handle-name" aria-hidden="true">{labels[shown.row][shown.col]}</span>
    </button>
  );
}
