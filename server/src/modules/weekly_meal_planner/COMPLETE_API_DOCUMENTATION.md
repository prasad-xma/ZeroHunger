# Weekly Meal Planner API - Complete RESTful Documentation

## 🏗️ Architecture Overview

This API follows **RESTful principles** with proper **CRUD operations**, **clean architecture**, and **standard HTTP status codes**.

### **Base URL:** `http://localhost:5000/api`

### **HTTP Status Codes Used:**
- `200` - OK (GET, PUT, DELETE success)
- `201` - Created (POST success)
- `204` - No Content (DELETE with no body)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Permission denied)
- `404` - Not Found (Resource doesn't exist)
- `409` - Conflict (Resource already exists)
- `422` - Unprocessable Entity (Validation failed)
- `500` - Internal Server Error

---

## 🍽️ Weekly Meal Planner Endpoints

### **CREATE Operations**

#### **Create Weekly Plan**
```http
POST /meal-plan
Content-Type: application/json

{
  "userId": "64f1234567890abcdef12345",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "goal": "Weight Loss"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "userId": "64f1234567890abcdef12345",
    "weekStartDate": "2024-01-01T00:00:00.000Z",
    "goal": "Weight Loss",
    "days": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 201
}
```

---

### **READ Operations**

#### **Get Weekly Plan by ID**
```http
GET /meal-plan/:id
```

#### **Get All Plans by User**
```http
GET /meal-plan/user/:userId
```

#### **Get Weekly Summary**
```http
GET /meal-plan/:id/summary
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "goal": "Weight Loss",
    "totalMeals": 21,
    "completedMeals": 15,
    "performance": "71.43"
  },
  "status": 200
}
```

---

### **UPDATE Operations**

#### **Add Food to Meal**
```http
PUT /meal-plan/:id/add-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "name": "Oatmeal with Berries",
  "grams": 150
}
```

#### **Update Food in Meal**
```http
PUT /meal-plan/:id/update-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "foodIndex": 0,
  "name": "Oatmeal with Berries and Honey",
  "grams": 180
}
```

#### **Remove Specific Food Item**
```http
PUT /meal-plan/:id/remove-food
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "foodIndex": 0
}
```

#### **Mark Meal as Completed**
```http
PUT /meal-plan/:id/complete
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "isCompleted": true
}
```

---

### **DELETE Operations**

#### **Delete Entire Weekly Plan**
```http
DELETE /meal-plan/:id
```

**Response (204):**
```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "status": 204
}
```

#### **Delete All User Plans**
```http
DELETE /meal-plan/user/:userId/all
```

#### **Delete All Meals for Specific Day**
```http
DELETE /meal-plan/:id/day
Content-Type: application/json

{
  "day": "Monday"
}
```

#### **Delete Specific Meal Type for Day**
```http
DELETE /meal-plan/:id/meal
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast"
}
```

---

## 📊 Progress Tracking Endpoints

### **CREATE**

#### **Save Weekly Progress**
```http
POST /progress
Content-Type: application/json

{
  "userId": "64f1234567890abcdef12345",
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "weight": 70.5
}
```

### **READ**

#### **Get Progress History**
```http
GET /progress/history/:userId
```

#### **Get AI Prediction & Advice**
```http
GET /progress/prediction/:userId/:goal
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "predictedWeight": "69.40",
    "advice": [
      "Prepare protein-rich breakfasts to improve satiety and adherence",
      "Plan meals every Sunday to reduce weekday decision fatigue",
      "Include vegetables in at least 2 meals daily for better nutrition"
    ],
    "dataPoints": 3,
    "currentWeight": 69.8,
    "currentPerformance": 71.43
  },
  "status": 200
}
```

### **DELETE**

#### **Delete Specific Progress Record**
```http
DELETE /progress/:id
```

#### **Delete All User Progress**
```http
DELETE /progress/user/:userId/all
```

---

## 🔍 Validation & Error Handling

### **Validation Examples**

#### **Required Fields Validation**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "userId",
      "message": "User ID is required",
      "value": ""
    }
  ],
  "status": 400
}
```

#### **Invalid Values**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "day",
      "message": "Day must be a valid weekday (Monday-Sunday)",
      "value": "Funday"
    },
    {
      "field": "grams",
      "message": "Grams cannot exceed 10000",
      "value": 15000
    }
  ],
  "status": 400
}
```

### **Error Response Format**

#### **Not Found (404)**
```json
{
  "success": false,
  "message": "Resource not found",
  "status": 404
}
```

#### **Conflict (409)**
```json
{
  "success": false,
  "message": "Resource already exists",
  "status": 409
}
```

#### **Internal Server Error (500)**
```json
{
  "success": false,
  "message": "Internal server error",
  "status": 500
}
```

---

## 🧪 Postman Testing Guide

### **Collection Setup**

1. **Create New Collection** → "Weekly Meal Planner API"
2. **Set Variables:**
   - `baseUrl`: `http://localhost:5000/api`
   - `userId`: `64f1234567890abcdef12345`
   - `planId`: `{{createPlan.response.data._id}}`

### **Test Sequence**

#### **1. Create Plan**
```http
POST {{baseUrl}}/meal-plan
```
**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});
pm.test("Plan created successfully", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.environment.set("planId", responseJson.data._id);
});
```

#### **2. Add Food**
```http
PUT {{baseUrl}}/meal-plan/{{planId}}/add-food
```

#### **3. Mark Complete**
```http
PUT {{baseUrl}}/meal-plan/{{planId}}/complete
```

#### **4. Get Summary**
```http
GET {{baseUrl}}/meal-plan/{{planId}}/summary
```

#### **5. Save Progress**
```http
POST {{baseUrl}}/progress
```

#### **6. Get Prediction**
```http
GET {{baseUrl}}/progress/prediction/{{userId}}/Weight%20Loss
```

#### **7. Delete Plan**
```http
DELETE {{baseUrl}}/meal-plan/{{planId}}
```

---

## 📋 Valid Values Reference

### **Days:**
- `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`

### **Meal Types:**
- `breakfast`, `lunch`, `dinner`

### **Goals:**
- `Weight Loss`, `Muscle Gain`, `Maintenance`, `General`

### **Weight Range:**
- Minimum: `0.1` kg
- Maximum: `1000` kg

### **Grams Range:**
- Minimum: `1` gram
- Maximum: `10000` grams

---

## 🔧 Environment Setup

### **Required Environment Variables:**
```env
HF_API_KEY=your_huggingface_api_key_here
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zeroHunger
```

### **Dependencies:**
```json
{
  "joi": "^17.9.0",
  "mongoose": "^7.5.0",
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "axios": "^1.5.0"
}
```

---

## 🎯 Best Practices Implemented

### **RESTful Design:**
- ✅ Proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ Resource-based URLs
- ✅ Standard status codes
- ✅ Consistent response format

### **Clean Architecture:**
- ✅ Separation of concerns (Controller, Service, Model)
- ✅ Validation middleware
- ✅ Error handling utilities
- ✅ Response standardization

### **Security:**
- ✅ Input validation and sanitization
- ✅ Error message sanitization
- ✅ Request/response logging

### **Performance:**
- ✅ Efficient database queries
- ✅ Proper indexing
- ✅ Response pagination ready

---

## 🚀 Quick Start

1. **Install dependencies:** `npm install`
2. **Set environment variables** in `.env`
3. **Start server:** `npm start`
4. **Import Postman collection**
5. **Run tests in order**

This API provides a complete, production-ready solution for weekly meal planning with full CRUD operations, proper error handling, and comprehensive documentation!
