import { Request, Response } from 'express';
import { metAPIService } from '../services/metAPI';
import { cacheService } from '../services/cacheService';
import { ApiResponse, SearchParams } from '../types/artwork';
import { asyncHandler } from '../middleware/errorHandler';

export const searchArtworks = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const searchParams: SearchParams = {
      hasImages: req.query.hasImages === 'true',
      q: req.query.q as string,
    };

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof SearchParams] === undefined) {
        delete searchParams[key as keyof SearchParams];
      }
    });

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

export const preloadBatch = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { objectIDs, currentBatch } = req.body;
    
    if (!objectIDs || !Array.isArray(objectIDs)) {
      res.status(400).json({
        success: false,
        error: 'Object IDs are required',
        message: 'Provide a valid array of object IDs',
      });
      return;
    }

    if (typeof currentBatch !== 'number' || currentBatch < 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid current batch',
        message: 'Current batch must be a non-negative number',
      });
      return;
    }

    const startIndex = currentBatch * 15;
    
    const cachedCount = cacheService.getCachedCount(objectIDs, startIndex + 15);
    
    if (cachedCount >= startIndex + 15) {
      res.json({
        success: true,
        data: { cached: true },
        message: 'Batch already in cache',
      });
      return;
    }
    
    await cacheService.preloadBatch(
      objectIDs, 
      startIndex, 
      metAPIService.getArtworkDetails.bind(metAPIService)
    );
    
    res.json({
      success: true,
      data: { cached: false },
      message: `Batch ${currentBatch + 1} preloaded successfully`,
    });
  }
);

export const getCachedArtworks = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const { objectIDs } = req.query;
    
    if (!objectIDs || typeof objectIDs !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Object IDs are required',
        message: 'Provide object IDs as query parameter',
      });
      return;
    }

    const ids = objectIDs.split(',').map(id => parseInt(id.trim(), 10));
    
    if (ids.some(id => isNaN(id))) {
      res.status(400).json({
        success: false,
        error: 'Invalid IDs',
        message: 'All IDs must be valid numbers',
      });
      return;
    }

    const artworks = cacheService.getCachedArtworks(ids);
    
    res.json({
      success: true,
      data: artworks,
      message: `${artworks.length} artworks found in cache`,
    });
  }
);

export const getCacheStats = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const stats = cacheService.getCacheStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Cache statistics retrieved successfully',
    });
  }
);

export const clearCache = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    cacheService.clearCache();
    
    res.json({
      success: true,
      data: null,
      message: 'Cache cleared successfully',
    });
  }
);

export const searchArtworksWithCache = asyncHandler(
  async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    const searchParams: SearchParams = {
      hasImages: req.query.hasImages === 'true',
      q: req.query.q as string,
    };

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof SearchParams] === undefined) {
        delete searchParams[key as keyof SearchParams];
      }
    });

    const result = await metAPIService.searchArtworks(searchParams);

    res.json({
      success: true,
      data: result,
      message: 'Search completed successfully',
    });
  }
);
