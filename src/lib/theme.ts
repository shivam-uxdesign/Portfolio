import type React from 'react';
import { PAL, type WearableId } from '../app/components/hats/hatsData';

/** A picked hat's palette as CSS variables (light wash only). */
export function themeVars(hat: WearableId): React.CSSProperties | undefined {
  if (hat === 'me') return undefined;
  const p = PAL[hat];
  return {
    '--primary': p.accent,
    '--accent': p.accent,
    '--background': `color-mix(in oklab, ${p.card} 4%, #fff)`,
  } as React.CSSProperties;
}
