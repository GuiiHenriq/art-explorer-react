import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: string;
  onBack: () => void;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export const ErrorDisplay = ({ error, onBack }: ErrorDisplayProps) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30 flex justify-center items-center">
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
      className="text-center max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl"
    >
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center border-2 border-red-300/50">
        <span className="text-red-600 text-3xl">⚠</span>
      </div>
      <h2 className="text-3xl font-serif font-semibold mb-4 text-slate-800">Artwork Unavailable</h2>
      <p className="text-slate-600 leading-relaxed mb-8 font-light">{error}</p>
      <button
        onClick={onBack}
        className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white border-2 border-slate-600 hover:border-amber-500 transition-all duration-500 font-serif tracking-wide shadow-lg"
      >
        Back
      </button>
    </motion.div>
  </div>
);
