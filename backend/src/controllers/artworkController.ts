import { Request, Response } from 'express';
import { metAPIService } from '../services/metAPI';
import { ApiResponse, SearchParams } from '../types/artwork';
import { asyncHandler } from '../middleware/errorHandler';

const parseQueryParams = (query: any, paramConfig: Record<string, (value: string) => any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const [key, transformer] of Object.entries(paramConfig)) {
    const value = query[key];
    if (value) {
      const transformed = transformer(value);
      if (transformed !== undefined) {
        result[key] = transformed;
      }
    }
  }
  
  return result;
};

export const searchArtworks = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const searchParams: SearchParams = {
      hasImages: req.query.hasImages === 'true',
      q: req.query.q as string,
      ...parseQueryParams(req.query, {
        artistOrCulture: (value: string) => value === 'true',
        dateBegin: (value: string) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? undefined : num;
        },
        dateEnd: (value: string) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? undefined : num;
        },
        medium: (value: string) => value,
        departmentId: (value: string) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? undefined : num;
        },
      })
    };

    const result = await metAPIService.searchArtworks(searchParams);

    res.json({
      success: true,
      data: result,
      message: 'Search completed successfully',
    });
  }
);

export const getArtworkDetails = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { objectID } = req.params;
    const objectIdNumber = parseInt(objectID, 10);

    if (isNaN(objectIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid object ID',
        message: 'Object ID must be a valid number',
      });
      return;
    }

    const result = await metAPIService.getArtworkDetails(objectIdNumber);

    res.json({
      success: true,
      data: result,
      message: 'Artwork details retrieved successfully',
    });
  }
);

export const getDepartments = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const result = await metAPIService.getDepartments();

    res.json({
      success: true,
      data: result,
      message: 'Departments retrieved successfully',
    });
  }
);

export const searchByArtist = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { artistName } = req.params;

    if (!artistName || artistName.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Artist name is required',
        message: 'Provide a valid artist name for the search',
      });
      return;
    }

    const result = await metAPIService.searchByArtist(artistName);

    res.json({
      success: true,
      data: result,
      message: `Search for artist "${artistName}" completed successfully`,
    });
  }
);

export const searchByDepartment = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { departmentId } = req.params;
    const { q } = req.query;
    
    const departmentIdNumber = parseInt(departmentId, 10);

    if (isNaN(departmentIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid department ID',
        message: 'Department ID must be a valid number',
      });
      return;
    }

    const result = await metAPIService.searchByDepartment(
      departmentIdNumber,
      q as string
    );

    res.json({
      success: true,
      data: result,
      message: `Search in department ${departmentId} completed successfully`,
    });
  }
);

export const getArtworksBatch = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { objectIDs, filterImages = false } = req.body;

    if (!objectIDs || !Array.isArray(objectIDs)) {
      res.status(400).json({
        success: false,
        error: 'Object IDs are required',
        message: 'Provide a valid array of object IDs',
      });
      return;
    }

    if (objectIDs.length === 0) {
      res.json({
        success: true,
        data: [],
        message: 'No object IDs provided',
        rateLimitInfo: { hasRateLimit: false, failedBatches: 0, totalBatches: 0 }
      });
      return;
    }

    const BATCH_SIZE = 5; // 3 batches of 5 artworks each
    const artworks = [];
    let rateLimitHit = false;
    let failedBatches = 0;
    const totalBatches = Math.ceil(objectIDs.length / BATCH_SIZE);

    console.log(`🎨 Processing ${objectIDs.length} artworks in ${totalBatches} batches${filterImages ? ' (filtering images)' : ''}`);

    for (let i = 0; i < objectIDs.length; i += BATCH_SIZE) {
      const batchIds = objectIDs.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      const batchPromises = batchIds.map(async (id: number) => {
        try {
          const artwork = await metAPIService.getArtworkDetails(id);
          
          if (filterImages && (!artwork.primaryImage || artwork.primaryImage.trim() === '')) {
            return null;
          }
          
          return artwork;
        } catch (error: any) {
          console.error(`Failed to fetch artwork ${id}:`, error?.message || error);
          
          if (error?.message?.includes('403') || error?.message?.includes('Too many requests')) {
            rateLimitHit = true;
          }
          
          return null;
        }
      });

      try {
        const results = await Promise.all(batchPromises);
        
        const validResults = results.filter(item => item !== null);
        
        if (validResults.length === 0 && batchIds.length > 0) {
          failedBatches++;
          rateLimitHit = true;
          console.warn(`Batch ${batchNumber} completely failed - likely rate limited`);
          
          break;
        }
        
        artworks.push(...validResults);

        if (i + BATCH_SIZE < objectIDs.length) {
          await new Promise(resolve => setTimeout(resolve, 800)); // 800ms - Delay between batches
        }
      } catch (error) {
        console.error(`Error processing batch ${batchNumber}:`, error);
        failedBatches++;
        rateLimitHit = true;
        
        break;
      }
    }

    res.json({
      success: true,
      data: artworks,
      message: artworks.length > 0 
        ? `${artworks.length} artworks retrieved successfully` 
        : 'No artworks could be retrieved',
      rateLimitInfo: {
        hasRateLimit: rateLimitHit,
        failedBatches,
        totalBatches,
        successfulArtworks: artworks.length,
        requestedArtworks: objectIDs.length
      }
    });
  }
);

