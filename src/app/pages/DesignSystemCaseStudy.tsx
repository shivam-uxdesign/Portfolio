import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RevealOnView } from '../components/RevealOnView';

const ACCENT = '#BE7C1E';
const DARK = '#17150F';

const products = [
  { name: 'LoanBox', tag: 'Origination' },
  { name: 'PaymentBox', tag: 'Payments' },
  { name: 'LeadBox', tag: 'Lead tracking' },
  { name: 'TitleBox', tag: 'Title processing' },
];

const painPoints = [
  {
    tag: 'Fragmentation',
    title: 'Four products, four dialects',
    body: 'A decade of independent evolution left each platform with its own buttons, forms, and interaction rules — and no agreement on which was correct.',
  },
  {
    tag: 'Duplication',
    title: 'The same patterns, rebuilt repeatedly',
    body: 'Teams re-solved solved problems. Components were copied, tweaked, and forked, multiplying maintenance instead of sharing it.',
  },
  {
    tag: 'Design debt',
    title: 'Compounding inconsistency',
    body: 'Every new screen widened the gap between products, eroding trust in the interface and the data behind it.',
  },
  {
    tag: 'Misalignment',
    title: 'Design and engineering out of sync',
    body: 'With no shared source of truth, handoff meant interpretation. Rework, ambiguity, and friction were built into the process.',
  },
];

const auditBefore = [
  { label: 'Button styles in production', value: '7+' },
  { label: 'Input / form field variants', value: '9' },
  { label: 'Distinct spacing values in use', value: '20+' },
  { label: 'Greys with no semantic meaning', value: '14' },
  { label: 'Shared, documented components', value: '0' },
];

const auditAfter = [
  { label: 'Button component, variant-driven', value: '1' },
  { label: 'Input component, composable', value: '1' },
  { label: 'Spacing scale (token-based)', value: '1' },
  { label: 'Semantic colour token set', value: '1' },
  { label: 'Documented, governed library', value: '1' },
];

const principles = [
  {
    n: '01',
    title: 'Constraints over choices',
    body: 'A small set of correct defaults — tokens, scales, states — so the right decision is the easy one and drift has nowhere to start.',
  },
  {
    n: '02',
    title: 'Composable, not bespoke',
    body: 'Flexible primitives that assemble into patterns and drop into any product with minimal customization.',
  },
  {
    n: '03',
    title: 'Handoff is part of the system',
    body: 'Adoption is designed in from day one — documentation and dev parity treated as features, not afterthoughts.',
  },
];

const goals = [
  { k: 'G1', label: 'Consistency', body: 'One visual and behavioural language across all four products.' },
  { k: 'G2', label: 'Velocity', body: 'Teams compose screens instead of rebuilding primitives.' },
  { k: 'G3', label: 'Less rework', body: 'Design and engineering work from a single source of truth.' },
  { k: 'G4', label: 'Accessibility by default', body: 'WCAG-aligned contrast and states baked into tokens.' },
];

const tokenTiers = [
  { tier: 'Tier 1 — Primitive', title: 'Raw values', meta: 'The palette of truth', chips: ['amber-600', 'ink-900', 'neutral-500', 'space-4 · 16px', 'radius-md · 8px'] },
  { tier: 'Tier 2 — Semantic', title: 'Meaning', meta: 'What a value is for', chips: ['color.action.primary', 'text.default', 'space.inset.md', 'type.scale.body'] },
  { tier: 'Tier 3 — Component', title: 'Application', meta: 'Bound to a component', chips: ['button.bg.primary', 'input.border.focus', 'nav.item.active'] },
];

const componentLayers = [
  { step: 'Layer 01', title: 'Atoms', desc: 'Foundational, single-purpose', items: ['Button', 'Input', 'Badge', 'Icon', 'Checkbox'] },
  { step: 'Layer 02', title: 'Compound', desc: 'Atoms, composed', items: ['Form field', 'Nav item', 'Table row', 'Card'] },
  { step: 'Layer 03', title: 'Patterns', desc: 'Drop-in workflows', items: ['Data table', 'Sidebar nav', 'Filter bar', 'Detail panel'] },
];

const handoffTools = [
  { logo: 'F', color: '#0ACF83', name: 'Figma Dev Mode', role: 'Design intent', body: 'Spacing, tokens, states, and behaviour annotated directly in the design files — specs read straight from the source.' },
  { logo: 'S', color: '#FF4785', name: 'Storybook', role: 'Live components', body: 'The source of truth for built components — engineers validate behaviour, props, and states against the real thing.' },
  { logo: 'C', color: '#F46A54', name: 'Coda Docs', role: 'The connective tissue', body: 'Connects design intent to implementation — usage guidelines, do/don’t rules, and QA checks in one referenceable place.' },
];

const rolloutSteps = [
  { step: 'Step 01', title: 'Anchor in a real product', body: 'Shipped the Admin Portal on the system so adoption was validated in live delivery, not a sandbox.' },
  { step: 'Step 02', title: 'Onboard the teams', body: 'Walkthroughs of tokens, components, and the contribution path, with docs as the always-on reference.' },
  { step: 'Step 03', title: 'Migrate incrementally', body: 'Adopt component-by-component across LoanBox, PaymentBox, LeadBox, and TitleBox — replacing forked patterns over time.' },
];

const outcomeMetrics = [
  { value: '35+', label: 'Atomic & compound components shipped into the shared library' },
  { value: '4', label: 'Products unified on a single foundation, from origination to title' },
  { value: '~40%', label: 'Faster screen assembly — composing patterns instead of rebuilding' },
  { value: '1', label: 'Source of truth replacing scattered, forked patterns' },
];

const quotes = [
  { text: 'For the first time, design and engineering were debating behaviour — not arguing about which button was correct.', attr: 'Qualitative — Product engineering' },
  { text: 'New screens stopped feeling like new decisions. The defaults were already right.', attr: 'Qualitative — Product design' },
];

const learnings = [
  {
    tag: 'Challenges',
    title: 'The hard part wasn’t the UI',
    items: [
      'Defining shared constraints across teams that had each made their own rules.',
      'Earning adoption while products were still actively shipping.',
      'Treating documentation as a product, not a deliverable.',
    ],
  },
  {
    tag: 'Trade-offs',
    title: 'Deliberate constraints',
    items: [
      'Fewer options by design — flexibility was traded for consistency.',
      'Anchoring to one product first slowed full coverage but de-risked adoption.',
      'Composable primitives over polished one-offs.',
    ],
  },
  {
    tag: "What's next",
    title: 'Future opportunities',
    items: [
      'Token sync between Figma and code to close the last manual gap.',
      'Usage analytics to see which components actually get adopted.',
      'Maturing the contribution model into true federated ownership.',
    ],
  },
];

export function DesignSystemCaseStudy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - Hero */}
      <section className="w-full px-8 md:px-16 lg:px-24 pt-20 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {['DESIGN SYSTEMS', 'ENTERPRISE TOOLING', 'FINTECH · AUTO-LENDING'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-[56px] md:text-[72px] leading-[0.95] mb-6 text-foreground max-w-3xl">
            A decade of design debt, rebuilt as <span style={{ color: ACCENT, fontStyle: 'italic' }}>one system</span>.
          </h1>

          <p className="text-[18px] md:text-[20px] leading-[1.5] max-w-2xl text-muted-foreground mb-10">
            Designing Rupyy's first enterprise design system — a shared foundation that unified four
            auto-lending products and realigned how design and engineering ship.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border">
            {[
              { dt: 'Role', dd: 'Design System Lead' },
              { dt: 'Team', dd: '1 designer + 4 engineers' },
              { dt: 'Timeline', dd: '~5 months' },
              { dt: 'Scope', dd: 'Tokens, 35+ components' },
            ].map((m) => (
              <div key={m.dt} className="bg-card p-5">
                <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-2">{m.dt}</p>
                <p className="text-[14px] text-foreground">{m.dd}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 2 - Overview / system map */}
      <section className="w-full py-16 border-t border-border">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 mb-16">
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>01 — Overview</p>
              <h2 className="text-[28px] mb-6 leading-[1.3] text-foreground">
                Rupyy powers the end-to-end auto-loan journey. After ten years of independent growth, its
                products shared a workflow — but not a foundation.
              </h2>
            </div>
            <div className="space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                The ecosystem had grown into four distinct platforms — loan origination, payments, lead
                tracking, and title processing — each evolving its own interface conventions.
              </p>
              <p>
                What held them together was a thin UI kit that couldn't scale. I owned the system
                end-to-end: the foundations, the component architecture, and the documentation that made
                it adoptable.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-8 md:p-12" style={{ backgroundColor: '#FAF9F6' }}>
            <div className="flex flex-col items-center gap-8">
              <div
                className="rounded-2xl px-8 py-5 text-center"
                style={{ backgroundColor: DARK }}
              >
                <p className="text-[15px] font-medium text-white">Rupyy DS</p>
                <p className="text-[10px] tracking-[0.13em] uppercase mt-1" style={{ color: ACCENT }}>Foundation</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {products.map((p) => (
                  <div key={p.name} className="rounded-xl border border-border bg-white p-4 text-center">
                    <p className="text-[14px] font-semibold text-foreground">{p.name}</p>
                    <p className="text-[10px] tracking-[0.08em] uppercase text-muted-foreground mt-1">{p.tag}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} /> One foundation</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} /> Four products</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} /> Minimal customization</span>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 3 - The Problem */}
      <section className="w-full py-16 bg-card">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>02 — The Problem</p>
          <h2 className="text-[28px] mb-4 leading-[1.3] text-foreground max-w-2xl">
            Without shared definitions, every team rebuilt the same thing.
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground max-w-2xl mb-10">
            As Rupyy's products scaled, the absence of a system stopped being a design inconvenience and
            became a delivery bottleneck.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-border bg-border">
            {painPoints.map((p) => (
              <div key={p.tag} className="bg-background p-8">
                <p className="text-[11px] tracking-[0.08em] uppercase mb-3" style={{ color: ACCENT }}>{p.tag}</p>
                <h4 className="text-[16px] font-semibold text-foreground mb-2">{p.title}</h4>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 4 - Discovery / Audit */}
      <section className="w-full py-16">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>03 — Discovery &amp; Audit</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            An audit of the symptoms — and the real cause.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl border border-border p-8" style={{ backgroundColor: '#FAF9F6' }}>
              <p className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-5">What the audit surfaced</p>
              {auditBefore.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between py-3 border-b border-border last:border-0">
                  <span className="text-[14px] text-muted-foreground">{row.label}</span>
                  <span className="text-[22px] text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-8" style={{ backgroundColor: DARK }}>
              <p className="text-[11px] tracking-[0.1em] uppercase mb-5" style={{ color: '#D9A23A' }}>The unified target</p>
              {auditAfter.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between py-3 border-b border-white/10 last:border-0">
                  <span className="text-[14px] text-white/70">{row.label}</span>
                  <span className="text-[22px]" style={{ color: '#D9A23A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: DARK }}>
            <p className="text-[11px] tracking-[0.1em] uppercase mb-5" style={{ color: '#D9A23A' }}>Key Insight</p>
            <p className="text-[24px] md:text-[32px] leading-[1.3] text-white max-w-2xl">
              The problem was never <span style={{ color: '#D9A23A', fontStyle: 'italic' }}>missing components</span>. It was
              the absence of shared <span style={{ color: '#D9A23A', fontStyle: 'italic' }}>definitions and constraints</span>.
            </p>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 5 - Strategy */}
      <section className="w-full py-16 bg-card">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>04 — Strategy</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            Design the system as infrastructure, not a component library.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {principles.map((p) => (
              <div key={p.n} className="rounded-2xl border border-border bg-background p-8 relative overflow-hidden">
                <span className="absolute top-4 right-5 text-[40px] leading-none" style={{ color: '#F6E9CF' }}>{p.n}</span>
                <h3 className="text-[17px] font-semibold text-foreground mb-2 relative">{p.title}</h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground relative">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-5">Goals &amp; success signals</p>
              {goals.map((g) => (
                <div key={g.k} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                  <span className="text-[12px] font-medium min-w-[28px]" style={{ color: ACCENT }}>{g.k}</span>
                  <p className="text-[15px] text-foreground/80"><b className="text-foreground font-semibold">{g.label}</b> — {g.body}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-background p-8 h-fit">
              <p className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-4">Stakeholder alignment</p>
              <p className="text-[15px] leading-[1.6] text-muted-foreground mb-4">
                Because the system would reshape how four product teams worked, buy-in had to come before the build.
              </p>
              <p className="text-[15px] leading-[1.6] text-muted-foreground">
                I aligned product and engineering leads on a shared definition of "done," then anchored
                the first release to the Admin Portal — a live product that proved the system in real
                delivery, not in isolation.
              </p>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 6 - Process / token tiers */}
      <section className="w-full py-16">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>05 — Process</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            Built in three layers, from foundation up.
          </h2>

          <div className="space-y-4 mb-10">
            {tokenTiers.map((t) => (
              <div key={t.tier} className="rounded-2xl border border-border p-6 md:p-7 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-center" style={{ backgroundColor: '#FAF9F6' }}>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-1" style={{ color: ACCENT }}>{t.tier}</p>
                  <p className="text-[20px] text-foreground">{t.title}</p>
                  <p className="text-[12px] text-muted-foreground">{t.meta}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.chips.map((c) => (
                    <span key={c} className="text-[12px] font-mono bg-white border border-border px-3 py-1.5 rounded-lg text-foreground/80">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Typography & spacing scales', body: 'A single modular scale replaced 20+ ad-hoc spacing values and inconsistent type sizing.' },
              { title: 'Responsive variables', body: 'Breakpoint-aware tokens so layouts adapt predictably across admin and field surfaces.' },
              { title: 'Accessibility defaults', body: 'Contrast ratios and focus states defined at the token level — accessible unless deliberately broken.' },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-[13px] leading-[1.6] text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 7 - Build */}
      <section className="w-full py-16" style={{ backgroundColor: DARK }}>
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: '#D9A23A' }}>06 — Building the System</p>
          <h2 className="text-[28px] mb-4 leading-[1.3] text-white max-w-2xl">
            From atoms to patterns — a clear contribution path.
          </h2>
          <p className="text-[15px] leading-[1.6] max-w-2xl mb-10" style={{ color: '#B8B2A4' }}>
            I designed 35+ atomic and compound components, then assembled them into reusable patterns.
            Structure, naming, and governance made the library legible to anyone who opened it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden mb-10" style={{ backgroundColor: '#34302331' }}>
            {componentLayers.map((l) => (
              <div key={l.step} className="p-6" style={{ backgroundColor: '#211E16' }}>
                <p className="text-[10px] tracking-[0.1em] uppercase mb-3" style={{ color: '#D9A23A' }}>{l.step}</p>
                <p className="text-[20px] text-white mb-1">{l.title}</p>
                <p className="text-[12px] mb-4" style={{ color: '#8B8576' }}>{l.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {l.items.map((i) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-md border" style={{ backgroundColor: '#17150F', borderColor: '#3a3627', color: '#E9E3D4' }}>{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-7" style={{ backgroundColor: DARK, border: '1px solid #34302331' }}>
              <p className="text-[10px] tracking-[0.1em] uppercase mb-4" style={{ color: '#8B8576' }}>Naming convention</p>
              <code className="block text-[14px] leading-[2] text-[#E9E3D4] font-mono">
                <span style={{ color: '#D9A23A' }}>component</span>.<span style={{ color: '#7FB0A0' }}>element</span>.<span style={{ color: '#C99BD0' }}>property</span>.state
              </code>
              <code className="block text-[12px] font-mono mt-2" style={{ color: '#8B8576' }}>button.bg.primary.hover</code>
              <code className="block text-[12px] font-mono" style={{ color: '#8B8576' }}>input.border.default.focus</code>
              <code className="block text-[12px] font-mono" style={{ color: '#8B8576' }}>nav.item.text.active</code>
              <p className="text-[13px] mt-4 leading-[1.6]" style={{ color: '#B8B2A4' }}>
                Predictable, self-describing names that read the same in Figma and in code.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#211E16', border: '1px solid #34302331' }}>
                <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: '#D9A23A' }}>Figma structure</p>
                <p className="text-[13px] leading-[1.6]" style={{ color: '#B8B2A4' }}>
                  A layered file — primitives, semantic tokens, components, patterns — mirroring the
                  token tiers so the library is navigable by intent.
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#211E16', border: '1px solid #34302331' }}>
                <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: '#D9A23A' }}>Contribution model</p>
                <p className="text-[13px] leading-[1.6]" style={{ color: '#B8B2A4' }}>
                  A lightweight path for proposing, reviewing, and promoting components — so the system
                  could evolve with products instead of freezing behind them.
                </p>
              </div>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 8 - Rollout */}
      <section className="w-full py-16">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>07 — Adoption &amp; Rollout</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            Three sources of truth, one connected handoff.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {handoffTools.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[16px] font-semibold" style={{ backgroundColor: t.color }}>{t.logo}</span>
                  <div>
                    <h4 className="text-[15px] font-semibold text-foreground">{t.name}</h4>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-[13px] leading-[1.6] text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase mb-5" style={{ color: ACCENT }}>Migration approach</p>
              <p className="text-[22px] leading-[1.4] text-foreground">
                Rather than a risky big-bang rewrite, the system landed where it could prove itself —{' '}
                <span style={{ color: ACCENT, fontStyle: 'italic' }}>the Admin Portal first</span>.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[8px] top-2 bottom-2 w-px bg-border" />
              {rolloutSteps.map((s) => (
                <div key={s.step} className="relative pb-8 last:pb-0">
                  <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-background border-2" style={{ borderColor: ACCENT }} />
                  <p className="text-[11px] tracking-[0.1em] uppercase" style={{ color: ACCENT }}>{s.step}</p>
                  <h4 className="text-[16px] font-semibold text-foreground my-1.5">{s.title}</h4>
                  <p className="text-[14px] leading-[1.6] text-muted-foreground max-w-md">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 9 - Outcomes */}
      <section className="w-full py-16 bg-card">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>08 — Outcomes</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            Measurable gains in speed, consistency, and trust.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {outcomeMetrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-background p-7">
                <div className="text-[44px] leading-none mb-3" style={{ color: ACCENT }}>{m.value}</div>
                <p className="text-[13px] leading-[1.5] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quotes.map((q) => (
              <div key={q.attr} className="rounded-xl border border-border bg-background p-7" style={{ borderLeft: `3px solid ${ACCENT}` }}>
                <p className="text-[17px] italic leading-[1.5] text-foreground/90 mb-3">"{q.text}"</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-muted-foreground">{q.attr}</p>
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 10 - Learnings */}
      <section className="w-full py-16">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: ACCENT }}>09 — Key Learnings</p>
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground max-w-2xl">
            What building it from the ground up taught me.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {learnings.map((l) => (
              <div key={l.tag} className="rounded-2xl border border-border p-7">
                <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: ACCENT }}>{l.tag}</p>
                <h3 className="text-[17px] font-semibold text-foreground mb-4">{l.title}</h3>
                <ul className="space-y-3">
                  {l.items.map((item) => (
                    <li key={item} className="text-[13.5px] leading-[1.6] text-muted-foreground pl-4 relative">
                      <span className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: DARK }}>
            <p className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ color: '#D9A23A' }}>Reflection</p>
            <p className="text-[20px] md:text-[26px] leading-[1.4] max-w-2xl" style={{ color: '#EDE7D8' }}>
              Beyond components, the work was about <span style={{ color: '#D9A23A', fontStyle: 'italic' }}>structure, constraints,
              and documentation</span> teams could rely on over time. It gave me a foundation in designing
              systems as infrastructure — and the confidence to evolve them in close partnership with engineering.
            </p>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 11 - Navigation footer */}
      <section className="w-full py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.button
              onClick={() => navigate('/case-study/bm-dashboard')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: -3 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground transition-colors">BM Dashboard</span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/case-study/mobile-app')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3 }}
            >
              <span className="group-hover:text-foreground transition-colors">Mobile App</span>
              <ArrowRight className="w-4 h-4 group-hover:text-foreground transition-colors" />
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
