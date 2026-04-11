import { jest } from '@jest/globals';

jest.mock('../healthAdvice.model', () => {
    return function() {
        this.save = jest.fn().mockResolvedValue({ _id: '1' });
    };
});
const mockAdviceFindOne = jest.fn();
const mockAdviceFind = jest.fn();
const mockAdviceUpdateMany = jest.fn();

const HealthAdvice = require('../healthAdvice.model');
HealthAdvice.findOne = mockAdviceFindOne;
HealthAdvice.find = mockAdviceFind;
HealthAdvice.updateMany = mockAdviceUpdateMany;

const mockRecFindOne = jest.fn();
const mockRecFindOneAndUpdate = jest.fn();

jest.mock('../../health_recommendation/healthRecommendation.model', () => {
    return {
        findOne: (...args) => mockRecFindOne(...args),
        findOneAndUpdate: (...args) => mockRecFindOneAndUpdate(...args)
    };
});

const HealthRecommendation = require('../../health_recommendation/healthRecommendation.model');
const { generateHealthAdvice, getHealthAdvice, getAllHealthAdvice, regenerateHealthAdvice } = require('../healthAdvice.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("Health Advice Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateHealthAdvice", () => {
    const mockProfile = { 
        user_profile: { goal: 'maintain', dietary_preference: 'vegan', activity_level: 'active', meal_frequency: 3 }, 
        recommendations: { daily_calories: 2000, macronutrients: {protein: 100, carbs: 100, fat: 100} } 
    };

    test("should return 404 if health profile not found", async () => {
      mockRecFindOne.mockResolvedValue(null);

      const req = { user: { id: "1" }, params: { healthProfileId: "1" } };
      const res = mockResponse();

      await generateHealthAdvice(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("should generate and return advice successfully", async () => {
      mockRecFindOne.mockResolvedValue(mockProfile);
      mockAdviceFindOne.mockResolvedValue(null);
      mockRecFindOneAndUpdate.mockResolvedValue(true);

      const req = { user: { id: "1" }, params: { healthProfileId: "1" } };
      const res = mockResponse();

      await generateHealthAdvice(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("should return existing advice if it already exists", async () => {
        mockRecFindOne.mockResolvedValue(mockProfile);
        mockAdviceFindOne.mockResolvedValue({ advice: {} });
        mockRecFindOneAndUpdate.mockResolvedValue(true);
  
        const req = { user: { id: "1" }, params: { healthProfileId: "1" } };
        const res = mockResponse();
  
        await generateHealthAdvice(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
      });
  });

  describe("getHealthAdvice", () => {
    test("should return advice", async () => {
      const mockQuery = { populate: jest.fn().mockResolvedValue({ advice: "test" }) };
      mockAdviceFindOne.mockReturnValue(mockQuery);

      const req = { user: { id: "1" }, params: { healthProfileId: "1" } };
      const res = mockResponse();

      await getHealthAdvice(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getAllHealthAdvice", () => {
    test("should return all advice", async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ advice: "test" }])
        })
      };
      mockAdviceFind.mockReturnValue(mockQuery);

      const req = { user: { id: "1" } };
      const res = mockResponse();

      await getAllHealthAdvice(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("regenerateHealthAdvice", () => {
    const mockProfile = { 
        user_profile: { goal: 'maintain', dietary_preference: 'vegan', activity_level: 'active', meal_frequency: 3 }, 
        recommendations: { daily_calories: 2000, macronutrients: {protein: 100, carbs: 100, fat: 100} } 
    };

    test("should regenerate advice successfully", async () => {
      mockRecFindOne.mockResolvedValue(mockProfile);
      mockAdviceUpdateMany.mockResolvedValue(true);
      mockRecFindOneAndUpdate.mockResolvedValue(true);

      const req = { user: { id: "1" }, params: { healthProfileId: "1" } };
      const res = mockResponse();

      await regenerateHealthAdvice(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
