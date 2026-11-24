import { tools, SplineLogo } from '../../pages/StackPage';
import './cells.css';

// "Built with" inside the home sheet. Fits its cell without scrolling:
// the 4×2 tool grid sizes itself to the space left (container units), and
// "Currently learning" sits in the header on wider screens, as a slim banner
// at the bottom on phones.
const SERIF = "'Playfair Display', Georgia, serif";

function Learning({ className = '' }: { className?: string }) {
  return (
    <div className={`stk-learn ${className}`}>
      <span className="stk-learn-icon" aria-hidden="true"><SplineLogo /></span>
      <span className="min-w-0 flex flex-col">
        <span className="stk-learn-eyebrow"><span className="stk-dot" aria-hidden="true" />Currently learning</span>
        <span className="stk-learn-title">Spline <span className="stk-learn-sub"><span className="md:hidden">· </span>3D and cinematic UI transitions</span></span>
      </span>
    </div>
  );
}

export function StackPanel() {
  return (
    <div className="stk w-full h-full flex flex-col bg-background px-1 md:px-10 lg:px-14 pt-1 md:pt-4 pb-[80px] md:pb-6">
      <header className="flex-none flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Tools &amp; Stack</p>
          <h2 className="text-[26px] md:text-[36px] leading-[1.05] text-foreground" style={{ letterSpacing: '-0.02em' }}>
            What I <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>build</span> with
          </h2>
          <p className="hidden md:block mt-2 text-[14px] leading-[1.5] max-w-xl text-muted-foreground">
            The tools that actually get used, day to day — from first sketch to shipped screen.
          </p>
        </div>
        <Learning className="hidden md:flex" />
      </header>

      <div className="stk-wrap flex-1 min-h-0 mt-5 md:mt-6">
        <ul className="stk-grid" aria-label="Tools I use">
          {tools.map(t => (
            <li key={t.name} className="stk-tile" tabIndex={0}>
              <span className="stk-face">
                <span className="stk-icon" style={{ backgroundColor: t.color }} aria-hidden="true"><span className="stk-logo">{t.logo}</span></span>
                <span className="stk-name">{t.name}</span>
                <span className="stk-cat">{t.category}</span>
              </span>
              {/* Wider screens: hover or focus shows what it's for. */}
              <span className="stk-note" style={{ backgroundColor: t.color, color: t.textOnColor ?? '#fff' }} aria-hidden="true">
                <span className="stk-note-name">{t.name}</span>
                <span className="stk-note-text">{t.note}</span>
              </span>
              <span className="sr-only">{t.category}: {t.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <Learning className="md:hidden flex mt-4" />
    </div>
  );
}
