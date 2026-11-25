import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Home as HomeIcon, ArrowUp } from 'lucide-react';
import { Link } from 'react-router';
import { AboutPanel } from '../components/cells/AboutPanel';
import { ImageGallery } from '../components/ImageGallery';
import { OffFigmaPanel } from '../components/cells/OffFigmaPanel';
import { ResumePanel } from '../components/cells/ResumePanel';
import { AboutBlock } from '../components/AboutBlock';
import { FunProjects } from '../components/FunProjects';
import { CTACard } from '../components/CTACard';
import { StackContent } from './StackPage';
import { trackEvent } from '../../lib/analytics';
import { HatsHero } from '../components/hats/HatsHero';
import { WorkPeek } from '../components/hats/WorkPeek';
import { HATS, PAL, type WearableId } from '../components/hats/hatsData';
import { HeroBridgeContext, createHeroBridge, useHeroBridge, useHeroBridgeStore } from '../components/hats/heroBridge';

// ─── Grid config ─────────────────────────────────────────────────────────────
// Layout:  [Gallery]  [Work ↑]   [Fun]
//          [About ←]  [HERO   ]  [Contact →]
//          [Interests] [Resume ↓] [Stack]
type CellId = 'gallery' | 'work' | 'fun' | 'about' | 'hero' | 'contact' | 'interests' | 'resume' | 'stack';
type Pos = { row: number; col: number };

const GRID: { id: CellId; label: string }[][] = [
  [{ id: 'gallery',   label: 'Gallery'   }, { id: 'work',      label: 'Work'      }, { id: 'fun',       label: 'Fun'       }],
  [{ id: 'about',     label: 'About'     }, { id: 'hero',      label: 'Home'      }, { id: 'contact',   label: 'Contact'   }],
  [{ id: 'interests', label: 'Interests' }, { id: 'resume',    label: 'Resume'    }, { id: 'stack',     label: 'Stack'     }],
];

const HOME_POS: Pos = { row: 1, col: 1 };

// Intro reveal order: one consistent top-left → bottom-right stagger, no
// per-cell variance.
const REVEAL_RANK: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
const DRAG_THRESHOLD = 55;
const NAV_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const NAV_MS = 600;

function mod(n: number, m: number) { return ((n % m) + m) % m; }

function findPosForCellId(id: string): Pos | null {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (GRID[r][c].id === id) return { row: r, col: c };
    }
  }
  return null;
}

// ─── Project card thumbnails ─────────────────────────────────────────────────
function DashboardThumbnail() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#0F1923' }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: '#131F2E', borderBottom: '1px solid #1D2D3E' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8A9E7B' }} />
          <div className="h-1.5 w-20 rounded-sm" style={{ backgroundColor: '#1D2D3E' }} />
        </div>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#1D2D3E' }} />
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#1D2D3E' }} />
        </div>
      </div>
      <div className="flex gap-2 px-4 py-3">
        {[{ v: '1,240', w: '70%' }, { v: '32m→5m', w: '40%' }, { v: '84%', w: '84%' }].map((s, i) => (
          <div key={i} className="flex-1 rounded-lg p-2.5" style={{ backgroundColor: '#131F2E' }}>
            <div className="text-[8px] font-semibold mb-1" style={{ color: '#E0DDD8' }}>{s.v}</div>
            <div className="h-1 rounded-full w-full" style={{ backgroundColor: '#1D2D3E' }}>
              <div className="h-full rounded-full" style={{ backgroundColor: '#8A9E7B', width: s.w }} />
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 space-y-0">
        {[
          { id: '#1847', dot: '#F59E0B', bar: 65 }, { id: '#1846', dot: '#8A9E7B', bar: 100 },
          { id: '#1845', dot: '#60A5FA', bar: 80 },  { id: '#1844', dot: '#8A9E7B', bar: 100 },
          { id: '#1843', dot: '#6B7280', bar: 20 },  { id: '#1842', dot: '#F59E0B', bar: 45 },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid #1D2D3E' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: row.dot }} />
            <div className="h-1.5 w-8 rounded-sm shrink-0" style={{ backgroundColor: '#2A3D50' }} />
            <div className="h-1.5 flex-1 rounded-sm" style={{ backgroundColor: '#1D2D3E' }}>
              <div className="h-full rounded-sm" style={{ backgroundColor: row.dot + '55', width: `${row.bar}%` }} />
            </div>
            <div className="h-3.5 w-14 rounded-sm shrink-0" style={{ backgroundColor: row.dot + '22' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignSystemThumbnail() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#B8A898' }}>
      <div className="absolute inset-3 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FAF9F6', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div className="px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid #E8E7E4' }}>
          <div className="h-2.5 w-32 rounded-sm" style={{ backgroundColor: '#1C1C1A', opacity: 0.9 }} />
          <div className="mt-1.5 h-1.5 w-20 rounded-sm" style={{ backgroundColor: '#D0CEC9' }} />
        </div>
        <div className="px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid #E8E7E4' }}>
          <div className="h-1.5 w-12 rounded-sm mb-2" style={{ backgroundColor: '#C4C0BB' }} />
          <div className="flex gap-1.5">
            {['#8A9E7B','#1C1C1A','#B8A898','#5B8FBF','#B8865C','#E8E7E4'].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-md" style={{ backgroundColor: c, border: '1.5px solid rgba(0,0,0,0.08)' }} />
            ))}
          </div>
        </div>
        <div className="px-4 py-2.5 flex gap-2 items-center" style={{ borderBottom: '1px solid #E8E7E4' }}>
          <div className="h-6 w-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8A9E7B' }}>
            <div className="h-1.5 w-8 rounded-sm" style={{ backgroundColor: '#fff' }} />
          </div>
          <div className="h-6 w-16 rounded-lg border flex items-center justify-center" style={{ borderColor: '#1C1C1A' }}>
            <div className="h-1.5 w-8 rounded-sm" style={{ backgroundColor: '#1C1C1A', opacity: 0.6 }} />
          </div>
        </div>
        <div className="px-4 pt-2.5 grid grid-cols-3 gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="rounded-xl p-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E4' }}>
              <div className="h-1.5 w-full rounded-sm mb-1.5" style={{ backgroundColor: '#F2F1EF' }} />
              <div className="h-1.5 w-3/4 rounded-sm" style={{ backgroundColor: '#E8E7E4' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileAppThumbnail() {
  const coral = '#E8685A';
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#8BACC0' }}>
      <div className="relative overflow-hidden" style={{ width: 148, height: 252, borderRadius: 22, backgroundColor: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between px-3" style={{ height: 16, backgroundColor: coral }}>
          <span style={{ fontSize: 5, fontWeight: 700, color: '#fff' }}>9:41</span>
        </div>
        <div className="flex items-center justify-between px-3" style={{ height: 22, backgroundColor: coral }}>
          <span style={{ fontSize: 6, fontWeight: 800, letterSpacing: '0.1em', color: '#fff' }}>NOTQUIET</span>
        </div>
        <div className="flex items-center gap-1 px-3" style={{ height: 28, backgroundColor: coral }}>
          {['#F4A261','#E76F51','#2A9D8F','#E9C46A','#264653'].map((c, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: c, border: '1.5px solid rgba(255,255,255,0.6)' }} />
          ))}
        </div>
        <div style={{ backgroundColor: '#fff', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ c1: '#8BACC0', c2: coral }, { c1: '#8A9E7B', c2: '#B8A898' }, { c1: '#E9C46A', c2: '#F4A261' }].map((post, i) => (
            <div key={i}>
              <div style={{ height: 7, width: 40, borderRadius: 2, backgroundColor: '#1C1C1A', opacity: 0.85, marginBottom: 3 }} />
              <div style={{ height: 5, width: 60, borderRadius: 2, backgroundColor: '#E8E7E4', marginBottom: 5 }} />
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 50, height: 34, borderRadius: 4, backgroundColor: post.c1 }} />
                <div style={{ width: 50, height: 34, borderRadius: 4, backgroundColor: post.c2, opacity: 0.75 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MotionLink = motion.create(Link);

// Work: the Sales Case Card on its own, then the Rupyy design system as one
// story told in three case studies (each also opens on its own).
const thumb = (slug: string) => <img src={`/case-studies/thumbs/${slug}.webp`} alt="" loading="lazy" draggable={false} className="w-full h-full object-cover" />;
export const PROJECTS = [
  {
    title: 'Sales Case Card',
    descriptor: 'A case card that tells a business manager whose move it is. 6 of 6 BMs preferred it.',
    number: '01', tag: 'Case study · Rupyy', bg: '#EFEBE3', link: '/case-study/sales-case-card', external: false,
    thumbnail: thumb('sales-case-card'),
    impact: { big: '98 → 12', sub: '“where is my case?” tickets a month', note: 'First full month after launch' },
  },
  {
    title: 'Journey Studio', descriptor: 'Any journey, proven before it’s built.',
    number: '02', tag: 'Design system · 1 of 3', system: true, bg: '#E3ECFD', link: '/case-study/journey-studio', external: false,
    thumbnail: thumb('journey-studio'),
    impact: { big: '6 → 1.5 days', sub: 'to prototype a three-team journey', short: ['Prototyped in ', '1.5 days', ''] },
  },
  {
    title: 'Design Kit', descriptor: 'One design system, released like software.',
    number: '03', tag: 'Design system · 2 of 3', system: true, bg: '#DFF1E8', link: '/case-study/design-kit', external: false,
    thumbnail: thumb('design-kit'),
    impact: { big: '½ day → 20 min', sub: 'to get one change into every studio', short: ['Any change in ', '20 min', ''] },
  },
  {
    title: 'Illustration Studio', descriptor: 'State illustrations, self-serve.',
    number: '04', tag: 'Design system · 3 of 3', system: true, bg: '#F8E4B2', link: '/case-study/illustration-studio', external: false,
    thumbnail: thumb('illustration-studio'),
    impact: { big: '1 day → 10 min', sub: 'for a state graphic, made by the PM', short: ['A graphic in ', '10 min', ''] },
  },
];

// ─── Cell components ──────────────────────────────────────────────────────────

type NavDir = 'up' | 'down';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function HeroCell({ onNavigateDir }: { onNavigateDir: (dir: NavDir) => void }) {
  const [isNameHovered, setIsNameHovered] = useState(false);
  const bridge = useHeroBridgeStore();
  const heroActive = useHeroBridge(s => s.heroActive);
  // Quantised so a pinch re-renders this cell only at 0 → partial → 1, not per frame.
  const overviewStep = useHeroBridge(s => (s.overview <= 0 ? 0 : s.overview >= 1 ? 1 : 0.5));
  const hat = useHeroBridge(s => s.hat);
  // Decided once: hats wait off-screen and fly in when the intro's zoom lands.
  const [deferEntrance] = useState(() => bridge.get().introActive);

  // Tagline swap: fade the old line out, then bring the new one in.
  const [shownHat, setShownHat] = useState<WearableId>(hat);
  const [swapping, setSwapping] = useState(false);
  useEffect(() => {
    if (hat === shownHat) return;
    if (prefersReducedMotion()) { setShownHat(hat); return; }
    setSwapping(true);
    const t = setTimeout(() => { setShownHat(hat); setSwapping(false); }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hat]);
  const info = HATS.find(h => h.id === shownHat);

  const onHatChange = useCallback((h: WearableId) => bridge.set({ hat: h }), [bridge]);
  const onWear = useCallback((h: string) => trackEvent('hat_worn', { hat: h }), []);

  return (
    <div className="hh-cell w-full h-full flex flex-col items-center justify-center bg-background gap-3 md:gap-4 select-text overflow-hidden">

      {/* ── Text: above the stage on phones, below it from md up ── */}
      <div
        className="hh-text order-1 md:order-2 flex-shrink-0 flex flex-col items-center text-center w-full"
        style={{ '--hh-accent': PAL[hat].accent, '--hh-ink': PAL[hat].ink } as React.CSSProperties}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[11px] font-medium tracking-[0.09em] text-muted-foreground uppercase mb-1"
        >
          Hey, I am
        </motion.div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-medium leading-[0.92] cursor-default relative"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 4rem)',
              color: 'var(--foreground)',
              letterSpacing: isNameHovered ? '0.01em' : '-0.04em',
              transition: 'letter-spacing 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={() => setIsNameHovered(true)}
            onMouseLeave={() => setIsNameHovered(false)}
          >
            Shivam
            <motion.span
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 1, 0] }}
              transition={{ delay: 1.2, duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
            />
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          aria-live="polite"
          className={`hh-tagline text-[13px] md:text-[14px] leading-snug text-muted-foreground mt-2 max-w-[34em] min-h-[2.9em]${swapping ? ' swap' : ''}`}
        >
          {info
            ? <><em>{info.name}.</em> {info.line}</>
            : <>A product designer who works from <em>strategy</em> to pixel. I wear a lot of hats.</>}
        </motion.p>
        <button
          type="button"
          onClick={() => onNavigateDir('up')}
          aria-label="Go to Work"
          className="mt-2 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Work <ArrowUp size={11} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>

      {/* ── Stage: the portrait card with the hat orbit ── */}
      <div className="hh-stage-wrap order-2 md:order-1 w-full">
        <HatsHero
          isActive={heroActive}
          overviewProgress={overviewStep}
          deferEntrance={deferEntrance}
          onHatChange={onHatChange}
          onWear={onWear}
        />
      </div>
    </div>
  );
}

export function WorkCell({ onNavigateDir }: { onNavigateDir?: (dir: NavDir) => void }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    // Outer wrapper stays overflow-visible so the peek's fingers can curl over
    // the bottom edge into the cell's safe-area padding.
    <div className="relative w-full h-full">
    <div className="w-full h-full bg-background flex flex-col overflow-hidden">
      <div className="px-8 md:px-12 pt-6 md:pt-12 pb-3 md:pb-4 flex-shrink-0">
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase mb-1.5 md:mb-2">Selected Work</p>
        <h2 className="text-[21px] md:text-[32px] text-foreground leading-tight">Everything I've Shipped</h2>
      </div>
      <div className="flex-1 min-h-0 px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        {PROJECTS.map((project, idx) => {
          const isHov = hoveredCard === idx;
          return (
            <MotionLink
              key={idx}
              to={project.link}
              className="rounded-xl overflow-hidden relative block h-full min-h-[170px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: project.bg }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              animate={{ y: isHov ? -3 : 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] as const }}
            >
              {project.thumbnail}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.96) 100%)' }} />
              <div
                className="absolute top-3 right-3 text-[10px] font-medium tracking-[0.06em] text-white rounded-full px-2 py-0.5"
                style={{ backgroundColor: `rgba(0,0,0,${isHov ? 0.45 : 0.3})`, backdropFilter: 'blur(4px)', transition: 'background-color 0.3s ease' }}
              >
                {project.number}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 pr-16" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                <div className="text-white text-[12px] font-medium leading-[1.35] mb-1.5">{project.title}</div>
                <p className="text-white/75 text-[11px] leading-[1.5]">{project.descriptor}</p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHov ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-3 left-3 text-white/85 text-[10px] font-medium whitespace-nowrap"
              >
                View →
              </motion.div>
            </MotionLink>
          );
        })}
      </div>
    </div>
    {onNavigateDir && <WorkPeek onBackToHero={() => onNavigateDir('down')} />}
    </div>
  );
}

export function AboutCell() {
  return <AboutPanel />;
}

export function GalleryCell() {
  return (
    <div className="w-full h-full bg-background flex flex-col overflow-hidden">
      <div className="px-8 md:px-12 pt-12 pb-6 flex-shrink-0 border-b border-border">
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase mb-3">Gallery</p>
        <h2 className="text-[32px] md:text-[42px] font-semibold text-foreground leading-none mb-3">Process &amp; Practice</h2>
        <p className="text-[13px] text-muted-foreground max-w-md leading-snug">
          Brush before pixel — a running thread of the desk, the sketchbook, and the work in between.
        </p>
      </div>
      <div className="flex-1 min-h-0 px-6 md:px-10 py-8">
        <ImageGallery />
      </div>
    </div>
  );
}

export function FunCell() {
  return (
    <div className="w-full h-full bg-background p-4">
      <FunProjects />
    </div>
  );
}

export function ContactCell() {

  return (
    // Phones: the ask at the top, the compose card fills the rest down to the navigator.
    <div className="w-full min-h-full flex items-stretch md:items-center bg-background px-1 md:px-16 lg:px-20 pt-1 pb-1 md:py-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 md:gap-4 lg:gap-14 md:items-center">
        {/* Left — greeting, status, signature */}
        <div className="flex flex-col gap-3 md:gap-5 max-w-[420px]">
          {/* Page label, with the availability status folded in. */}
          <p className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            Contact
            <span aria-hidden="true">·</span>
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            Open to work
          </p>

          <h2 className="text-[clamp(23px,7.2cqw,27px)] md:text-[36px] leading-[1.12] text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Got a project, a role,<br className="hidden md:inline" />{' '}
            or just want to{' '}
            <span className="whitespace-nowrap">
              <span className="em">talk shop</span>?
            </span>
          </h2>

          <p className="ct-extra text-[13px] text-muted-foreground leading-relaxed">
            Full-time, freelance, or just a second opinion on a flow — I'm one message away.
          </p>

          <p
            className="ct-sig hidden md:block text-[13px] text-muted-foreground/70 border-l-2 border-border pl-3 leading-snug"
            style={{ fontWeight: 500 }}
          >
            Let's build something worth shipping. — Shivam
          </p>
        </div>

        {/* Right — CTA */}
        <div className="w-full max-w-[420px] lg:justify-self-end flex flex-1 min-h-0 max-h-[400px] md:block md:max-h-none">
          <CTACard />
        </div>
      </div>
    </div>
  );
}

export function InterestsCell() {
  return <OffFigmaPanel />;
}

export function ResumeCell() {
  return <ResumePanel />;
}

export function StackCell() {
  return <StackContent />;
}

// ─── Intro skeleton / crossfade ────────────────────────────────────────────
// Used only for the one-time intro loading sequence (see computeRunIntro / the
// intro sequencing effect in Home()). Two generic layout variants stand in for
// a cell's real content until it's ready to reveal — they don't need to
// pixel-match each leaf component, since the crossfade hides any mismatch.
const MEDIA_CELLS: CellId[] = ['hero', 'about', 'gallery', 'fun'];

function CellSkeleton({ id, revealRank }: { id: CellId; revealRank: number }) {
  const isMedia = MEDIA_CELLS.includes(id);
  const style = { animationDelay: `${revealRank * 0.07}s` };
  return (
    <div className="w-full h-full flex flex-col gap-3">
      {isMedia ? (
        <>
          <div className="intro-shimmer h-1/2 w-full rounded-xl" style={style} />
          <div className="intro-shimmer h-3 w-2/3 rounded-md" style={style} />
          <div className="intro-shimmer h-3 w-1/2 rounded-md" style={style} />
          <div className="intro-shimmer flex-1 w-full rounded-xl" style={style} />
        </>
      ) : (
        <>
          <div className="intro-shimmer h-3 w-1/3 rounded-md" style={style} />
          <div className="intro-shimmer h-6 w-2/3 rounded-md" style={style} />
          <div className="intro-shimmer h-3 w-full rounded-md" style={style} />
          <div className="intro-shimmer h-3 w-5/6 rounded-md" style={style} />
          <div className="intro-shimmer flex-1 w-full rounded-xl mt-2" style={style} />
        </>
      )}
    </div>
  );
}

// Both layers stay mounted throughout (opacity-only crossfade, no
// mount/unmount) so the real content's images start downloading during the
// skeleton phase — a free head start for the Unsplash-backed cells.
function CellCrossfade({ id, skeletonMode, revealRank, onNavigateDir }: { id: CellId; skeletonMode: boolean; revealRank: number; onNavigateDir: (dir: NavDir) => void }) {
  const delay = revealRank * 0.07; // seconds — one consistent top-left → bottom-right stagger
  // Same duration/easing/delay for every cell (no per-cell variance) — the only
  // thing that differs across cells is this shared delay.
  const revealTransition = { duration: 0.45, delay: skeletonMode ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: skeletonMode ? 0 : 1, scale: skeletonMode ? 0.98 : 1, y: skeletonMode ? 8 : 0 }}
        transition={revealTransition}
      >
        <CellContent id={id} onNavigateDir={onNavigateDir} />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: skeletonMode ? 1 : 0 }}
        transition={revealTransition}
        style={{ pointerEvents: skeletonMode ? 'auto' : 'none' }}
      >
        <CellSkeleton id={id} revealRank={revealRank} />
      </motion.div>
    </div>
  );
}

function CellContent({ id, onNavigateDir }: { id: CellId; onNavigateDir: (dir: NavDir) => void }) {
  switch (id) {
    case 'hero':      return <HeroCell onNavigateDir={onNavigateDir} />;
    case 'work':      return <WorkCell onNavigateDir={onNavigateDir} />;
    case 'about':     return <AboutCell />;
    case 'gallery':   return <GalleryCell />;
    case 'fun':       return <FunCell />;
    case 'contact':   return <ContactCell />;
    case 'interests': return <InterestsCell />;
    case 'resume':    return <ResumeCell />;
    case 'stack':     return <StackCell />;
    default:          return null;
  }
}

// ─── Compass ─────────────────────────────────────────────────────────────────
function Compass({ pos, onNavigate, onHome, pulse }: {
  pos: Pos;
  onNavigate: (r: number, c: number) => void;
  onHome: () => void;
  pulse?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 rounded-2xl border border-border/60 p-1.5"
      style={{ backdropFilter: 'blur(10px)', boxShadow: '0 12px 28px -14px rgba(20,20,18,0.25)', transformOrigin: 'bottom right' }}
      initial={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
      whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.3)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className="grid grid-cols-3 gap-0.5 relative">
        {[0, 1, 2].flatMap(r =>
          [0, 1, 2].map(c => {
            const isCenter = r === 1 && c === 1;
            const isActive = pos.row === r && pos.col === c;
            const key = `${r}-${c}`;
            const label = isCenter ? 'Home (zoom out)' : GRID[r][c].label;
            // During the first-visit pulse, also reveal the label for "you are here"
            // without requiring a hover — teaches the tooltip exists.
            const showLabel = hovered === key || (pulse && isActive);
            return (
              <div key={key} className="relative flex items-center justify-center">
                {/* Custom tooltip */}
                <AnimatePresence>
                  {showLabel && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
                    >
                      <span className="text-[10px] font-medium tracking-[0.04em] px-2 py-1 rounded-md bg-foreground text-background shadow-lg">
                        {label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* First-visit pulse ring */}
                {pulse && (
                  <motion.span
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: isCenter ? 14 : 8,
                      height: isCenter ? 14 : 8,
                      border: '1.5px solid var(--primary)',
                    }}
                    animate={{ scale: [1, 2.1, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: (r + c) * 0.08 }}
                  />
                )}

                {/* Tap target is deliberately larger than the visible dot (~24-28px vs 7-14px)
                    so this stays usable as the primary mobile nav method. */}
                <button
                  onClick={isCenter ? onHome : () => onNavigate(r, c)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(key)}
                  onBlur={() => setHovered(null)}
                  aria-label={isCenter ? 'Return to Home' : `Go to ${GRID[r][c].label}`}
                  className={[
                    'group relative rounded-full transition-all duration-200 flex items-center justify-center',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                    isCenter ? 'w-6 h-6' : 'w-5 h-5',
                    // 44px minimum touch target on coarse pointers (WCAG 2.5.5)
                    'pointer-coarse:w-11 pointer-coarse:h-11',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'rounded-full transition-all duration-200 flex items-center justify-center',
                      isCenter
                        ? 'w-3 h-3 border border-foreground/40 group-hover:border-foreground/80'
                        : 'w-[7px] h-[7px]',
                      !isCenter && isActive
                        ? 'bg-primary scale-125'
                        : !isCenter
                        ? 'bg-foreground/22 group-hover:bg-primary/55'
                        : isActive
                        ? 'bg-foreground/80'
                        : 'bg-foreground/12',
                    ].join(' ')}
                  >
                    {isCenter && (
                      <HomeIcon
                        className="w-[6px] h-[6px]"
                        style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                      />
                    )}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// ─── Edge indicators ─────────────────────────────────────────────────────────
function EdgeIndicators({
  actualPos,
  onUp, onDown, onLeft, onRight,
}: {
  actualPos: Pos;
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
}) {
  const dirs = [
    { key: 'up',    r: mod(actualPos.row - 1, 3), c: actualPos.col,             style: 'top-4 left-1/2 -translate-x-1/2 flex-col',          rotate: 0,    onClick: onUp,    vertical: false },
    { key: 'down',  r: mod(actualPos.row + 1, 3), c: actualPos.col,             style: 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse', rotate: 180,  onClick: onDown,  vertical: false },
    { key: 'left',  r: actualPos.row,              c: mod(actualPos.col - 1, 3), style: 'left-4 top-1/2 -translate-y-1/2 flex-col',            rotate: -90,  onClick: onLeft,  vertical: true },
    { key: 'right', r: actualPos.row,              c: mod(actualPos.col + 1, 3), style: 'right-4 top-1/2 -translate-y-1/2 flex-col-reverse',   rotate: 90,   onClick: onRight, vertical: true },
  ];

  return (
    <>
      {dirs.map(({ key, r, c, style, rotate, onClick, vertical }) => (
        <button
          key={key}
          onClick={onClick}
          aria-label={`Go to ${GRID[r][c].label}`}
          className={`fixed z-40 flex items-center gap-2 p-1.5 -m-1.5 ${style} group select-none`}
        >
          <span
            className="text-foreground/65 group-hover:text-foreground/90 transition-colors duration-200"
            style={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '8px solid currentColor',
              transform: `rotate(${rotate}deg)`,
            }}
          />
          <span
            className="text-[9px] tracking-[0.1em] uppercase text-foreground/65 group-hover:text-foreground/80 transition-colors duration-200 font-medium"
            style={vertical ? { writingMode: 'vertical-rl' } : undefined}
          >
            {GRID[r][c].label}
          </span>
        </button>
      ))}
    </>
  );
}

// ─── World transform ─────────────────────────────────────────────────────────
// World is 500% × 500% (5×5 grid: real 3×3 content cells + 1-cell clone border).
// physPos ranges from -1 to 3; positions 0-2 are real content, -1 and 3 are clones.
// When wrapping, the animation always moves in the correct direction (into the clone),
// then physPos is silently rebased to the equivalent real cell after the animation.
// Overview: scale(0.333) translate(-20%, -20%) — shows the center 3×3 (world x/y 100-400vw)
// Normal: scale(1) translate(-(col+1)*20%, -(row+1)*20%) — shows physPos cell
function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

// Default tween curve — fast initial motion, soft landing. Extracted so it can
// be the default `easing` for startTween while individual callers (namely the
// intro) can opt into a different curve.
function easeOutExpo(t: number) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

// A clean, monotonic ease-out (no overshoot) — numerically approximates
// cubic-bezier(0.16, 1, 0.3, 1) closely enough for this rAF-driven tween.
// Used by the intro's final zoom so it reads as a plain scale/opacity
// transition, not a spring.
function easeOutQuint(t: number) { return t >= 1 ? 1 : 1 - Math.pow(1 - t, 5); }

// progress: 0 = normal (viewing physPos), 1 = fully zoomed out to the overview grid.
//
// This interpolates the VISIBLE WORLD-RECT BOUNDS linearly (not scale/translate
// directly) and derives scale/translate from those bounds. That distinction matters:
// lerping scale linearly while translate is lerped independently produces a path where
// the focused cell drifts off-center and the interpolation is non-monotonic (cells can
// momentarily reverse direction or clip past the viewport edge mid-transition). Lerping
// the bounds themselves guarantees the focused cell stays exactly centered and every
// other cell's edge position moves monotonically into place — verified algebraically:
// with a(p) = lerp(cellStart, 0.2, p) for the visible rect's left/top edge (in world
// fractions), width(p) = 0.2 + 0.4p is independent of which cell is focused, so a single
// uniform `scale(p) = 1/(1+2p)` works for both axes regardless of physPos.
function worldTransform(physPos: Pos, progress: number) {
  const p = progress;
  const scale = 1 / (1 + 2 * p);
  const colFrac = (physPos.col + 1) / 5;
  const rowFrac = (physPos.row + 1) / 5;
  const aX = colFrac + (0.2 - colFrac) * p;
  const aY = rowFrac + (0.2 - rowFrac) * p;
  const tx = -aX * 100;
  const ty = -aY * 100;
  return `scale(${scale.toFixed(5)}) translate(${tx.toFixed(4)}%, ${ty.toFixed(4)}%)`;
}

// CellOverlayLabel removed — overview chrome is now a fixed overlay (OverviewFrame)

// Renders all 25 world cells (3×3 real + 1-cell clone border). `runIntro`/
// `skeletonMode` are rarely-changing primitives for the one-time intro
// sequence (runIntro never changes after mount, skeletonMode flips at most
// once); `hoveredCell` changes only on mouse enter/leave between grid cells
// during the overview (not the high-frequency per-frame pinch updates), so
// re-rendering on it is cheap and doesn't reintroduce the cost this memo
// exists to avoid.
const WorldCells = memo(function WorldCells({ runIntro, skeletonMode, hoveredCell, onNavigateDir }: { runIntro: boolean; skeletonMode: boolean; hoveredCell: string | null; onNavigateDir: (dir: NavDir) => void }) {
  return (
    <>
      {([-1, 0, 1, 2, 3]).flatMap(pr =>
        ([-1, 0, 1, 2, 3]).map(pc => {
          const actualRow = mod(pr, 3);
          const actualCol = mod(pc, 3);
          const cell = GRID[actualRow][actualCol];
          const colIdx = pc + 1; // 0-4
          const rowIdx = pr + 1;
          // Clone-border cells (pr/pc = -1 or 3) are never on-screen during the
          // intro since physPos doesn't move until the final zoom lands.
          const isRealCell = pr >= 0 && pr <= 2 && pc >= 0 && pc <= 2;
          const isHovered = hoveredCell === `${actualRow}-${actualCol}`;
          return (
            <div
              key={`${pr}-${pc}`}
              // Clone-border cells duplicate a real cell's content purely for
              // seamless wrap-around scrolling — without this, every focusable
              // element inside them (contact form, gallery links, project
              // cards) is reachable by keyboard/screen reader up to 3x, mostly
              // off-screen and in an order unrelated to what's visually
              // focused. `inert` removes the whole subtree from both. Set via
              // a ref, not the JSX prop — React 18's runtime doesn't yet
              // serialize `inert` to the DOM (added in React 19), even though
              // the installed @types/react does type it.
              ref={(el) => { if (el) el.inert = !isRealCell; }}
              style={{
                position: 'absolute',
                left:   `${(colIdx / 5) * 100}%`,
                top:    `${(rowIdx / 5) * 100}%`,
                width:  '20%',
                height: '20%',
                overflow: 'hidden',
              }}
            >
              {/* Safe-zone padding — keeps cell content clear of the fixed nav
                  chrome (edge labels, compass) at every viewport size, so
                  text/cards can never render underneath them. */}
              <div className="w-full h-full box-border pt-8 pl-9 pr-14 pb-14 md:pt-10 md:pl-11 md:pr-16 md:pb-16">
                {/* Subtle zoom on the thumbnail itself when this cell is
                    hovered in the overview grid — the outer div above already
                    clips overflow, so the scale never bleeds into a neighbor. */}
                <div style={{
                  width: '100%', height: '100%',
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {runIntro && isRealCell ? (
                    <CellCrossfade
                      id={cell.id}
                      skeletonMode={skeletonMode}
                      revealRank={REVEAL_RANK[actualRow][actualCol]}
                      onNavigateDir={onNavigateDir}
                    />
                  ) : (
                    <CellContent id={cell.id} onNavigateDir={onNavigateDir} />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
});

// ─── Intro sequence ──────────────────────────────────────────────────────────
// Decides, once, whether this mount should play the intro loading animation.
// It's a first-visit tutorial, not a loading state, so it plays once ever per
// browser (localStorage flag) — a deep-linked hash or reduced-motion also skip it.
function computeRunIntro(): boolean {
  try {
    if (localStorage.getItem('hasSeenIntro')) return false;
    if (window.location.hash) return false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  } catch {
    return false;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Home() {
  // Stable for the component's lifetime — decided once at mount.
  const [runIntro] = useState(() => computeRunIntro());
  // Written unconditionally on mount regardless of which branch computeRunIntro
  // took, so a repeat visit, a hash-skip, or a reduced-motion-skip all count as
  // "seen" — the intro is guaranteed at most once ever for this browser.
  useEffect(() => {
    try { localStorage.setItem('hasSeenIntro', '1'); } catch {}
  }, []);

  // physPos ranges -1 to 3; after every wrap animation it is rebased to 0-2
  const [physPos, setPhysPos] = useState<Pos>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      return (hash && findPosForCellId(hash)) || HOME_POS;
    } catch {
      return HOME_POS;
    }
  });
  // Seeded true only when the intro will run — blocks all real navigation until
  // the intro's own onComplete clears it. Every nav entry point (Compass, wheel/
  // touch, EdgeIndicators, keyboard) already checks this, so no new guards needed.
  const [locked, setLocked] = useState(() => runIntro);
  // 0 = normal, 1 = fully zoomed out to the overview grid. This is the ONE value that
  // drives every cell's transform, the focused cell's own content, and the grid chrome
  // overlay — all three read it every frame from the same rAF loop below, so nothing can
  // desync (see the animation core further down for how it's driven).
  // Seeded straight to 1 when running the intro — worldTransform is provably
  // physPos-independent at progress===1, so this is "already zoomed out" from
  // the very first paint, no animation needed to get there.
  const [overviewProgress, setOverviewProgress] = useState(() => (runIntro ? 1 : 0));
  // Intro-only: flips true → false exactly once to trigger each cell's crossfade.
  const [skeletonMode, setSkeletonMode] = useState(() => runIntro);
  // Intro-only: true for the intro's entire duration, cleared only in its own
  // onComplete. Deliberately separate from `locked`/`overviewProgress` (which get
  // reused by every later dismiss/goHome animation) so a later, unrelated zoom
  // can never be mistaken for the intro still running.
  const [introActive, setIntroActive] = useState(() => runIntro);
  // Intro-only: brief true just before the zoom fires — a purely cosmetic
  // "gather" (the grid pulls in a couple percent) applied on a wrapper outside
  // the geometry-critical world/chrome transforms, so it can never affect them.
  const [introGather, setIntroGather] = useState(false);
  // Intro-only: the "Use ← → ↑ ↓ to explore" nav hint — appears once the grid
  // content finishes loading, fades out before the zoom back into Home begins.
  const [introHintVisible, setIntroHintVisible] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    try {
      return !localStorage.getItem('nav-hint-seen');
    } catch {
      return true;
    }
  });
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  // noTransition disables CSS transition for the silent rebase snap
  const [noTransition, setNoTransition] = useState(false);
  const worldRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  // Refs so event handlers (wheel, touch) never go stale
  const physPosRef = useRef(physPos);
  const lockedRef = useRef(locked);
  const overviewProgressRef = useRef(overviewProgress); // mirrors the rendered value every frame
  // true for the entire duration of a live pinch gesture (wheel or touch) — generalizes
  // the old touch-only isPinchingRef. While true, the rAF loop below follows
  // targetProgressRef directly (no easing curve, just a fast smoothing catch-up) and
  // every other nav trigger is blocked.
  const gestureActiveRef = useRef(false);
  const navigateRef = useRef<(r: number, c: number) => void>(() => {});
  const goHomeRef = useRef<() => void>(() => {});
  const dismissOverviewRef = useRef<(target: Pos) => void>(() => {});

  // ── Single animation core for the overview zoom ──────────────────────────────
  // targetProgressRef is "where we're heading" — set directly by gesture input, or by
  // startTween for a programmatic settle (Escape, goHome, tap-to-cell, gesture-end).
  // One rAF loop is the only thing that ever writes overviewProgress: during a live
  // gesture it smooths toward targetProgressRef (so a single chunky input event can't
  // produce a hard cut); otherwise, if a tween is active, it advances a proper
  // time+easing-based interpolation. This is the one place all cells' geometry and the
  // grid chrome overlay ultimately read from — see worldTransform and the chrome render.
  const targetProgressRef = useRef(0);
  const tweenActiveRef = useRef(false);
  const tweenStartRef = useRef(0);
  const tweenStartTimeRef = useRef(0);
  const tweenTargetRef = useRef<0 | 1>(0);
  const tweenCompleteRef = useRef<(() => void) | null>(null);
  // Per-call overrides (default to the ordinary dismiss feel) — only the intro's
  // final zoom currently opts into a different duration/easing. Scale + opacity
  // only, deliberately — no blur filter on any zoom leg.
  const tweenDurationRef = useRef(620);
  const tweenEasingRef = useRef<(t: number) => number>(easeOutExpo);
  const SETTLE_MS = 620;

  const startTween = useCallback((
    target: 0 | 1,
    onComplete?: () => void,
    opts?: { durationMs?: number; easing?: (t: number) => number },
  ) => {
    tweenStartRef.current = overviewProgressRef.current;
    tweenStartTimeRef.current = performance.now();
    tweenTargetRef.current = target;
    tweenCompleteRef.current = onComplete ?? null;
    tweenDurationRef.current = opts?.durationMs ?? SETTLE_MS;
    tweenEasingRef.current = opts?.easing ?? easeOutExpo;
    tweenActiveRef.current = true;
    targetProgressRef.current = target;
  }, []);
  const startTweenRef = useRef(startTween);
  useEffect(() => { startTweenRef.current = startTween; }, [startTween]);

  // ── Intro sequencing ──────────────────────────────────────────────────────
  // Skeleton → reveal → nav hint → gather → zoom-to-Home, reusing startTween
  // for the last step exactly as a manual tap-to-dismiss would. A click/tap/
  // keypress at any point hard-skips: it cancels every remaining step outright
  // and jumps straight to the fully-loaded Home panel (not just a fast-forward).
  const introSkipRef = useRef(false);
  const introSkipResolversRef = useRef<Array<() => void>>([]);
  useEffect(() => {
    if (!runIntro) return;

    const skip = () => {
      if (introSkipRef.current) return;
      introSkipRef.current = true;
      introSkipResolversRef.current.forEach(r => r());
      introSkipResolversRef.current = [];
      // Hard-cut to the final state — cancel any in-flight tween/gather/hint
      // rather than merely fast-forwarding the remaining wait timers.
      tweenActiveRef.current = false;
      overviewProgressRef.current = 0;
      setOverviewProgress(0);
      setSkeletonMode(false);
      setIntroGather(false);
      setIntroHintVisible(false);
      setLocked(false);
      setIntroActive(false);
    };
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });

    const wait = (ms: number) => new Promise<void>(resolve => {
      if (introSkipRef.current) { resolve(); return; }
      const t = setTimeout(resolve, ms);
      introSkipResolversRef.current.push(() => { clearTimeout(t); resolve(); });
    });

    let cancelled = false;
    (async () => {
      try {
        await Promise.race([
          document.fonts?.ready ?? Promise.resolve(),
          new Promise(r => setTimeout(r, 600)),
        ]);
      } catch { /* ignore */ }
      if (cancelled || introSkipRef.current) return;

      await wait(500); // brief presence beat before the cascade starts
      if (cancelled || introSkipRef.current) return;
      setSkeletonMode(false); // crossfade cascades top-left → bottom-right, one uniform stagger

      // Cascade takes ~1s to finish (rank 8 * 70ms stagger + its own 450ms fade)
      // — wait for it to fully land before showing the nav hint. Total time the
      // zoomed-out grid is on screen (this + the hint dwell below) lands ~2.5s,
      // and all of it is doing work (reveal, then the hint), not sitting idle.
      await wait(1010);
      if (cancelled || introSkipRef.current) return;

      setIntroHintVisible(true);
      await wait(700); // long enough to actually read the hint
      if (cancelled || introSkipRef.current) return;
      setIntroHintVisible(false);
      await wait(300); // let the hint's own fade-out finish before the zoom
      if (cancelled || introSkipRef.current) return;

      // Anticipation: a brief, subtle "gather" before the release — wind-up
      // before the zoom, purely cosmetic (see the wrapper div in the render).
      setIntroGather(true);
      await wait(120);
      if (cancelled || introSkipRef.current) { setIntroGather(false); return; }
      setIntroGather(false);

      // Clean scale + opacity zoom — no blur, no overshoot — a plain ease-out
      // curve approximating cubic-bezier(0.16, 1, 0.3, 1).
      startTweenRef.current(0, () => {
        setLocked(false);
        setIntroActive(false);
      }, {
        durationMs: 650,
        easing: easeOutQuint,
      });
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  // Shared live-drag smoothing step (exponential catch-up toward targetProgressRef).
  // Called from the rAF loop below AND directly from the wheel/touch input handlers
  // themselves — the latter is a deliberate belt-and-suspenders: real input events
  // already arrive many times a second, so nudging the rendered value right on the
  // event (not waiting for the next animation frame) means live-tracking motion is
  // never solely dependent on rAF cadence. rAF still adds extra smoothing between
  // events when it fires normally; this just guarantees a floor of responsiveness.
  const stepGestureRef = useRef(() => {
    const current = overviewProgressRef.current;
    const target = targetProgressRef.current;
    const next = current + (target - current) * 0.45;
    const settled = Math.abs(target - next) < 0.0008 ? target : next;
    overviewProgressRef.current = settled;
    setOverviewProgress(settled);
  });

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (gestureActiveRef.current) {
        stepGestureRef.current();
      } else if (tweenActiveRef.current) {
        const elapsed = performance.now() - tweenStartTimeRef.current;
        const t = clamp01(elapsed / tweenDurationRef.current);
        // Default is easeOutExpo (fast initial motion, soft landing), same for both
        // directions by design — but a caller (namely the intro) can supply its own
        // curve/duration via startTween's opts for a distinct feel.
        const eased = tweenEasingRef.current(t);
        const start = tweenStartRef.current;
        const end = tweenTargetRef.current;
        const value = t >= 1 ? end : start + (end - start) * eased;
        overviewProgressRef.current = value;
        setOverviewProgress(value);
        if (t >= 1) {
          tweenActiveRef.current = false;
          const cb = tweenCompleteRef.current;
          tweenCompleteRef.current = null;
          if (cb) cb();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => { physPosRef.current = physPos; }, [physPos]);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { overviewProgressRef.current = overviewProgress; }, [overviewProgress]);

  // First-visit hint: auto-dismiss after ~4s and never show again on this device
  useEffect(() => {
    if (!showHint) return;
    try {
      localStorage.setItem('nav-hint-seen', '1');
    } catch {
      // localStorage unavailable — hint will simply reappear next load
    }
    const timer = setTimeout(() => setShowHint(false), 4200);
    return () => clearTimeout(timer);
  }, [showHint]);

  // Pinch tracking refs (multi-touch for mobile)
  const pinchRef = useRef<{ active: boolean; initialDist: number; initialProgress: number }>({
    active: false, initialDist: 0, initialProgress: 0,
  });

  // Actual (0-2) position for compass/edge display
  const actualPos: Pos = { row: mod(physPos.row, 3), col: mod(physPos.col, 3) };

  // Deep links — keep the URL hash in sync with the active cell, and let a
  // shared link (e.g. /#about) jump straight there without polluting history.
  useEffect(() => {
    const id = GRID[actualPos.row][actualPos.col].id;
    const nextHash = id === 'hero' ? '' : `#${id}`;
    if (window.location.hash !== nextHash) {
      const url = window.location.pathname + window.location.search + nextHash;
      window.history.replaceState(null, '', url || '/');
    }
    trackEvent('cell_view', { cell: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPos.row, actualPos.col]);

  // ── Navigation ──
  const navigateTo = useCallback((r: number, c: number) => {
    if (locked || gestureActiveRef.current) return;
    setLocked(true);
    setPhysPos({ row: r, col: c });
    setShowHint(false);

    // If target is a clone cell (outside 0-2), rebase silently after the animation
    const needsRebase = r < 0 || r > 2 || c < 0 || c > 2;
    if (needsRebase) {
      setTimeout(() => {
        const rebasedRow = r < 0 ? r + 3 : r > 2 ? r - 3 : r;
        const rebasedCol = c < 0 ? c + 3 : c > 2 ? c - 3 : c;
        setNoTransition(true);
        setPhysPos({ row: rebasedRow, col: rebasedCol });
        // Double rAF: first frame React commits DOM, second frame browser paints it,
        // then we re-enable the transition — the snap is invisible
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setNoTransition(false);
          setLocked(false);
        }));
      }, NAV_MS);
    } else {
      setTimeout(() => setLocked(false), NAV_MS);
    }
  }, [locked]);

  useEffect(() => { navigateRef.current = navigateTo; }, [navigateTo]);

  // Relative up/down step through the existing navigation, for in-cell nudges
  // (Hero's "Work ↑", tapping the Work peek). Stable identity, so it can be
  // passed through the memoised WorldCells without re-rendering them.
  const navigateDir = useCallback((dir: NavDir) => {
    const p = physPosRef.current;
    navigateRef.current(p.row + (dir === 'up' ? -1 : 1), p.col);
  }, []);

  // ── Hero/hats bridge — read-only mirror of grid state for the hats ──
  const [heroBridge] = useState(() => createHeroBridge({ introActive: runIntro, overview: runIntro ? 1 : 0 }));
  const currentCellId = GRID[actualPos.row][actualPos.col].id;
  const prevCellRef = useRef<string | null>(null);
  const lastCellRef = useRef<string>(currentCellId);
  if (lastCellRef.current !== currentCellId) {
    prevCellRef.current = lastCellRef.current;
    lastCellRef.current = currentCellId;
  }
  const cellSettled = overviewProgress === 0 && !introActive && !locked;
  useEffect(() => {
    heroBridge.set({
      cell: currentCellId,
      prevCell: prevCellRef.current,
      settled: cellSettled,
      heroActive: cellSettled && physPos.row === HOME_POS.row && physPos.col === HOME_POS.col,
      overview: overviewProgress,
      introActive,
    });
  }, [heroBridge, currentCellId, cellSettled, physPos.row, physPos.col, overviewProgress, introActive]);

  // ── Dismiss overview onto a specific tapped/clicked cell ──
  // Only actionable once fully settled in overview (progress === 1). Repositioning
  // happens instantly with no snap trick needed: at progress exactly 1, worldTransform
  // is mathematically independent of physPos (see its comment), so changing physPos
  // here has zero visual effect until the tween below actually starts moving progress
  // away from 1 — at which point it correctly zooms into the NEW cell.
  const dismissOverview = useCallback((target: Pos) => {
    if (overviewProgressRef.current !== 1 || lockedRef.current) return;
    setLocked(true);
    setHoveredCell(null);
    setPhysPos(target);
    startTweenRef.current(0, () => setLocked(false));
  }, []);

  useEffect(() => { dismissOverviewRef.current = dismissOverview; }, [dismissOverview]);

  // ── Home zoom transition (compass button — zooms out, snaps to hero, zooms back in) ──
  const goHome = useCallback(() => {
    if (locked) return;
    setLocked(true);
    setShowHint(false);

    startTweenRef.current(1, () => {
      // At progress exactly 1 the transform is physPos-independent (see worldTransform),
      // so this reposition is invisible — the zoom-in tween below then correctly eases
      // into the new (Home) cell.
      setPhysPos(HOME_POS);
      setTimeout(() => {
        startTweenRef.current(0, () => setLocked(false));
      }, 220); // brief dwell at full zoom-out before zooming back in
    });
  }, [locked]);

  useEffect(() => { goHomeRef.current = goHome; }, [goHome]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't hijack arrow-key/Escape presses meant for a focused form field
      // (e.g. moving the text cursor in the contact form's message box) —
      // confirmed bug: without this, arrow keys there silently discarded
      // typed input and navigated the whole page instead.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'Escape') {
        if (overviewProgressRef.current > 0 || gestureActiveRef.current || tweenActiveRef.current) {
          gestureActiveRef.current = false;
          pinchRef.current.active = false;
          setLocked(true);
          setHoveredCell(null);
          startTweenRef.current(0, () => setLocked(false));
        }
        return;
      }
      if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'ArrowUp')    navigateTo(physPos.row - 1, physPos.col);
      if (e.key === 'ArrowDown')  navigateTo(physPos.row + 1, physPos.col);
      if (e.key === 'ArrowLeft')  navigateTo(physPos.row,     physPos.col - 1);
      if (e.key === 'ArrowRight') navigateTo(physPos.row,     physPos.col + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [physPos, navigateTo]);

  // ── Wheel / trackpad scroll navigation + trackpad pinch ──
  useEffect(() => {
    const wheelAccum = { x: 0, y: 0 };
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let pinchEndTimer: ReturnType<typeof setTimeout> | null = null;
    const THRESHOLD = 90;
    const PINCH_RANGE = 190; // deltaY units to sweep the full 0→1 overview range

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Trackpad pinch: browsers fire wheel with ctrlKey=true. Continuous live-tracking —
      // raw input accumulates into targetProgressRef; the rAF loop (above) smooths the
      // rendered value toward it every frame, so bursty/chunky real hardware events
      // never produce a hard cut.
      if (e.ctrlKey) {
        if (lockedRef.current) return;
        gestureActiveRef.current = true;
        tweenActiveRef.current = false; // a new gesture takes over from any settle-in-flight
        targetProgressRef.current = clamp01(targetProgressRef.current + e.deltaY / PINCH_RANGE);
        stepGestureRef.current();

        if (pinchEndTimer) clearTimeout(pinchEndTimer);
        pinchEndTimer = setTimeout(() => {
          gestureActiveRef.current = false;
          const committed = targetProgressRef.current > 0.5;
          setLocked(true);
          startTweenRef.current(committed ? 1 : 0, () => setLocked(false));
        }, 220); // no further ctrlKey-wheel events for 220ms → gesture ended
        return;
      }

      if (lockedRef.current || gestureActiveRef.current) return;

      wheelAccum.x += e.deltaX;
      wheelAccum.y += e.deltaY;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { wheelAccum.x = 0; wheelAccum.y = 0; }, 350);

      const { x, y } = wheelAccum;
      const domX = Math.abs(x), domY = Math.abs(y);

      if (domX > domY && domX > THRESHOLD) {
        wheelAccum.x = 0; wheelAccum.y = 0;
        navigateRef.current(physPosRef.current.row, physPosRef.current.col + (x > 0 ? 1 : -1));
      } else if (domY > domX && domY > THRESHOLD) {
        wheelAccum.x = 0; wheelAccum.y = 0;
        navigateRef.current(physPosRef.current.row + (y > 0 ? 1 : -1), physPosRef.current.col);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
      if (pinchEndTimer) clearTimeout(pinchEndTimer);
    };
  }, []); // empty — uses refs only

  // ── Pinch-to-overview (native touch events, empty deps — uses refs only) ──
  // Continuous live-tracking — progress follows finger distance in real time; settling
  // to fully in/out is decided only once the gesture ends (mirrors the wheel handler).
  useEffect(() => {
    const getDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const SENSITIVITY = 3.4; // pinch travel → progress sweep

    const endGesture = () => {
      pinchRef.current.active = false;
      gestureActiveRef.current = false;
      const committed = targetProgressRef.current > 0.5;
      setLocked(true);
      startTweenRef.current(committed ? 1 : 0, () => setLocked(false));
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        if (lockedRef.current) return;
        gestureActiveRef.current = true;
        tweenActiveRef.current = false;
        pinchRef.current = {
          active: true,
          initialDist: getDist(e.touches),
          initialProgress: overviewProgressRef.current,
        };
        targetProgressRef.current = overviewProgressRef.current;
      } else {
        gestureActiveRef.current = false;
        pinchRef.current.active = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pinchRef.current.active || e.touches.length < 2) return;
      e.preventDefault(); // block browser native pinch-zoom
      const ratio = getDist(e.touches) / pinchRef.current.initialDist;
      // Fingers together (ratio < 1) → progress rises toward 1 (overview)
      targetProgressRef.current = clamp01(pinchRef.current.initialProgress + (1 - ratio) * SENSITIVITY);
      stepGestureRef.current();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2 && pinchRef.current.active) endGesture();
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ── Safety net: a gesture that never fires a clean end event (tab loses focus
  // mid-pinch, browser eats a touchend) shouldn't permanently wedge navigation.
  useEffect(() => {
    const clearStuckGesture = () => {
      if (!gestureActiveRef.current) return;
      gestureActiveRef.current = false;
      pinchRef.current.active = false;
      const committed = targetProgressRef.current > 0.5;
      setLocked(true);
      startTweenRef.current(committed ? 1 : 0, () => setLocked(false));
    };
    window.addEventListener('blur', clearStuckGesture);
    document.addEventListener('visibilitychange', clearStuckGesture);
    return () => {
      window.removeEventListener('blur', clearStuckGesture);
      document.removeEventListener('visibilitychange', clearStuckGesture);
    };
  }, []);

  // ── Pointer (mouse + single-touch) drag/swipe ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return; // ignore secondary touch points (the pinch finger)
    dragStart.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || !e.isPrimary) return;
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx > 8 || dy > 8) didDrag.current = true;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current || !e.isPrimary) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = null;

    if (!didDrag.current) {
      // Tap with no drag: once fully settled in overview, navigate to the tapped cell
      if (overviewProgressRef.current === 1 && !locked) {
        const row = Math.min(2, Math.max(0, Math.floor(e.clientY / window.innerHeight * 3)));
        const col = Math.min(2, Math.max(0, Math.floor(e.clientX / window.innerWidth * 3)));
        dismissOverview({ row, col });
      }
      return;
    }

    // Swipe navigation — skip if pinching
    if (locked || gestureActiveRef.current) return;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) navigateTo(physPos.row, physPos.col - 1);
      else        navigateTo(physPos.row, physPos.col + 1);
    } else {
      if (dy > 0) navigateTo(physPos.row - 1, physPos.col);
      else        navigateTo(physPos.row + 1, physPos.col);
    }
  };

  // The overview zoom (gesture-live or settle-tween) is driven entirely by the rAF loop
  // above — overviewProgress is already a smooth, eased per-frame value in that case, so
  // NO CSS transition should be layered on top of it (that would double-animate/lag).
  // A CSS transition is only wanted for plain cell-to-cell panning (navigateTo, compass,
  // edge arrows), where overviewProgress stays constant and only physPos changes.
  const transition = noTransition || gestureActiveRef.current || tweenActiveRef.current
    ? 'none'
    : `transform ${NAV_MS}ms ${NAV_EASE}`;
  // Suppressed during the intro's hold — overviewProgress sits at 1 before
  // there's anything for the user to dismiss yet.
  const hintOpacity = introActive ? 0 : clamp01((overviewProgress - 0.6) / 0.4);

  return (
    <HeroBridgeContext.Provider value={heroBridge}>
    <div
      className="fixed inset-0 overflow-hidden bg-background select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Gather wrapper — a brief, purely cosmetic pre-zoom "anticipation" scale
          (see introGather in the intro sequencing effect). Sits outside the
          world/chrome divs' own geometry-critical transforms, so it can never
          affect them — it only ever composes as an outer scale. */}
      <div style={{ position: 'absolute', inset: 0, transform: introGather ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.18s ease' }}>
        {/* World — 500% × 500% of viewport (5×5 cells: real 3×3 + 1-cell clone border) */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            width: '500%',
            height: '500%',
            transformOrigin: '0 0',
            transform: worldTransform(physPos, overviewProgress),
            transition,
            willChange: 'transform',
          }}
        >
          <WorldCells runIntro={runIntro} skeletonMode={skeletonMode} hoveredCell={hoveredCell} onNavigateDir={navigateDir} />
        </div>

        {/* ── Grid chrome overlay ── */}
        {/* Lives in the EXACT SAME transformed coordinate space as WorldCells — identical
            transform/transition string, positioned per-cell via the same percentage
            geometry WorldCells uses. That's what guarantees lockstep: there is only ONE
            shared transform, so the chrome (ring, numeral, dot, label) can never drift
            out of sync with the real content beneath it or with each other. Sizes below
            are ~3x their intended resting appearance (1/0.333) because this whole layer
            gets scaled down by the same ancestor transform that shrinks the real cells —
            exactly how the real cell content already handles it. */}
        {overviewProgress > 0 && (
            <div
              className="absolute z-30"
              style={{
                width: '500%',
                height: '500%',
                transformOrigin: '0 0',
                transform: worldTransform(physPos, overviewProgress),
                transition,
                willChange: 'transform',
                // Gated on !locked too, not just the visual progress — the settle tween's
                // completion callback (which clears `locked`) can fire slightly after the
                // value is visually indistinguishable from 1, so a click landing in that
                // gap would otherwise be silently swallowed by dismissOverview's guard.
                pointerEvents: overviewProgress === 1 && !locked ? 'auto' : 'none',
              }}
            >
              {[0, 1, 2].flatMap(r => [0, 1, 2].map(c => {
                const cell = GRID[r][c];
                const isActive = actualPos.row === r && actualPos.col === c;
                const isHovered = hoveredCell === `${r}-${c}`;
                const colIdx = c + 1, rowIdx = r + 1;
                // Cells sit flush (no gap/padding) — the only separation between
                // them is the 1px hairline below, so each cell contributes just
                // its right/bottom edge, plus a left/top edge for the first
                // column/row, giving a single 1px line everywhere (no doubling
                // at shared internal edges).
                const borderColor = 'var(--border)';
                const hairline = 3; // local units — ~1px once scaled down to rest

                return (
                  <button
                    type="button"
                    key={`${r}-${c}`}
                    tabIndex={overviewProgress === 1 && !locked ? 0 : -1}
                    aria-label={`Go to ${cell.label}`}
                    className="absolute text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{
                      left: `${(colIdx / 5) * 100}%`,
                      top: `${(rowIdx / 5) * 100}%`,
                      width: '20%',
                      height: '20%',
                      opacity: overviewProgress,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredCell(`${r}-${c}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onFocus={() => setHoveredCell(`${r}-${c}`)}
                    onBlur={() => setHoveredCell(null)}
                    onClick={() => dismissOverviewRef.current({ row: r, col: c })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        dismissOverviewRef.current({ row: r, col: c });
                      }
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden box-border"
                      style={{
                        borderRight: `${hairline}px solid ${borderColor}`,
                        borderBottom: `${hairline}px solid ${borderColor}`,
                        borderLeft: c === 0 ? `${hairline}px solid ${borderColor}` : undefined,
                        borderTop: r === 0 ? `${hairline}px solid ${borderColor}` : undefined,
                      }}
                    >
                      {/* Active dot — top-right, same sage motif as Compass/Contact */}
                      <div
                        className="absolute top-0 right-0 pointer-events-none"
                        style={{ padding: 21, opacity: isActive ? 1 : 0, transition: 'opacity 0.28s ease' }}
                      >
                        <div className="rounded-full bg-primary" style={{
                          width: 18, height: 18,
                          boxShadow: '0 6px 18px rgba(138,158,123,0.5)',
                        }} />
                      </div>

                      {/* Hover reveal — darkens the full cell edge-to-edge, cell name
                          settles into the center. Replaces the old always-on
                          numeral/label bar. */}
                      <div
                        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(20,20,18,0.55)',
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.28s ease',
                        }}
                      >
                        <span
                          className="font-semibold uppercase leading-none"
                          style={{
                            fontSize: 27,
                            letterSpacing: '0.12em',
                            color: 'white',
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'scale(1)' : 'scale(0.92)',
                            transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          {cell.label}
                        </span>
                        {/* Sage accent underline — same motif as the active dot/Compass */}
                        <div
                          className="bg-primary"
                          style={{
                            height: 3,
                            width: isHovered ? 54 : 0,
                            marginTop: 15,
                            borderRadius: 3,
                            opacity: isHovered ? 1 : 0,
                            transition: 'width 0.32s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, opacity 0.25s ease 0.05s',
                          }}
                        />
                      </div>
                    </div>
                  </button>
                );
              }))}
            </div>
        )}
      </div>

      {/* Dismiss hint — fixed positioning (not part of the zoomed content), so
          it lives outside the gather wrapper and shares nothing but the
          computed opacity with the grid above. */}
      {overviewProgress > 0 && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
          style={{
            opacity: hintOpacity,
            transform: `translateX(-50%) translateY(${8 - hintOpacity * 8}px)`,
          }}
        >
          <div className="flex items-center gap-[7px] px-3.5 py-[7px] rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', border: '1px solid var(--border)' }}>
            {['pinch out', '·', 'esc', '·', 'tap to go'].map((t, i) => (
              <span key={i} style={{ fontSize: 10, fontFamily: 'inherit',
                color: t === '·' ? 'var(--border)' : 'var(--muted-foreground)',
                letterSpacing: t === '·' ? 0 : '0.04em' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* UI chrome — edge indicators. Hidden during a manual pinch-out overview,
          but kept visible through the intro's zoom-out — they double as the
          nav-direction labels the intro is teaching (WORK/ABOUT/CONTACT/RESUME). */}
      <AnimatePresence>
        {(overviewProgress === 0 || introActive) && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <EdgeIndicators
              actualPos={actualPos}
              onUp={()    => navigateTo(physPos.row - 1, physPos.col)}
              onDown={()  => navigateTo(physPos.row + 1, physPos.col)}
              onLeft={()  => navigateTo(physPos.row,     physPos.col - 1)}
              onRight={()  => navigateTo(physPos.row,     physPos.col + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro-only nav hint — appears once the grid content finishes loading,
          fades out before the zoom back into Home begins. */}
      {runIntro && (
        <div
          className="fixed bottom-8 left-1/2 z-50 pointer-events-none select-none"
          style={{
            opacity: introHintVisible ? 1 : 0,
            transform: 'translateX(-50%)',
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            className="px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--muted-foreground)' }}>
              Use ← → ↑ ↓ to explore
            </span>
          </div>
        </div>
      )}

      <Compass
        pos={actualPos}
        pulse={showHint && overviewProgress === 0}
        onNavigate={(r, c) => {
          if (locked || gestureActiveRef.current) return;
          setLocked(true);
          setPhysPos({ row: r, col: c });
          setShowHint(false);
          setTimeout(() => setLocked(false), NAV_MS);
        }}
        onHome={goHome}
      />

      {/* Navigation hint — fades in after 2s, disappears on first nav */}
      <AnimatePresence>
        {showHint && overviewProgress === 0 && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 2.2, duration: 0.7 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <span className="text-[10px] tracking-[0.1em] text-foreground/65 select-none">
              <span className="md:hidden">swipe · pinch to explore</span>
              <span className="hidden md:inline">scroll · drag · arrow keys to explore</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </HeroBridgeContext.Provider>
  );
}
