/**
 * useArtworks Hook Tests:
 * • Initial state validation (empty artworks, loading false, no errors)
 * • Search functionality with successful artwork loading
 * • Load more functionality to fetch additional artwork batches
 * • Error handling for failed API requests
 * • Rate limit warning display when API limits are reached
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useArtworks } from './useArtworks';
import { MetAPI } from '../services/metAPI';
import type { SearchResponse, Artwork } from '../types/artwork';

jest.mock('../services/metAPI');
const mockedMetAPI = MetAPI as jest.Mocked<typeof MetAPI>;

describe('useArtworks', () => {
  const mockArtwork: Artwork = {
    objectID: 1,
    title: 'Test Artwork',
    primaryImage: 'https://example.com/image.jpg',
    primaryImageSmall: 'https://example.com/image_small.jpg',
  };

  const mockSearchResponse: SearchResponse = {
    total: 20,
    objectIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useArtworks());

    expect(result.current.artworks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(false);
  });

  it('should search and load artworks successfully', async () => {
    mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
    mockedMetAPI.getArtworksBatch.mockResolvedValue({
      data: [mockArtwork],
      rateLimitInfo: { hasRateLimit: false, failedBatches: 0, totalBatches: 1 },
    });

    const { result } = renderHook(() => useArtworks());

    await act(async () => {
      result.current.search({ q: 'painting' });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.artworks).toEqual([mockArtwork]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should load more artworks when hasMore is true', async () => {
    const secondArtwork = { ...mockArtwork, objectID: 2 };

    mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
    mockedMetAPI.getArtworksBatch
      .mockResolvedValueOnce({
        data: [mockArtwork],
        rateLimitInfo: { hasRateLimit: false, failedBatches: 0, totalBatches: 1 },
      })
      .mockResolvedValueOnce({
        data: [secondArtwork],
        rateLimitInfo: { hasRateLimit: false, failedBatches: 0, totalBatches: 1 },
      });

    const { result } = renderHook(() => useArtworks());

    await act(async () => {
      result.current.search({ q: 'art' });
    });

    await waitFor(() => expect(result.current.hasMore).toBe(true));

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.artworks).toHaveLength(2);
    expect(result.current.artworks[1]).toEqual(secondArtwork);
  });

  it('should handle search errors', async () => {
    mockedMetAPI.searchArtworks.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useArtworks());

    await act(async () => {
      result.current.search({ q: 'test' });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to perform search.');
    expect(result.current.artworks).toEqual([]);
  });

  it('should display rate limit warning', async () => {
    mockedMetAPI.searchArtworks.mockResolvedValue(mockSearchResponse);
    mockedMetAPI.getArtworksBatch.mockResolvedValue({
      data: [mockArtwork],
      rateLimitInfo: {
        hasRateLimit: true,
        failedBatches: 1,
        totalBatches: 2,
        successfulArtworks: 1,
        requestedArtworks: 15,
      },
    });

    const { result } = renderHook(() => useArtworks());

    await act(async () => {
      result.current.search({ q: 'test' });
    });

    await waitFor(() => {
      expect(result.current.rateLimitWarning).toContain('Rate limit reached!');
    });
  });
});
