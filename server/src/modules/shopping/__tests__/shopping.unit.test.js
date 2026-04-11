// server/src/modules/shopping/__tests__/shopping.unit.test.js

const ShoppingList = require('../shopping.model');
const {
  createShoppingList,
  getShoppingLists,
  getShoppingList,
  deleteShoppingList
} = require('../shopping.controller');

jest.mock('../shopping.model');

function mockReq(body = {}, params = {}, user = { id: 'user_001' }) {
  return { body, params, user };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Shopping Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShoppingList — ingredient sanitization', () => {
    test('uses direct ingredients array when provided', async () => {
      const req = mockReq({
        name: 'Test',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockResolvedValue({
        _id: 'list_001',
        name: 'Test',
        ingredients: []
      });

      await createShoppingList(req, res);

      expect(ShoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: expect.arrayContaining([
            expect.objectContaining({ name: 'Tomato', quantity: 2, unit: 'kg' })
          ])
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('sanitizes invalid unit to "pcs"', async () => {
      const req = mockReq({
        name: 'Test',
        ingredients: [{ name: 'Salt', quantity: 1, unit: 'invalid_unit' }]
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockResolvedValue({
        _id: 'list_001',
        name: 'Test',
        ingredients: []
      });

      await createShoppingList(req, res);

      expect(ShoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: expect.arrayContaining([
            expect.objectContaining({ unit: 'pcs' })
          ])
        })
      );
    });

    test('parses quantity as float and defaults to 1 if invalid', async () => {
      const req = mockReq({
        name: 'Test',
        ingredients: [{ name: 'Oil', quantity: 'bad', unit: 'ml' }]
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockResolvedValue({
        _id: 'list_001',
        name: 'Test',
        ingredients: []
      });

      await createShoppingList(req, res);

      expect(ShoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: expect.arrayContaining([
            expect.objectContaining({ quantity: 1 })
          ])
        })
      );
    });

    test('consolidates ingredients from recipes when no direct ingredients provided', async () => {
      const req = mockReq({
        name: 'Test',
        recipes: [{
          name: 'Curry',
          ingredients: [
            { name: 'Tomato', quantity: 1, unit: 'kg' },
            { name: 'Tomato', quantity: 2, unit: 'kg' }
          ]
        }]
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockResolvedValue({
        _id: 'list_001',
        name: 'Test',
        ingredients: []
      });

      await createShoppingList(req, res);

      expect(ShoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: expect.arrayContaining([
            expect.objectContaining({ name: 'Tomato', quantity: 3, unit: 'kg' })
          ])
        })
      );
    });

    test('returns empty ingredients when recipes is empty array', async () => {
      const req = mockReq({
        name: 'Test',
        recipes: []
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockResolvedValue({
        _id: 'list_001',
        name: 'Test',
        ingredients: []
      });

      await createShoppingList(req, res);

      expect(ShoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: []
        })
      );
    });

    test('returns 500 when ShoppingList.create throws', async () => {
      const req = mockReq({
        name: 'Test',
        ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg' }]
      });
      const res = mockRes();

      ShoppingList.create = jest.fn().mockRejectedValue(new Error('DB error'));

      await createShoppingList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Failed to create shopping list' })
      );
    });
  });

  describe('getShoppingLists', () => {
    test('returns all active lists for user sorted by createdAt', async () => {
      const req = mockReq();
      const res = mockRes();

      const mockSort = jest.fn().mockResolvedValue([{ name: 'List A' }]);
      ShoppingList.find = jest.fn().mockReturnValue({ sort: mockSort });

      await getShoppingLists(req, res);

      expect(res.json).toHaveBeenCalledWith([{ name: 'List A' }]);
    });

    test('returns 500 when find throws', async () => {
      const req = mockReq();
      const res = mockRes();

      ShoppingList.find = jest.fn().mockImplementation(() => {
        throw new Error('DB error');
      });

      await getShoppingLists(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Failed to get shopping lists' })
      );
    });
  });

  describe('getShoppingList', () => {
    test('returns 404 when shopping list not found', async () => {
      const req = mockReq({}, { id: 'list_999' });
      const res = mockRes();

      ShoppingList.findOne = jest.fn().mockResolvedValue(null);

      await getShoppingList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Shopping list not found' })
      );
    });

    test('returns shopping list when found', async () => {
      const req = mockReq({}, { id: 'list_001' });
      const res = mockRes();

      ShoppingList.findOne = jest.fn().mockResolvedValue({ name: 'My List' });

      await getShoppingList(req, res);

      expect(res.json).toHaveBeenCalledWith({ name: 'My List' });
    });
  });

  describe('deleteShoppingList', () => {
    test('soft deletes by setting isActive false', async () => {
      const req = mockReq({}, { id: 'list_001' });
      const res = mockRes();

      ShoppingList.findOneAndUpdate = jest.fn().mockResolvedValue({
        name: 'List',
        isActive: false
      });

      await deleteShoppingList(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Shopping list deleted successfully' })
      );
    });

    test('returns 404 when list not found for deletion', async () => {
      const req = mockReq({}, { id: 'list_999' });
      const res = mockRes();

      ShoppingList.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await deleteShoppingList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
