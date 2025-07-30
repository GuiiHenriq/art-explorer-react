// Mock axios completely
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockInterceptors = {
  response: {
    use: jest.fn(),
  },
};

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    interceptors: mockInterceptors,
  })),
}));

import { MetAPI } from './metAPI';
import type { Artwork, SearchResponse, Department, SearchParams } from '../types/artwork';

describe('MetAPI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockGet.mockReset();
    mockPost.mockReset();
  });

  describe('axios instance configuration', () => {
    it('should have axios properly mocked for testing', () => {
      // This test just ensures our mocks are set up correctly
      expect(mockGet).toBeDefined();
      expect(mockPost).toBeDefined();
      expect(mockInterceptors).toBeDefined();
    });
  });

  describe('searchArtworks', () => {
    const mockSearchResponse: SearchResponse = {
      total: 100,
      objectIDs: [1, 2, 3, 4, 5],
    };

    it('should search artworks with default empty parameters', async () => {
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      const result = await MetAPI.searchArtworks();

      expect(mockGet).toHaveBeenCalledWith('/artworks/search', { params: {} });
      expect(result).toEqual(mockSearchResponse);
    });

    it('should search artworks with specific search parameters', async () => {
      const searchParams: SearchParams = {
        hasImages: true,
        isOnView: true,
        isPublicDomain: false,
        q: 'Monet',
        departmentId: 11,
        medium: 'Oil on canvas',
        dateBegin: 1800,
        dateEnd: 1900,
      };

      mockGet.mockResolvedValue({ data: mockSearchResponse });

      const result = await MetAPI.searchArtworks(searchParams);

      expect(mockGet).toHaveBeenCalledWith('/artworks/search', { params: searchParams });
      expect(result).toEqual(mockSearchResponse);
    });

    it('should handle empty search results', async () => {
      const emptyResponse: SearchResponse = {
        total: 0,
        objectIDs: [],
      };

      mockGet.mockResolvedValue({ data: emptyResponse });

      const result = await MetAPI.searchArtworks({ q: 'nonexistent' });

      expect(result).toEqual(emptyResponse);
      expect(result.total).toBe(0);
      expect(result.objectIDs).toHaveLength(0);
    });

    it('should propagate errors from axios', async () => {
      const errorMessage = 'Network error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(MetAPI.searchArtworks()).rejects.toThrow(errorMessage);
    });
  });

  describe('getArtworksBatch', () => {
    const mockBatchData: Artwork[] = [
      {
        objectID: 1,
        title: 'Test Artwork 1',
        primaryImage: 'https://example.com/image1.jpg',
        primaryImageSmall: 'https://example.com/small1.jpg',
        artistDisplayName: 'Test Artist 1',
      },
      {
        objectID: 2,
        title: 'Test Artwork 2',
        primaryImage: 'https://example.com/image2.jpg',
        primaryImageSmall: 'https://example.com/small2.jpg',
        artistDisplayName: 'Test Artist 2',
      },
    ];

    it('should fetch batch of artworks successfully', async () => {
      const objectIDs = [1, 2, 3];
      const mockResponse = {
        data: {
          data: mockBatchData,
          rateLimitInfo: {
            hasRateLimit: false,
            failedBatches: 0,
            totalBatches: 1,
            successfulArtworks: 2,
            requestedArtworks: 3,
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await MetAPI.getArtworksBatch(objectIDs);

      expect(mockPost).toHaveBeenCalledWith('/artworks/batch', { objectIDs });
      expect(result.data).toEqual(mockBatchData);
      expect(result.rateLimitInfo).toEqual(mockResponse.data.rateLimitInfo);
    });

    it('should handle response without nested data structure', async () => {
      const objectIDs = [1, 2];
      const mockResponse = {
        data: mockBatchData,
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await MetAPI.getArtworksBatch(objectIDs);

      expect(result.data).toEqual(mockBatchData);
      expect(result.rateLimitInfo).toBeUndefined();
    });

    it('should handle empty object IDs array', async () => {
      const mockResponse = {
        data: {
          data: [],
          rateLimitInfo: {
            hasRateLimit: false,
            failedBatches: 0,
            totalBatches: 0,
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await MetAPI.getArtworksBatch([]);

      expect(mockPost).toHaveBeenCalledWith('/artworks/batch', { objectIDs: [] });
      expect(result.data).toEqual([]);
    });

    it('should handle rate limit scenarios', async () => {
      const objectIDs = [1, 2, 3, 4, 5];
      const mockResponse = {
        data: {
          data: mockBatchData.slice(0, 2), // Only 2 out of 5 succeeded
          rateLimitInfo: {
            hasRateLimit: true,
            failedBatches: 2,
            totalBatches: 3,
            successfulArtworks: 2,
            requestedArtworks: 5,
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await MetAPI.getArtworksBatch(objectIDs);

      expect(result.rateLimitInfo?.hasRateLimit).toBe(true);
      expect(result.rateLimitInfo?.failedBatches).toBe(2);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('getArtworkDetails', () => {
    const mockArtwork: Artwork = {
      objectID: 123,
      title: 'The Starry Night',
      primaryImage: 'https://example.com/starry-night.jpg',
      primaryImageSmall: 'https://example.com/starry-night-small.jpg',
      artistDisplayName: 'Vincent van Gogh',
      objectDate: '1889',
      medium: 'Oil on canvas',
      department: 'European Paintings',
      culture: 'Dutch',
      artistNationality: 'Dutch',
      artistBeginDate: '1853',
      artistEndDate: '1890',
      tags: [
        {
          term: 'Night',
          AAT_URL: 'http://vocab.getty.edu/aat/300133095',
          Wikidata_URL: 'https://www.wikidata.org/wiki/Q575',
        },
      ],
    };

    it('should fetch artwork details successfully', async () => {
      const objectID = 123;
      mockGet.mockResolvedValue({ data: mockArtwork });

      const result = await MetAPI.getArtworkDetails(objectID);

      expect(mockGet).toHaveBeenCalledWith('/artworks/123');
      expect(result).toEqual(mockArtwork);
      expect(result.objectID).toBe(objectID);
      expect(result.title).toBe('The Starry Night');
      expect(result.artistDisplayName).toBe('Vincent van Gogh');
    });

    it('should handle artwork with minimal data', async () => {
      const minimalArtwork: Artwork = {
        objectID: 456,
        title: 'Unknown Work',
        primaryImage: '',
        primaryImageSmall: '',
      };

      mockGet.mockResolvedValue({ data: minimalArtwork });

      const result = await MetAPI.getArtworkDetails(456);

      expect(result).toEqual(minimalArtwork);
      expect(result.artistDisplayName).toBeUndefined();
      expect(result.primaryImage).toBe('');
    });

    it('should handle different object ID types', async () => {
      const objectID = 999999;
      mockGet.mockResolvedValue({ data: { ...mockArtwork, objectID } });

      const result = await MetAPI.getArtworkDetails(objectID);

      expect(mockGet).toHaveBeenCalledWith('/artworks/999999');
      expect(result.objectID).toBe(objectID);
    });
  });

  describe('getDepartments', () => {
    const mockDepartments: Department[] = [
      { departmentId: 1, displayName: 'American Decorative Arts' },
      { departmentId: 11, displayName: 'European Paintings' },
      { departmentId: 6, displayName: 'Asian Art' },
    ];

    it('should fetch departments successfully', async () => {
      const mockResponse = { departments: mockDepartments };
      mockGet.mockResolvedValue({ data: mockResponse });

      const result = await MetAPI.getDepartments();

      expect(mockGet).toHaveBeenCalledWith('/artworks/departments');
      expect(result).toEqual(mockResponse);
      expect(result.departments).toHaveLength(3);
      expect(result.departments[0].displayName).toBe('American Decorative Arts');
    });

    it('should handle empty departments list', async () => {
      const emptyResponse = { departments: [] };
      mockGet.mockResolvedValue({ data: emptyResponse });

      const result = await MetAPI.getDepartments();

      expect(result.departments).toEqual([]);
      expect(result.departments).toHaveLength(0);
    });
  });

  describe('searchByArtist', () => {
    const mockSearchResponse: SearchResponse = {
      total: 15,
      objectIDs: [100, 101, 102],
    };

    it('should search artworks by artist name', async () => {
      const artistName = 'Van Gogh';
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      const result = await MetAPI.searchByArtist(artistName);

      expect(mockGet).toHaveBeenCalledWith('/artworks/artist/Van%20Gogh');
      expect(result).toEqual(mockSearchResponse);
    });

    it('should properly encode artist names with special characters', async () => {
      const artistName = 'José María & Sons';
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      await MetAPI.searchByArtist(artistName);

      expect(mockGet).toHaveBeenCalledWith('/artworks/artist/Jos%C3%A9%20Mar%C3%ADa%20%26%20Sons');
    });

    it('should handle artist names with spaces and punctuation', async () => {
      const artistName = 'Leonardo da Vinci';
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      await MetAPI.searchByArtist(artistName);

      expect(mockGet).toHaveBeenCalledWith('/artworks/artist/Leonardo%20da%20Vinci');
    });

    it('should handle empty artist search results', async () => {
      const emptyResponse: SearchResponse = { total: 0, objectIDs: [] };
      mockGet.mockResolvedValue({ data: emptyResponse });

      const result = await MetAPI.searchByArtist('Unknown Artist');

      expect(result.total).toBe(0);
      expect(result.objectIDs).toHaveLength(0);
    });
  });

  describe('searchByDepartment', () => {
    const mockSearchResponse: SearchResponse = {
      total: 25,
      objectIDs: [200, 201, 202, 203],
    };

    it('should search artworks by department ID only', async () => {
      const departmentId = 11;
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      const result = await MetAPI.searchByDepartment(departmentId);

      expect(mockGet).toHaveBeenCalledWith('/artworks/department/11', { params: {} });
      expect(result).toEqual(mockSearchResponse);
    });

    it('should search artworks by department ID with query', async () => {
      const departmentId = 11;
      const query = 'impressionist';
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      const result = await MetAPI.searchByDepartment(departmentId, query);

      expect(mockGet).toHaveBeenCalledWith('/artworks/department/11', {
        params: { q: query },
      });
      expect(result).toEqual(mockSearchResponse);
    });

    it('should handle different department IDs', async () => {
      const departmentId = 6; // Asian Art
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      await MetAPI.searchByDepartment(departmentId, 'sculpture');

      expect(mockGet).toHaveBeenCalledWith('/artworks/department/6', {
        params: { q: 'sculpture' },
      });
    });

    it('should handle empty query string correctly', async () => {
      const departmentId = 1;
      mockGet.mockResolvedValue({ data: mockSearchResponse });

      await MetAPI.searchByDepartment(departmentId, '');

      // When query is empty string, the condition `query ? { q: query } : {}` evaluates to {}
      // because empty string is falsy in JavaScript
      expect(mockGet).toHaveBeenCalledWith('/artworks/department/1', {
        params: {},
      });
    });
  });

  describe('error handling and interceptors', () => {
    it('should handle API errors through the service methods', async () => {
      // Test error handling through the actual API methods
      const networkError = new Error('Network Error');
      mockGet.mockRejectedValue(networkError);

      await expect(MetAPI.searchArtworks()).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors through the service methods', async () => {
      const timeoutError = { code: 'ECONNABORTED', message: 'timeout' };
      mockGet.mockRejectedValue(timeoutError);

      await expect(MetAPI.getArtworkDetails(123)).rejects.toMatchObject({
        code: 'ECONNABORTED',
        message: 'timeout',
      });
    });

    it('should handle HTTP error responses through the service methods', async () => {
      const httpError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Artwork not found' },
        },
      };
      mockGet.mockRejectedValue(httpError);

      await expect(MetAPI.getArtworkDetails(999999)).rejects.toMatchObject({
        response: expect.objectContaining({
          status: 404,
          statusText: 'Not Found',
        }),
      });
    });

    it('should handle rate limit errors through the service methods', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' },
        },
      };
      mockPost.mockRejectedValue(rateLimitError);

      await expect(MetAPI.getArtworksBatch([1, 2, 3])).rejects.toMatchObject({
        response: expect.objectContaining({
          status: 429,
          statusText: 'Too Many Requests',
        }),
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete search-to-details workflow', async () => {
      const searchResponse: SearchResponse = {
        total: 2,
        objectIDs: [123, 456],
      };

      const artwork123: Artwork = {
        objectID: 123,
        title: 'Test Artwork 1',
        primaryImage: 'https://example.com/1.jpg',
        primaryImageSmall: 'https://example.com/1-small.jpg',
        artistDisplayName: 'Artist 1',
      };

      const artwork456: Artwork = {
        objectID: 456,
        title: 'Test Artwork 2',
        primaryImage: 'https://example.com/2.jpg',
        primaryImageSmall: 'https://example.com/2-small.jpg',
        artistDisplayName: 'Artist 2',
      };

      // Mock the search call
      mockGet
        .mockResolvedValueOnce({ data: searchResponse })
        .mockResolvedValueOnce({ data: artwork123 })
        .mockResolvedValueOnce({ data: artwork456 });

      // Perform search
      const searchResult = await MetAPI.searchArtworks({ q: 'test' });
      expect(searchResult.objectIDs).toHaveLength(2);

      // Fetch details for each artwork
      const details1 = await MetAPI.getArtworkDetails(searchResult.objectIDs[0]);
      const details2 = await MetAPI.getArtworkDetails(searchResult.objectIDs[1]);

      expect(details1.title).toBe('Test Artwork 1');
      expect(details2.title).toBe('Test Artwork 2');

      // Verify all calls were made correctly
      expect(mockGet).toHaveBeenCalledTimes(3);
      expect(mockGet).toHaveBeenNthCalledWith(1, '/artworks/search', { params: { q: 'test' } });
      expect(mockGet).toHaveBeenNthCalledWith(2, '/artworks/123');
      expect(mockGet).toHaveBeenNthCalledWith(3, '/artworks/456');
    });

    it('should handle mixed success/failure in batch requests', async () => {
      const objectIDs = [1, 2, 3];
      const partialBatchResponse = {
        data: {
          data: [
            {
              objectID: 1,
              title: 'Success 1',
              primaryImage: 'https://example.com/1.jpg',
              primaryImageSmall: 'https://example.com/1-small.jpg',
            },
            {
              objectID: 3,
              title: 'Success 3',
              primaryImage: 'https://example.com/3.jpg',
              primaryImageSmall: 'https://example.com/3-small.jpg',
            },
          ],
          rateLimitInfo: {
            hasRateLimit: true,
            failedBatches: 1,
            totalBatches: 2,
            successfulArtworks: 2,
            requestedArtworks: 3,
          },
        },
      };

      mockPost.mockResolvedValue(partialBatchResponse);

      const result = await MetAPI.getArtworksBatch(objectIDs);

      expect(result.data).toHaveLength(2);
      expect(result.data.find((art) => art.objectID === 2)).toBeUndefined(); // Failed artwork
      expect(result.rateLimitInfo?.successfulArtworks).toBe(2);
      expect(result.rateLimitInfo?.requestedArtworks).toBe(3);
    });
  });
});
