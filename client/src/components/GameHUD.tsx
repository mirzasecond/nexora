import React from 'react';
import { usePlayerStore } from '../store';

export default function GameHUD() {
  const { level, xp, maxXp, hp, maxHp, stamina, maxStamina, coins } = usePlayerStore();

  const xpPercent = (xp / maxXp) * 100;
  const hpPercent = (hp / maxHp) * 100;
  const staminaPercent = (stamina / maxStamina) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top left - Player info */}
      <div className="absolute top-4 left-4 space-y-2 text-white">
        <div className="text-sm font-semibold">LEVEL {level}</div>

        {/* XP Bar */}
        <div className="w-48">
          <div className="text-xs text-gray-400 mb-1">XP {xp}/{maxXp}</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${xpPercent}%` }}></div>
          </div>
        </div>

        {/* HP Bar */}
        <div className="w-48">
          <div className="text-xs text-gray-400 mb-1">HP {hp}/{maxHp}</div>
          <div className="bar">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-200"
              style={{ width: `${hpPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stamina Bar */}
        <div className="w-48">
          <div className="text-xs text-gray-400 mb-1">STAMINA {stamina}/{maxStamina}</div>
          <div className="bar">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-200"
              style={{ width: `${staminaPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Top right - Info */}
      <div className="absolute top-4 right-4 text-white text-right">
        <div className="text-2xl font-bold text-yellow-400">{coins}</div>
        <div className="text-xs text-gray-400">COINS</div>
      </div>

      {/* Bottom left - Controls */}
      <div className="absolute bottom-4 left-4 text-white text-xs text-gray-400 space-y-1">
        <div>WASD - Move | SHIFT - Sprint | SPACE - Jump</div>
        <div>E - Interact | I - Inventory | ESC - Menu</div>
      </div>

      {/* Bottom center - FPS Counter (for now) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs text-gray-400">
        Loading...
      </div>
    </div>
  );
}
