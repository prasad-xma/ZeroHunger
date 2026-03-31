import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export default api;
