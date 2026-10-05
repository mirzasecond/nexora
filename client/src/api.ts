import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Auth
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),

  login: (username_or_email: string, password: string) =>
    api.post('/auth/login', { username_or_email, password }),

  getMe: () => api.get('/auth/me'),

  // Player
  getPlayer: () => api.get('/player'),

  updatePlayerPosition: (x: number, y: number, z: number) =>
    api.post('/player/position', { x, y, z }),

  addXP: (amount: number) => api.post('/player/xp', { amount }),

  addCoins: (amount: number) => api.post('/player/coins', { amount }),
};

export default api;
