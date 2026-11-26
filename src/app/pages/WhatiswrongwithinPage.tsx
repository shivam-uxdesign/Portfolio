import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import './whatiswrongwith.css';

// Whatiswrongwith.in: a fun project, kept short. The live app to try, then three roasts I ran on my own life.
const SITE = 'https://whatiswrongwith.in/';

// Real outputs from the live site, copied as they came back.
const ROASTS: { q: string; lines: string[] }[] = [
  { q: 'working at a startup', lines: [
    'Equity dreams.',
    "You're paying for snacks with 80 hours of your life.",
    "The 'Founder' title just means he's sleeping on the office couch.",
    'Unpaid internship.',
    'Changing the world one broken Slack integration at a time.',
  ] },
  { q: 'sleeping in your car during office hours', lines: [
    'Professional naplord.',
    'The condensation on your windows is a cry for help.',
    'Quiet quitting.',
    'Parking lot security thinks you’re a missing persons case.',
    'Doing the most work in your dreams.',
  ] },
  { q: 'living in gurgaon', lines: [
    'Asthma premium.',
    'Paying 100k to live in a glorified parking lot.',
    'Your entire personality is just Huda City Centre traffic.',
    'Land of the giants.',
    'The only place where office buildings are taller than the residents’ expectations.',
  ] },
];

export function WhatiswrongwithinPage() {
  return (
    <main className="ww">
      <p className="ww-label">Fun project · Made with Lovable in a day</p>
      <h1 className="ww-title">Type anything. It tells you what’s <em>wrong</em> with it.</h1>
      <p className="ww-lede">
        My first vibe-coded project. Five reasons, no sugarcoating. The part I’m proud of: <b>it makes people laugh.</b>
      </p>

      <div className="ww-window">
        <div className="ww-chrome">
          <span className="ww-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="ww-url">whatiswrongwith.in</span>
          <a className="ww-open" href={SITE} target="_blank" rel="noopener noreferrer" aria-label="Open whatiswrongwith.in in a new tab">
            Open <ExternalLink className="inline w-3 h-3 -mt-0.5" aria-hidden="true" />
          </a>
        </div>
        <div className="ww-stage">
          {/* Under the live app: a still and a link, for when the embed is blocked or still loading. */}
          <a className="ww-fallback" href={SITE} target="_blank" rel="noopener noreferrer" style={{ backgroundImage: 'url(/share/whatiswrongwith.jpg)' }}>
            <span>Open whatiswrongwith.in ↗</span>
          </a>
          <iframe className="ww-frame" src={SITE} title="whatiswrongwith.in, live: type something to roast" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      </div>
      <p className="ww-hint"><b>Try it right here.</b> Your job, your city, your ex, yourself.</p>

      <h2 className="ww-h2">I tried it on <em>my own</em> life.</h2>
      <p className="ww-sub">Straight from the site, unedited.</p>
      <ul className="ww-roasts">
        {ROASTS.map(r => (
          <li key={r.q} className="ww-roast">
            <p className="ww-q">What’s wrong with <b>“{r.q}”</b>:</p>
            <ol>{r.lines.map((l, i) => <li key={i}><span>0{i + 1}</span>{l}</li>)}</ol>
          </li>
        ))}
      </ul>

      <div className="ww-made">
        <span><b>Made with</b> Lovable</span>
        <span><b>Took</b> a day</span>
        <span><b>Came next</b> <Link to="/case-study/keppo-moto" className="underline underline-offset-2">Keppo Moto</Link> and <Link to="/case-study/keppo-journal" className="underline underline-offset-2">Keppo Journal</Link></span>
      </div>
    </main>
  );
}
