import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  tag: string;
}

const sampleMeals: Meal[] = [
  {
    id: 1,
    name: 'Grilled Chicken Bowl',
    calories: 480,
    protein: 38,
    tag: 'HIGH PROTEIN',
  },
  {
    id: 2,
    name: 'Paneer Tikka Wrap',
    calories: 420,
    protein: 32,
    tag: 'BALANCED',
  },
  {
    id: 3,
    name: 'Oats & Banana Smoothie',
    calories: 320,
    protein: 18,
    tag: 'LIGHT',
  },
  {
    id: 4,
    name: 'Dal Rice with Ghee',
    calories: 380,
    protein: 22,
    tag: 'BALANCED',
  },
];

export function WhatshouldieatPage() {
  const navigate = useNavigate();

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
              VIBE CODED
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <motion.h1
              className="text-[56px] md:text-[72px] leading-[1.05] relative inline-block text-foreground" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
            >
              Whatshouldieat.in
              {/* Underline accent */}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 rounded-full"
                style={{ backgroundColor: '#FFD700', width: '140px' }}
                initial={{ width: 0 }}
                animate={{ width: '140px' }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
              />
            </motion.h1>
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium transition-all"
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0)',
                color: '#6B6860',
                border: '1px solid rgba(26, 26, 26, 0.2)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                borderColor: '#1A1A1A',
              }}
            >
              Visit Live Site
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
          <p className="text-[18px] leading-[1.6] max-w-2xl text-muted-foreground">
            Tell it your goals. It tells you what to eat.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - How it works (visual flow) */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 overflow-x-auto pb-4">
            {/* Step 1 */}
            <motion.div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                minWidth: '180px',
                minHeight: '140px',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p
                className="text-[16px] font-semibold text-center text-foreground"
              >
                You
              </p>
              <p
                className="text-[12px] text-center mt-2 text-muted-foreground"
              >
                Start here
              </p>
            </motion.div>

            <ArrowRight className="flex-shrink-0 w-6 h-6 text-foreground" />

            {/* Step 2 */}
            <motion.div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                backgroundColor: '#A89070',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                minWidth: '180px',
                minHeight: '140px',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p
                className="text-[16px] font-semibold text-center"
                style={{ color: '#FFFFFF' }}
              >
                Enter protein
              </p>
              <p
                className="text-[16px] font-semibold text-center"
                style={{ color: '#FFFFFF' }}
              >
                & calorie goals
              </p>
              <p
                className="text-[12px] text-center mt-2"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Your targets
              </p>
            </motion.div>

            <ArrowRight className="flex-shrink-0 w-6 h-6 text-foreground" />

            {/* Step 3 */}
            <motion.div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                minWidth: '180px',
                minHeight: '140px',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p
                className="text-[16px] font-semibold text-center text-foreground"
              >
                Engine finds
              </p>
              <p
                className="text-[16px] font-semibold text-center text-foreground"
              >
                best matches
              </p>
              <p
                className="text-[12px] text-center mt-2 text-muted-foreground"
              >
                AI processing
              </p>
            </motion.div>

            <ArrowRight className="flex-shrink-0 w-6 h-6 text-foreground" />

            {/* Step 4 */}
            <motion.div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                backgroundColor: '#1A1A1A',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                minWidth: '180px',
                minHeight: '140px',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p
                className="text-[16px] font-semibold text-center"
                style={{ color: '#FFFFFF' }}
              >
                4 meals
              </p>
              <p
                className="text-[16px] font-semibold text-center"
                style={{ color: '#FFFFFF' }}
              >
                with recipe
              </p>
              <p
                className="text-[12px] text-center mt-2"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Ready to cook
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 - Sample output */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="mb-6">
            <p
              className="text-[11px] tracking-[0.12em] font-semibold text-muted-foreground"
            >
              SAMPLE OUTPUT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleMeals.map((meal, idx) => (
              <motion.div
                key={meal.id}
                className="rounded-3xl p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <h3
                  className="text-[20px] font-semibold mb-4 text-foreground" style={{ letterSpacing: '-0.01em' }}
                >
                  {meal.name}
                </h3>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-muted-foreground">
                      🔥
                    </span>
                    <span className="text-[14px] font-medium text-foreground">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-muted-foreground">
                      💪
                    </span>
                    <span className="text-[14px] font-medium text-foreground">
                      {meal.protein}g protein
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.08em]"
                    style={{
                      backgroundColor:
                        meal.tag === 'HIGH PROTEIN'
                          ? 'rgba(138, 158, 123, 0.15)'
                          : meal.tag === 'LIGHT'
                            ? 'rgba(168, 144, 112, 0.15)'
                            : 'rgba(107, 143, 168, 0.15)',
                      color:
                        meal.tag === 'HIGH PROTEIN'
                          ? '#8A9E7B'
                          : meal.tag === 'LIGHT'
                            ? '#A89070'
                            : '#6B8FA8',
                      border: `1px solid ${
                        meal.tag === 'HIGH PROTEIN'
                          ? 'rgba(138, 158, 123, 0.3)'
                          : meal.tag === 'LIGHT'
                            ? 'rgba(168, 144, 112, 0.3)'
                            : 'rgba(107, 143, 168, 0.3)'
                      }`,
                    }}
                  >
                    {meal.tag}
                  </span>

                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground"
                    whileHover={{ x: 3, color: '#1A1A1A' }}
                    transition={{ duration: 0.2 }}
                  >
                    See Recipe
                    <ArrowRight className="w-3 h-3" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 - Behind the build */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left - Built with */}
              <div>
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-4 text-muted-foreground"
                >
                  BUILT WITH
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'rgba(26, 26, 26, 0.06)',
                    }}
                  >
                    VIBE CODED
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'rgba(26, 26, 26, 0.06)',
                    }}
                  >
                    AI
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'rgba(26, 26, 26, 0.06)',
                    }}
                  >
                    NUTRITION ENGINE
                  </span>
                </div>
                <p className="text-[14px] text-muted-foreground">
                  Decision fatigue is real. This kills it.
                </p>
              </div>

              {/* Right - The problem */}
              <div>
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-4 text-muted-foreground"
                >
                  THE PROBLEM IT SOLVES
                </p>
                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Most people know their goals but not what to eat. This takes your protein and
                  calorie targets and removes the decision entirely — 4 meals, full recipes, ready
                  to go.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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
            <span className="group-hover:text-foreground transition-colors">Back to Play</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
