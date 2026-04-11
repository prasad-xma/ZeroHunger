import { jest } from '@jest/globals';

jest.mock('../aiFoodAllergy.model', () => {
    return function() {
        this.save = jest.fn().mockResolvedValue({ _id: '1' });
    };
});
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();

const AiFoodAllergy = require('../aiFoodAllergy.model');
AiFoodAllergy.findOne = mockFindOne;
AiFoodAllergy.findOneAndUpdate = mockFindOneAndUpdate;
AiFoodAllergy.findOneAndDelete = mockFindOneAndDelete;

jest.mock('../googleAi.service', () => ({
  generateAllergyRecommendations: jest.fn()
}));

const { generateAllergyRecommendations } = require('../googleAi.service');
const { generateAiAllergyResponse, getUserAllergyProfile, updateAllergyProfile, deleteAllergyProfile } = require('../aiFoodAllergy.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("AI Food Allergy Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAiAllergyResponse", () => {
    test("should return 400 if allergies array is missing", async () => {
      const req = { user: { id: "1" }, body: { allergies: [] } };
      const res = mockResponse();

      await generateAiAllergyResponse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should generate new allergy recommendations", async () => {
      mockFindOne.mockResolvedValue(null);
      generateAllergyRecommendations.mockResolvedValue({ ai_response: "advice", metadata: {} });

      const req = { user: { id: "1" }, body: { allergies: ["peanuts"] } };
      const res = mockResponse();

      await generateAiAllergyResponse(req, res);

      expect(generateAllergyRecommendations).toHaveBeenCalledWith(["peanuts"]);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getUserAllergyProfile", () => {
    test("should return user allergy profile", async () => {
      const mockQuery = {
          populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue({ allergies: ["peanuts"] })
          })
      };
      mockFindOne.mockReturnValue(mockQuery);

      const req = { user: { id: "1" } };
      const res = mockResponse();

      await getUserAllergyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 404 if profile not found", async () => {
      const mockQuery = { populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(null) }) };
      mockFindOne.mockReturnValue(mockQuery);

      const req = { user: { id: "1" } };
      const res = mockResponse();

      await getUserAllergyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateAllergyProfile", () => {
    test("should update allergy profile", async () => {
      generateAllergyRecommendations.mockResolvedValue({ ai_response: "new advice", metadata: {} });
      mockFindOneAndUpdate.mockResolvedValue({ allergies: ["milk"] });

      const req = { user: { id: "1" }, body: { allergies: ["milk"] } };
      const res = mockResponse();

      await updateAllergyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteAllergyProfile", () => {
    test("should delete allergy profile successfully", async () => {
      mockFindOneAndDelete.mockResolvedValue({ _id: "profileId" });

      const req = { user: { id: "1" } };
      const res = mockResponse();

      await deleteAllergyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
