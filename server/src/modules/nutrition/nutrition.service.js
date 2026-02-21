// server/src/modules/nutrition/nutrition.service.js
// Pure calculation functions live here (no req/res, no DB).

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

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetsAndRanges,
};
