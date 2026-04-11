process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const express = require('express');
const healthRecRoutes = require('../modules/health_recommendation/healthRecommendation.routes');
const healthAdviceRoutes = require('../modules/health_advice/healthAdvice.routes');
const authRoutes = require('../modules/auth/auth.routes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/health-recommendation', healthRecRoutes);
app.use('/api/health-advice', healthAdviceRoutes);

describe('Health Integration Tests', () => {
  let token;
  let testUser = {
    firstName: 'Health',
    lastName: 'Tester',
    phoneNumber: '3333333333',
    email: 'health@test.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  const healthProfilePayload = {
    profile_name: 'My Fitness Plan',
    user_profile: {
      age: 25,
      gender: 'male',
      height_cm: 180,
      weight_kg: 80,
      target_weight_kg: 75,
      activity_level: 'moderately active',
      dietary_preference: 'non-vegetarian',
      goal: 'lose',
      exercise: {
        type: 'cardio',
        frequency: 3,
        duration_min: 30
      },
      sleep_hours: 8,
      water_intake: 2,
      meal_frequency: 3,
      cooking_time: '15-30 min'
    }
  };

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const login = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    token = login.body.token;
  });

  it('should create a health profile', async () => {
    const response = await request(app)
      .post('/api/health-recommendation')
      .set('Authorization', `Bearer ${token}`)
      .send(healthProfilePayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  describe('Operations on existing profile', () => {
    let profileId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/health-recommendation')
        .set('Authorization', `Bearer ${token}`)
        .send(healthProfilePayload);
      profileId = response.body.data._id;
    });

    it('should get all health profiles', async () => {
      const response = await request(app)
        .get('/api/health-recommendation')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get health profile by ID', async () => {
      const response = await request(app)
        .get(`/api/health-recommendation/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.profile_name).toBe(healthProfilePayload.profile_name);
    });

    it('should update health profile', async () => {
      const response = await request(app)
        .put(`/api/health-recommendation/${profileId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ profile_name: 'Updated Plan', user_profile: healthProfilePayload.user_profile });

      expect(response.status).toBe(200);
      expect(response.body.data.profile_name).toBe('Updated Plan');
    });

    it('should generate health advice', async () => {
      const response = await request(app)
        .post(`/api/health-advice/generate/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.advice).toBeDefined();
    });

    it('should get health advice for a profile', async () => {
      await request(app)
        .post(`/api/health-advice/generate/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get(`/api/health-advice/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.advice).toBeDefined();
    });

    it('should regenerate health advice', async () => {
      await request(app)
        .post(`/api/health-advice/generate/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .post(`/api/health-advice/regenerate/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.advice).toBeDefined();
    });

    it('should delete health profile', async () => {
      const response = await request(app)
        .delete(`/api/health-recommendation/${profileId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  it('should get all health advice', async () => {
    const response = await request(app)
      .get('/api/health-advice')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
