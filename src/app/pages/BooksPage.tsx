import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  category: 'Reading Now' | 'Finished' | 'Pile of Shame';
  rating?: number;
  pullQuote?: string;
  color: string;
  spineWidth?: number;
}

const books: Book[] = [
  // Reading Now
  {
    id: 1,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Reading Now',
    pullQuote: '"Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible."',
    color: '#A89070',
    spineWidth: 80,
  },
  // Finished
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Finished',
    rating: 5,
    color: '#1A1A1A',
    spineWidth: 70,
  },
  {
    id: 3,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Finished',
    rating: 5,
    color: '#6B8FA8',
    spineWidth: 85,
  },
  {
    id: 4,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Finished',
    rating: 4,
    color: '#A89070',
    spineWidth: 65,
  },
  {
    id: 5,
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Finished',
    rating: 5,
    color: '#FFFFFF',
    spineWidth: 75,
  },
  {
    id: 6,
    title: 'Range',
    author: 'David Epstein',
    category: 'Finished',
    rating: 4,
    color: '#1A1A1A',
    spineWidth: 68,
  },
  // Pile of Shame
  {
    id: 7,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Pile of Shame',
    color: '#6B8FA8',
    spineWidth: 90,
  },
  {
    id: 8,
    title: 'The Culture Code',
    author: 'Daniel Coyle',
    category: 'Pile of Shame',
    color: '#A89070',
    spineWidth: 72,
  },
  {
    id: 9,
    title: 'Hooked',
    author: 'Nir Eyal',
    category: 'Pile of Shame',
    color: '#FFFFFF',
    spineWidth: 60,
  },
  {
    id: 10,
    title: 'The Mom Test',
    author: 'Rob Fitzpatrick',
    category: 'Pile of Shame',
    color: '#1A1A1A',
    spineWidth: 55,
  },
  {
    id: 11,
    title: 'Sprint',
    author: 'Jake Knapp',
    category: 'Pile of Shame',
    color: '#6B8FA8',
    spineWidth: 62,
  },
];

export function BooksPage() {
  const navigate = useNavigate();
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  const readingNow = books.find((b) => b.category === 'Reading Now');
  const finished = books.filter((b) => b.category === 'Finished');
  const pileOfShame = books.filter((b) => b.category === 'Pile of Shame');

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-[12px]"
            style={{ color: star <= rating ? '#FFD700' : 'rgba(0, 0, 0, 0.2)' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#EDE8E0' }}>
      {/* Pink-coral gradient strip */}
      <div
        className="fixed top-0 right-0 w-1 h-full z-50"
        style={{ background: 'linear-gradient(to bottom, #FFB6C1, #FF7F7F)' }}
      />

      {/* SECTION 1 - Header */}
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
            Books I'm Reading
            <motion.div
              className="absolute -bottom-2 left-0 h-1 rounded-full"
              style={{ backgroundColor: '#FFD700', width: '140px' }}
              initial={{ width: 0 }}
              animate={{ width: '140px' }}
              transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            />
          </motion.h1>
          <p className="text-[18px] leading-[1.6] max-w-2xl mt-6 text-muted-foreground">
            Design, fiction, and things that make me think
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Book spine shelf */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="rounded-3xl p-8 overflow-x-auto"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2 items-end justify-center min-w-max">
              {books.map((book, idx) => (
                <motion.div
                  key={book.id}
                  className="rounded-t-lg flex items-center justify-center relative cursor-pointer overflow-hidden"
                  style={{
                    width: `${book.spineWidth}px`,
                    height: '280px',
                    backgroundColor: book.color,
                    border: book.color === '#FFFFFF' ? '1px solid rgba(26, 26, 26, 0.1)' : 'none',
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                >
                  {/* Rotated title on spine */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    <p
                      className="text-[11px] font-semibold tracking-wide whitespace-nowrap px-4"
                      style={{
                        color: book.color === '#FFFFFF' || book.color === '#A89070' ? '#1A1A1A' : '#FFFFFF',
                      }}
                    >
                      {book.title}
                    </p>
                  </div>

                  {/* Hover tooltip */}
                  {hoveredBook === book.id && (
                    <motion.div
                      className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg whitespace-nowrap z-10"
                      style={{
                        backgroundColor: '#1A1A1A',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-[11px] font-medium" style={{ color: '#FFFFFF' }}>
                        {book.author}
                      </p>
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0"
                        style={{
                          borderLeft: '4px solid transparent',
                          borderRight: '4px solid transparent',
                          borderTop: '4px solid #1A1A1A',
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - Reading sections */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Reading Now */}
          {readingNow && (
            <div>
              <h3 className="text-[13px] tracking-[0.12em] font-semibold mb-4 text-foreground">
                READING NOW
              </h3>
              <motion.div
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Cover */}
                  <div className="w-full md:w-1/4 flex-shrink-0">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: readingNow.color,
                        minHeight: '320px',
                      }}
                    >
                      <div
                        className="text-[14px] tracking-wide opacity-30"
                        style={{
                          color: readingNow.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A',
                        }}
                      >
                        Book cover
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-8 md:p-10">
                    <p className="text-[10px] tracking-[0.12em] font-semibold mb-4 text-muted-foreground">
                      CURRENTLY READING
                    </p>
                    <h2
                      className="text-[32px] font-bold leading-tight mb-2 text-foreground"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {readingNow.title}
                    </h2>
                    <p className="text-[16px] mb-6 text-muted-foreground">
                      {readingNow.author}
                    </p>
                    <blockquote
                      className="text-[15px] leading-[1.8] italic border-l-2 pl-4"
                      style={{
                        color: '#6B6860',
                        borderColor: 'rgba(26, 26, 26, 0.2)',
                      }}
                    >
                      {readingNow.pullQuote}
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Finished */}
          <div>
            <h3 className="text-[13px] tracking-[0.12em] font-semibold mb-4 text-foreground">
              FINISHED
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {finished.map((book, idx) => (
                <motion.div
                  key={book.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden relative"
                  style={{
                    width: '160px',
                    aspectRatio: '2/3',
                    backgroundColor: book.color,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    border: book.color === '#FFFFFF' ? '1px solid rgba(26, 26, 26, 0.1)' : 'none',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Cover placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[12px] tracking-wide opacity-30"
                      style={{ color: book.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                    >
                      Cover
                    </div>
                  </div>

                  {/* Rating chip */}
                  {book.rating && (
                    <div
                      className="absolute bottom-3 right-3 px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {renderStars(book.rating)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pile of Shame */}
          <div>
            <h3 className="text-[13px] tracking-[0.12em] font-semibold mb-4 text-foreground">
              PILE OF SHAME
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {pileOfShame.map((book, idx) => (
                <motion.div
                  key={book.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden relative"
                  style={{
                    width: '160px',
                    aspectRatio: '2/3',
                    backgroundColor: book.color,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    border: book.color === '#FFFFFF' ? '1px solid rgba(26, 26, 26, 0.1)' : 'none',
                    opacity: 0.6,
                    filter: 'grayscale(0.3)',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 0.6, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, opacity: 0.8 }}
                >
                  {/* Cover placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[12px] tracking-wide opacity-30"
                      style={{ color: book.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                    >
                      Cover
                    </div>
                  </div>

                  {/* Someday chip */}
                  <div
                    className="absolute bottom-3 right-3 px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(138, 135, 128, 0.9)',
                    }}
                  >
                    <p className="text-[9px] font-semibold tracking-wide" style={{ color: '#FFFFFF' }}>
                      SOMEDAY
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
            <span className="group-hover:text-foreground transition-colors">
              Back to Shivam's World
            </span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
