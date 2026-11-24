import { memo, useId, useMemo } from 'react';
import { prefixedPortrait } from '../hats/portrait';
import { PROPS } from '../hats/props';
import type { WearableId } from '../hats/hatsData';

// His head on its own (no body, no backdrop), cropped to head + hat, for the
// inner pages' home button and the trip there. Boxes measured with getBBox in
// the portrait's 800×1000 space.
const HEAD = [178, 130, 636, 628];
const PROP_BOX: Record<Exclude<WearableId, 'me'>, number[]> = {
  notes: [261, 147, 539, 308], party: [333, -22, 545, 223], helmet: [180, 164, 620, 688],
  beret: [214, 83, 583, 350], propeller: [244, 77, 556, 254], ninja: [232, 266, 692, 372], cat: [234, 66, 584, 334],
};

/** Crop box [x, y, w, h] in portrait units for a hat. */
export function headBox(hat: WearableId): [number, number, number, number] {
  const p = hat === 'me' ? HEAD : PROP_BOX[hat];
  const x0 = Math.min(HEAD[0], p[0]) - 8, y0 = Math.min(HEAD[1], p[1]) - 8;
  const x1 = Math.max(HEAD[2], p[2]) + 8, y1 = Math.max(HEAD[3], p[3]) + 8;
  return [x0, y0, x1 - x0, y1 - y0];
}

export interface Face { eyes?: 'open' | 'happy' | 'closed' | 'squint'; mouth?: string; brows?: 'none' | 'up' | 'down' }

export const MiniHead = memo(function MiniHead({ hat, face, className = '' }: { hat: WearableId; face?: Face; className?: string }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const html = useMemo(() => {
    const prefix = `mh${raw}-`;
    const props = hat === 'me' ? '' : PROPS[hat].svg(false);
    return prefixedPortrait(prefix).replace(`<g id="${prefix}props" data-part="props"></g>`, `<g id="${prefix}props" data-part="props">${props}</g>`);
  }, [hat, raw]);
  const [x, y, w, h] = headBox(hat);
  return (
    <svg
      className={`mh ${className}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      data-hat={hat}
      data-eyes={face?.eyes ?? 'open'}
      data-mouth={face?.mouth ?? 'grin'}
      data-brows={face?.brows ?? 'none'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
