process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const express = require('express');
const userRoutes = require('../modules/users/user.routes');
const authRoutes = require('../modules/auth/auth.routes');
const User = require('../modules/users/user.model');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

describe('User Integration Tests', () => {
  let adminToken;
  let userToken;
  let userId;
  let adminId;

  const adminUser = {
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '1111111111',
    email: 'admin@test.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'admin'
  };

  const regularUser = {
    firstName: 'Regular',
    lastName: 'User',
    phoneNumber: '2222222222',
    email: 'user@test.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'user'
  };

  beforeEach(async () => {
    const adminReg = await request(app).post('/api/auth/register').send(adminUser);
    adminId = adminReg.body.user._id;
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLogin.body.token;

    const userReg = await request(app).post('/api/auth/register').send(regularUser);
    userId = userReg.body.user._id;
    const userLogin = await request(app).post('/api/auth/login').send({
      email: regularUser.email,
      password: regularUser.password
    });
    userToken = userLogin.body.token;
  });

  describe('GET /api/users', () => {
    it('should allow admin to fetch all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should deny regular user from fetching all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should fetch user profile by id', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(regularUser.email);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ firstName: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe('Updated');
    });
  });
});
