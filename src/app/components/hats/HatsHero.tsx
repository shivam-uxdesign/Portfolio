import { memo, useEffect, useRef } from 'react';
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
    </div>
  );
});

export function HatsHero({ isActive, overviewProgress, deferEntrance = false, onHatChange, onWear, onEngine }: HatsHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HatsEngine | null>(null);
  const flownRef = useRef(!deferEntrance);
  const cbRef = useRef({ onHatChange, onWear, onEngine });
  cbRef.current = { onHatChange, onWear, onEngine };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const engine = createHatsEngine(root, {
      reducedMotion: prefersReducedMotion(),
      deferEntrance,
      onWear: hat => cbRef.current.onWear?.(hat),
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
    </div>
  );
}
