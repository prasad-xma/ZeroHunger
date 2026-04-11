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

export const progressService = {
  // Get progress history
  getHistory: async () => {
    const response = await api.get('/progress/history');
    return response.data;
  },

  // Add new progress entry
  addProgress: async (progressData) => {
    const response = await api.post('/progress', progressData);
    return response.data;
  },

  // Get weight prediction
  getPrediction: async (goal) => {
    const response = await api.get(`/progress/prediction/${goal}`);
    return response.data;
  },

  // Delete progress entry
  deleteProgress: async (progressId) => {
    const response = await api.delete(`/progress/${progressId}`);
    return response.data;
  },

  // Delete all progress
  deleteAllProgress: async () => {
    const response = await api.delete('/progress/all');
    return response.data;
  }
};
