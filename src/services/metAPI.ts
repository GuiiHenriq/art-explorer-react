import axios from 'axios';
import type { Artwork, SearchResponse, Department, SearchParams } from '../types/artwork';

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: The request took too long to respond');
    }

    if (!error.response) {
      throw new Error('Connection error: Please check your internet');
    }

    switch (error.response.status) {
      case 404:
        throw new Error('Artwork not found');
      case 429:
        throw new Error('Too many requests: Please try again in a few seconds');
      case 500:
        throw new Error('Internal server error');
      default:
        throw new Error(`HTTP error ${error.response.status}: ${error.response.statusText}`);
    }
  },
);

export const MetAPI = {
  // Search artworks with image
  async searchArtworks(params: SearchParams = {}): Promise<SearchResponse> {
    const { hasImages = true, q = 'painting', ...otherParams } = params;

    const searchParams = new URLSearchParams({
      hasImages: hasImages.toString(),
      q,
      ...Object.entries(otherParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    });

    const response = await api.get(`/search?${searchParams}`);
    return response.data;
  },

  // Details of artwork
  async getArtworkDetails(objectID: number): Promise<Artwork> {
    const response = await api.get(`/objects/${objectID}`);
    return response.data;
  },

  // List departments
  async getDepartments(): Promise<{ departments: Department[] }> {
    const response = await api.get('/departments');
    return response.data;
  },

  // Search by artist or culture
  async searchByArtist(artistName: string): Promise<SearchResponse> {
    return this.searchArtworks({
      artistOrCulture: true,
      q: artistName,
    });
  },

  // Search by department
  async searchByDepartment(departmentId: number, query?: string): Promise<SearchResponse> {
    return this.searchArtworks({
      departmentId,
      q: query || 'art',
    });
  },
};

export default MetAPI;
