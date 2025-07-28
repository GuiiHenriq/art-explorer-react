import { Artwork } from '../types/artwork';

class CacheService {
  private cache = new Map<number, Artwork>();
  private readonly BATCH_SIZE = 15;
  private readonly DELAY_BETWEEN_REQUESTS = 500;

  private async fetchItemWithDelay(
    objectID: number, 
    delay: number,
    fetchFunction: (id: number) => Promise<Artwork>
  ): Promise<Artwork | null> {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const artwork = await fetchFunction(objectID);
      return artwork;
    } catch (error) {
      console.error(`Error fetching artwork ${objectID}:`, error);
      return null;
    }
  } 

  async preloadBatch(
    objectIDs: number[], 
    startIndex: number,
    fetchFunction: (id: number) => Promise<Artwork>
  ): Promise<Artwork[]> {
    const batchIDs = objectIDs.slice(startIndex, startIndex + this.BATCH_SIZE);
    const artworks: Artwork[] = [];
    
    console.log(`Preloading batch: artworks ${startIndex + 1} to ${startIndex + batchIDs.length}`);
    
    for (let i = 0; i < batchIDs.length; i++) {
      const objectID = batchIDs[i];
      
      if (this.cache.has(objectID)) {
        const cachedArtwork = this.cache.get(objectID);
        if (cachedArtwork) {
          artworks.push(cachedArtwork);
        }
        continue;
      }
      
      const delay = i * this.DELAY_BETWEEN_REQUESTS;
      const artworkData = await this.fetchItemWithDelay(objectID, delay, fetchFunction);
      
      if (artworkData) {
        this.cache.set(objectID, artworkData);
        artworks.push(artworkData);
      }
    }
    
    return artworks;
  }

  getCachedArtworks(objectIDs: number[]): Artwork[] {
    return objectIDs
      .map(id => this.cache.get(id))
      .filter(artwork => artwork !== undefined) as Artwork[];
  }

  getCachedCount(objectIDs: number[], upToIndex: number): number {
    return objectIDs.slice(0, upToIndex)
      .filter(id => this.cache.has(id)).length;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { totalCached: number; cacheSize: number } {
    return {
      totalCached: this.cache.size,
      cacheSize: this.cache.size
    };
  }

  hasItem(objectID: number): boolean {
    return this.cache.has(objectID);
  }

  getItem(objectID: number): Artwork | undefined {
    return this.cache.get(objectID);
  }

  setItem(objectID: number, artwork: Artwork): void {
    this.cache.set(objectID, artwork);
  }
}

export const cacheService = new CacheService();
export default cacheService; 