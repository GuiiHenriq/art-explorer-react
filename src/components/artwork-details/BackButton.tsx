import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const ANIMATION_VARIANTS = {
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  }
} as const;

export const BackButton = ({ onClick }: BackButtonProps) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInDown}
    initial="initial"
    animate="animate"
    className="mb-8"
  >
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
      aria-label="Go back to the previous page"
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  </motion.div>
); 