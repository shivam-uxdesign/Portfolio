import { galleryImages } from './ImageGallery';
import './process-reel.css';

// Process & Practice as a slow, endless reel: two columns drifting in opposite
// directions, faded at the edges. Hover pauses it; reduced motion holds it still.
type Img = (typeof galleryImages)[number];

function Tile({ img }: { img: Img }) {
  return (
    <figure className="pr-tile" style={{ aspectRatio: img.heightPct >= 95 ? '3 / 4' : '4 / 3' }}>
      <img src={img.src} alt={img.title} loading="lazy" draggable={false} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
      <figcaption>
        <span className="pr-title">{img.title}</span>
        <span className="pr-tag">{img.tag}</span>
      </figcaption>
    </figure>
  );
}

function Column({ items, dir, seconds }: { items: Img[]; dir: 'up' | 'down'; seconds: number }) {
  // Rendered twice; the track moves by exactly one copy, so the loop is seamless.
  return (
    <div className="pr-col">
      <div className={`pr-track pr-${dir}`} style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map(copy => (
          <div key={copy} className="pr-set" aria-hidden={copy === 1 || undefined}>
            {items.map(img => <Tile key={img.title} img={img} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessReel({ className = '' }: { className?: string }) {
  const a = galleryImages;
  const b = [...galleryImages.slice(2), ...galleryImages.slice(0, 2)];
  return (
    <div className={`pr-root ${className}`} role="region" aria-label="Process and practice: photos of the desk, the sketchbook and work in progress">
      <div className="pr-head">
        <span className="pr-eyebrow">Process &amp; Practice</span>
        <span className="pr-sub">Brush before pixel.</span>
      </div>
      <div className="pr-cols">
        <Column items={a} dir="up" seconds={38} />
        <Column items={b} dir="down" seconds={46} />
      </div>
    </div>
  );
}

// Below lg: the same photos as a short filmstrip sliding sideways on its own.
export function ProcessStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`ps2-root ${className}`} role="region" aria-label="Process and practice: photos of the desk, the sketchbook and work in progress">
      <div className="pr-head">
        <span className="pr-eyebrow">Process &amp; Practice</span>
        <span className="pr-sub">Brush before pixel.</span>
      </div>
      <div className="ps2-window">
        <div className="ps2-track">
          {[0, 1].map(copy => (
            <div key={copy} className="ps2-set" aria-hidden={copy === 1 || undefined}>
              {galleryImages.map(img => (
                <figure key={img.title} className="ps2-tile" style={{ aspectRatio: img.heightPct >= 95 ? '4 / 5' : '4 / 3' }}>
                  <img src={img.src} alt={copy === 0 ? img.title : ''} loading="lazy" draggable={false} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
                  <figcaption>{img.title}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
