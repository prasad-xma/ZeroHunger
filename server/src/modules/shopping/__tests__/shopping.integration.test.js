// server/src/modules/shopping/__tests__/shopping.integration.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');

const shoppingRoutes = require('../shopping.routes');
const ShoppingList = require('../shopping.model');

// Mock auth middleware so tests stay isolated to shopping module
jest.mock('../../../middlewares/auth.middleware', () => {
  const mockMongoose = require('mongoose');
  const mockUserId = new mockMongoose.Types.ObjectId();
  return {
    protect: (req, res, next) => {
      req.user = { id: mockUserId.toString() };
      next();
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api/shopping', shoppingRoutes);

describe('Shopping Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    const mongoUri =
      process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping_test';

    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await ShoppingList.deleteMany({});
  });

  afterAll(async () => {
    await ShoppingList.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/shopping', () => {
    test('creates a shopping list with direct ingredients and returns 201', async () => {
      const res = await request(app).post('/api/shopping').send({
        name: 'Weekly List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Shopping list created successfully');
      expect(res.body.shoppingList.ingredients[0].name).toBe('Tomato');
    });

    test('sanitizes invalid unit to "pcs" on creation', async () => {
      const res = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Salt', quantity: 1, unit: 'bad_unit' }]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.shoppingList.ingredients[0].unit).toBe('pcs');
    });

    test('creates shopping list from recipes and consolidates duplicate ingredients', async () => {
      const res = await request(app).post('/api/shopping').send({
        name: 'Recipe List',
        recipes: [{
          name: 'Curry',
          ingredients: [
            { name: 'Garlic', quantity: 2, unit: 'pcs' },
            { name: 'Garlic', quantity: 3, unit: 'pcs' }
          ]
        }]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.shoppingList.ingredients).toHaveLength(1);
      expect(res.body.shoppingList.ingredients[0].name).toBe('Garlic');
      expect(res.body.shoppingList.ingredients[0].quantity).toBe(5);
    });

    test('generates low_stock alert when no kitchenStock provided', async () => {
      const res = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.shoppingList.alerts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'low_stock' })
        ])
      );
    });

    test('returns 500 if name is missing', async () => {
      const res = await request(app).post('/api/shopping').send({
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /api/shopping', () => {
    test('returns all active shopping lists for the user', async () => {
      await request(app).post('/api/shopping').send({
        name: 'List A',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      await request(app).post('/api/shopping').send({
        name: 'List B',
        ingredients: [{ name: 'Onion', quantity: 1, unit: 'pcs' }]
      });

      const res = await request(app).get('/api/shopping');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    test('does not return soft-deleted lists', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      await request(app).delete(`/api/shopping/${createRes.body.shoppingList._id}`);

      const res = await request(app).get('/api/shopping');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/shopping/:id', () => {
    test('returns a single shopping list by id', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'My List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      const res = await request(app).get(`/api/shopping/${createRes.body.shoppingList._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('My List');
    });

    test('returns 404 for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/shopping/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Shopping list not found');
    });
  });

  describe('PATCH /api/shopping/ingredient/:ingredientId', () => {
    test('updates an ingredient\'s name, quantity, and unit', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      const ingredientId = createRes.body.shoppingList.ingredients[0]._id;

      const res = await request(app).patch(`/api/shopping/ingredient/${ingredientId}`).send({
        name: 'Cherry Tomato',
        quantity: 5,
        unit: 'pcs'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Ingredient updated successfully');
      expect(res.body.shoppingList.ingredients[0].name).toBe('Cherry Tomato');
      expect(res.body.shoppingList.ingredients[0].quantity).toBe(5);
    });

    test('returns 404 when ingredient id does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).patch(`/api/shopping/ingredient/${fakeId}`).send({
        name: 'Test',
        quantity: 1,
        unit: 'kg'
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Ingredient not found');
    });
  });

  describe('DELETE /api/shopping/ingredient/:ingredientId', () => {
    test('removes a specific ingredient from the shopping list', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [
          { name: 'Tomato', quantity: 2, unit: 'kg' },
          { name: 'Onion', quantity: 1, unit: 'pcs' }
        ]
      });

      const ingredientId = createRes.body.shoppingList.ingredients[0]._id;

      await request(app).delete(`/api/shopping/ingredient/${ingredientId}`);

      const getRes = await request(app).get(`/api/shopping/${createRes.body.shoppingList._id}`);

      expect(getRes.body.ingredients).toHaveLength(1);
    });

    test('returns 404 when ingredient id does not exist for deletion', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/shopping/ingredient/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Ingredient not found');
    });
  });

  describe('PATCH /api/shopping/:id/ingredient (update purchased status)', () => {
    test('marks an ingredient as purchased', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      const ingredientId = createRes.body.shoppingList.ingredients[0]._id;

      const res = await request(app).patch(`/api/shopping/${createRes.body.shoppingList._id}/ingredient`).send({
        ingredientId,
        purchased: true
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.shoppingList.ingredients[0].purchased).toBe(true);
    });
  });

  describe('GET /api/shopping/:id/pdf', () => {
    test('returns pdf data with correct shape', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [
          { name: 'Tomato', quantity: 2, unit: 'kg', purchased: true },
          { name: 'Onion', quantity: 1, unit: 'pcs', purchased: false }
        ]
      });

      const res = await request(app).get(`/api/shopping/${createRes.body.shoppingList._id}/pdf`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pdfData).toHaveProperty('name');
      expect(res.body.pdfData.totalItems).toBe(2);
      expect(res.body.pdfData.purchasedItems).toBe(1);
      expect(res.body.pdfData.ingredients).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ purchased: '✓' }),
          expect.objectContaining({ purchased: '○' })
        ])
      );
    });
  });

  describe('DELETE /api/shopping/:id', () => {
    test('soft deletes the shopping list', async () => {
      const createRes = await request(app).post('/api/shopping').send({
        name: 'Test List',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });

      await request(app).delete(`/api/shopping/${createRes.body.shoppingList._id}`);

      const res = await request(app).get('/api/shopping');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    test('returns 404 when deleting non-existent list', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/shopping/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Shopping list not found');
    });
  });
});
