import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ExternalLinkButtonProps {
  url: string;
  delay: number;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export const ExternalLinkButton = ({ url, delay }: ExternalLinkButtonProps) => {
  const handleExternalLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExternalLink}
      className="w-full group flex items-center justify-center gap-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 border-2 border-slate-600 hover:border-amber-500 font-serif font-medium tracking-wide transition-all duration-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
    >
      <ExternalLink size={20} className="group-hover:rotate-12 transition-transform duration-300" />
      <span>View in Museum</span>
    </motion.button>
  );
};
