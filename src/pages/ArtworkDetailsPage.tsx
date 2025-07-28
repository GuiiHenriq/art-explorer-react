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
  ExternalLinkButton,
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
        label: 'Technique',
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
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !artwork) {
    return <ErrorDisplay error={error || 'Artwork not found'} onBack={handleBack} />;
  }

  return (
    <div className="w-full">
      <BackButton onClick={handleBack} />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <motion.div
          variants={ANIMATION_VARIANTS.fadeInLeft}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="sticky top-8"
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
          transition={{ delay: 0.4 }}
          className="space-y-8 lg:pl-4"
        >
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {artwork.title}
            </h1>
          </motion.div>

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

          {artwork.objectURL && <ExternalLinkButton url={artwork.objectURL} delay={1.6} />}

          <AdditionalDetails artwork={artwork} />
        </motion.div>
      </div>
    </div>
  );
}
