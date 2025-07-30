/*
 * MetAPI Service Tests:
 * • Search for artworks with and without parameters
 * • Batch search with rate limiting
 * • Individual artwork details
 * • Search by artist with encoding
 * • Network and HTTP error handling
 */

const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    interceptors: { response: { use: jest.fn() } },
  })),
}));

import { MetAPI } from './metAPI';
import type { SearchResponse, Artwork } from '../types/artwork';

describe('MetAPI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search artworks with correct parameters', async () => {
    const mockResponse: SearchResponse = { total: 10, objectIDs: [1, 2, 3] };
    mockGet.mockResolvedValue({ data: mockResponse });

    const result = await MetAPI.searchArtworks({ q: 'Monet' });

    expect(mockGet).toHaveBeenCalledWith('/artworks/search', { params: { q: 'Monet' } });
    expect(result).toEqual(mockResponse);
  });

  it('should fetch artworks batch and handle rate limiting', async () => {
    const mockBatch = {
      data: {
        data: [{ objectID: 1, title: 'Art 1' }],
        rateLimitInfo: { hasRateLimit: true },
      },
    };
    mockPost.mockResolvedValue(mockBatch);

    const result = await MetAPI.getArtworksBatch([1, 2]);

    expect(mockPost).toHaveBeenCalledWith('/artworks/batch', { objectIDs: [1, 2] });
    expect(result.rateLimitInfo?.hasRateLimit).toBe(true);
  });

  it('should get artwork details by ID', async () => {
    const mockArtwork: Artwork = {
      objectID: 123,
      title: 'Test Art',
      primaryImage: 'image.jpg',
      primaryImageSmall: 'small.jpg',
    };
    mockGet.mockResolvedValue({ data: mockArtwork });

    const result = await MetAPI.getArtworkDetails(123);

    expect(mockGet).toHaveBeenCalledWith('/artworks/123');
    expect(result.objectID).toBe(123);
  });

  it('should search by artist with proper URL encoding', async () => {
    const mockResponse: SearchResponse = { total: 5, objectIDs: [100] };
    mockGet.mockResolvedValue({ data: mockResponse });

    await MetAPI.searchByArtist('Van Gogh');

    expect(mockGet).toHaveBeenCalledWith('/artworks/artist/Van%20Gogh');
  });

  it('should handle network errors gracefully', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    await expect(MetAPI.searchArtworks()).rejects.toThrow('Network Error');
  });
});
