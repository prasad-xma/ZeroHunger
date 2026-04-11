import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  Star,
  Flame,
  Target,
  Coffee,
  Heart,
  ArrowRight,
  PieChart,
  ChevronDown,
  Calendar,
  Award,
  Brain,
  Zap,
  Leaf,
  ShoppingCart
} from 'lucide-react';

// Add custom styles for animations
const customStyles = `
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes growBar {
    from {
      width: 0;
    }
    to {
      width: var(--final-width);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const MealDashboard = ({ children, activePage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [counters, setCounters] = useState({
    meals: 0,
    calories: 0,
    avgCalories: 0,
    goalProgress: 0
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate counters
    const timer = setTimeout(() => {
      setCounters({
        meals: 24,
        calories: 1850,
        avgCalories: 425,
        goalProgress: 87
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Meal Dashboard',
      icon: Home,
      description: 'Overview & Stats'
    },
    {
      id: 'health-dashboard',
      label: 'Health Dashboard',
      icon: Activity,
      description: 'Health Metrics & Profiles'
    },
    {
      id: 'meal-planner',
      label: 'Weekly Meal Planner',
      icon: Calendar,
      description: 'Plan your weekly meals'
    },
    {
      id: 'progress',
      label: 'Progress Tracker',
      icon: TrendingUp,
      description: 'Track goals & predictions'
    },
    {
      id: 'shopping-optimizer',
      label: 'Shopping Optimizer',
      icon: ShoppingCart,
      description: 'Smart shopping lists'
    },
    {
      id: 'meal-gallery',
      label: 'Meal Gallery',
      icon: Utensils,
      description: 'Browse all meals'
    },
    {
      id: 'meal-guidelines',
      label: 'Meal Guidelines',
      icon: ChefHat,
      description: 'Comprehensive meal guidelines'
    },
    {
      id: 'add-meal',
      label: 'Add Meal',
      icon: Plus,
      description: 'Create new meal'
    },
  ];

  const handleMenuClick = (itemId) => {
    // Handle different menu item clicks
    switch (itemId) {
      case 'dashboard':
        // If we are already on the meal dashboard (root), just refresh or set state
        if (onNavigate) {
          onNavigate('meals');
        } else {
          navigate('/');
        }
        break;
      case 'health-dashboard':
        navigate('/health-dashboard');
        break;
      case 'meal-planner':
        navigate('/meal-planner');
        break;
      case 'progress':
        navigate('/progress');
        break;
      case 'shopping-optimizer':
        navigate('/shopping-optimizer');
        break;
      default:
        // Navigate to other meal sub-pages if onNavigate is provided
        if (onNavigate) {
          onNavigate(itemId);
        } else {
          // Fallback if used outside Landing.jsx
          console.warn(`No navigation handler for ${itemId}`);
        }
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to dashboard after logout
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


        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-64 h-screen bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out border-r border-orange-100 overflow-hidden flex flex-col`}>
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
                      className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 transform ${isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-gray-800 hover:scale-102'
                        }`}
                    >
                      <div className="relative z-10 flex items-center space-x-3 px-4 py-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {activePage === 'dashboard' ? (
                /* Meal Dashboard Content */
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
                  {/* Animated Background Elements */}
                  <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                  </div>

                  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section with Light Colors */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-3xl opacity-90"></div>
                      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-orange-100 shadow-2xl">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mb-3 shadow-xl animate-bounce">
                            <Utensils className="w-8 h-8 text-white" />
                          </div>
                          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
                            Welcome to Your Meal Dashboard
                          </h1>
                          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
                            Track nutrition, analyze patterns, and achieve your health goals with comprehensive meal insights
                          </p>

                          {/* Beautiful Big Flat Image */}
                          <div className="flex justify-center mb-4">
                            <div className="relative group w-full">
                              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=300&fit=crop&crop=center"
                                alt="Gourmet Healthy Meal"
                                className="w-full h-72 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 to-transparent rounded-2xl"></div>
                              <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                                  <p className="text-lg font-bold text-gray-800">Gourmet Healthy Meals</p>
                                  <p className="text-sm text-gray-600">Your journey to better nutrition starts here</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Summary Stats */}
                          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-xs">On Track Today</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-xs">7 Day Streak</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-xs">85% Goal Progress</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards with Modern Design */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl group-hover:blur-0"></div>
                        <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                              <Utensils className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{counters.meals}</h3>
                          <p className="text-xs text-gray-600 font-medium">Total Meals</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                            <span>+3 this week</span>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl group-hover:blur-0"></div>
                        <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                              <Flame className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">On Target</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{counters.calories}</h3>
                          <p className="text-xs text-gray-600 font-medium">Daily Calories</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Target className="w-3 h-3 mr-1 text-orange-500" />
                            <span>Goal: 2000</span>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl group-hover:blur-0"></div>
                        <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Healthy</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{counters.avgCalories}</h3>
                          <p className="text-xs text-gray-600 font-medium">Avg Calories/Meal</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                            <span>Optimal range</span>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl group-hover:blur-0"></div>
                        <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">+5%</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{counters.goalProgress}%</h3>
                          <p className="text-xs text-gray-600 font-medium">Goal Progress</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Activity className="w-3 h-3 mr-1 text-orange-500" />
                            <span>Great progress!</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informative Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Nutrition Tips Section */}
                      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            Daily Nutrition Tips
                          </h2>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium animate-pulse">Updated</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm">Stay Hydrated</h3>
                              <p className="text-xs text-gray-600 mt-1">Drink at least 8 glasses of water daily to maintain optimal metabolism and energy levels.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm">Balance Your Macros</h3>
                              <p className="text-xs text-gray-600 mt-1">Aim for 40% carbs, 30% protein, and 30% healthy fats for optimal nutrition.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm">Eat Colorful Foods</h3>
                              <p className="text-xs text-gray-600 mt-1">Include a variety of colorful fruits and vegetables for diverse nutrients.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Meal Planning Insights */}
                      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300">
                              <ChefHat className="w-4 h-4 text-white" />
                            </div>
                            Smart Meal Planning
                          </h2>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium animate-pulse">Pro Tip</span>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800 text-sm">Prep Ahead Strategy</h3>
                              <Clock className="w-4 h-4 text-orange-500" />
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Prepare meals in batches to save time and maintain consistency.</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">75% Effective</span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800 text-sm">Portion Control</h3>
                              <Target className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Use smaller plates and measure portions to control calorie intake naturally.</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">85% Success</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Benefits Section */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                            <Activity className="w-4 h-4 text-white" />
                          </div>
                          Health Benefits of Your Current Diet
                        </h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Excellent</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-sm mb-2">Heart Health</h3>
                          <p className="text-xs text-gray-600 mb-2">Your balanced diet supports cardiovascular wellness.</p>
                          <div className="flex items-center justify-center">
                            <span className="text-green-600 font-bold text-lg">95%</span>
                            <span className="text-xs text-gray-500 ml-1">Optimal</span>
                          </div>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-sm mb-2">Brain Function</h3>
                          <p className="text-xs text-gray-600 mb-2">Nutrient-rich foods enhance cognitive performance.</p>
                          <div className="flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">88%</span>
                            <span className="text-xs text-gray-500 ml-1">Great</span>
                          </div>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-sm mb-2">Energy Levels</h3>
                          <p className="text-xs text-gray-600 mb-2">Steady energy release throughout the day.</p>
                          <div className="flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-lg">92%</span>
                            <span className="text-xs text-gray-500 ml-1">High</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          Personalized Recommendations
                        </h2>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">AI Powered</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Plus className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Add More Protein</h3>
                            <p className="text-xs text-gray-600">Consider adding lean protein sources to your breakfast for sustained energy.</p>
                            <div className="mt-2 flex items-center text-xs text-purple-600 font-medium">
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Try Greek yogurt or eggs
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Increase Fiber Intake</h3>
                            <p className="text-xs text-gray-600">Add more vegetables and whole grains to improve digestion.</p>
                            <div className="mt-2 flex items-center text-xs text-green-600 font-medium">
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Add quinoa or brown rice
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Timing Optimization</h3>
                            <p className="text-xs text-gray-600">Eat your largest meal earlier in the day for better metabolism.</p>
                            <div className="mt-2 flex items-center text-xs text-blue-600 font-medium">
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Before 3 PM recommended
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Coffee className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Smart Snacking</h3>
                            <p className="text-xs text-gray-600">Choose nutrient-dense snacks between meals to maintain energy.</p>
                            <div className="mt-2 flex items-center text-xs text-orange-600 font-medium">
                              <ArrowRight className="w-3 h-3 mr-1" />
                            </div>
                            <div className="absolute top-1/2 -right-2 -translate-y-1/2 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded-lg group hover:bg-orange-100 transition-colors cursor-pointer">
                            <div className="text-xs text-gray-600">Water</div>
                            <div className="text-sm font-bold text-orange-600">2.1L</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comprehensive Meal Management Overview */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <ChefHat className="w-4 h-4 text-white" />
                        </div>
                        Complete Meal Management Overview
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Utensils className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Total</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">247</div>
                          <div className="text-xs text-gray-600">Total Meals</div>
                          <div className="mt-2 text-xs text-blue-600 font-medium">+12 this week</div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Healthy</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">189</div>
                          <div className="text-xs text-gray-600">Healthy Options</div>
                          <div className="mt-2 text-xs text-green-600 font-medium">76.5% ratio</div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                              <Flame className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Calories</span>
                          </div>
                          <div className="text-2xl font-bold text-orange-600">450</div>
                          <div className="text-xs text-gray-600">Avg Calories</div>
                          <div className="mt-2 text-xs text-orange-600 font-medium">Per meal</div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Star className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Rating</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-600">4.8</div>
                          <div className="text-xs text-gray-600">Avg Rating</div>
                          <div className="mt-2 text-xs text-purple-600 font-medium">User reviews</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            Meal Categories Distribution
                          </h3>
                          <div className="space-y-3">
                            {[
                              { name: 'Breakfast', count: 62, percentage: 25, color: 'from-blue-500 to-indigo-600' },
                              { name: 'Lunch', count: 89, percentage: 36, color: 'from-green-500 to-emerald-600' },
                              { name: 'Dinner', count: 71, percentage: 29, color: 'from-orange-500 to-amber-600' },
                              { name: 'Snacks', count: 25, percentage: 10, color: 'from-purple-500 to-pink-600' }
                            ].map((category, index) => (
                              <div key={category.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full`}></div>
                                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${category.color} rounded-full`} style={{ width: `${category.percentage}%` }}></div>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">{category.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2">
                              <Leaf className="w-3 h-3 text-white" />
                            </div>
                            Dietary Preferences
                          </h3>
                          <div className="space-y-3">
                            {[
                              { name: 'Vegetarian', count: 45, percentage: 18, color: 'from-green-500 to-emerald-600' },
                              { name: 'Vegan', count: 28, percentage: 11, color: 'from-green-600 to-teal-600' },
                              { name: 'Gluten-Free', count: 37, percentage: 15, color: 'from-amber-500 to-orange-600' },
                              { name: 'Keto-Friendly', count: 22, percentage: 9, color: 'from-purple-500 to-indigo-600' },
                              { name: 'High-Protein', count: 89, percentage: 36, color: 'from-red-500 to-pink-600' },
                              { name: 'Low-Carb', count: 26, percentage: 11, color: 'from-blue-500 to-cyan-600' }
                            ].map((diet, index) => (
                              <div key={diet.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`w-3 h-3 bg-gradient-to-r ${diet.color} rounded-full`}></div>
                                  <span className="text-sm font-medium text-gray-700">{diet.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${diet.color} rounded-full`} style={{ width: `${diet.percentage}%` }}></div>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{diet.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Feed with Timeline */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-orange-600" />
                        Recent Activity Timeline
                      </h2>
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-amber-600"></div>

                        <div className="space-y-4">
                          <div className="flex items-start relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-md z-10 relative">
                              <Utensils className="w-5 h-5 text-white" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                            </div>
                            <div className="ml-4 flex-1 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Grilled Chicken Salad</h4>
                                  <p className="text-xs text-gray-600 mb-1">High protein ? 450 calories ? Perfect macros balance</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>2 hours ago</span>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">High Protein</span>
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Balanced</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md z-10">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4 flex-1 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Weekly Goal Achieved! ?</h4>
                                  <p className="text-xs text-gray-600 mb-1">7-day streak ? 87% overall progress ? Excellent consistency!</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>Yesterday</span>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Achievement</span>
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">7 Day Streak ?</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Other content (children) */
                <>{children}</>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MealDashboard;
