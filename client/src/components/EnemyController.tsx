import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameWorldStore } from '../store/gameWorld';
import { usePlayerStore } from '../store';

interface EnemyState {
  position: Vector3;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'dead';
  targetPlayer: boolean;
}

export default function EnemyController() {
  const { enemies, updateEnemyHP, removeEnemy } = useGameWorldStore();
  const playerStore = usePlayerStore();
  const { camera } = useThree();
  const meshesRef = useRef<Map<string, Mesh>>(new Map());
  const statesRef = useRef<Map<string, EnemyState>>(new Map());

  // Initialize enemies
  useEffect(() => {
    enemies.forEach((enemy) => {
      if (!statesRef.current.has(enemy.id)) {
        statesRef.current.set(enemy.id, {
          position: enemy.position.clone(),
          state: 'patrol',
          targetPlayer: false,
        });
      }
    });
  }, [enemies]);

  useFrame(() => {
    const playerPos = new Vector3(0, 1, 0); // Player position (from camera or actual player mesh)

    enemies.forEach((enemy) => {
      const mesh = meshesRef.current.get(enemy.id);
      if (!mesh) return;

      const state = statesRef.current.get(enemy.id)!;
      const distToPlayer = state.position.distanceTo(playerPos);

      // State machine
      if (enemy.hp <= 0) {
        state.state = 'dead';
        mesh.visible = false;
        return;
      }

      if (distToPlayer < enemy.detectionRange && distToPlayer > 0) {
        state.targetPlayer = true;
        state.state = distToPlayer < enemy.attackRange ? 'attack' : 'chase';
      } else {
        state.targetPlayer = false;
        state.state = 'patrol';
      }

      // Movement
      if (state.state === 'chase') {
        const direction = playerPos.clone().sub(state.position).normalize();
        state.position.add(direction.multiplyScalar(enemy.speed * 0.016));
      } else if (state.state === 'patrol') {
        // Simple patrol (just wander a bit)
        const wanderAngle = Math.sin(Date.now() * 0.001) * 0.5;
        state.position.x += Math.cos(wanderAngle) * 0.5 * 0.016;
        state.position.z += Math.sin(wanderAngle) * 0.5 * 0.016;
      }

      // Update mesh
      mesh.position.copy(state.position);

      // Combat damage on attack
      if (state.state === 'attack' && Date.now() % 1000 < 100) {
        // Simplified: damage player every second
        // In real game, use proper cooldown system
      }
    });
  });

  return (
    <>
      {enemies.map((enemy) => (
        <mesh
          key={enemy.id}
          ref={(el) => {
            if (el) meshesRef.current.set(enemy.id, el);
          }}
          position={enemy.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.6, 0.8, 0.6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </>
  );
}
