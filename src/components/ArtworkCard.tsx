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
  const artistName = artwork.artistDisplayName || 'Unknown artist';
  const objectDate = artwork.objectDate || 'Unknown date';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={imageSrc}
          alt={artwork.title}
          className="w-full h-48 object-cover"
          onClick={handleImageClick}
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="p-4" onClick={handleImageClick}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{artwork.title}</h3>
        <p className="text-gray-600 mb-1">{artistName}</p>
        <p className="text-gray-500 text-sm">{objectDate}</p>
      </div>
    </div>
  );
}
