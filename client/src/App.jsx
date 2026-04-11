import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage from './features/auth/Login.jsx';
import RegisterPage from './features/auth/Register.jsx';
import MealDashboard from './features/meal/MealDashboard.jsx';
import AddMeal from './features/meal/AddMeal.jsx';
import MealGuidelines from './features/meal/MealGuidelines.jsx';
import Dashboard from './features/health_dashboard/Dashboard.jsx';
import HealthProfiles from './features/health_dashboard/HealthProfiles.jsx';
import ProfileDetails from './features/health_dashboard/ProfileDetails.jsx';
import HealthQuestionnaire from './features/questionnaire/ComprehensiveQuestionnaire.jsx';
import QuestionnairePage from './features/ai_food_allergies/Questionnaire.jsx';
import ResultsPage from './features/ai_food_allergies/Results.jsx';
import MealGallery from './features/meal/MealGallery.jsx';
import MealDetail from './features/meal/MealDetail.jsx';
import EditMeal from './features/meal/EditMeal.jsx';

import WeeklyMealPlanner from './features/weekly_meal_planner/WeeklyMealPlanner.jsx';
import MealPlanDetail from './features/weekly_meal_planner/MealPlanDetail.jsx';
import ProgressTracker from './features/weekly_planner_prediction/ProgressTracker.jsx';
import ShoppingOptimizer from './features/shopping/ShoppingOptimizer.jsx';
//  import { Routes, Route, Navigate } from 'react-router-dom';
import NutritionDashboard from "./features/nutrition/pages/NutritionDashboard";

function AppContent() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<MealDashboard activePage="dashboard" />} />
          <Route path="/landing" element={<MealDashboard activePage="dashboard" />} />
          <Route path="/health-dashboard" element={<Dashboard />} />
          <Route path="/health-dashboard/profiles" element={<HealthProfiles />} />
          <Route path="/health-dashboard/create-profile" element={<Navigate to="/questionnaire/comprehensive" replace />} />
          <Route path="/health-dashboard/profile/:profileId" element={<ProfileDetails />} />
          <Route path="/questionnaire/comprehensive" element={<HealthQuestionnaire />} />
          <Route path="/ai-food-allergies/questionnaire" element={<QuestionnairePage />} />
          <Route path="/ai-food-allergies/results" element={<ResultsPage />} />
          <Route path="/meals" element={<MealDashboard activePage="meal-gallery"><MealGallery /></MealDashboard>} />
          <Route path="/meal/:mealId" element={<MealDashboard activePage="meal-gallery"><MealDetail /></MealDashboard>} />
          <Route path="/edit-meal/:mealId" element={<MealDashboard activePage="meal-gallery"><EditMeal /></MealDashboard>} />
          <Route path="/add-meal" element={<MealDashboard activePage="add-meal"><AddMeal /></MealDashboard>} />
          <Route path="/meal-guidelines" element={<MealDashboard activePage="meal-guidelines"><MealGuidelines /></MealDashboard>} />

          <Route path="/meal-planner" element={<MealDashboard activePage="meal-planner"><WeeklyMealPlanner /></MealDashboard>} />
          <Route path="/meal-planner/:planId" element={<MealDashboard activePage="meal-planner"><MealPlanDetail /></MealDashboard>} />
          <Route path="/progress" element={<MealDashboard activePage="progress"><ProgressTracker /></MealDashboard>} />
          <Route path="/shopping-optimizer" element={<MealDashboard activePage="shopping-optimizer"><ShoppingOptimizer /></MealDashboard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/nutrition" element={<MealDashboard activePage="nutrition-tracker"><NutritionDashboard /></MealDashboard>} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;