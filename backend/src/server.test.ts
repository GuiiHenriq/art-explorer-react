import request from 'supertest';
import app from './server';

describe('Server', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Art Explorer Backend is running!');
  });

  it('should return 404 for invalid routes', async () => {
    const response = await request(app)
      .get('/invalid-route')
      .expect(404);

    expect(response.body.success).toBe(false);
  });

  it('should include CORS headers', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  it('should include security headers', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
