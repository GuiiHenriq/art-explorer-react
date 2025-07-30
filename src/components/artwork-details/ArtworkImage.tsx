import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Image as ImageIcon } from 'lucide-react';
import type { Artwork } from '../../types/artwork';

interface ArtworkImageProps {
  artwork: Artwork;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onImageError: () => void;
}

const ANIMATION_VARIANTS = {
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
} as const;

export const ArtworkImage = ({
  artwork,
  isFavorite,
  onToggleFavorite,
  onImageError,
}: ArtworkImageProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
    onImageError();
  }, [onImageError]);

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInLeft}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.2 }}
      className="relative w-full"
    >
      <div className="relative bg-gradient-to-br from-slate-100 to-amber-50 p-6 border-4 border-slate-300 shadow-2xl">
        <div className="relative border-2 border-amber-200/70 overflow-hidden">
          <div className="absolute inset-0 border-8 border-amber-100/30 pointer-events-none z-10" />

          {imageError ? (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center text-slate-600">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-300 rounded-full flex items-center justify-center">
                  <ImageIcon size={32} className="text-slate-500" />
                </div>
                <p className="text-lg font-serif">Artwork Unavailable</p>
                <p className="text-sm text-slate-500 mt-1">Image could not be displayed</p>
              </div>
            </div>
          ) : (
            <img
              src={artwork.primaryImage || artwork.primaryImageSmall}
              alt={artwork.title || 'Artwork'}
              className="w-full h-auto object-cover aspect-[4/3] filter sepia-[0.05] transition-all duration-700 hover:sepia-0"
              onError={handleImageError}
              loading="lazy"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-4">
            <div className="text-white">
              <p className="text-xs font-light tracking-widest uppercase opacity-80">
                {artwork.department || 'Museum Collection'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleFavorite}
        className={`absolute top-8 right-8 p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm border-2 ${
          isFavorite
            ? 'bg-amber-600/90 text-slate-100 border-amber-500 shadow-lg focus:ring-amber-400'
            : 'bg-slate-100/90 text-slate-600 border-slate-300 hover:bg-amber-600/90 hover:text-slate-100 hover:border-amber-500 focus:ring-slate-400'
        }`}
        aria-label={isFavorite ? 'Remove from collection' : 'Add to collection'}
      >
        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} className="drop-shadow-sm" />
      </motion.button>
    </motion.div>
  );
};
