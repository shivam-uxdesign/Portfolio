// Where the current inner page is scrolled. Embedded pages scroll inside their
// iframe, so the shell cannot read window.scrollY: the iframe reports here, and
// pages that scroll the window report from the shell. Plain pub/sub, no React
// state, so a scroll never re-renders anything.
export interface PageScroll { y: number; /** 0..1 through the page */ p: number }
let state: PageScroll = { y: 0, p: 0 };
const subs = new Set<(s: PageScroll) => void>();
export const pageScroll = {
  get: () => state,
  set(y: number, p: number) {
    if (y === state.y && p === state.p) return;
    state = { y, p };
    subs.forEach(cb => cb(state));
  },
  subscribe(cb: (s: PageScroll) => void) { subs.add(cb); return () => { subs.delete(cb); }; },
};
