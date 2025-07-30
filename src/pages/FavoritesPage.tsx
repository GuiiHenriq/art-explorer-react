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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
      <div className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-slate-800 mb-4 tracking-wide">
            Art
            <span className="text-amber-700 font-medium"> Explorer</span>
          </h1>
        </div>
      </div>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {favorites.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-center mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-32" />
                <h2 className="px-6 text-2xl md:text-3xl font-serif font-light text-slate-700 tracking-wide">
                  Favorite Collection
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-32" />
              </div>
              <p className="text-center text-slate-600 font-light tracking-wide">
                {favorites.length} {favorites.length === 1 ? 'artwork' : 'artworks'} in your
                personal collection
              </p>
            </div>
          )}

          {favorites.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-amber-100 flex items-center justify-center mb-8 border-2 border-slate-300">
                <Heart className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-3xl font-serif font-light text-slate-700 mb-4 tracking-wide">
                No Favorites :(
              </h2>
              <p className="text-slate-600 font-light mb-8 max-w-md leading-relaxed">
                Explore the gallery and add your favorite artworks by clicking on the heart.
              </p>
              <button
                onClick={() => navigate('/')}
                className="cursor-pointer px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white border-2 border-slate-600 hover:border-amber-500 transition-all duration-500 font-serif tracking-wide shadow-lg"
              >
                Explore the Gallery
              </button>
            </div>
          )}

          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
        </div>
      </main>
    </div>
  );
}
