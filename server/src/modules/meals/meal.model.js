// server/src/modules/meals/meal.model.js

const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 2, 
      maxlength: 100 
    },
    image: { 
      type: String, 
      required: true, 
      trim: true, 
      match: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i  // Basic URL validation for images
    },
    description: { 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 10, 
      maxlength: 500 
    },
    ingredients: [{ 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 1,
      maxlength: 100
    }],
    instructions: [{ 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 1,
      maxlength: 200
    }],
    nutrition: {
      calories: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 10000 
      },
      protein: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 500 
      },
      carbs: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 1000 
      },
      fat: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 500 
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
