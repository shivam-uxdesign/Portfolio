import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

export function WhatiswrongwithinPage() {
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
              Whatiswrongwith.in
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
              href="https://whatiswrongwith.in/"
              target="_blank"
              rel="noopener noreferrer"
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
            Type anything. Get brutally honest.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Live embed / demo */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              backgroundColor: '#1A1A1A',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Live demo label */}
            <div className="mb-4">
              <p
                className="text-[10px] tracking-[0.12em] font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                LIVE DEMO
              </p>
            </div>

            {/* Iframe embed */}
            <div className="rounded-2xl overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src="https://whatiswrongwith.in/"
                className="w-full h-full"
                style={{ border: 'none' }}
                title="Whatiswrongwith.in Live Demo"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>

            {/* Fallback link (shown if iframe is blocked) */}
            <div className="mt-4 text-center">
              <a
                href="https://whatiswrongwith.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                <span className="hover:text-white transition-colors">
                  Open live at whatiswrongwith.in
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 - How it works */}
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
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-border">
              {/* Step 1 */}
              <div className="px-0 md:px-8 first:pl-0 last:pr-0">
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-3 text-muted-foreground"
                >
                  STEP 01
                </p>
                <h3
                  className="text-[20px] font-bold mb-2 text-foreground" style={{ letterSpacing: '-0.01em' }}
                >
                  Type anything
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">
                  Paste your text, idea, or sentence into the input
                </p>
              </div>

              {/* Step 2 */}
              <div className="px-0 md:px-8 first:pl-0 last:pr-0">
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-3 text-muted-foreground"
                >
                  STEP 02
                </p>
                <h3
                  className="text-[20px] font-bold mb-2 text-foreground" style={{ letterSpacing: '-0.01em' }}
                >
                  AI analyses it
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">
                  The engine processes and evaluates your input
                </p>
              </div>

              {/* Step 3 */}
              <div className="px-0 md:px-8 first:pl-0 last:pr-0">
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-3 text-muted-foreground"
                >
                  STEP 03
                </p>
                <h3
                  className="text-[20px] font-bold mb-2 text-foreground" style={{ letterSpacing: '-0.01em' }}
                >
                  Get 5 brutal home truths
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">
                  Receive clear, unfiltered reasons why it has issues
                </p>
              </div>
            </div>
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
                    WEB APP
                  </span>
                </div>
                <p className="text-[14px] text-muted-foreground">
                  Solo build. Shipped in a weekend.
                </p>
              </div>

              {/* Right - The idea */}
              <div>
                <p
                  className="text-[11px] tracking-[0.12em] font-bold mb-4 text-muted-foreground"
                >
                  THE IDEA
                </p>
                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Sometimes you just need something to tell you what's wrong. No sugarcoating.
                  No maybe. Just 5 clear reasons why that thing has issues.
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
