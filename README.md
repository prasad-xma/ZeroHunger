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

## Contributors

> Prasad Manamperi - [GitHub](https://github.com/prasad-xma ) | [LinkedIn](https://www.linkedin.com/in/prasad-manamperi-5599b9362/)

>

This project was built as part of our undergraduate coursework to help people live healthier lives.