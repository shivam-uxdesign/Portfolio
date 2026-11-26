import { Compass, Download, Layers, PenTool, Search } from 'lucide-react';
import { trackEvent } from '../../../lib/analytics';
import './resume.css';

// Resume: the short version. Facts in the same list style as About, and the
// four things I do best — all visible at a glance, nothing to tap or wait for.

// `short` is what phones show; laptops get the full line.
const FACTS = [
  { k: 'Now', v: 'Product designer at Rupyy, Oct 2023 – present', short: 'Rupyy · Oct 2023 – present' },
  { k: 'Focus', v: 'Scaling design systems and simplifying complex workflows', short: 'Design systems and complex workflows' },
  { k: 'Education', v: 'B.FA, JJ School of Art · M.Des, NIFT Delhi', short: 'B.FA JJ School · M.Des NIFT' },
  { k: 'Based in', v: 'India (IST)', short: 'India (IST)' },
];

const SKILLS = [
  { icon: Compass, title: 'Product strategy', v: 'Balancing user needs with business goals — from early research through to shipping products that matter.', short: 'User needs balanced with business goals, research to ship.' },
  { icon: Search, title: 'User research', v: 'Gathering insights and finding the real pain points before any design decision gets made.', short: 'Finding the real pain points before deciding anything.' },
  { icon: PenTool, title: 'Digital design', v: 'Turning strategy and research into interfaces that are as functional as they are refined.', short: 'Interfaces as functional as they are refined.' },
  { icon: Layers, title: 'Design systems', v: 'Component libraries and documentation that teams actually adopt — not just ship and abandon.', short: 'Component libraries teams actually adopt, not abandon.' },
];

export function ResumePanel() {
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
            The <span className="em">short</span> version.
          </h2>
          <dl className="cv-facts">
            {FACTS.map(f => (
              <div key={f.k} className="cv-fact">
                <dt>{f.k}</dt>
                <dd><span className="md:hidden">{f.short}</span><span className="hidden md:inline">{f.v}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        <section className="cv-skills" aria-label="What I do best">
          <p className="cv-skills-label">What I do best</p>
          <ul className="cv-grid">
            {SKILLS.map(({ icon: Icon, title, short }) => (
              <li key={title} className="cv-skill">
                <span className="cv-skill-icon" aria-hidden="true"><Icon className="w-4 h-4" strokeWidth={1.75} /></span>
                <span className="cv-skill-title">{title}</span>
                <span className="cv-skill-desc">{short}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
