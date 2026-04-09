import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/mealService';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Grid3x3,
  List,
  Heart,
  Clock,
  Star,
  TrendingUp,
  ChefHat,
  Zap,
  Award,
  Calendar,
  Users,
  Flame,
  Target,
  Activity,
  Sparkles
} from 'lucide-react';

const MealGallery = ({ onNavigate }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, calories, name
  const [filterCategory, setFilterCategory] = useState('all');
  const [hoveredMeal, setHoveredMeal] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMeals();
      return;
    }

    try {
      setLoading(true);
      const response = await mealService.searchMeals(searchQuery);
      setMeals(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to search meals');
      console.error('Error searching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    try {
      await mealService.deleteMeal(mealId);
      setMeals(meals.filter(meal => meal._id !== mealId));
    } catch (err) {
      setError('Failed to delete meal');
      console.error('Error deleting meal:', err);
    }
  };

  // Smart sorting and filtering
  const getFilteredAndSortedMeals = () => {
    let filtered = [...meals];
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(meal => {
        switch (filterCategory) {
          case 'high-protein':
            return (meal.nutrition?.protein || 0) > 30;
          case 'low-calorie':
            return (meal.nutrition?.calories || 0) < 400;
          case 'high-calorie':
            return (meal.nutrition?.calories || 0) >= 500;
          default:
            return true;
        }
      });
    }

    // Sort meals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'calories-high':
          return (b.nutrition?.calories || 0) - (a.nutrition?.calories || 0);
        case 'calories-low':
          return (a.nutrition?.calories || 0) - (b.nutrition?.calories || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredMeals = getFilteredAndSortedMeals();

  // Calculate smart stats
  const totalMeals = meals.length;
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.nutrition?.calories || 0), 0);
  const avgCalories = totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0;
  const highProteinMeals = meals.filter(meal => (meal.nutrition?.protein || 0) > 25).length;
  const recentMeals = meals.filter(meal => {
    const mealDate = new Date(meal.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return mealDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <Sparkles className="absolute top-0 right-0 w-6 h-6 text-orange-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-2">Loading Your Meals</p>
            <p className="text-gray-600">Preparing your culinary collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Meal Gallery
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover and manage your delicious meal collection
          </p>
        </div>

        {/* Smart Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalMeals}</h3>
            <p className="text-sm text-gray-600">Total Meals</p>
            <div className="mt-2 text-xs text-orange-600 font-medium">+{recentMeals} this week</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalCalories.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Total Calories</p>
            <div className="mt-2 text-xs text-amber-600 font-medium">All meals</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{avgCalories}</h3>
            <p className="text-sm text-gray-600">Avg Calories</p>
            <div className="mt-2 text-xs text-blue-600 font-medium">Per meal</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{highProteinMeals}</h3>
            <p className="text-sm text-gray-600">High Protein</p>
            <div className="mt-2 text-xs text-green-600 font-medium">25g+ protein</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{filteredMeals.length}</h3>
            <p className="text-sm text-gray-600">Filtered</p>
            <div className="mt-2 text-xs text-purple-600 font-medium">Showing</div>
          </div>
        </div>

        {/* Smart Controls */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-orange-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals by name or ingredients..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </form>
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                <option value="high-protein">High Protein (25g+)</option>
                <option value="low-calorie">Low Calorie (&lt;400)</option>
                <option value="high-calorie">High Calorie (500+)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="calories-high">Calories (High to Low)</option>
                <option value="calories-low">Calories (Low to High)</option>
                <option value="name">Name (A to Z)</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 size={18} />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List size={18} />
                <span>List</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>{filteredMeals.length} meals found</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {filteredMeals.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-orange-100">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {meals.length === 0 ? 'No Meals Yet' : 'No Meals Found'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {meals.length === 0 
                ? 'Start building your meal collection by adding your first delicious recipe!'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
            <div className="flex justify-center space-x-4">
              {meals.length === 0 && (
                <button 
                  onClick={() => onNavigate('add-meal')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Meal
                </button>
              )}
              {(searchQuery || filterCategory !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    fetchMeals();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center"
                >
                  <Filter size={20} className="mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Meals Display */
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredMeals.map((meal) => (
              <div
                key={meal._id}
                className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onMouseEnter={() => setHoveredMeal(meal._id)}
                onMouseLeave={() => setHoveredMeal(null)}
              >
                {/* Meal Image */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gradient-to-br from-orange-100 to-amber-100`}>
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredMeal === meal._id ? 'scale-110' : 'scale-100'
                    }`}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/FEF3C7/92400E?text=${encodeURIComponent(meal.name)}`;
                    }}
                  />
                  
                  {/* Overlay with calories */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-orange-600">{meal.nutrition?.calories || 0} cal</span>
                  </div>

                  {/* Hover overlay */}
                  {hoveredMeal === meal._id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {new Date(meal.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {meal.servingSizeGrams || 0}g
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meal Content */}
                <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {meal.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{meal.description}</p>
                  
                  {/* Only show calories badge */}
                  <div className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                    {meal.nutrition?.calories || 0} cal
                  </div>

                  {/* Ingredients Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients?.slice(0, viewMode === 'list' ? 5 : 3).map((ingredient, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-lg border border-orange-200"
                        >
                          {ingredient.name}
                        </span>
                      ))}
                      {meal.ingredients?.length > (viewMode === 'list' ? 5 : 3) && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">
                          +{meal.ingredients.length - (viewMode === 'list' ? 5 : 3)} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('meal-detail', { mealId: meal._id })}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center justify-center"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => onNavigate('edit-meal', { mealId: meal._id })}
                      className="flex-1 px-3 py-2 bg-amber-100 text-amber-700 text-sm rounded-xl hover:bg-amber-200 transition-all flex items-center justify-center"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-xl hover:bg-red-200 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealGallery;
