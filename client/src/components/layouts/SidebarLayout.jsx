import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Utensils,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Activity,
  ChefHat,
  Moon,
  Sun,
  Calendar,
  ShoppingCart,
  Apple
} from 'lucide-react';

const SidebarLayout = ({ children, activePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      description: 'Comprehensive guidelines'
    },
    { 
      id: 'nutrition-tracker', 
      label: 'Nutrition Tracker', 
      icon: Apple, 
      description: 'Track your nutrition'
    },
    { 
      id: 'add-meal', 
      label: 'Add Meal', 
      icon: Plus,
      description: 'Create new meal'
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: LogOut,
      description: 'Sign out'
    },
  ];

  const handleMenuClick = async (itemId) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/');
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
      case 'meal-gallery':
        navigate('/meals');
        break;
      case 'meal-guidelines':
        navigate('/meal-guidelines');
        break;
      case 'add-meal':
        navigate('/add-meal');
        break;
      case 'nutrition-tracker':
        navigate('/nutrition');
        break;
      case 'logout':
        try {
          await logout();
          navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
        break;
      default:
        console.warn(`No navigation handler for ${itemId}`);
        break;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50'}`}>
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-10 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000 pointer-events-none"></div>

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

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-64 h-screen bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out border-r border-orange-100 overflow-hidden flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
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
                        : 'text-gray-600 hover:bg-orange-50 hover:text-gray-800 hover:scale-[1.02]'
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
                          <p className="font-bold text-sm tracking-tight">{item.label}</p>
                          <p className={`text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
