import { jest } from '@jest/globals';

// Mock the Progress model
jest.mock('../progress.model', () => ({
  findByIdAndDelete: jest.fn()
}));

const { PredictionService } = require('../prediction.service.improved');
const Progress = require('../progress.model');

// UNIT TESTING - Testing prediction service functions in isolation
describe('Prediction Service - Unit Tests', () => {
  let predictionService;

  beforeEach(() => {
    predictionService = new PredictionService();
    jest.clearAllMocks();
  });

  // Test: Weight prediction function
  describe('predictMonthlyWeight', () => {
    it('should return null for insufficient data', () => {
      const history = [{ weight: 80 }]; // Only 1 entry
      
      const result = predictionService.predictMonthlyWeight(history);
      
      expect(result).toBeNull();
    });

    it('should predict weight loss within safe limits', () => {
      const history = [
        { weight: 80 }, // Week 1
        { weight: 79 }  // Week 2 (1kg loss)
      ];
      
      const result = predictionService.predictMonthlyWeight(history);
      
      // Should predict 4kg loss (1kg/week * 4 weeks)
      expect(parseFloat(result)).toBeCloseTo(75, 1);
    });

    it('should cap excessive weight loss', () => {
      const history = [
        { weight: 80 },
        { weight: 77 }  // 3kg loss (excessive)
      ];
      
      const result = predictionService.predictMonthlyWeight(history);
      
      // Should cap to safe limit (1kg/week * 4 weeks = 4kg max loss)
      // Starting from 77kg, predicted = 77 - 4 = 73kg
      expect(parseFloat(result)).toBeCloseTo(73, 1);
    });

    it('should cap excessive weight gain', () => {
      const history = [
        { weight: 70 },
        { weight: 72 }  // 2kg gain (excessive)
      ];
      
      const result = predictionService.predictMonthlyWeight(history);
      
      // Should cap to safe limit (0.5kg/week * 4 weeks = 2kg max gain)
      // Starting from 72kg, predicted = 72 + 2 = 74kg
      expect(parseFloat(result)).toBeCloseTo(74, 1);
    });

    it('should enforce minimum healthy weight', () => {
      const history = [
        { weight: 42 },
        { weight: 41 }  // Below minimum
      ];
      
      const result = predictionService.predictMonthlyWeight(history);
      
      // Should not go below 40kg
      expect(parseFloat(result)).toBeGreaterThanOrEqual(40);
    });

    it('should enforce maximum healthy weight', () => {
      const history = [
        { weight: 195 },
        { weight: 198 }  // Above maximum
      ];
      
      const result = predictionService.predictMonthlyWeight(history);
      
      // Should not exceed 200kg
      expect(parseFloat(result)).toBeLessThanOrEqual(200);
    });
  });

  // Test: Delete progress function
  describe('deleteProgress', () => {
    it('should delete progress entry successfully', async () => {
      const mockProgress = { _id: '123', weight: 75 };
      Progress.findByIdAndDelete = jest.fn().mockResolvedValue(mockProgress);

      const result = await predictionService.deleteProgress('123');
      
      expect(result._id).toBe('123');
      expect(Progress.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('should throw error for non-existent progress', async () => {
      Progress.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(predictionService.deleteProgress('999'))
        .rejects.toThrow('Progress record not found');
    });
  });
});
