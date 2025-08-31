const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Health API', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/me-api-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Service is healthy');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe('OK');
      expect(response.body.data.database.status).toBe('connected');
      expect(response.body.data.uptime).toBeGreaterThan(0);
      expect(response.body.data.memory).toBeDefined();
      expect(response.body.data.version).toBe('1.0.0');
    });

    it('should include correct environment', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data.environment).toBeDefined();
    });

    it('should include memory usage information', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data.memory.used).toBeDefined();
      expect(response.body.data.memory.total).toBeDefined();
      expect(response.body.data.memory.used).toMatch(/\d+ MB/);
      expect(response.body.data.memory.total).toMatch(/\d+ MB/);
    });
  });
});
