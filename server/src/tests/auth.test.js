process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const User = require('../modules/users/user.model');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Integration Tests', () => {
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'user'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should fail if user already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail if passwords do not match', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, confirmPassword: 'wrongpassword' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message', 'User logged in successfully');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
    });

    it('should fail if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User logged out successfully');
      
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });
  });
});
