import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ArtworkCard from '../components/ArtworkCard';
import type { Artwork } from '../types/artwork';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useStore();

  const handleArtworkSelect = (artwork: Artwork) => {
    navigate(`/artwork/${artwork.objectID}`);
  };

  const handleToggleFavorite = (artwork: Artwork) => {
    toggleFavorite(artwork);
  };

  const isFavorite = (artwork: Artwork) => {
    return favorites.some((fav: Artwork) => fav.objectID === artwork.objectID);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-full px-4 py-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="font-semibold text-red-700">
                {favorites.length === 0
                  ? 'No favorites yet'
                  : `${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`}
              </span>
            </div>
            {favorites.length > 0 && (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {favorites.length === 1 ? '1 artwork' : `${favorites.length} artworks`}
              </div>
            )}
          </div>
        </div>

        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-64 text-center">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Explore the gallery and add your favorite artworks by clicking on the heart.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Gallery
            </button>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((artwork) => (
              <ArtworkCard
                key={artwork.objectID}
                artwork={artwork}
                onSelect={handleArtworkSelect}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(artwork)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
