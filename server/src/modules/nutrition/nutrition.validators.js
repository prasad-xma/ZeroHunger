// server/src/modules/nutrition/nutrition.validators.js
// Manual validation (no external libs).

const ALLOWED_ACTIVITY = ["sedentary", "light", "moderate", "active", "very_active"];
const ALLOWED_GOAL = ["lose", "maintain", "gain"];
const ALLOWED_GENDER = ["male", "female"];

function isNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function isNonNegNumber(n) {
  return isNumber(n) && n >= 0;
}

function validateTargetsInput(body) {
  const errors = [];

  const age = body?.age;
  const gender = String(body?.gender ?? "").toLowerCase();
  const heightCm = body?.heightCm;
  const weightKg = body?.weightKg;
  const activityLevel = String(body?.activityLevel ?? "").toLowerCase();
  const goal = String(body?.goal ?? "").toLowerCase();

  if (!isNumber(age) || age < 13 || age > 90) errors.push("age must be a number between 13 and 90.");
  if (!ALLOWED_GENDER.includes(gender)) errors.push(`gender must be one of: ${ALLOWED_GENDER.join(", ")}.`);
  if (!isNumber(heightCm) || heightCm < 120 || heightCm > 230) errors.push("heightCm must be a number between 120 and 230.");
  if (!isNumber(weightKg) || weightKg < 30 || weightKg > 250) errors.push("weightKg must be a number between 30 and 250.");
  if (!ALLOWED_ACTIVITY.includes(activityLevel)) errors.push(`activityLevel must be one of: ${ALLOWED_ACTIVITY.join(", ")}.`);
  if (!ALLOWED_GOAL.includes(goal)) errors.push(`goal must be one of: ${ALLOWED_GOAL.join(", ")}.`);

  return {
    ok: errors.length === 0,
    errors,
    value: {
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goal,
    },
  };
}

function isISODateKey(s) {
  // Basic YYYY-MM-DD check (no timezone parsing)
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function validateIntakeBody(body) {
  const errors = [];

  const dateKey = body?.dateKey;
  if (!isISODateKey(dateKey)) errors.push("dateKey must be a string in YYYY-MM-DD format.");

  const fields = ["calories", "proteinG", "carbsG", "fatG", "sugarG", "satFatG"];
  for (const f of fields) {
    const v = body?.[f];
    if (v === undefined) continue; // allow partial update in later phases
    if (!isNonNegNumber(v)) errors.push(`${f} must be a non-negative number.`);
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      dateKey,
      calories: body?.calories,
      proteinG: body?.proteinG,
      carbsG: body?.carbsG,
      fatG: body?.fatG,
      sugarG: body?.sugarG,
      satFatG: body?.satFatG,
    },
  };
}

module.exports = {
  validateTargetsInput,
  validateIntakeBody,
  isISODateKey,
};
