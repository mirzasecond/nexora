import React from 'react';
import { Canvas } from '@react-three/fiber';
import GameHUD from '../components/GameHUD';
import GameScene from '../components/GameScene';
import PlayerController from '../components/PlayerController';
import CombatSystem from '../systems/CombatSystem';

export default function GamePage() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 5, 8], far: 500 }}
        dpr={window.devicePixelRatio}
      >
        <color attach="background" args={['#0a0e27']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 50, 50]} intensity={0.8} castShadow />
        <fog attach="fog" args={['#0a0e27', 50, 300]} />

        <GameScene />
        <PlayerController />
      </Canvas>

      <CombatSystem />
      <GameHUD />
    </div>
  );
}
