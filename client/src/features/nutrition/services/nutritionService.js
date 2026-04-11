import api from '../../../services/api';

export async function calculateTargets(payload) {
  const response = await api.post('/nutrition/targets/calculate', payload);
  return response.data;
}

export async function saveTargets(payload) {
  const response = await api.post('/nutrition/targets', payload);
  return response.data;
}

export async function getMyTargets() {
  const response = await api.get('/nutrition/targets/me');
  return response.data;
}

export async function updateMyTargets(payload) {
  const response = await api.put('/nutrition/targets/me', payload);
  return response.data;
}

export async function deleteMyLatestTargets() {
  const response = await api.delete('/nutrition/targets/me');
  return response.data;
}

export async function searchFoods(q) {
  const response = await api.get(`/nutrition/foods/search?q=${encodeURIComponent(q)}`);
  return response.data;
}

export async function calculateFood(payload) {
  const response = await api.post('/nutrition/foods/calculate', payload);
  return response.data;
}

export async function addIntake(payload) {
  const response = await api.post('/nutrition/intake', payload);
  return response.data;
}

export async function getDailyIntake(dateKey) {
  const query = dateKey ? `?dateKey=${encodeURIComponent(dateKey)}` : "";
  const response = await api.get(`/nutrition/intake/daily${query}`);
  return response.data;
}

export async function getWeeklySummary() {
  const response = await api.get('/nutrition/summary/weekly');
  return response.data;
}

export async function getTodaySummary() {
  const response = await api.get('/nutrition/summary/today');
  return response.data;
}