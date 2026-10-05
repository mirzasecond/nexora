import { Vector3 } from 'three';
import { create } from 'zustand';

export interface NPC {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'quest_giver' | 'merchant' | 'guard';
  dialogue: string;
}

export interface Enemy {
  id: string;
  name: string;
  position: Vector3;
  hp: number;
  maxHp: number;
  damage: number;
  xpReward: number;
  coinReward: number;
  speed: number;
  detectionRange: number;
  attackRange: number;
  attackCooldown: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objective: string;
  objectiveCount: number;
  currentProgress: number;
  xpReward: number;
  coinReward: number;
  status: 'available' | 'active' | 'completed';
}

interface GameWorldStore {
  npcs: NPC[];
  enemies: Enemy[];
  quests: Quest[];
  addNPC: (npc: NPC) => void;
  addEnemy: (enemy: Enemy) => void;
  addQuest: (quest: Quest) => void;
  updateEnemyHP: (enemyId: string, hp: number) => void;
  removeEnemy: (enemyId: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
}

export const useGameWorldStore = create<GameWorldStore>((set) => ({
  npcs: [],
  enemies: [],
  quests: [],

  addNPC: (npc) => set((state) => ({ npcs: [...state.npcs, npc] })),

  addEnemy: (enemy) => set((state) => ({ enemies: [...state.enemies, enemy] })),

  addQuest: (quest) => set((state) => ({ quests: [...state.quests, quest] })),

  updateEnemyHP: (enemyId, hp) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, hp: Math.max(0, hp) } : e
      ),
    })),

  removeEnemy: (enemyId) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== enemyId),
    })),

  updateQuestProgress: (questId, progress) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, currentProgress: Math.min(progress, q.objectiveCount) }
          : q
      ),
    })),
}));
