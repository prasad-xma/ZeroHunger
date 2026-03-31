
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './features/auth/Login.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <LoginPage />
      </div>
    </AuthProvider>
  );
}

export default App;
