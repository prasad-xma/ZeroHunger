import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './features/auth/Login.jsx';
import RegisterPage from './features/auth/Register.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('register');

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {currentPage === 'login' ? (
          <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;