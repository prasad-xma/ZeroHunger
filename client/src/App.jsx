import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './features/auth/Login.jsx';
import RegisterPage from './features/auth/Register.jsx';
import Landing from './features/landing/Landing.jsx';
import Dashboard from './features/health_dashboard/Dashboard.jsx';
import HealthQuestionnaire from './features/questionnaire/ComprehensiveQuestionnaire.jsx';
import QuestionnairePage from './features/ai_food_allergies/Questionnaire.jsx';
import ResultsPage from './features/ai_food_allergies/Results.jsx';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('register');

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center">
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
          <Route path="/questionnaire/comprehensive" element={<HealthQuestionnaire />} />
          <Route path="/ai-food-allergies/questionnaire" element={<QuestionnairePage />} />
          <Route path="/ai-food-allergies/results" element={<ResultsPage />} />
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