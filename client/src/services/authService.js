import api from './api';

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
