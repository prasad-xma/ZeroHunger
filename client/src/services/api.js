import axios from 'axios';

// create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://zerohunger-production.up.railway.app/api',
});



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

export default api;