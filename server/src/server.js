require('dotenv').config();

// ************ IMPORT ROUTES ************

// ----- Auth routes -----
const authRoutes = require('./modules/auth/auth.routes');

// ----- User routes -----
const userRoutes = require('./modules/users/user.routes');

// ----- Nutrition routes -----
const nutritionRoutes = require('./modules/nutrition/nutrition.routes');

// ----- Meal routes -----
const mealRoutes = require('./modules/meals/meal.routes');

// ----- Weekly planner routes -----
const weeklyMealRoutes = require('./modules/weekly_meal_planner/weeklyMeal.routes');

const progressRoutes = require('./modules/weekly_planner_prediction/progress.routes');


// ----- Health recommendation routes -----
const healthRecommendationRoutes = require('./modules/health_recommendation/healthRecommendation.routes');

// ----- AI Food Allergies routes -----
const aiFoodAllergiesRoutes = require('./modules/ai_food_allergies/aiFoodAllergy.routes');

// ----- Health Advice routes -----
const healthAdviceRoutes = require('./modules/health_advice/healthAdvice.routes');

const connectDB = require('./config/db');
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

/***************************** ROUTES ***********************/

// ----- Auth routes -----
app.use('/api/auth', authRoutes);

// ----- User routes -----
app.use('/api/users', userRoutes);

// ----- Nutrition routes -----
app.use('/api/nutrition', nutritionRoutes);

// ----- Meal routes -----
app.use('/api/meals', mealRoutes);

// ----- Weekly planner routes -----
app.use('/api/meal-plan', weeklyMealRoutes);

app.use('/api/progress', progressRoutes);

// ----- Health recommendation routes -----
app.use('/api/health-recommendation', healthRecommendationRoutes);

// ----- AI Food Allergies routes -----
app.use('/api/ai-food-allergies', aiFoodAllergiesRoutes);

// ----- Health Advice routes -----
app.use('/api/health-advice', healthAdviceRoutes);

// port
const PORT = process.env.PORT || 5000;

// establish the db connection and start the server
(async () => {
  try {
    
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log('fail to connect db...', err);
    process.exit(1);
  }
})();
