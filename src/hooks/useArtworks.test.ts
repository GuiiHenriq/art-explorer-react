import { renderHook, act, waitFor } from '@testing-library/react';
import { useArtworks } from './useArtworks';
import { MetAPI } from '../services/metAPI';
import type { SearchResponse, BatchResponse, Artwork } from '../types/artwork';

jest.mock('../services/metAPI');
const mockedMetAPI = MetAPI as jest.Mocked<typeof MetAPI>;

describe('useArtworks', () => {
  const mockArtworks: Artwork[] = [
    {
      objectID: 1,
      title: 'Test Artwork',
      primaryImage: 'https://example.com/image.jpg',
      primaryImageSmall: 'https://example.com/image_small.jpg',
    },
  ];

  const mockSearchResponse: SearchResponse = {
    total: 20,
    objectIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  };

  const mockBatchResponse: BatchResponse = {
    data: mockArtworks,
    rateLimitInfo: { hasRateLimit: false, failedBatches: 0, totalBatches: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useArtworks());

      expect(result.current.artworks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.rateLimitWarning).toBe(null);
    });
  });

  describe('Search functionality', () => {
    it('should search and load artworks successfully', async () => {
      mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
      mockedMetAPI.getArtworksBatch.mockResolvedValue(mockBatchResponse);

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockedMetAPI.searchArtworks).toHaveBeenCalledWith({ q: 'test' });
      expect(result.current.artworks).toEqual(mockArtworks);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should handle empty search results', async () => {
      mockedMetAPI.searchArtworks.mockResolvedValue({ total: 0, objectIDs: [] });

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'empty' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.artworks).toEqual([]);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle search errors', async () => {
      mockedMetAPI.searchArtworks.mockRejectedValue(new Error('Search failed'));

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to perform search.');
      expect(result.current.artworks).toEqual([]);
    });
  });

  describe('Load more functionality', () => {
    it('should load more artworks when available', async () => {
      mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
      mockedMetAPI.getArtworksBatch.mockResolvedValue(mockBatchResponse);

      const { result } = renderHook(() => useArtworks());

      // Initial search
      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.hasMore).toBe(true);
      });

      // Mock second batch
      const secondBatch = { ...mockBatchResponse, data: [{ ...mockArtworks[0], objectID: 16 }] };
      mockedMetAPI.getArtworksBatch.mockResolvedValue(secondBatch);

      // Load more
      await act(async () => {
        result.current.loadMore();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.artworks).toHaveLength(2);
      expect(mockedMetAPI.getArtworksBatch).toHaveBeenCalledTimes(2);
    });

    it('should not load more when hasMore is false', async () => {
      const limitedResponse: SearchResponse = { total: 1, objectIDs: [1] };
      mockedMetAPI.searchArtworks.mockResolvedValue(limitedResponse);
      mockedMetAPI.getArtworksBatch.mockResolvedValue(mockBatchResponse);

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.hasMore).toBe(false);
      });

      const callCount = mockedMetAPI.getArtworksBatch.mock.calls.length;

      await act(async () => {
        result.current.loadMore();
      });

      expect(mockedMetAPI.getArtworksBatch).toHaveBeenCalledTimes(callCount);
    });
  });

  describe('Rate limit handling', () => {
    it('should show rate limit warning when limit is reached', async () => {
      const rateLimitResponse: BatchResponse = {
        data: mockArtworks,
        rateLimitInfo: {
          hasRateLimit: true,
          failedBatches: 1,
          totalBatches: 2,
          successfulArtworks: 1,
          requestedArtworks: 15,
        },
      };

      mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
      mockedMetAPI.getArtworksBatch.mockResolvedValue(rateLimitResponse);

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.rateLimitWarning).toContain('Rate limit reached!');
      });
    });

    it('should clear rate limit warning when resolved', async () => {
      // First with rate limit
      const rateLimitResponse: BatchResponse = {
        data: mockArtworks,
        rateLimitInfo: {
          hasRateLimit: true,
          failedBatches: 1,
          totalBatches: 2,
          successfulArtworks: 1,
          requestedArtworks: 15,
        },
      };

      mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
      mockedMetAPI.getArtworksBatch.mockResolvedValue(rateLimitResponse);

      const { result } = renderHook(() => useArtworks());

      await act(async () => {
        result.current.search({ q: 'test' });
      });

      await waitFor(() => {
        expect(result.current.rateLimitWarning).toBeTruthy();
      });

      // Then without rate limit
      mockedMetAPI.getArtworksBatch.mockResolvedValue(mockBatchResponse);

      await act(async () => {
        result.current.loadMore();
      });

      await waitFor(() => {
        expect(result.current.rateLimitWarning).toBe(null);
      });
    });
  });
});
