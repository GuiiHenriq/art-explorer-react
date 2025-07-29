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
  const { artworks, loading, error, hasMore, search, loadMore } = useArtworks();
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
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-600 text-center">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-600 text-center">
          <h2 className="text-lg font-semibold mb-2">No artworks found</h2>
          <p>It was not possible to load the artworks at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <SearchBar onSearch={handleSearch} isLoading={loading} onClear={handleClear} />

        {artworks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Search results ({artworks.length}{' '}
              {artworks.length === 1 ? 'artwork found' : 'artworks found'})
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
