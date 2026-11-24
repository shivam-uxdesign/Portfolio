// A tiny external store shared by Home (writer) and the hero / Work peek
// (readers). It exists so the hats can follow grid state — which cell is
// settled, the overview zoom, the current hat — without threading props
// through the memoised WorldCells, which would re-render all 25 cells on
// every frame of a pinch.
import { createContext, useContext, useSyncExternalStore } from 'react';
import type { WearableId } from './hatsData';

export interface HeroBridgeState {
  /** Id of the cell the grid is on (or panning to). */
  cell: string;
  /** Cell that was current before `cell`. */
  prevCell: string | null;
  /** On a cell, not mid-navigation, overview closed and intro finished. */
  settled: boolean;
  /** physPos is the (single) real Hero cell and `settled`. */
  heroActive: boolean;
  /** 0 → 1 overview zoom, mirrored from Home every frame. */
  overview: number;
  /** The first-visit intro is still running. */
  introActive: boolean;
  /** Hat currently worn by the hero portrait. */
  hat: WearableId;
}

export interface HeroBridge {
  get(): HeroBridgeState;
  set(patch: Partial<HeroBridgeState>): void;
  subscribe(fn: () => void): () => void;
}

export function createHeroBridge(initial: Partial<HeroBridgeState> = {}): HeroBridge {
  let state: HeroBridgeState = {
    cell: 'hero', prevCell: null, settled: false, heroActive: false,
    overview: 0, introActive: false, hat: 'me', ...initial,
  };
  const subs = new Set<() => void>();
  return {
    get: () => state,
    set(patch) {
      let changed = false;
      for (const k in patch) {
        const key = k as keyof HeroBridgeState;
        if (state[key] !== patch[key]) { changed = true; break; }
      }
      if (!changed) return;
      state = { ...state, ...patch };
      subs.forEach(fn => fn());
    },
    subscribe(fn) { subs.add(fn); return () => { subs.delete(fn); }; },
  };
}

export const HeroBridgeContext = createContext<HeroBridge | null>(null);

const FALLBACK = createHeroBridge({ settled: true, heroActive: true });

export function useHeroBridgeStore(): HeroBridge {
  return useContext(HeroBridgeContext) ?? FALLBACK;
}

/** Subscribe to one derived value; the component re-renders only when it changes. */
export function useHeroBridge<T>(selector: (s: HeroBridgeState) => T): T {
  const store = useHeroBridgeStore();
  return useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
}
