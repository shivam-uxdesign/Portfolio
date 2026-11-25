import { Link } from 'react-router';
import { EmbeddedCaseStudy } from '../components/chrome/EmbeddedCaseStudy';
import './work-case-studies.css';

// The four work case studies are finished pages of their own (public/case-studies);
// these routes show them inside the portfolio's chrome.
export const SalesCaseCardPage = () => <EmbeddedCaseStudy slug="sales-case-card" title="Sales Case Card case study" />;
export const JourneyStudioPage = () => <EmbeddedCaseStudy slug="journey-studio" title="Journey Studio case study" />;
export const DesignKitPage = () => <EmbeddedCaseStudy slug="design-kit" title="Design Kit case study" />;
export const IllustrationStudioPage = () => <EmbeddedCaseStudy slug="illustration-studio" title="Illustration Studio case study" />;
// Keppo Moto has its own dark look, so it opts out of the shared skin.
export const KeppoMotoPage = () => <EmbeddedCaseStudy slug="keppo-moto" title="Keppo Moto case study" skin={false} />;
// Keppo Journal, its sibling: its own light look (paper and marigold), so it opts out too.
export const KeppoJournalPage = () => <EmbeddedCaseStudy slug="keppo-journal" title="Keppo Journal case study" skin={false} />;

const Accent = ({ children }: { children: string }) => <span className="em">{children}</span>;

export const TOOLS = [
  { to: '/case-study/journey-studio', name: 'Journey Studio', color: '#2563EB', line: 'One prototype across every team, handed to devs as HTML.', stat: '6 → 1.5 days', statLine: 'to prototype a three-team journey' },
  { to: '/case-study/design-kit', name: 'Design Kit', color: '#00845A', line: 'The released contract: one core of tokens and parts, a thin layer per product.', stat: '½ day → 20 min', statLine: 'to get one change into every studio' },
  { to: '/case-study/illustration-studio', name: 'Illustration Studio', color: '#C98A00', line: 'PMs make their own state graphics in kit colours.', stat: '1 day → 10 min', statLine: 'for a state graphic, made by the PM' },
] as const;

const MOMENTS = [
  ['A screen needs a state graphic', 'Journey Studio → Illustration Studio → Design Kit', 'The PM makes it in minutes, it’s approved into the kit, and every screen names it.'],
  ['A screen needs a part the kit lacks', 'Journey Studio → Design Kit → every studio', 'Claude builds it from kit tokens and proposes it; I review it; the next release ships it everywhere.'],
  ['The design changes in Figma', 'Figma → Design Kit → screens and graphics', 'The parity check flags it, a release carries it, and screens and graphics follow the same day.'],
  ['A journey is approved', 'Journey Studio → Developers', 'Devs download one working HTML prototype on kit classes, with SVG and Lottie inside.'],
] as const;

/** The three tools as one story: an overview (from the 4-slide TL;DR) that leads to each case study. */
export function RupyySystemPage() {
  return (
    <main className="rs">
      <header className="rs-head">
        <p className="rs-label">Case study · Rupyy · 2026 · Shipped</p>
        <h1 className="rs-title">Six PMs, one designer. So I built a <Accent>system</Accent> instead of a queue.</h1>
        <p className="rs-lede">
          Every screen, graphic and part went through me, and each of our tools kept its own copy of the design system.
          I designed three tools around one released kit, and built them with Claude. Figma stays the designers’ master.
        </p>
        <dl className="rs-facts">
          <div><dt>Role</dt><dd>Designed and built all three</dd></div>
          <div><dt>Time</dt><dd>Oct–Nov 2026</dd></div>
          <div><dt>Used by</dt><dd>The product team · 6 PMs, devs, design</dd></div>
        </dl>
      </header>

      <section className="rs-sec">
        <p className="rs-label">The problem</p>
        <h2 className="rs-h2">Everything <Accent>queued</Accent> behind one person.</h2>
        <div className="rs-stats">
          <div><b>2–3 days</b><span>a PM waited in the queue for one state graphic</span></div>
          <div><b>6 days</b><span>to prototype a three-team journey in Figma, handovers untested</span></div>
          <div><b>43 tokens</b><span>where our tools and the Figma library disagreed</span></div>
        </div>
      </section>

      <section className="rs-sec">
        <p className="rs-label">The system</p>
        <h2 className="rs-h2">Three tools around one <Accent>released</Accent> kit.</h2>
        <p className="rs-p">Figma is where the system is designed. The kit is where it’s delivered. A parity check keeps the two equal before every release, so nothing lives only in an AI tool.</p>
        <div className="rs-tools">
          {TOOLS.map(t => (
            <Link key={t.to} to={t.to} className="rs-tool" style={{ '--c': t.color } as React.CSSProperties}>
              <span className="rs-tool-name"><i />{t.name}</span>
              <span className="rs-tool-line">{t.line}</span>
              <span className="rs-tool-stat"><b>{t.stat}</b> {t.statLine}</span>
              <span className="rs-tool-go">Read the case study →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rs-sec">
        <p className="rs-label">How they work together</p>
        <h2 className="rs-h2">They call on each other only when they <Accent>need</Accent> to.</h2>
        <ol className="rs-moments">
          {MOMENTS.map(([h, path, body], i) => (
            <li key={h}><span className="rs-n">0{i + 1}</span><div><b>{h}</b><span className="rs-path">{path}</span><p>{body}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="rs-sec">
        <p className="rs-label">One month in</p>
        <h2 className="rs-h2">The whole product team <Accent>works</Accent> this way now.</h2>
        <dl className="rs-facts rs-impact">
          <div><dt>Prototype</dt><dd><b>6 → 1.5 days</b> for a three-team journey</dd></div>
          <div><dt>Graphics</dt><dd><b>1 day → 10 min</b> for a state graphic, made by the PM</dd></div>
          <div><dt>Changes</dt><dd><b>½ day → 20 min</b> to get one change into every studio</dd></div>
          <div><dt>Drift</dt><dd><b>43 → 0</b> tokens out of step with Figma</dd></div>
          <div><dt>Next</dt><dd>Kit tokens in the production codebase, live usage for every part, and a second team’s product.</dd></div>
        </dl>
      </section>
    </main>
  );
}
