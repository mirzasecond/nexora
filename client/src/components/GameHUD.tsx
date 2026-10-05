import React, { useState } from 'react';
import { usePlayerStore } from '../store';
import { useGameWorldStore } from '../store/gameWorld';

export default function GameHUD() {
  const { level, xp, maxXp, hp, maxHp, stamina, maxStamina, coins } = usePlayerStore();
  const { quests } = useGameWorldStore();
  const [showQuests, setShowQuests] = useState(false);

  const xpPercent = (xp / maxXp) * 100;
  const hpPercent = (hp / maxHp) * 100;
  const staminaPercent = (stamina / maxStamina) * 100;

  const activeQuests = quests.filter((q) => q.status === 'active');

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

      {/* Top center - Active Quest */}
      {activeQuests.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass p-3 rounded-lg max-w-xs">
          <div className="text-xs text-cyan-400 font-semibold">ACTIVE QUEST</div>
          <div className="text-sm text-white">{activeQuests[0].title}</div>
          <div className="text-xs text-gray-400 mt-1">
            {activeQuests[0].currentProgress}/{activeQuests[0].objectiveCount}
          </div>
        </div>
      )}

      {/* Bottom left - Controls */}
      <div className="absolute bottom-4 left-4 text-white text-xs text-gray-400 space-y-1 pointer-events-none">
        <div>WASD - Move | SHIFT - Sprint | SPACE - Jump</div>
        <div>CLICK - Attack | E - Interact | I - Inventory | ESC - Menu</div>
      </div>

      {/* Bottom right - Quest Log Button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setShowQuests(!showQuests)}
          className="btn-secondary pointer-events-auto"
        >
          QUESTS ({activeQuests.length})
        </button>
      </div>

      {/* Quest Panel */}
      {showQuests && (
        <div className="absolute bottom-20 right-4 glass p-4 rounded-lg max-w-sm max-h-96 overflow-y-auto pointer-events-auto">
          <h2 className="text-lg font-bold text-cyan-400 mb-3">Active Quests</h2>
          {activeQuests.length === 0 ? (
            <p className="text-gray-400 text-sm">No active quests</p>
          ) : (
            <div className="space-y-2">
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="p-2 bg-gray-900/50 rounded border border-cyan-500/30"
                >
                  <p className="text-sm font-semibold text-white">{quest.title}</p>
                  <p className="text-xs text-gray-400">{quest.objective}</p>
                  <div className="mt-1 bar h-4">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{
                        width: `${(quest.currentProgress / quest.objectiveCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
