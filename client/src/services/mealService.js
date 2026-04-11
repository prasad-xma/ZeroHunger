import api from './api';

// Meal API endpoints
export const mealService = {
  // Get all meals (gallery view)
  getAllMeals: async () => {
    const response = await api.get('/meals');
    return response.data;
  },

  // Get single meal by ID
  getMealById: async (id) => {
    const response = await api.get(`/meals/${id}`);
    return response.data;
  },

  // Search meals by name
  searchMeals: async (query) => {
    const response = await api.get(`/meals/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Create new meal
  createMeal: async (mealData) => {
    const response = await api.post('/meals', mealData);
    return response.data;
  },

  // Update meal
  updateMeal: async (id, mealData) => {
    const response = await api.put(`/meals/${id}`, mealData);
    return response.data;
  },

  // Delete meal
  deleteMeal: async (id) => {
    const response = await api.delete(`/meals/${id}`);
    return response.data;
  },
};

export default api;
