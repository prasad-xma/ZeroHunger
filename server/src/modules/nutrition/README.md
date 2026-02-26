# 🥗 Nutrition Targets Module – ZeroHunger

The **Nutrition Targets Module** is responsible for calculating, saving, and managing personalized daily calorie and macronutrient targets for authenticated users.

This module integrates with:
- 🔐 Authentication Module (JWT)
- 🗄️ MongoDB (via Mongoose)
- 🧠 Internal Calculation Service (BMR + TDEE + Macro Logic)

It follows a clean architecture:
- Routes → Controller → Service → Model → Database

---

# 📌 Module Purpose

This component allows users to:

- Calculate daily calorie & macro targets
- Save nutrition targets
- View latest saved targets
- Update targets (history-based approach)

The update strategy creates a **new document** instead of overwriting old records — allowing historical tracking.

---

# 🧑‍💻 Real User Scenario (How It Works)

Let’s walk through a real-life flow.

---

## 🟢 Step 1 – User Login

User logs in via: POST /api/auth/login

Backend:
- Validates email & password
- Generates JWT token
- Sends token back to client

Frontend:
- Stores token
- Uses token for protected routes

---

## 🟢 Step 2 – User Calculates Nutrition Targets

User enters:
- Age
- Gender
- Height
- Weight
- Activity Level
- Goal (lose/maintain/gain)

Request: POST /api/nutrition/targets/calculate


Data Flow:

Client → Route → Controller → Service (Calculation Logic) → Response

What Happens Internally:

1. Controller receives body
2. Validates required fields
3. Calls calculation service
4. Service:
   - Calculates BMR (Mifflin-St Jeor)
   - Applies activity multiplier (TDEE)
   - Adjusts calories based on goal
   - Splits macros (protein, carbs, fat)
5. Returns result (NOT saved to DB)

Response includes:
- Calories
- Protein (g)
- Carbs (g)
- Fat (g)

---

## 🟢 Step 3 – User Saves Targets

User decides to save calculated targets.
POST /api/nutrition/targets


Data Flow:

Client → Route → Controller → Service → Model → MongoDB

What Happens:

1. Controller validates input
2. Recalculates targets (secure backend calculation)
3. Creates new NutritionTarget document
4. Associates it with logged-in user
5. Saves to MongoDB
6. Returns saved document

---

## 🟢 Step 4 – User Gets Latest Targets
GET /api/nutrition/targets/me


What Happens:

1. Auth middleware identifies user
2. Controller finds latest record by:
   - userId
   - sorted by createdAt descending
3. Returns most recent record

---

## 🟢 Step 5 – User Updates Targets
PUT /api/nutrition/targets/me


Important Design Choice:

❌ We DO NOT overwrite existing record  
✅ We CREATE a new record (history tracking)

Why?

- Keeps progress history
- Allows tracking changes over time
- Prevents data loss

---


🔄 Data Flow Architecture
Client
  ↓
Routes
  ↓
Controller
  ↓
Service (Calculation Logic)
  ↓
Model
  ↓
MongoDB
  ↓
Response → Client

👨‍💻 Contributor

M.H.M Ramzy
Software Engineering Undergraduate
3rd Year – 2nd Semester

🔗 GitHub: https://github.com/ramzyhafeel

🔗 LinkedIn: https://linkedin.com/in/ramzyhafeel

🔗 Portfolio: https://ramzyhafeel.me

Branch: feature/nutrition-component
Project: ZeroHunger MERN Application