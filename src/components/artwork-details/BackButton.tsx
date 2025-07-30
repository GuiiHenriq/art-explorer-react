import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const ANIMATION_VARIANTS = {
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export const BackButton = ({ onClick }: BackButtonProps) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInDown}
    initial="initial"
    animate="animate"
    className="mb-8 lg:mb-12"
  >
    <button
      onClick={onClick}
      className="group cursor-pointer flex items-center gap-3 text-slate-600 hover:text-amber-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-none px-4 py-3 hover:bg-slate-50 border-l-4 border-transparent hover:border-amber-500"
      aria-label="Back"
    >
      <ArrowLeft
        size={20}
        className="group-hover:-translate-x-1 transition-transform duration-300"
      />
      <span className="font-serif font-medium tracking-wide">Back</span>
    </button>
  </motion.div>
);
