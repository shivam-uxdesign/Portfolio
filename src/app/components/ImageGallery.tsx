import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

// Static editorial layout — vary width/heightPct per image for the staggered
// rhythm, `meta` renders as a small rotated placard label beside the frame.
// Swap `src` for real photos whenever they're ready.
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop', title: 'Studio', tag: 'Process', meta: '2024', width: 210, heightPct: 100 },
  { src: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&h=500&fit=crop', title: 'Desk, most days', tag: 'Craft', meta: '2024', width: 320, heightPct: 78 },
  { src: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=800&fit=crop', title: 'Sketch', tag: 'Sketchbook', meta: '2023', width: 200, heightPct: 92 },
  { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=780&fit=crop', title: 'In progress', tag: 'Product', meta: '2024', width: 230, heightPct: 100 },
];

// Idle Ken Burns profiles — slow, subtle, slightly different per tile.
const kenBurnsProfiles = [
  { scale: 1.1, x: -8, y: 6, duration: 20 },
  { scale: 1.08, x: 8, y: -6, duration: 24 },
  { scale: 1.12, x: -6, y: -6, duration: 18 },
  { scale: 1.09, x: 6, y: 8, duration: 22 },
];

const STEP = 260; // px per arrow-click page

export function ImageGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  };

  const page = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  };

  return (
    <div className="relative h-full w-full group/gallery">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="h-full w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-end h-full gap-8 min-w-max">
          {galleryImages.map((image, idx) => {
            const isHovered = hoveredIndex === idx;
            const profile = kenBurnsProfiles[idx % kenBurnsProfiles.length];

            return (
              <div key={idx} className="flex items-stretch gap-2.5 h-full flex-shrink-0">
                <div className="flex flex-col h-full" style={{ width: image.width }}>
                  {/* Flexible zone — reserves space so the caption below is never squeezed out */}
                  <div className="flex-1 min-h-0 flex items-end">
                    <div
                      className="relative overflow-hidden rounded-lg cursor-pointer w-full"
                      style={{ height: `${image.heightPct}%` }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <motion.img
                        src={image.src}
                        alt={image.title}
                        className="h-full w-full object-cover"
                        animate={
                          isHovered
                            ? { scale: 1.15, x: 0, y: 0 }
                            : { scale: [1, profile.scale, 1], x: [0, profile.x, 0], y: [0, profile.y, 0] }
                        }
                        transition={
                          isHovered
                            ? { duration: 0.7, ease: 'easeOut' }
                            : { duration: profile.duration, repeat: Infinity, ease: 'easeInOut' }
                        }
                      />
                    </div>
                  </div>

                  {/* Caption row — fixed height, always visible */}
                  <div className="flex items-center justify-between gap-2 mt-3 flex-shrink-0 h-6">
                    <span className="text-[14px] font-medium text-foreground truncate">{image.title}</span>
                    <span className="text-[10px] tracking-[0.04em] px-2.5 py-1 rounded-full border border-border text-muted-foreground whitespace-nowrap">
                      {image.tag}
                    </span>
                  </div>
                </div>

                {/* Vertical placard label — aligned to the image's flexible zone, sitting just above the caption row */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 min-h-0 flex items-end justify-center">
                    <span
                      className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/70 whitespace-nowrap pb-2"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {image.meta}
                    </span>
                  </div>
                  <div className="h-6 flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow paging controls — replace raw scroll/drag as the way to move through the strip */}
      <button
        onClick={() => page(-1)}
        disabled={atStart}
        aria-label="Previous images"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-9 h-9 rounded-full border border-border bg-background shadow-sm flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 transition-opacity duration-200 hover:bg-card"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => page(1)}
        disabled={atEnd}
        aria-label="Next images"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-9 h-9 rounded-full border border-border bg-background shadow-sm flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 transition-opacity duration-200 hover:bg-card"
      >
        <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={1.5} />
      </button>
    </div>
  );
}
