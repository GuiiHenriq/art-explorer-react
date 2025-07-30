import { useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Palette, Building2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useArtworkDetails } from '../hooks/useArtworkDetails';
import {
  ErrorDisplay,
  BackButton,
  ArtworkImage,
  InfoSection,
  AdditionalDetails,
} from '../components/artwork-details';
import type { Artwork } from '../types/artwork';

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

export default function ArtworkDetailsPage() {
  const { objectID } = useParams<{ objectID: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useStore();
  const { artwork, loading, error } = useArtworkDetails(objectID);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleToggleFavorite = useCallback(() => {
    if (artwork) {
      toggleFavorite(artwork);
    }
  }, [artwork, toggleFavorite]);

  const handleImageError = useCallback(() => {}, []);

  const isFavorite = useMemo(() => {
    return artwork ? favorites.some((fav: Artwork) => fav.objectID === artwork.objectID) : false;
  }, [artwork, favorites]);

  const mainInfoSections = useMemo(() => {
    if (!artwork) return [];

    return [
      {
        condition: artwork.artistDisplayName,
        icon: Palette,
        label: 'Artist',
        value: artwork.artistDisplayName!,
        description: artwork.artistDisplayBio,
        gradient: 'bg-gradient-to-br from-purple-500 to-blue-500',
        delay: 0.8,
      },
      {
        condition: artwork.objectDate,
        icon: Calendar,
        label: 'Date',
        value: artwork.objectDate!,
        gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
        delay: 1.0,
      },
      {
        condition: artwork.medium,
        icon: Palette,
        label: 'Medium',
        value: artwork.medium!,
        gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
        delay: 1.2,
      },
      {
        condition: artwork.department,
        icon: Building2,
        label: 'Department',
        value: artwork.department!,
        gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
        delay: 1.4,
      },
    ].filter((section) => section.condition);
  }, [artwork]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
        <div className="flex justify-center items-center min-h-96 pt-20">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-6 text-slate-600 font-serif text-lg">Loading artwork details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return <ErrorDisplay error={error || 'Artwork not found'} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BackButton onClick={handleBack} />

        <motion.div
          variants={ANIMATION_VARIANTS.fadeInDown}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light mb-6 leading-tight text-slate-800 tracking-wide max-w-4xl mx-auto">
            {artwork.title}
          </h1>
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-32" />
            <div className="w-3 h-3 bg-amber-500 rounded-full mx-4" />
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-32" />
          </div>
          {artwork.artistDisplayName && (
            <p className="text-xl font-serif italic text-slate-600 tracking-wide">
              by {artwork.artistDisplayName}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <ArtworkImage
              artwork={artwork}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onImageError={handleImageError}
            />
          </motion.div>

          <motion.div
            variants={ANIMATION_VARIANTS.fadeInRight}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
            className="xl:col-span-1 space-y-8"
          >
            <div className="bg-gradient-to-b from-slate-50 to-amber-50/50 border-2 border-slate-200 p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-16" />
                <h2 className="px-4 text-lg font-serif font-medium text-slate-700 tracking-wide">
                  Artwork Details
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-16" />
              </div>

              <div className="space-y-6">
                {mainInfoSections.map((section) => (
                  <InfoSection
                    key={section.label}
                    icon={section.icon}
                    label={section.label}
                    value={section.value}
                    description={section.description}
                    gradient={section.gradient}
                    delay={section.delay}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 2.0 }}
          className="mt-20"
        >
          <AdditionalDetails artwork={artwork} />
        </motion.div>
      </div>
    </div>
  );
}
