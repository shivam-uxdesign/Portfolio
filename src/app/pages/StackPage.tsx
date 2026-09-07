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

function FramerLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4 0h16v8H4zm0 8h8l8 8H4zm0 8h8v8z" fill="white" />
    </svg>
  );
}

function MazeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FF5C35" />
      <path d="M8 28V14l6 8 6-8 6 8 6-8v14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinearLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
      <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L38.334 96.1782c.6889.6889.0915 1.8189-.857 1.5964C20.4511 94.2484 5.75159 79.5489 1.22541 61.5228zM.00189135 46.8891c-.01764375 1.0574.88777 1.9338 1.94524 1.9338h49.2461c1.0574 0 1.9351-.8777 1.9351-1.9351V2.00014c0-1.0574-.8777-1.9351-1.9351-1.9351C27.9401.0650416 6.36778 19.9001.00189135 46.8891zM99.9981 53.1109c.0176 1.0574-.8878 1.9338-1.9452 1.9338H49.8066c-1.0574 0-1.9351-.8777-1.9351-1.9351V2.00014c0-1.0574.8777-1.9351 1.9351-1.9351C72.0599.0650416 93.6322 19.9001 99.9981 53.1109zm-.2254 8.4119c.2225-.9485-.9075-1.5459-1.5964-.857L61.666 96.1782c-.6889.6889-.0915 1.8189.857 1.5964C79.5489 94.2484 94.2484 79.5489 99.7727 61.5228z" fill="white" />
    </svg>
  );
}

function ZeplinLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FDBD39" />
      <path d="M10 14h20L10 26h20" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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

function SplineLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="white" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" stroke="white" strokeWidth="1.6" />
    </svg>
  );
}

const tools = [
  { name: 'Figma', category: 'Design', color: '#F24E1E', logo: <FigmaLogo />, note: 'Where every screen starts and ends.' },
  { name: 'FigJam', category: 'Workshops', color: '#9747FF', logo: <FigJamLogo />, note: 'Messy thinking, before the clean version.' },
  { name: 'Notion', category: 'Docs', color: '#000000', logo: <NotionLogo />, note: 'Specs, decisions, and the source of truth.' },
  { name: 'Framer', category: 'Prototyping', color: '#0055FF', logo: <FramerLogo />, note: 'Prototypes that feel closer to real.' },
  { name: 'Maze', category: 'Testing', color: '#FF5C35', logo: <MazeLogo />, note: 'Usability testing without the overhead.' },
  { name: 'Linear', category: 'Planning', color: '#5E6AD2', logo: <LinearLogo />, note: 'Tracking work without the ceremony.' },
  { name: 'Zeplin', category: 'Handoff', color: '#FDBD39', logo: <ZeplinLogo />, note: 'Clean handoff, fewer Slack pings.', textOnColor: '#1A1A1A' },
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
    function measure() {
      const el = gridWrapRef.current;
      if (!el) return;
      const nextCols = window.innerWidth >= 640 ? 4 : 2;
      const rows = Math.ceil(tools.length / nextCols);
      const availableWidth = el.clientWidth;
      const availableHeight = el.clientHeight;
      const sizeFromWidth = (availableWidth - GRID_GAP * (nextCols - 1)) / nextCols;
      const sizeFromHeight = (availableHeight - GRID_GAP * (rows - 1)) / rows;
      setCols(nextCols);
      setTileSize(Math.floor(Math.min(sizeFromWidth, sizeFromHeight)));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-8 md:px-16 lg:px-24 pt-8 md:pt-10 pb-5 flex-shrink-0">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-start justify-between gap-6 mb-3">
            <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Tools &amp; Stack</p>
            {standalone && (
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-[12px] font-medium group text-muted-foreground flex-shrink-0"
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
                <span className="group-hover:text-foreground transition-colors">Back</span>
              </motion.button>
            )}
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
        className="flex-1 min-h-0 w-full px-8 md:px-16 lg:px-24 pb-4 overflow-hidden flex items-center justify-center"
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
      <div className="w-full px-8 md:px-16 lg:px-24 pb-6 md:pb-8 flex-shrink-0">
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
