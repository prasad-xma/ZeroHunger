# Health Advice Module

This module provides personalized health advice based on user health profiles and goals.

## Files

- `healthAdvice.model.js` - Defines the health advice data structure
- `healthAdvice.controller.js` - Contains controller functions for health advice operations
- `healthAdvice.routes.js` - Defines API routes for health advice endpoints
- `README.md` - This documentation file

## Routes

### POST /generate/:healthProfileId
Generates new health advice based on a health profile.

**Parameters:**
- `healthProfileId` (path) - ID of the health profile

**Authentication:** Required

**Responses:**
- `201` - Health advice generated successfully
- `404` - Health profile not found
- `500` - Failed to generate health advice

### GET /:healthProfileId
Retrieves health advice for a specific health profile.

**Parameters:**
- `healthProfileId` (path) - ID of the health profile

**Authentication:** Required

**Responses:**
- `200` - Health advice retrieved successfully
- `404` - Health advice not found
- `500` - Failed to fetch health advice

### GET /
Retrieves all health advice for the authenticated user.

**Authentication:** Required

**Responses:**
- `200` - Health advice list retrieved successfully
- `500` - Failed to fetch health advice list

### POST /regenerate/:healthProfileId
Regenerates health advice for a health profile.

**Parameters:**
- `healthProfileId` (path) - ID of the health profile

**Authentication:** Required

**Responses:**
- `201` - Health advice regenerated successfully
- `404` - Health profile not found
- `500` - Failed to regenerate health advice

## Data Structure

The health advice includes:

- **Meal Management**: Frequency, timing, portion control, and meal preparation advice
- **Calorie Management**: Daily targets, meal distribution, and tips
- **Nutrition Levels**: Protein, carbs, fats, vitamins, and minerals recommendations
- **Meal Suggestions**: Specific meal ideas for breakfast, lunch, dinner, and snacks
- **Lifestyle Tips**: Hydration, exercise, sleep, and stress management advice
- **Weekly Plan**: Day-by-day meal and lifestyle recommendations

## Features

- Personalized advice based on user goals (lose/gain/maintain weight)
- Dietary preference accommodations
- Activity level considerations
- Meal timing and frequency optimization
- Automatic expiration after 30 days
- Advice regeneration capability

## Dependencies

- `../health_recommendation/healthRecommendation.model` - Health profile model
- `../../middlewares/auth.middleware` - Authentication middleware

## Notes

Health advice expires after 30 days to ensure recommendations stay current with user progress and goals.
