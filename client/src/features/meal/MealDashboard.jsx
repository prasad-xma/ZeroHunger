import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/layouts/SidebarLayout';
import {
  Utensils,
  Plus,
  TrendingUp,
  Clock,
  Activity,
  ChefHat,
  Flame,
  Target,
  Coffee,
  Heart,
  ArrowRight,
  Leaf,
  Star,
  Brain,
  Zap
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

const MealDashboard = ({ children, activePage = 'dashboard' }) => {
  const [counters, setCounters] = useState({
    meals: 0,
    calories: 0,
    avgCalories: 0,
    goalProgress: 0
  });

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

  return (
    <SidebarLayout activePage={activePage}>
      <div className="max-w-7xl mx-auto p-6">
        {activePage === 'dashboard' ? (
          /* Meal Dashboard Content */
          <div className="min-h-screen">
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
                          className="w-full h-72 rounded-2xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-700" />
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
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
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
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
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
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
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
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
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
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg group">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 transition-transform duration-300">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      Daily Nutrition Tips
                    </h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Updated</span>
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
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg group">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 transition-transform duration-300">
                        <ChefHat className="w-4 h-4 text-white" />
                      </div>
                      Smart Meal Planning
                    </h2>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Pro Tip</span>
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
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
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

              {/* Recommended Actions Section */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg">
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Other content (children) */
          <>{children}</>
        )}
      </div>
    </SidebarLayout>
  );
};

export default MealDashboard;
