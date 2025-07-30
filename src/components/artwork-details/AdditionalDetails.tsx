import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Artwork } from '../../types/artwork';

interface AdditionalDetailsProps {
  artwork: Artwork;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export const AdditionalDetails = ({ artwork }: AdditionalDetailsProps) => {
  const details = useMemo(
    () =>
      [
        { label: 'Cultural Origin', value: artwork.culture },
        { label: 'Historical Period', value: artwork.period },
        { label: 'Classification', value: artwork.classification },
        { label: 'Museum Credit', value: artwork.creditLine },
      ].filter((detail) => detail.value),
    [artwork],
  );

  const handleExternalLink = () => {
    if (artwork.objectURL) {
      window.open(artwork.objectURL, '_blank', 'noopener,noreferrer');
    }
  };

  if (details.length === 0 && !artwork.objectURL) return null;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-amber-50/50 border-2 border-slate-200 p-10 shadow-lg">
      <motion.div
        variants={ANIMATION_VARIANTS.fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-32" />
          <div className="w-3 h-3 bg-amber-500 rounded-full mx-4" />
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-32" />
        </div>
        <h3 className="text-2xl font-serif font-light text-slate-800 tracking-wide">
          Classification
        </h3>
        <p className="text-slate-600 font-light mt-2 tracking-wide">
          Additional information about this artwork
        </p>
      </motion.div>

      {details.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
          {details.map(({ label, value }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white/60 border border-slate-200 p-6 h-full hover:shadow-lg hover:border-amber-300 transition-all duration-300">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 group-hover:via-amber-500 transition-colors duration-300" />
                <p className="text-slate-500 text-sm font-serif uppercase tracking-[0.15em] mb-3">
                  {label}
                </p>
                <p className="text-base font-light text-slate-800 leading-relaxed">{value}</p>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 group-hover:via-amber-500 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {artwork.objectURL && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExternalLink}
            className="group inline-flex items-center justify-center gap-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 border-2 border-slate-600 hover:border-amber-500 font-serif font-medium tracking-wide transition-all duration-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <ExternalLink
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>View in Museum</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
