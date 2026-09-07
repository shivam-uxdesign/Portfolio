import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Music, Film, Palette, Wrench, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router';

const interests = [
  {
    icon: BookMarked,
    label: 'Comics',
    description: "I've Written",
    pastel: { bg: '#EDE7F6', icon: '#7C4DFF', glow: 'rgba(124,77,255,0.12)' },
    link: '/comics',
  },
  {
    icon: Palette,
    label: 'Drawings',
    description: "I've Made",
    pastel: { bg: '#FCE4EC', icon: '#E91E8C', glow: 'rgba(233,30,140,0.12)' },
    link: '/drawings',
  },
  {
    icon: Wrench,
    label: 'Cool Stuff',
    description: "I've Built",
    pastel: { bg: '#FFF3E0', icon: '#F57C00', glow: 'rgba(245,124,0,0.12)' },
    link: '/cool-stuff',
  },
  {
    icon: Music,
    label: 'Music',
    description: "I'm Listening To",
    pastel: { bg: '#E3F2FD', icon: '#1976D2', glow: 'rgba(25,118,210,0.12)' },
    link: '/music',
  },
  {
    icon: BookOpen,
    label: 'Books',
    description: "I'm Reading",
    pastel: { bg: '#F9FBE7', icon: '#7CB342', glow: 'rgba(124,179,66,0.12)' },
    link: '/books',
  },
  {
    icon: Film,
    label: 'Movies',
    description: "I'm Watching",
    pastel: { bg: '#E0F7FA', icon: '#00838F', glow: 'rgba(0,131,143,0.12)' },
    link: '/movies',
  },
];

const rows = [interests.slice(0, 2), interests.slice(2, 4), interests.slice(4, 6)];

export function InterestGrid() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="h-full overflow-hidden rounded-2xl bg-background border border-border p-2">
      <div className="flex flex-col gap-2 h-full">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2 flex-1 min-h-0">
            {row.map((interest, cIdx) => {
              const idx = rIdx * 2 + cIdx;
              const Icon = interest.icon;
              const isHovered = hoveredIndex === idx;
              const isOtherHovered = hoveredIndex !== null && !isHovered;

              return (
                <motion.div
                  key={idx}
                  className="rounded-xl flex flex-col items-center justify-center gap-1.5 px-2 py-2 relative overflow-hidden cursor-pointer border border-border/30 min-w-0"
                  style={{
                    backgroundColor: isHovered ? interest.pastel.icon : '#FFFFFF',
                    flexBasis: 0,
                    flexGrow: isHovered ? 1.5 : isOtherHovered ? 0.75 : 1,
                    transition: 'flex-grow 0.35s ease, background-color 0.25s ease',
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => interest.link && navigate(interest.link)}
                  animate={{
                    opacity: isOtherHovered ? 0.55 : 1,
                    borderColor: isHovered ? interest.pastel.icon + '44' : 'rgba(28,28,26,0.1)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 22,
                    opacity: { duration: 0.18 },
                  }}
                >
                  {/* Radial glow blob */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.4 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 40%, ${interest.pastel.glow} 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: isHovered ? [0, -8, 6, 0] : 0,
                    }}
                    transition={{
                      rotate: { duration: 0.4, ease: 'easeOut' },
                    }}
                    className="relative z-10 flex-shrink-0"
                  >
                    <motion.div
                      animate={{ color: isHovered ? '#FFFFFF' : interest.pastel.icon }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={isHovered ? 2 : 1.5} />
                    </motion.div>
                  </motion.div>

                  {/* Label — always visible so touch devices can tell tiles apart without hover */}
                  <div className="flex flex-col items-center text-center min-w-0 z-10 px-1 w-full">
                    <motion.p
                      className="text-[10px] font-semibold leading-tight truncate max-w-full"
                      animate={{ color: isHovered ? '#FFFFFF' : 'var(--foreground)' }}
                      transition={{ duration: 0.2 }}
                    >
                      {interest.label}
                    </motion.p>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[9px] leading-tight truncate text-white/70 mt-0.5 max-w-full"
                        >
                          {interest.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
