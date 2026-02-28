# Weekly Meal Planner API Documentation

## Base URL
`http://localhost:5000/api`

## Weekly Meal Planner Endpoints

### 1. Create Weekly Plan
```
POST /meal-plan
Content-Type: application/json

{
  "userId": "user_id_here",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "goal": "Weight Loss"
}
```

### 2. Get Weekly Plan by ID
```
GET /meal-plan/:id
```

### 3. Get All Plans by User
```
GET /meal-plan/user/:userId
```

### 4. Add Food to Meal
```
PUT /meal-plan/:id/add-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "name": "Oatmeal",
  "grams": 100
}
```

### 5. Update Food in Meal
```
PUT /meal-plan/:id/update-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "foodIndex": 0,
  "name": "Oatmeal with berries",
  "grams": 150
}
```

### 6. Remove Food from Meal
```
PUT /meal-plan/:id/remove-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "foodIndex": 0
}
```

### 7. Mark Meal as Completed
```
PUT /meal-plan/:id/complete
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "isCompleted": true
}
```

### 8. Get Weekly Summary
```
GET /meal-plan/:id/summary
```

## Progress Tracking Endpoints

### 1. Save Weekly Progress
```
POST /progress
Content-Type: application/json

{
  "userId": "user_id_here",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "weight": 70.5
}
```

### 2. Get Progress History
```
GET /progress/history/:userId
```

### 3. Get Prediction and AI Advice
```
GET /progress/prediction/:userId/:goal
```

## Valid Values

### Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
### Meal Types: breakfast, lunch, dinner

## Response Examples

### Weekly Plan Response
```json
{
  "_id": "plan_id",
  "userId": "user_id",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "goal": "Weight Loss",
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": {
          "foods": [
            {
              "name": "Oatmeal",
              "grams": 100
            }
          ],
          "isCompleted": false
        },
        "lunch": {
          "foods": [],
          "isCompleted": false
        },
        "dinner": {
          "foods": [],
          "isCompleted": false
        }
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Weekly Summary Response
```json
{
  "goal": "Weight Loss",
  "totalMeals": 21,
  "completedMeals": 15,
  "performance": "71.43"
}
```

### Progress Response
```json
{
  "_id": "progress_id",
  "userId": "user_id",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "weight": 70.5,
  "performance": 71.43,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Prediction Response
```json
{
  "predictedWeight": "69.80",
  "advice": [
    "Prepare protein-rich breakfasts to improve satiety and adherence",
    "Plan meals every Sunday to reduce weekday decision fatigue",
    "Include vegetables in at least 2 meals daily for better nutrition"
  ],
  "dataPoints": 3,
  "currentWeight": 70.5,
  "currentPerformance": 71.43
}
```

## Testing in Postman

1. Create a new collection
2. Set base URL to `http://localhost:5000/api`
3. Use the endpoints above with sample data
4. Make sure to replace `user_id_here` with actual user IDs from your auth system

## Environment Variables

Make sure to set these in your `.env` file:
```
HF_API_KEY=your_huggingface_api_key_here
```
