// A project thumbnail in three shapes (master 4:3, square, wide). The slot it sits in decides which
// one shows (container query on its own box), so the subject is never cropped:
//   wide (>= 1.75:1)  → small tiles          square (<= 1.15:1) → phone / floating cards
// `src` is the master, e.g. /case-studies/thumbs/design-kit.webp; the others share its name.
export function ThumbImg({ src, onError }: { src: string; onError?: React.ReactEventHandler<HTMLImageElement> }) {
  const base = src.replace(/\.webp$/, '');
  return (
    <span className="th-box" aria-hidden="true">
      <img className="th-m" src={src} alt="" loading="lazy" draggable={false} onError={onError} />
      <img className="th-s" src={`${base}-sq.webp`} alt="" loading="lazy" draggable={false} onError={onError} />
      <img className="th-w" src={`${base}-wide.webp`} alt="" loading="lazy" draggable={false} onError={onError} />
    </span>
  );
}
