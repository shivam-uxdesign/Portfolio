import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { trackEvent } from '../../lib/analytics';
import { HatsHero } from '../components/hats/HatsHero';
import { SheetPeek } from '../components/hats/SheetPeek';
import { HATS, PAL, type WearableId } from '../components/hats/hatsData';
import type { HatId } from '../components/hats/props';
import type { HatsEngine } from '../components/hats/hatsEngine';
import { HeroBridgeContext, createHeroBridge, useHeroBridge, useHeroBridgeStore } from '../components/hats/heroBridge';
import { PROJECTS, AboutCell, ContactCell, ResumeCell, InterestsCell } from './Home';
import { StackPanel } from '../components/cells/StackPanel';
import { PageMap, type MapCell } from '../components/nav/PageMap';
import { WorkAndPlay } from '../components/WorkAndPlay';
import { FUN_PROJECTS } from '../components/FunProjects';
import './sheet.css';

// ─── Layout ───────────────────────────────────────────────────────────────────
// The hero is a fixed backdrop (not a grid cell). A sheet rests as a 20% bar at
// the bottom; slide it up and it takes 80% of the screen, with Shivam hanging
// on its top edge (always centred). Inside the sheet: a 3×2 grid, wrapping
// left/right only. The handle under his chin is the map.

type SheetCellId = 'about' | 'work' | 'interests' | 'stack' | 'resume' | 'contact';
type Pos = { row: number; col: number };

const GRID: { id: SheetCellId; label: string }[][] = [
  [{ id: 'about', label: 'About' }, { id: 'work', label: 'Work & Play' }, { id: 'interests', label: 'Off Figma' }],
  [{ id: 'stack', label: 'Built with' }, { id: 'resume', label: 'Resume' }, { id: 'contact', label: 'Contact' }],
];
const START: Pos = { row: 0, col: 1 }; // opening the sheet lands on Work

// Hat he wears on each cell, unless the visitor already picked one on the hero
// (then he keeps theirs, and the sheet takes on its colours).
const CONTEXT_HAT: Record<SheetCellId, HatId> = {
  about: 'cat', work: 'notes', interests: 'beret', stack: 'propeller', resume: 'helmet', contact: 'party',
};

const NAV_MS = 600;
const NAV_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const DRAG_THRESHOLD = 55;
const SHEET_MS = 520;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBackLocal = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Old links to merged sections land on the cell that now holds them, scrolled to the section.
const ALIASES: Record<string, { cell: SheetCellId; section?: string }> = {
  gallery: { cell: 'about' },
  fun: { cell: 'work' },
};

function findCell(id: string): Pos | null {
  const target = ALIASES[id]?.cell ?? id;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) if (GRID[r][c].id === target) return { row: r, col: c };
  return null;
}

// ── Nested scrolling ──
// Cells scroll on their own; the grid only takes a vertical gesture once the
// cell can't scroll any further that way.
const SCROLL_SEL = '[data-cell-scroll]';
function canScroll(target: EventTarget | null, dir: number): boolean {
  const el = (target as Element | null)?.closest?.(SCROLL_SEL) as HTMLElement | null;
  if (!el) return false;
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 1;
}

function ScrollCell({ children, more }: { children: React.ReactNode; more?: { label: string; target: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !more) return;
    const update = () => setShowMore(el.scrollHeight > el.clientHeight + 8 && el.scrollTop < 40);
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [more]);
  return (
    <div className="relative w-full h-full">
      <div ref={ref} data-cell-scroll className="sh-scroll">{children}</div>
      {more && (
        <button
          type="button"
          className={`sh-more${showMore ? ' on' : ''}`}
          tabIndex={showMore ? 0 : -1}
          onClick={() => ref.current?.querySelector(`#${more.target}`)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })}
        >
          {more.label} <span aria-hidden="true">↓</span>
        </button>
      )}
    </div>
  );
}

// Resting zoom: shows a little more of the page in the bar without letting
// the neighbouring cells (beyond their safe-zone padding) peek in at the sides.
const barScale = (W: number) => Math.max(0.9, 1 - 64 / Math.max(1, W));

// World = 5 columns (3 real + a clone each side for wraparound) × 2 rows.
const worldTransform = (col: number, row: number, W: number, H: number) =>
  `translate(${(-(col + 1) * W).toFixed(2)}px, ${(-row * H).toFixed(2)}px)`;

const MAP_CELLS: MapCell[][] = GRID.map(row => row.map(c => ({ label: c.label, hat: CONTEXT_HAT[c.id] })));

// A hat the visitor chose themes the sheet, lightly: accent colour and a faint
// wash of the hat's card colour. Nothing else moves.
function themeVars(hat: WearableId): React.CSSProperties | undefined {
  if (hat === 'me') return undefined;
  const p = PAL[hat];
  return {
    '--primary': p.accent,
    '--accent': p.accent,
    '--background': `color-mix(in oklab, ${p.card} 4%, #fff)`,
    '--sh-halo': p.halo,
  } as React.CSSProperties;
}

// ─── Cells ────────────────────────────────────────────────────────────────────
function CellContent({ id }: { id: SheetCellId }) {
  switch (id) {
    case 'work': return <ScrollCell><section className="sh-page sh-page-fixed"><WorkAndPlay work={PROJECTS} play={FUN_PROJECTS} /></section></ScrollCell>;
    // About, with Process & Practice as a reel beside it.
    case 'about': return (
      <ScrollCell><section className="sh-page sh-page-fixed"><AboutCell /></section></ScrollCell>
    );
    case 'interests': return <ScrollCell><section className="sh-page sh-page-fixed"><InterestsCell /></section></ScrollCell>;
    case 'stack': return <ScrollCell><section className="sh-page sh-page-fixed"><StackPanel /></section></ScrollCell>;
    case 'resume': return <ScrollCell><section className="sh-page sh-page-fixed"><ResumeCell /></section></ScrollCell>;
    case 'contact': return <ScrollCell><section className="sh-page"><ContactCell /></section></ScrollCell>;
  }
}

const SheetWorld = memo(function SheetWorld() {
  return (
    <>
      {[0, 1].flatMap(r => [-1, 0, 1, 2, 3].map(pc => {
        const cell = GRID[r][mod(pc, 3)];
        const isReal = pc >= 0 && pc <= 2;
        return (
          <div
            key={`${r}:${pc}`}
            ref={el => { if (el) el.inert = !isReal; }}
            className="absolute overflow-hidden"
            style={{ left: `${(pc + 1) * 20}%`, top: `${r * 50}%`, width: '20%', height: '50%' }}
          >
            {/* Safe zone: the top clears his hands and the handle. */}
            <div className="w-full h-full box-border pt-[52px] px-5 pb-5 md:pt-14 md:px-12 md:pb-10">
              <CellContent id={cell.id} />
            </div>
          </div>
        );
      }))}
    </>
  );
});

// ─── Hero (backdrop) ──────────────────────────────────────────────────────────
const HeroPane = memo(function HeroPane({ onEngine }: { onEngine: (e: HatsEngine | null) => void }) {
  const [isNameHovered, setIsNameHovered] = useState(false);
  const bridge = useHeroBridgeStore();
  const heroActive = useHeroBridge(s => s.heroActive);
  const hat = useHeroBridge(s => s.hat);
  const [shownHat, setShownHat] = useState<WearableId>(hat);
  const [swapping, setSwapping] = useState(false);
  useEffect(() => {
    if (hat === shownHat) return;
    if (reducedMotion()) { setShownHat(hat); return; }
    setSwapping(true);
    const t = setTimeout(() => { setShownHat(hat); setSwapping(false); }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hat]);
  const info = HATS.find(h => h.id === shownHat);
  const onHatChange = useCallback((h: WearableId) => bridge.set({ hat: h }), [bridge]);
  const onWear = useCallback((h: string) => trackEvent('hat_worn', { hat: h }), []);

  return (
    <div className="hh-cell w-full h-full flex flex-col items-center justify-center gap-3 md:gap-4 select-text overflow-hidden">
      <div className="hh-text order-1 md:order-2 flex-shrink-0 flex flex-col items-center text-center w-full" style={{ '--hh-accent': PAL[hat].accent } as React.CSSProperties}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[11px] font-medium tracking-[0.09em] text-muted-foreground uppercase mb-1">
          Hey, I am
        </motion.div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-medium leading-[0.92] cursor-default relative"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', color: 'var(--foreground)', letterSpacing: isNameHovered ? '0.01em' : '-0.04em', transition: 'letter-spacing 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onMouseEnter={() => setIsNameHovered(true)} onMouseLeave={() => setIsNameHovered(false)}
          >
            Shivam
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          aria-live="polite"
          className={`hh-tagline text-[13px] md:text-[14px] leading-snug text-muted-foreground mt-2 max-w-[34em] min-h-[2.9em]${swapping ? ' swap' : ''}`}
        >
          {info ? <><em>{info.name}.</em> {info.line}</> : <>A product designer who works from <em>strategy</em> to pixel. I wear a lot of hats.</>}
        </motion.p>
      </div>
      <div className="hh-stage-wrap order-2 md:order-1 w-full">
        <HatsHero isActive={heroActive} overviewProgress={0} onHatChange={onHatChange} onWear={onWear} onEngine={onEngine} />
      </div>
    </div>
  );
});

// ─── Resting bar ──────────────────────────────────────────────────────────────
// No stand-in: the bar is the real top of the sheet (the Work & Play page),
// slightly zoomed out. This invisible button just makes it tappable.
const BarButton = memo(function BarButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="sh-bar" onClick={onOpen} aria-label={`Open my work: ${PROJECTS.length} case studies and ${FUN_PROJECTS.length} side projects`}>
      <span className="sh-handle" aria-hidden="true" />
      <span className="sh-bar-arrow" aria-hidden="true">↑</span>
    </button>
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────
function initialPos(): Pos | null {
  try { const h = window.location.hash.replace('#', ''); return h ? findCell(h) : null; } catch { return null; }
}

export function SheetHome() {
  const [deepLink] = useState(initialPos);
  // Read before the hash-sync effect rewrites an alias like #contact to #resume.
  const [initialHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''));
  const reduce = useRef(reducedMotion()).current;

  // Sheet: 0 = resting bar, 1 = open.
  const [s, setS] = useState(deepLink ? 1 : 0);
  const sRef = useRef(s);
  const sheetAnim = useRef(0);
  // Grid position. col runs -1..3 (clones) during a wrap, rebased after.
  const [pos, setPos] = useState<Pos>(deepLink ?? START);
  const posRef = useRef(pos);
  const [locked, setLocked] = useState(false);
  const lockedRef = useRef(false);
  const [noTransition, setNoTransition] = useState(false);
  // The page map (opened from the handle).
  const [mapOpen, setMapOpen] = useState(false);
  const mapOpenRef = useRef(false);
  const [mapRoom, setMapRoom] = useState(0);
  useEffect(() => { mapOpenRef.current = mapOpen; }, [mapOpen]);
  // Sheet size for the world transform.
  const clipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ W: typeof window !== 'undefined' ? window.innerWidth : 1, H: typeof window !== 'undefined' ? window.innerHeight * 0.8 : 1 });
  // Deep-link arrival: the head rises on its own timeline, then a "Home" tip.
  const [peekOverride, setPeekOverride] = useState<number | null>(deepLink ? 0 : null);
  const [homeTip, setHomeTip] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => { sRef.current = s; }, [s]);

  // ── The portrait is the peek ──
  // Like the prototype: the hero stage slides so the glasses' lower edge
  // (y≈494 of the 1000-unit portrait) lands on the open sheet's top edge, and
  // The engine fades the card and runs the face.
  const heroRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HatsEngine | null>(null);
  const [engineReady, setEngineReady] = useState(0);
  const onEngine = useCallback((e: HatsEngine | null) => { engineRef.current = e; setEngineReady(n => n + 1); }, []);
  const curOffset = useRef({ x: 0, y: 0 });
  const [geo, setGeo] = useState({ dy: 0, cx: 0, w: 140, headH: 90 });
  const measureGeo = useCallback(() => {
    // Read the portrait's box from its HTML container and its used CSS width,
    // not the SVG's own client rect: with overflow:visible (while peeking),
    // Safari reports the SVG's painted overflow, which threw the head off-screen
    // and blew the hands up on iPad.
    const stage = heroRef.current?.querySelector<HTMLElement>('.hh-stage');
    const me = stage?.querySelector<SVGSVGElement>('.hh-me');
    if (!stage || !me) return;
    const sr = stage.getBoundingClientRect();
    const w = parseFloat(getComputedStyle(me).width) || Math.min(sr.width, sr.height) * 0.58;
    if (!w || !sr.width || w > window.innerWidth * 0.6) return;
    const h = w * 1.25; // viewBox 800×1000
    // Resting position: undo the offset applied right now. Read the live
    // (possibly mid-transition) transform, not the target, or a rotation while
    // open measures against a half-finished glide.
    const hero = stage.closest<HTMLElement>('.hats-hero');
    let ox = curOffset.current.x, oy = curOffset.current.y;
    try { const m = new DOMMatrixReadOnly(hero ? getComputedStyle(hero).transform : 'none'); ox = m.m41; oy = m.m42; } catch { /* keep target */ }
    // (.hh-me: left 50%, top 54%, centred)
    const cx = sr.left - ox + sr.width / 2;
    const top = sr.top - oy + sr.height * 0.54 - h / 2;
    const glassesY = top + h * 0.494;
    setGeo(g => {
      const n = { dy: window.innerHeight * 0.2 - glassesY, cx, w, headH: h * 0.4 };
      return Math.abs(n.dy - g.dy) < 0.5 && Math.abs(n.cx - g.cx) < 0.5 && Math.abs(n.w - g.w) < 0.5 ? g : n;
    });
  }, []);
  useEffect(() => {
    measureGeo();
    const t = setTimeout(measureGeo, 400); // after fonts/layout settle
    // Re-measure whenever the portrait's own box changes (rotation, URL bar,
    // late layout), not just on window resize.
    let raf = 0;
    const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => requestAnimationFrame(measureGeo)); };
    const ro = new ResizeObserver(later);
    const st = heroRef.current?.querySelector('.hh-stage');
    if (st) ro.observe(st);
    if (heroRef.current) ro.observe(heroRef.current);
    window.addEventListener('resize', later);
    window.addEventListener('orientationchange', later);
    window.visualViewport?.addEventListener('resize', later);
    return () => {
      clearTimeout(t); cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('resize', later); window.removeEventListener('orientationchange', later);
      window.visualViewport?.removeEventListener('resize', later);
    };
  }, [measureGeo, engineReady]);
  useEffect(() => { posRef.current = pos; }, [pos]);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  const setLock = (v: boolean) => { lockedRef.current = v; setLocked(v); };

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ W: el.offsetWidth || 1, H: el.offsetHeight || 1 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const actual: Pos = { row: pos.row, col: mod(pos.col, 3) };
  const cellId = GRID[actual.row][actual.col].id;
  const isOpen = s >= 1;

  // ── Bridge for the hats ──
  const [bridge] = useState(() => createHeroBridge({ settled: true, heroActive: !deepLink }));
  // This component provides the bridge, so it reads the store directly.
  const chosenHat = useSyncExternalStore(bridge.subscribe, () => bridge.get().hat, () => bridge.get().hat);
  useEffect(() => { bridge.set({ heroActive: s === 0 && !lockedRef.current }); }, [bridge, s]);

  // ── Sheet animation ──
  const animateSheet = useCallback((to: 0 | 1, done?: () => void) => {
    cancelAnimationFrame(sheetAnim.current);
    const from = sRef.current;
    if (reduce || from === to) { sRef.current = to; setS(to); done?.(); return; }
    const t0 = performance.now(), dur = SHEET_MS * Math.max(0.35, Math.abs(to - from));
    const step = (now: number) => {
      const t = clamp01((now - t0) / dur), v = from + (to - from) * easeOutCubic(t);
      sRef.current = v; setS(v);
      if (t < 1) sheetAnim.current = requestAnimationFrame(step);
      else done?.();
    };
    sheetAnim.current = requestAnimationFrame(step);
  }, [reduce]);

  // ── Open / close ──
  const openSheet = useCallback(() => {
    if (lockedRef.current && sRef.current < 1) { /* allow re-open during settle */ }
    setLock(true);
    trackEvent('sheet_open', {});
    animateSheet(1, () => {
      setLock(false);
      if (!window.location.hash) { history.pushState({ sheet: 1 }, '', '#' + GRID[posRef.current.row][mod(posRef.current.col, 3)].id); pushedRef.current = true; }
    });
  }, [animateSheet]);

  const closeSheet = useCallback((fromHistory = false) => {
    setMapOpen(false);
    setPeekOverride(null); setHomeTip(false);
    setLock(true);
    animateSheet(0, () => {
      setLock(false);
      // Next open lands on Work again.
      posRef.current = START; setPos(START);
      if (!fromHistory) {
        if (pushedRef.current && history.state?.sheet) { pushedRef.current = false; history.back(); }
        else history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  }, [animateSheet]);
  const openRef = useRef(openSheet), closeRef = useRef(closeSheet);
  useEffect(() => { openRef.current = openSheet; closeRef.current = closeSheet; }, [openSheet, closeSheet]);

  // Back button closes the sheet; forward reopens it.
  useEffect(() => {
    const onPop = () => {
      const p = initialPos();
      if (!p && sRef.current > 0) closeRef.current(true);
      else if (p && sRef.current === 0) { posRef.current = p; setPos(p); pushedRef.current = true; openRef.current(); }
      // A link to another cell while the sheet is open: jump straight there.
      else if (p && sRef.current >= 1) { const cur = posRef.current; if (p.row !== cur.row || p.col !== mod(cur.col, 3)) { posRef.current = p; setPos(p); } }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Keep the hash on the current cell while open.
  useEffect(() => {
    if (!isOpen) return;
    const next = '#' + cellId;
    if (window.location.hash !== next) history.replaceState(history.state, '', window.location.pathname + window.location.search + next);
    trackEvent('cell_view', { cell: cellId });
  }, [isOpen, cellId]);

  // Old #contact / #gallery links: scroll the merged cell to that section.
  useEffect(() => {
    const alias = ALIASES[initialHash];
    if (!alias?.section) return;
    const t = setTimeout(() => {
      // The wraparound clones carry the same ids; take the copy in the real cell.
      const sec = Array.from(clipRef.current?.querySelectorAll<HTMLElement>(`#${alias.section}`) ?? []).find(el => !el.closest('[inert]'));
      const sc = sec?.closest(SCROLL_SEL) as HTMLElement | null;
      if (sec && sc) sc.scrollTop = sec.offsetTop;
    }, 60);
    return () => clearTimeout(t);
  }, []);

  // Deep-link arrival: he rises once on his own, then the tip says what he's for.
  useEffect(() => {
    if (!deepLink) return;
    if (reduce) { setPeekOverride(null); return; }
    let raf = 0;
    const t0 = performance.now() + 450;
    const step = (now: number) => {
      const t = clamp01((now - t0) / 700);
      setPeekOverride(t);
      if (t < 1) raf = requestAnimationFrame(step);
      else { setPeekOverride(null); setHomeTip(true); setTimeout(() => setHomeTip(false), 2200); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [deepLink, reduce]);

  // ── Grid navigation (sheet open only) ──
  // Which way the last move went, for his hat swap.
  const navDir = useRef({ x: 0, y: 0 });
  const navigateTo = useCallback((r: number, c: number) => {
    if (lockedRef.current || mapOpenRef.current || sRef.current < 1) return;
    if (r < 0 || r > 1) return; // no vertical wrap
    const cur = posRef.current;
    navDir.current = { x: Math.sign(c - cur.col), y: Math.sign(r - cur.row) };
    setLock(true);
    setPos({ row: r, col: c });
    if (c < 0 || c > 2) {
      setTimeout(() => {
        setNoTransition(true);
        setPos({ row: r, col: mod(c, 3) });
        requestAnimationFrame(() => requestAnimationFrame(() => { setNoTransition(false); setLock(false); }));
      }, NAV_MS);
    } else setTimeout(() => setLock(false), NAV_MS);
  }, []);
  const navRef = useRef(navigateTo);
  useEffect(() => { navRef.current = navigateTo; }, [navigateTo]);

  const pickCell = useCallback((p: Pos) => {
    if (lockedRef.current || sRef.current < 1) return;
    const cur = posRef.current;
    navDir.current = { x: Math.sign(p.col - mod(cur.col, 3)), y: Math.sign(p.row - cur.row) };
    setLock(true); setPos(p);
    setTimeout(() => setLock(false), NAV_MS);
  }, []);

  // Up from the top row = close the sheet.
  const goUp = () => { const p = posRef.current; if (p.row === 0) closeRef.current(); else navRef.current(p.row - 1, p.col); };
  const goDown = () => { const p = posRef.current; navRef.current(p.row + 1, p.col); };
  const goSide = (d: number) => { const p = posRef.current; navRef.current(p.row, p.col + d); };

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (sRef.current === 0) {
        if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && t === document.body)) { e.preventDefault(); openRef.current(); }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mapOpenRef.current) setMapOpen(false); else closeRef.current();
        return;
      }
      if (mapOpenRef.current) return;
      if (e.key === 'Home') { e.preventDefault(); closeRef.current(); return; }
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || sRef.current < 1) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') goUp();
      if (e.key === 'ArrowDown') goDown();
      if (e.key === 'ArrowLeft') goSide(-1);
      if (e.key === 'ArrowRight') goSide(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Wheel / trackpad ──
  useEffect(() => {
    const acc = { x: 0, y: 0 };
    let innerScrollAt = 0;
    let reset: ReturnType<typeof setTimeout> | null = null;
    // One swipe = one move. A trackpad keeps firing fading "momentum" events for a
    // second or two after the fingers lift; once a swipe has moved the page, the
    // rest of that stream is ignored until it goes quiet (a pause) or picks up
    // speed again (a genuinely new swipe).
    let spent = false, lastT = 0, lastMag = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // also swallows trackpad pinch (ctrl+wheel): no page zoom here
      const now = performance.now(), mag = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
      if (spent && (now - lastT > 220 || (mag > lastMag * 1.6 && mag > 14))) spent = false;
      lastT = now; lastMag = mag;
      if (spent || e.ctrlKey || lockedRef.current || mapOpenRef.current) return;
      // Vertical wheel over a cell that can still scroll that way: let it scroll,
      // and hold off grid moves briefly so trackpad momentum doesn't spill over.
      if (sRef.current >= 1 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (canScroll(e.target, Math.sign(e.deltaY))) {
          const el = (e.target as Element).closest(SCROLL_SEL) as HTMLElement;
          el.scrollTop += e.deltaY;
          innerScrollAt = performance.now(); acc.x = acc.y = 0; return;
        }
        if (performance.now() - innerScrollAt < 450) { innerScrollAt = performance.now(); acc.x = acc.y = 0; return; }
      }
      acc.x += e.deltaX; acc.y += e.deltaY;
      if (reset) clearTimeout(reset);
      reset = setTimeout(() => { acc.x = 0; acc.y = 0; }, 350);
      const ax = Math.abs(acc.x), ay = Math.abs(acc.y);
      if (sRef.current === 0) {
        if (ay > ax && acc.y > 90) { acc.x = acc.y = 0; spent = true; openRef.current(); }
        return;
      }
      if (sRef.current < 1) return;
      if (ax > ay && ax > 90) { const d = acc.x > 0 ? 1 : -1; acc.x = acc.y = 0; spent = true; goSide(d); }
      else if (ay > ax && ay > 90) { const d = acc.y; acc.x = acc.y = 0; spent = true; if (d > 0) goDown(); else goUp(); }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); if (reset) clearTimeout(reset); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Touch inside a scrollable cell: native scroll until its edge, then the grid ──
  useEffect(() => {
    let t0: { x: number; y: number; target: EventTarget | null; mode: 'native' | 'grid' | null } | null = null;
    const onStart = (e: TouchEvent) => {
      t0 = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY, target: e.target, mode: null } : null;
    };
    const onMove = (e: TouchEvent) => {
      if (!t0 || e.touches.length !== 1 || !(t0.target as Element | null)?.closest?.(SCROLL_SEL)) return;
      // Once a touch is ours (grid or sheet drag) keep it ours: dragging the sheet
      // down drops s below 1 on the first move, and letting the browser pan from
      // there cancelled the pointer, stranding the sheet half-closed.
      // (pointermove runs before touchmove, so a sheet drag may already be under way.)
      if (t0.mode === null && drag.current?.mode === 'sheet') t0.mode = 'grid';
      if (t0.mode === 'grid') { if (e.cancelable) e.preventDefault(); return; }
      if (sRef.current < 1) return;
      if (t0.mode === null) {
        const dx = e.touches[0].clientX - t0.x, dy = e.touches[0].clientY - t0.y;
        if (Math.hypot(dx, dy) < 6) return;
        // Finger moving up = content scrolls down.
        t0.mode = Math.abs(dy) > Math.abs(dx) && canScroll(t0.target, dy < 0 ? 1 : -1) ? 'native' : 'grid';
        if (t0.mode === 'native') drag.current = null;
      }
      if (t0.mode === 'grid' && e.cancelable) e.preventDefault();
    };
    window.addEventListener('touchstart', onStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onMove, { passive: false, capture: true });
    return () => { window.removeEventListener('touchstart', onStart, { capture: true }); window.removeEventListener('touchmove', onMove, { capture: true }); };
  }, []);

  // ── Pointer: drag the sheet, or swipe the grid ──
  // Closed: a vertical drag anywhere (hats stop their own events) scrubs the
  // sheet up. Open: on the top row, dragging down scrubs it closed; every other
  // swipe moves through the grid on release.
  const drag = useRef<{ x: number; y: number; t: number; s0: number; mode: 'none' | 'sheet' | 'grid' | null; lastY: number; lastT: number; vy: number } | null>(null);
  const suppressClick = useRef(false);
  const onClickCapture = (e: React.MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault(); e.stopPropagation();
  };
  const onPointerDown = (e: React.PointerEvent) => {
    suppressClick.current = false;
    if (!e.isPrimary) return;
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now(), s0: sRef.current, mode: null, lastY: e.clientY, lastT: performance.now(), vy: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !e.isPrimary) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    const now = performance.now();
    d.vy = (e.clientY - d.lastY) / Math.max(1, now - d.lastT); d.lastY = e.clientY; d.lastT = now;
    if (d.mode === null && Math.hypot(dx, dy) > 8) {
      const vertical = Math.abs(dy) > Math.abs(dx);
      if (mapOpenRef.current) d.mode = 'none';
      else if (sRef.current < 1) d.mode = vertical && !lockedRef.current ? 'sheet' : 'none';
      else if (vertical && canScroll(e.target, dy < 0 ? 1 : -1)) d.mode = 'none';
      else d.mode = vertical && dy > 0 && posRef.current.row === 0 && !lockedRef.current ? 'sheet' : 'grid';
      if (d.mode === 'sheet') { cancelAnimationFrame(sheetAnim.current); }
    }
    if (d.mode === 'sheet') {
      const v = clamp01(d.s0 - dy / (window.innerHeight * 0.6));
      sRef.current = v; setS(v);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !e.isPrimary) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (d.mode !== null && Math.hypot(dx, dy) > 8) suppressClick.current = true;
    if (d.mode === 'sheet') {
      const v = sRef.current;
      const open = d.s0 < 1 ? (v > 0.3 || d.vy < -0.45) && d.vy < 0.45 : !(v < 0.75 || d.vy > 0.45);
      if (open) { if (d.s0 < 1) openRef.current(); else animateSheet(1); }
      else if (d.s0 >= 1) closeRef.current();
      else animateSheet(0);
      return;
    }
    if (d.mode !== 'grid' || Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) goSide(dx > 0 ? -1 : 1);
    else if (dy < 0) goDown();
    else goUp();
  };

  // ── Render ──
  const sheetVisible = s > 0;
  // Hands start once the head is nearly at the edge (as in the prototype).
  const peekProgress = peekOverride ?? s;
  const ownHat = chosenHat !== 'me';
  const peekHat: WearableId = ownHat ? chosenHat : CONTEXT_HAT[cellId];

  // Page change: no hat of your own → the page hats swap, leaving and arriving
  // with the pages; your own hat → a glance the way you're going and a hat tip.
  // (Declared before the frame effect below so the swap gets to the engine first.)
  const prevCell = useRef(cellId);
  useEffect(() => {
    if (prevCell.current === cellId) return;
    prevCell.current = cellId;
    const engine = engineRef.current;
    if (!engine || sRef.current < 1) return;
    const dir = navDir.current;
    if (dir.x) engine.glance(dir.x);
    if (ownHat) engine.tipHat(dir);
    else engine.displayHat(CONTEXT_HAT[cellId], dir);
  }, [cellId, ownHat]);

  useEffect(() => {
    const stage = heroRef.current?.querySelector<HTMLElement>('.hats-hero');
    const text = heroRef.current?.querySelector<HTMLElement>('.hh-text');
    const engine = engineRef.current;
    if (!stage) return;
    const colX = window.innerWidth / 2; // he stays centred
    // Deep-link arrival: rise from behind the sheet on its own timeline.
    const rise = peekOverride !== null ? (1 - easeOutBackLocal(clamp01(peekOverride / 0.55))) * geo.headH : 0;
    const p = Math.min(1.05, s);
    const x = (colX - geo.cx) * Math.min(1, s), y = geo.dy * p + rise;
    curOffset.current = { x, y };
    stage.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    stage.style.transition = 'none'; // driven frame-by-frame by the sheet
    if (text) text.style.opacity = String(clamp01(1 - s * 1.8));
    if (engine) {
      engine.setPeek(s);
      engine.setOverview(s > 0 ? 0.5 : 0);
      engine.setPeekLive(isOpen && peekOverride === null);
      engine.displayHat(s >= 1 ? peekHat : null);
    }
  });
  const transition = noTransition ? 'none' : `transform ${NAV_MS}ms ${NAV_EASE}`;

  return (
    <HeroBridgeContext.Provider value={bridge}>
      <div
        className="sh-root fixed inset-0 overflow-hidden bg-background select-none"
        style={{ touchAction: 'none', ...themeVars(chosenHat) }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={e => {
          // If the browser ever takes the touch mid sheet-drag, settle instead of freezing.
          const d = drag.current; drag.current = null;
          if (d?.mode === 'sheet') { if (d.s0 >= 1) { if (sRef.current < 0.75) closeRef.current(); else animateSheet(1); } else animateSheet(sRef.current > 0.3 ? 1 : 0); }
          void e;
        }}
        onClickCapture={onClickCapture}
        // Links and images are natively draggable; that would cancel a swipe that starts on a card.
        onDragStart={e => e.preventDefault()}
      >
        {/* Hero backdrop. As the sheet rises, the portrait slides behind it until
            only his head shows above the edge (see the peek effect above). */}
        {/* A chosen hat's soft glow behind his head. */}
        <div className={`sh-glow${ownHat && s > 0 ? ' on' : ''}`} aria-hidden="true" />
        <div ref={heroRef} className={`sh-hero${s > 0 ? ' peeking' : ''}`} aria-hidden={s > 0.5} style={{ pointerEvents: s > 0 ? 'none' : undefined }}>
          <HeroPane onEngine={onEngine} />
        </div>

        {/* The sheet */}
        <div className={`sh-sheet${s > 0 && s < 1 ? ' moving' : ''}`} style={{ transform: `translateY(${((1 - s) * 75).toFixed(3)}%)` }}>
          <SheetPeek
            handsOnly
            width={geo.w}
            progress={peekProgress}
            col={1}
            hat={peekHat}
            active={isOpen}
            showTip={homeTip}
            onHome={() => closeRef.current()}
            onHatFling={ownHat ? (dx, dy) => { drag.current = null; engineRef.current?.takeOff(dx, dy); } : undefined}
          />
          <div ref={clipRef} className="sh-clip" aria-hidden={!sheetVisible}>
            {/* Zoomed out a touch at rest, growing to full size as the sheet rises:
                the bar and the open sheet are the same surface. */}
            {/* While the map is open the page steps down and back to make room. */}
            <div
              className={`sh-page-stage absolute inset-0${mapRoom ? ' making-room' : ''}`}
              style={{ transformOrigin: '50% 0', transform: s < 1 ? `scale(${lerp(barScale(size.W), 1, s).toFixed(4)})` : mapRoom ? `translateY(${mapRoom}px) scale(.94)` : undefined }}
            >
            <div
              ref={el => { if (el) el.inert = !isOpen; }}
              className="absolute"
              style={{ width: '500%', height: '200%', transform: worldTransform(pos.col, pos.row, size.W, size.H), transition, willChange: 'transform' }}
            >
              <SheetWorld />
            </div>
            </div>
            <button type="button" className={`sh-map-scrim${mapOpen ? ' on' : ''}`} tabIndex={-1} aria-hidden="true" onClick={() => setMapOpen(false)} />
            {/* Tap target + handle; the handle fades as his head arrives. */}
            <div className="sh-bar-wrap" style={{ opacity: 1 - seg(s, 0, 0.35), pointerEvents: s > 0.05 ? 'none' : undefined, visibility: s >= 0.35 ? 'hidden' : undefined }}>
              <BarButton onOpen={() => openRef.current()} />
            </div>
          </div>

          {isOpen && (
            <PageMap
              current={actual}
              cells={MAP_CELLS}
              open={mapOpen}
              onToggle={setMapOpen}
              onPick={pickCell}
              onHeight={setMapRoom}
            />
          )}
        </div>

      </div>
    </HeroBridgeContext.Provider>
  );
}
