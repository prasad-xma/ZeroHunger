// server/src/modules/nutrition/nutrition.service.js
// Pure calculation functions live here (no req/res).

const NutritionIntake = require("./nutrition.intake.model");
const NutritionTarget = require("./nutrition.target.model");

function round1(n) {
  return Math.round(n * 10) / 10;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function calculateBMR({ gender, heightCm, weightKg, age }) {
  // Mifflin-St Jeor
  // Men: BMR = 10W + 6.25H - 5A + 5
  // Women: BMR = 10W + 6.25H - 5A - 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const g = String(gender).toLowerCase();
  const s = g === "male" ? 5 : -161; // treat all non-male as female for simplicity
  return base + s;
}

function activityFactor(activityLevel) {
  // Commonly used, defensible multipliers
  const map = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return map[activityLevel] ?? 1.2;
}

function goalAdjustment(goal) {
  // Simple approach for demo readiness:
  // lose: -15% calories, maintain: 0, gain: +10%
  if (goal === "lose") return 0.85;
  if (goal === "gain") return 1.1;
  return 1.0;
}

function calculateTDEE(bmr, activityLevel, goal) {
  const tdee = bmr * activityFactor(activityLevel);
  return tdee * goalAdjustment(goal);
}

/**
 * Macro assumptions (simple, defensible):
 * - Choose protein at 2.0 g/kg/day (within 1.6–2.2 range).
 * - Choose fat at 25% calories/day (within 20–35% range).
 * - Carbs = remaining calories.
 * - Calories per gram: Protein 4, Carbs 4, Fat 9
 */
function calculateTargetsAndRanges(inputs) {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = inputs;

  const bmr = calculateBMR({ gender, heightCm, weightKg, age });
  const tdeeCalories = calculateTDEE(bmr, activityLevel, goal);

  // Main targets
  const proteinG = 2.0 * weightKg;

  const fatCalories = 0.25 * tdeeCalories;
  const fatG = fatCalories / 9;

  const proteinCalories = proteinG * 4;
  const remainingCalories = tdeeCalories - (proteinCalories + fatG * 9);
  const carbsG = Math.max(0, remainingCalories / 4);

  // Limits
  // Sugar < 10% calories / 4 (grams), cap 65g
  const sugarLimitG = Math.min((0.10 * tdeeCalories) / 4, 65);
  // Sat fat < 10% calories / 9 (grams)
  const satFatLimitG = (0.10 * tdeeCalories) / 9;

  // Ranges for presentation
  const proteinMinG = 1.6 * weightKg;
  const proteinMaxG = 2.2 * weightKg;

  const fatMinG = (0.20 * tdeeCalories) / 9;
  const fatMaxG = (0.35 * tdeeCalories) / 9;

  // Carbs range = remaining after protein+fat extremes
  // Min carbs happens when protein+fat are max; max carbs when protein+fat are min
  const carbsMinCals = tdeeCalories - (proteinMaxG * 4 + fatMaxG * 9);
  const carbsMaxCals = tdeeCalories - (proteinMinG * 4 + fatMinG * 9);

  const carbsMinG = Math.max(0, carbsMinCals / 4);
  const carbsMaxG = Math.max(0, carbsMaxCals / 4);

  // Rounding (presentation-friendly)
  const out = {
    bmr: round1(bmr),
    tdeeCalories: Math.round(tdeeCalories),

    proteinG: round1(proteinG),
    carbsG: round1(carbsG),
    fatG: round1(fatG),

    sugarLimitG: round1(sugarLimitG),
    satFatLimitG: round1(satFatLimitG),

    proteinMinG: round1(proteinMinG),
    proteinMaxG: round1(proteinMaxG),
    fatMinG: round1(fatMinG),
    fatMaxG: round1(fatMaxG),
    carbsMinG: round1(carbsMinG),
    carbsMaxG: round1(carbsMaxG),

    assumptions: {
      formula: "Mifflin-St Jeor",
      activityFactors: {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      },
      goalAdjustments: {
        lose: "-15%",
        maintain: "0%",
        gain: "+10%",
      },
      macroStrategy: {
        protein: "2.0 g/kg/day (range shown 1.6–2.2)",
        fat: "25% calories/day (range shown 20–35%)",
        carbs: "remaining calories after protein + fat",
      },
      kcalPerGram: { protein: 4, carbs: 4, fat: 9 },
      limits: {
        sugar: "(<10% calories / 4) grams/day capped at 65g",
        satFat: "(<10% calories / 9) grams/day",
      },
    },
  };

  // Safety clamp (avoid weird negatives from edge cases)
  out.proteinG = clamp(out.proteinG, 0, 9999);
  out.carbsG = clamp(out.carbsG, 0, 9999);
  out.fatG = clamp(out.fatG, 0, 9999);

  return out;
}

function toGrams(quantity, measure) {
  const m = String(measure).toLowerCase();
  if (m === "cup") {
    // Your rule: 1 cup = 200g
    return quantity * 200;
  }
  // g / gram / grams
  return quantity;
}

async function ninjasNutritionQuery(query) {
  const apiKey = process.env.NINJAS_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing NINJAS_API_KEY in environment variables.");
    err.statusCode = 500;
    throw err;
  }

  const url = `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey,
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`API Ninjas error: ${resp.status} ${resp.statusText} ${text}`.trim());
    err.statusCode = 502;
    throw err;
  }

  const data = await resp.json();
  return Array.isArray(data) ? data : [];
}

async function searchFoodsByQuery(q) {
  // For "search", we just pass the query and return the array
  // Example: "chicken breast"
  return ninjasNutritionQuery(q);
}

async function calculateFoodNutrition({ food, quantity, measure }) {
  const grams = toGrams(quantity, measure);

  // Example query: "300g chicken breast"
  const query = `${Math.round(grams)}g ${food}`;
  const items = await ninjasNutritionQuery(query);

  // API sometimes returns multiple items (e.g., chicken + sauce), we will SUM them.
  const totals = items.reduce(
    (acc, item) => {
      acc.calories += Number(item?.calories ?? 0);
      acc.proteinG += Number(item?.protein_g ?? 0);
      acc.fatG += Number(item?.fat_total_g ?? 0);
      acc.carbsG += Number(item?.carbohydrates_total_g ?? 0);
      acc.fiberG += Number(item?.fiber_g ?? 0);
      acc.sugarG += Number(item?.sugar_g ?? 0);
      acc.satFatG += Number(item?.fat_saturated_g ?? 0);
      return acc;
    },
    { calories: 0, proteinG: 0, fatG: 0, carbsG: 0, fiberG: 0, sugarG: 0, satFatG: 0 }
  );

  return {
    queryUsed: query,
    netWeightG: round1(grams),

    calories: Math.round(totals.calories),
    proteinG: round1(totals.proteinG),
    fatG: round1(totals.fatG),
    carbsG: round1(totals.carbsG),
    fiberG: round1(totals.fiberG),
    sugarG: round1(totals.sugarG),
    satFatG: round1(totals.satFatG),

    items, // return raw items for transparency/debug (frontend can ignore if needed)
  };
}

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeIntakeValues(payload = {}) {
  return {
    calories: Number(payload.calories) || 0,
    proteinG: Number(payload.proteinG) || 0,
    carbsG: Number(payload.carbsG) || 0,
    fatG: Number(payload.fatG) || 0,
    sugarG: Number(payload.sugarG) || 0,
    satFatG: Number(payload.satFatG) || 0,
  };
}

async function upsertDailyIntake(userId, payload = {}) {
  const dateKey = payload.dateKey || getTodayDateKey();
  const values = normalizeIntakeValues(payload);

  const doc = await NutritionIntake.findOneAndUpdate(
    { userId, dateKey },
    {
      $setOnInsert: { userId, dateKey },
      $inc: {
        calories: values.calories,
        proteinG: values.proteinG,
        carbsG: values.carbsG,
        fatG: values.fatG,
        sugarG: values.sugarG,
        satFatG: values.satFatG,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return doc;
}

async function getDailyIntakeByDate(userId, dateKey = getTodayDateKey()) {
  const doc = await NutritionIntake.findOne({ userId, dateKey });
  if (doc) return doc;

  return {
    userId,
    dateKey,
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    sugarG: 0,
    satFatG: 0,
  };
}

async function getWeeklyIntakeSummary(userId) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    days.push(dateKey);
  }

  const docs = await NutritionIntake.find({
    userId,
    dateKey: { $in: days },
  }).lean();

  const map = new Map(docs.map((doc) => [doc.dateKey, doc]));

  return days.map((dateKey) => {
    const item = map.get(dateKey);

    return {
      dateKey,
      calories: Number(item?.calories || 0),
      proteinG: Number(item?.proteinG || 0),
      carbsG: Number(item?.carbsG || 0),
      fatG: Number(item?.fatG || 0),
      sugarG: Number(item?.sugarG || 0),
      satFatG: Number(item?.satFatG || 0),
    };
  });
}

function calculatePercent(value, target) {
  if (!target || target <= 0) return 0;
  return round1((value / target) * 100);
}

async function getTodaySummary(userId) {
  const intake = await getDailyIntakeByDate(userId);
  const latestTarget = await NutritionTarget.findOne({ userId }).sort({ createdAt: -1 }).lean();

  if (!latestTarget) {
    return {
      intake,
      targets: null,
      percentages: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    };
  }

  const results = latestTarget.results || {};

  return {
    intake,
    targets: {
      tdeeCalories: Number(results.tdeeCalories || 0),
      proteinG: Number(results.proteinG || 0),
      carbsG: Number(results.carbsG || 0),
      fatG: Number(results.fatG || 0),
    },
    percentages: {
      calories: calculatePercent(intake.calories, results.tdeeCalories),
      protein: calculatePercent(intake.proteinG, results.proteinG),
      carbs: calculatePercent(intake.carbsG, results.carbsG),
      fat: calculatePercent(intake.fatG, results.fatG),
    },
  };
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetsAndRanges,

  // Food search + calculate functions
  searchFoodsByQuery,
  calculateFoodNutrition,

  // Intake + summaries
  upsertDailyIntake,
  getDailyIntakeByDate,
  getWeeklyIntakeSummary,
  getTodaySummary,
};