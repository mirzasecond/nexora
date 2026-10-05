import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGameWorldStore } from '../store/gameWorld';

interface NPCMeshRef {
  mesh: Mesh;
  npcId: string;
}

// Helper to convert position to array
function toArray(pos: any): [number, number, number] {
  if (Array.isArray(pos)) return [pos[0] || 0, pos[1] || 0, pos[2] || 0];
  if (pos && typeof pos === 'object') return [pos.x || 0, pos.y || 0, pos.z || 0];
  return [0, 1, 0];
}

export default function NPCController() {
  const { npcs } = useGameWorldStore();
  const meshesRef = useRef<NPCMeshRef[]>([]);

  useFrame(() => {
    // Simple animation: NPCs hover slightly
    meshesRef.current.forEach(({ mesh }) => {
      const baseY = mesh.userData.baseY || 1;
      mesh.position.y = baseY + Math.sin(Date.now() * 0.002) * 0.2;
    });
  });

  return (
    <>
      {npcs.map((npc) => {
        const color =
          npc.type === 'quest_giver'
            ? '#fbbf24'
            : npc.type === 'merchant'
              ? '#60a5fa'
              : '#a78bfa';

        const pos = toArray(npc.position);

        return (
          <mesh
            key={npc.id}
            position={pos}
            ref={(el) => {
              if (el) {
                el.userData.baseY = pos[1];
                meshesRef.current = meshesRef.current.filter((m) => m.npcId !== npc.id);
                meshesRef.current.push({ mesh: el, npcId: npc.id });
              }
            }}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.4, 0.4, 1.6, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </>
  );
}
