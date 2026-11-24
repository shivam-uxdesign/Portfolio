import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { trackPageview } from '../../lib/analytics';
import { site, useSite, type Travel } from '../../lib/site';
import { themeVars } from '../../lib/theme';
import { pageMeta } from '../../lib/pages';
import { PAL } from './hats/hatsData';
import { MiniHead, type Face } from './chrome/MiniHead';
import { setNavSlot, NavSegments } from './chrome/NavRight';
import { TldrView } from './chrome/TldrView';
import './chrome/chrome.css';

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inCubic = (t: number) => t * t * t;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outBack = (t: number, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const IDLE: Face = {};
const FLYING: Face = { eyes: 'happy', mouth: 'laugh' };
const YANKED: Face = { eyes: 'closed', mouth: 'o', brows: 'up' };
const HOPPING: Face = { eyes: 'open', mouth: 'o', brows: 'up' };

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isHome = path === '/';
  const meta = pageMeta(path);
  const hat = useSite(s => s.hat);
  const worn = useSite(s => s.worn);
  const tldr = useSite(s => s.tldr);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);
  const travRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const busy = useRef(false);
  const [navFace, setNavFace] = useState<Face>(IDLE);
  const [travFace, setTravFace] = useState<Face>(IDLE);
  const faceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flashFace = useCallback((f: Face, ms: number) => {
    setNavFace(f); clearTimeout(faceTimer.current);
    faceTimer.current = setTimeout(() => setNavFace(IDLE), ms);
  }, []);

  useEffect(() => {
    trackPageview(location.pathname + location.search + location.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => () => { cancelAnimationFrame(raf.current); clearTimeout(faceTimer.current); }, []);

  // ── The trip out: he ducks behind the rising page, then pops up in its corner ──
  const runOut = useCallback((t: Travel) => {
    const card = cardRef.current, trav = travRef.current, home = homeRef.current?.querySelector('svg');
    if (!card || !trav || !home) return;
    const B = home.getBoundingClientRect();
    const A = t.from, E = t.edgeY, P = B.bottom + 22;
    const svg = trav.firstElementChild as HTMLElement;
    busy.current = true;
    homeRef.current!.style.visibility = 'hidden';
    card.classList.add('pc-card-moving');
    trav.style.display = 'block';
    setTravFace(YANKED);
    let emerged = false, faced = false;
    const t0 = performance.now();
    const step = (now: number) => {
      const ms = now - t0;
      // The page: up to just under the corner, a breath, then the rest of the way.
      const c = ms < 400 ? lerp(E, P, outCubic(ms / 400)) : ms < 440 ? P : lerp(P, 0, inOutCubic(clamp01((ms - 440) / 320)));
      card.style.transform = `translateY(${c.toFixed(1)}px)`;
      let x: number, y: number, w: number, h: number, sx = 1, sy = 1, rot = 0;
      if (ms < 220) {
        // Duck: pulled down behind the page's edge.
        const k = inCubic(ms / 220);
        x = A.x; y = A.y + A.h * 0.55 * k; w = A.w; h = A.h; sy = 1 - 0.07 * Math.sin(k * Math.PI); sx = 1 + 0.04 * Math.sin(k * Math.PI);
      } else if (ms < 300) {
        // Under the page, small now, waiting in the corner.
        x = B.x; y = P; w = B.width; h = B.height;
      } else {
        // Pop: yanked up out of the page's edge, stretched, then a wobble.
        if (!faced) { faced = true; setTravFace(FLYING); }
        const k = clamp01((ms - 300) / 360);
        x = B.x; y = lerp(P, B.y, outBack(k)); w = B.width; h = B.height;
        sy = k < 0.4 ? lerp(1.22, 0.9, k / 0.4) : lerp(0.9, 1, (k - 0.4) / 0.6); sx = 1 / Math.sqrt(sy);
        rot = -16 * (1 - k) * Math.cos(k * Math.PI * 2.2);
      }
      if (!emerged && ms >= 300 && y + h <= c) emerged = true;
      trav.style.left = `${x}px`; trav.style.top = `${y}px`; trav.style.width = `${w}px`; trav.style.height = `${h}px`;
      const cut = emerged ? 0 : Math.max(0, y + h - c);
      trav.style.clipPath = cut ? `inset(-60% -60% ${cut.toFixed(1)}px -60%)` : 'none';
      svg.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      if (ms < 780) { raf.current = requestAnimationFrame(step); return; }
      card.style.transform = ''; card.classList.remove('pc-card-moving');
      trav.style.display = 'none'; svg.style.transform = '';
      homeRef.current!.style.visibility = '';
      busy.current = false;
      flashFace(FLYING, 900);
    };
    raf.current = requestAnimationFrame(step);
  }, [flashFace]);

  // ── The trip home: a hop, a dive into the page, and the page sinks back into the sheet ──
  const goHome = useCallback(() => {
    if (busy.current) return;
    const origin = site.get().origin ?? pageMeta(path)?.cell ?? 'work';
    const to = `/#${origin}`;
    const card = cardRef.current, content = contentRef.current, trav = travRef.current, home = homeRef.current?.querySelector('svg');
    if (reduced() || !card || !content || !trav || !home) { site.set({ returning: true }); navigate(to); return; }
    busy.current = true;
    const B = home.getBoundingClientRect(), E = window.innerHeight * 0.2, P = B.bottom + 22;
    const right = rightRef.current ?? content;
    const svg = trav.firstElementChild as HTMLElement;
    homeRef.current!.style.visibility = 'hidden';
    card.classList.add('pc-card-moving');
    trav.style.display = 'block';
    setTravFace(HOPPING);
    let dove = false;
    const t0 = performance.now();
    const step = (now: number) => {
      const ms = now - t0;
      const c = ms < 200 ? lerp(0, P, outCubic(ms / 200)) : ms < 250 ? P : lerp(P, E, inOutCubic(clamp01((ms - 250) / 300)));
      card.style.transform = `translateY(${c.toFixed(1)}px)`;
      content.style.opacity = right.style.opacity = String(1 - clamp01((ms - 160) / 260));
      let y: number, sy = 1, rot = 0;
      if (ms < 150) { const k = outCubic(ms / 150); y = B.y - 12 * k; sy = 1 + 0.08 * k; rot = 6 * k; }
      else {
        if (!dove) { dove = true; setTravFace(YANKED); }
        const k = clamp01((ms - 150) / 230);
        // Down into the page, and then he rides its edge down (out of sight).
        y = Math.max(lerp(B.y - 12, P + 8, inCubic(k)), k >= 1 ? c + 8 : -Infinity); sy = lerp(1.08, 0.94, k); rot = lerp(6, -4, k);
      }
      trav.style.left = `${B.x}px`; trav.style.top = `${y}px`; trav.style.width = `${B.width}px`; trav.style.height = `${B.height}px`;
      const cut = ms < 150 ? 0 : Math.max(0, y + B.height - c);
      trav.style.clipPath = cut ? `inset(-60% -60% ${cut.toFixed(1)}px -60%)` : 'none';
      svg.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${(1 / Math.sqrt(sy)).toFixed(3)}, ${sy.toFixed(3)})`;
      if (ms < 560) { raf.current = requestAnimationFrame(step); return; }
      trav.style.display = 'none'; svg.style.transform = '';
      busy.current = false;
      site.set({ returning: true });
      navigate(to);
    };
    raf.current = requestAnimationFrame(step);
  }, [navigate, path]);

  // A new inner page: back to the top, full view, and if he's on his way from
  // the sheet, run the trip (before paint, so the page never flashes in place).
  useLayoutEffect(() => {
    if (isHome) return;
    site.set({ tldr: false });
    window.scrollTo(0, 0);
    const t = site.get().travel;
    if (t?.dir === 'out') {
      site.set({ travel: null });
      if (!reduced()) runOut(t);
    }
  }, [path, isHome, runOut]);

  if (isHome) return <Outlet />;

  const showTldr = !!meta?.tldr && tldr;
  return (
    <div className="pc-root">
      {/* What shows above the page while it rises or sinks: the hero's backdrop. */}
      <div className="pc-behind" aria-hidden="true">
        <div className={`sh-glow${hat !== 'me' ? ' on' : ''}`} style={hat !== 'me' ? { '--sh-halo': PAL[hat].halo } as React.CSSProperties : undefined} />
      </div>
      <div ref={cardRef} className="pc-card" style={themeVars(hat)}>
        <div ref={contentRef} className="pc-content">
          {showTldr ? <TldrView meta={meta!} /> : <Outlet />}
        </div>
        {/* The bar: no background, no border. Just his head and the page's controls. */}
        <header className="pc-bar">
          <button
            ref={homeRef}
            type="button"
            className="pc-home"
            aria-label="Home"
            onClick={goHome}
            onPointerEnter={e => { if (e.pointerType === 'mouse') setNavFace({ eyes: 'happy', mouth: 'smile' }); }}
            onPointerLeave={() => setNavFace(IDLE)}
          >
            <MiniHead hat={worn} face={navFace} />
          </button>
          <div ref={rightRef} className="pc-right">
            {meta?.tldr && (
              <NavSegments
                label="Case study length"
                options={[{ id: 'full', label: 'Full' }, { id: 'tldr', label: 'TL;DR' }]}
                value={tldr ? 'tldr' : 'full'}
                onChange={v => { site.set({ tldr: v === 'tldr' }); window.scrollTo(0, 0); }}
              />
            )}
            <div ref={setNavSlot} className="pc-slot" />
          </div>
        </header>
      </div>
      {/* The head in transit (positioned frame by frame). */}
      <div ref={travRef} className="pc-trav" aria-hidden="true">
        <div className="pc-trav-in"><MiniHead hat={worn} face={travFace} /></div>
      </div>
    </div>
  );
}
