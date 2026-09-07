import { motion } from 'motion/react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NightmareRiderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0D0D0D' }}>
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
            <p
              className="text-[11px] tracking-[0.12em]"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              VIBE CODED
            </p>
          </div>
          <motion.h1
            className="text-[56px] md:text-[72px] leading-[1.05] mb-6 relative inline-block"
            style={{
              color: '#FFFFFF',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
            }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            Nightmare Rider
            {/* Underline accent */}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 rounded-full"
              style={{ backgroundColor: '#FFD700', width: '140px' }}
              initial={{ width: 0 }}
              animate={{ width: '140px' }}
              transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            />
          </motion.h1>
          <p
            className="text-[18px] leading-[1.6] max-w-2xl"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            A game born from a recurring dream.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Game embed */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Play now label with green dot */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#4CAF50' }}
              />
              <p
                className="text-[10px] tracking-[0.12em] font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                PLAY NOW
              </p>
            </div>

            {/* Game placeholder */}
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: '500px' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Gamepad2
                  className="w-16 h-16 mb-6"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                  strokeWidth={1.5}
                />
              </motion.div>

              <h3
                className="text-[24px] font-semibold mb-2"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Game loading soon
              </h3>
              <p
                className="text-[14px] mb-6"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                An HTML5 game. Playable right here.
              </p>

              <button
                disabled
                className="px-5 py-2.5 rounded-full text-[12px] font-medium"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'not-allowed',
                }}
              >
                Game file coming soon
              </button>
            </div>

            {/* Future iframe container - commented for now */}
            {/* <iframe
              src=""
              className="w-full"
              style={{ height: '500px', border: 'none' }}
              title="Nightmare Rider Game"
            /> */}
          </div>

          {/* Control hints */}
          <div className="mt-4 text-center">
            <p
              className="text-[12px] font-mono"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              ARROW KEYS — Move    SPACE — Jump    ESC — Pause
            </p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 - The story behind it */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left - The origin */}
              <div className="md:col-span-2">
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-4"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  THE ORIGIN
                </p>
                <p
                  className="text-[15px] leading-[1.8] mb-6"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  This game started as a recurring dream. A shape-shifting entity. An endless
                  universe. The feeling of being chased but never caught. I built this to get it
                  out of my head.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    HTML GAME
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    VIBE CODED
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    SOLO BUILD
                  </span>
                </div>
              </div>

              {/* Right - Game details */}
              <div>
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-4"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  GAME DETAILS
                </p>

                <div className="space-y-3">
                  {/* Detail row */}
                  <div
                    className="flex justify-between items-center pb-3"
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <span
                      className="text-[13px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      Engine:
                    </span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      Vanilla HTML + JS
                    </span>
                  </div>

                  <div
                    className="flex justify-between items-center pb-3"
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <span
                      className="text-[13px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      Style:
                    </span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      Top-down / infinite runner
                    </span>
                  </div>

                  <div
                    className="flex justify-between items-center pb-3"
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <span
                      className="text-[13px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      Theme:
                    </span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      Surreal / horror-lite
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className="text-[13px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      Status:
                    </span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      In development
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 - Back navigation */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium group"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            whileHover={{ x: -3 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft
              className="w-4 h-4 group-hover:text-white transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            />
            <span className="group-hover:text-white transition-colors">Back to Play</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
