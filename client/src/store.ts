import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string, username: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  isAuthenticated: false,

  setAuth: (token, userId, username) => {
    localStorage.setItem('nexora_token', token);
    localStorage.setItem('nexora_userId', userId);
    localStorage.setItem('nexora_username', username);
    set({ token, userId, username, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_userId');
    localStorage.removeItem('nexora_username');
    set({ token: null, userId: null, username: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('nexora_token');
    const userId = localStorage.getItem('nexora_userId');
    const username = localStorage.getItem('nexora_username');

    if (token && userId && username) {
      set({ token, userId, username, isAuthenticated: true });
    }
  },
}));

interface PlayerState {
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  coins: number;
  setPlayerData: (data: Partial<PlayerState>) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100,
  coins: 0,

  setPlayerData: (data) => set(data),
}));

interface GameState {
  isInGame: boolean;
  setInGame: (value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isInGame: false,
  setInGame: (value) => set({ isInGame: value }),
}));
