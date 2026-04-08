"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function PointerNetwork() {
  const ref = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }

  useFrame((state) => {
    if (ref.current) {
      // Particles slowly rotate
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      
      // But also tilt based on pointer
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetY, 0.05);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetX, 0.05);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#2dd4bf" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function ReactiveElement({ position, rotation, type }: { position: [number, number, number], rotation: [number, number, number], type: 'db' | 'bracket' | 'server' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Elements react aggressively to the pointer
      const targetX = position[0] + (state.pointer.x * 2);
      const targetY = position[1] + (state.pointer.y * 2);
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);

      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const material = new THREE.MeshPhysicalMaterial({
    color: "#14b8a6",
    emissive: "#0f766e",
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} rotation={rotation} material={material}>
        {type === 'db' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {type === 'server' && <boxGeometry args={[1, 1.5, 0.3]} />}
        {type === 'bracket' && <torusKnotGeometry args={[0.4, 0.1, 100, 16]} />}
      </mesh>
    </Float>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <CameraRig />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#2dd4bf" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        {/* Core web elements floating in background */}
        <ReactiveElement position={[-4, 2, -2]} rotation={[0.4, -0.2, 0]} type="bracket" />
        <ReactiveElement position={[5, -1, -5]} rotation={[0.1, 0.5, 0]} type="server" />
        <ReactiveElement position={[-3, -3, -3]} rotation={[1, 0, 0]} type="db" />
        <ReactiveElement position={[3, 3, -4]} rotation={[0, 0.8, 0.2]} type="bracket" />

        <PointerNetwork />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
