import './nav.css';

// Navigation idea 2 — the handle is the map. A 3×2 dot handle at the top of the
// sheet, under his chin: it shows where you are; tap it to zoom out to every page.
export function HandleMap({ current, open, onToggle }: { current: { row: number; col: number }; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={`nav-handle${open ? ' open' : ''}`} onClick={onToggle} aria-label={open ? 'Back to the page' : 'Show all sections'} aria-expanded={open}>
      <span className="nav-handle-grid" aria-hidden="true">
        {[0, 1].flatMap(r => [0, 1, 2].map(c => <span key={`${r}-${c}`} className={r === current.row && c === current.col ? 'on' : ''} />))}
      </span>
    </button>
  );
}
