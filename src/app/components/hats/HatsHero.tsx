import { memo, useEffect, useRef, useState } from 'react';
import { PORTRAIT_INNER, PORTRAIT_VIEWBOX } from './portrait';
import { PROPS, type HatId } from './props';
import { HATS, type WearableId } from './hatsData';
import { createHatsEngine, type HatsEngine } from './hatsEngine';
import './hats.css';

export interface HatsHeroProps {
  /** Hero is on screen, settled, overview closed, intro finished. */
  isActive: boolean;
  /** Overview zoom, 0 → 1. Hats hide for any value > 0. */
  overviewProgress: number;
  /** Park the hats off-screen until the hero first becomes active, then fly them in. */
  deferEntrance?: boolean;
  onHatChange?: (hat: WearableId) => void;
  onWear?: (hat: HatId) => void;
  /** Hands the engine to a host that drives extra behaviour (e.g. the sheet peek). */
  onEngine?: (engine: HatsEngine | null) => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The SVG and hat buttons are rendered once; after mount the engine owns them
// (attributes, transforms, classes). memo + stable markup keeps React from
// ever reconciling over the engine's changes.
const PORTRAIT_HTML = { __html: PORTRAIT_INNER };
const ICON_HTML = Object.fromEntries(HATS.map(h => [h.id, { __html: PROPS[h.id].svg(true) }]));

const Stage = memo(function Stage() {
  return (
    <div className="hh-stage">
      <svg
        className="hh-me"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={PORTRAIT_VIEWBOX}
        role="img"
        aria-label="Illustrated portrait of Shivam. Tap different parts of the face to change his expression."
        dangerouslySetInnerHTML={PORTRAIT_HTML}
      />
      {HATS.map(h => (
        <button key={h.id} type="button" className="hat" data-hat={h.id} aria-label={`Put on the ${h.hat}: ${h.name}`}>
          <svg viewBox={PROPS[h.id].vb} aria-hidden="true" dangerouslySetInnerHTML={ICON_HTML[h.id]} />
          <span className="tag" aria-hidden="true">{h.name}</span>
        </button>
      ))}
      <button type="button" className="hh-takeoff">Take hat off</button>
    </div>
  );
});

// ─── First-load coach marks ──────────────────────────────────────────────────
// Two hand-lettered labels with arrows (desktop) or one line (phones) that
// point at what is interactive. They show once per browser, fade on the first
// touch of anything, and give up on their own after a while.
const HINTS_KEY = 'hasSeenHeroHints';
const seenHints = () => { try { return !!localStorage.getItem(HINTS_KEY); } catch { return true; } };
const markHintsSeen = () => { try { localStorage.setItem(HINTS_KEY, '1'); } catch { /* storage blocked */ } };

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg className={`hh-arrow${flip ? ' flip' : ''}`} viewBox="0 0 72 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="hh-arrow-line" pathLength="1" d="M3 5 C 30 2, 58 12, 66 36" />
    <path className="hh-arrow-head" d="M57 33 L66 37 L69 27" />
  </svg>
);

function HeroHints({ show, away }: { show: boolean; away: boolean }) {
  return (
    <div className="hh-hints" aria-hidden="true" data-show={show && !away ? 'true' : 'false'}>
      <div className="hh-hint hh-hint--hat" style={{ '--d': '1.4s' } as React.CSSProperties}>
        <span className="hh-hint-text">Try a hat on him</span>
        <Arrow />
      </div>
      <div className="hh-hint hh-hint--specs" style={{ '--d': '2.1s' } as React.CSSProperties}>
        <span className="hh-hint-text">Don’t touch the specs</span>
        <Arrow flip />
      </div>
      <div className="hh-hint-line" style={{ '--d': '1.4s' } as React.CSSProperties}>
        Try a hat on him. Don’t touch the specs.
      </div>
    </div>
  );
}

export function HatsHero({ isActive, overviewProgress, deferEntrance = false, onHatChange, onWear, onEngine }: HatsHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HatsEngine | null>(null);
  const flownRef = useRef(!deferEntrance);
  const cbRef = useRef({ onHatChange, onWear, onEngine });
  cbRef.current = { onHatChange, onWear, onEngine };

  // Coach marks: pending until the hero first settles, then shown until the
  // visitor touches something (or ~14s pass). Never again after that.
  const [hint, setHint] = useState<'pending' | 'show' | 'gone'>(() => (seenHints() ? 'gone' : 'pending'));
  const hintRef = useRef(hint);
  hintRef.current = hint;
  useEffect(() => {
    if (isActive && hint === 'pending') { setHint('show'); markHintsSeen(); }
    if (hint !== 'show') return;
    const t = setTimeout(() => setHint('gone'), 14000);
    return () => clearTimeout(t);
  }, [isActive, hint]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const engine = createHatsEngine(root, {
      reducedMotion: prefersReducedMotion(),
      deferEntrance,
      onWear: hat => cbRef.current.onWear?.(hat),
      onInteract: () => { if (hintRef.current !== 'gone') { markHintsSeen(); setHint('gone'); } },
    });
    const off = engine.onHatChange(hat => cbRef.current.onHatChange?.(hat));
    engineRef.current = engine;
    cbRef.current.onEngine?.(engine);
    return () => { off(); cbRef.current.onEngine?.(null); engine.destroy(); engineRef.current = null; };
    // Created once per mount; later prop changes go through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { engineRef.current?.setOverview(overviewProgress); }, [overviewProgress]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setActive(isActive);
    if (isActive && !flownRef.current) { flownRef.current = true; engine.flyIn(); }
  }, [isActive]);

  return (
    <div ref={rootRef} className="hats-hero paused">
      <Stage />
      {hint !== 'gone' && <HeroHints show={hint === 'show'} away={!isActive} />}
    </div>
  );
}
