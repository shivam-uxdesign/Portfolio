import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export function AboutBlock() {
  return (
    <div className="relative bg-background rounded-2xl p-4 h-full border border-border flex items-center overflow-hidden">
      {/* Watermark quotation icon */}
      <Quote className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 text-foreground/5 rotate-180" strokeWidth={1.5} />

      <div className="relative z-10 space-y-0.5 w-full">
        <motion.p
          className="text-lg md:text-xl leading-tight font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Designer by <span className="font-semibold relative inline-block">
            <span className="relative z-10">training</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary"></span>
          </span>
        </motion.p>
        <motion.p
          className="text-lg md:text-xl leading-tight font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >Problem solver by <span className="font-semibold relative inline-block"><span className="relative z-10">instinct</span><span className="absolute bottom-0 left-0 w-full h-1 bg-accent-blue"></span></span></motion.p>
        <motion.p
          className="text-lg md:text-xl leading-tight font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >Cat lover by <span className="font-semibold relative inline-block"><span className="relative z-10">default</span><span className="absolute bottom-0 left-0 w-full h-1 bg-accent-tan"></span></span>.</motion.p>
      </div>
    </div>
  );
}