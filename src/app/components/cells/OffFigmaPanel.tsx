import type { ReactNode } from 'react';
import { Link } from 'react-router';
import './offfigma.css';

// Off Figma: six cover cards in two rows — things I make, things I'm into.
// Each card previews its page with a simple emblem (not the page's content).
const SERIF = "'Playfair Display', Georgia, serif";

interface Interest { label: string; line: string; to: string; color: string; tint: string; emblem: ReactNode }

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const EMBLEM = {
  comics: (
    <svg viewBox="0 0 48 48" {...S}><rect x="6" y="8" width="16" height="14" rx="2" /><rect x="26" y="8" width="16" height="14" rx="2" /><rect x="6" y="26" width="36" height="14" rx="2" /><path d="M31 29h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4l-3 3v-3h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill="currentColor" stroke="none" opacity=".35" /></svg>
  ),
  drawings: (
    <svg viewBox="0 0 48 48" {...S}><path d="M8 34c6-10 11-16 16-14s-4 12 2 13 9-10 14-17" strokeWidth="4" /><circle cx="40" cy="10" r="2.5" fill="currentColor" stroke="none" /></svg>
  ),
  cool: (
    <svg viewBox="0 0 48 48" {...S}>{[10, 19, 28, 37].flatMap(x => [10, 19, 28, 37].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="currentColor" stroke="none" opacity=".45" />))}<rect x="12" y="14" width="14" height="14" rx="3" /><circle cx="32" cy="31" r="7" /></svg>
  ),
  books: (
    <svg viewBox="0 0 48 48" {...S}><rect x="9" y="12" width="7" height="28" rx="1.5" /><rect x="18" y="8" width="7" height="32" rx="1.5" /><rect x="29" y="12" width="7" height="28" rx="1.5" transform="rotate(14 32 40)" /><path d="M6 41h36" /></svg>
  ),
  music: (
    <svg viewBox="0 0 48 48" {...S}><circle cx="22" cy="26" r="15" /><circle cx="22" cy="26" r="9" opacity=".4" /><circle cx="22" cy="26" r="2.5" fill="currentColor" stroke="none" /><path d="M41 6l-6 4-6 14" /></svg>
  ),
  movies: (
    <svg viewBox="0 0 48 48" {...S}><rect x="6" y="11" width="36" height="26" rx="3" /><path d="M6 17h36M6 31h36" />{[11, 18, 25, 32, 39].map(x => <g key={x}><rect x={x - 1.5} y="12.5" width="3" height="3" rx=".5" fill="currentColor" stroke="none" /><rect x={x - 1.5} y="32.5" width="3" height="3" rx=".5" fill="currentColor" stroke="none" /></g>)}</svg>
  ),
};

const ROWS: { label: string; items: Interest[] }[] = [
  { label: 'Made by me', items: [
    { label: 'Comics', line: "I've written", to: '/comics', color: '#7C4DFF', tint: '#EDE7F6', emblem: EMBLEM.comics },
    { label: 'Drawings', line: "I've made", to: '/drawings', color: '#D81B7A', tint: '#FCE4EC', emblem: EMBLEM.drawings },
    { label: 'Cool stuff', line: "I've built", to: '/cool-stuff', color: '#EF6C00', tint: '#FFF3E0', emblem: EMBLEM.cool },
  ] },
  { label: 'Currently into', items: [
    { label: 'Books', line: "I'm reading", to: '/books', color: '#689F38', tint: '#F1F8E9', emblem: EMBLEM.books },
    { label: 'Music', line: "I'm listening to", to: '/music', color: '#1976D2', tint: '#E3F2FD', emblem: EMBLEM.music },
    { label: 'Movies', line: "I'm watching", to: '/movies', color: '#00838F', tint: '#E0F7FA', emblem: EMBLEM.movies },
  ] },
];

export function OffFigmaPanel() {
  return (
    <div className="of w-full h-full bg-background">
      <header className="of-head">
        <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">Off Figma</p>
        <h2 className="of-title text-foreground">
          What I <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>make</span>, and what I'm into.
        </h2>
      </header>
      {ROWS.map(row => (
        <section key={row.label} className="of-row" aria-label={row.label}>
          <p className="of-row-label">{row.label}</p>
          <ul className="of-cards">
            {row.items.map(it => (
              <li key={it.label}>
                <Link to={it.to} className="of-card" style={{ '--c': it.color, '--t': it.tint } as React.CSSProperties} aria-label={`${it.label}, ${it.line}`} draggable={false}>
                  <span className="of-emblem" aria-hidden="true">{it.emblem}</span>
                  <span className="of-text">
                    <span className="of-name">{it.label}</span>
                    <span className="of-line">{it.line}</span>
                    <span className="of-open" aria-hidden="true">Open →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
