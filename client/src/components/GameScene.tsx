import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function GameScene() {
  // Ground
  const groundSize = 400;

  // Simple city area
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

      {/* Simple buildings */}
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

      {/* Sky dome (simple colored box at distance) */}
      <mesh position={[0, 100, 0]}>
        <sphereGeometry args={[300, 8, 8]} />
        <meshBasicMaterial color="#0f172a" side={1} />
      </mesh>
    </>
  );
}
