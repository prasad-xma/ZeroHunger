// server/src/modules/nutrition/nutrition.target.model.js

const mongoose = require("mongoose");

const NutritionTargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    inputs: {
      age: { type: Number, required: true },
      gender: { type: String, required: true }, // male|female
      heightCm: { type: Number, required: true },
      weightKg: { type: Number, required: true },
      activityLevel: { type: String, required: true }, // sedentary|light|moderate|active|very_active
      goal: { type: String, required: true }, // lose|maintain|gain
    },

    results: {
      bmr: { type: Number, required: true },
      tdeeCalories: { type: Number, required: true },
      proteinG: { type: Number, required: true },
      carbsG: { type: Number, required: true },
      fatG: { type: Number, required: true },
    },

    limits: {
      sugarLimitG: { type: Number, required: true },
      satFatLimitG: { type: Number, required: true },
    },

    ranges: {
      proteinMinG: { type: Number, required: true },
      proteinMaxG: { type: Number, required: true },
      carbsMinG: { type: Number, required: true },
      carbsMaxG: { type: Number, required: true },
      fatMinG: { type: Number, required: true },
      fatMaxG: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NutritionTarget", NutritionTargetSchema);
