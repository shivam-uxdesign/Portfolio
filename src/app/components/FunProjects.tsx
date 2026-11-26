import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

const funProjects = [
  {
    // The highlight: first in the list, so it is the featured card. A finished case
    // study; its page is public/case-studies/keppo-moto/, shown inside the portfolio.
    title: 'Keppo Moto',
    description: 'In beta with 4 riders: a motorcycle app that keeps every ride.',
    tag: 'Case study · Built with AI',
    color: '#0A0A0B',
    image: '/share/keppo-moto-card.webp',
    link: '/case-study/keppo-moto',
    cta: 'Read case study',
  },
  {
    title: 'Whatiswrongwith.in',
    description: 'Type anything. It tells you what’s wrong with it.',
    tag: 'Fun project · Built with AI',
    color: '#DDE8F5',
    image: '/case-studies/thumbs/whatiswrongwith-640.webp',
    link: '/play/whatiswrongwithin',
  },
  {
    // Keppo Moto's sibling; its page is public/case-studies/keppo-journal/, shown inside the portfolio.
    title: 'Keppo Journal',
    description: 'A journal that opens on the camera: catch the moment, write later.',
    tag: 'Case study · Built with AI',
    color: '#F7F7F5',
    image: '/share/keppo-journal-card.webp',
    link: '/case-study/keppo-journal',
    cta: 'Read case study',
  },
];

export const FUN_PROJECTS = funProjects;

export function FunProjects() {
  const navigate = useNavigate();

  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden px-4 pt-3 pb-3 h-full flex flex-col">
      <div className="mb-2.5">
        <h3 className="text-[15px] font-medium text-foreground mb-0.5">Fun & Exploration</h3>
        <p className="text-xs text-muted-foreground">Side projects that spark joy</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-h-0">
        {funProjects.map((project, idx) => (
          <motion.div
            key={idx}
            className="relative rounded-xl overflow-hidden h-full group cursor-pointer border border-border/60"
            style={{ backgroundColor: project.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => project.link && navigate(project.link)}
          >
            {/* Full-bleed image */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Scrim */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)' }}
            />

            {/* Tag chip — top left */}
            <div className="absolute top-2.5 left-2.5 rounded-md bg-white/20 backdrop-blur-sm px-2 py-1 inline-flex items-center">
              <span className="text-[9px] font-medium uppercase tracking-wide text-white">{project.tag}</span>
            </div>

            {/* Hover arrow — top right */}
            <motion.div
              className="absolute top-2.5 right-2.5"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-white/80" strokeWidth={2} />
            </motion.div>

            {/* Title + description — bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <h4 className="text-[13px] font-semibold leading-tight text-white mb-0.5">{project.title}</h4>
              <p className="text-[11px] leading-snug text-white/70 line-clamp-2">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
