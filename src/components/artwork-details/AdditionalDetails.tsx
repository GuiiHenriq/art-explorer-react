import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Artwork } from '../../types/artwork';

interface AdditionalDetailsProps {
  artwork: Artwork;
}

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
} as const;

export const AdditionalDetails = ({ artwork }: AdditionalDetailsProps) => {
  const details = useMemo(() => [
    { label: 'Culture', value: artwork.culture },
    { label: 'Period', value: artwork.period },
    { label: 'Classification', value: artwork.classification },
    { label: 'Credit', value: artwork.creditLine }
  ].filter(detail => detail.value), [artwork]);

  if (details.length === 0) return null;

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 1.8 }}
      className="pt-6 border-t border-gray-200 space-y-4"
    >
      {details.map(({ label, value }) => (
        <div key={label} className="space-y-1">
          <p className="text-gray-500 text-sm uppercase tracking-wider">{label}</p>
          <p className="text-lg text-gray-900">{value}</p>
        </div>
      ))}
    </motion.div>
  );
}; 