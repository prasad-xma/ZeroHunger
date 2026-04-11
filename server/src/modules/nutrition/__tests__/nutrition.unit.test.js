// server/src/modules/nutrition/__tests__/nutrition.unit.test.js

const {
  calculateBMR,
  calculateTargetsAndRanges,
} = require("../nutrition.service");

describe("Nutrition Service Unit Tests", () => {
  describe("calculateBMR", () => {
    test("should calculate male BMR correctly", () => {
      const result = calculateBMR({
        gender: "male",
        heightCm: 175,
        weightKg: 70,
        age: 25,
      });

      expect(result).toBe(1673.75);
    });

    test("should calculate female BMR correctly", () => {
      const result = calculateBMR({
        gender: "female",
        heightCm: 160,
        weightKg: 55,
        age: 24,
      });

      expect(result).toBe(1269);
    });
  });

  describe("calculateTargetsAndRanges", () => {
    test("should return complete target calculation result", () => {
      const result = calculateTargetsAndRanges({
        age: 25,
        gender: "male",
        heightCm: 175,
        weightKg: 70,
        activityLevel: "moderate",
        goal: "maintain",
      });

      expect(result).toHaveProperty("bmr");
      expect(result).toHaveProperty("tdeeCalories");
      expect(result).toHaveProperty("proteinG");
      expect(result).toHaveProperty("carbsG");
      expect(result).toHaveProperty("fatG");
      expect(result).toHaveProperty("sugarLimitG");
      expect(result).toHaveProperty("satFatLimitG");
      expect(result).toHaveProperty("proteinMinG");
      expect(result).toHaveProperty("proteinMaxG");
      expect(result).toHaveProperty("carbsMinG");
      expect(result).toHaveProperty("carbsMaxG");
      expect(result).toHaveProperty("fatMinG");
      expect(result).toHaveProperty("fatMaxG");
      expect(result).toHaveProperty("assumptions");

      expect(result.tdeeCalories).toBeGreaterThan(0);
      expect(result.proteinG).toBeGreaterThan(0);
      expect(result.carbsG).toBeGreaterThanOrEqual(0);
      expect(result.fatG).toBeGreaterThan(0);
    });

    test("should calculate protein target as 2.0g per kg", () => {
      const result = calculateTargetsAndRanges({
        age: 30,
        gender: "male",
        heightCm: 180,
        weightKg: 80,
        activityLevel: "light",
        goal: "maintain",
      });

      expect(result.proteinG).toBe(160);
    });

    test("should return higher calories for gain compared to lose", () => {
      const lose = calculateTargetsAndRanges({
        age: 28,
        gender: "female",
        heightCm: 165,
        weightKg: 60,
        activityLevel: "moderate",
        goal: "lose",
      });

      const gain = calculateTargetsAndRanges({
        age: 28,
        gender: "female",
        heightCm: 165,
        weightKg: 60,
        activityLevel: "moderate",
        goal: "gain",
      });

      expect(gain.tdeeCalories).toBeGreaterThan(lose.tdeeCalories);
    });
  });
});