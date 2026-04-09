import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
