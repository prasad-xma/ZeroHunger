// client/src/features/nutrition/services/nutritionService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export async function calculateTargets(payload) {
  const response = await fetch(`${API_BASE_URL}/nutrition/targets/calculate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function saveTargets(payload) {
  const response = await fetch(`${API_BASE_URL}/nutrition/targets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getMyTargets() {
  const response = await fetch(`${API_BASE_URL}/nutrition/targets/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function updateMyTargets(payload) {
  const response = await fetch(`${API_BASE_URL}/nutrition/targets/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteMyLatestTargets() {
  const response = await fetch(`${API_BASE_URL}/nutrition/targets/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function searchFoods(q) {
  const response = await fetch(
    `${API_BASE_URL}/nutrition/foods/search?q=${encodeURIComponent(q)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

export async function calculateFood(payload) {
  const response = await fetch(`${API_BASE_URL}/nutrition/foods/calculate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function addIntake(payload) {
  const response = await fetch(`${API_BASE_URL}/nutrition/intake`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getDailyIntake(dateKey) {
  const query = dateKey ? `?dateKey=${encodeURIComponent(dateKey)}` : "";
  const response = await fetch(`${API_BASE_URL}/nutrition/intake/daily${query}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getWeeklySummary() {
  const response = await fetch(`${API_BASE_URL}/nutrition/summary/weekly`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getTodaySummary() {
  const response = await fetch(`${API_BASE_URL}/nutrition/summary/today`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}