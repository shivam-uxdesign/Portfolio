// Inner pages: where "home" lands you (the sheet cell they live in) and
// what their TL;DR view says until the real summaries arrive.
export interface PageMeta {
  /** Home cell the page belongs to. */
  cell: string;
  /** Short name, for the summary view. */
  name: string;
  /** Work and fun projects get a TL;DR toggle. Title: before, accent word, after. */
  tldr?: { kind: 'Case study' | 'Fun project'; title: [string, string, string] };
}

export const PAGES: Record<string, PageMeta> = {
  '/case-study/bm-dashboard': { cell: 'work', name: 'BM Dashboard', tldr: { kind: 'Case study', title: ['BM Dashboard, in ', 'one', ' minute.'] } },
  '/case-study/design-system': { cell: 'work', name: 'Design System', tldr: { kind: 'Case study', title: ['The design system, in ', 'one', ' minute.'] } },
  '/case-study/mobile-app': { cell: 'work', name: 'Mobile App', tldr: { kind: 'Case study', title: ['The mobile app, in ', 'one', ' minute.'] } },
  '/play/whatiswrongwithin': { cell: 'work', name: 'What is wrong within', tldr: { kind: 'Fun project', title: ['What is wrong within, in ', 'one', ' minute.'] } },
  '/play/whatshouldieat': { cell: 'work', name: 'What should I eat', tldr: { kind: 'Fun project', title: ['What should I eat, in ', 'one', ' minute.'] } },
  '/play/nightmare-rider': { cell: 'work', name: 'Nightmare Rider', tldr: { kind: 'Fun project', title: ['Nightmare Rider, in ', 'one', ' minute.'] } },
  '/comics': { cell: 'interests', name: 'Comics' },
  '/drawings': { cell: 'interests', name: 'Drawings' },
  '/music': { cell: 'interests', name: 'Music' },
  '/movies': { cell: 'interests', name: 'Movies' },
  '/books': { cell: 'interests', name: 'Books' },
  '/cool-stuff': { cell: 'interests', name: 'Cool stuff' },
  '/stack': { cell: 'stack', name: 'Built with' },
};

export const pageMeta = (path: string): PageMeta | undefined => PAGES[path.replace(/\/+$/, '') || '/'];
