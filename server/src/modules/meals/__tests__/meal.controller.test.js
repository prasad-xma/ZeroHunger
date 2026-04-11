import { jest } from '@jest/globals';

jest.mock('../meal.model', () => {
    return function() {
        this.save = jest.fn().mockResolvedValue({ _id: '1', name: 'Test Meal' });
    };
});

const mockMealFind = jest.fn();
const mockMealFindById = jest.fn();
const mockMealFindByIdAndUpdate = jest.fn();
const mockMealFindByIdAndDelete = jest.fn();
const mockMealCreate = jest.fn();

const Meal = require('../meal.model');
Meal.find = mockMealFind;
Meal.findById = mockMealFindById;
Meal.findByIdAndUpdate = mockMealFindByIdAndUpdate;
Meal.findByIdAndDelete = mockMealFindByIdAndDelete;
Meal.create = mockMealCreate;

const { 
    getAllMeals, 
    getMeal, 
    createMeal, 
    updateMeal, 
    deleteMeal, 
    searchMeals 
} = require('../meal.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("Meal Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMeals", () => {
    test("should return all meals successfully", async () => {
      const mockMeals = [
        { _id: '1', name: 'Chicken Salad', nutrition: { calories: 400 } },
        { _id: '2', name: 'Protein Shake', nutrition: { calories: 220 } }
      ];
      mockMealFind.mockResolvedValue(mockMeals);

      const req = {};
      const res = mockResponse();

      await getAllMeals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: [
          { _id: '1', name: 'Chicken Salad', nutrition: { calories: 400 } },
          { _id: '2', name: 'Protein Shake', nutrition: { calories: 220 } }
        ]
      });
    });

    test("should handle server error", async () => {
      mockMealFind.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = mockResponse();

      await getAllMeals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });

  describe("getMeal", () => {
    test("should return meal by ID successfully", async () => {
      const mockMeal = {
        _id: '1',
        name: 'Chicken Salad',
        image: '/assets/meals/chicken.jpg',
        description: 'Healthy chicken salad',
        ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
        instructions: ['Mix ingredients'],
        nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
        servingSizeGrams: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockMealFindById.mockResolvedValue(mockMeal);

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await getMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMeal
      });
    });

    test("should return 400 if ID is missing", async () => {
      const req = { params: {} };
      const res = mockResponse();

      await getMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal ID is required",
        errors: []
      });
    });

    test("should return 404 if meal not found", async () => {
      mockMealFindById.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await getMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal not found",
        errors: []
      });
    });

    test("should return 400 for invalid ID format", async () => {
      const error = new Error("CastError");
      error.name = "CastError";
      mockMealFindById.mockRejectedValue(error);

      const req = { params: { id: 'invalid' } };
      const res = mockResponse();

      await getMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid meal ID",
        errors: []
      });
    });

    test("should handle server error", async () => {
      mockMealFindById.mockRejectedValue(new Error("Database error"));

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await getMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });

  describe("createMeal", () => {
    test("should create meal successfully", async () => {
      const mockMeal = {
        _id: '1',
        name: 'Chicken Salad',
        image: '/assets/meals/chicken.jpg',
        description: 'Healthy chicken salad',
        ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
        instructions: ['Mix ingredients'],
        nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
        servingSizeGrams: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockMealCreate.mockResolvedValue(mockMeal);

      const req = {
        body: {
          name: 'Chicken Salad',
          image: '/assets/meals/chicken.jpg',
          description: 'Healthy chicken salad',
          ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
          instructions: ['Mix ingredients'],
          nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
          servingSizeGrams: 300
        }
      };
      const res = mockResponse();

      await createMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Meal created successfully",
        data: mockMeal
      });
    });

    test("should return 400 for validation errors", async () => {
      const req = {
        body: {
          name: 'A', // Too short
          image: '/assets/meals/chicken.jpg',
          description: 'Short', // Too short
          ingredients: [], // Empty array
          instructions: [], // Empty array
          nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
          servingSizeGrams: 300
        }
      };
      const res = mockResponse();

      await createMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: expect.any(Array)
      });
    });

    test("should handle mongoose validation error", async () => {
      const error = new Error("ValidationError");
      error.name = "ValidationError";
      error.errors = {
        name: { message: "Name is required" },
        description: { message: "Description is required" }
      };
      mockMealCreate.mockRejectedValue(error);

      const req = {
        body: {
          name: 'Chicken Salad',
          image: '/assets/meals/chicken.jpg',
          description: 'Healthy chicken salad',
          ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
          instructions: ['Mix ingredients'],
          nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
          servingSizeGrams: 300
        }
      };
      const res = mockResponse();

      await createMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Name is required", "Description is required"]
      });
    });

    test("should handle server error", async () => {
      mockMealCreate.mockRejectedValue(new Error("Database error"));

      const req = {
        body: {
          name: 'Chicken Salad',
          image: '/assets/meals/chicken.jpg',
          description: 'Healthy chicken salad',
          ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
          instructions: ['Mix ingredients'],
          nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
          servingSizeGrams: 300
        }
      };
      const res = mockResponse();

      await createMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });

  describe("updateMeal", () => {
    test("should update meal successfully", async () => {
      const mockUpdatedMeal = {
        _id: '1',
        name: 'Updated Chicken Salad',
        image: '/assets/meals/chicken.jpg',
        description: 'Updated healthy chicken salad',
        ingredients: [{ name: 'Chicken', quantity: '200g', calories: 250 }],
        instructions: ['Mix ingredients'],
        nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
        servingSizeGrams: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockMealFindByIdAndUpdate.mockResolvedValue(mockUpdatedMeal);

      const req = {
        params: { id: '1' },
        body: {
          name: 'Updated Chicken Salad',
          description: 'Updated healthy chicken salad'
        }
      };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Meal updated successfully",
        data: mockUpdatedMeal
      });
    });

    test("should return 400 if ID is missing", async () => {
      const req = { params: {} };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal ID is required",
        errors: []
      });
    });

    test("should return 400 for validation errors", async () => {
      const req = {
        params: { id: '1' },
        body: {
          name: 'A' // Too short
        }
      };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: expect.any(Array)
      });
    });

    test("should return 404 if meal not found", async () => {
      mockMealFindByIdAndUpdate.mockResolvedValue(null);

      const req = {
        params: { id: '1' },
        body: { name: 'Updated Chicken Salad' }
      };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal not found",
        errors: []
      });
    });

    test("should return 400 for invalid ID format", async () => {
      const error = new Error("CastError");
      error.name = "CastError";
      mockMealFindByIdAndUpdate.mockRejectedValue(error);

      const req = {
        params: { id: 'invalid' },
        body: { name: 'Updated Chicken Salad' }
      };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid meal ID",
        errors: []
      });
    });

    test("should handle server error", async () => {
      mockMealFindByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      const req = {
        params: { id: '1' },
        body: { name: 'Updated Chicken Salad' }
      };
      const res = mockResponse();

      await updateMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });

  describe("deleteMeal", () => {
    test("should delete meal successfully", async () => {
      const mockDeletedMeal = {
        _id: '1',
        name: 'Chicken Salad'
      };
      mockMealFindByIdAndDelete.mockResolvedValue(mockDeletedMeal);

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await deleteMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Meal deleted successfully"
      });
    });

    test("should return 400 if ID is missing", async () => {
      const req = { params: {} };
      const res = mockResponse();

      await deleteMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal ID is required",
        errors: []
      });
    });

    test("should return 404 if meal not found", async () => {
      mockMealFindByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await deleteMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Meal not found",
        errors: []
      });
    });

    test("should return 400 for invalid ID format", async () => {
      const error = new Error("CastError");
      error.name = "CastError";
      mockMealFindByIdAndDelete.mockRejectedValue(error);

      const req = { params: { id: 'invalid' } };
      const res = mockResponse();

      await deleteMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid meal ID",
        errors: []
      });
    });

    test("should handle server error", async () => {
      mockMealFindByIdAndDelete.mockRejectedValue(new Error("Database error"));

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await deleteMeal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });

  describe("searchMeals", () => {
    test("should search meals successfully", async () => {
      const mockMeals = [
        { _id: '1', name: 'Chicken Salad', nutrition: { calories: 400 } },
        { _id: '2', name: 'Chicken Soup', nutrition: { calories: 300 } }
      ];
      mockMealFind.mockResolvedValue(mockMeals);

      const req = { query: { q: 'chicken' } };
      const res = mockResponse();

      await searchMeals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: [
          { _id: '1', name: 'Chicken Salad', nutrition: { calories: 400 } },
          { _id: '2', name: 'Chicken Soup', nutrition: { calories: 300 } }
        ]
      });
    });

    test("should return 400 if query parameter is missing", async () => {
      const req = { query: {} };
      const res = mockResponse();

      await searchMeals(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Query parameter 'q' is required",
        errors: []
      });
    });

    test("should handle server error", async () => {
      mockMealFind.mockRejectedValue(new Error("Database error"));

      const req = { query: { q: 'chicken' } };
      const res = mockResponse();

      await searchMeals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
        errors: []
      });
    });
  });
});
