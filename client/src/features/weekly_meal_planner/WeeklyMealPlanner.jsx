import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { weeklyMealService } from '../../services/weeklyMealService';
import { Calendar, Plus, Trash2, Eye, ArrowLeft } from 'lucide-react';

const WeeklyMealPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    weekStartDate: '',
    goal: 'weight_loss'
  });
  const navigate = useNavigate();

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await weeklyMealService.getAllPlans();
      setPlans(response.data || response);
    } catch (error) {
      console.error('Error fetching plans:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new plan
  const createPlan = async (e) => {
    e.preventDefault();
    try {
      await weeklyMealService.createPlan(formData);
      setFormData({ weekStartDate: '', goal: 'weight_loss' });
      setShowCreateForm(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Delete plan
  const deletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }
    try {
      await weeklyMealService.deletePlan(planId);
      setPlans(plans.filter(p => p._id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Delete all plans
  const deleteAllPlans = async () => {
    if (!window.confirm('Are you sure you want to delete all plans? This cannot be undone.')) {
      return;
    }
    try {
      console.log('Attempting to delete all plans...');
      const result = await weeklyMealService.deleteAllPlans();
      console.log('Delete all plans result:', result);
      setPlans([]);
      alert('All plans deleted successfully!');
    } catch (error) {
      console.error('Error deleting all plans:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // View plan details
  const viewDetails = (planId) => {
    navigate(`/meal-planner/${planId}`);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-lg">Loading meal plans...</div>
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
                  <h1 className="text-3xl font-bold text-white mb-2">Weekly Meal Planner</h1>
                  <p className="text-orange-100">Plan your meals for a healthier you</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="p-6 bg-white">
            <div className="flex justify-end space-x-3">
              <button
                onClick={deleteAllPlans}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Delete All Plans
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Create New Plan
              </button>
            </div>
          </div>
        </div>

        {/* Create Plan Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm  flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 -m-8 mb-6 rounded-t-3xl">
                <h2 className="text-xl font-bold text-white text-center">Create New Meal Plan</h2>
              </div>
              
              <form onSubmit={createPlan} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.weekStartDate}
                    onChange={(e) => setFormData({...formData, weekStartDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Create Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewDetails(plan._id)}
                      className="bg-orange-500 bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all"
                      title="View Plan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* <button
                      onClick={() => deletePlan(plan._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 bg-opacity-20 text-white">
                    {plan.goal}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {plan.days?.slice(0, 3).map((day, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3">
                      <h4 className="font-medium text-gray-900 mb-2">{day.day}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>🍳 Breakfast: {day.meals.breakfast.foods.length} items</div>
                        <div>🥗 Lunch: {day.meals.lunch.foods.length} items</div>
                        <div>🍽 Dinner: {day.meals.dinner.foods.length} items</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => viewDetails(plan._id)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    View Full Plan
                  </button>
                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    Delete Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Meal Plans Yet</h3>
            <p className="text-gray-600 mb-6">Start your journey by creating your first weekly meal plan</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Create Your First Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyMealPlanner;
