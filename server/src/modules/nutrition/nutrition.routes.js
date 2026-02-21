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

// Intake
router.post("/intake", controller.upsertIntake);
router.get("/intake/daily", controller.getDailyIntake);

// Weekly summary
router.get("/summary/weekly", controller.getWeeklySummary);

module.exports = router;
