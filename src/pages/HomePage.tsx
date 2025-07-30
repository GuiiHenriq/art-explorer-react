import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import { useStore } from '../store/useStore';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import type { Artwork, SearchParams } from '../types/artwork';

export default function HomePage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useStore();
  const { artworks, loading, error, hasMore, search, loadMore, rateLimitWarning } = useArtworks();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      search({ hasImages: true, q: 'painting' });
    }
  }, [search]);

  const handleArtworkSelect = (artwork: Artwork) => {
    navigate(`/artwork/${artwork.objectID}`);
  };

  const handleToggleFavorite = (artwork: Artwork) => {
    toggleFavorite(artwork);
  };

  const isFavorite = (artwork: Artwork) => {
    return favorites.some((fav: Artwork) => fav.objectID === artwork.objectID);
  };

  const handleSearch = (searchParams: SearchParams) => {
    search(searchParams);
  };

  const handleClear = () => {
    search({ hasImages: true, q: 'painting' });
  };

  if (loading && artworks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
        <div className="flex justify-center items-center min-h-96 pt-20">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
        <div className="flex justify-center items-center min-h-96 pt-20">
          <div className="text-center max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-4 text-slate-800">
              Gallery Unavailable
            </h2>
            <p className="text-slate-600 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
        <div className="flex justify-center items-center min-h-96 pt-20">
          <div className="text-center max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-600 text-2xl">🎨</span>
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-4 text-slate-800">
              No Artworks Found
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The gallery appears to be empty at the moment. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
      <div className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-slate-800 tracking-wide">
            Art
            <span className="text-amber-700 font-medium"> Explorer</span>
          </h1>
        </div>
      </div>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <SearchBar onSearch={handleSearch} isLoading={loading} onClear={handleClear} />

          {rateLimitWarning && (
            <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-amber-100/50 border-l-4 border-amber-400 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-amber-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-amber-800 font-serif font-medium text-lg">Gallery Notice</h3>
                  <p className="mt-2 text-amber-700 leading-relaxed">{rateLimitWarning}</p>
                </div>
              </div>
            </div>
          )}

          {artworks.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-center mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-32" />
                <h2 className="px-6 text-2xl md:text-3xl font-serif font-light text-slate-700 tracking-wide">
                  Gallery Collection
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-32" />
              </div>
              <p className="text-center text-slate-600 font-light tracking-wide">
                {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} currently on
                display
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.objectID}
                artwork={artwork}
                onSelect={handleArtworkSelect}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(artwork)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                onClick={loadMore}
                className="group relative px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white font-serif text-lg tracking-wide border-2 border-slate-600 hover:border-amber-500 transition-all duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? 'Curating Collection...' : 'View More Artworks'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
