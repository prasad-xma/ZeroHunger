// server/src/modules/nutrition/nutrition.controller.js
const {
  validateTargetsInput,
  isISODateKey,
  validateFoodSearch,
  validateFoodCalculateBody,
} = require("./nutrition.validators");

const {
  calculateTargetsAndRanges,
  searchFoodsByQuery,
  calculateFoodNutrition,
  upsertDailyIntake,
  getDailyIntakeByDate,
  getWeeklyIntakeSummary,
  getTodaySummary,
} = require("./nutrition.service");

const NutritionTarget = require("./nutrition.target.model");

function sendError(res, status, message, errors = []) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

function mapTargetDoc(doc) {
  return {
    id: doc._id,
    userId: doc.userId,
    inputs: doc.inputs,
    results: doc.results,
    limits: doc.limits,
    ranges: doc.ranges,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapIntakeDoc(doc) {
  return {
    id: doc._id,
    userId: doc.userId,
    dateKey: doc.dateKey,
    calories: doc.calories,
    proteinG: doc.proteinG,
    carbsG: doc.carbsG,
    fatG: doc.fatG,
    sugarG: doc.sugarG,
    satFatG: doc.satFatG,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * POST /api/nutrition/targets/calculate
 * Protected (JWT)
 * No DB write
 */
async function calculateTargets(req, res) {
  try {
    const { ok, errors, value } = validateTargetsInput(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const computed = calculateTargetsAndRanges(value);

    return res.status(200).json({
      success: true,
      message: "Nutrition targets calculated successfully",
      data: {
        inputs: value,
        results: {
          bmr: computed.bmr,
          tdeeCalories: computed.tdeeCalories,
          proteinG: computed.proteinG,
          carbsG: computed.carbsG,
          fatG: computed.fatG,
        },
        limits: {
          sugarLimitG: computed.sugarLimitG,
          satFatLimitG: computed.satFatLimitG,
        },
        ranges: {
          proteinMinG: computed.proteinMinG,
          proteinMaxG: computed.proteinMaxG,
          carbsMinG: computed.carbsMinG,
          carbsMaxG: computed.carbsMaxG,
          fatMinG: computed.fatMinG,
          fatMaxG: computed.fatMaxG,
        },
        assumptions: computed.assumptions,
      },
    });
  } catch (err) {
    console.error("calculateTargets error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * POST /api/nutrition/targets
 * Protected (JWT)
 * Save targets for logged-in user
 * Body: age, gender, heightCm, weightKg, activityLevel, goal
 */
async function saveTargets(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const { ok, errors, value } = validateTargetsInput(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const computed = calculateTargetsAndRanges(value);

    const doc = await NutritionTarget.create({
      userId,
      inputs: value,
      results: {
        bmr: computed.bmr,
        tdeeCalories: computed.tdeeCalories,
        proteinG: computed.proteinG,
        carbsG: computed.carbsG,
        fatG: computed.fatG,
      },
      limits: {
        sugarLimitG: computed.sugarLimitG,
        satFatLimitG: computed.satFatLimitG,
      },
      ranges: {
        proteinMinG: computed.proteinMinG,
        proteinMaxG: computed.proteinMaxG,
        carbsMinG: computed.carbsMinG,
        carbsMaxG: computed.carbsMaxG,
        fatMinG: computed.fatMinG,
        fatMaxG: computed.fatMaxG,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Nutrition targets saved successfully",
      data: mapTargetDoc(doc),
    });
  } catch (err) {
    console.error("saveTargets error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/nutrition/targets/me
 * Protected (JWT)
 * Fetch latest targets for logged-in user
 */
async function getMyTargets(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const latest = await NutritionTarget.findOne({ userId }).sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No nutrition targets found for this user",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Latest nutrition targets fetched successfully",
      data: mapTargetDoc(latest),
    });
  } catch (err) {
    console.error("getMyTargets error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * PUT /api/nutrition/targets/me
 * Protected (JWT)
 * Update input fields + re-calculate + save new targets (creates a new latest version)
 */
async function updateMyTargets(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const { ok, errors, value } = validateTargetsInput(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const hasAny = await NutritionTarget.exists({ userId });
    if (!hasAny) {
      return sendError(res, 404, "No existing targets to update. Save targets first.");
    }

    const computed = calculateTargetsAndRanges(value);

    const doc = await NutritionTarget.create({
      userId,
      inputs: value,
      results: {
        bmr: computed.bmr,
        tdeeCalories: computed.tdeeCalories,
        proteinG: computed.proteinG,
        carbsG: computed.carbsG,
        fatG: computed.fatG,
      },
      limits: {
        sugarLimitG: computed.sugarLimitG,
        satFatLimitG: computed.satFatLimitG,
      },
      ranges: {
        proteinMinG: computed.proteinMinG,
        proteinMaxG: computed.proteinMaxG,
        carbsMinG: computed.carbsMinG,
        carbsMaxG: computed.carbsMaxG,
        fatMinG: computed.fatMinG,
        fatMaxG: computed.fatMaxG,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Nutrition targets updated successfully",
      data: mapTargetDoc(doc),
    });
  } catch (err) {
    console.error("updateMyTargets error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/nutrition/foods/search?q=chicken breast
 * Protected (JWT)
 * No DB write
 */
async function searchFoods(req, res) {
  try {
    const { ok, errors, value } = validateFoodSearch(req.query?.q);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const items = await searchFoodsByQuery(value.q);

    return res.status(200).json({
      success: true,
      message: "Foods fetched successfully",
      data: {
        q: value.q,
        count: items.length,
        items,
      },
    });
  } catch (err) {
    console.error("searchFoods error:", err);
    return sendError(res, err.statusCode || 500, err.message || "Server error");
  }
}

/**
 * POST /api/nutrition/foods/calculate
 * Protected (JWT)
 * No DB write
 * Body: { food, quantity, measure }   measure: cup|g
 */
async function calculateFood(req, res) {
  try {
    const { ok, errors, value } = validateFoodCalculateBody(req.body);
    if (!ok) return sendError(res, 400, "Validation failed", errors);

    const result = await calculateFoodNutrition(value);

    return res.status(200).json({
      success: true,
      message: "Food nutrition calculated successfully",
      data: result,
    });
  } catch (err) {
    console.error("calculateFood error:", err);
    return sendError(res, err.statusCode || 500, err.message || "Server error");
  }
}

/**
 * POST /api/nutrition/intake
 * Protected (JWT)
 * Upsert today's intake and increment totals
 */
async function upsertIntake(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    if (req.body?.dateKey && !isISODateKey(req.body.dateKey)) {
      return sendError(res, 400, "Validation failed", ["dateKey must be YYYY-MM-DD"]);
    }

    const doc = await upsertDailyIntake(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Daily intake saved successfully",
      data: mapIntakeDoc(doc),
    });
  } catch (err) {
    console.error("upsertIntake error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/nutrition/intake/daily
 * Protected (JWT)
 * Get today's intake or intake by ?dateKey=YYYY-MM-DD
 */
async function getDailyIntake(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const dateKey = req.query?.dateKey;
    if (dateKey && !isISODateKey(dateKey)) {
      return sendError(res, 400, "Validation failed", ["dateKey must be YYYY-MM-DD"]);
    }

    const doc = await getDailyIntakeByDate(userId, dateKey);

    return res.status(200).json({
      success: true,
      message: "Daily intake fetched successfully",
      data: doc._id ? mapIntakeDoc(doc) : doc,
    });
  } catch (err) {
    console.error("getDailyIntake error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/nutrition/summary/weekly
 * Protected (JWT)
 * Last 7 days intake totals
 */
async function getWeeklySummary(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const summary = await getWeeklyIntakeSummary(userId);

    return res.status(200).json({
      success: true,
      message: "Weekly summary fetched successfully",
      data: summary,
    });
  } catch (err) {
    console.error("getWeeklySummary error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * GET /api/nutrition/summary/today
 * Protected (JWT)
 * Today's intake vs latest targets
 */
async function getTodayNutritionSummary(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const summary = await getTodaySummary(userId);

    return res.status(200).json({
      success: true,
      message: "Today's nutrition summary fetched successfully",
      data: summary,
    });
  } catch (err) {
    console.error("getTodayNutritionSummary error:", err);
    return sendError(res, 500, "Server error");
  }
}

/**
 * DELETE /api/nutrition/targets/me
 * Protected (JWT)
 * Deletes ONLY the latest target document for the logged-in user
 * Keeps history (older docs remain). After delete, previous doc becomes latest.
 */
async function deleteMyLatestTargets(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const latest = await NutritionTarget.findOne({ userId }).sort({ createdAt: -1 });

    if (!latest) {
      return sendError(res, 404, "No nutrition targets found to delete.");
    }

    await NutritionTarget.deleteOne({ _id: latest._id });

    return res.status(200).json({
      success: true,
      message: "Latest nutrition targets deleted successfully",
      data: {
        deletedId: latest._id,
      },
    });
  } catch (err) {
    console.error("deleteMyLatestTargets error:", err);
    return sendError(res, 500, "Server error");
  }
}

module.exports = {
  calculateTargets,
  saveTargets,
  getMyTargets,
  updateMyTargets,
  deleteMyLatestTargets,

  searchFoods,
  calculateFood,

  upsertIntake,
  getDailyIntake,
  getWeeklySummary,
  getTodayNutritionSummary,
};