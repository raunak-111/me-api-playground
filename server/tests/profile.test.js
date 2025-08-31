const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Profile = require('../models/Profile');
const User = require('../models/User');

describe('Profile API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/me-api-test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clear database
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Create test user and get auth token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = userResponse.body.data.token;
    userId = userResponse.body.data.user.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/profile', () => {
    it('should return 404 when no profile exists', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should return profile when it exists', async () => {
      // Create a profile first
      const profileData = {
        name: 'John Doe',
        email: 'john@example.com',
        title: 'Developer',
        bio: 'Test bio',
        skills: [
          { name: 'javascript', level: 'expert', category: 'frontend' }
        ]
      };

      await Profile.create(profileData);

      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
    });
  });

  describe('POST /api/profile', () => {
    it('should create profile with valid data and auth', async () => {
      const profileData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        title: 'Full Stack Developer',
        bio: 'Passionate developer',
        location: 'San Francisco',
        skills: [
          { name: 'react', level: 'advanced', category: 'frontend' },
          { name: 'node.js', level: 'expert', category: 'backend' }
        ],
        projects: [{
          title: 'Test Project',
          description: 'A test project',
          skills: ['react', 'node.js'],
          status: 'completed'
        }]
      };

      const response = await request(app)
        .post('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Jane Doe');
      expect(response.body.data.skills).toHaveLength(2);
      expect(response.body.data.projects).toHaveLength(1);
    });

    it('should return 401 without authentication', async () => {
      const profileData = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(profileData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 with invalid data', async () => {
      const profileData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/profile', () => {
    let profileId;

    beforeEach(async () => {
      const profile = await Profile.create({
        name: 'John Doe',
        email: 'john@example.com',
        title: 'Developer'
      });
      profileId = profile._id;
    });

    it('should update profile with valid data and auth', async () => {
      const updateData = {
        name: 'John Updated',
        title: 'Senior Developer',
        bio: 'Updated bio'
      };

      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Updated');
      expect(response.body.data.title).toBe('Senior Developer');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({ name: 'Updated' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/profile/projects', () => {
    beforeEach(async () => {
      await Profile.create({
        name: 'John Doe',
        email: 'john@example.com',
        projects: [
          {
            title: 'React App',
            description: 'A React application',
            skills: ['react', 'javascript'],
            status: 'completed'
          },
          {
            title: 'Node API',
            description: 'A Node.js API',
            skills: ['node.js', 'express'],
            status: 'in-progress'
          }
        ]
      });
    });

    it('should return all projects', async () => {
      const response = await request(app)
        .get('/api/profile/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter projects by skill', async () => {
      const response = await request(app)
        .get('/api/profile/projects?skill=react')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('React App');
    });

    it('should paginate projects', async () => {
      const response = await request(app)
        .get('/api/profile/projects?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/profile/skills/top', () => {
    beforeEach(async () => {
      await Profile.create({
        name: 'John Doe',
        email: 'john@example.com',
        skills: [
          { name: 'javascript', level: 'expert', category: 'frontend' },
          { name: 'python', level: 'advanced', category: 'backend' },
          { name: 'html', level: 'intermediate', category: 'frontend' }
        ]
      });
    });

    it('should return top skills', async () => {
      const response = await request(app)
        .get('/api/profile/skills/top')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].level).toBe('expert');
    });

    it('should limit number of skills returned', async () => {
      const response = await request(app)
        .get('/api/profile/skills/top?limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/profile/search', () => {
    beforeEach(async () => {
      await Profile.create({
        name: 'John Doe',
        email: 'john@example.com',
        title: 'React Developer',
        bio: 'Passionate about JavaScript and React',
        skills: [
          { name: 'react', level: 'expert', category: 'frontend' },
          { name: 'javascript', level: 'expert', category: 'frontend' }
        ],
        projects: [{
          title: 'React Dashboard',
          description: 'A dashboard built with React',
          skills: ['react', 'javascript']
        }]
      });
    });

    it('should search across profile data', async () => {
      const response = await request(app)
        .get('/api/profile/search?q=react')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile).toBeTruthy();
      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data.skills).toHaveLength(1);
    });

    it('should return 400 without search query', async () => {
      const response = await request(app)
        .get('/api/profile/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });
  });
});
