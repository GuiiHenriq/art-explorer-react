import axios from 'axios';
import type { SearchResponse, Artwork } from '../types/artwork';

const mockGet = jest.fn();
jest.mock('axios', () => ({
  create: () => ({ get: mockGet, interceptors: { response: { use: jest.fn() } } })
}));

import { metAPIService } from './metAPI';

describe('MetAPIService', () => {
  beforeEach(() => mockGet.mockClear());

  it('should search artworks', async () => {
    const mockResponse: SearchResponse = { total: 5, objectIDs: [1, 2, 3] };
    mockGet.mockResolvedValue({ data: mockResponse });

    const result = await metAPIService.searchArtworks({ q: 'painting' });

    expect(result).toEqual(mockResponse);
    expect(result.total).toBe(5);
  });

  it('should get artwork details', async () => {
    const mockArtwork: Artwork = {
      objectID: 123,
      title: 'Test Art',
      primaryImage: 'image.jpg',
      primaryImageSmall: 'small.jpg'
    };
    mockGet.mockResolvedValue({ data: mockArtwork });

    const result = await metAPIService.getArtworkDetails(123);

    expect(result.objectID).toBe(123);
    expect(result.title).toBe('Test Art');
  });

  it('should get departments', async () => {
    const mockDepartments = { departments: [{ departmentId: 1, displayName: 'Art' }] };
    mockGet.mockResolvedValue({ data: mockDepartments });

    const result = await metAPIService.getDepartments();

    expect(result.departments).toHaveLength(1);
  });

  it('should search by artist', async () => {
    const mockResponse: SearchResponse = { total: 10, objectIDs: [4, 5] };
    mockGet.mockResolvedValue({ data: mockResponse });

    const result = await metAPIService.searchByArtist('Picasso');

    expect(result.total).toBe(10);
  });
});
