import { useState } from 'react';
import { motion } from 'motion/react';

// ── Palette ────────────────────────────────────────────────────────────────────
const INK       = '#19181A';
const MUTED     = '#9A9591';
const HAIRLINE  = '#D9D5CF';
const PAGE_BG   = '#EDEAD5';
const RED_DOT   = '#923426';
const SANS      = "'DM Sans', -apple-system, sans-serif";
const SERIF     = "'Playfair Display', Georgia, serif";

// ── Cell definitions ──────────────────────────────────────────────────────────
type ContentType = 'gallery' | 'work' | 'fun' | 'about' | 'home' | 'contact' | 'interests' | 'resume' | 'stack';
type CellDef = { id: string; label: string; caption: string; content: ContentType };

const CELLS: CellDef[] = [
  { id: '01', label: 'Gallery',   caption: 'Photography & visual work',      content: 'gallery'   },
  { id: '02', label: 'Work',      caption: 'Product & interface design',      content: 'work'      },
  { id: '03', label: 'Fun',       caption: 'Side projects & experiments',     content: 'fun'       },
  { id: '04', label: 'About',     caption: 'Designer & problem solver',       content: 'about'     },
  { id: '05', label: 'Home',      caption: 'Return to the beginning',         content: 'home'      },
  { id: '06', label: 'Contact',   caption: 'Get in touch directly',           content: 'contact'   },
  { id: '07', label: 'Interests', caption: 'Things that hold my attention',   content: 'interests' },
  { id: '08', label: 'Resume',    caption: 'Experience & credentials',        content: 'resume'    },
  { id: '09', label: 'Stack',     caption: 'Tools & technologies used daily', content: 'stack'     },
];

// ── Minimal content thumbnails ─────────────────────────────────────────────────
function CellContent({ type }: { type: ContentType }) {
  const bar = (w: string | number, h = 8, opacity = 1) => (
    <div style={{ height: h, borderRadius: 2, backgroundColor: HAIRLINE, width: w, opacity }} />
  );

  switch (type) {
    case 'gallery':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
          {([82, 100, 64, 91] as number[]).map((w, i) => (
            <div key={i} style={{ height: 10, borderRadius: 2, backgroundColor: HAIRLINE, width: `${w}%` }} />
          ))}
        </div>
      );
    case 'work':
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52, width: '100%' }}>
          {([55, 100, 38, 72, 48, 88] as number[]).map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', backgroundColor: HAIRLINE, height: `${h}%` }} />
          ))}
        </div>
      );
    case 'fun':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5, width: '100%' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 3, backgroundColor: HAIRLINE }} />
          ))}
        </div>
      );
    case 'about':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: HAIRLINE, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {bar('88%', 7)}
            {bar('62%', 7)}
          </div>
        </div>
      );
    case 'home':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 48 }}>
          <span style={{ fontFamily: SERIF, fontSize: 52, color: INK, opacity: 0.1, fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>S</span>
        </div>
      );
    case 'contact':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, border: `1px solid ${HAIRLINE}`, flexShrink: 0 }} />
            {bar('70%', 7)}
          </div>
          <div style={{ height: 1, width: '100%', backgroundColor: HAIRLINE }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, border: `1px solid ${HAIRLINE}`, flexShrink: 0 }} />
            {bar('50%', 7)}
          </div>
        </div>
      );
    case 'interests':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {['Design', 'Music', 'Film', 'Books', 'Travel', 'Code'].map(tag => (
            <div key={tag} style={{
              padding: '3px 8px', borderRadius: 999,
              border: `1px solid ${HAIRLINE}`,
              fontSize: 9, color: MUTED, fontFamily: SANS, letterSpacing: '0.04em',
            }}>
              {tag}
            </div>
          ))}
        </div>
      );
    case 'resume':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {([80, 60, 90] as number[]).map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: HAIRLINE, flexShrink: 0 }} />
              <div style={{ height: 6, borderRadius: 2, backgroundColor: HAIRLINE, width: `${w}%` }} />
            </div>
          ))}
        </div>
      );
    case 'stack':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, width: '80%' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 4, backgroundColor: HAIRLINE }} />
          ))}
        </div>
      );
  }
}

// ── Single grid panel ──────────────────────────────────────────────────────────
function GridPanel({
  focused,
  onCellClick,
}: {
  focused: string | null;
  onCellClick?: (id: string) => void;
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 4,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      aspectRatio: '1440 / 860',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {CELLS.map((cell, idx) => {
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        const isFocused = focused === cell.id;
        const isDimmed = focused !== null && !isFocused;

        return (
          <motion.div
            key={cell.id}
            animate={{
              scale: isFocused ? 1.02 : 1,
              opacity: isDimmed ? 0.45 : 1,
            }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onCellClick?.(cell.id)}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: 20,
              backgroundColor: '#FFFFFF',
              borderRight: c < 2 ? `1px solid ${HAIRLINE}` : 'none',
              borderBottom: r < 2 ? `1px solid ${HAIRLINE}` : 'none',
              zIndex: isFocused ? 10 : 1,
              cursor: onCellClick ? 'pointer' : 'default',
              boxShadow: isFocused ? '0 2px 24px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
            }}
          >
            {/* ── Top row: index + dot ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{
                fontFamily: SANS,
                fontSize: 11,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.03em',
                color: MUTED,
                lineHeight: 1,
              }}>
                {cell.id}
              </span>
              <motion.div
                animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.4 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  backgroundColor: RED_DOT,
                  flexShrink: 0,
                }}
              />
            </div>

            {/* ── Content area ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CellContent type={cell.content} />
            </div>

            {/* ── Label + caption accordion ── */}
            <div style={{ marginTop: 12 }}>
              <span style={{
                display: 'block',
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: INK,
                lineHeight: 1.4,
              }}>
                {cell.label}
              </span>
              <motion.div
                animate={{
                  maxHeight: isFocused ? 28 : 0,
                  opacity: isFocused ? 1 : 0,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <span style={{
                  display: 'block',
                  paddingTop: 4,
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: '0.02em',
                  color: MUTED,
                  lineHeight: 1.5,
                }}>
                  {cell.caption}
                </span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Frame label ───────────────────────────────────────────────────────────────
function FrameLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{
        fontFamily: SANS,
        fontSize: 10,
        letterSpacing: '0.1em',
        color: MUTED,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: HAIRLINE }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function GridPanelPage() {
  const [interactive, setInteractive] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: PAGE_BG,
      padding: 'clamp(32px, 5vw, 64px) clamp(24px, 5vw, 56px)',
      fontFamily: SANS,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 60px)' }}>
          <h1 style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            color: INK,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            marginBottom: 6,
          }}>
            Grid Panel
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 12, color: MUTED, letterSpacing: '0.04em' }}>
            3 × 3 · hairline dividers · click any cell on the interactive frame
          </p>
        </div>

        {/* ── Frame 1: Default ── */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FrameLabel>Frame 1 — Default state</FrameLabel>
          <GridPanel focused={null} />
        </div>

        {/* ── Frame 2: Focused ── */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FrameLabel>Frame 2 — Focused state · 05 Home</FrameLabel>
          <GridPanel focused="05" />
        </div>

        {/* ── Interactive frame ── */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FrameLabel>
            Interactive — click any cell
            {interactive && (
              <span style={{ color: INK, marginLeft: 6, fontWeight: 500 }}>
                · {CELLS.find(c => c.id === interactive)?.label}
                <button
                  onClick={() => setInteractive(null)}
                  style={{
                    marginLeft: 8, fontSize: 10, color: MUTED, background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0, fontFamily: SANS, letterSpacing: '0.04em',
                  }}
                >
                  ✕ clear
                </button>
              </span>
            )}
          </FrameLabel>
          <GridPanel
            focused={interactive}
            onCellClick={(id) => setInteractive(prev => prev === id ? null : id)}
          />
        </div>

        {/* ── Spec callout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 1,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: HAIRLINE,
          marginBottom: 48,
        }}>
          {[
            ['Panel', '1440 × 860 · 4px radius · 1px border'],
            ['Cells', '1/3 width · 1/3 height · 20px pad'],
            ['Dividers', '1px hairline · right + bottom only'],
            ['Focus', 'scale 1.02 · caption open · dot visible'],
            ['Dimmed', '45% opacity · transform unchanged'],
            ['Dot', '6px · ' + RED_DOT + ' · hidden by default'],
          ].map(([k, v]) => (
            <div key={k} style={{ backgroundColor: '#FFFFFF', padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 11, color: INK, letterSpacing: '0.02em', lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
