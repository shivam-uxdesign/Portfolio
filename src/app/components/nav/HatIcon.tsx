import { memo, useMemo } from 'react';
import { PROPS, type HatId } from '../hats/props';
import { PROP_BOX } from '../chrome/MiniHead';

// A prop drawn in the portrait's 800×1000 space, cropped to its own bounds
// (pre-measured: a getBBox per icon forced layout on every home mount).
export const HatIcon = memo(function HatIcon({ hat }: { hat: HatId }) {
  const html = useMemo(() => ({ __html: PROPS[hat].svg(false) }), [hat]);
  const [x0, y0, x1, y1] = PROP_BOX[hat];
  const w = x1 - x0, h = y1 - y0, p = Math.max(w, h) * 0.06;
  return (
    <svg viewBox={`${x0 - p} ${y0 - p} ${w + 2 * p} ${h + 2 * p}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g dangerouslySetInnerHTML={html} />
    </svg>
  );
});
