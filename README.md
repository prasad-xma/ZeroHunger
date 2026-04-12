# ZeroHunger - MERN Health and Nutrition Project

ZeroHunger is a web application built using the MERN stack. It helps users manage their health and nutrition by creating profiles, tracking meals, and getting health advice. The project also uses AI to provide food allergy safety tips and nutrition analysis.

## Key Features

* Health Dashboard: Users can create health profiles and see their BMI, daily calorie needs, and macronutrient targets.
* Food Allergy Safety: Provides safety tips and food alternatives for common allergies using AI.
* Meal Gallery: A place to view and search for different healthy meals.
* Weekly Meal Planner: Users can plan their meals for the week and track their progress.
* Shopping Optimizer: Generates shopping lists from meal plans and allows users to download them as PDFs.
* Progress Tracker: Keeps track of weight changes and gives simple predictions for health goals.

## Tech Stack

* Frontend: React, Vite, Tailwind CSS, Lucide Icons
* Backend: Node.js, Express, MongoDB
* AI: Google Gemini, HuggingFace
* Auth: JWT with cookies

## Setup Instructions

### Prerequisites
* Node.js installed on your computer
* MongoDB (either local or Atlas)
* API Keys for Google AI and HuggingFace

### 1. Installation
First, clone the project from GitHub:
```bash
git clone <repository-url>
cd ZeroHunger
```

### 2. Backend Setup
1. Go to the server folder:
   ```bash
   cd server
   ```
2. Install the backend packages:
   ```bash
   npm install
   ```
3. Create a .env file in the server folder and add these variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   GOOGLE_AI_API_KEY=your_key
   HF_API_KEY=your_key
   VITE_API_URL=
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Go to the client folder:
   ```bash
   cd ../client
   ```
2. Install the frontend packages:
   ```bash
   npm install
   ```
3. Start the project:
   ```bash
   npm run dev
   ```
   The app usually runs at http://localhost:5173.

## API Endpoints

### Authentication
* POST /api/auth/register - Register a new user
* POST /api/auth/login - Login and get token
* POST /api/auth/logout - Logout session (Auth required)

### Meals
* GET /api/meals - Get all meals
* GET /api/meals/:id - Get a single meal
* GET /api/meals/search - Search for meals
* POST /api/meals - Add a new meal
* PUT /api/meals/:id - Update a meal
* DELETE /api/meals/:id - Delete a meal

### Health and Advice
* POST /api/health-recommendations - Create health profile (Auth required)
* GET /api/health-recommendations - List user profiles (Auth required)
* POST /api/health-advice/generate/:id - Generate advice (Auth required)
* GET /api/health-advice/:id - Get advice for profile (Auth required)

### AI and Nutrition
* POST /api/nutrition/targets/calculate - Calculate macros (Auth required)
* POST /api/nutrition/targets - Save targets (Auth required)
* GET /api/nutrition/targets/me - Get my targets (Auth required)
* POST /api/ai-food-allergies/generate - Get allergy safety guide (Auth required)

### Shopping and Planning
* POST /api/meal-plan - Create weekly plan (Auth required)
* GET /api/meal-plan/:id - View plan details (Auth required)
* PUT /api/meal-plan/:id/complete - Mark meal as finished (Auth required)
* POST /api/shopping - Create shopping list (Auth required)
* GET /api/shopping/:id/pdf - Download PDF list (Auth required)

## Project Structure

```text
ZeroHunger/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── features/       # Different pages and features
│   │   ├── services/       # API calls
│   │   └── components/     # UI parts
├── server/                 # Backend code
│   ├── src/
│   │   ├── modules/        # API logic (controllers, routes)
│   │   ├── config/         # App settings
│   │   └── middlewares/    # Security stuff
└── README.md
```

## Testing
 
### 1. Overview
This report explains how to perform testing for the ZeroHunger application. It covers unit testing, integration testing, and performance testing across all system modules. The goal is to ensure that each component functions correctly and that the overall system performs reliably.
 
### 2. Unit Testing Setup and Execution
 
**Test Structure**
* Backend unit tests are located in `__tests__` folders inside each module.
* Frontend unit tests are written within component files using the `.test.jsx` extension.
* Jest is used for backend testing, while Vitest is used for frontend testing.
 
**Backend Unit Testing Commands**
Run all unit tests:
```bash
cd server
npm test
```
 
Run tests for specific modules:
* Weekly Meal Planner: `npm test -- --testPathPatterns=weekly_meal_planner/__tests__`
* Weekly Prediction: `npm test -- --testPathPatterns=weekly_planner_prediction/__tests__`
* Nutrition Module: `npm test -- --testPathPatterns=nutrition/__tests__`
* Shopping Module: `npm test -- --testPathPatterns=shopping/__tests__`
* Meals Module: `npm test -- --testPathPatterns=meals/__tests__`
* Auth Module: `npm test -- --testPathPatterns=auth/__tests__`
* Health Advice Module: `npm test -- --testPathPatterns=health_advice/__tests__`
* AI Food Allergies Module: `npm test -- --testPathPatterns=ai_food_allergies/__tests__`
* Users Module: `npm test -- --testPathPatterns=users/__tests__`
* Health Recommendation Module: `npm test -- --testPathPatterns=health_recommendation/__tests__`
 
Run tests with coverage:
```bash
cd server
npm run coverage
```
 
Run tests in watch mode:
```bash
cd server
npm run test:watch
```
 
**Frontend Unit Testing Commands**
Run all frontend tests:
```bash
cd client
npm test
```
 
Run tests with UI:
```bash
cd client
npm run test:ui
```
 
### 3. Integration Testing Setup and Execution
 
**Test Structure**
Integration tests are located in `server/src/tests/`. Test files include:
* `weeklyMeal.test.js`
* `auth.test.js`
* `progress.test.js`
* `meal.test.js`
* `health.test.js`
* `user.test.js`
 
**Commands**
Run all integration tests:
```bash
cd server
npm test -- --testPathPatterns="tests"
```
 
Run specific integration tests:
```bash
npm test -- --testPathPatterns=tests/weeklyMeal.test.js
npm test -- --testPathPatterns=tests/auth.test.js
npm test -- --testPathPatterns=tests/progress.test.js
npm test -- --testPathPatterns=tests/meal.test.js
npm test -- --testPathPatterns=tests/health.test.js
npm test -- --testPathPatterns=tests/user.test.js
```
 
### 4. Performance Testing Setup and Execution
 
**Test Structure**
* Performance tests are located in the `server/performance/` folder.
* These tests are defined using Artillery YAML configuration files.
* Artillery is used as the load testing tool.
 
**Commands**
Install Artillery if needed:
```bash
npm install -g artillery
```
 
Run performance tests:
```bash
cd server
npx artillery run performance/weekly-meal-planner-test.yml
npx artillery run performance/weekly-prediction-test.yml
npx artillery run performance/meal-test.yml
npx artillery run performance/auth-test.yml
npx artillery run performance/shopping-test.yml
npx artillery run performance/health-advice-test.yml
npx artillery run performance/health-recommendation-test.yml
npx artillery run performance/ai-allergy-test.yml
npx artillery run performance/nutrition-intake.yml
npx artillery run performance/nutrition-food-calculate.yml
```
 
Using available npm scripts:
```bash
cd server
npm run perf:intake
npm run perf:food
```
 
### 5. Testing Environment Configuration
 
**Backend**
* Testing framework: Jest
* Runtime: Node.js
* Mocking: Jest mocks
* Coverage tool: Jest coverage
* Database: MongoDB (using an in-memory server during testing)
 
**Frontend**
* Testing framework: Vitest
* Build tool: Vite
* Library: React Testing Library
 
**Performance Testing**
* Tool: Artillery
* Configuration: YAML files
* Environment: Local development server
* Metrics: Response time, throughput, and error rates
 
### 6. Quick Reference
 
**Run the full test suite:**
* Backend unit tests: `cd server && npm test`
* Frontend tests: `cd client && npm test`
* Integration tests: `cd server && npm test -- --testPathPatterns="tests"`
* Performance test example: `cd server && npx artillery run performance/weekly-meal-planner-test.yml`
 
### 7. Test Summary
* Unit tests: More than 30 test files across 9 modules
* Integration tests: 6 test files covering major API endpoints
* Performance tests: 10 Artillery configurations
* Coverage reports: Generated using `npm run coverage`
* Test outputs: Available through Jest and Artillery reports
 
### 8. Best Practices
 
**Before Running Tests**
* Make sure MongoDB is running for integration tests
* Install dependencies using `npm install`
* Start the development server if required
* Use separate terminals for different test types
 
**Recommended Order**
1. Start with unit tests
2. Then run integration tests
3. Finally, perform performance testing
 
**Troubleshooting**
* Use `--testPathPatterns` (plural) when running Jest commands
* Use `npx artillery` if Artillery is installed locally
* Check import paths if modules fail to load
* Verify database connection when running integration tests
 

## Contributors

> Prasad Manamperi - [GitHub](https://github.com/prasad-xma ) | [LinkedIn](https://www.linkedin.com/in/prasad-manamperi-5599b9362/)

>

This project was built as part of our undergraduate coursework to help people live healthier lives.