// App-wide state that outlives the home sheet: the hat you picked, whether
// you knocked it off, where you came from, and the head's trip between the
// sheet and an inner page's top-left corner. In-memory only (no storage): a
// fresh visit starts bare-headed.
import { useSyncExternalStore } from 'react';
import type { WearableId } from '../app/components/hats/hatsData';

export interface Rect { x: number; y: number; w: number; h: number }

/** One trip of the head between the sheet and a page's corner. */
export interface Travel {
  id: number;
  dir: 'out' | 'home';
  /** Screen box of the head crop (see headBox) where the trip starts. */
  from: Rect;
  /** The card edge he hides behind (the sheet's top), in screen px. */
  edgeY: number;
  hat: WearableId;
}

export interface SiteState {
  /** Hat picked on the hero ('me' = none). Drives the theme. */
  hat: WearableId;
  /** Dragged his hat off in the sheet. */
  bare: boolean;
  /** What he's actually wearing (a page hat when none was picked). */
  worn: WearableId;
  /** Home cell the visitor left from, to land back on. */
  origin: string | null;
  travel: Travel | null;
  /** The next home mount is a return from an inner page. */
  returning: boolean;
  /** Inner pages: summary view on. */
  tldr: boolean;
}

let state: SiteState = { hat: 'me', bare: false, worn: 'me', origin: null, travel: null, returning: false, tldr: false };
const subs = new Set<() => void>();
let travelId = 0;

export const site = {
  get: () => state,
  set(patch: Partial<SiteState>) {
    let changed = false;
    for (const k in patch) if (state[k as keyof SiteState] !== patch[k as keyof SiteState]) { changed = true; break; }
    if (!changed) return;
    state = { ...state, ...patch };
    subs.forEach(fn => fn());
  },
  subscribe(fn: () => void) { subs.add(fn); return () => { subs.delete(fn); }; },
  startTravel(t: Omit<Travel, 'id'>) { site.set({ travel: { ...t, id: ++travelId } }); },
};

export function useSite<T>(sel: (s: SiteState) => T): T {
  return useSyncExternalStore(site.subscribe, () => sel(state), () => sel(state));
}
