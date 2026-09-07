import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

type Category = 'All' | 'Digital' | 'Physical' | 'Experiment';

interface Project {
  id: number;
  name: string;
  description: string;
  category: Category;
  tag: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: 'Custom Sketchbook Collection',
    description: 'Hand-bound sketchbooks with mixed media paper, leather covers, and brass clasps',
    category: 'Physical',
    tag: 'PHYSICAL',
  },
  {
    id: 2,
    name: 'Modular Ring Box Organizer',
    description: 'Wooden jewelry organizer with customizable compartments and velvet lining',
    category: 'Physical',
    tag: 'PHYSICAL',
  },
  {
    id: 3,
    name: 'Artist Color Palette System',
    description: 'Magnetic palette holder with custom-mixed watercolor wells and travel case',
    category: 'Physical',
    tag: 'PHYSICAL',
  },
  {
    id: 4,
    name: 'Portfolio Component Library',
    description: 'Reusable React components built with Tailwind and Motion for rapid prototyping',
    category: 'Digital',
    tag: 'DIGITAL',
  },
  {
    id: 5,
    name: 'Generative Art Engine',
    description: 'Algorithmic art generator using Canvas API and procedural noise functions',
    category: 'Experiment',
    tag: 'EXPERIMENT',
  },
];

export function CoolStuffPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Digital', 'Physical', 'Experiment'];

  const filteredProjects = projects.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

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
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            <h1
              className="text-[56px] md:text-[72px] leading-[1.05] relative inline-block text-foreground"
              style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Cool Stuff I've Built
            </h1>
            {/* Blinking terminal cursor */}
            <motion.span
              className="inline-block text-[56px] md:text-[72px] leading-[1.05]"
              style={{
                color: '#1A1A1A',
                fontFamily: 'monospace',
                fontWeight: 800,
              }}
              animate={{
                opacity: [1, 1, 0, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                times: [0, 0.5, 0.5, 1],
                ease: 'linear',
              }}
            >
              _
            </motion.span>
          </motion.div>
          <p className="text-[18px] leading-[1.6] max-w-2xl text-muted-foreground">
            Digital experiments, physical products, and things I've made with my hands
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - Filter chips */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                className="px-4 py-2 rounded-full text-[12px] font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedCategory === category ? '#1A1A1A' : 'rgba(26, 26, 26, 0.06)',
                  color: selectedCategory === category ? '#FFFFFF' : '#6B6860',
                  border:
                    selectedCategory === category ? '1px solid #1A1A1A' : '1px solid transparent',
                }}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Project cards */}
      <section className="w-full px-8 md:px-16 lg:px-24 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              className="rounded-3xl overflow-hidden relative"
              style={{
                backgroundColor: '#1A1A1A',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side - Preview area */}
                <div
                  className="w-full md:w-2/5 relative"
                  style={{
                    backgroundColor: '#0D0D0D',
                    minHeight: '280px',
                  }}
                >
                  {/* Line numbers accent */}
                  <div
                    className="absolute left-4 top-6 flex flex-col gap-3 text-[11px] font-mono"
                    style={{ color: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <span>01</span>
                    <span>02</span>
                    <span>03</span>
                    <span>04</span>
                    <span>05</span>
                    <span>06</span>
                  </div>

                  {/* Preview placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[13px] tracking-wide font-mono"
                      style={{ color: 'rgba(255, 255, 255, 0.15)' }}
                    >
                      {'<preview />'}
                    </div>
                  </div>
                </div>

                {/* Right side - Details */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
                  {/* Terminal prompt accent */}
                  <div
                    className="absolute left-8 top-8 text-[14px] font-mono"
                    style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    &gt;
                  </div>

                  <div className="pl-6">
                    {/* Tag chip */}
                    <div className="mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.08em]"
                        style={{
                          backgroundColor: 'rgba(255, 215, 0, 0.15)',
                          color: '#FFD700',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        {project.tag}
                      </span>
                    </div>

                    {/* Project name */}
                    <h3
                      className="text-[28px] font-semibold mb-3 leading-tight"
                      style={{
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-[15px] leading-[1.6] mb-6"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    >
                      {project.description}
                    </p>

                    {/* View project link */}
                    <motion.a
                      href={project.link || '#'}
                      className="inline-flex items-center gap-2 text-[13px] font-medium group"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="group-hover:text-white transition-colors">
                        View project
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 group-hover:text-white transition-colors"
                        strokeWidth={2}
                      />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
