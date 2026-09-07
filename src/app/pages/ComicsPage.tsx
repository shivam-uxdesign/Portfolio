import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import image14 from '../../imports/image-14.png';
import image15 from '../../imports/image-15.png';
import image16 from '../../imports/image-16.png';
import image17 from '../../imports/image-17.png';
import image19 from '../../imports/image-19.png';

export function ComicsPage() {
  const navigate = useNavigate();
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  const comicPanels = [
    {
      title: "CAP's (Keep Safe!!)",
      genre: 'SAFETY',
      image: image14,
      soundEffect: 'BAM!',
      color: '#FFD700',
      bgColor: '#FFF9E6',
    },
    {
      title: 'Hello!!',
      genre: 'FRIENDSHIP',
      image: image15,
      soundEffect: 'POW!',
      color: '#FF6B6B',
      bgColor: '#FFF0F0',
    },
    {
      title: 'My Big Little Sister',
      genre: 'FAMILY',
      image: image16,
      soundEffect: 'WHAM!',
      color: '#4FACFE',
      bgColor: '#E3F2FD',
    },
    {
      title: 'Dreams',
      genre: 'REFLECTION',
      image: image17,
      soundEffect: 'BOOM!',
      color: '#43E97B',
      bgColor: '#E8FFF0',
    },
    {
      title: 'Can You Not?',
      genre: 'LIFE',
      image: image19,
      soundEffect: 'ZAP!',
      color: '#FA709A',
      bgColor: '#FFF0F5',
    },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#EDE8E0' }}>
      {/* Pink-coral gradient strip on right edge */}
      <div
        className="fixed top-0 right-0 w-1 h-full z-50"
        style={{
          background: 'linear-gradient(to bottom, #FFB6C1, #FF7F7F)',
        }}
      />

      {/* SECTION 1 - Page header */}
      <section className="w-full px-8 md:px-16 lg:px-24 pt-20 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-3">
            <p className="text-[11px] tracking-[0.12em] text-muted-foreground">
              FUN & EXPLORATION
            </p>
          </div>
          <motion.h1
            className="text-[56px] md:text-[72px] leading-[1.05] mb-6 relative inline-block text-foreground"
            style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            Comics I've Written
            {/* Underline accent */}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 rounded-full"
              style={{ backgroundColor: '#FFD700', width: '140px' }}
              initial={{ width: 0 }}
              animate={{ width: '140px' }}
              transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            />
          </motion.h1>
          <p className="text-[18px] leading-[1.6] max-w-2xl mt-6 text-muted-foreground">
            Sequential storytelling as a side obsession
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Comic grid with square thumbnails */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {comicPanels.map((panel, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Square thumbnail */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-lg group"
                  style={{
                    aspectRatio: '1/1',
                    border: '3px solid #1A1A1A',
                    backgroundColor: '#FFFFFF',
                  }}
                  onMouseEnter={() => setHoveredPanel(idx)}
                  onMouseLeave={() => setHoveredPanel(null)}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <AnimatePresence>
                    {hoveredPanel === idx && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div
                          className="text-[40px] font-black"
                          style={{
                            color: panel.color,
                            textShadow: '3px 3px 0px #1A1A1A, -1px -1px 0px #FFFFFF',
                            WebkitTextStroke: '2px #1A1A1A',
                          }}
                        >
                          {panel.soundEffect}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Title and genre */}
                <div className="pt-3">
                  <h3
                    className="text-[14px] font-bold mb-1.5 leading-tight text-foreground"
                  >
                    {panel.title}
                  </h3>
                  <p
                    className="text-[10px] tracking-[0.04em] font-semibold px-2.5 py-1 rounded-full inline-block"
                    style={{
                      backgroundColor: panel.bgColor,
                      color: panel.color,
                    }}
                  >
                    {panel.genre}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Latest issue strip */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="rounded-2xl p-8 flex items-center justify-between"
            style={{
              backgroundColor: '#1A1A1A',
              border: '2px solid #1A1A1A',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <p className="text-[10px] tracking-[0.12em] mb-2 text-muted-foreground">
                LATEST ISSUE
              </p>
              <h3 className="text-[24px] font-bold mb-1" style={{ color: '#FFFFFF' }}>
                CAP's (Keep Safe!!)
              </h3>
              <p className="text-[14px]" style={{ color: '#A0A0A0' }}>
                Issue #1 — Safety & Mindfulness
              </p>
            </div>
            <button
              className="px-6 py-3 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: '#FFD700',
                color: '#1A1A1A',
                border: '2px solid #FFD700',
              }}
            >
              Read Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - Back navigation */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
            <span className="group-hover:text-foreground transition-colors">Back to Home</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
