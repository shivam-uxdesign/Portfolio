import { useRef, useState } from 'react';
import { galleryImages } from '../ImageGallery';
import './about.css';

// About: one sentence, a small stack of prints, three facts.
// Nothing moves on its own; tap the stack to shuffle the top print to the back.
const SERIF = "'Playfair Display', Georgia, serif";

const FACTS = [
  { k: 'Trained', v: 'B.FA, JJ School of Art · M.Des, NIFT Delhi' },
  { k: 'Now', v: 'Product designer at Rupyy, from research to a shipped, adopted system' },
  { k: 'Off the clock', v: 'Riding, cooking, learning 3D in Spline, and every cat I meet' },
];

// Resting pose for each depth in the stack (top first). Only three show.
const POSE = [
  { r: -2.5, x: 0, y: 0 },
  { r: 4.5, x: 7, y: 3 },
  { r: -7, x: -8, y: 7 },
];
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const poseOf = (d: number) => POSE[Math.min(d, POSE.length - 1)];
const tf = (d: number) => { const p = poseOf(d); return `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`; };

function PrintStack() {
  const [order, setOrder] = useState(() => galleryImages.map((_, i) => i));
  const busy = useRef(false);
  const refs = useRef<(HTMLElement | null)[]>([]);

  const shuffle = () => {
    if (busy.current) return;
    const top = order[0];
    const el = refs.current[top];
    const next = [...order.slice(1), top];
    if (!el || reduced()) { setOrder(next); return; }
    busy.current = true;
    // Slide the top print out to the side, tuck it to the back, bring it home.
    el.animate([{ transform: tf(0) }, { transform: 'translate(68%, -6%) rotate(14deg)' }], { duration: 230, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' })
      .onfinish = function (this: Animation) {
        setOrder(next);
        requestAnimationFrame(() => {
          this.cancel();
          el.animate([{ transform: 'translate(68%, -6%) rotate(14deg)' }, { transform: tf(next.length - 1) }], { duration: 320, easing: 'cubic-bezier(.2,.8,.3,1)' })
            .onfinish = () => { busy.current = false; };
        });
      };
  };

  const topImg = galleryImages[order[0]];
  return (
    <button type="button" className="ab-stack" onClick={shuffle} aria-label={`Photo: ${topImg.title}. Show the next photo`}>
      {order.map((idx, depth) => {
        const img = galleryImages[idx];
        return (
          <figure
            key={img.title}
            ref={el => { refs.current[idx] = el; }}
            className="ab-print"
            style={{ zIndex: order.length - depth, transform: tf(depth), opacity: depth < POSE.length ? 1 : 0 }}
            aria-hidden={depth !== 0}
          >
            <span className="ab-photo">
              <img src={img.src} alt="" loading={depth < 2 ? 'eager' : 'lazy'} draggable={false} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
            </span>
            <figcaption style={{ fontFamily: SERIF }}>{img.title}</figcaption>
          </figure>
        );
      })}
    </button>
  );
}

export function AboutPanel() {
  return (
    <div className="ab w-full h-full bg-background">
      <div className="ab-text">
        <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">About</p>
        <h2 className="ab-title text-foreground">
          Designer by{' '}
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>training</span>,
          {' '}problem solver by instinct, cat lover by default.
        </h2>
        <dl className="ab-facts">
          {FACTS.map(f => (
            <div key={f.k} className="ab-fact">
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="ab-media">
        <PrintStack />
        <p className="ab-hint">Off the clock · tap to shuffle</p>
      </div>
    </div>
  );
}
