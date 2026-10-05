import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameWorldStore } from '../store/gameWorld';

interface EnemyState {
  position: Vector3;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'dead';
  targetPlayer: boolean;
}

// Helper to convert any position format to Vector3
function toVector3(pos: any): Vector3 {
  if (pos instanceof Vector3) return pos.clone();
  if (Array.isArray(pos)) return new Vector3(pos[0], pos[1], pos[2]);
  if (pos && typeof pos === 'object') return new Vector3(pos.x || 0, pos.y || 0, pos.z || 0);
  return new Vector3(0, 1, 0);
}

export default function EnemyController() {
  const { enemies } = useGameWorldStore();
  const meshesRef = useRef<Map<string, Mesh>>(new Map());
  const statesRef = useRef<Map<string, EnemyState>>(new Map());

  // Initialize enemies
  useEffect(() => {
    enemies.forEach((enemy) => {
      if (!statesRef.current.has(enemy.id)) {
        statesRef.current.set(enemy.id, {
          position: toVector3(enemy.position),
          state: 'patrol',
          targetPlayer: false,
        });
      }
    });
  }, [enemies]);

  useFrame(() => {
    const playerPos = new Vector3(0, 1, 0); // Player position

    enemies.forEach((enemy) => {
      const mesh = meshesRef.current.get(enemy.id);
      if (!mesh) return;

      const state = statesRef.current.get(enemy.id);
      if (!state) return;

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
        const wanderAngle = Math.sin(Date.now() * 0.001) * 0.5;
        state.position.x += Math.cos(wanderAngle) * 0.5 * 0.016;
        state.position.z += Math.sin(wanderAngle) * 0.5 * 0.016;
      }

      // Update mesh
      mesh.position.copy(state.position);
    });
  });

  return (
    <>
      {enemies.map((enemy) => {
        const pos = toVector3(enemy.position);
        return (
          <mesh
            key={enemy.id}
            ref={(el) => {
              if (el) meshesRef.current.set(enemy.id, el);
            }}
            position={[pos.x, pos.y, pos.z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.6, 0.8, 0.6]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        );
      })}
    </>
  );
}
