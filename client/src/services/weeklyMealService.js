import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const createAuthenticatedApi = () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include JWT token
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

  // Add response interceptor to handle auth errors
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

  return api;
};

const api = createAuthenticatedApi();

// Get all user's meal plans
const getAllPlans = async () => {
  const response = await api.get('/weekly-meal-planner/user');
  return response.data;
};

// Get specific meal plan by ID
const getPlanById = async (planId) => {
  const response = await api.get(`/weekly-meal-planner/${planId}`);
  return response.data;
};

// Create new meal plan
const createPlan = async (planData) => {
  const response = await api.post('/weekly-meal-planner', planData);
  return response.data;
};

// Add food to meal
const addFood = async (planId, foodData) => {
  const response = await api.put(`/weekly-meal-planner/${planId}/add-food`, foodData);
  return response.data;
};

// Update food in meal
const updateFood = async (planId, foodData) => {
  const response = await api.put(`/weekly-meal-planner/${planId}/update-food`, foodData);
  return response.data;
};

// Remove food from meal
const removeFood = async (planId, foodData) => {
  const response = await api.put(`/weekly-meal-planner/${planId}/remove-food`, foodData);
  return response.data;
};

// Mark meal as complete
const completeMeal = async (planId, mealData) => {
  const response = await api.put(`/weekly-meal-planner/${planId}/complete`, mealData);
  return response.data;
};

// Get weekly summary
const getSummary = async (planId) => {
  const response = await api.get(`/weekly-meal-planner/${planId}/summary`);
  return response.data;
};

// Delete plan
const deletePlan = async (planId) => {
  const response = await api.delete(`/weekly-meal-planner/${planId}`);
  return response.data;
};

// Delete all plans
const deleteAllPlans = async () => {
  console.log('Making DELETE request to /weekly-meal-planner/all');
  const response = await api.delete('/weekly-meal-planner/all');
  console.log('Delete all plans response:', response);
  return response.data;
};

export const weeklyMealService = {
  getAllPlans,
  getPlanById,
  createPlan,
  addFood,
  updateFood,
  removeFood,
  completeMeal,
  getSummary,
  deletePlan,
  deleteAllPlans
};
