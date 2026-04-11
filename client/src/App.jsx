import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import LoginPage from './features/auth/Login.jsx';
import RegisterPage from './features/auth/Register.jsx';
import Landing from './features/landing/Landing.jsx';
import ShoppingOptimizer from './features/shopping/ShoppingOptimizer.jsx';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const { currentPage } = useNavigation();
  const [authPage, setAuthPage] = useState('register');

  // Show loading while checking authentication
  if (loading) {
    return (
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

  // If authenticated, show appropriate page based on navigation
  if (isAuthenticated) {
    if (currentPage === 'shopping-optimizer') {
      return <ShoppingOptimizer />;
    }
    return <Landing />;
  }

  // If not authenticated, show login/register pages
  return (
    <div className="min-h-screen">
      {authPage === 'login' ? (
        <LoginPage onSwitchToRegister={() => setAuthPage('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />
      )}
    </div>
  );
}

function AppContentWrapper() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContentWrapper />
    </AuthProvider>
  );
}

export default App;