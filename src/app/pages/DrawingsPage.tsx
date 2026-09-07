import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';

type Medium = 'All' | 'Pencil' | 'Digital' | 'Watercolour';

interface Drawing {
  id: number;
  title: string;
  medium: Medium;
  mediumFull: string;
  year: string;
  size: string;
  time: string;
  series: string;
  description: string;
  color: string;
  height: 'short' | 'medium' | 'tall';
  isFeatured?: boolean;
}

const drawings: Drawing[] = [
  {
    id: 0,
    title: 'Untitled No. 1',
    medium: 'Pencil',
    mediumFull: 'Pencil on paper',
    year: '2024',
    size: 'A4',
    time: '~2 hours',
    series: 'Sketchbook Vol. 2',
    description: 'A quick study done during a late evening. Experimenting with negative space and loose lines.',
    color: '#A89070',
    height: 'medium',
    isFeatured: true,
  },
  {
    id: 1,
    title: 'Morning Light',
    medium: 'Watercolour',
    mediumFull: 'Watercolour on cold-press',
    year: '2024',
    size: 'A3',
    time: '~4 hours',
    series: 'Urban Studies',
    description: 'Capturing the warm morning light filtering through my studio window.',
    color: '#6B8FA8',
    height: 'tall',
  },
  {
    id: 2,
    title: 'Digital Portrait Study',
    medium: 'Digital',
    mediumFull: 'Digital (Procreate)',
    year: '2024',
    size: '2000×2500px',
    time: '~3 hours',
    series: 'Character Explorations',
    description: 'Testing new brushes and exploring different lighting scenarios.',
    color: '#1A1A1A',
    height: 'medium',
  },
  {
    id: 3,
    title: 'City Sketch',
    medium: 'Pencil',
    mediumFull: 'Pencil and ink',
    year: '2023',
    size: 'A5',
    time: '~1 hour',
    series: 'Travel Journal',
    description: 'Quick sketch from a coffee shop window, watching people pass by.',
    color: '#A89070',
    height: 'short',
  },
  {
    id: 4,
    title: 'Abstract Forms',
    medium: 'Digital',
    mediumFull: 'Digital (Illustrator)',
    year: '2024',
    size: '3000×3000px',
    time: '~5 hours',
    series: 'Geometric Series',
    description: 'Playing with shapes, gradients, and composition balance.',
    color: '#6B8FA8',
    height: 'medium',
  },
  {
    id: 5,
    title: 'Botanical Study',
    medium: 'Watercolour',
    mediumFull: 'Watercolour and ink',
    year: '2023',
    size: 'A4',
    time: '~2.5 hours',
    series: 'Nature Collection',
    description: 'Loose interpretation of plants from my balcony garden.',
    color: '#1A1A1A',
    height: 'tall',
  },
  {
    id: 6,
    title: 'Hand Studies',
    medium: 'Pencil',
    mediumFull: 'Graphite pencil',
    year: '2024',
    size: 'A4',
    time: '~1.5 hours',
    series: 'Anatomy Practice',
    description: 'Daily practice sketches focusing on gesture and form.',
    color: '#A89070',
    height: 'medium',
  },
];

export function DrawingsPage() {
  const navigate = useNavigate();
  const [selectedMedium, setSelectedMedium] = useState<Medium>('All');
  const [selectedDrawing, setSelectedDrawing] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mediums: Medium[] = ['All', 'Pencil', 'Digital', 'Watercolour'];

  const filteredDrawings = drawings.filter(
    (d) => selectedMedium === 'All' || d.medium === selectedMedium
  );

  const gridDrawings = filteredDrawings.filter((d) => !d.isFeatured);
  const featuredDrawing = drawings.find((d) => d.isFeatured);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedDrawing === null) return;

      if (e.key === 'Escape') {
        setSelectedDrawing(null);
      } else if (e.key === 'ArrowLeft') {
        navigateDrawing('prev');
      } else if (e.key === 'ArrowRight') {
        navigateDrawing('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDrawing]);

  const navigateDrawing = (direction: 'prev' | 'next') => {
    if (selectedDrawing === null) return;
    const currentIndex = drawings.findIndex((d) => d.id === selectedDrawing);
    const newIndex =
      direction === 'prev'
        ? currentIndex === 0
          ? drawings.length - 1
          : currentIndex - 1
        : currentIndex === drawings.length - 1
        ? 0
        : currentIndex + 1;
    setSelectedDrawing(drawings[newIndex].id);
  };

  const currentDrawing = drawings.find((d) => d.id === selectedDrawing);

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
            className="text-[56px] md:text-[72px] leading-[1.05] mb-6 relative inline-block text-foreground" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            Drawings I've Made
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
            Sketchbooks, digital, and everything in between
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Featured drawing */}
      {featuredDrawing && (
        <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="rounded-3xl relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: featuredDrawing.color,
                height: '380px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedDrawing(featuredDrawing.id)}
            >
              {/* Featured label */}
              <div
                className="absolute top-6 left-6 z-10 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.08em]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                FEATURED
              </div>

              {/* Placeholder for artwork */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="text-[14px] tracking-wide opacity-30 text-foreground"
                >
                  Artwork placeholder
                </div>
              </div>
            </motion.div>

            {/* Caption below */}
            <div className="flex items-center justify-between mt-4">
              <h3 className="text-[18px] font-bold text-foreground">
                {featuredDrawing.title}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {featuredDrawing.mediumFull}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* SECTION 3 - Filter chips */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            {mediums.map((medium) => (
              <motion.button
                key={medium}
                className="px-4 py-2 rounded-full text-[12px] font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedMedium === medium ? '#1A1A1A' : 'rgba(26, 26, 26, 0.06)',
                  color: selectedMedium === medium ? '#FFFFFF' : '#6B6860',
                  border: selectedMedium === medium ? '1px solid #1A1A1A' : '1px solid transparent',
                }}
                onClick={() => setSelectedMedium(medium)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {medium}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - Masonry grid */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <Masonry columnsCount={3} gutter="16px">
            {gridDrawings.map((drawing, idx) => {
              const heightMap = {
                short: '280px',
                medium: '380px',
                tall: '480px',
              };

              return (
                <motion.div
                  key={drawing.id}
                  className="rounded-3xl relative overflow-hidden cursor-pointer group"
                  style={{
                    backgroundColor: drawing.color,
                    height: heightMap[drawing.height],
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedDrawing(drawing.id)}
                  onMouseEnter={() => setHoveredCard(drawing.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Placeholder for artwork */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[14px] tracking-wide opacity-30"
                      style={{ color: drawing.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                    >
                      Artwork placeholder
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <AnimatePresence>
                    {hoveredCard === drawing.id && (
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-6"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.h3
                          className="text-[18px] font-bold mb-2"
                          style={{ color: '#FFFFFF' }}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.05 }}
                        >
                          {drawing.title}
                        </motion.h3>
                        <motion.div
                          className="inline-block px-3 py-1 rounded-full text-[11px] font-medium self-start"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#FFFFFF',
                          }}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {drawing.medium}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </Masonry>
        </div>
      </section>

      {/* SECTION 6 - Back navigation */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
            <span className="group-hover:text-foreground transition-colors">
              Back to Shivam's World
            </span>
          </motion.button>
        </div>
      </section>

      {/* SECTION 5 - Drawing Modal */}
      <AnimatePresence>
        {selectedDrawing !== null && currentDrawing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedDrawing(null)}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(26, 26, 26, 0.85)' }}
            />

            {/* Modal panel */}
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  color: '#6B6860',
                }}
                onClick={() => setSelectedDrawing(null)}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex h-full max-h-[90vh]">
                {/* Left column - Image */}
                <div
                  className="flex-[6] flex items-center justify-center p-12"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="text-[14px] tracking-wide"
                      style={{ color: '#D0D0D0' }}
                    >
                      Artwork placeholder
                    </div>
                  </div>
                </div>

                {/* Right column - Details */}
                <div className="flex-[4] p-8 flex flex-col overflow-y-auto">
                  {/* Top section */}
                  <div className="mb-8">
                    <p
                      className="text-[10px] tracking-[0.12em] mb-3 text-muted-foreground"
                    >
                      DRAWING
                    </p>
                    <h2
                      className="text-[32px] font-bold leading-tight mb-3 text-foreground" style={{ letterSpacing: '-0.01em' }}
                    >
                      {currentDrawing.title}
                    </h2>
                    <div className="flex gap-2 mb-2">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: 'rgba(26, 26, 26, 0.06)',
                        }}
                      >
                        {currentDrawing.medium.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground">
                      {currentDrawing.year}
                    </p>
                  </div>

                  {/* Middle section - About */}
                  <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(26, 26, 26, 0.1)' }}>
                    <p
                      className="text-[10px] tracking-[0.12em] mb-3 text-muted-foreground"
                    >
                      ABOUT THIS PIECE
                    </p>
                    <p className="text-[14px] leading-[1.6] text-muted-foreground">
                      {currentDrawing.description}
                    </p>
                  </div>

                  {/* Details section */}
                  <div className="mb-8">
                    <p
                      className="text-[10px] tracking-[0.12em] mb-4 text-muted-foreground"
                    >
                      DETAILS
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground">Medium:</span>
                        <span className="text-foreground">{currentDrawing.mediumFull}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="text-foreground">{currentDrawing.size}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-foreground">{currentDrawing.time}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground">Series:</span>
                        <span className="text-foreground">{currentDrawing.series}</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(26, 26, 26, 0.1)' }}>
                    <div className="flex items-center justify-between">
                      <button
                        className="flex items-center gap-2 text-[13px] font-medium transition-colors text-muted-foreground"
                        onClick={() => navigateDrawing('prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        className="flex items-center gap-2 text-[13px] font-medium transition-colors text-muted-foreground"
                        onClick={() => navigateDrawing('next')}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
