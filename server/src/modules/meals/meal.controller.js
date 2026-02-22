// server/src/modules/meals/meal.controller.js

const Meal = require("./meal.model");
const { validateMealInput, validateMealUpdateInput } = require("./meal.validators");

function sendError(res, status, message, errors = []) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

function mapMealSummary(doc) {
  return {
    _id: doc._id,
    name: doc.name,
    image: doc.image,
    nutrition: {
      calories: doc.nutrition.calories,
    },
  };
}

function mapMealFull(doc) {
  return {
    _id: doc._id,
    name: doc.name,
    image: doc.image,
    description: doc.description,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    nutrition: doc.nutrition,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * GET /api/meals
 * Get all meals (summary for gallery)
 */
async function getAllMeals(req, res) {
  try {
    const meals = await Meal.find({});
    const data = meals.map(mapMealSummary);
    return res.status(200).json({
      success: true,
      count: meals.length,
      data,
    });
  } catch (err) {
    console.error("getAllMeals error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/meals/:id
 * Get single meal by ID (full details)
 */
async function getMeal(req, res) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, "Meal ID is required");

    const meal = await Meal.findById(id);
    if (!meal) return sendError(res, 404, "Meal not found");

    return res.status(200).json({
      success: true,
      data: mapMealFull(meal),
    });
  } catch (err) {
    console.error("getMeal error:", err);
    if (err.name === "CastError") return sendError(res, 400, "Invalid meal ID");
    return sendError(res, 500, "Server error");
  }
}

/**
 * POST /api/meals
 * Create a new meal
 */
async function createMeal(req, res) {
  try {
    const { ok, errors, value } = validateMealInput(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const newMeal = await Meal.create(value);
    return res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: mapMealFull(newMeal),
    });
  } catch (err) {
    console.error("createMeal error:", err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return sendError(res, 400, "Validation failed", errors);
    }
    return sendError(res, 500, "Server error");
  }
}

/**
 * PUT /api/meals/:id
 * Update a meal by ID
 */
async function updateMeal(req, res) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, "Meal ID is required");

    const { ok, errors, value } = validateMealUpdateInput(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const updatedMeal = await Meal.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    });
    if (!updatedMeal) return sendError(res, 404, "Meal not found");

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: mapMealFull(updatedMeal),
    });
  } catch (err) {
    console.error("updateMeal error:", err);
    if (err.name === "CastError") return sendError(res, 400, "Invalid meal ID");
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return sendError(res, 400, "Validation failed", errors);
    }
    return sendError(res, 500, "Server error");
  }
}

/**
 * DELETE /api/meals/:id
 * Delete a meal by ID
 */
async function deleteMeal(req, res) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, "Meal ID is required");

    const deletedMeal = await Meal.findByIdAndDelete(id);
    if (!deletedMeal) return sendError(res, 404, "Meal not found");

    return res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (err) {
    console.error("deleteMeal error:", err);
    if (err.name === "CastError") return sendError(res, 400, "Invalid meal ID");
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/meals/search?q=value
 * Search meals by name
 */
async function searchMeals(req, res) {
  try {
    const { q } = req.query;
    if (!q) return sendError(res, 400, "Query parameter 'q' is required");

    const meals = await Meal.find({
      name: { $regex: q, $options: "i" }, // case-insensitive search
    });
    const data = meals.map(mapMealSummary);
    return res.status(200).json({
      success: true,
      count: meals.length,
      data,
    });
  } catch (err) {
    console.error("searchMeals error:", err);
    return sendError(res, 500, "Server error");
  }
}

module.exports = {
  getAllMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  searchMeals,
};
