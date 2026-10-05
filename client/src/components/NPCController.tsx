import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameWorldStore } from '../store/gameWorld';

interface NPCMeshRef {
  mesh: Mesh;
  npcId: string;
}

export default function NPCController() {
  const { npcs } = useGameWorldStore();
  const meshesRef = useRef<NPCMeshRef[]>([]);

  useFrame(() => {
    // Simple animation: NPCs hover slightly
    meshesRef.current.forEach(({ mesh }) => {
      mesh.position.y = mesh.userData.baseY + Math.sin(Date.now() * 0.002) * 0.2;
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

        return (
          <mesh
            key={npc.id}
            position={npc.position}
            ref={(el) => {
              if (el) {
                el.userData.baseY = npc.position[1];
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
