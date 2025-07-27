import { Router } from 'express';
import {
  searchArtworks,
  getArtworkDetails,
  getDepartments,
  searchByArtist,
  searchByDepartment,
  preloadBatch,
  getCachedArtworks,
  getCacheStats,
  clearCache,
  searchArtworksWithCache,
} from '../controllers/artworkController';

const router = Router();

// GET /api/artworks/search - Buscar obras de arte (versão original)
router.get('/search', searchArtworks);

// GET /api/artworks/search-with-cache - Buscar obras de arte com cache automático
router.get('/search-with-cache', searchArtworksWithCache);

// POST /api/artworks/preload-batch - Pré-carregar próximo lote
router.post('/preload-batch', preloadBatch);

// GET /api/artworks/cached - Obter artworks do cache
router.get('/cached', getCachedArtworks);

// GET /api/artworks/cache/stats - Obter estatísticas do cache
router.get('/cache/stats', getCacheStats);

// DELETE /api/artworks/cache - Limpar cache
router.delete('/cache', clearCache);

// GET /api/artworks/departments - Listar departamentos
router.get('/departments', getDepartments);

// GET /api/artworks/:objectID - Obter detalhes de uma obra específica
router.get('/:objectID', getArtworkDetails);

// GET /api/artworks/artist/:artistName - Buscar por artista
router.get('/artist/:artistName', searchByArtist);

// GET /api/artworks/department/:departmentId - Buscar por departamento
router.get('/department/:departmentId', searchByDepartment);

export default router;
