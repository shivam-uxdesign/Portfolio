import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { ImageGallery } from '../components/ImageGallery';
import { InterestGrid } from '../components/InterestGrid';
import { AboutBlock } from '../components/AboutBlock';
import { ResumeCards } from '../components/ResumeCards';
import { FunProjects } from '../components/FunProjects';
import { CTACard } from '../components/CTACard';
import { StackContent } from './StackPage';
import { trackEvent } from '../../lib/analytics';

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

const PROJECTS = [
  {
    title: 'Redesigned BM Dashboard, reducing avg TAT from 32m to 5m',
    descriptor: 'Redesigned an internal operations dashboard from the ground up — cut average task completion time from 32 minutes to 5.',
    number: '01', bg: '#0F1923', link: '/case-study/bm-dashboard', external: false,
    thumbnail: <DashboardThumbnail />,
  },
  {
    title: 'Built design system adopted by 3 product teams',
    descriptor: 'Built and rolled out a component design system now adopted across 3 product teams at Rupyy.',
    number: '02', bg: '#B8A898', link: '/case-study/design-system', external: false,
    thumbnail: <DesignSystemThumbnail />,
  },
  {
    title: 'Mobile app redesign increasing user retention by 40%',
    descriptor: 'Rethought onboarding and navigation for a mobile app, lifting user retention by 40%.',
    number: '03', bg: '#8BACC0', link: '/case-study/mobile-app', external: false,
    thumbnail: <MobileAppThumbnail />,
  },
];

// ─── Cell components ──────────────────────────────────────────────────────────

function HeroCell() {
  const [isPolaroidHovered, setIsPolaroidHovered] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center bg-background pt-6 md:pt-8 pb-4 md:pb-6 px-5 md:px-12 gap-4 md:gap-5 select-text overflow-hidden">

      {/* ── Identity block ── */}
      <div className="flex-shrink-0 flex flex-col items-center text-center gap-3">
        {/* Compact polaroid */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8, type: 'spring', stiffness: 100 }}
          onMouseEnter={() => setIsPolaroidHovered(true)}
          onMouseLeave={() => setIsPolaroidHovered(false)}
        >
          <motion.div
            animate={{
              rotate: isPolaroidHovered ? 0 : -3,
              scale: isPolaroidHovered ? 1.02 : 1,
              y: isPolaroidHovered ? 0 : [0, -4, 0],
            }}
            transition={{
              rotate: { duration: 0.45, ease: isPolaroidHovered ? [0.34, 1.56, 0.64, 1] : 'easeOut' },
              scale: { duration: 0.4 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 },
            }}
            className="bg-white rounded border p-2 md:p-2.5 pb-5 md:pb-6 relative"
            style={{ borderColor: '#E0DDD8', borderWidth: '0.5px', width: 'clamp(100px, 28vw, 160px)' }}
          >
            <div className="absolute -top-2.5 left-6 flex gap-2.5">
              <div className="w-3 h-5 rounded-full" style={{ border: '2px solid #B0ADA8', transform: 'rotate(-8deg)' }} />
              <div className="w-3 h-5 rounded-full" style={{ border: '2px solid #B0ADA8', transform: 'rotate(6deg)' }} />
            </div>
            <div className="w-full aspect-[13/12] rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=600&h=560"
                alt="Shivam Sehgal"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Name */}
        <div>
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
            className="text-[14px] leading-snug text-muted-foreground mt-1"
          >
            A product designer who works from strategy to pixel.
          </motion.p>
        </div>
      </div>

      {/* ── Project cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="flex-1 min-h-0 w-full max-w-5xl flex flex-col gap-2"
      >
        <p className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase flex-shrink-0">Selected Work</p>
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {PROJECTS.slice(0, 2).map((project, idx) => {
            const isHov = hoveredCard === idx;
            const inner = (
              <>
                {project.thumbnail}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.95) 100%)' }} />
                <div
                  className="absolute top-3 right-3 text-[10px] font-medium tracking-[0.06em] text-white rounded-full px-2 py-0.5"
                  style={{ backgroundColor: `rgba(0,0,0,${isHov ? 0.45 : 0.3})`, backdropFilter: 'blur(4px)', transition: 'background-color 0.3s ease' }}
                >
                  {project.number}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 pr-16">
                  <div className="text-white text-[11px] font-medium leading-[1.35]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>{project.title}</div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHov ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 right-4 text-white/80 text-[10px] font-medium whitespace-nowrap"
                >
                  View →
                </motion.div>
              </>
            );
            const props = {
              className: "rounded-xl overflow-hidden relative block h-full min-h-[130px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              style: { backgroundColor: project.bg },
              onMouseEnter: () => setHoveredCard(idx),
              onMouseLeave: () => setHoveredCard(null),
              animate: { y: isHov ? -3 : 0 },
              transition: { duration: 0.3, ease: [0.34, 1.2, 0.64, 1] as const },
            };
            return project.external ? (
              <motion.a key={idx} href={project.link} target="_blank" rel="noopener noreferrer" {...props}>{inner}</motion.a>
            ) : (
              <MotionLink key={idx} to={project.link} {...props}>{inner}</MotionLink>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function WorkCell() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
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
  );
}

function AboutCell() {
  const bio = [
    {
      n: '01',
      heading: 'Where it started',
      body: 'A B.FA from JJ School of Art, then an M.Des at NIFT Delhi — the instinct for composition never left, it just found systems to work in.',
    },
    {
      n: '02',
      heading: 'What I do now',
      body: "Product designer at Rupyy, owning problems from research to a shipped, adopted system — not just the screens in between.",
    },
    {
      n: '03',
      heading: 'Off the clock',
      body: "Riding, cooking when there's time, and slowly getting better at 3D in Spline. My cat has opinions about all of it.",
    },
  ];

  const SERIF = "'Playfair Display', Georgia, serif";

  return (
    <div className="w-full h-full flex items-center bg-background px-8 md:px-16 lg:px-20 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
        {/* Left — hook + bio rail */}
        <div>
          <p className="text-[11px] tracking-[0.15em] text-muted-foreground mb-5 uppercase">About</p>
          <div className="space-y-1 mb-10">
            {[
              { text: ['Designer by ', 'training'], color: 'var(--primary)' },
              { text: ['Problem solver by ', 'instinct'], color: 'var(--accent-blue)' },
              { text: ['Cat lover by ', 'default', '.'], color: 'var(--accent-tan)' },
            ].map(({ text, color }, i) => (
              <motion.p
                key={i}
                className="leading-[1.15] select-text text-foreground"
                style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.25rem)', letterSpacing: '-0.01em', fontWeight: 400 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {text[0]}
                <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color }}>{text[1]}</span>
                {text[2] ?? ''}
              </motion.p>
            ))}
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
            {bio.map((p, i) => (
              <motion.div
                key={p.n}
                className="flex gap-5 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              >
                <span
                  className="text-[19px] leading-none text-muted-foreground/40 flex-shrink-0 bg-background relative z-10 pr-1"
                  style={{ fontFamily: SERIF, fontStyle: 'italic' }}
                >
                  {p.n}
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground mb-1 tracking-[0.01em]">{p.heading}</h3>
                  <p className="text-[13px] leading-[1.65] text-muted-foreground select-text max-w-md">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — photo, hidden below lg to keep text the priority on narrow screens */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative rounded-2xl overflow-hidden group"
            style={{
              aspectRatio: '4 / 5',
              boxShadow: '0 40px 80px -30px rgba(20,20,18,0.35), 0 12px 24px -12px rgba(20,20,18,0.2)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=700&h=875"
              alt="Shivam"
              className="w-full h-full object-cover transition-all duration-700 ease-out"
              style={{ filter: 'grayscale(85%) contrast(1.02)' }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%) contrast(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(85%) contrast(1.02)')}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GalleryCell() {
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

function FunCell() {
  return (
    <div className="w-full h-full bg-background p-4">
      <FunProjects />
    </div>
  );
}

function ContactCell() {
  const SERIF = "'Playfair Display', Georgia, serif";

  return (
    <div className="w-full h-full flex items-center bg-background px-6 md:px-16 lg:px-20 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-14 items-center">
        {/* Left — greeting, status, signature */}
        <div className="flex flex-col gap-4 md:gap-5 max-w-[420px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10.5px] md:text-[11px] tracking-[0.08em] uppercase text-muted-foreground">
              Open to select freelance &amp; full-time work
            </span>
          </div>

          <h2 className="text-[26px] md:text-[36px] leading-[1.12] text-foreground">
            Got a project, a role,<br />
            or just want to{' '}
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>
              talk shop
            </span>
            ?
          </h2>

          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Full-time, freelance, or just a second opinion on a flow — I'm one message away.
          </p>

          <p
            className="text-[13px] text-muted-foreground/70 border-l-2 border-border pl-3 leading-snug"
            style={{ fontFamily: SERIF, fontStyle: 'italic' }}
          >
            Let's build something worth shipping. — Shivam
          </p>
        </div>

        {/* Right — CTA */}
        <div className="w-full max-w-[420px] lg:justify-self-end">
          <CTACard />
        </div>
      </div>
    </div>
  );
}

function InterestsCell() {
  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div className="px-8 md:px-12 pt-12 pb-6 flex-shrink-0">
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase mb-3">Interests</p>
        <h2 className="text-[28px] md:text-[34px] text-foreground leading-tight mb-2">Off Figma</h2>
        <p className="text-[13px] text-muted-foreground max-w-md leading-snug">
          The things I make and consume when I'm not shipping product.
        </p>
      </div>
      <div className="flex-1 min-h-0 px-4 pb-4 flex flex-col">
        <InterestGrid />
      </div>
    </div>
  );
}

function ResumeCell() {
  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div className="px-8 md:px-12 pt-8 pb-3">
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Resume</p>
      </div>
      <div className="flex-1 min-h-0 px-4 pb-3 overflow-hidden flex flex-col">
        <ResumeCards />
      </div>
    </div>
  );
}

function StackCell() {
  return <StackContent />;
}

function CellContent({ id }: { id: CellId }) {
  switch (id) {
    case 'hero':      return <HeroCell />;
    case 'work':      return <WorkCell />;
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
            className="text-foreground/45 group-hover:text-foreground/90 transition-colors duration-200"
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
            className="text-[9px] tracking-[0.1em] uppercase text-foreground/40 group-hover:text-foreground/80 transition-colors duration-200 font-medium"
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
function worldTransform(physPos: Pos, overview: boolean) {
  if (overview) return 'scale(0.333) translate(-20%, -20%)';
  const tx = -((physPos.col + 1) / 5) * 100;
  const ty = -((physPos.row + 1) / 5) * 100;
  return `scale(1) translate(${tx.toFixed(4)}%, ${ty.toFixed(4)}%)`;
}

// CellOverlayLabel removed — overview chrome is now a fixed overlay (OverviewFrame)

// ─── Main component ───────────────────────────────────────────────────────────
export function Home() {
  // physPos ranges -1 to 3; after every wrap animation it is rebased to 0-2
  const [physPos, setPhysPos] = useState<Pos>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      return (hash && findPosForCellId(hash)) || HOME_POS;
    } catch {
      return HOME_POS;
    }
  });
  const [locked, setLocked] = useState(false);
  const [overview, setOverview] = useState(false);
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
  const overviewRef = useRef(overview);
  const navigateRef = useRef<(r: number, c: number) => void>(() => {});
  const goHomeRef = useRef<() => void>(() => {});
  const showOverviewRef = useRef<() => void>(() => {});
  const dismissOverviewRef = useRef<(target?: Pos) => void>(() => {});
  useEffect(() => { physPosRef.current = physPos; }, [physPos]);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { overviewRef.current = overview; }, [overview]);

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
  const pinchRef = useRef<{ active: boolean; initialDist: number }>({ active: false, initialDist: 0 });
  const isPinchingRef = useRef(false);

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
    if (locked) return;
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

  // ── Dismiss overview (tap cell in overview, or pinch-out) ──
  // Silently repositions to the target cell then zooms in.
  const dismissOverview = useCallback((target?: Pos) => {
    if (!overviewRef.current || lockedRef.current) return;
    setLocked(true);
    setHoveredCell(null);
    if (target) {
      setNoTransition(true);
      setPhysPos(target);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setNoTransition(false);
        setOverview(false);
        setTimeout(() => setLocked(false), NAV_MS + 50);
      }));
    } else {
      setOverview(false);
      setTimeout(() => setLocked(false), NAV_MS + 50);
    }
  }, []); // uses refs + stable setters only

  useEffect(() => { dismissOverviewRef.current = dismissOverview; }, [dismissOverview]);

  // ── Show overview and wait (used by pinch — does NOT auto-zoom back) ──
  const showOverview = useCallback(() => {
    if (locked || overview) return;
    setLocked(true);
    setShowHint(false);
    setOverview(true);
    setTimeout(() => setLocked(false), 700); // just wait for the zoom-out animation
  }, [locked, overview]);

  useEffect(() => { showOverviewRef.current = showOverview; }, [showOverview]);

  // ── Home zoom transition (compass button — zooms out, snaps to hero, zooms back in) ──
  const goHome = useCallback(() => {
    if (locked) return;
    setLocked(true);
    setShowHint(false);

    // Step 1: zoom out to show the full 3×3 grid
    setOverview(true);

    setTimeout(() => {
      // Step 2: quietly snap position to center (no visual change, still in overview)
      setPhysPos(HOME_POS);

      setTimeout(() => {
        // Step 3: zoom back into center cell
        setOverview(false);
        setTimeout(() => setLocked(false), NAV_MS + 50);
      }, 380);
    }, 680);
  }, [locked]);

  useEffect(() => { goHomeRef.current = goHome; }, [goHome]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dismissOverviewRef.current(); return; }
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
    let pinchAccum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let pinchResetTimer: ReturnType<typeof setTimeout> | null = null;
    const THRESHOLD = 90;
    const PINCH_THRESHOLD = 60; // ctrlKey+wheel deltaY units

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Trackpad pinch: browsers fire wheel with ctrlKey=true
      if (e.ctrlKey) {
        if (lockedRef.current) return;
        pinchAccum += e.deltaY;
        if (pinchResetTimer) clearTimeout(pinchResetTimer);
        pinchResetTimer = setTimeout(() => { pinchAccum = 0; }, 400);

        if (pinchAccum > PINCH_THRESHOLD && !overviewRef.current) {
          // Pinching in (fingers together) → show gallery
          pinchAccum = 0;
          showOverviewRef.current();
        } else if (pinchAccum < -PINCH_THRESHOLD && overviewRef.current) {
          // Spreading out → dismiss gallery
          pinchAccum = 0;
          dismissOverviewRef.current();
        }
        return;
      }

      if (lockedRef.current) return;

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
      if (pinchResetTimer) clearTimeout(pinchResetTimer);
    };
  }, []); // empty — uses refs only

  // ── Pinch-to-overview (native touch events, empty deps — uses refs only) ──
  useEffect(() => {
    const getDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        isPinchingRef.current = true;
        pinchRef.current = { active: true, initialDist: getDist(e.touches) };
      } else {
        isPinchingRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pinchRef.current.active || e.touches.length < 2) return;
      e.preventDefault(); // block browser native pinch-zoom
      const ratio = getDist(e.touches) / pinchRef.current.initialDist;
      if (ratio < 0.68 && !lockedRef.current && !overviewRef.current) {
        // Pinch in → show overview and wait for user to tap a cell
        pinchRef.current.active = false;
        isPinchingRef.current = false;
        showOverviewRef.current();
      } else if (ratio > 1.35 && !lockedRef.current && overviewRef.current) {
        // Pinch out → dismiss overview, stay on current cell
        pinchRef.current.active = false;
        isPinchingRef.current = false;
        dismissOverviewRef.current();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinchingRef.current = false;
        pinchRef.current.active = false;
      }
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
      // Tap with no drag: in overview, navigate to the tapped cell
      if (overview && !locked) {
        const row = Math.min(2, Math.max(0, Math.floor(e.clientY / window.innerHeight * 3)));
        const col = Math.min(2, Math.max(0, Math.floor(e.clientX / window.innerWidth * 3)));
        dismissOverview({ row, col });
      }
      return;
    }

    // Swipe navigation — skip if pinching
    if (locked || isPinchingRef.current) return;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) navigateTo(physPos.row, physPos.col - 1);
      else        navigateTo(physPos.row, physPos.col + 1);
    } else {
      if (dy > 0) navigateTo(physPos.row - 1, physPos.col);
      else        navigateTo(physPos.row + 1, physPos.col);
    }
  };

  const transition = noTransition ? 'none'
    : overview
    ? `transform 0.68s ${NAV_EASE}`
    : `transform 0.58s ${NAV_EASE}`;

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-background select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* World — 500% × 500% of viewport (5×5 cells: real 3×3 + 1-cell clone border) */}
      <div
        ref={worldRef}
        style={{
          position: 'absolute',
          width: '500%',
          height: '500%',
          transformOrigin: '0 0',
          transform: worldTransform(physPos, overview),
          transition,
          willChange: 'transform',
        }}
      >
        {([-1, 0, 1, 2, 3]).flatMap(pr =>
          ([-1, 0, 1, 2, 3]).map(pc => {
            const actualRow = mod(pr, 3);
            const actualCol = mod(pc, 3);
            const cell = GRID[actualRow][actualCol];
            const colIdx = pc + 1; // 0-4
            const rowIdx = pr + 1;
            return (
              <div
                key={`${pr}-${pc}`}
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
                  <CellContent id={cell.id} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Gallery / overview overlay ── */}
      <AnimatePresence>
        {overview && (
          <>
            {/* Dismiss hint */}
            <motion.div
              key="overview-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.55, duration: 0.28, ease: 'easeOut' }}
              className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
            >
              <div className="flex items-center gap-[7px] px-3.5 py-[7px] rounded-full"
                style={{ background: 'rgba(16,16,14,0.80)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {['pinch out', '·', 'esc', '·', 'tap to go'].map((t, i) => (
                  <span key={i} style={{ fontSize: 10, fontFamily: 'inherit',
                    color: t === '·' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.42)',
                    letterSpacing: t === '·' ? 0 : '0.04em' }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Grid */}
            <motion.div
              key="overview-frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="fixed inset-0 z-30 pointer-events-none"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: '7px',
                padding: '7px',
                background: 'rgba(8,8,6,0.50)',
              }}
            >
              {[0, 1, 2].flatMap(r => [0, 1, 2].map(c => {
                const cell = GRID[r][c];
                const isActive = actualPos.row === r && actualPos.col === c;
                const isHovered = hoveredCell === `${r}-${c}`;
                const anyHovered = hoveredCell !== null;
                const idx = r * 3 + c + 1;
                // radial stagger — center cell enters first, corners last
                const dist = Math.sqrt((r - 1) ** 2 + (c - 1) ** 2);
                const enterDelay = isActive ? 0 : dist * 0.06;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    initial={{ opacity: 0, scale: 0.91 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.42, delay: enterDelay, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden pointer-events-auto"
                    style={{
                      borderRadius: 11,
                      cursor: 'pointer',
                      boxShadow: isActive
                        ? '0 0 0 2px rgba(255,255,255,0.92), 0 16px 48px rgba(0,0,0,0.65)'
                        : isHovered
                        ? '0 0 0 1.5px rgba(255,255,255,0.30), 0 8px 32px rgba(0,0,0,0.50)'
                        : '0 0 0 1px rgba(255,255,255,0.09)',
                      transition: 'box-shadow 0.22s ease',
                    }}
                    onMouseEnter={() => setHoveredCell(`${r}-${c}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => dismissOverviewRef.current({ row: r, col: c })}
                  >
                    {/* Dim veil — light by default so content is readable */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-10"
                      animate={{
                        backgroundColor: isActive || isHovered
                          ? 'rgba(0,0,0,0.00)'
                          : anyHovered
                          ? 'rgba(0,0,0,0.35)'
                          : 'rgba(0,0,0,0.08)',
                      }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    />

                    {/* Index — top-left, dissolves on interaction */}
                    <motion.div
                      className="absolute top-0 left-0 z-20 pointer-events-none"
                      animate={{ opacity: isActive || isHovered ? 0 : 0.50 }}
                      transition={{ duration: 0.18 }}
                      style={{ padding: 'clamp(5px, 1.4vw, 9px)' }}
                    >
                      <span className="text-white font-mono leading-none"
                        style={{ fontSize: 'clamp(6px, 1.4vw, 8.5px)', letterSpacing: '0.05em' }}>
                        {String(idx).padStart(2, '0')}
                      </span>
                    </motion.div>

                    {/* Active glow dot — top-right */}
                    <motion.div
                      className="absolute top-0 right-0 z-20 pointer-events-none"
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ padding: 'clamp(5px, 1.4vw, 9px)' }}
                    >
                      <div className="rounded-full" style={{
                        width: 6, height: 6,
                        background: 'white',
                        boxShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.4)',
                      }} />
                    </motion.div>

                    {/* Label bar — always rendered, opacity shifts between states */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between"
                      animate={{
                        backgroundColor: isActive
                          ? 'rgba(255,255,255,0.13)'
                          : isHovered
                          ? 'rgba(6,6,4,0.82)'
                          : 'rgba(6,6,4,0.58)',
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        height: 'clamp(21px, 5.5vh, 28px)',
                        backdropFilter: 'blur(12px)',
                        paddingLeft: 'clamp(7px, 1.8vw, 12px)',
                        paddingRight: 'clamp(7px, 1.8vw, 12px)',
                        borderTop: isActive
                          ? '1px solid rgba(255,255,255,0.20)'
                          : '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <motion.span
                        className="font-semibold uppercase leading-none tracking-[0.1em]"
                        animate={{
                          color: isActive || isHovered
                            ? 'rgba(255,255,255,0.92)'
                            : 'rgba(255,255,255,0.48)',
                        }}
                        transition={{ duration: 0.2 }}
                        style={{ fontSize: 'clamp(6px, 1.6vw, 8.5px)' }}
                      >
                        {cell.label}
                      </motion.span>

                      {/* Arrow — slides in on hover */}
                      <motion.svg
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
                        transition={{ duration: 0.2 }}
                        width="9" height="9" viewBox="0 0 9 9" fill="none"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M1.5 4.5h6M4.5 2L7 4.5 4.5 7"
                          stroke="rgba(255,255,255,0.70)"
                          strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                );
              }))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* UI chrome — edge indicators (hidden during overview) */}
      <AnimatePresence>
        {!overview && (
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

      <Compass
        pos={actualPos}
        pulse={showHint && !overview}
        onNavigate={(r, c) => {
          if (locked) return;
          setLocked(true);
          setPhysPos({ row: r, col: c });
          setShowHint(false);
          setTimeout(() => setLocked(false), NAV_MS);
        }}
        onHome={goHome}
      />

      {/* Navigation hint — fades in after 2s, disappears on first nav */}
      <AnimatePresence>
        {showHint && !overview && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 2.2, duration: 0.7 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <span className="text-[10px] tracking-[0.1em] text-foreground/35 select-none">
              <span className="md:hidden">swipe · pinch to explore</span>
              <span className="hidden md:inline">scroll · drag · arrow keys to explore</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
