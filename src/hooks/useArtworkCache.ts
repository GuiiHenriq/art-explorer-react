import { useState, useEffect, useCallback } from 'react';
import { MetAPI } from '../services/metAPI';
import type { Artwork, SearchParams } from '../types/artwork';

interface UseArtworkCacheReturn {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentBatch: number;
  totalResults: number;
  objectIDs: number[];
  search: (params: SearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  clearCache: () => Promise<void>;
  cacheStats: { totalCached: number; cacheSize: number } | null;
}

const BATCH_SIZE = 45;

export const useArtworkCache = (): UseArtworkCacheReturn => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [objectIDs, setObjectIDs] = useState<number[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [cacheStats, setCacheStats] = useState<{ totalCached: number; cacheSize: number } | null>(null);

  const fetchCacheStats = useCallback(async () => {
    try {
      const stats = await MetAPI.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  }, []);

  const fetchCachedArtworks = useCallback(async (ids: number[]): Promise<Artwork[]> => {
    if (ids.length === 0) return [];
    
    try {
      const cachedArtworks = await MetAPI.getCachedArtworks(ids);
      return cachedArtworks;
    } catch (error) {
      console.error('Error fetching cached artworks:', error);
      return [];
    }
  }, []);

  const preloadNextBatch = useCallback(async (): Promise<void> => {
    if (objectIDs.length === 0) return;

    const nextBatchStart = (currentBatch + 1) * BATCH_SIZE;
    if (nextBatchStart >= objectIDs.length) return;

    try {
      await MetAPI.preloadBatch(objectIDs, currentBatch);
      console.log(`Batch ${currentBatch + 1} preloaded`);
    } catch (error) {
      console.error('Error preloading next batch:', error);
    }
  }, [objectIDs, currentBatch]);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setCurrentBatch(0);
    setArtworks([]);
    setHasMore(true);

    try {
      const searchResult = await MetAPI.searchArtworksWithCache(params);
      setObjectIDs(searchResult.objectIDs || []);
      setTotalResults(searchResult.total || 0);

      const firstBatchIds = searchResult.objectIDs?.slice(0, BATCH_SIZE) || [];
      const firstBatchArtworks = await fetchCachedArtworks(firstBatchIds);
      
      setArtworks(firstBatchArtworks);
      setHasMore((searchResult.objectIDs?.length || 0) > BATCH_SIZE);
      
      setHasMore((searchResult.objectIDs?.length || 0) > BATCH_SIZE);
      
      await fetchCacheStats();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetchCachedArtworks, fetchCacheStats]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextBatch = currentBatch + 1;
      const startIndex = nextBatch * BATCH_SIZE;
      const endIndex = startIndex + BATCH_SIZE;
      const batchIds = objectIDs.slice(startIndex, endIndex);

      if (batchIds.length === 0) {
        setHasMore(false);
        return;
      }

      const batchArtworks = await fetchCachedArtworks(batchIds);
      
      if (batchArtworks.length < batchIds.length) {
        await preloadNextBatch();
        const retryArtworks = await fetchCachedArtworks(batchIds);
        setArtworks(prev => [...prev, ...retryArtworks]);
      } else {
        setArtworks(prev => [...prev, ...batchArtworks]);
      }

      setCurrentBatch(nextBatch);
      setHasMore(endIndex < objectIDs.length);

      if (endIndex < objectIDs.length) {
        setTimeout(() => {
          MetAPI.preloadBatch(objectIDs, nextBatch + 1).catch(console.error);
        }, 1000);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading more artworks');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentBatch, objectIDs, fetchCachedArtworks, preloadNextBatch]);

  const clearCache = useCallback(async () => {
    try {
      await MetAPI.clearCache();
      setArtworks([]);
      setCurrentBatch(0);
      setObjectIDs([]);
      setTotalResults(0);
      setHasMore(true);
      await fetchCacheStats();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error clearing cache');
    }
  }, [fetchCacheStats]);

  useEffect(() => {
    fetchCacheStats();
  }, [fetchCacheStats]);

  return {
    artworks,
    loading,
    error,
    hasMore,
    currentBatch,
    totalResults,
    objectIDs,
    search,
    loadMore,
    clearCache,
    cacheStats,
  };
}; 