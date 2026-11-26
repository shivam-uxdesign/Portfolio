import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLayoutEffect, useRef, useState } from 'react';

/* ── Brand SVG logos ── */
function FigmaLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

function FigJamLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#9747FF" />
      <path d="M13 10h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="white" fillOpacity=".2" />
      <path d="M20 13v14M13 20h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3" fill="white" />
    </svg>
  );
}

function NotionLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.046 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" fill="white" />
    </svg>
  );
}

function LottieLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#00DDB3" />
      <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="3" fill="white" />
      <circle cx="20" cy="8" r="2" fill="white" fillOpacity=".5" />
      <circle cx="32" cy="20" r="2" fill="white" fillOpacity=".5" />
      <circle cx="20" cy="32" r="2" fill="white" fillOpacity=".5" />
      <circle cx="8" cy="20" r="2" fill="white" fillOpacity=".5" />
    </svg>
  );
}

// Claude and Claude Code marks from Simple Icons (CC0); Lovable is a simple white heart on its pink tile.
function ClaudeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#D97757" />
      <g transform="translate(8 8)"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" fill="white" /></g>
    </svg>
  );
}

function ClaudeCodeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#1F1E1D" />
      <g transform="translate(8 8)"><path d="M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18Zm-15 0h1.5v-3H6Zm10.5 0H18v-3h-1.5z" fill="#D97757" /></g>
    </svg>
  );
}

function LovableLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M20 29.5s-9-5.6-9-12.1A5 5 0 0 1 20 14.4a5 5 0 0 1 9 3c0 6.5-9 12.1-9 12.1z" fill="white" />
    </svg>
  );
}

// Procreate has no official mark in Simple Icons: a brush stroke in its colours on a black tile.
function ProcreateLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs><linearGradient id="procreate-g" x1="10" y1="30" x2="30" y2="10" gradientUnits="userSpaceOnUse"><stop stopColor="#FF8A3D" /><stop offset=".5" stopColor="#F2416B" /><stop offset="1" stopColor="#6C63FF" /></linearGradient></defs>
      <rect width="40" height="40" rx="8" fill="#111" />
      <path d="M11 28c3-1 4-4 6-7s5-8 9-9c2-.4 3.6.8 3 2.6-.9 2.6-5.4 6.2-9 9-2.4 1.9-5 3.6-9 4.4z" fill="url(#procreate-g)" />
    </svg>
  );
}

export function SplineLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="white" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" stroke="white" strokeWidth="1.6" />
    </svg>
  );
}

export const tools = [
  { name: 'Figma', category: 'Design', color: '#F24E1E', logo: <FigmaLogo />, note: 'Where every screen starts and ends.' },
  { name: 'FigJam', category: 'Workshops', color: '#9747FF', logo: <FigJamLogo />, note: 'Messy thinking, before the clean version.' },
  { name: 'Claude Code', category: 'Building', color: '#1F1E1D', logo: <ClaudeCodeLogo />, note: 'Where the design system tools, both Keppo apps and this site got built.' },
  { name: 'Claude', category: 'Thinking', color: '#D97757', logo: <ClaudeLogo />, note: 'Writing and thinking things through.' },
  { name: 'Lovable', category: 'Quick builds', color: '#E8436B', logo: <LovableLogo />, note: 'Made whatiswrongwith.in in a day.' },
  { name: 'Notion', category: 'Docs', color: '#000000', logo: <NotionLogo />, note: 'Specs, decisions, and the source of truth.' },
  { name: 'Procreate', category: 'Drawing', color: '#111111', logo: <ProcreateLogo />, note: 'Where my digital drawings start.' },
  { name: 'Lottie', category: 'Motion', color: '#00DDB3', logo: <LottieLogo />, note: 'Motion that ships, not just prototypes.' },
];

const GRID_GAP = 12; // px — single fixed gap so the JS size calc and CSS stay in sync
const SERIF = "'Playfair Display', Georgia, serif";

export function StackPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <StackContent standalone />
    </div>
  );
}

export function StackContent({ standalone = false }: { standalone?: boolean }) {
  const navigate = useNavigate();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const gridWrapRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(0);
  const [cols, setCols] = useState(4);

  useLayoutEffect(() => {
    // Sized from the grid's own box (not the window), so it works full-screen
    // and inside smaller containers like the home sheet. Embedded, tiles never
    // shrink below MIN_TILE: the section grows and its container scrolls instead.
    const MIN_TILE = 112;
    function measure() {
      const el = gridWrapRef.current;
      if (!el) return;
      if (!standalone) el.style.minHeight = '';
      const cs = getComputedStyle(el);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const availableWidth = el.clientWidth - padX;
      const availableHeight = el.clientHeight - padY;
      const nextCols = availableWidth >= 520 ? 4 : 2;
      const rows = Math.ceil(tools.length / nextCols);
      const sizeFromWidth = (availableWidth - GRID_GAP * (nextCols - 1)) / nextCols;
      const sizeFromHeight = (availableHeight - GRID_GAP * (rows - 1)) / rows;
      const fit = Math.min(sizeFromWidth, sizeFromHeight);
      const size = Math.floor(standalone || fit >= MIN_TILE ? fit : Math.min(sizeFromWidth, Math.max(MIN_TILE, Math.min(sizeFromWidth, 150))));
      if (!standalone && size > sizeFromHeight) el.style.minHeight = `${rows * size + GRID_GAP * (rows - 1) + padY}px`;
      setCols(nextCols);
      setTileSize(size);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (gridWrapRef.current) ro.observe(gridWrapRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [standalone]);

  // Embedded on phones, the page's own side padding doubles up with the host's.
  const padX = standalone ? 'px-8 md:px-16 lg:px-24' : 'px-2 sm:px-8 md:px-16 lg:px-24';

  return (
    <div className={`${standalone ? 'h-full overflow-hidden' : 'min-h-full'} w-full bg-white flex flex-col`}>
      {/* Header */}
      <div className={`w-full ${padX} pt-8 md:pt-10 pb-5 flex-shrink-0`}>
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-start justify-between gap-6 mb-3">
            <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Tools &amp; Stack</p>
          </div>
          <h1 className="text-[30px] md:text-[38px] leading-[1.05] mb-2 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            What I <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>build</span> with
          </h1>
          <p className="text-[14px] leading-[1.5] max-w-xl text-muted-foreground">
            The tools that actually get used, day to day — from first sketch to shipped screen.
          </p>
        </motion.div>
      </div>

      {/* Tool grid — fills remaining space; tiles are computed square so they never stretch */}
      <div
        ref={gridWrapRef}
        className={`flex-1 min-h-0 w-full ${padX} pb-4 overflow-hidden flex items-center justify-center`}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
            gridAutoRows: `${tileSize}px`,
            gap: `${GRID_GAP}px`,
            opacity: tileSize ? 1 : 0,
          }}
        >
          {tools.map((tool, idx) => {
            const isFlipped = flippedIndex === idx || tappedIndex === idx;
            return (
              <motion.div
                key={tool.name}
                className="relative cursor-pointer"
                style={{ perspective: '1200px' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ delay: 0.1 + idx * 0.04, duration: 0.4, ease: 'easeOut' }}
                onMouseEnter={() => setFlippedIndex(idx)}
                onMouseLeave={() => setFlippedIndex(null)}
                onClick={() => setTappedIndex(tappedIndex === idx ? null : idx)}
              >
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 24 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-border/60 p-3 sm:p-4 bg-card flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 16px 32px -20px rgba(20,20,18,0.18), 0 4px 10px -6px rgba(20,20,18,0.1)',
                    }}
                  >
                    <div
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: tool.color, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.12)' }}
                    >
                      <div className="scale-[0.6] sm:scale-[0.65]">{tool.logo}</div>
                    </div>
                    <h3 className="text-[13px] sm:text-[14px] font-semibold text-foreground leading-tight">{tool.name}</h3>
                    <p className="text-[9px] tracking-[0.07em] uppercase text-muted-foreground">{tool.category}</p>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl p-3 sm:p-4 flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: tool.color,
                      boxShadow: '0 16px 32px -18px rgba(20,20,18,0.35)',
                    }}
                  >
                    <p
                      className="text-[10px] font-semibold tracking-[0.02em] mb-auto"
                      style={{
                        color: tool.textOnColor ?? '#FFFFFF',
                        opacity: 0.7,
                      }}
                    >
                      {tool.name}
                    </p>
                    <p
                      className="text-[11px] sm:text-[12.5px] leading-[1.45] font-medium"
                      style={{
                        color: tool.textOnColor ?? '#FFFFFF',
                        textShadow: tool.textOnColor ? 'none' : '0 1px 4px rgba(0,0,0,0.25)',
                      }}
                    >
                      {tool.note}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Currently learning — a proper tile, not just a caption strip */}
      <div className={`w-full ${padX} pb-6 md:pb-8 flex-shrink-0`}>
        <motion.div
          className="max-w-7xl mx-auto rounded-2xl px-6 py-5 flex items-center gap-4 relative overflow-hidden"
          style={{ backgroundColor: '#1A1A1A', boxShadow: '0 24px 48px -24px rgba(20,20,18,0.55)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(120deg, transparent, rgba(138,158,123,0.18), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', repeatDelay: 2 }}
          />
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{ backgroundColor: 'var(--primary)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.15)' }}
          >
            <SplineLogo />
          </div>
          <div className="relative min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary)' }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
              </span>
              <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--primary)' }}>
                Currently learning
              </p>
            </div>
            <p className="text-[16px] text-white font-medium leading-tight mb-0.5">Spline</p>
            <p className="text-[12.5px] leading-snug text-white/55">
              3D and cinematic UI transitions — not shipped anywhere yet.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
