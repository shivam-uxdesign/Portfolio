import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { trackEvent } from '../../lib/analytics';
import { ProjectStacks } from './projects/ProjectStacks';
import { ProjectOverlay } from './projects/ProjectOverlay';
import type { ProjectGroup, ProjectGroupId } from './projects/types';

// One page, two sides: corporate case studies on the left, things built for
// fun (mostly with AI) on the right. Side by side from md up, stacked on
// phones. Cards respond to their column's width (container queries), not the
// viewport, so they hold up at every split.

export interface WorkItem { title: string; descriptor: string; number: string; bg: string; link: string; external?: boolean; thumbnail: ReactNode }
export interface PlayItem { title: string; description: string; tag: string; color: string; image: string; link: string }

function Card({ to, external, onOpen, thumb, eyebrow, title, desc, cta }: {
  to: string; external?: boolean; onOpen: () => void; thumb: ReactNode; eyebrow: string; title: string; desc: string; cta: string;
}) {
  const cls = 'wp-card group flex items-stretch gap-3 @md:gap-4 rounded-2xl p-2 -m-2 text-left transition-colors hover:bg-foreground/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const body = (
    <>
      <span className="relative shrink-0 w-[34%] @md:w-[40%] aspect-[4/3] @lg:aspect-[16/10] rounded-xl overflow-hidden outline outline-1 -outline-offset-1 outline-black/5">
        {thumb}
      </span>
      <span className="flex min-w-0 flex-col justify-center gap-1 py-0.5">
        <span className="text-[10px] font-semibold tracking-[0.09em] uppercase text-muted-foreground">{eyebrow}</span>
        <span className="text-[13px] @md:text-[15px] font-semibold leading-snug text-foreground line-clamp-3 @md:line-clamp-2">{title}</span>
        <span className="hidden @2xs:block text-[12px] @md:text-[13px] leading-snug text-muted-foreground line-clamp-2">{desc}</span>
        <span className="mt-0.5 text-[11.5px] font-semibold text-foreground opacity-80 group-hover:opacity-100">{cta} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
      </span>
    </>
  );
  return external
    ? <a href={to} target="_blank" rel="noopener noreferrer" className={cls} onClick={onOpen}>{body}</a>
    : <Link to={to} className={cls} onClick={onOpen}>{body}</Link>;
}

function SideHeader({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub: string }) {
  return (
    <div className="mb-3 @md:mb-5">
      <p className="text-[11px] font-medium tracking-[0.09em] uppercase text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-1 text-[1.35rem] @md:text-[1.7rem] font-medium leading-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>{title}</h2>
      <p className="mt-1 text-[12.5px] @md:text-[13px] text-muted-foreground">{sub}</p>
    </div>
  );
}

// Phones: two decks — tap one and its projects open in a bottom sheet.
function PhoneStacks({ work, play }: { work: WorkItem[]; play: PlayItem[] }) {
  const groups = useMemo<ProjectGroup[]>(() => [
    {
      id: 'work', label: 'Shipped at work', count: `${work.length} case studies`,
      heading: 'Shipped at work', sub: 'Product design at Rupyy and before.',
      items: work.map(p => ({ title: p.title, descriptor: p.descriptor, link: p.link, external: p.external, bg: p.bg, thumbnail: p.thumbnail, tag: `Case study ${p.number}` })),
    },
    {
      id: 'fun', label: 'Built for fun, with AI', count: `${play.length} apps`,
      heading: 'Built for fun, with AI', sub: 'Small apps I made to play with ideas and AI tools.',
      items: play.map(f => ({ title: f.title, descriptor: f.description, link: f.link, bg: f.color, image: f.image, tag: f.tag })),
    },
  ], [work, play]);
  const [open, setOpen] = useState<{ id: ProjectGroupId; from: DOMRect; trigger: HTMLElement } | null>(null);
  const onOpen = useCallback((id: ProjectGroupId, from: DOMRect, trigger: HTMLElement) => {
    setOpen({ id, from, trigger });
    trackEvent('project_stack_opened', { stack: id });
  }, []);
  const onClose = useCallback(() => setOpen(o => { o?.trigger.focus({ preventScroll: true }); return null; }), []);
  const group = open && groups.find(g => g.id === open.id);
  return (
    <div className="md:hidden w-full min-h-full flex flex-col gap-5 pt-1 pb-4 px-1">
      <div>
        <p className="text-[11px] font-medium tracking-[0.09em] uppercase text-muted-foreground">Work &amp; Play</p>
        <h2 className="mt-1 text-[1.35rem] font-medium leading-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>Pick a stack</h2>
      </div>
      <ProjectStacks groups={groups} onOpen={onOpen} layout="column" />
      {open && group && <ProjectOverlay group={group} from={open.from} onClose={onClose} />}
    </div>
  );
}

export function WorkAndPlay({ work, play }: { work: WorkItem[]; play: PlayItem[] }) {
  const SERIF = "'Playfair Display', Georgia, serif";
  return (
    <>
    <PhoneStacks work={work} play={play} />
    <div className="hidden w-full min-h-full bg-background md:grid grid-cols-2 items-start content-center gap-6 lg:gap-10 py-4">
      {/* Corporate */}
      <section className="@container flex flex-col px-2 lg:px-4 md:pt-5 lg:pt-6" aria-labelledby="wp-work">
        <SideHeader eyebrow="Selected work" title={<span id="wp-work">Shipped at work</span>} sub="Product design at Rupyy and before. Case studies with the numbers." />
        <ul className="flex flex-col gap-4 @md:gap-5">
          {work.map(p => (
            <li key={p.link}>
              <Card
                to={p.link} external={p.external}
                onOpen={() => trackEvent('project_open', { side: 'work', link: p.link })}
                thumb={<span className="absolute inset-0" style={{ background: p.bg }}><span className="wp-thumb">{p.thumbnail}</span></span>}
                eyebrow={`Case study ${p.number}`} title={p.title} desc={p.descriptor} cta="Read case study"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Fun / AI experiments — a distinct, playful panel */}
      <section className="@container flex flex-col rounded-3xl border border-dashed border-foreground/15 bg-foreground/[0.025] px-4 py-5 md:px-6 md:py-6 lg:px-8" aria-labelledby="wp-play">
        <SideHeader
          eyebrow="Fun & experiments"
          title={<span id="wp-play">Built for <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500 }} className="text-primary">fun</span>, with AI</span>}
          sub="Small apps I made to play with ideas and AI tools."
        />
        <ul className="flex flex-col gap-4 @md:gap-5">
          {play.map(f => (
            <li key={f.link}>
              <Card
                to={f.link}
                onOpen={() => trackEvent('project_open', { side: 'play', link: f.link })}
                thumb={<span className="absolute inset-0" style={{ background: f.color }}><img src={f.image} alt="" loading="lazy" draggable={false} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} /></span>}
                eyebrow={f.tag} title={f.title} desc={f.description} cta="Try it"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
    </>
  );
}
