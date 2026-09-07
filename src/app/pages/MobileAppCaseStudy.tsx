import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RevealOnView } from '../components/RevealOnView';

export function MobileAppCaseStudy() {
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

      {/* SECTION 1 - Hero (two column) */}
      <section className="w-full px-8 md:px-16 lg:px-24 pt-24 pb-16">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
            {/* Left: Phone mockup */}
            <div className="flex justify-center lg:justify-start">
              <motion.div
                className="rounded-[36px] flex items-center justify-center"
                style={{
                  backgroundColor: '#1A1A1A',
                  width: '280px',
                  height: '580px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Smartphone className="w-16 h-16" style={{ color: '#3B3B38', strokeWidth: 1 }} />
              </motion.div>
            </div>

            {/* Right: Content */}
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  MOBILE
                </span>
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  UX REDESIGN
                </span>
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  RETENTION
                </span>
              </div>

              <h1 className="text-[56px] md:text-[64px] leading-[1.05] mb-6 text-foreground">
                Mobile App Redesign
              </h1>

              <p className="text-[20px] mb-8 leading-[1.4]" style={{ color: '#6B8FA8' }}>
                Increasing user retention by 40%
              </p>

              <p className="text-[17px] leading-[1.7] max-w-xl text-muted-foreground">
                A structural rethink of onboarding and navigation — not a visual refresh, but a rebuild
                around the features people actually opened the app for.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 1B - The Problem */}
      <section className="w-full py-16 border-t border-border">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <h2 className="text-[28px] mb-6 leading-[1.3] text-foreground">
            The Problem
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[17px] leading-[1.7] text-muted-foreground max-w-5xl">
            <p>
              Users were dropping off after the first session. The app felt cluttered, navigation was
              confusing, and core features were buried three taps deep — the product concept tested well,
              but the interface was actively working against it.
            </p>
            <p>
              We needed to rethink the entire mobile experience from the ground up: not a visual refresh,
              but a structural one — fewer steps to the features people actually opened the app for.
            </p>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 2 - The Process (alternating content rows) */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 space-y-24">
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">The Process</p>
          {/* Row 1: Text left, phone right */}
          <RevealOnView className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] mb-4 leading-[1.2] text-foreground">
                Research & Discovery
              </h2>
              <p className="text-[17px] leading-[1.7] text-muted-foreground">
                We conducted 24 user interviews and analyzed behavioral data from 10,000+ sessions. The pattern was
                clear: users loved the product concept but found the interface overwhelming. Navigation required too
                many steps and key features weren't discoverable.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div
                className="rounded-[32px] flex items-center justify-center"
                style={{
                  backgroundColor: '#1A1A1A',
                  width: '240px',
                  height: '480px',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Smartphone className="w-12 h-12" style={{ color: '#3B3B38', strokeWidth: 1 }} />
              </div>
            </div>
          </RevealOnView>

          {/* Row 2: Phone left, text right */}
          <RevealOnView className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div
                className="rounded-[32px] flex items-center justify-center"
                style={{
                  backgroundColor: '#1A1A1A',
                  width: '240px',
                  height: '480px',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Smartphone className="w-12 h-12" style={{ color: '#3B3B38', strokeWidth: 1 }} />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-[32px] mb-4 leading-[1.2] text-foreground">
                Key Design Decisions
              </h2>
              <p className="text-[17px] leading-[1.7] text-muted-foreground">
                We simplified navigation to a bottom tab bar, surfaced frequently-used features on the home screen,
                and introduced progressive disclosure for advanced options. Every screen was redesigned around a
                single primary action, reducing cognitive load.
              </p>
            </div>
          </RevealOnView>

          {/* Row 3: Text left, phone right */}
          <RevealOnView className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] mb-4 leading-[1.2] text-foreground">
                Final Solution
              </h2>
              <p className="text-[17px] leading-[1.7] text-muted-foreground">
                The redesigned app launched with a streamlined onboarding flow, an intuitive home screen with quick
                actions, and a contextual help system. User testing showed a 40% improvement in task completion
                rates and overwhelmingly positive feedback.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div
                className="rounded-[32px] flex items-center justify-center"
                style={{
                  backgroundColor: '#1A1A1A',
                  width: '240px',
                  height: '480px',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Smartphone className="w-12 h-12" style={{ color: '#3B3B38', strokeWidth: 1 }} />
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* SECTION 3 - Retention graph */}
      <section className="w-full py-20 my-16" style={{ backgroundColor: '#1A1A1A' }}>
        <RevealOnView className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.12em] mb-12 text-center text-muted-foreground">
            USER RETENTION OVER TIME
          </p>

          {/* Graph placeholder */}
          <div className="relative h-80 flex items-end justify-between px-8">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[11px] text-muted-foreground">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Graph line simulation */}
            <div className="flex-1 ml-16 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-[1px]" style={{ backgroundColor: '#2A2A2A' }} />
                ))}
              </div>

              {/* Line path */}
              <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
                {/* Before line (lower) */}
                <path
                  d="M 0 240 L 150 220 L 300 200"
                  stroke="#6B6860"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="6 6"
                />
                {/* After line (higher) */}
                <path
                  d="M 300 200 L 450 100 L 600 80"
                  stroke="#6B8FA8"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>

              {/* Markers */}
              <div className="absolute" style={{ left: '50%', top: '62%' }}>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B6860' }} />
                  <p className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted-foreground">
                    BEFORE
                  </p>
                </div>
              </div>
              <div className="absolute" style={{ left: '100%', top: '25%' }}>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B8FA8' }} />
                  <p className="absolute top-6 right-0 whitespace-nowrap text-[11px] text-muted-foreground">
                    AFTER
                  </p>
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-16 right-0 flex justify-between text-[11px] -mb-8 text-muted-foreground">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 4 - Old vs New comparison */}
      <section className="w-full py-20">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Before */}
            <div className="text-center">
              <p className="text-[11px] tracking-[0.12em] mb-8 text-muted-foreground">
                BEFORE
              </p>
              <div className="flex justify-center">
                <div
                  className="rounded-[32px] flex items-center justify-center opacity-50"
                  style={{
                    backgroundColor: '#8A8780',
                    width: '240px',
                    height: '480px',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Smartphone className="w-12 h-12" style={{ color: '#E0DDD8', strokeWidth: 1 }} />
                </div>
              </div>
            </div>

            {/* After */}
            <div className="text-center">
              <p className="text-[11px] tracking-[0.12em] mb-8 text-muted-foreground">
                AFTER
              </p>
              <div className="flex justify-center relative">
                <div
                  className="rounded-[32px] flex items-center justify-center"
                  style={{
                    backgroundColor: '#6B8FA8',
                    width: '240px',
                    height: '480px',
                    boxShadow: '0 8px 32px rgba(107, 143, 168, 0.3)',
                  }}
                >
                  <Smartphone className="w-12 h-12" style={{ color: '#FFFFFF', strokeWidth: 1 }} />
                </div>

                {/* Annotation callouts */}
                <div className="absolute" style={{ top: '20%', right: '-40px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]" style={{ backgroundColor: '#8A9E7B', color: '#FFFFFF' }}>
                      1
                    </div>
                  </div>
                </div>
                <div className="absolute" style={{ top: '50%', right: '-40px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]" style={{ backgroundColor: '#8A9E7B', color: '#FFFFFF' }}>
                      2
                    </div>
                  </div>
                </div>
                <div className="absolute" style={{ bottom: '15%', right: '-40px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]" style={{ backgroundColor: '#8A9E7B', color: '#FFFFFF' }}>
                      3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 5 - Outcome metrics */}
      <section className="w-full py-20 bg-card">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="text-[72px] leading-[1] mb-4" style={{ color: '#8A9E7B' }}>
                40%
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                RETENTION
              </p>
            </div>
            <div>
              <div className="text-[72px] leading-[1] mb-4" style={{ color: '#8A9E7B' }}>
                4.6★
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                RATING
              </p>
            </div>
            <div>
              <div className="text-[72px] leading-[1] mb-4" style={{ color: '#8A9E7B' }}>
                2.1x
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                SESSION LENGTH
              </p>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 5B - Reflection */}
      <section className="w-full py-20">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.12em] mb-6 text-muted-foreground uppercase">Reflection</p>
          <p className="text-[20px] md:text-[24px] leading-[1.5] text-foreground max-w-3xl">
            The behavioral data made the case, but the interviews made the fix obvious — retention wasn't a
            marketing problem, it was a findability problem. In hindsight I'd push for the bottom-tab
            restructure a phase earlier; we spent real time polishing screens that got substantially
            simplified once the navigation model changed underneath them.
          </p>
        </RevealOnView>
      </section>

      {/* SECTION 6 - Navigation footer */}
      <section className="w-full py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Previous Case Study */}
            <motion.button
              onClick={() => navigate('/case-study/design-system')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: -3 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Design System</span>
            </motion.button>

            {/* Back to all work */}
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3 }}
            >
              <span className="group-hover:text-foreground transition-colors">Back to all work</span>
              <ArrowRight className="w-4 h-4 group-hover:text-foreground transition-colors" />
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
