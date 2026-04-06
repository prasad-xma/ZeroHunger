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

export const generateAllergyRecommendations = async (allergies) => {
  return await api.post('/ai-food-allergies/generate', { allergies });
};

export const getUserAllergyProfile = async () => {
  return await api.get('/ai-food-allergies');
};

export const updateAllergyProfile = async (allergies) => {
  return await api.put('/ai-food-allergies', { allergies });
};

export const deleteAllergyProfile = async () => {
  return await api.delete('/ai-food-allergies');
};
