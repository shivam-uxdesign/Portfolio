import { Compass, Download, Layers, PenTool, Search } from 'lucide-react';
import { trackEvent } from '../../../lib/analytics';
import './resume.css';

// Resume: the short version. Facts in the same list style as About, and the
// four things I do best — all visible at a glance, nothing to tap or wait for.
const SERIF = "'Playfair Display', Georgia, serif";

// `short` is what phones show; laptops get the full line.
const FACTS = [
  { k: 'Now', v: 'Product designer at Rupyy, Oct 2023 – present', short: 'Rupyy · Oct 2023 – present' },
  { k: 'Focus', v: 'Scaling design systems and simplifying complex workflows', short: 'Design systems and complex workflows' },
  { k: 'Education', v: 'B.FA, JJ School of Art · M.Des, NIFT Delhi', short: 'B.FA JJ School · M.Des NIFT' },
  { k: 'Based in', v: 'India (IST)', short: 'India (IST)' },
];

// Each card names its proof, all facts from the case studies. Phones get the short line.
const SKILLS = [
  { icon: Compass, title: 'Product strategy', v: 'Every design a PM makes passes my review before it ships. Prototyping a loan journey went from 6 days to 1.5.', short: 'Every PM design passes my review.' },
  { icon: Search, title: 'User research', v: 'I read 2,485 support tickets before designing the Sales Case Card. 6 of 6 BMs preferred it.', short: '2,485 tickets read before designing.' },
  { icon: PenTool, title: 'Digital design', v: 'From a single case card to a whole loan journey, plus two apps I built with AI.', short: 'Case cards to loan journeys, plus two apps.' },
  { icon: Layers, title: 'Design systems', v: 'One Design Kit for the team: 175 screens with 0 raw values.', short: '175 screens, 0 raw values.' },
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
            The <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>short</span> version.
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
