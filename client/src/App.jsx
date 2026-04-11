import { useState, useEffect } from 'react';
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
//  import { Routes, Route, Navigate } from 'react-router-dom';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  // Show loading while checking authentication
  if (loading) {
    return (
      // <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes - only accessible when not authenticated */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<LoginPage onSwitchToRegister={() => setCurrentPage('register')} />} />
          <Route path="/register" element={<RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
      
      {/* Protected routes - only accessible when authenticated */}
      {isAuthenticated && (
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
      {/* Commented out duplicate routes - moved inside authenticated block above */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      {/* <Route path="/meal-planner" element={ */}
      {/*   isAuthenticated ? <WeeklyMealPlanner /> : <Navigate to="/login" replace /> */}
      {/* } /> */}
      {/* <Route path="/meal-planner/:planId" element={ */}
      {/*   isAuthenticated ? <MealPlanDetail /> : <Navigate to="/login" replace /> */}
      {/* } /> */}
      {/* <Route path="/progress" element={ */}
      {/*   isAuthenticated ? <ProgressTracker /> : <Navigate to="/login" replace /> */}
      {/* } /> */}
      {/* <Route path="/" element={ */}
      {/*   isAuthenticated ? <Landing /> : <Navigate to="/login" replace /> */}
      {/* } /> */}
      {/* <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} /> */}
    </Routes>
  );
}

function App() {
  return (
    // <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    // </Router>
  );
}

export default App;