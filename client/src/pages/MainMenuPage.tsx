import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore, usePlayerStore, useGameStore } from '../store';
import { apiClient } from '../api';

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();
  const { level, xp, maxXp } = usePlayerStore();
  const setInGame = useGameStore((s) => s.setInGame);

  useEffect(() => {
    // Load player data
    const loadPlayer = async () => {
      try {
        const res = await apiClient.getPlayer();
        usePlayerStore.setState({
          level: res.data.level,
          xp: res.data.xp,
          maxXp: Math.ceil((res.data.level + 1) * 100),
          hp: res.data.hp,
          maxHp: res.data.max_hp,
          stamina: res.data.stamina,
          maxStamina: res.data.max_stamina,
          coins: res.data.coins,
        });
      } catch (err) {
        console.error('Failed to load player data', err);
      }
    };

    loadPlayer();
  }, []);

  const handlePlay = () => {
    setInGame(true);
    navigate('/game');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            NEXORA
          </h1>
          <p className="text-2xl text-cyan-300">Welcome, {username}</p>
        </div>

        {/* Player Stats */}
        <div className="glass p-8 rounded-xl space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">LEVEL</p>
              <p className="text-3xl font-bold text-cyan-400">{level}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">XP</p>
              <p className="text-xl text-gray-300">
                {xp} / {maxXp}
              </p>
              <div className="bar mt-2">
                <div className="bar-fill" style={{ width: `${(xp / maxXp) * 100}%` }}></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">COINS</p>
              <p className="text-3xl font-bold text-yellow-400">0</p>
            </div>
          </div>
        </div>

        {/* Main Menu Buttons */}
        <div className="space-y-4">
          <button onClick={handlePlay} className="w-full btn-primary text-lg py-4">
            PLAY GAME
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary">CHARACTER</button>
            <button className="btn-secondary">INVENTORY</button>
            <button className="btn-secondary">QUESTS</button>
            <button className="btn-secondary">ACHIEVEMENTS</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary">SHOP</button>
            <button className="btn-secondary">LEADERBOARD</button>
            <button className="btn-secondary">SETTINGS</button>
            <button onClick={handleLogout} className="btn-danger">
              LOGOUT
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm">v1.0.0 | NEXORA © 2026</p>
      </div>
    </div>
  );
}
