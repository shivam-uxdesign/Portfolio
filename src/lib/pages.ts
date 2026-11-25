// Inner pages: where "home" lands you (the sheet cell they live in) and
// what their TL;DR view says until the real summaries arrive.
export interface PageMeta {
  /** Home cell the page belongs to. */
  cell: string;
  /** Short name, for the summary view. */
  name: string;
  /** Work and fun projects get a TL;DR toggle. Title: before, accent word, after. */
  tldr?: { kind: 'Case study' | 'Fun project'; title?: [string, string, string]; embedded?: boolean };
  /** A page with its own dark look: the card and the bar are drawn dark from the first frame of the rise. */
  theme?: 'dark';
  /** Draw a reading-progress line under the bar, in this colour. */
  progress?: string;
}

export const PAGES: Record<string, PageMeta> = {
  '/case-study/sales-case-card': { cell: 'work', name: 'Sales Case Card', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/rupyy-design-system': { cell: 'work', name: 'The Rupyy design system' },
  '/case-study/journey-studio': { cell: 'work', name: 'Journey Studio', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/design-kit': { cell: 'work', name: 'Design Kit', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/illustration-studio': { cell: 'work', name: 'Illustration Studio', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/keppo-moto': { cell: 'work', name: 'Keppo Moto', tldr: { kind: 'Case study', embedded: true }, theme: 'dark', progress: '#69C8CB' },
  '/play/whatiswrongwithin': { cell: 'work', name: 'What is wrong within', tldr: { kind: 'Fun project', title: ['What is wrong within, in ', 'one', ' minute.'] } },
  '/play/whatshouldieat': { cell: 'work', name: 'What should I eat', tldr: { kind: 'Fun project', title: ['What should I eat, in ', 'one', ' minute.'] } },
  '/comics': { cell: 'interests', name: 'Comics' },
  '/drawings': { cell: 'interests', name: 'Drawings' },
  '/music': { cell: 'interests', name: 'Music' },
  '/movies': { cell: 'interests', name: 'Movies' },
  '/books': { cell: 'interests', name: 'Books' },
  '/cool-stuff': { cell: 'interests', name: 'Cool stuff' },
  '/stack': { cell: 'stack', name: 'Built with' },
};

export const pageMeta = (path: string): PageMeta | undefined => PAGES[path.replace(/\/+$/, '') || '/'];
