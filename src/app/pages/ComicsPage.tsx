import { useEffect, useRef, useState } from 'react';
import './comics.css';

// Comics: my comics as their Instagram posts, so every panel of each carousel is there.
// Each post (~1.5 MB of Instagram) loads only when it scrolls near.
interface Comic { id: string; title: string; line: string }

const COMICS: Comic[] = [
  { id: 'DQ3Z9Z1D5QG', title: 'CAP’s (Keep Safe!!)', line: 'Years ago, I started collecting caps, and things kind of escalated.' },
  { id: 'DDUMf4DvbQz', title: 'Hello!!', line: 'For all my friends I reach out to whenever I need someone to talk to.' },
  { id: 'CgfJmg5PBHi', title: 'Can You Not?', line: 'An accidental sneeze. Thanks to everyone for the funny, stupid suggestions.' },
  { id: 'CaVD7-rvMuv', title: 'My Big Little Sister', line: 'Made with my sister.' },
  { id: 'CYJD2K5viFQ', title: 'Dreams', line: 'I get my best ideas in my dreams. Here’s one of them.' },
];

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }

let scriptLoading: Promise<void> | null = null;
function loadInstagram(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (!scriptLoading) scriptLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js'; s.async = true;
    s.onload = () => resolve(); s.onerror = () => { scriptLoading = null; reject(new Error('instagram')); };
    document.body.appendChild(s);
  });
  return scriptLoading;
}

const url = (id: string) => `https://www.instagram.com/p/${id}/`;

function Post({ c }: { c: Comic }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'wait' | 'show' | 'failed'>('wait');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      setState('show');
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (state !== 'show') return;
    loadInstagram().then(() => window.instgrm?.Embeds.process()).catch(() => setState('failed'));
  }, [state]);

  return (
    <li className="cm-item">
      <h2 className="cm-name">{c.title}</h2>
      <p className="cm-line">{c.line}</p>
      <div ref={ref} className={`cm-slot${state !== 'wait' ? ' ready' : ''}`}>
        {state === 'show' && (
          <blockquote className="instagram-media" data-instgrm-permalink={url(c.id)} data-instgrm-version="14">
            <a href={url(c.id)} target="_blank" rel="noopener noreferrer">{c.title} on Instagram</a>
          </blockquote>
        )}
        {state === 'failed' && <a className="cm-fallback" href={url(c.id)} target="_blank" rel="noopener noreferrer">Read “{c.title}” on Instagram</a>}
      </div>
    </li>
  );
}

export function ComicsPage() {
  return (
    <main className="cm">
      <p className="cm-label">Off Figma · Comics</p>
      <h1 className="cm-title">Comics I’ve <em>made</em>.</h1>
      <p className="cm-lede">
        Small stories from my life, drawn and posted on Instagram. Swipe through each one.
        More at <a href="https://www.instagram.com/shivamrelax/" target="_blank" rel="noopener noreferrer">@shivamrelax</a>.
      </p>
      <ul className="cm-list" role="list">
        {COMICS.map(c => <Post key={c.id} c={c} />)}
      </ul>
    </main>
  );
}
