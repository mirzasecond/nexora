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

  // Quests
  getQuests: () => api.get('/quests'),

  getPlayerQuests: () => api.get('/player/quests'),

  acceptQuest: (questId: string) => api.post(`/quests/${questId}/accept`),

  completeQuest: (questId: string) => api.post(`/quests/${questId}/complete`),

  // Game Data
  getNPCs: () => api.get('/game/npcs'),

  getEnemies: () => api.get('/game/enemies'),

  getItems: () => api.get('/game/items'),

  // Inventory
  getInventory: () => api.get('/inventory'),

  getEquipment: () => api.get('/equipment'),

  equipItem: (itemId: string, slot: string) =>
    api.post('/equipment/equip', { itemId, slot }),

  unequipItem: (slot: string) =>
    api.post('/equipment/unequip', { slot }),

  // Shop
  getShopItems: () => api.get('/shop/items'),

  buyItem: (itemId: string, quantity: number) =>
    api.post('/shop/buy', { itemId, quantity }),

  sellItem: (itemId: string, quantity: number) =>
    api.post('/shop/sell', { itemId, quantity }),
};

export default api;
