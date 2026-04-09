import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Utensils, 
  Plus, 
  Search, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  TrendingUp,
  Clock,
  Activity,
  ChefHat,
  Bell,
  Moon,
  Sun,
  BarChart3,
  Star,
  Flame,
  Target,
  Coffee
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MealDashboard = ({ children, activePage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      description: 'Overview & Stats'
    },
    { 
      id: 'meals', 
      label: 'Meal Gallery', 
      icon: Utensils, 
      description: 'Browse all meals'
    },
    { 
      id: 'add-meal', 
      label: 'Add Meal', 
      icon: Plus, 
      description: 'Create new meal'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Insights & Reports'
    },
  ];

  const handleMenuClick = (itemId) => {
    onNavigate(itemId);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to dashboard page after logout
      onNavigate('dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to dashboard even if logout fails
      onNavigate('dashboard');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50'}`}>
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="flex h-screen relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group border border-orange-100"
        >
          {sidebarOpen ? (
            <X size={24} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
          ) : (
            <Menu size={24} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
          )}
        </button>

        {/* Modern Slim Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-64 h-full bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out border-r border-orange-100 overflow-hidden`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gradient-to-r from-orange-100 to-amber-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">ZeroHunger</h1>
                <p className="text-xs text-gray-600 font-medium">Smart Meal Management</p>
              </div>
            </div>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mt-3 w-full p-2 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center"
            >
              {darkMode ? <Sun size={16} className="text-orange-500" /> : <Moon size={16} className="text-gray-600" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 transform ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-gray-800 hover:scale-102'
                      }`}
                    >
                      <div className="relative z-10 flex items-center space-x-3 px-4 py-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-gradient-to-r from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200 shadow-md'
                        }`}>
                          <Icon size={18} className={isActive ? 'text-white' : 'text-orange-600'} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-sm">{item.label}</p>
                          <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-gray-100 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group border border-red-100"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Top Bar */}
          <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-orange-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {getGreeting()}!
                </h2>
                <p className="text-gray-600 font-medium">
                  {menuItems.find(item => item.id === activePage)?.description || 'Manage your meals and nutrition'}
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                {/* User Avatar */}
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MealDashboard;
