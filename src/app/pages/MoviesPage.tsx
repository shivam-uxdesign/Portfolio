import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

type Section = 'Watching Now' | 'Finished' | 'Want to Watch';

interface Movie {
  id: number;
  title: string;
  director: string;
  year: string;
  rating: number;
  personalTake: string;
  color: string;
  section: Section;
  isFeatured?: boolean;
  review?: string;
  trailerUrl?: string;
}

const movies: Movie[] = [
  {
    id: 1,
    title: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    year: '2014',
    rating: 5,
    personalTake: 'Perfect symmetry, pastel dreams',
    color: '#A89070',
    section: 'Watching Now',
    isFeatured: true,
    review: 'Anderson at his most whimsical. Every frame is a painting, every shot a deliberate composition. The color palette alone makes this worth multiple watches.',
    trailerUrl: 'https://www.youtube.com/embed/nTvEbQbR5sA',
  },
  {
    id: 2,
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    year: '2017',
    rating: 5,
    personalTake: 'Visually stunning meditation on humanity',
    color: '#1A1A1A',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4',
  },
  {
    id: 3,
    title: 'Parasite',
    director: 'Bong Joon-ho',
    year: '2019',
    rating: 5,
    personalTake: 'Masterclass in social commentary',
    color: '#6B8FA8',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/5xH0HfJHsaY',
  },
  {
    id: 4,
    title: 'Dune',
    director: 'Denis Villeneuve',
    year: '2021',
    rating: 4,
    personalTake: 'Epic scope, needs part two',
    color: '#A89070',
    section: 'Watching Now',
    trailerUrl: 'https://www.youtube.com/embed/8g18jFHCLXk',
  },
  {
    id: 5,
    title: 'Everything Everywhere All at Once',
    director: 'Daniels',
    year: '2022',
    rating: 5,
    personalTake: 'Chaotic brilliance',
    color: '#1A1A1A',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/wxN1T1uxQ2g',
  },
  {
    id: 6,
    title: 'Arrival',
    director: 'Denis Villeneuve',
    year: '2016',
    rating: 5,
    personalTake: 'Time as a circle, not a line',
    color: '#6B8FA8',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/tFMo3UJ4B4g',
  },
  {
    id: 7,
    title: 'The Lighthouse',
    director: 'Robert Eggers',
    year: '2019',
    rating: 4,
    personalTake: 'Beautifully unsettling',
    color: '#A89070',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/Hyag7lR8CPA',
  },
  {
    id: 8,
    title: 'Drive',
    director: 'Nicolas Winding Refn',
    year: '2011',
    rating: 5,
    personalTake: 'Neon noir perfection',
    color: '#1A1A1A',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/KBiOF3y1W0Y',
  },
  {
    id: 9,
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    year: '2015',
    rating: 5,
    personalTake: 'Two-hour chase sequence that works',
    color: '#6B8FA8',
    section: 'Finished',
    trailerUrl: 'https://www.youtube.com/embed/hEJnMQG9ev8',
  },
  {
    id: 10,
    title: 'Oppenheimer',
    director: 'Christopher Nolan',
    year: '2023',
    rating: 4,
    personalTake: 'Epic biopic, stunning sound design',
    color: '#A89070',
    section: 'Want to Watch',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
  },
  {
    id: 11,
    title: 'The Banshees of Inisherin',
    director: 'Martin McDonagh',
    year: '2022',
    rating: 4,
    personalTake: 'Dark Irish comedy at its finest',
    color: '#1A1A1A',
    section: 'Want to Watch',
    trailerUrl: 'https://www.youtube.com/embed/uRu3zLOJN2c',
  },
  {
    id: 12,
    title: 'The Northman',
    director: 'Robert Eggers',
    year: '2022',
    rating: 4,
    personalTake: 'Viking revenge saga',
    color: '#6B8FA8',
    section: 'Want to Watch',
    trailerUrl: 'https://www.youtube.com/embed/oMSdFM12hOw',
  },
  {
    id: 13,
    title: 'Nope',
    director: 'Jordan Peele',
    year: '2022',
    rating: 4,
    personalTake: 'UFO spectacle with substance',
    color: '#A89070',
    section: 'Want to Watch',
    trailerUrl: 'https://www.youtube.com/embed/In8fuzj3gck',
  },
  {
    id: 14,
    title: 'The Menu',
    director: 'Mark Mylod',
    year: '2022',
    rating: 4,
    personalTake: 'Delicious dark satire',
    color: '#1A1A1A',
    section: 'Want to Watch',
    trailerUrl: 'https://www.youtube.com/embed/C_uTkUGcHv4',
  },
];

const sections: Section[] = ['Watching Now', 'Finished', 'Want to Watch'];

export function MoviesPage() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<Section>('Watching Now');
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<Movie | null>(null);

  const filteredMovies = movies.filter((m) => m.section === selectedSection && !m.isFeatured);
  const featuredMovie = movies.find((m) => m.isFeatured);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMovieForTrailer(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-[20px]"
            style={{ color: star <= rating ? '#FFD700' : 'rgba(255, 255, 255, 0.3)' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

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
            Movies I'm Watching
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
            A very personal and slightly chaotic watchlist
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Section tabs */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            {sections.map((section) => (
              <motion.button
                key={section}
                className="px-4 py-2 rounded-full text-[12px] font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedSection === section ? '#1A1A1A' : 'rgba(26, 26, 26, 0.06)',
                  color: selectedSection === section ? '#FFFFFF' : '#6B6860',
                  border:
                    selectedSection === section ? '1px solid #1A1A1A' : '1px solid transparent',
                }}
                onClick={() => setSelectedSection(section)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {section}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - Featured pick (show only for Watching Now) */}
      {selectedSection === 'Watching Now' && featuredMovie && (
        <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: '#1A1A1A',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left - Poster */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: featuredMovie.color,
                      minHeight: '400px',
                    }}
                  >
                    <div
                      className="text-[14px] tracking-wide opacity-30"
                      style={{
                        color:
                          featuredMovie.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A',
                      }}
                    >
                      Movie poster
                    </div>
                  </div>
                </div>

                {/* Right - Info */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                  <p
                    className="text-[10px] tracking-[0.12em] font-semibold mb-4"
                    style={{ color: '#FFD700' }}
                  >
                    CURRENT OBSESSION
                  </p>

                  <h2
                    className="text-[36px] font-bold leading-tight mb-3"
                    style={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}
                  >
                    {featuredMovie.title}
                  </h2>

                  <p className="text-[16px] mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {featuredMovie.director} • {featuredMovie.year}
                  </p>

                  {renderStars(featuredMovie.rating)}

                  <p
                    className="text-[15px] leading-[1.6] mt-6"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {featuredMovie.review}
                  </p>

                  <motion.button
                    onClick={() => setSelectedMovieForTrailer(featuredMovie)}
                    className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-medium transition-all"
                    style={{
                      backgroundColor: '#FFD700',
                      color: '#1A1A1A',
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#FFC700',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" fill="#1A1A1A" />
                    Watch Trailer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SECTION 3 - Poster grid */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-20">
        <div className="max-w-7xl mx-auto">
          {selectedSection !== 'Watching Now' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredMovies.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  className="rounded-2xl overflow-hidden relative cursor-pointer group"
                  style={{
                    aspectRatio: '2/3',
                    backgroundColor: movie.color,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  {/* Poster placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[13px] tracking-wide opacity-30"
                      style={{ color: movie.color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A' }}
                    >
                      Poster
                    </div>
                  </div>

                  {/* Hover overlay */}
                  {hoveredMovie === movie.id && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-between p-4"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="mb-3">{renderStars(movie.rating)}</div>
                        <p
                          className="text-[13px] text-center leading-tight"
                          style={{ color: '#FFFFFF' }}
                        >
                          {movie.personalTake}
                        </p>
                      </div>

                      {movie.trailerUrl && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMovieForTrailer(movie);
                          }}
                          className="w-full px-4 py-2 rounded-full text-[12px] font-medium flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: '#FFD700',
                            color: '#1A1A1A',
                          }}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: '#FFC700',
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Play className="w-3.5 h-3.5" fill="#1A1A1A" />
                          Watch Trailer
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 - Back navigation */}
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

      {/* Trailer Modal */}
      <AnimatePresence>
        {selectedMovieForTrailer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedMovieForTrailer(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl rounded-3xl overflow-hidden"
              style={{
                backgroundColor: '#1A1A1A',
                aspectRatio: '16/9',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSelectedMovieForTrailer(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#FFFFFF',
                }}
                whileHover={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* YouTube iframe */}
              {selectedMovieForTrailer.trailerUrl && (
                <iframe
                  className="w-full h-full"
                  src={`${selectedMovieForTrailer.trailerUrl}?autoplay=1`}
                  title={`${selectedMovieForTrailer.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
