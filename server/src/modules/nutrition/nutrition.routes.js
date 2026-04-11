// server/src/modules/nutrition/nutrition.routes.js

const express = require("express");
const { protect } = require("../../middlewares/auth.middleware");

const controller = require("./nutrition.controller");

const router = express.Router();

// All routes protected (JWT)
router.use(protect);

// Targets
router.post("/targets/calculate", controller.calculateTargets);
router.post("/targets", controller.saveTargets);
router.get("/targets/me", controller.getMyTargets);
router.put("/targets/me", controller.updateMyTargets);
router.delete("/targets/me", controller.deleteMyLatestTargets);

// Intake
router.post("/intake", controller.upsertIntake);
router.get("/intake/daily", controller.getDailyIntake);

// Summary
router.get("/summary/weekly", controller.getWeeklySummary);
router.get("/summary/today", controller.getTodayNutritionSummary);

// Foods
router.get("/foods/search", controller.searchFoods);
router.post("/foods/calculate", controller.calculateFood);

module.exports = router;