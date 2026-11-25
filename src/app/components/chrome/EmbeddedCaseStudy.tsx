import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { site, useSite } from '../../../lib/site';
import { PAL } from '../hats/hatsData';
import { pageScroll } from '../../../lib/pageScroll';

// A finished case study page (public/case-studies/<slug>/index.html), shown
// whole inside the portfolio. Same origin, so the portfolio can:
//  - add its skin (skin.css) and theme colours,
//  - drive the page's own Full / TL;DR switch from the bar (and follow it back),
//  - turn the page's links to other case studies into in-app navigation.
const READ_MODE = (doc: Document): 'full' | 'tldr' => {
  const m = doc.documentElement.getAttribute('data-mode');
  if (m === 'tldr' || m === 'full') return m;
  const t = doc.getElementById('tldr');
  return t && !t.hidden ? 'tldr' : 'full';
};
function setMode(doc: Document, m: 'full' | 'tldr') {
  if (READ_MODE(doc) === m) return;
  const btn = doc.querySelector<HTMLElement>(`[data-tlm="${m}"]`) ?? doc.querySelector<HTMLElement>(`.modebar [data-mode="${m}"]`);
  if (btn) btn.click();
  else doc.defaultView!.location.hash = m === 'tldr' ? 'tldr' : '';
  doc.defaultView?.scrollTo(0, 0);
}

export function EmbeddedCaseStudy({ slug, title, skin = true }: { slug: string; title: string; skin?: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const tldr = useSite(s => s.tldr);
  const hat = useSite(s => s.hat);

  // Theme into the page.
  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    const root = getComputedStyle(ref.current!);
    doc.documentElement.style.setProperty('--site-bg', root.getPropertyValue('--background').trim() || '#fff');
    doc.documentElement.style.setProperty('--site-primary', hat === 'me' ? '' : PAL[hat].accent);
    doc.documentElement.style.setProperty('--site-ink', PAL[hat].ink);
  }, [hat]);

  // Bar → page.
  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (doc?.readyState === 'complete') setMode(doc, tldr ? 'tldr' : 'full');
  }, [tldr]);

  const onLoad = () => {
    const frame = ref.current, doc = frame?.contentDocument, win = frame?.contentWindow;
    if (!frame || !doc || !win) return;
    // A page with its own identity (skin = false) keeps its own type, colours and sections; the shell still drives its mode and links.
    if (skin) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet'; link.href = '/case-studies/skin.css';
      doc.head.appendChild(link);
    }
    const cs = getComputedStyle(frame);
    doc.documentElement.style.setProperty('--site-bg', cs.getPropertyValue('--background').trim() || '#fff');
    const h = site.get().hat;
    if (h !== 'me') doc.documentElement.style.setProperty('--site-primary', PAL[h].accent);
    doc.documentElement.style.setProperty('--site-ink', PAL[h].ink);
    // Links: other pages of this site navigate the app; outside links open a tab.
    doc.addEventListener('click', e => {
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('/') && !href.startsWith('//')) { e.preventDefault(); navigate(href.replace(/[?&]v=tldr\b/, '')); }
      else if (/^https?:/.test(href)) a.target = '_blank';
    }, true);
    // Scroll position → the shell (the header's frosted band and the progress line).
    const report = () => {
      const el = doc.scrollingElement ?? doc.documentElement;
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      pageScroll.set(el.scrollTop, Math.min(1, el.scrollTop / max));
    };
    win.addEventListener('scroll', report, { passive: true });
    win.addEventListener('resize', report, { passive: true });
    report();
    // Page → bar (its own "Read the full story" etc.).
    const sync = () => site.set({ tldr: READ_MODE(doc) === 'tldr' });
    new MutationObserver(sync).observe(doc.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-mode', 'hidden'] });
    if (site.get().tldr) setMode(doc, 'tldr'); else sync();
  };

  return (
    <iframe
      ref={ref}
      className="pc-frame"
      src={`/case-studies/${slug}/index.html?embed=1`}
      title={title}
      onLoad={onLoad}
    />
  );
}
