import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { usePlayerStore } from '../store';

export default function PlayerController() {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const [velocity, setVelocity] = useState(new Vector3(0, 0, 0));
  const [isGrounded, setIsGrounded] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  const keys = useKeyboardControls();
  const moveSpeed = 10;
  const sprintSpeed = 20;
  const jumpForce = 15;

  // Handle combat attacks
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      if (meshRef.current && (window as any).nexoraAttack) {
        (window as any).nexoraAttack(meshRef.current.position, 'slime_1');
        setIsAttacking(true);
        setTimeout(() => setIsAttacking(false), 200);
      }
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const pos = meshRef.current.position;
    const vel = velocity.clone();

    // Movement input
    const moveDirection = new Vector3();

    if (keys.w) moveDirection.z -= 1;
    if (keys.s) moveDirection.z += 1;
    if (keys.a) moveDirection.x -= 1;
    if (keys.d) moveDirection.x += 1;

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      const speed = keys.shift ? sprintSpeed : moveSpeed;
      vel.x = moveDirection.x * speed;
      vel.z = moveDirection.z * speed;
    } else {
      vel.x *= 0.9;
      vel.z *= 0.9;
    }

    // Jump
    if (keys.space && isGrounded) {
      vel.y = jumpForce;
      setIsGrounded(false);
    }

    // Gravity
    vel.y -= 9.81 * 0.016;

    // Clamp to ground
    if (pos.y <= 1) {
      pos.y = 1;
      vel.y = 0;
      setIsGrounded(true);
    } else {
      setIsGrounded(false);
    }

    // Update position
    pos.add(vel.clone().multiplyScalar(0.016));

    // Boundary check
    if (pos.x > 200) pos.x = 200;
    if (pos.x < -200) pos.x = -200;
    if (pos.z > 200) pos.z = 200;
    if (pos.z < -200) pos.z = -200;

    setVelocity(vel);

    // Camera follow
    const cameraOffset = new Vector3(0, 5, 10);
    camera.position.lerp(pos.clone().add(cameraOffset), 0.1);
    camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 1, 0]}
      castShadow
      receiveShadow
      scale={isAttacking ? [1.05, 1.05, 1.05] : [1, 1, 1]}
    >
      <boxGeometry args={[0.6, 1.8, 0.6]} />
      <meshStandardMaterial color="#4f46e5" />
    </mesh>
  );
}
