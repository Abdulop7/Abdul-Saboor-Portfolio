"use client";
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";
import * as THREE from "three";

export function DraggableWireframeCube({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number], scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && !dragging && !hovered) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <DragControls 
      onDragStart={() => { document.body.style.cursor = "grabbing"; setDragging(true); }}
      onDragEnd={() => { document.body.style.cursor = "crosshair"; setDragging(false); }}
    >
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "grab"; setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = "crosshair"; setHover(false); }}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color={hovered || dragging ? "#00FFCC" : "#333333"} wireframe wireframeLinewidth={2} />
      </mesh>
    </DragControls>
  );
}

export function ScrollMonolithShape({ 
  position = [0, 0, 0], 
  scrollProgress, 
  color = "#CCFF00",
  scale = 1
}: { 
  position?: [number, number, number]; 
  scrollProgress: React.MutableRefObject<number>;
  color?: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Base slow rotation + scroll-driven massive rotation
      const scrollVal = scrollProgress.current || 0;
      meshRef.current.rotation.y = (scrollVal * Math.PI * 6) + 0.5;
      meshRef.current.rotation.x = (scrollVal * Math.PI * 2) + 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {/* Detail 1 creates a complex, fractured gem-like structure instead of a basic cone */}
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
      
      {/* Adding an inner solid core to make it look "Peak" high-tech */}
      <mesh scale={0.98}>
         <icosahedronGeometry args={[2, 1]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
    </mesh>
  );
}
