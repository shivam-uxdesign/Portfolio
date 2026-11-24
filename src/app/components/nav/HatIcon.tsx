import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PROPS, type HatId } from '../hats/props';

// A prop drawn in the portrait's 800×1000 space, cropped to its own bounds.
export const HatIcon = memo(function HatIcon({ hat }: { hat: HatId }) {
  const ref = useRef<SVGGElement>(null);
  const [vb, setVb] = useState('0 0 800 1000');
  const html = useMemo(() => ({ __html: PROPS[hat].svg(false) }), [hat]);
  useLayoutEffect(() => {
    try {
      const b = ref.current?.getBBox();
      if (b && b.width > 0) { const p = Math.max(b.width, b.height) * 0.06; setVb(`${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`); }
    } catch { /* not rendered yet */ }
  }, [hat]);
  return (
    <svg viewBox={vb} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g ref={ref} dangerouslySetInnerHTML={html} />
    </svg>
  );
});
