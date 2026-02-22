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

// port
const PORT = process.env.PORT || 5000;

// establish the db connection and start the server
(async () => {
  try {
    // establish the db connection
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log('fail to connect db...', err);
    process.exit(1);
  }
})();
