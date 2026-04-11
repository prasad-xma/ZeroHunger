import api from './api';

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
