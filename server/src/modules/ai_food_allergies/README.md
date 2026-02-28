# AI Food Allergies Module

This module handles AI-powered food allergy recommendations and safety information.

## Files

- `aiFoodAllergy.model.js` - Defines the allergy profile data structure
- `aiFoodAllergy.controller.js` - Contains controller functions for allergy operations
- `aiFoodAllergy.routes.js` - Defines API routes for allergy endpoints
- `googleAi.service.js` - Service for Google AI integration
- `README.md` - This documentation file

## Routes

### POST /generate
Generates AI allergy recommendations based on user's allergies.

**Request Body:**
```json
{
  "allergies": ["peanuts", "shellfish", "dairy"]
}
```

**Authentication:** Required

**Responses:**
- `200` - Recommendations generated successfully
- `400` - Invalid allergies array
- `500` - Failed to generate recommendations

### GET /
Retrieves user's active allergy profile.

**Authentication:** Required

**Responses:**
- `200` - Allergy profile retrieved successfully
- `404` - No allergy profile found
- `500` - Server error

### PUT /update
Updates user's allergy profile with new allergies.

**Request Body:**
```json
{
  "allergies": ["peanuts", "shellfish", "dairy", "gluten"]
}
```

**Authentication:** Required

**Responses:**
- `200` - Profile updated successfully
- `404` - Allergy profile not found
- `500` - Failed to update profile

### DELETE /
Deletes user's allergy profile permanently.

**Authentication:** Required

**Responses:**
- `200` - Allergy profile deleted successfully
- `404` - Allergy profile not found
- `500` - Server error

## Data Structure

The allergy profile includes:

- **Allergies**: Array of user's food allergies
- **AI Response**: Recommendations, foods to avoid, safe alternatives, cross-contamination notes, reading labels tips, emergency precautions
- **Response Metadata**: Model used, response time, generation timestamp

## Features

- AI-powered allergy recommendations
- Safe food alternatives
- Cross-contamination warnings
- Label reading guidance
- Emergency precautions
- Profile management (create, update, deactivate)

## Dependencies

- `../users/user.model` - User model for authentication
- `googleAi.service` - Google AI service integration

## Notes

Only one active allergy profile is allowed per user. New profiles replace existing ones.
