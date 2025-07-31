import express from 'express';
import request from 'supertest';
import { errorHandler, notFoundHandler, CustomError } from './errorHandler';

describe('Error Handler', () => {
  it('should return 500 for generic errors', async () => {
    const app = express();
    app.get('/error', (req, res, next) => next(new Error('Test error')));
    app.use(errorHandler);

    const response = await request(app).get('/error');
    
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Test error');
  });

  it('should return custom status code', async () => {
    const app = express();
    app.get('/custom-error', (req, res, next) => {
      const error: CustomError = new Error('Bad request');
      error.statusCode = 400;
      next(error);
    });
    app.use(errorHandler);

    const response = await request(app).get('/custom-error');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad request');
  });

  it('should return 404 for missing routes', async () => {
    const app = express();
    app.use(notFoundHandler);

    const response = await request(app).get('/missing');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Endpoint not found');
  });
});
