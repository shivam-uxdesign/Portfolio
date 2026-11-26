// Inner pages: where "home" lands you (the sheet cell they live in) and
// what their TL;DR view says until the real summaries arrive.
export interface PageMeta {
  /** Home cell the page belongs to. */
  cell: string;
  /** Short name, for the summary view. */
  name: string;
  /** Work and fun projects get a TL;DR toggle. Title: before, accent word, after. */
  tldr?: { kind: 'Case study' | 'Fun project'; title?: [string, string, string]; embedded?: boolean };
  /** For the tab title, search results and link previews (also written into static files at build time). */
  description?: string;
  /** Share image path (1200×630), relative to the site root. */
  image?: string;
  /** A page with its own dark look: the card and the bar are drawn dark from the first frame of the rise. */
  theme?: 'dark';
  /** Draw a reading-progress line under the bar, in this colour. */
  progress?: string;
}

export const PAGES: Record<string, PageMeta> = {
  '/case-study/sales-case-card': { cell: 'work', name: 'Sales Case Card', description: 'A case card that tells a business manager whose move it is. “Where is my case?” tickets fell from 98 to 12 a month.', image: '/share/sales-case-card.jpg', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/rupyy-design-system': { cell: 'work', name: 'The Rupyy design system', description: 'Six PMs, one designer. Three tools around one released design kit, built with Claude.', image: '/share/design-kit.jpg' },
  '/case-study/journey-studio': { cell: 'work', name: 'Journey Studio', description: 'Any journey, proven before it’s built. Prototyping a three-team loan journey went from 6 days to 1.5.', image: '/share/journey-studio.jpg', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/design-kit': { cell: 'work', name: 'Design Kit', description: 'One design system, released like software: 0 raw values across 175 screens.', image: '/share/design-kit.jpg', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/illustration-studio': { cell: 'work', name: 'Illustration Studio', description: 'State illustrations, self-serve: a day of design work down to 10 minutes, made by the PM who needs it.', image: '/share/illustration-studio.jpg', tldr: { kind: 'Case study', embedded: true } },
  '/case-study/keppo-moto': { cell: 'work', name: 'Keppo Moto', description: 'A motorcycle app that keeps every ride, designed end to end and built with AI.', image: '/case-studies/keppo-moto/img/og.jpg', tldr: { kind: 'Case study', embedded: true }, theme: 'dark', progress: '#69C8CB' },
  '/case-study/keppo-journal': { cell: 'work', name: 'Keppo Journal', description: 'A journal that opens on the camera. Catch the moment first, write later. Built with AI.', image: '/case-studies/keppo-journal/media/og.jpg', tldr: { kind: 'Case study', embedded: true } },
  // A short, fun read: no TL;DR switch.
  '/play/whatiswrongwithin': { cell: 'work', name: 'Whatiswrongwith.in', description: 'Type anything. It tells you what’s wrong with it. Made with Lovable in a day.', image: '/share/whatiswrongwith.jpg' },
  '/comics': { cell: 'interests', name: 'Comics', description: 'Small stories from my life, drawn and posted on Instagram.' },
  '/drawings': { cell: 'interests', name: 'Drawings', description: 'Ink, watercolour, paint and a bit of digital. Fine arts at JJ School of Art, and I never stopped.' },
  '/music': { cell: 'interests', name: 'Music', description: 'Ten songs, ten genres: Desi hip-hop to Sufi, Nepali pop to old Bollywood.' },
  '/movies': { cell: 'interests', name: 'Watching', description: 'Films, shows and a lot of anime, with notes from my own watchlist.' },
  '/books': { cell: 'interests', name: 'Books', description: 'On my nightstand. Unopened. The honest reading list.' },
  '/cool-stuff': { cell: 'interests', name: 'Cool stuff', description: 'Things I’ve made by hand: macramé, dyed yarn, handloom, knitting and a painted stone.' },
  '/stack': { cell: 'stack', name: 'Built with', description: 'The tools I actually use, from first sketch to shipped screen.' },
};

export const SITE_TITLE = 'Shivam Sehgal · Product designer';
export const titleFor = (path: string) => { const m = pageMeta(path); return m ? `${m.name} · Shivam Sehgal` : SITE_TITLE; };

export const pageMeta = (path: string): PageMeta | undefined => PAGES[path.replace(/\/+$/, '') || '/'];
