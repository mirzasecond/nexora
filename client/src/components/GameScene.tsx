import React, { useMemo, useEffect } from 'react';
import { useGameWorldStore } from '../store/gameWorld';
import NPCController from './NPCController';
import EnemyController from './EnemyController';

export default function GameScene() {
  const groundSize = 400;
  const { addNPC, addEnemy } = useGameWorldStore();

  // Initialize world on mount
  useEffect(() => {
    // Add NPCs
    addNPC({
      id: 'npc_1',
      name: 'Elder',
      position: [0, 1.5, -20],
      type: 'quest_giver',
      dialogue: 'Welcome, adventurer. We need help...',
    });

    addNPC({
      id: 'npc_2',
      name: 'Merchant',
      position: [8, 1.5, -15],
      type: 'merchant',
      dialogue: 'Looking to buy or sell?',
    });

    // Add enemies
    addEnemy({
      id: 'slime_1',
      name: 'Forest Slime',
      position: { x: 20, y: 1, z: 10 } as any,
      hp: 30,
      maxHp: 30,
      damage: 5,
      xpReward: 25,
      coinReward: 10,
      speed: 3,
      detectionRange: 30,
      attackRange: 2,
      attackCooldown: 1000,
    });

    addEnemy({
      id: 'slime_2',
      name: 'Forest Slime',
      position: { x: -20, y: 1, z: 15 } as any,
      hp: 30,
      maxHp: 30,
      damage: 5,
      xpReward: 25,
      coinReward: 10,
      speed: 3,
      detectionRange: 30,
      attackRange: 2,
      attackCooldown: 1000,
    });
  }, [addNPC, addEnemy]);

  const buildings = useMemo(
    () => [
      { pos: [0, 0.5, -20], scale: [5, 2, 8], color: '#6b7280' },
      { pos: [15, 0.5, -15], scale: [4, 2.5, 6], color: '#4b5563' },
      { pos: [-15, 0.5, -15], scale: [4, 2.5, 6], color: '#6b7280' },
    ],
    []
  );

  return (
    <>
      {/* Ground */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[groundSize, 1, groundSize]} />
        <meshStandardMaterial color="#1a2847" />
      </mesh>

      {/* Buildings */}
      {buildings.map((building, i) => (
        <mesh
          key={i}
          position={building.pos as [number, number, number]}
          scale={building.scale as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}

      {/* NPCs */}
      <NPCController />

      {/* Enemies */}
      <EnemyController />

      {/* Sky dome */}
      <mesh position={[0, 100, 0]}>
        <sphereGeometry args={[300, 8, 8]} />
        <meshBasicMaterial color="#0f172a" side={1} />
      </mesh>
    </>
  );
}

