# Health Recommendation Module

This module handles health profile creation and recommendation calculations based on user health data.

## Files

- `healthRecommendation.model.js` - Defines the health profile data structure
- `healthRecommendation.controller.js` - Contains controller functions for health profile operations
- `healthRecommendation.routes.js` - Defines API routes for health profile endpoints
- `healthCalculations.utils.js` - Utility functions for health metric calculations
- `README.md` - This documentation file

## Routes

### POST /
Creates a new health profile with calculated recommendations.

**Request Body:**
```json
{
  "profile_name": "My Health Profile",
  "user_profile": {
    "age": 25,
    "gender": "male",
    "height_cm": 175,
    "weight_kg": 70,
    "target_weight_kg": 65,
    "activity_level": "moderately active",
    "allergies": ["peanuts"],
    "goal": "lose",
    "target_areas": ["belly"],
    "dietary_preference": "non-vegetarian",
    "medical_conditions": [],
    "exercise": {
      "type": "mixed",
      "frequency": 3,
      "duration_min": 45
    },
    "sleep_hours": 8,
    "water_intake": 2.5,
    "meal_frequency": 3,
    "cooking_time": "30-60 min",
    "cuisine_preferences": ["Italian", "Asian"]
  }
}
```

**Authentication:** Required

**Responses:**
- `201` - Health profile created successfully
- `500` - Server error

### GET /
Retrieves all active health profiles for the authenticated user.

**Authentication:** Required

**Responses:**
- `200` - Health profiles retrieved successfully
- `500` - Server error

### GET /:profileId
Retrieves a specific health profile by ID.

**Parameters:**
- `profileId` (path) - Health profile ID

**Authentication:** Required

**Responses:**
- `200` - Health profile retrieved successfully
- `404` - Health profile not found
- `500` - Server error

### PUT /:profileId
Updates health profile data and recalculates metrics.

**Parameters:**
- `profileId` (path) - Health profile ID

**Request Body:** Same as create profile

**Authentication:** Required

**Responses:**
- `200` - Health profile updated successfully
- `404` - Health profile not found
- `500` - Server error

### PUT /:profileId/recommendations
Updates only the recommendations section of a health profile.

**Parameters:**
- `profileId` (path) - Health profile ID

**Request Body:**
```json
{
  "recommendations": {
    "bmi": {
      "value": 22.9,
      "category": "Normal"
    },
    "daily_calories": 2000,
    "macronutrients": {
      "protein": 150,
      "carbs": 250,
      "fat": 65
    },
    "water_intake_goal": 3.0,
    "meal_suggestions": ["Oatmeal with fruits"],
    "exercise_recommendations": ["30 min cardio"],
    "lifestyle_tips": ["Drink water regularly"]
  }
}
```

**Authentication:** Required

**Responses:**
- `200` - Recommendations updated successfully
- `404` - Health profile not found
- `500` - Server error

### POST /:profileId/recalculate
Recalculates health metrics for existing profile.

**Parameters:**
- `profileId` (path) - Health profile ID

**Authentication:** Required

**Responses:**
- `200` - Metrics recalculated successfully
- `404` - Health profile not found
- `500` - Server error

### DELETE /:profileId
Deletes a health profile permanently.

**Parameters:**
- `profileId` (path) - Health profile ID

**Authentication:** Required

**Responses:**
- `200` - Health profile deleted successfully
- `404` - Health profile not found
- `500` - Server error

## Data Structure

The health profile includes:

- **User Profile**: Personal health data (age, gender, height, weight, activity level, etc.)
- **Recommendations**: Calculated metrics (BMI, calories, macronutrients, water intake)
- **Meal Suggestions**: AI-generated meal recommendations
- **Exercise Recommendations**: Exercise suggestions based on goals
- **Lifestyle Tips**: General health and wellness tips
- **Status**: Profile status (pending, generated, updated, deactivated)

## Features

- Health profile creation and management
- Automatic BMI and calorie calculations
- Macronutrient distribution calculations
- Water intake recommendations
- Multiple profiles per user support
- Profile deactivation (soft delete)
- Metric recalculation on profile updates

## Dependencies

- `healthCalculations.utils` - Health metric calculation functions
- `../../middlewares/auth.middleware` - Authentication middleware

## Notes

Users can create multiple health profiles. Each profile is calculated independently. Profiles are soft deleted rather than permanently removed.
