import { motion } from 'motion/react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const VIEWPORT_MARGIN = 100;

interface RevealOnViewProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fades content in as it scrolls into view, like Framer Motion's
 * `whileInView`, but also checks visibility synchronously before first
 * paint so content already on screen at mount renders at full opacity
 * immediately instead of waiting for a scroll event.
 *
 * Framer's `initial` prop only applies at the moment a component first
 * mounts and is ignored on later re-renders, so the mount-time visibility
 * check below is applied through `animate` (which stays reactive) rather
 * than by trying to change `initial` after the fact.
 */
export function RevealOnView({ children, className }: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleAtMount, setVisibleAtMount] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const inView = rect.top < viewportHeight - VIEWPORT_MARGIN && rect.bottom > VIEWPORT_MARGIN;
    if (inView) setVisibleAtMount(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={visibleAtMount ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: `-${VIEWPORT_MARGIN}px` }}
      transition={visibleAtMount ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
