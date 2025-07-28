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
    animate: { opacity: 1, x: 0 }
  }
} as const;

export const ArtworkImage = ({ 
  artwork, 
  isFavorite, 
  onToggleFavorite, 
  onImageError 
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
      className="relative"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
        {imageError ? (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={artwork.primaryImage || artwork.primaryImageSmall}
            alt={artwork.title || 'Artwork'}
            className="w-full h-auto object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleFavorite}
        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isFavorite 
            ? 'bg-red-500 text-white focus:ring-red-500' 
            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white focus:ring-gray-500'
        }`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
      </motion.button>
    </motion.div>
  );
}; 