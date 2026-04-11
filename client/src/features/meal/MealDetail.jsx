import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mealService } from '../../services/mealService';
import { addMealToShopping } from '../../services/shoppingService';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Clock, 
  Users, 
  ChefHat, 
  Flame, 
  Target, 
  Award, 
  Heart, 
  Star,
  Zap,
  TrendingUp,
  Activity,
  Calendar,
  Utensils,
  Timer
} from 'lucide-react';
//

const MealDetail = ({ onNavigate }) => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shoppingMessage, setShoppingMessage] = useState('');
  const [shoppingLoading, setShoppingLoading] = useState(false);

  useEffect(() => {
    fetchMealDetail();
  }, [mealId]);

  const fetchMealDetail = async () => {
    try {
      setLoading(true);
      const response = await mealService.getMealById(mealId);
      setMeal(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch meal details');
      console.error('Error fetching meal detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async () => {
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    try {
      await mealService.deleteMeal(mealId);
      navigate('/meals');
    } catch (err) {
      setError('Failed to delete meal');
      console.error('Error deleting meal:', err);
    }
  };

  const handleAddToShoppingList = async () => {
    setShoppingLoading(true);
    setShoppingMessage('');
    
    try {
      const result = await addMealToShopping(mealId);
      if (result.success) {
        setShoppingMessage('Ingredients added to shopping list successfully!');
      } else {
        setShoppingMessage(result.error || 'Failed to add ingredients to shopping list');
      }
    } catch (err) {
      setShoppingMessage('Failed to add ingredients to shopping list');
      console.error('Error adding to shopping list:', err);
    } finally {
      setShoppingLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setShoppingMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <ChefHat className="absolute top-0 right-0 w-6 h-6 text-orange-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-2">Loading Meal Details</p>
            <p className="text-gray-600">Preparing your culinary experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex justify-center items-center p-6">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-red-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600">Error Loading Meal</h3>
              <p className="text-sm text-red-500">Something went wrong</p>
            </div>
          </div>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/meals')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex justify-center items-center p-6">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-orange-100">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Meal Not Found</h3>
          <p className="text-gray-600 mb-8">The meal you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/meals')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Enhanced Back Button */}
        <button
          onClick={() => navigate('/meals')}
          className="group flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 mb-8"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
          <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">Back to Gallery</span>
        </button>

        {/* Enhanced Hero Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-8 border border-orange-100">
          {/* Hero Image with Enhanced Overlay */}
          <div className="relative h-96 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/1200x400/FEF3C7/92400E?text=${encodeURIComponent(meal.name)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Floating Enhanced Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full">
                      <span className="text-sm font-medium text-green-300">Fresh Recipe</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-3 leading-tight">{meal.name}</h1>
                  <p className="text-base text-white/90 max-w-2xl leading-relaxed">{meal.description}</p>
                </div>
                <div className="ml-8">
                  <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-300" />
                      <span className="text-sm font-medium text-orange-300">Calories</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{meal.nutrition?.calories || 0}</p>
                    <p className="text-sm text-white/80">per serving</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-4 p-8 border-b border-gray-100">
            <button
              onClick={() => navigate(`/edit-meal/${meal._id}`)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              <Edit3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Edit Recipe
            </button>
            <button
              onClick={handleAddToShoppingList}
              disabled={shoppingLoading}
              className="px-6 py-4 bg-green-50 text-green-600 font-bold rounded-2xl hover:bg-green-100 transition-all duration-300 border border-green-100 flex items-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shoppingLoading ? (
                <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
              ) : (
                <Utensils className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              )}
              {shoppingLoading ? 'Adding...' : 'Add Ingredients'}
            </button>
            <button
              onClick={handleDeleteMeal}
              className="px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all duration-300 border border-red-100 flex items-center group"
            >
              <Trash2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Delete
            </button>
          </div>

          {/* Shopping List Message */}
          {shoppingMessage && (
            <div className={`mx-8 mb-4 p-4 rounded-xl border ${shoppingMessage.includes('success') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <p className="text-sm font-medium">{shoppingMessage}</p>
            </div>
          )}

          {/* Enhanced Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Ingredients & Instructions */}
              <div className="lg:col-span-2 space-y-8">
                {/* Enhanced Serving Size Card */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-100 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-600">Serving Size</p>
                        <p className="text-2xl font-bold text-gray-800">{meal.servingSizeGrams}g</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Perfect for</p>
                      <p className="text-base font-bold text-orange-600">1 person</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Ingredients Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Ingredients</h2>
                    <div className="ml-auto px-3 py-1 bg-orange-100 rounded-full">
                      <span className="text-sm font-bold text-orange-600">{meal.ingredients?.length || 0} items</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {meal.ingredients?.map((ingredient, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-5 flex items-center justify-between border border-orange-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-base">{ingredient.name}</p>
                            <p className="text-sm text-gray-600 font-medium">{ingredient.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-orange-200">
                          <p className="text-base font-bold text-orange-500">{ingredient.calories}</p>
                          <p className="text-xs text-gray-500">calories</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Instructions Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Cooking Instructions</h2>
                    <div className="ml-auto px-3 py-1 bg-amber-100 rounded-full">
                      <span className="text-sm font-bold text-amber-600">{meal.instructions?.length || 0} steps</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {meal.instructions?.map((instruction, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl p-5 border border-amber-100 group-hover:shadow-md transition-all duration-300">
                          <p className="text-gray-700 leading-relaxed">{instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>

              {/* Right Column - Enhanced Nutrition & Stats */}
              <div className="space-y-6">
                {/* Enhanced Nutrition Information */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-100 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Nutrition Facts</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-5 border border-orange-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Flame className="w-4 h-4 text-orange-600" />
                          </div>
                          <p className="font-semibold text-gray-700">Calories</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-500">{meal.nutrition?.calories || 0}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-white rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Target className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="font-semibold text-gray-700">Protein</p>
                          </div>
                          <p className="text-lg font-bold text-blue-500">{meal.nutrition?.protein || 0}g</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                              <Zap className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="font-semibold text-gray-700">Carbs</p>
                          </div>
                          <p className="text-lg font-bold text-green-500">{meal.nutrition?.carbs || 0}g</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                              <Heart className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="font-semibold text-gray-700">Fat</p>
                          </div>
                          <p className="text-lg font-bold text-purple-500">{meal.nutrition?.fat || 0}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Stats */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Quick Stats</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Utensils className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Ingredients</span>
                      </div>
                      <span className="font-bold text-gray-800 text-base">{meal.ingredients?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Timer className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Instructions</span>
                      </div>
                      <span className="font-bold text-gray-800 text-base">{meal.instructions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Created</span>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        {new Date(meal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-100 shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Chef's Notes</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span>Fresh ingredients recommended</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>Prep time: 15 minutes</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>Serves: 1 person</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MealDetail;
