import React, { useState, useEffect } from 'react';
import MealDashboard from './features/meal/MealDashboard';
import MealGallery from './features/meal/MealGallery';
import AddMeal from './features/meal/AddMeal';
import MealDetail from './features/meal/MealDetail';
import EditMeal from './features/meal/EditMeal';
import { mealService } from './services/mealService';
import { Mail, X, AlertCircle, CheckCircle, Send, Shield, TrendingUp, Flame, Target, Award, BarChart3, Activity, ChefHat, Clock, Star, Coffee } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentParams, setCurrentParams] = useState({});
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Email subscription state
  const [emailData, setEmailData] = useState({ email: '' });
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await mealService.getAllMeals();
      setMeals(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch meals');
      console.error('Error fetching meals:', err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setCurrentParams(params);
    if (page === 'dashboard' || page === 'meals') {
      fetchMeals(); // Refresh meals when returning to dashboard or meals
    }
  };

  // Calculate real statistics from meals data
  const calculateStats = () => {
    if (meals.length === 0) {
      return {
        totalMeals: 0,
        totalCalories: 0,
        avgCalories: 0,
        goalsAchieved: 0,
        todayCalories: 0,
        weeklyCalories: 0
      };
    }

    const totalMeals = meals.length;
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.nutrition?.calories || 0), 0);
    const avgCalories = totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0;
    
    // Calculate today's calories (meals created today)
    const today = new Date();
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.createdAt);
      return mealDate.toDateString() === today.toDateString();
    });
    const todayCalories = todayMeals.reduce((sum, meal) => sum + (meal.nutrition?.calories || 0), 0);
    
    // Calculate weekly calories (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyMeals = meals.filter(meal => new Date(meal.createdAt) >= weekAgo);
    const weeklyCalories = weeklyMeals.reduce((sum, meal) => sum + (meal.nutrition?.calories || 0), 0);
    
    // Simple goal calculation (if daily goal is 2000 calories)
    const goalsAchieved = weeklyMeals.filter(meal => (meal.nutrition?.calories || 0) >= 400).length;

    return {
      totalMeals,
      totalCalories,
      avgCalories,
      goalsAchieved,
      todayCalories,
      weeklyCalories
    };
  };

  const stats = calculateStats();

  // Get recent activities from actual meals
  const getRecentActivities = () => {
    return meals
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(meal => ({
        id: meal._id,
        name: meal.name,
        calories: meal.nutrition?.calories || 0,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
        type: new Date(meal.createdAt) === new Date(meal.updatedAt) ? 'added' : 'updated'
      }));
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Email subscription handlers
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
    setEmailError('');
    setEmailSuccess('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailData.email || !emailRegex.test(emailData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSuccess('Successfully subscribed! Check your email for confirmation.');
      setEmailData({ email: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setEmailSuccess(''), 5000);
    } catch (error) {
      setEmailError('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Modern Welcome Section with Hero Image */}
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="lg:w-2/5 mb-8 lg:mb-0">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                      {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}!
                    </h2>
                    <p className="text-xl text-gray-700 mb-6 max-w-lg">
                      Your intelligent meal management system for tracking nutrition, planning meals, and achieving your health goals
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => handleNavigate('add-meal')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Add First Meal
                      </button>
                      <button
                        onClick={() => handleNavigate('meals')}
                        className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl border-2 border-orange-200 hover:bg-orange-50 transition-all"
                      >
                        Browse Meals
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-3/5 flex justify-center">
                    <div className="relative w-full max-w-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80" 
                        alt="Healthy Food" 
                        className="relative z-10 rounded-3xl shadow-2xl w-full h-80 lg:h-96 object-cover transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border-2 border-orange-100 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">{stats.totalMeals}</p>
                          <p className="text-xs text-gray-600">Total Meals</p>
                        </div>
                      </div>
                      {/* Enhanced Decorative Elements */}
                      <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-r from-orange-400/20 to-amber-400/20 backdrop-blur-sm rounded-2xl animate-pulse border border-orange-200/50 shadow-lg"></div>
                      <div className="absolute bottom-4 left-8 w-12 h-12 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-sm rounded-xl animate-pulse delay-500 border border-amber-200/50 shadow-lg"></div>
                      <div className="absolute top-8 right-8 w-10 h-10 bg-gradient-to-r from-orange-300/20 to-amber-300/20 backdrop-blur-sm rounded-lg animate-pulse delay-1000 border border-orange-200/50 shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-orange-600">Total</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalMeals}</h3>
                <p className="text-sm text-gray-600 font-medium">Meals Created</p>
                <div className="mt-3 flex items-center text-xs text-orange-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                  <span>+12% this week</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                    </svg>
                  </div>
                  <div className="bg-amber-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-amber-600">Weekly</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.weeklyCalories.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 font-medium">Calories</p>
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Last 7 days</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-orange-600">Average</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.avgCalories}</h3>
                <p className="text-sm text-gray-600 font-medium">Cal/Meal</p>
                <div className="mt-3 flex items-center text-xs text-orange-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>Healthy range</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="bg-amber-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-amber-600">Quality</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.goalsAchieved}</h3>
                <p className="text-sm text-gray-600 font-medium">Quality Meals</p>
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>400+ cal meals</span>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Quick Actions</h3>
                <div className="bg-orange-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold text-orange-600">Get Started</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleNavigate('add-meal')}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 via-amber-100 hover:to-orange-100 transition-all duration-300 text-left border border-orange-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </div>
                      <div className="bg-orange-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-orange-600">Create</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Add New Meal</h4>
                    <p className="text-sm text-gray-600">Create and log your meal with nutrition details</p>
                    <div className="mt-4 flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700">
                      <span>Start now</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('meals')}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 via-amber-100 hover:to-orange-100 transition-all duration-300 text-left border border-orange-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                      </div>
                      <div className="bg-orange-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-orange-600">Browse</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Meal Gallery</h4>
                    <p className="text-sm text-gray-600">View and manage your meal collection</p>
                    <div className="mt-4 flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700">
                      <span>Explore meals</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('search')}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 via-amber-100 hover:to-orange-100 transition-all duration-300 text-left border border-orange-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      </div>
                      <div className="bg-orange-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-orange-600">Search</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Find Meals</h4>
                    <p className="text-sm text-gray-600">Search specific meals or ingredients</p>
                    <div className="mt-4 flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700">
                      <span>Search now</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Recent Activity</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live updates</span>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading activities...</p>
                </div>
              ) : getRecentActivities().length > 0 ? (
                <div className="space-y-4">
                  {getRecentActivities().map((activity, index) => (
                    <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                      activity.type === 'added' 
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100' 
                        : activity.type === 'updated' 
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-100' 
                          : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'
                    }`}>
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          activity.type === 'added'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                            : activity.type === 'updated'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        }`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {activity.type === 'added' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            )}
                          </svg>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {activity.type === 'added' ? 'Added new meal:' : 'Updated meal:'} 
                          <span className="text-orange-600">"{activity.name}"</span>
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-600">{formatTimeAgo(activity.createdAt)}</p>
                          <span className="text-gray-400">•</span>
                          <p className="text-sm font-medium text-orange-600">{activity.calories} calories</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                          activity.type === 'added'
                            ? 'bg-orange-100 text-orange-600 border border-orange-200'
                            : activity.type === 'updated'
                              ? 'bg-amber-100 text-amber-600 border border-amber-200'
                              : 'bg-orange-100 text-orange-600 border border-orange-200'
                        }`}>
                          {activity.type === 'added' ? 'New' : 'Updated'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium text-lg mb-2">No recent activity</p>
                  <p className="text-sm text-gray-400 mb-4">Start by adding your first meal!</p>
                  <button
                    onClick={() => handleNavigate('add-meal')}
                    className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Your First Meal
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'meals':
        return <MealGallery onNavigate={handleNavigate} />;
      case 'add-meal':
        return <AddMeal onNavigate={handleNavigate} />;
      case 'meal-detail':
        return <MealDetail mealId={currentParams.mealId} onNavigate={handleNavigate} />;
      case 'edit-meal':
        return <EditMeal mealId={currentParams.mealId} onNavigate={handleNavigate} />;
      case 'search':
        return <MealGallery onNavigate={handleNavigate} />;
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-12">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                    Meal Analytics & Insights
                  </h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                    Comprehensive analysis of your meal patterns, nutrition trends, and health goals
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-orange-600">Growth</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalMeals}</h3>
                <p className="text-sm text-gray-600 font-medium">Total Meals</p>
                <div className="mt-3 flex items-center text-xs text-orange-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                  <span>All time</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-amber-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-amber-600">Calories</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalCalories.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 font-medium">Total Calories</p>
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>All meals</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-orange-600">Average</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.avgCalories}</h3>
                <p className="text-sm text-gray-600 font-medium">Avg Calories/Meal</p>
                <div className="mt-3 flex items-center text-xs text-orange-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span>Per meal</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-amber-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-amber-600">Quality</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.goalsAchieved}</h3>
                <p className="text-sm text-gray-600 font-medium">Quality Meals</p>
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>400+ cal</span>
                </div>
              </div>
            </div>

            {/* Advanced Analytics Dashboard */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Advanced Analytics</h3>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-white flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      Live Data
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-white">Real-time Analytics</span>
                  </div>
                </div>
              </div>
              
              {/* Main Charts Grid - Enhanced */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Enhanced Weekly Meal Creation Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">Weekly Meal Creation</h4>
                        <p className="text-sm text-gray-600">Last 7 days performance</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 px-4 py-2 rounded-full">
                      <span className="text-sm font-bold text-orange-600">This Week</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Bar Chart */}
                  <div className="relative h-72 mb-8">
                    {/* Enhanced Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 25, 50, 75, 100].map((line) => (
                        <div key={line} className="border-b border-gray-300 border-opacity-40 relative">
                          <span className="absolute -left-12 -top-2 text-xs text-gray-600 font-semibold">{line}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Enhanced Bars */}
                    <div className="absolute inset-0 flex items-end justify-between space-x-4 ml-12">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const value = Math.floor(Math.random() * 10) + 2;
                        const maxHeight = 100;
                        const height = (value / 12) * maxHeight;
                        return (
                          <div key={day} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full flex flex-col items-center">
                              <div 
                                className="w-full bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 rounded-t-2xl transition-all duration-700 hover:from-orange-700 hover:via-orange-600 hover:to-amber-500 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
                                style={{ height: `${height}%`, minHeight: '16px' }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl">
                                  <div className="font-bold">{value} meals</div>
                                  <div className="text-xs text-gray-300">{day}</div>
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-700 font-bold mt-3 group-hover:text-orange-600 transition-colors">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Enhanced Stats Summary */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-gray-200">
                    <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-1">47</div>
                      <div className="text-xs text-gray-700 font-semibold">Total This Week</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-1">+23%</div>
                      <div className="text-xs text-gray-700 font-semibold">vs Last Week</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                      <div className="text-3xl font-bold text-amber-600 mb-1">6.7</div>
                      <div className="text-xs text-gray-700 font-semibold">Daily Average</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Nutrition Distribution Pie Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">Nutrition Breakdown</h4>
                        <p className="text-sm text-gray-600">Daily macro distribution</p>
                      </div>
                    </div>
                    <div className="bg-amber-100 px-4 py-2 rounded-full">
                      <span className="text-sm font-bold text-amber-600">Daily Goal</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Pie Chart */}
                  <div className="relative h-72 flex items-center justify-center mb-8">
                    <svg className="w-64 h-64 transform -rotate-90 absolute">
                      <defs>
                        <filter id="enhancedShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                          <feOffset dx="0" dy="4" result="offsetblur"/>
                          <feFlood flood-color="#000000" flood-opacity="0.4"/>
                          <feComposite in2="offsetblur" operator="in"/>
                          <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <linearGradient id="enhancedProteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="50%" stopColor="#ea580c" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                        <linearGradient id="enhancedCarbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                        <linearGradient id="enhancedFatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fb923c" />
                          <stop offset="50%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                      
                      {/* Enhanced Protein Segment */}
                      <circle
                        cx="128"
                        cy="128"
                        r="90"
                        fill="none"
                        stroke="url(#enhancedProteinGradient)"
                        strokeWidth="35"
                        strokeDasharray={`${Math.PI * 90 * 0.35} ${Math.PI * 90 * 0.65}`}
                        className="transition-all duration-700 hover:stroke-width-40"
                        filter="url(#enhancedShadow)"
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {/* Enhanced Carbs Segment */}
                      <circle
                        cx="128"
                        cy="128"
                        r="90"
                        fill="none"
                        stroke="url(#enhancedCarbsGradient)"
                        strokeWidth="35"
                        strokeDasharray={`${Math.PI * 90 * 0.30} ${Math.PI * 90 * 0.70}`}
                        strokeDashoffset={`-${Math.PI * 90 * 0.35}`}
                        className="transition-all duration-700 hover:stroke-width-40"
                        filter="url(#enhancedShadow)"
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {/* Enhanced Fat Segment */}
                      <circle
                        cx="128"
                        cy="128"
                        r="90"
                        fill="none"
                        stroke="url(#enhancedFatGradient)"
                        strokeWidth="35"
                        strokeDasharray={`${Math.PI * 90 * 0.35} ${Math.PI * 90 * 0.65}`}
                        strokeDashoffset={`-${Math.PI * 90 * 0.65}`}
                        className="transition-all duration-700 hover:stroke-width-40"
                        filter="url(#enhancedShadow)"
                        style={{ cursor: 'pointer' }}
                      />
                    </svg>
                    
                    {/* Enhanced Center Display */}
                    <div className="absolute text-center z-10">
                      <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">100%</div>
                      <div className="text-sm text-gray-700 font-bold">Daily Goal</div>
                      <div className="text-xs text-gray-600 mt-1">2,150 calories</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Legend */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer group transform hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"></div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 group-hover:text-orange-600">Protein</div>
                          <div className="text-xs text-gray-700 font-semibold">35% • 188g</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer group transform hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg"></div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 group-hover:text-amber-600">Carbs</div>
                          <div className="text-xs text-gray-700 font-semibold">30% • 161g</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer group transform hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg"></div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 group-hover:text-orange-600">Fat</div>
                          <div className="text-xs text-gray-700 font-semibold">35% • 83g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Secondary Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Enhanced Calorie Trend Line Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Flame className="w-6 h-6 text-orange-600 mr-3" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">Calorie Trend</h4>
                        <p className="text-xs text-gray-600">7-day analysis</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-orange-600">7 Days</span>
                    </div>
                  </div>
                  
                  <div className="h-56 relative">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="enhancedLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Enhanced Area */}
                      <path
                        d="M 0 140 L 50 120 L 100 130 L 150 100 L 200 80 L 250 90 L 300 70 L 300 160 L 0 160 Z"
                        fill="url(#enhancedLineGradient)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Enhanced Line */}
                      <path
                        d="M 0 140 L 50 120 L 100 130 L 150 100 L 200 80 L 250 90 L 300 70"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                      />
                      
                      {/* Enhanced Points */}
                      {[0, 50, 100, 150, 200, 250, 300].map((x, index) => {
                        const y = [140, 120, 130, 100, 80, 90, 70][index];
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="6"
                            fill="#f97316"
                            className="hover:r-8 transition-all cursor-pointer"
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
                    <div>
                      <span className="text-sm text-gray-600 font-medium">7-day avg</span>
                      <div className="text-xl font-bold text-orange-600">1,847 cal</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-green-600 font-bold">+12%</span>
                      <div className="text-xs text-gray-600">vs last week</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Meal Type Distribution */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <ChefHat className="w-6 h-6 text-amber-600 mr-3" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">Meal Types</h4>
                        <p className="text-xs text-gray-600">Distribution analysis</p>
                      </div>
                    </div>
                    <div className="bg-amber-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-amber-600">Distribution</span>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { name: 'Breakfast', percentage: 25, color: 'from-orange-400 to-orange-500', icon: '☀️' },
                      { name: 'Lunch', percentage: 35, color: 'from-amber-400 to-amber-500', icon: '🌞' },
                      { name: 'Dinner', percentage: 30, color: 'from-orange-500 to-orange-600', icon: '🌙' },
                      { name: 'Snacks', percentage: 10, color: 'from-amber-500 to-amber-600', icon: '🍎' }
                    ].map((meal, index) => (
                      <div key={meal.name} className="flex items-center space-x-4">
                        <span className="text-xl mr-2">{meal.icon}</span>
                        <span className="text-sm text-gray-700 font-bold w-20">{meal.name}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${meal.color} rounded-full transition-all duration-700 relative shadow-lg`}
                            style={{ width: `${meal.percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-800 w-12 text-right">{meal.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Performance Metrics */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Target className="w-6 h-6 text-orange-600 mr-3" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">Performance</h4>
                        <p className="text-xs text-gray-600">Key metrics</p>
                      </div>
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-green-600">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">🎯</span>
                        </div>
                        <span className="text-sm text-gray-700 font-bold">Goal Achievement</span>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="6"
                            strokeDasharray={`${Math.PI * 28 * 0.85} ${Math.PI * 28 * 0.15}`}
                            className="transition-all duration-700"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-orange-600">85%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">📈</span>
                        </div>
                        <span className="text-sm text-gray-700 font-bold">Consistency</span>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="6"
                            strokeDasharray={`${Math.PI * 28 * 0.92} ${Math.PI * 28 * 0.08}`}
                            className="transition-all duration-700"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-amber-600">92%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">⭐</span>
                        </div>
                        <span className="text-sm text-gray-700 font-bold">Quality Score</span>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#fb923c"
                            strokeWidth="6"
                            strokeDasharray={`${Math.PI * 28 * 0.78} ${Math.PI * 28 * 0.22}`}
                            className="transition-all duration-700"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-orange-500">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Categories Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Meal Categories</h3>
                <div className="bg-amber-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold text-amber-600">By Type</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">High Protein</h4>
                  <p className="text-3xl font-bold text-orange-600 mb-1">
                    {meals.filter(meal => (meal.nutrition?.protein || 0) > 25).length}
                  </p>
                  <p className="text-sm text-gray-600">Meals with 25g+ protein</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">High Calorie</h4>
                  <p className="text-3xl font-bold text-amber-600 mb-1">
                    {meals.filter(meal => (meal.nutrition?.calories || 0) > 500).length}
                  </p>
                  <p className="text-sm text-gray-600">Meals with 500+ calories</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Recent Meals</h4>
                  <p className="text-3xl font-bold text-orange-600 mb-1">
                    {meals.filter(function(meal) {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(meal.createdAt) >= weekAgo;
                    }).length}
                  </p>
                  <p className="text-sm text-gray-600">Added this week</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-500">The page you're looking for doesn't exist.</p>
          </div>
        );
    }
  };

  return (
    <MealDashboard 
      activePage={currentPage} 
      onNavigate={handleNavigate}
    >
      {renderCurrentPage()}
    </MealDashboard>
  );
}

export default App;