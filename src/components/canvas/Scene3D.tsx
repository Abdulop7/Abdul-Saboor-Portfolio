"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { useScroll } from "framer-motion";
import { DraggableWireframeCube, ScrollMonolithShape } from "./FidgetObject";

export default function Scene3D() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const unsub = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return () => unsub();
  }, [scrollYProgress]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto mix-blend-screen opacity-60">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          
          {/* Scroll-driven high-tech monoliths */}
          <ScrollMonolithShape position={[-6, 2, -6]} scrollProgress={scrollRef} scale={1.8} color="#CCFF00" />
          <ScrollMonolithShape position={[6, -4, -8]} scrollProgress={scrollRef} scale={2.2} color="#00FFCC" />
          
          {/* Grabbable objects */}
          <DraggableWireframeCube position={[3, 2, -4]} scale={0.8} />
          <DraggableWireframeCube position={[-4, -3, -5]} scale={1.1} />

        </Suspense>
      </Canvas>
    </div>
  );
}
