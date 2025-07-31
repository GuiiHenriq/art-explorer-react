import request from 'supertest';
import express from 'express';
import { metAPIService } from '../services/metAPI';
import {
  searchArtworks,
  getArtworkDetails,
  getDepartments,
  searchByArtist,
  searchByDepartment,
  getArtworksBatch,
} from './artworkController';

jest.mock('../services/metAPI');
const mockService = metAPIService as jest.Mocked<typeof metAPIService>;

const app = express();
app.use(express.json());
app.get('/search', searchArtworks);
app.get('/details/:objectID', getArtworkDetails);
app.get('/departments', getDepartments);
app.get('/artist/:artistName', searchByArtist);
app.get('/department/:departmentId', searchByDepartment);
app.post('/batch', getArtworksBatch);

describe('Artwork Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should search artworks successfully', async () => {
    mockService.searchArtworks.mockResolvedValue({ objectIDs: [1, 2], total: 2 });

    const res = await request(app).get('/search').query({ q: 'test' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.objectIDs).toHaveLength(2);
  });

  it('should get artwork details with valid ID', async () => {
    const artwork = { objectID: 123, title: 'Test Art', primaryImage: 'test.jpg', primaryImageSmall: 'small.jpg' };
    mockService.getArtworkDetails.mockResolvedValue(artwork);

    const res = await request(app).get('/details/123');

    expect(res.status).toBe(200);
    expect(res.body.data.objectID).toBe(123);
  });

  it('should reject invalid artwork ID', async () => {
    const res = await request(app).get('/details/invalid');
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid object ID');
  });

  it('should get departments list', async () => {
    mockService.getDepartments.mockResolvedValue({ departments: [{ departmentId: 1, displayName: 'Art' }] });

    const res = await request(app).get('/departments');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should search by artist name', async () => {
    mockService.searchByArtist.mockResolvedValue({ objectIDs: [1], total: 1 });

    const res = await request(app).get('/artist/Picasso');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject empty artist name', async () => {
    const res = await request(app).get('/artist/%20');
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Artist name is required');
  });

  it('should search by department', async () => {
    mockService.searchByDepartment.mockResolvedValue({ objectIDs: [1], total: 1 });

    const res = await request(app).get('/department/11').query({ q: 'painting' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject invalid department ID', async () => {
    const res = await request(app).get('/department/abc');
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid department ID');
  });

  it('should process batch artworks', async () => {
    mockService.getArtworkDetails.mockResolvedValue({ objectID: 1, title: 'Art', primaryImage: 'test.jpg', primaryImageSmall: 'small.jpg' });

    const res = await request(app).post('/batch').send({ objectIDs: [1, 2] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it('should reject missing batch IDs', async () => {
    const res = await request(app).post('/batch').send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Object IDs are required');
  });
});
