import React from 'react';
import { 
  ChefHat, 
  Flame, 
  Clock, 
  Leaf, 
  Activity, 
  Heart, 
  Zap, 
  Brain, 
  Calendar,
  Award,
  Target,
  Star,
  TrendingUp,
  Utensils,
  Sparkles
} from 'lucide-react';

const MealGuidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-10 h-10 text-white" />
              <Sparkles className="absolute top-0 right-0 w-6 h-6 text-orange-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
            Comprehensive Meal Guidelines
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Master the art of meal preparation, nutrition, dietary considerations, and strategic planning with our comprehensive guide
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-orange-100">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">Expert Curated</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-amber-100">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700">Professional Standards</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-orange-100">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Goal Oriented</span>
            </div>
          </div>
        </div>

        {/* Enhanced Meal Preparation Guidelines */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-orange-100 shadow-xl mb-10 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Meal Preparation Guidelines
              </h2>
              <p className="text-gray-600 mt-1">Master essential cooking techniques and storage methods</p>
            </div>
          </div>
          
          {/* Hero Image for Meal Preparation */}
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Meal Preparation" 
              className="w-full h-48 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Cooking Methods</h3>
              </div>
              {/* Cooking Methods Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&h=200&q=80" 
                  alt="Cooking Methods" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-orange-600 transition-colors">Grilling - Best for meats and vegetables</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-orange-600 transition-colors">Steaming - Preserves nutrients perfectly</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-orange-600 transition-colors">Baking - Healthy alternative to frying</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-orange-600 transition-colors">Stir-frying - Quick and nutrient-rich</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Prep Times</h3>
              </div>
              {/* Prep Times Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&h=200&q=80" 
                  alt="Meal Prep" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Quick meals: Under 15 minutes</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Standard prep: 20-30 minutes</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Batch cooking: 45-60 minutes</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Meal prep: 2-3 hours weekly</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Storage Tips</h3>
              </div>
              {/* Storage Tips Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://picsum.photos/400/200?random=1" 
                  alt="Food Storage" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://picsum.photos/400/200?random=2";
                  }}
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Airtight containers for freshness</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Refrigerate within 2 hours</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Freeze for up to 3 months</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Label with date and contents</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Nutritional Guidelines */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-orange-100 shadow-xl mb-10 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nutritional Guidelines & Standards
              </h2>
              <p className="text-gray-600 mt-1">Optimize your nutrition with science-based recommendations</p>
            </div>
          </div>
          
          {/* Hero Image for Nutrition */}
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Nutrition" 
              className="w-full h-48 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Daily Nutritional Targets
              </h3>
              {/* Nutrition Targets Image */}
              <div className="mb-6 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Nutrition Targets" 
                  className="w-full h-40 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Calories', target: '2000', unit: 'kcal', color: 'from-orange-500 to-amber-600', icon: Flame },
                  { name: 'Protein', target: '50-75', unit: 'g', color: 'from-green-500 to-emerald-600', icon: TrendingUp },
                  { name: 'Carbohydrates', target: '225-325', unit: 'g', color: 'from-orange-400 to-amber-400', icon: Utensils },
                  { name: 'Fats', target: '44-78', unit: 'g', color: 'from-amber-500 to-orange-600', icon: Leaf },
                  { name: 'Fiber', target: '25-30', unit: 'g', color: 'from-purple-500 to-pink-500', icon: Heart },
                  { name: 'Water', target: '8-10', unit: 'glasses', color: 'from-blue-500 to-cyan-500', icon: Activity }
                ].map((nutrient, index) => (
                  <div key={nutrient.name} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${nutrient.color} rounded-xl flex items-center justify-center shadow-md`}>
                          <nutrient.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">{nutrient.name}</span>
                          <div className="text-xs text-gray-500">Recommended daily intake</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-800">{nutrient.target}</span>
                        <span className="text-sm text-gray-500 ml-1">{nutrient.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                Meal Balance Principles
              </h3>
              {/* Balance Principles Image */}
              <div className="mb-6 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Balanced Meal" 
                  className="w-full h-40 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    Plate Method
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>½ plate: Non-starchy vegetables</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>¼ plate: Lean protein sources</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>¼ plate: Whole grains/starches</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Plus: Healthy fats and fruits</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    Macro Balance
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Carbohydrates: 45-65% of calories</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Protein: 10-35% of calories</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Fats: 20-35% of calories</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Focus on whole, unprocessed foods</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    Timing Guidelines
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>3 main meals + 1-2 snacks</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Every 3-4 hours for energy</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Pre/post workout nutrition</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Consistent meal schedule</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Special Dietary Considerations */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-orange-100 shadow-xl mb-10 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Special Dietary Considerations
              </h2>
              <p className="text-gray-600 mt-1">Personalized nutrition for different dietary needs and preferences</p>
            </div>
          </div>
          
          {/* Hero Image for Dietary Considerations */}
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Special Dietary" 
              className="w-full h-48 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Vegetarian Options</h3>
              </div>
              {/* Vegetarian Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&h=200&q=80" 
                  alt="Vegetarian Food" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Complete proteins from combinations</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Iron-rich plant sources</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">B12 supplementation consideration</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-green-600 transition-colors">Omega-3 from flax/chia seeds</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Food Allergies</h3>
              </div>
              {/* Food Allergies Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&h=200&q=80" 
                  alt="Food Allergies" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Common: Nuts, dairy, gluten, shellfish</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Always read ingredient labels</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Cross-contamination prevention</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-amber-600 transition-colors">Emergency action plans</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Medical Conditions</h3>
              </div>
              {/* Medical Conditions Image */}
              <div className="mb-4 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=200&q=80" 
                  alt="Medical Nutrition" 
                  className="w-full h-32 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-blue-600 transition-colors">Diabetes: Carbohydrate management</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-blue-600 transition-colors">Hypertension: Sodium restriction</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-blue-600 transition-colors">Heart disease: Low saturated fat</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="group-hover:text-blue-600 transition-colors">Kidney disease: Protein/phosphorus</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Meal Planning Tools */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-orange-100 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Meal Planning Tools & Resources
              </h2>
              <p className="text-gray-600 mt-1">Strategic planning for efficient and effective meal management</p>
            </div>
          </div>
          
          {/* Hero Image for Meal Planning */}
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Meal Planning" 
              className="w-full h-48 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                Planning Strategies
              </h3>
              {/* Planning Strategies Image */}
              <div className="mb-6 relative overflow-hidden rounded-xl">
                <img 
                  src="https://picsum.photos/600/300?random=3" 
                  alt="Planning Strategies" 
                  className="w-full h-40 object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://picsum.photos/600/300?random=4";
                  }}
                />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-2">
                      <Calendar className="w-3 h-3 text-white" />
                    </div>
                    Weekly Planning
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Plan 7 days in advance</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Theme nights for variety</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Leftover management strategy</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Shopping list preparation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                      <ChefHat className="w-3 h-3 text-white" />
                    </div>
                    Batch Cooking
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Cook grains in bulk</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Pre-cut vegetables</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Marinate proteins ahead</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span>Portion for easy access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Smart Shopping
              </h3>
              {/* Smart Shopping Image */}
              <div className="mb-6 relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Smart Shopping" 
                  className="w-full h-40 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2">
                      <Utensils className="w-3 h-3 text-white" />
                    </div>
                    Shopping Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Shop with a list</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Buy seasonal produce</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Compare unit prices</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Stock pantry essentials</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-2">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    Budget Management
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Plan around sales</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Buy in bulk when appropriate</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Reduce food waste</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Cook from scratch</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl shadow-xl">
            <Award className="w-6 h-6 mr-3" />
            <span className="font-bold text-lg">Expert-Curated Meal Guidelines</span>
          </div>
          <p className="text-gray-600 mt-4 text-sm">Your comprehensive guide to healthy and delicious meal management</p>
        </div>
      </div>
    </div>
  );
};

export default MealGuidelines;
