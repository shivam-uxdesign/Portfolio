import { useEffect, useState } from 'react';
import './made.css';

// Cool stuff: things I've made by hand, away from screens. Photos in public/made/.
// r: width / height of the photo, so a row keeps one height without cropping anything.
interface Shot { file: string; r: number; alt: string }
interface Craft { name: string; line: string; shots: Shot[] }

const CRAFTS: Craft[] = [
  { name: 'Macramé', line: 'Wall hangings and plant hangers, knotted by hand.', shots: [
    { file: 'macrame-three-panels', r: 0.750, alt: 'A large three-panel macramé hanging in pink, outdoors' },
    { file: 'macrame-leaf', r: 0.751, alt: 'A macramé net hanging with a leaf tucked in' },
    { file: 'macrame-with-planters', r: 0.750, alt: 'A macramé hanging between two small hanging planters' },
    { file: 'macrame-plant-hanger', r: 0.750, alt: 'A macramé plant hanger holding a glass globe, with dried flowers' },
    { file: 'macrame-figurine', r: 1.333, alt: 'A short macramé hanging with a little figurine planter' },
  ] },
  { name: 'Dyed yarn', line: 'Yarn I dyed myself, skein by skein.', shots: [
    { file: 'dye-jars', r: 0.535, alt: 'Dye jars beside a ladder of dyed yarn samples' },
    { file: 'dye-four-skeins', r: 1.333, alt: 'Four dyed skeins: mustard, deep green, pink and rust' },
    { file: 'dye-green', r: 0.751, alt: 'A skein of green yarn' },
    { file: 'dye-teal', r: 0.751, alt: 'A skein of teal yarn over my hand' },
  ] },
  { name: 'Handloom', line: 'A pattern woven into the cloth, one pass at a time.', shots: [
    { file: 'loom-weaving', r: 1.774, alt: 'My hands weaving a pattern on a handloom' },
    { file: 'loom-pattern', r: 0.751, alt: 'Blue cloth with a woven pattern, still on the loom' },
  ] },
  { name: 'Knitting', line: 'From the needles to a keychain.', shots: [
    { file: 'knitting-needles', r: 0.750, alt: 'A small knitted piece still on the needle' },
    { file: 'knitting-keychain', r: 0.800, alt: 'The finished knitted keychain with my keys' },
  ] },
  { name: 'Painted stone', line: 'A stone, a face, and the same glasses as mine.', shots: [
    { file: 'painted-stone', r: 1.332, alt: 'A stone painted with a smiling face with glasses, in a frame' },
  ] },
];

const src = (s: Shot) => `/made/${s.file}.webp`;

export function CoolStuffPage() {
  const [open, setOpen] = useState<Shot | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <main className="md">
      <p className="md-label">Off Figma · Cool stuff</p>
      <h1 className="md-title">Things I’ve <em>made</em>.</h1>
      <p className="md-lede">Away from screens: macramé, yarn I dyed, cloth off a handloom, a little knitting and a painted stone.</p>

      {CRAFTS.map(c => (
        <section key={c.name} className="md-sec" aria-label={c.name}>
          <h2 className="md-h2">{c.name}</h2>
          <p className="md-sub">{c.line}</p>
          <ul className="md-grid" role="list">
            {c.shots.map(s => (
              <li key={s.file} style={{ '--r': s.r } as React.CSSProperties}>
                <button type="button" className="md-tile" onClick={() => setOpen(s)} aria-label={`${s.alt}. Enlarge`}>
                  <img src={src(s)} alt={s.alt} loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {open && (
        <div className="md-view" role="dialog" aria-modal="true" aria-label={open.alt} onClick={() => setOpen(null)}>
          <button type="button" className="md-close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <img src={src(open)} alt={open.alt} onClick={e => e.stopPropagation()} />
          <p>{open.alt}</p>
        </div>
      )}
    </main>
  );
}
