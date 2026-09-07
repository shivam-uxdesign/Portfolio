import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { RevealOnView } from '../components/RevealOnView';

export function BMDashboardCaseStudy() {
  const navigate = useNavigate();
  const [isDividerHovered, setIsDividerHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - Hero */}
      <section className="w-full px-8 md:px-16 lg:px-24 pt-20 pb-12">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-8">
            {/* Left side - Title and tags */}
            <div>
              <h1 className="text-[64px] md:text-[72px] leading-[0.95] mb-6 text-foreground">
                Redesigned BM Dashboard
              </h1>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  PRODUCT DESIGN
                </span>
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  DASHBOARD
                </span>
                <span
                  className="px-4 py-2 rounded-full text-[11px] font-medium tracking-[0.06em] bg-card text-muted-foreground"
                >
                  B2B
                </span>
              </div>
            </div>

            {/* Right side - Impact stat */}
            <div className="flex flex-col items-end justify-center">
              <div className="text-[96px] md:text-[120px] leading-[0.85]" style={{ color: '#8A9E7B' }}>
                32m → 5m
              </div>
              <p className="text-[13px] tracking-[0.06em] mt-4 text-muted-foreground">
                AVERAGE TASK COMPLETION TIME
              </p>
            </div>
          </div>

          {/* Horizontal rule */}
          <div className="w-full h-[1px] bg-border" />
        </motion.div>
      </section>

      {/* SECTION 2 - Overview bar */}
      <section className="w-full py-12" style={{ backgroundColor: '#1A1A1A' }}>
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-[11px] tracking-[0.1em] mb-3 text-muted-foreground">
                ROLE
              </p>
              <p className="text-[15px] text-white">
                Lead Product Designer
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.1em] mb-3 text-muted-foreground">
                TIMELINE
              </p>
              <p className="text-[15px] text-white">
                6 months (2023)
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.1em] mb-3 text-muted-foreground">
                TEAM
              </p>
              <p className="text-[15px] text-white">
                2 designers, 4 engineers, 1 PM
              </p>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 3 - Two column editorial */}
      <section className="w-full py-20">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
            {/* Left column - Problem narrative */}
            <div>
              <h2 className="text-[28px] mb-6 leading-[1.3] text-foreground">
                The Problem
              </h2>
              <div className="space-y-6 text-[17px] leading-[1.7] text-muted-foreground">
                <p>
                  The operations team was spending 32 minutes on average completing a single task. The dashboard had
                  grown organically over 3 years with no design system, resulting in inconsistent patterns and a
                  cluttered interface.
                </p>
                <p>
                  User research revealed that operators were struggling to locate critical information, leading to
                  errors and frustration. The lack of hierarchy and visual guidance meant users had to rely on
                  institutional knowledge rather than interface design.
                </p>
                <p>
                  Our goal was to redesign the dashboard from the ground up, creating a cohesive system that would
                  reduce task completion time, minimize errors, and improve the overall user experience for the
                  operations team.
                </p>
              </div>
            </div>

            {/* Right column - Sticky image */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div
                className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#A89070' }}
              >
                <div className="w-24 h-24 rounded-full border-2" style={{ borderColor: '#8B7258' }} />
              </div>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 3B - The Process */}
      <section className="w-full py-20 border-t border-border">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <h2 className="text-[28px] mb-10 leading-[1.3] text-foreground">
            The Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Research', body: 'Shadowed the operations team through a full shift, mapping every click of their existing workflow to find where time actually went.' },
              { step: '02', title: 'Define', body: 'Grouped the friction into three causes: no visual hierarchy, no shared patterns, and critical data buried below the fold.' },
              { step: '03', title: 'Design', body: 'Rebuilt the dashboard around a task-first hierarchy — surfacing the fields operators check most, with consistent components throughout.' },
              { step: '04', title: 'Test', body: 'Ran the redesign past the same operators who validated the original workflow, iterating on layout until task time held steady under real usage.' },
            ].map((s) => (
              <div key={s.step}>
                <div className="text-[13px] mb-3" style={{ color: '#8A9E7B' }}>{s.step}</div>
                <h3 className="text-[16px] font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 4 - Before/After comparison */}
      <section className="w-full py-20 bg-card">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] mb-8 text-center text-muted-foreground">
            BEFORE → AFTER
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Before */}
            <div
              className="rounded-2xl p-8 aspect-[4/3] flex items-center justify-center"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded border-2" style={{ borderColor: '#3B3B38' }} />
                <p className="text-[13px] text-muted-foreground">
                  Before: Cluttered interface
                </p>
              </div>
            </div>

            {/* Divider with drag handle */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isDividerHovered ? '#8A9E7B' : '#FFFFFF',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={() => setIsDividerHovered(true)}
                onMouseLeave={() => setIsDividerHovered(false)}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 rounded-full" style={{ backgroundColor: isDividerHovered ? '#FFFFFF' : 'var(--muted-foreground)' }} />
                  <div className="w-0.5 h-4 rounded-full" style={{ backgroundColor: isDividerHovered ? '#FFFFFF' : 'var(--muted-foreground)' }} />
                </div>
              </motion.div>
            </div>

            {/* After */}
            <div
              className="rounded-2xl p-8 aspect-[4/3] flex items-center justify-center"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded border-2" style={{ borderColor: '#8A9E7B' }} />
                <p className="text-[13px] text-muted-foreground">
                  After: Streamlined design
                </p>
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
                5m
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                AVG TASK TIME
              </p>
            </div>
            <div>
              <div className="text-[72px] leading-[1] mb-4" style={{ color: '#8A9E7B' }}>
                84%
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                USER SATISFACTION
              </p>
            </div>
            <div>
              <div className="text-[72px] leading-[1] mb-4" style={{ color: '#8A9E7B' }}>
                3x
              </div>
              <p className="text-[11px] tracking-[0.1em] text-muted-foreground">
                FASTER ONBOARDING
              </p>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* SECTION 5B - Reflection */}
      <section className="w-full py-20">
        <RevealOnView className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-[11px] tracking-[0.1em] mb-6 text-muted-foreground uppercase">Reflection</p>
          <p className="text-[20px] md:text-[24px] leading-[1.5] text-foreground max-w-3xl">
            If I were starting this over, I'd bring engineering into the hierarchy decisions earlier —
            we validated the new layout with operators before checking it against real data-loading
            constraints, and had to revisit two screens after the fact. The bigger lesson was about scope:
            resisting the urge to fix every inconsistency in the old dashboard and instead prioritizing the
            handful of patterns that were actually costing operators time.
          </p>
        </RevealOnView>
      </section>

      {/* SECTION 6 - Navigation footer */}
      <section className="w-full py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Back to Work */}
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: -3 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Back to Work</span>
            </motion.button>

            {/* Next Case Study */}
            <motion.button
              onClick={() => navigate('/case-study/design-system')}
              className="flex items-center gap-2 text-[13px] font-medium group text-muted-foreground"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3 }}
            >
              <span className="group-hover:text-foreground transition-colors">Design System</span>
              <ArrowRight className="w-4 h-4 group-hover:text-foreground transition-colors" />
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
