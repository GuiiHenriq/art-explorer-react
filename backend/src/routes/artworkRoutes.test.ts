import request from 'supertest';
import express from 'express';
import router from './artworkRoutes';
import { metAPIService } from '../services/metAPI';

jest.mock('../services/metAPI');
const mockedService = metAPIService as jest.Mocked<typeof metAPIService>;

const app = express();
app.use(express.json());
app.use('/api/artworks', router);

describe('Artwork Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /search - should return 200', async () => {
    mockedService.searchArtworks.mockResolvedValue({ total: 1, objectIDs: [123] });
    
    const res = await request(app).get('/api/artworks/search').query({ q: 'art' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /:objectID - should return artwork details', async () => {
    const mockArtwork = { objectID: 123, title: 'Art', primaryImage: '', primaryImageSmall: '' };
    mockedService.getArtworkDetails.mockResolvedValue(mockArtwork);
    
    const res = await request(app).get('/api/artworks/123');
    
    expect(res.status).toBe(200);
    expect(res.body.data.objectID).toBe(123);
  });

  it('GET /:objectID - should return 400 for invalid ID', async () => {
    const res = await request(app).get('/api/artworks/invalid');
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /departments - should return departments', async () => {
    mockedService.getDepartments.mockResolvedValue({ departments: [] });
    
    const res = await request(app).get('/api/artworks/departments');
    
    expect(res.status).toBe(200);
  });

  it('POST /batch - should process batch request', async () => {
    const mockArt = { objectID: 1, title: 'Art', primaryImage: '', primaryImageSmall: '' };
    mockedService.getArtworkDetails.mockResolvedValue(mockArt);
    
    const res = await request(app).post('/api/artworks/batch').send({ objectIDs: [1] });
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('POST /batch - should return 400 for missing objectIDs', async () => {
    const res = await request(app).post('/api/artworks/batch').send({});
    
    expect(res.status).toBe(400);
  });
});
