import { Heart } from 'lucide-react';
import type { Artwork } from '../types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  onToggleFavorite: (artwork: Artwork) => void;
  isFavorite: boolean;
}

export default function ArtworkCard({
  artwork,
  onSelect,
  onToggleFavorite,
  isFavorite,
}: ArtworkCardProps) {
  const handleImageClick = () => {
    onSelect(artwork);
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleFavorite(artwork);
  };

  const imageSrc = artwork.primaryImageSmall || artwork.primaryImage;
  const artistName = artwork.artistDisplayName || 'Artist Unknown';
  const objectDate = artwork.objectDate || 'Date Unknown';

  return (
    <div className="group bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-200 hover:border-amber-300 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 border-4 border-amber-200/50 group-hover:border-amber-300/70 transition-colors duration-500 z-10 pointer-events-none" />

        <img
          src={imageSrc}
          alt={artwork.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.1] group-hover:sepia-0"
          onClick={handleImageClick}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10 pointer-events-none" />

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm border ${
            isFavorite
              ? 'bg-amber-600/90 text-slate-100 border-amber-500 shadow-lg'
              : 'bg-slate-100/80 text-slate-600 border-slate-300 hover:bg-amber-600/90 hover:text-slate-100 hover:border-amber-500'
          }`}
          aria-label={isFavorite ? 'Remove from collection' : 'Add to collection'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100" onClick={handleImageClick}>
        <h3 className="font-serif font-semibold text-xl mb-3 text-slate-800 line-clamp-2 leading-tight group-hover:text-amber-800 transition-colors duration-300">
          {artwork.title}
        </h3>

        <div className="flex flex-col space-y-2">
          <p className="text-slate-600 font-medium text-base italic tracking-wide">{artistName}</p>

          <p className="text-slate-500 text-sm font-light tracking-wider uppercase">{objectDate}</p>
        </div>

        <div className="mt-4 w-16 h-px bg-gradient-to-r from-amber-400 to-transparent group-hover:w-24 transition-all duration-500" />
      </div>
    </div>
  );
}
