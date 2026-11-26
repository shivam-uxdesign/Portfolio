import { Compass, Download, Layers, PenTool, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from '../../../lib/analytics';
import './resume.css';

// Resume: the short version. Facts in the same list style as About, a live clock with
// what I'm probably doing right now, and the four things I do best, all visible at a glance.
const SERIF = "'Playfair Display', Georgia, serif";

// `short` is what phones show; laptops get the full line.
const FACTS: { k: string; kShort?: string; v: string; short: string }[] = [
  { k: 'Now', v: 'Product designer at Rupyy, Oct 2023 – present', short: 'Rupyy · Oct 2023 – present' },
  { k: 'Focus', v: 'Scaling design systems and simplifying complex workflows', short: 'Design systems, complex workflows' },
  { k: 'Education', v: 'B.FA, JJ School of Art · M.Des, NIFT Delhi', short: 'B.FA JJ School · M.Des NIFT' },
  { k: 'Desk right now', kShort: 'Desk', v: 'Coffee, Figma tabs, and too many sticky notes', short: 'Coffee, Figma, too many sticky notes' },
  { k: 'Learning', v: '3D in Spline and cinematic UI transitions', short: 'Spline 3D, cinematic UI transitions' },
];

// What I'm probably up to, by the hour in India. The clock is live; the line changes through the day.
function statusFor(hour: number): string {
  if (hour >= 23 || hour < 6) return 'Probably dreaming about kerning and gradients right now.';
  if (hour < 7)  return 'Probably hitting snooze for the third time right now.';
  if (hour < 8)  return 'Probably rushing through morning chai right now.';
  if (hour < 9)  return 'Probably on the commute screaming Arijit Singh songs right now.';
  if (hour < 12) return 'Probably deep in Figma with 47 tabs open right now.';
  if (hour < 13) return 'Probably debating lunch options for the last 20 minutes right now.';
  if (hour < 15) return 'Probably in a design review nodding enthusiastically right now.';
  if (hour < 17) return 'Probably adjusting spacing by 2px right now.';
  if (hour < 18) return 'Probably wrapping up and pretending the work is done right now.';
  if (hour < 19) return 'Probably on the ride home screaming Bollywood songs right now.';
  if (hour < 21) return 'Probably sketching random ideas on a napkin right now.';
  return 'Probably down a rabbit hole of design inspiration right now.';
}

function istNow() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true }).format(now).toLowerCase();
  const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hourCycle: 'h23' }).format(now), 10);
  return { time, status: statusFor(hour) };
}

function useIst() {
  const [ist, setIst] = useState(istNow);
  useEffect(() => {
    const id = setInterval(() => setIst(istNow()), 20000);
    return () => clearInterval(id);
  }, []);
  return ist;
}

// Each card names its proof, all facts from the case studies. Phones get the short line.
const SKILLS = [
  { icon: Compass, title: 'Product strategy', v: 'Every design a PM makes passes my review before it ships. Prototyping a loan journey went from 6 days to 1.5.', short: 'Every PM design passes my review.' },
  { icon: Search, title: 'User research', v: 'I read 2,485 support tickets before designing the Sales Case Card. 6 of 6 BMs preferred it.', short: '2,485 tickets read before designing.' },
  { icon: PenTool, title: 'Digital design', v: 'From a single case card to a whole loan journey, plus two apps I built with AI.', short: 'Case cards to loan journeys, plus two apps.' },
  { icon: Layers, title: 'Design systems', v: 'One Design Kit for the team: 175 screens with 0 raw values.', short: '175 screens, 0 raw values.' },
];

export function ResumePanel() {
  const ist = useIst();
  return (
    <div className="cv w-full h-full bg-background">
      <div className="cv-top">
        <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Resume</p>
        <a
          href="/resume.pdf"
          download="Shivam_Sehgal_Resume.pdf"
          onClick={() => trackEvent('resume_download', {})}
          className="cv-download"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
          Download resume
        </a>
      </div>
      <div className="cv-body">
        <div className="cv-text">
          <h2 className="cv-title text-foreground">
            The <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>short</span> version.
          </h2>
          <dl className="cv-facts">
            {FACTS.map(f => (
              <div key={f.k} className="cv-fact">
                <dt>{f.kShort ? <><span className="md:hidden">{f.kShort}</span><span className="hidden md:inline">{f.k}</span></> : f.k}</dt>
                <dd><span className="md:hidden">{f.short}</span><span className="hidden md:inline">{f.v}</span></dd>
              </div>
            ))}
            <div className="cv-fact">
              <dt>Based in</dt>
              <dd>India · <span className="cv-clock">{ist.time}</span> here now</dd>
            </div>
          </dl>
          <p className="cv-status"><span className="cv-dot" aria-hidden="true" />{ist.status}</p>
        </div>
        <section className="cv-skills" aria-label="What I do best">
          <p className="cv-skills-label">What I do best</p>
          <ul className="cv-grid">
            {SKILLS.map(({ icon: Icon, title, v, short }) => (
              <li key={title} className="cv-skill">
                <span className="cv-skill-icon" aria-hidden="true"><Icon className="w-4 h-4" strokeWidth={1.75} /></span>
                <span className="cv-skill-title">{title}</span>
                <span className="cv-skill-desc"><span className="md:hidden">{short}</span><span className="hidden md:inline">{v}</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
