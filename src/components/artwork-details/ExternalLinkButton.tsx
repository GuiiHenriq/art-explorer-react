import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ExternalLinkButtonProps {
  url: string;
  delay: number;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
} as const;

export const ExternalLinkButton = ({ url, delay }: ExternalLinkButtonProps) => {
  const handleExternalLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className="pt-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExternalLink}
        className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ExternalLink size={20} />
        <span>View more</span>
      </motion.button>
    </motion.div>
  );
}; 