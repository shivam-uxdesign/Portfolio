import { useState, type CSSProperties, type ReactNode } from 'react';
import { tools, SplineLogo } from '../../pages/StackPage';
import './stack.css';

// Built with: nine flip cards in a 3×3 grid — eight tools plus Spline, which
// I'm learning. Front: logo, name, category. Back (hover or focus on laptops,
// tap on phones): what I use it for.

interface Card { name: string; category: string; color: string; ink: string; logo: ReactNode; note: string; learning?: boolean }

const CARDS: Card[] = [
  ...tools.map(t => ({ name: t.name, category: t.category, color: t.color, ink: t.textOnColor ?? '#fff', logo: t.logo, note: t.note })),
  { name: 'Spline', category: 'Currently learning', color: 'var(--primary)', ink: '#fff', logo: <SplineLogo />, note: 'Learning it for 3D and cinematic UI transitions.', learning: true },
];

export function StackPanel() {
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <div className="stk w-full h-full bg-background">
      <header className="stk-head">
        <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">Built with</p>
        <h2 className="stk-title text-foreground">
          Tools I <span className="em">reach</span> for.
        </h2>
      </header>
      <div className="stk-wrap">
        <ul className="stk-grid" aria-label="Tools I use">
          {CARDS.map(c => {
            const on = flipped === c.name;
            return (
              <li key={c.name}>
                <button
                  type="button"
                  className={`stk-card${on ? ' flipped' : ''}${c.learning ? ' learning' : ''}`}
                  style={{ '--c': c.color, '--ink': c.ink } as CSSProperties}
                  aria-pressed={on}
                  aria-label={`${c.name}, ${c.category}. ${c.note}`}
                  onClick={() => setFlipped(on ? null : c.name)}
                  onBlur={() => { if (on) setFlipped(null); }}
                >
                  <span className="stk-inner" aria-hidden="true">
                    <span className="stk-front">
                      {/* Phones: a hint that the card turns over. */}
                      <svg className="stk-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></svg>
                      <span className="stk-logo"><span>{c.logo}</span></span>
                      <span className="stk-text">
                        <span className="stk-name">{c.name}</span>
                        <span className="stk-cat">{c.category}</span>
                      </span>
                    </span>
                    <span className="stk-back">
                      <span className="stk-back-name">{c.name}</span>
                      <span className="stk-note">{c.note}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
