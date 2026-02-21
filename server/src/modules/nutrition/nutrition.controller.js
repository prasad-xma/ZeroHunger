// server/src/modules/nutrition/nutrition.controller.js

const NutritionTarget = require("./nutrition.target.model");
const { validateTargetsInput, isISODateKey } = require("./nutrition.validators");
const { calculateTargetsAndRanges } = require("./nutrition.service");

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

    // Optional: ensure user had a previous target (helps demo narrative)
    const hasAny = await NutritionTarget.exists({ userId });
    if (!hasAny) {
      return sendError(res, 404, "No existing targets to update. Save targets first.");
    }

    const computed = calculateTargetsAndRanges(value);

    // Create a new version (keeps history). "Latest" is newest createdAt.
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

// Phase 4+ placeholders (keep stable until next phases)
function notImplemented(req, res) {
  return res.status(501).json({
    success: false,
    message: "Not implemented yet (will be added in next phase).",
  });
}

module.exports = {
  calculateTargets,
  saveTargets,
  getMyTargets,
  updateMyTargets,

  upsertIntake: notImplemented,
  getDailyIntake: notImplemented,
  getWeeklySummary: notImplemented,
};