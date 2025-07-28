import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: string;
  onBack: () => void;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
} as const;

export const ErrorDisplay = ({ error, onBack }: ErrorDisplayProps) => (
  <div className="flex justify-center items-center min-h-64">
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Error</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Back
      </button>
    </motion.div>
  </div>
); 