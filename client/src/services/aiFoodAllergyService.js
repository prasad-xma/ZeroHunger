import api from './api';

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
