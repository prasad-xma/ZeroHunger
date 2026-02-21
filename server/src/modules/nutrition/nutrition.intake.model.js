// server/src/modules/nutrition/nutrition.intake.model.js

const mongoose = require("mongoose");

const NutritionIntakeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    dateKey: { type: String, required: true }, // YYYY-MM-DD

    calories: { type: Number, default: 0 },
    proteinG: { type: Number, default: 0 },
    carbsG: { type: Number, default: 0 },
    fatG: { type: Number, default: 0 },
    sugarG: { type: Number, default: 0 },
    satFatG: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Unique per user per day
NutritionIntakeSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("NutritionIntake", NutritionIntakeSchema);
