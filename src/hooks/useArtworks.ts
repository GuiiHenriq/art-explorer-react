import { useState, useCallback } from 'react';
import { MetAPI } from '../services/metAPI';
import type { Artwork, SearchParams } from '../types/artwork';

const BATCH_SIZE = 15;

interface UseArtworksReturn {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  search: (params: SearchParams) => void;
  loadMore: () => void;
}

export const useArtworks = (): UseArtworksReturn => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [objectIDs, setObjectIDs] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const fetchArtworksBatch = async (
    ids: number[],
    currentObjectIDs: number[],
    nextIndex: number,
  ) => {
    try {
      const detailedArtworks = await Promise.all(ids.map((id) => MetAPI.getArtworkDetails(id)));
      setArtworks((prev) => [...prev, ...detailedArtworks]);
      setHasMore(currentObjectIDs.length > nextIndex);
      setCurrentIndex(nextIndex);
    } catch {
      setError('Failed to fetch artwork details.');
    } finally {
      setLoading(false);
    }
  };

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setArtworks([]);
    setCurrentIndex(0);
    setHasMore(false);

    try {
      const response = await MetAPI.searchArtworks(params);
      if (response.objectIDs && response.objectIDs.length > 0) {
        setObjectIDs(response.objectIDs);
        const firstBatch = response.objectIDs.slice(0, BATCH_SIZE);
        await fetchArtworksBatch(firstBatch, response.objectIDs, BATCH_SIZE);
      } else {
        setObjectIDs([]);
        setLoading(false);
      }
    } catch {
      setError('Failed to perform search.');
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || objectIDs.length === 0) return;

    setLoading(true);
    const nextBatch = objectIDs.slice(currentIndex, currentIndex + BATCH_SIZE);
    if (nextBatch.length > 0) {
      fetchArtworksBatch(nextBatch, objectIDs, currentIndex + BATCH_SIZE);
    } else {
      setLoading(false);
    }
  }, [hasMore, loading, objectIDs, currentIndex]);

  return { artworks, loading, error, hasMore, search, loadMore };
};
