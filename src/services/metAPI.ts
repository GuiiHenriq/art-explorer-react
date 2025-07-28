import axios from 'axios';
import type { Artwork, SearchResponse, Department, SearchParams } from '../types/artwork';

const BASE_URL = 'http://localhost:3003/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: Request took too long to respond');
    }

    if (!error.response) {
      throw new Error('Connection error: Check your internet connection');
    }

    if (error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }

    switch (error.response.status) {
      case 404:
        throw new Error('Resource not found');
      case 429:
        throw new Error('Too many requests: Try again in a few seconds');
      case 500:
        throw new Error('Internal server error');
      default:
        throw new Error(`HTTP Error ${error.response.status}: ${error.response.statusText}`);
    }
  },
);

export const MetAPI = {
  async searchArtworks(params: SearchParams = {}): Promise<SearchResponse> {
    const response = await api.get('/artworks/search', { params });
    return response.data;
  },

  async searchArtworksWithCache(params: SearchParams = {}): Promise<SearchResponse> {
    const response = await api.get('/artworks/search-with-cache', { params });
    return response.data;
  },

  async preloadBatch(objectIDs: number[], currentBatch: number): Promise<{ cached: boolean }> {
    const response = await api.post('/artworks/preload-batch', {
      objectIDs,
      currentBatch,
    });
    return response.data;
  },

  async getCachedArtworks(objectIDs: number[]): Promise<Artwork[]> {
    const response = await api.get('/artworks/cached', {
      params: { objectIDs: objectIDs.join(',') },
    });
    return response.data;
  },

  async getCacheStats(): Promise<{ totalCached: number; cacheSize: number }> {
    const response = await api.get('/artworks/cache/stats');
    return response.data;
  },

  async clearCache(): Promise<void> {
    await api.delete('/artworks/cache');
  },

  async getArtworkDetails(objectID: number): Promise<Artwork> {
    const response = await api.get(`/artworks/${objectID}`);
    return response.data;
  },

  async getDepartments(): Promise<{ departments: Department[] }> {
    const response = await api.get('/artworks/departments');
    return response.data;
  },

  async searchByArtist(artistName: string): Promise<SearchResponse> {
    const response = await api.get(`/artworks/artist/${encodeURIComponent(artistName)}`);
    return response.data;
  },

  async searchByDepartment(departmentId: number, query?: string): Promise<SearchResponse> {
    const params = query ? { q: query } : {};
    const response = await api.get(`/artworks/department/${departmentId}`, { params });
    return response.data;
  },
};

export default MetAPI;