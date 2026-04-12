import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { weeklyMealService } from '../../services/weeklyMealService';
import { mealService } from '../../services/mealService';
import { Calendar, Plus, Edit, Trash2, CheckCircle, Circle, X, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import WeeklySummary from './WeeklySummary';

const MealPlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meals');
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [showUpdateFoodForm, setShowUpdateFoodForm] = useState(false);
  const [updateFoodData, setUpdateFoodData] = useState({
    dayName: '',
    mealType: '',
    foodIndex: null,
    grams: ''
  });
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [foodFormData, setFoodFormData] = useState({
    day: '',
    mealType: '',
    name: '',
    grams: '',
    image: '',
    calories: 0
  });

  // Helper function to format goal display
  const formatGoal = (goal) => {
    const goalMap = {
      'weight_loss': 'Weight Loss',
      'muscle_gain': 'Muscle Gain',
      'maintenance': 'Maintenance'
    };
    return goalMap[goal] || goal;
  };

  // Fetch meals from database
  const fetchMeals = async () => {
    try {
      setMealsLoading(true);
      const response = await mealService.getAllMeals();
      setMeals(response.data || response);
    } catch (error) {
      console.error('Error fetching meals:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setMealsLoading(false);
    }
  };

  // Fetch plan details and meals
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await weeklyMealService.getPlanById(planId);
        setPlan(response.data || response);
      } catch (error) {
        console.error('Error fetching plan:', error);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
    fetchMeals();
  }, [planId]);

  // Add food to meal
  const addFood = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding food with data:', foodFormData);
      await weeklyMealService.addFood(planId, foodFormData);
      setFoodFormData({ day: '', mealType: '', name: '', grams: '', image: '', calories: 0 });
      setShowAddFoodForm(false);
      // Refresh plan data
      const response = await weeklyMealService.getPlanById(planId);
      setPlan(response.data || response);
    } catch (error) {
      console.error('Error adding food:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Mark meal as complete
  const markMealComplete = async (dayName, mealType) => {
    try {
      // Get current completion status and toggle it
      const currentMeal = plan.days.find(d => d.day === dayName)?.meals[mealType];
      const newCompletedStatus = !currentMeal?.isCompleted;
      
      await weeklyMealService.completeMeal(planId, {
        day: dayName,
        mealType,
        isCompleted: newCompletedStatus
      });
      // Refresh plan data
      const response = await weeklyMealService.getPlanById(planId);
      setPlan(response.data || response);
    } catch (error) {
      console.error('Error marking meal complete:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const removeFood = async (dayName, mealType, foodIndex) => {
    try {
      await weeklyMealService.removeFood(planId, {
        day: dayName,
        mealType,
        foodIndex
      });
      // Refresh plan data
      const response = await weeklyMealService.getPlanById(planId);
      setPlan(response.data || response);
    } catch (error) {
      console.error('Error removing food:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const updateFood = async (e) => {
    e.preventDefault();
    console.log('Update food form submitted with data:', updateFoodData);
    try {
      const result = await weeklyMealService.updateFood(planId, {
        day: updateFoodData.dayName,
        mealType: updateFoodData.mealType,
        foodIndex: updateFoodData.foodIndex,
        grams: parseInt(updateFoodData.grams)
      });
      console.log('Update food successful:', result);
      
      // Always close the modal regardless of success
      setUpdateFoodData({ dayName: '', mealType: '', foodIndex: null, grams: '' });
      setShowUpdateFoodForm(false);
      
      // Refresh plan data
      const response = await weeklyMealService.getPlanById(planId);
      setPlan(response.data || response);
      console.log('Plan data refreshed');
    } catch (error) {
      console.error('Error updating food:', error);
      // Still close the modal even on error
      setShowUpdateFoodForm(false);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-lg">Loading meal plan...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-lg">Meal plan not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header section with gradient background */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white/90 hover:text-white transition-colors flex items-center gap-2 font-medium z-10"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Meal Plan Details</h1>
                  <p className="text-orange-100">Week of {new Date(plan.weekStartDate).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-orange-500">
                      {formatGoal(plan.goal)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <div className="p-6 bg-white flex justify-end">
            <button
              onClick={() => navigate('/meal-planner')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('meals')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === 'meals'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              🍽️ Meals
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === 'summary'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              📊 Summary
            </button>
          </div>

          {/* Meals Tab */}
          {activeTab === 'meals' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Weekly Meals</h2>
                <button
                  onClick={() => setShowAddFoodForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food
                </button>
              </div>

              <div className="space-y-6">
                {plan.days?.map((day, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      {day.day}
                    </h3>

                    {/* Breakfast */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          🍳 Breakfast
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markMealComplete(day.day, 'breakfast')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              day.meals.breakfast.isCompleted
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {day.meals.breakfast.isCompleted ? (
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                            ) : (
                              <Circle className="w-4 h-4 inline mr-1" />
                            )}
                            {day.meals.breakfast.isCompleted ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {day.meals.breakfast.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="flex justify-between items-center bg-white p-3 rounded-xl hover:shadow-md transition-all">
                            <div className="flex items-center space-x-3">
                              {food.image ? (
                                <img 
                                  src={food.image} 
                                  alt={food.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/48x48/ff6b6b/ffffff?text=Food';
                                  }}
                                />
                              ) : (
                                <img 
                                  src="https://via.placeholder.com/48x48/cccccc/666666?text=No+Img"
                                  alt="No image"
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                />
                              )}
                              <span className="text-gray-900">{food.name} - <span className="text-orange-600 font-medium">{food.grams}g</span></span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  const currentFood = plan.days.find(d => d.day === day.day)?.meals['breakfast']?.foods[foodIndex];
                                  if (currentFood) {
                                    setUpdateFoodData({
                                      dayName: day.day,
                                      mealType: 'breakfast',
                                      foodIndex: foodIndex,
                                      grams: currentFood.grams.toString()
                                    });
                                    setShowUpdateFoodForm(true);
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeFood(day.day, 'breakfast', foodIndex)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          🥗 Lunch
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markMealComplete(day.day, 'lunch')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              day.meals.lunch.isCompleted
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {day.meals.lunch.isCompleted ? (
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                            ) : (
                              <Circle className="w-4 h-4 inline mr-1" />
                            )}
                            {day.meals.lunch.isCompleted ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {day.meals.lunch.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="flex justify-between items-center bg-white p-3 rounded-xl hover:shadow-md transition-all">
                            <div className="flex items-center space-x-3">
                              {food.image ? (
                                <img 
                                  src={food.image} 
                                  alt={food.name}
                                  className="w-12 h-12 rounded-lg object-cover border-gray-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/48x48/ff6b6b/ffffff?text=Food';
                                  }}
                                />
                              ) : (
                                <img 
                                  src="https://via.placeholder.com/48x48/cccccc/666666?text=No+Img"
                                  alt="No image"
                                  className="w-12 h-12 rounded-lg object-cover border-gray-200"
                                />
                              )}
                              <span className="text-gray-900">{food.name} - <span className="text-orange-600 font-medium">{food.grams}g</span></span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  const currentFood = plan.days.find(d => d.day === day.day)?.meals['lunch']?.foods[foodIndex];
                                  if (currentFood) {
                                    setUpdateFoodData({
                                      dayName: day.day,
                                      mealType: 'lunch',
                                      foodIndex: foodIndex,
                                      grams: currentFood.grams.toString()
                                    });
                                    setShowUpdateFoodForm(true);
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeFood(day.day, 'lunch', foodIndex)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    {/* </div>
                      </div> */}
                    </div>

                    {/* Dinner */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          🍽 Dinner
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markMealComplete(day.day, 'dinner')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              day.meals.dinner.isCompleted
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {day.meals.dinner.isCompleted ? (
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                            ) : (
                              <Circle className="w-4 h-4 inline mr-1" />
                            )}
                            {day.meals.dinner.isCompleted ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {day.meals.dinner.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="flex justify-between items-center bg-white p-3 rounded-xl hover:shadow-md transition-all">
                            <div className="flex items-center space-x-3">
                              {food.image ? (
                                <img 
                                  src={food.image} 
                                  alt={food.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/48x48/ff6b6b/ffffff?text=Food';
                                  }}
                                />
                              ) : (
                                <img 
                                  src="https://via.placeholder.com/48x48/cccccc/666666?text=No+Img"
                                  alt="No image"
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                />
                              )}
                              <span className="text-gray-900">{food.name} - <span className="text-orange-600 font-medium">{food.grams}g</span></span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  const currentFood = plan.days.find(d => d.day === day.day)?.meals['dinner']?.foods[foodIndex];
                                  if (currentFood) {
                                    setUpdateFoodData({
                                      dayName: day.day,
                                      mealType: 'dinner',
                                      foodIndex: foodIndex,
                                      grams: currentFood.grams.toString()
                                    });
                                    setShowUpdateFoodForm(true);
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeFood(day.day, 'dinner', foodIndex)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <WeeklySummary plan={plan} />
          )}
        </div>
      </div>

      {/* Add Food Modal with beautiful blur background */}
      {showAddFoodForm && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md  flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-96 transform transition-all">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 -m-8 mb-6 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white text-center">Add Food to Meal</h2>
            </div>
            
            <form onSubmit={addFood} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day
                </label>
                <select
                  value={foodFormData.day}
                  onChange={(e) => setFoodFormData({...foodFormData, day: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Day</option>
                  {plan.days?.map((day, index) => (
                    <option key={index} value={day.day}>{day.day}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={foodFormData.mealType}
                  onChange={(e) => setFoodFormData({...foodFormData, mealType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Food
                </label>
                <select
                  value={foodFormData.name}
                  onChange={(e) => {
                    const selectedMeal = meals.find(meal => meal.name === e.target.value);
                    console.log('Selected meal:', selectedMeal);
                    const updatedFormData = {
                      ...foodFormData, 
                      name: e.target.value,
                      image: selectedMeal?.image || '',
                      calories: selectedMeal?.nutrition?.calories || 0
                    };
                    console.log('Updated form data:', updatedFormData);
                    setFoodFormData(updatedFormData);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                  disabled={mealsLoading}
                >
                  <option value="">Choose a food...</option>
                  {meals.map((meal) => (
                    <option key={meal._id} value={meal.name}>
                      {meal.name} ({meal.nutrition?.calories || 0} cal)
                    </option>
                  ))}
                </select>
                {mealsLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading meals...</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grams
                </label>
                <input
                  type="number"
                  value={foodFormData.grams}
                  onChange={(e) => setFoodFormData({...foodFormData, grams: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter grams"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddFoodForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Update Food Modal */}
      {showUpdateFoodForm && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md  flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-96 transform transition-all">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 -m-8 mb-6 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white text-center">Update Food Grams</h2>
            </div>
            
            <form onSubmit={updateFood} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Food: {plan.days.find(d => d.day === updateFoodData.dayName)?.meals[updateFoodData.mealType]?.foods[updateFoodData.foodIndex]?.name || 'Unknown'}
                </label>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grams
                </label>
                <input
                  type="number"
                  value={updateFoodData.grams}
                  onChange={(e) => setUpdateFoodData({...updateFoodData, grams: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter grams"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateFoodForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Update Grams
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanDetail;