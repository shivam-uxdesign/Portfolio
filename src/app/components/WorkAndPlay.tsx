import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { trackEvent } from '../../lib/analytics';
import './workplay.css';
import { ProjectStacks } from './projects/ProjectStacks';
import { FloatingDeck } from './projects/FloatingDeck';
import type { ProjectGroup, ProjectGroupId, Impact } from './projects/types';
import { PROPS, type HatId } from './hats/props';

// One page, two sides: corporate case studies and things built for fun (mostly
// with AI). Phones: two stacks that fly open. md+: two columns, each with a
// featured project and two smaller ones.

export interface WorkItem { impact?: Impact; title: string; descriptor: string; number: string; bg: string; link: string; external?: boolean; thumbnail: ReactNode; tag?: string; system?: boolean }
export interface PlayItem { title: string; description: string; tag: string; color: string; image: string; link: string; cta?: string }

// The headline: the sticky notes perch on Work, the propeller beanie on Play.
// Part of the page itself, so it simply stays when the sheet is open.
function HatIcon({ id }: { id: HatId }) {
  return <svg viewBox={PROPS[id].vb} aria-hidden="true" dangerouslySetInnerHTML={{ __html: PROPS[id].svg(true) }} />;
}
function HatTitle({ sub }: { sub: string }) {
  return (
    <>
      <h2 className="wp-title text-foreground">
        <span className="wp-word">Work<span className="wp-hat wp-hat-a"><HatIcon id="notes" /></span></span>
        {' '}&amp;{' '}
        <span className="wp-word">Play<span className="wp-hat wp-hat-b"><HatIcon id="propeller" /></span></span>
      </h2>
      <p className="wp-sub">{sub}</p>
    </>
  );
}

// Phones: two decks — tap one and its projects fly out and float over the sheet.
function PhoneStacks({ work, play }: { work: WorkItem[]; play: PlayItem[] }) {
  const groups = useMemo<ProjectGroup[]>(() => [
    {
      id: 'work', label: 'Shipped at work', count: `${work.length} case studies`,
      heading: 'Shipped at work', sub: 'Product design at Rupyy and before.',
      items: work.map(p => ({ title: p.title, descriptor: p.descriptor, link: p.link, external: p.external, bg: p.bg, thumbnail: p.thumbnail, tag: p.tag ?? `Case study ${p.number}`, impact: p.impact })),
    },
    {
      id: 'fun', label: 'Built for fun, with AI', count: `${play.length} apps`,
      heading: 'Built for fun, with AI', sub: 'Small apps I made to play with ideas and AI tools.',
      items: play.map(f => ({ title: f.title, descriptor: f.description, link: f.link, bg: f.color, image: f.image, tag: f.tag, cta: f.cta })),
    },
  ], [work, play]);
  const [open, setOpen] = useState<{ id: ProjectGroupId; from: DOMRect; trigger: HTMLElement } | null>(null);
  const onOpen = useCallback((id: ProjectGroupId, from: DOMRect, trigger: HTMLElement) => {
    setOpen({ id, from, trigger });
    trackEvent('project_stack_opened', { stack: id });
  }, []);
  const onClose = useCallback(() => setOpen(o => { o?.trigger.focus({ preventScroll: true }); return null; }), []);
  const group = open && groups.find(g => g.id === open.id);
  const headRef = useRef<HTMLDivElement>(null);
  return (
    <div className="md:hidden w-full min-h-full flex flex-col gap-5 pt-1 pb-4 px-1">
      {/* While a deck is out, its own title takes this heading's place. */}
      <div ref={headRef} className="transition-opacity duration-200" style={{ opacity: open ? 0 : 1 }}>
        <HatTitle sub={`${work.length} case studies · ${play.length} apps`} />
      </div>
      <ProjectStacks groups={groups} onOpen={onOpen} layout="column" />
      {open && group && <FloatingDeck group={group} trigger={open.trigger} anchor={headRef.current} onClose={onClose} />}
    </div>
  );
}

// Laptops: two columns split by a hairline. Each: one featured project across
// the column, two smaller ones beneath — all six visible, no scrolling.
interface Entry { impact?: Impact; to: string; external?: boolean; side: 'work' | 'play'; thumb: ReactNode; eyebrow: string; title: string; desc: string; cta: string }

function EntryLink({ e, className, children }: { e: Entry; className: string; children: ReactNode }) {
  const onClick = () => trackEvent('project_open', { side: e.side, link: e.to });
  return e.external
    ? <a href={e.to} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} draggable={false}>{children}</a>
    : <Link to={e.to} className={className} onClick={onClick} draggable={false}>{children}</Link>;
}

function Column({ id, heading, entries, playful, after }: { id: string; heading: ReactNode; entries: Entry[]; playful?: boolean; after?: ReactNode }) {
  const [main, ...rest] = entries;
  return (
    <section className={`wpd-col${playful ? ' playful' : ''}`} aria-labelledby={id}>
      <h3 id={id} className="wpd-heading">{heading}</h3>
      <EntryLink e={main} className="wpd-feature">
        <span className="wpd-thumb">{main.thumb}</span>
        <span className="wpd-text">
          <span className="wpd-eyebrow">{main.eyebrow}</span>
          <span className="wpd-title">{main.title}</span>
          {main.impact
            ? <>
                <span className="wpd-big">{main.impact.big}</span>
                <span className="wpd-sub">{main.impact.sub}</span>
                {main.impact.note && <span className="wpd-note">{main.impact.note}</span>}
              </>
            : <span className="wpd-desc">{main.desc}</span>}
          <span className="wpd-cta">{main.cta} <span aria-hidden="true">→</span></span>
        </span>
      </EntryLink>
      {after ?? <div className="wpd-pair">
        {rest.map(e => (
          <EntryLink key={e.to} e={e} className="wpd-small">
            <span className="wpd-thumb">{e.thumb}</span>
            <span className="wpd-eyebrow">{e.eyebrow}</span>
            <span className="wpd-title">{e.title}</span>
          </EntryLink>
        ))}
      </div>}
    </section>
  );
}

// The design system: one story (opens the overview), three tools (each opens its own case study).
function SystemCard({ items }: { items: WorkItem[] }) {
  const track = (to: string) => () => trackEvent('project_open', { side: 'work', link: to });
  return (
    <div className="wpd-system">
      <Link to="/case-study/rupyy-design-system" className="wpd-sys-head" onClick={track('/case-study/rupyy-design-system')} draggable={false}>
        <span className="wpd-eyebrow">Case study · Rupyy · 3 tools</span>
        <span className="wpd-sys-row">
          <span className="wpd-title">The Rupyy design system</span>
          <span className="wpd-big wpd-big-sm">3 tools · 1 kit</span>
        </span>
        <span className="wpd-sub">that ended the one-designer queue for six PMs</span>
        <span className="wpd-cta">See how they fit <span aria-hidden="true">→</span></span>
      </Link>
      <div className="wpd-sys-tools">
        {items.map(p => (
          <Link key={p.link} to={p.link} className="wpd-small wpd-sys-tool" onClick={track(p.link)} draggable={false}>
            <span className="wpd-thumb"><span className="absolute inset-0" style={{ background: p.bg }}>{p.thumbnail}</span></span>
            <span className="wpd-title">{p.title}</span>
            {p.impact?.short && <span className="wpd-short">{p.impact.short[0]}<span className="em">{p.impact.short[1]}</span>{p.impact.short[2]}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function WorkAndPlay({ work, play }: { work: WorkItem[]; play: PlayItem[] }) {
  const system = work.filter(p => p.system);
  const workEntries: Entry[] = work.filter(p => !p.system).map(p => ({
    to: p.link, impact: p.impact, external: p.external, side: 'work', eyebrow: p.tag ?? `Case study ${p.number}`, title: p.title, desc: p.descriptor, cta: 'Read case study',
    thumb: <span className="absolute inset-0" style={{ background: p.bg }}><span className="wp-thumb">{p.thumbnail}</span></span>,
  }));
  const playEntries: Entry[] = play.map(f => ({
    to: f.link, side: 'play', eyebrow: f.tag, title: f.title, desc: f.description, cta: f.cta ?? 'Try it',
    thumb: <span className="absolute inset-0" style={{ background: f.color }}><img src={f.image} alt="" loading="lazy" draggable={false} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} /></span>,
  }));
  return (
    <>
      <PhoneStacks work={work} play={play} />
      <div className="wpd hidden md:flex">
        <header className="wpd-head">
          <HatTitle sub={`${work.length} case studies · ${play.length} apps built with AI`} />
        </header>
        <div className="wpd-cols">
          <Column id="wp-work" heading="Shipped at work" entries={workEntries} after={system.length ? <SystemCard items={system} /> : undefined} />
          <Column id="wp-play" heading="Built for fun, with AI" entries={playEntries} playful />
        </div>
      </div>
    </>
  );
}
