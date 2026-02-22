// server/src/modules/meals/meal.routes.js

const express = require("express");
const controller = require("./meal.controller");

const router = express.Router();

// Meals routes (no auth required for public access)
router.get("/", controller.getAllMeals);
router.get("/search", controller.searchMeals);
router.get("/:id", controller.getMeal);
router.post("/", controller.createMeal);
router.put("/:id", controller.updateMeal);
router.delete("/:id", controller.deleteMeal);

module.exports = router;
