import api from './api';

// Health Profile Services
export const createHealthProfile = async (profileData) => {
  return await api.post('/health-recommendation', profileData);
};

export const getUserHealthProfiles = async () => {
  return await api.get('/health-recommendation');
};

export const getHealthProfileById = async (profileId) => {
  return await api.get(`/health-recommendation/${profileId}`);
};

export const updateHealthProfile = async (profileId, profileData) => {
  return await api.put(`/health-recommendation/${profileId}`, profileData);
};

export const updateHealthRecommendations = async (profileId, recommendations) => {
  return await api.put(`/health-recommendation/${profileId}/recommendations`, recommendations);
};

export const recalculateHealthMetrics = async (profileId) => {
  return await api.post(`/health-recommendation/${profileId}/recalculate`);
};

export const deleteHealthProfile = async (profileId) => {
  return await api.delete(`/health-recommendation/${profileId}`);
};

// Health Advice Services
export const generateHealthAdvice = async (healthProfileId) => {
  return await api.post(`/health-advice/generate/${healthProfileId}`);
};

export const getHealthAdvice = async (healthProfileId) => {
  return await api.get(`/health-advice/${healthProfileId}`);
};

export const getAllHealthAdvice = async () => {
  return await api.get('/health-advice');
};

export const regenerateHealthAdvice = async (healthProfileId) => {
  return await api.post(`/health-advice/regenerate/${healthProfileId}`);
};
