import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage from './features/auth/Login.jsx';
import RegisterPage from './features/auth/Register.jsx';
import Landing from './features/landing/Landing.jsx';
import Dashboard from './features/health_dashboard/Dashboard.jsx';
import HealthProfiles from './features/health_dashboard/HealthProfiles.jsx';
import ProfileDetails from './features/health_dashboard/ProfileDetails.jsx';
import HealthQuestionnaire from './features/questionnaire/ComprehensiveQuestionnaire.jsx';
import QuestionnairePage from './features/ai_food_allergies/Questionnaire.jsx';
import ResultsPage from './features/ai_food_allergies/Results.jsx';

import WeeklyMealPlanner from './features/weekly_meal_planner/WeeklyMealPlanner.jsx';
import MealPlanDetail from './features/weekly_meal_planner/MealPlanDetail.jsx';
import ProgressTracker from './features/weekly_planner_prediction/ProgressTracker.jsx';
import ShoppingOptimizer from './features/shopping/ShoppingOptimizer.jsx';

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
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/health-dashboard" element={<Dashboard />} />
          <Route path="/health-dashboard/profiles" element={<HealthProfiles />} />
          <Route path="/health-dashboard/profile/:profileId" element={<ProfileDetails />} />
          <Route path="/questionnaire/comprehensive" element={<HealthQuestionnaire />} />
          <Route path="/ai-food-allergies/questionnaire" element={<QuestionnairePage />} />
          <Route path="/ai-food-allergies/results" element={<ResultsPage />} />

          <Route path="/meal-planner" element={<WeeklyMealPlanner />} />
          <Route path="/meal-planner/:planId" element={<MealPlanDetail />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/shopping-optimizer" element={<ShoppingOptimizer />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;