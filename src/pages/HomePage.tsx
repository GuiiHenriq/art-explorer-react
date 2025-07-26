import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetAPI } from '../services/metAPI';
import type { Artwork } from '../types/artwork';

const ARTWORKS_LIMIT = 15;

export default function HomePage() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objectIDs, setObjectIDs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResponse = await MetAPI.searchArtworks();
        const ids = searchResponse.objectIDs || [];
        if (ids.length === 0) {
          setArtworks([]);
          setObjectIDs([]);
          setHasMore(false);
          return;
        }
        const limitedIDs = ids.slice(0, ARTWORKS_LIMIT);
        setObjectIDs(limitedIDs);
        const firstPageIDs = limitedIDs.slice(0, ARTWORKS_LIMIT);
        const artworkPromises = firstPageIDs.map((id) => MetAPI.getArtworkDetails(id));
        const artworkDetails = await Promise.all(artworkPromises);
        const validArtworks = artworkDetails.filter(Boolean);
        setArtworks(validArtworks);
        setCurrentPage(0);
        setHasMore(ARTWORKS_LIMIT < limitedIDs.length);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error loading artworks';
        setError(errorMessage);
        setArtworks([]);
        setObjectIDs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const start = nextPage * ARTWORKS_LIMIT;
      const end = start + ARTWORKS_LIMIT;
      const nextIDs = objectIDs.slice(start, end);
      if (nextIDs.length === 0) {
        setHasMore(false);
        return;
      }
      const artworkPromises = nextIDs.map((id) => MetAPI.getArtworkDetails(id));
      const artworkDetails = await Promise.all(artworkPromises);
      const validArtworks = artworkDetails.filter(Boolean);
      setArtworks((prev) => [...prev, ...validArtworks]);
      setCurrentPage(nextPage);
      setHasMore(end < objectIDs.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading artworks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkClick = (artwork: Artwork) => {
    navigate(`/artwork/${artwork.objectID}`);
  };

  const renderArtworkItem = (artwork: Artwork) => (
    <article
      key={artwork.objectID}
      className="mb-8 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleArtworkClick(artwork)}
    >
      <h2 className="text-xl font-semibold mb-2">{artwork.title || 'Title not specified'}</h2>
      <p className="text-gray-700 mb-1">
        <strong>Artist:</strong> {artwork.artistDisplayName || 'Artist not specified'}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Date:</strong> {artwork.objectDate || 'Date not specified'}
      </p>
      <p className="text-gray-700 mb-3">
        <strong>Department:</strong> {artwork.department || 'Not specified'}
      </p>
      {artwork.primaryImage && (
        <img
          src={artwork.primaryImage}
          alt={artwork.title || 'Artwork'}
          className="max-w-xs h-auto rounded shadow-sm"
          loading="lazy"
        />
      )}
    </article>
  );

  if (loading && artworks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div>Loading...</div>
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artworks</h1>
        <p className="text-gray-600 mt-2">
          Displaying {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
        </p>
      </header>

      <main>
        <div className="space-y-6">{artworks.map(renderArtworkItem)}</div>
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
