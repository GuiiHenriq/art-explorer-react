import { Router } from 'express';
import {
  searchArtworks,
  getArtworkDetails,
  getDepartments,
  searchByArtist,
  searchByDepartment,
} from '../controllers/artworkController';

const router = Router();

// GET /api/artworks/search - Search for artworks
router.get('/search', searchArtworks);

// GET /api/artworks/departments - List departments
router.get('/departments', getDepartments);

// GET /api/artworks/:objectID - Get details of a specific artwork
router.get('/:objectID', getArtworkDetails);

// GET /api/artworks/artist/:artistName - Search by artist
router.get('/artist/:artistName', searchByArtist);

// GET /api/artworks/department/:departmentId - Search by department
router.get('/department/:departmentId', searchByDepartment);

export default router;
