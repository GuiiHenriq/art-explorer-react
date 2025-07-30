import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';
import type { Artwork, SearchResponse, Department, SearchParams } from '../types/artwork';

class MetAPIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.metBaseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout: Request took too long to respond');
        }

        if (!error.response) {
          throw new Error('Connection error: Check your internet connection');
        }

        switch (error.response.status) {
          case 404:
            throw new Error('Artwork not found');
          case 429:
            throw new Error('Too many requests: Try again in a few seconds');
          case 500:
            throw new Error('Internal server error');
          default:
            throw new Error(`HTTP Error ${error.response.status}: ${error.response.statusText}`);
        }
      },
    );
  }

  async searchArtworks(params: SearchParams = {}): Promise<SearchResponse> {
    const { hasImages = true, q = 'painting', ...otherParams } = params;

    const isArtistSearch = otherParams.artistOrCulture === true;
    
    const searchParamsObject: Record<string, string> = {};
    
    if (otherParams.artistOrCulture !== undefined) {
      searchParamsObject.artistOrCulture = otherParams.artistOrCulture.toString();
    }
    
    searchParamsObject.q = q;
    
    if (!isArtistSearch) {
      searchParamsObject.hasImages = hasImages.toString();
    }
    
    Object.entries(otherParams).forEach(([key, value]) => {
      if (key !== 'artistOrCulture' && value !== undefined && value !== null) {
        searchParamsObject[key] = value.toString();
      }
    });

    const searchParams = new URLSearchParams(searchParamsObject);
    const fullUrl = `/search?${searchParams}`;

    const response = await this.api.get(fullUrl);
    
    return response.data;
    return response.data;
  }

  async getArtworkDetails(objectID: number): Promise<Artwork> {
    const response = await this.api.get(`/objects/${objectID}`);
    return response.data;
  }

  async getDepartments(): Promise<{ departments: Department[] }> {
    const response = await this.api.get('/departments');
    return response.data;
  }

  async searchByArtist(artistName: string): Promise<SearchResponse> {
    return this.searchArtworks({
      artistOrCulture: true,
      q: artistName,
    });
  }

  async searchByDepartment(departmentId: number, query?: string): Promise<SearchResponse> {
    return this.searchArtworks({
      departmentId,
      q: query || 'art',
    });
  }
}

export const metAPIService = new MetAPIService();
export default metAPIService;
