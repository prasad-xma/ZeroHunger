// server/src/modules/nutrition/__tests__/nutrition.integration.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");

const nutritionRoutes = require("../nutrition.routes");
const NutritionTarget = require("../nutrition.target.model");
const NutritionIntake = require("../nutrition.intake.model");

// Mock auth middleware so tests stay isolated to nutrition module
jest.mock("../../../middlewares/auth.middleware", () => {
  const mongoose = require("mongoose");
  const mockUserId = new mongoose.Types.ObjectId();
  return {
    protect: (req, res, next) => {
      req.user = { _id: mockUserId };
      next();
    },
  };
});

const app = express();
app.use(express.json());
app.use("/api/nutrition", nutritionRoutes);

let mongoServer;

describe("Nutrition Integration Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
  }, 30000);

  beforeEach(async () => {
    await NutritionTarget.deleteMany({});
    await NutritionIntake.deleteMany({});
  });

  afterAll(async () => {
    await NutritionTarget.deleteMany({});
    await NutritionIntake.deleteMany({});
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  test("POST /api/nutrition/targets should save nutrition targets", async () => {
    const res = await request(app).post("/api/nutrition/targets").send({
      age: 25,
      gender: "male",
      heightCm: 175,
      weightKg: 70,
      activityLevel: "moderate",
      goal: "maintain",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("results");
    expect(res.body.data.results).toHaveProperty("tdeeCalories");
  });

  test("POST /api/nutrition/intake should create daily intake", async () => {
    const res = await request(app).post("/api/nutrition/intake").send({
      calories: 300,
      proteinG: 20,
      carbsG: 25,
      fatG: 10,
      sugarG: 5,
      satFatG: 2,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.calories).toBe(300);
    expect(res.body.data.proteinG).toBe(20);
  });

  test("POST /api/nutrition/intake should increment existing same-day intake", async () => {
    await request(app).post("/api/nutrition/intake").send({
      calories: 200,
      proteinG: 10,
      carbsG: 20,
      fatG: 5,
      sugarG: 2,
      satFatG: 1,
    });

    const res = await request(app).post("/api/nutrition/intake").send({
      calories: 150,
      proteinG: 5,
      carbsG: 10,
      fatG: 3,
      sugarG: 1,
      satFatG: 1,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.calories).toBe(350);
    expect(res.body.data.proteinG).toBe(15);
    expect(res.body.data.carbsG).toBe(30);
    expect(res.body.data.fatG).toBe(8);
    expect(res.body.data.sugarG).toBe(3);
    expect(res.body.data.satFatG).toBe(2);
  });

  test("GET /api/nutrition/intake/daily should return today's intake", async () => {
    await request(app).post("/api/nutrition/intake").send({
      calories: 450,
      proteinG: 30,
      carbsG: 40,
      fatG: 12,
      sugarG: 6,
      satFatG: 3,
    });

    const res = await request(app).get("/api/nutrition/intake/daily");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.calories).toBe(450);
  });

  test("GET /api/nutrition/summary/weekly should return 7 days array", async () => {
    await request(app).post("/api/nutrition/intake").send({
      calories: 500,
      proteinG: 25,
      carbsG: 50,
      fatG: 15,
      sugarG: 8,
      satFatG: 4,
    });

    const res = await request(app).get("/api/nutrition/summary/weekly");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(7);
  });

  test("GET /api/nutrition/summary/today should return intake and percentages", async () => {
    await request(app).post("/api/nutrition/targets").send({
      age: 25,
      gender: "male",
      heightCm: 175,
      weightKg: 70,
      activityLevel: "moderate",
      goal: "maintain",
    });

    await request(app).post("/api/nutrition/intake").send({
      calories: 600,
      proteinG: 30,
      carbsG: 70,
      fatG: 20,
      sugarG: 10,
      satFatG: 5,
    });

    const res = await request(app).get("/api/nutrition/summary/today");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("intake");
    expect(res.body.data).toHaveProperty("targets");
    expect(res.body.data).toHaveProperty("percentages");
    expect(res.body.data.percentages).toHaveProperty("calories");
    expect(res.body.data.percentages).toHaveProperty("protein");
    expect(res.body.data.percentages).toHaveProperty("carbs");
    expect(res.body.data.percentages).toHaveProperty("fat");
  });
});