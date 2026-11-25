import { useEffect, useMemo, useState } from 'react';
import './drawings.css';

// Drawings: my own work, each in the same mount. Files are in public/drawings/, cropped and lightly levelled from photos.
// ratio: height / width of the image file, so the wall can balance its columns before anything loads.
interface Drawing { file: string; title: string; medium: string; ratio: number }

const DRAWINGS: Drawing[] = [
  { file: 'self-portrait-comic', title: 'On camera, three moods', medium: 'Ink on paper', ratio: 1400 / 915 },
  { file: 'me-and-the-cat', title: 'An unwilling cat', medium: 'Digital, watercolour brushes', ratio: 1270 / 890 },
  { file: 'pencils-and-sharpeners', title: 'Pencils and sharpeners', medium: 'Paint on paper', ratio: 662 / 656 },
  { file: 'boy-with-a-rat', title: 'Look what I found', medium: 'Ink and watercolour', ratio: 1350 / 1060 },
  { file: 'from-the-window', title: 'From the window', medium: 'Watercolour', ratio: 1400 / 1175 },
];

const src = (d: Drawing) => `/drawings/${d.file}.webp`;

// Columns by width; each drawing goes to the shortest column so far, in list order.
const colsFor = (w: number) => (w >= 900 ? 3 : w >= 600 ? 2 : 1);
function useCols() {
  const [n, setN] = useState(() => colsFor(window.innerWidth));
  useEffect(() => {
    const on = () => setN(colsFor(window.innerWidth));
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  return n;
}
function balance(items: Drawing[], n: number) {
  const cols: Drawing[][] = Array.from({ length: n }, () => []);
  const h = new Array(n).fill(0);
  for (const d of items) {
    const i = h.indexOf(Math.min(...h));
    cols[i].push(d);
    h[i] += d.ratio + 0.35; // + mount and caption, in image widths
  }
  return cols;
}

export function DrawingsPage() {
  const [open, setOpen] = useState<Drawing | null>(null);
  const n = useCols();
  const cols = useMemo(() => balance(DRAWINGS, n), [n]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <main className="dr">
      <p className="dr-label">Off Figma · Drawings</p>
      <h1 className="dr-title">Things I’ve <em>drawn</em>.</h1>
      <p className="dr-lede">
        Ink, watercolour, paint and a bit of digital. Fine arts at JJ School of Art, and I never stopped.
        More on Instagram at <a href="https://www.instagram.com/shivamrelax/" target="_blank" rel="noopener noreferrer">@shivamrelax</a>.
      </p>

      <div className="dr-wall">
        {cols.map((col, c) => (
          <ul key={c} className="dr-col" role="list">
            {col.map(d => (
              <li key={d.file} className="dr-piece">
                <button type="button" className="dr-mount" onClick={() => setOpen(d)} aria-label={`${d.title}, ${d.medium}. Enlarge`}>
                  <img src={src(d)} alt={d.title} loading="lazy" style={{ aspectRatio: `1 / ${d.ratio}` }} />
                </button>
                <p className="dr-cap"><b>{d.title}</b><span>{d.medium}</span></p>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {open && (
        <div className="dr-view" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <button type="button" className="dr-close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <figure onClick={e => e.stopPropagation()}>
            <img src={src(open)} alt={open.title} />
            <figcaption><b>{open.title}</b>{open.medium}</figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
