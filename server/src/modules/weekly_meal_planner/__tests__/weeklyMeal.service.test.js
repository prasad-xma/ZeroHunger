import { jest } from '@jest/globals';

// Mock the WeeklyMeal model
jest.mock('../weeklyMeal.model', () => {
  return function() {
    this.save = jest.fn().mockResolvedValue({ _id: '123' });
  };
});

const WeeklyMeal = require('../weeklyMeal.model');
const { createWeeklyMeal, getWeeklyMealById, addFoodToMeal, completeMeal, deleteWeeklyMeal } = require('../weeklyMeal.service');

// UNIT TESTING - Testing individual service functions in isolation
describe('Weekly Meal Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test: Create meal plan function
  describe('createWeeklyMeal', () => {
    it('should create meal plan with valid data', async () => {
      const mockPlan = { userId: 'test', goal: 'Weight Loss', weekStartDate: '2024-01-01' };
      
      // Mock findOne to return null (no existing plan)
      WeeklyMeal.findOne = jest.fn().mockResolvedValue(null);
      
      const result = await createWeeklyMeal(mockPlan);
      
      expect(result._id).toBe('123');
      expect(WeeklyMeal.findOne).toHaveBeenCalledWith({ weekStartDate: mockPlan.weekStartDate });
    });

    it('should throw error for duplicate week', async () => {
      const mockPlan = { weekStartDate: '2024-01-01' };
      
      // Mock findOne to return existing plan
      WeeklyMeal.findOne = jest.fn().mockResolvedValue({ _id: 'existing' });
      
      await expect(createWeeklyMeal(mockPlan))
        .rejects.toThrow('Weekly plan already exists for this date');
    });
  });

  // Test: Get meal plan by ID
  describe('getWeeklyMealById', () => {
    it('should return meal plan by ID', async () => {
      const mockPlan = { _id: '123', userId: 'test' };
      WeeklyMeal.findById = jest.fn().mockResolvedValue(mockPlan);

      const result = await getWeeklyMealById('123');
      
      expect(result._id).toBe('123');
      expect(WeeklyMeal.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error for non-existent plan', async () => {
      WeeklyMeal.findById = jest.fn().mockResolvedValue(null);

      await expect(getWeeklyMealById('999'))
        .rejects.toThrow('Plan not found');
    });
  });

  // Test: Add food to meal
  describe('addFoodToMeal', () => {
    it('should add food to specific meal', async () => {
      const mockPlan = {
        days: [{ day: 'Monday', meals: { breakfast: { foods: [] } } }]
      };
      WeeklyMeal.findById = jest.fn().mockResolvedValue(mockPlan);
      mockPlan.save = jest.fn().mockResolvedValue(mockPlan);

      const result = await addFoodToMeal('123', 'Monday', 'breakfast', { name: 'Eggs' });
      
      expect(WeeklyMeal.findById).toHaveBeenCalledWith('123');
      expect(mockPlan.save).toHaveBeenCalled();
    });

    it('should throw error for invalid day', async () => {
      await expect(addFoodToMeal('123', 'InvalidDay', 'breakfast', {}))
        .rejects.toThrow('Invalid day');
    });

    it('should throw error for invalid meal type', async () => {
      await expect(addFoodToMeal('123', 'Monday', 'invalid', {}))
        .rejects.toThrow('Invalid meal type');
    });
  });

  // Test: Complete meal
  describe('completeMeal', () => {
    it('should mark meal as completed', async () => {
      const mockPlan = {
        days: [{ day: 'Monday', meals: { breakfast: { isCompleted: false } } }]
      };
      WeeklyMeal.findById = jest.fn().mockResolvedValue(mockPlan);
      mockPlan.save = jest.fn().mockResolvedValue(mockPlan);

      const result = await completeMeal('123', 'Monday', 'breakfast', true);
      
      expect(WeeklyMeal.findById).toHaveBeenCalledWith('123');
      expect(mockPlan.save).toHaveBeenCalled();
    });
  });

  // Test: Delete meal plan
  describe('deleteWeeklyMeal', () => {
    it('should delete meal plan successfully', async () => {
      const deletedPlan = { _id: '123' };
      WeeklyMeal.findByIdAndDelete = jest.fn().mockResolvedValue(deletedPlan);

      const result = await deleteWeeklyMeal('123');
      
      expect(result._id).toBe('123');
      expect(WeeklyMeal.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });
});
