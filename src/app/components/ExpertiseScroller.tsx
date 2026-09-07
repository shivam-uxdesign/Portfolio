import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const expertise = [
  {
    title: 'Product Strategy',
    description: 'Balancing user needs with business goals — from early research through to shipping products that actually matter.',
  },
  {
    title: 'User Research',
    description: 'Conducting user research to gather insights, identify pain points, and inform design decisions.',
  },
  {
    title: 'Digital Design',
    description: 'Translating strategy and research into interfaces that are as functional as they are refined.',
  },
  {
    title: 'Design Systems',
    description: 'Building scalable component libraries and documentation that teams actually adopt — not just ship and abandon.',
  },
];

export function ExpertiseScroller() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % expertise.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-background rounded-2xl p-3.5 border border-border">
      {/* Header */}
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-2">What I do best</p>

      {/* Content area — fixed height to prevent layout shift between slides */}
      <div className="relative overflow-hidden" style={{ height: '64px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col gap-1"
          >
            <h3 className="font-semibold leading-tight text-foreground text-[18px]">
              {expertise[currentIndex].title}
            </h3>
            <p className="text-[12px] text-muted-foreground leading-snug">
              {expertise[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {expertise.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-foreground scale-100'
                  : 'bg-border scale-75 group-hover:bg-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}