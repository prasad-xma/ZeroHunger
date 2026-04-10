import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart, 
  Activity, 
  Utensils, 
  TrendingUp, 
  Shield, 
  Target,
  ArrowRight,
  LogOut,
  User,
  Settings
} from 'lucide-react';

const Landing = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health Profile Management",
      description: "Create and manage personalized health profiles with detailed metrics and recommendations.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "AI Food Allergies",
      description: "Get AI-powered allergy recommendations and safe food alternatives based on your allergies.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Dashboard",
      description: "Visualize your health metrics with interactive charts and track your progress over time.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Personalized Nutrition",
      description: "Receive tailored meal plans and nutrition advice based on your health goals.",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const quickActions = [
    {
      title: "Create Health Profile",
      description: "Start your health journey with a personalized profile",
      icon: <Target className="w-6 h-6" />,
      href: "/questionnaire/comprehensive",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Food Allergy Assessment",
      description: "Get AI-powered recommendations for your allergies",
      icon: <Shield className="w-6 h-6" />,
      href: "/ai-food-allergies/questionnaire",
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      title: "View Health Dashboard",
      description: "Track your health metrics and progress",
      icon: <TrendingUp className="w-6 h-6" />,
      href: "/health-dashboard",
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
      
      {/* Header */}
      <header className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ZeroHunger</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Welcome back!</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">Health Journey</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take control of your health with personalized recommendations, AI-powered insights, and comprehensive tracking tools.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-linear-to-r from-orange-500 to-amber-500 rounded-3xl shadow-xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Create your first health profile and get personalized recommendations tailored to your unique needs and goals.
          </p>
          <button
            onClick={() => navigate('/questionnaire/comprehensive')}
            className="bg-white text-orange-500 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer group"
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-orange-500 font-medium group-hover:text-orange-600 transition-colors">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
                <div className={`h-2 bg-linear-to-r ${feature.color}`}></div>
                <div className="p-6">
                  <div className={`w-16 h-16 bg-linear-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Health at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Health Profiles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Allergy Assessments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Health Metrics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Meal Plans</p>
            </div>
          </div>
        </div>

        </main>

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>ZeroHunger - Your Health Companion</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            <p className="text-gray-400 text-xs">
              © 2026 ZeroHunger. Empowering your health journey with AI-powered insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
