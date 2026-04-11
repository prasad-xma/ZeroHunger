process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const express = require('express');
const mealRoutes = require('../modules/meals/meal.routes');
const authRoutes = require('../modules/auth/auth.routes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);

describe('Meal Integration Tests', () => {
  let token;
  let testUser = {
    firstName: 'Meal',
    lastName: 'Tester',
    phoneNumber: '4444444444',
    email: 'meal@test.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  const validMealPayload = {
    name: 'Test Chicken Salad',
    image: '/assets/meals/chicken-salad.jpg',
    description: 'A delicious and healthy chicken salad with fresh vegetables and light dressing. Perfect for lunch or dinner.',
    ingredients: [
      { name: 'Chicken Breast', quantity: '200g', calories: 250 },
      { name: 'Lettuce', quantity: '100g', calories: 15 },
      { name: 'Tomatoes', quantity: '50g', calories: 10 },
      { name: 'Olive Oil', quantity: '1 tbsp', calories: 40 }
    ],
    instructions: [
      'Cook chicken breast until golden brown',
      'Wash and chop vegetables',
      'Mix all ingredients in a bowl',
      'Add dressing and toss well',
      'Serve chilled'
    ],
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 20,
      fat: 18
    },
    servingSizeGrams: 350
  };

  let createdMealId;

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const login = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    token = login.body.token;
  });

  describe('POST /api/meals', () => {
    it('should create a new meal successfully', async () => {
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(validMealPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(validMealPayload.name);
      expect(response.body.data.description).toBe(validMealPayload.description);
      expect(response.body.data.ingredients).toHaveLength(4);
      expect(response.body.data.instructions).toHaveLength(5);
      expect(response.body.data.nutrition.calories).toBe(validMealPayload.nutrition.calories);
      createdMealId = response.body.data._id;
    });

    it('should create meal without authentication', async () => {
      const response = await request(app)
        .post('/api/meals')
        .send(validMealPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should reject meal creation with invalid data', async () => {
      const invalidMeal = {
        name: 'A', // Too short
        image: 'invalid-url',
        description: 'Short', // Too short
        ingredients: [], // Empty array
        instructions: [], // Empty array
        nutrition: {
          calories: 450,
          protein: 35,
          carbs: 20,
          fat: 18
        },
        servingSizeGrams: 350
      };

      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidMeal);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/meals', () => {
    beforeEach(async () => {
      // Create a meal for testing
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(validMealPayload);
      createdMealId = response.body.data._id;
    });

    it('should get all meals (summary view)', async () => {
      const response = await request(app)
        .get('/api/meals');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Should only return summary fields
      if (response.body.data.length > 0) {
        const meal = response.body.data[0];
        expect(meal._id).toBeDefined();
        expect(meal.name).toBeDefined();
        expect(meal.image).toBeDefined();
        expect(meal.nutrition).toBeDefined();
        expect(meal.nutrition.calories).toBeDefined();
        // Should not include full details
        expect(meal.description).toBeUndefined();
        expect(meal.ingredients).toBeUndefined();
        expect(meal.instructions).toBeUndefined();
      }
    });

    it('should get all meals with authentication', async () => {
      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/meals/:id', () => {
    beforeEach(async () => {
      // Create a meal for testing
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(validMealPayload);
      createdMealId = response.body.data._id;
    });

    it('should get meal by ID with full details', async () => {
      const response = await request(app)
        .get(`/api/meals/${createdMealId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(createdMealId);
      expect(response.body.data.name).toBe(validMealPayload.name);
      expect(response.body.data.description).toBe(validMealPayload.description);
      // Database adds _id to subdocuments, so we check structure and values
      expect(response.body.data.ingredients).toHaveLength(4);
      expect(response.body.data.ingredients[0]).toMatchObject(validMealPayload.ingredients[0]);
      expect(response.body.data.ingredients[1]).toMatchObject(validMealPayload.ingredients[1]);
      expect(response.body.data.ingredients[2]).toMatchObject(validMealPayload.ingredients[2]);
      expect(response.body.data.ingredients[3]).toMatchObject(validMealPayload.ingredients[3]);
      expect(response.body.data.instructions).toEqual(validMealPayload.instructions);
      expect(response.body.data.nutrition).toEqual(validMealPayload.nutrition);
      expect(response.body.data.servingSizeGrams).toBe(validMealPayload.servingSizeGrams);
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existent meal ID', async () => {
      const response = await request(app)
        .get('/api/meals/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Meal not found');
    });

    it('should return 400 for invalid meal ID format', async () => {
      const response = await request(app)
        .get('/api/meals/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid meal ID');
    });
  });

  describe('PUT /api/meals/:id', () => {
    let updateMealId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(validMealPayload);
      updateMealId = response.body.data._id;
    });

    it('should update meal successfully', async () => {
      const updatePayload = {
        name: 'Updated Chicken Salad',
        description: 'Updated description for the chicken salad',
        nutrition: {
          calories: 460,
          protein: 36,
          carbs: 22,
          fat: 19
        }
      };

      const response = await request(app)
        .put(`/api/meals/${updateMealId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Meal updated successfully');
      expect(response.body.data.name).toBe(updatePayload.name);
      expect(response.body.data.description).toBe(updatePayload.description);
      expect(response.body.data.nutrition).toEqual(updatePayload.nutrition);
    });

    it('should update meal without authentication', async () => {
      const response = await request(app)
        .put(`/api/meals/${updateMealId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 when updating non-existent meal', async () => {
      const response = await request(app)
        .put('/api/meals/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject update with invalid data', async () => {
      const response = await request(app)
        .put(`/api/meals/${updateMealId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'A' }); // Too short

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/meals/:id', () => {
    let deleteMealId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(validMealPayload);
      deleteMealId = response.body.data._id;
    });

    it('should delete meal successfully', async () => {
      const response = await request(app)
        .delete(`/api/meals/${deleteMealId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Meal deleted successfully');
    });

    it('should delete meal without authentication', async () => {
      const response = await request(app)
        .delete(`/api/meals/${deleteMealId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent meal', async () => {
      const response = await request(app)
        .delete('/api/meals/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid meal ID format', async () => {
      const response = await request(app)
        .delete('/api/meals/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/meals/search', () => {
    let searchMealId;

    beforeEach(async () => {
      // Create a specific meal for search testing
      const searchMeal = {
        ...validMealPayload,
        name: 'Special Beef Burger'
      };
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(searchMeal);
      searchMealId = response.body.data._id;
    });

    it('should search meals by name successfully', async () => {
      const response = await request(app)
        .get('/api/meals/search?q=beef');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Should find the beef burger
      const foundMeal = response.body.data.find(meal => meal._id === searchMealId);
      expect(foundMeal).toBeDefined();
      expect(foundMeal.name).toBe('Special Beef Burger');
    });

    it('should return empty results for non-matching search', async () => {
      const response = await request(app)
        .get('/api/meals/search?q=nonexistent');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/meals/search?q=BEEF');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should return 400 when query parameter is missing', async () => {
      const response = await request(app)
        .get('/api/meals/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Query parameter \'q\' is required');
    });

    it('should return summary format for search results', async () => {
      const response = await request(app)
        .get('/api/meals/search?q=beef');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      if (response.body.data.length > 0) {
        const meal = response.body.data[0];
        expect(meal._id).toBeDefined();
        expect(meal.name).toBeDefined();
        expect(meal.image).toBeDefined();
        expect(meal.nutrition).toBeDefined();
        expect(meal.nutrition.calories).toBeDefined();
        // Should not include full details
        expect(meal.description).toBeUndefined();
        expect(meal.ingredients).toBeUndefined();
        expect(meal.instructions).toBeUndefined();
      }
    });
  });

  describe('Multiple meal operations', () => {
    it('should handle multiple meal CRUD operations', async () => {
      // Create multiple meals
      const meals = [];
      for (let i = 0; i < 3; i++) {
        const mealData = {
          ...validMealPayload,
          name: `Test Meal ${i + 1}`,
          description: `Description for test meal ${i + 1}`
        };
        const response = await request(app)
          .post('/api/meals')
          .set('Authorization', `Bearer ${token}`)
          .send(mealData);
        meals.push(response.body.data);
      }

      // Get all meals
      const getAllResponse = await request(app)
        .get('/api/meals');

      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.count).toBeGreaterThanOrEqual(3);

      // Update first meal
      const updateResponse = await request(app)
        .put(`/api/meals/${meals[0]._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Test Meal 1' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.name).toBe('Updated Test Meal 1');

      // Delete second meal
      const deleteResponse = await request(app)
        .delete(`/api/meals/${meals[1]._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(200);

      // Search for remaining meals
      const searchResponse = await request(app)
        .get('/api/meals/search?q=Test');

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.count).toBeGreaterThanOrEqual(2);
    });
  });
});
