import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameWorldStore } from '../store/gameWorld';
import { usePlayerStore } from '../store';
import { apiClient } from '../api';

interface CombatState {
  lastAttackTime: number;
  attackCooldown: number;
}

export default function CombatSystem() {
  const { enemies, updateEnemyHP, removeEnemy } = useGameWorldStore();
  const playerStore = usePlayerStore();
  const combatRef = useRef<CombatState>({
    lastAttackTime: 0,
    attackCooldown: 500, // 500ms between attacks
  });

  // Handle attacks (called from PlayerController when clicking or pressing attack button)
  const handleAttack = (playerPos: Vector3, targetEnemyId: string) => {
    const now = Date.now();
    if (now - combatRef.current.lastAttackTime < combatRef.current.attackCooldown) {
      return; // Still in cooldown
    }

    const enemy = enemies.find((e) => e.id === targetEnemyId);
    if (!enemy) return;

    // Check if in range
    const distToEnemy = playerPos.distanceTo(enemy.position);
    if (distToEnemy > 3) return; // Attack range

    // Deal damage
    const damage = 10; // Base damage
    const newHp = enemy.hp - damage;

    updateEnemyHP(targetEnemyId, newHp);

    // If dead, reward player
    if (newHp <= 0) {
      removeEnemy(targetEnemyId);
      rewardPlayer(enemy);
    }

    combatRef.current.lastAttackTime = now;
  };

  const rewardPlayer = async (enemy: any) => {
    try {
      // Add XP
      const xpRes = await apiClient.addXP(enemy.xpReward);
      playerStore.setPlayerData({
        xp: xpRes.data.newLevel * 100,
        level: xpRes.data.newLevel,
      });

      // Add coins
      const coinsRes = await apiClient.addCoins(enemy.coinReward);
      playerStore.setPlayerData({ coins: coinsRes.data.coins });
    } catch (err) {
      console.error('Failed to reward player', err);
    }
  };

  // Expose attack function globally for input handling
  (window as any).nexoraAttack = handleAttack;

  return null;
}
