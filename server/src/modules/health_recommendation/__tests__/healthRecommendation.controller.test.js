import { jest } from '@jest/globals';

jest.mock('../healthRecommendation.model', () => {
    return function() {
        this.save = jest.fn().mockResolvedValue({ _id: '1' });
    };
});
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();

const HealthRecommendation = require('../healthRecommendation.model');
HealthRecommendation.find = mockFind;
HealthRecommendation.findOne = mockFindOne;
HealthRecommendation.findOneAndUpdate = mockFindOneAndUpdate;
HealthRecommendation.findOneAndDelete = mockFindOneAndDelete;

jest.mock('../healthCalculations.utils', () => ({
  calculateAllHealthMetrics: jest.fn()
}));

const { calculateAllHealthMetrics } = require('../healthCalculations.utils');
const { createHealthProfile, getUserHealthProfiles, getHealthProfileById, updateRecommendations, deleteHealthProfile, updateHealthProfile, recalculateHealthMetrics } = require('../healthRecommendation.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("Health Recommendation Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createHealthProfile", () => {
    test("should create health profile successfully", async () => {
      calculateAllHealthMetrics.mockReturnValue({ calories: 2000 });

      const req = { user: { id: "1" }, body: { user_profile: {}, profile_name: "test" } };
      const res = mockResponse();

      await createHealthProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getUserHealthProfiles", () => {
    test("should get user health profiles", async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ _id: "1" }])
        })
      };
      mockFind.mockReturnValue(mockQuery);

      const req = { user: { id: "1" } };
      const res = mockResponse();

      await getUserHealthProfiles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getHealthProfileById", () => {
    test("should get health profile by ID", async () => {
      const mockQuery = { populate: jest.fn().mockResolvedValue({ _id: "1" }) };
      mockFindOne.mockReturnValue(mockQuery);

      const req = { user: { id: "1" }, params: { profileId: "1" } };
      const res = mockResponse();

      await getHealthProfileById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteHealthProfile", () => {
    test("should delete health profile", async () => {
      mockFindOneAndDelete.mockResolvedValue({ _id: "1" });

      const req = { user: { id: "1" }, params: { profileId: "1" } };
      const res = mockResponse();

      await deleteHealthProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateHealthProfile", () => {
      test("should update health profile", async () => {
        calculateAllHealthMetrics.mockReturnValue({ calories: 2200 });
        mockFindOne.mockResolvedValue({ recommendations: {} });
        mockFindOneAndUpdate.mockResolvedValue({ _id: "1" });

        const req = { user: { id: "1" }, params: { profileId: "1" }, body: { user_profile: {} } };
        const res = mockResponse();

        await updateHealthProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
      });
  });

  describe("updateRecommendations", () => {
      test("should update health recommendations", async () => {
        mockFindOneAndUpdate.mockResolvedValue({ _id: "1" });

        const req = { user: { id: "1" }, params: { profileId: "1" }, body: { recommendations: {} } };
        const res = mockResponse();

        await updateRecommendations(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
      });
  });

  describe("recalculateHealthMetrics", () => {
    test("should recalculate metrics", async () => {
      mockFindOne.mockResolvedValue({ user_profile: {}, recommendations: {} });
      calculateAllHealthMetrics.mockReturnValue({ calories: 2000 });
      mockFindOneAndUpdate.mockResolvedValue({ _id: "1" });

      const req = { user: { id: "1" }, params: { profileId: "1" } };
      const res = mockResponse();

      await recalculateHealthMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
