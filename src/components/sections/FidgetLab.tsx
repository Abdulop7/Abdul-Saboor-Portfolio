"use client";
import React, { useState, useEffect } from "react";

export function FidgetLab() {
  const [tiles, setTiles] = useState<number[]>([]);
  
  useEffect(() => {
     // Generate an array we can map over. Using 600 tiles for a dense, satisfying grid.
     setTiles(Array.from({ length: 600 }).map((_, i) => i));
  }, []);

  return (
    <section className="h-[60vh] md:h-screen flex flex-col relative overflow-hidden bg-black z-30 brutal-border-b">
      
      {/* The Interactive Trailing Grid */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] grid-rows-[repeat(auto-fit,minmax(40px,1fr))] opacity-70 cursor-crosshair">
         {tiles.map((id) => (
            <HoverTile key={id} />
         ))}
      </div>
      
      {/* Floating Monolithic Typography over the Fidget Grid */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8 mix-blend-difference">
         <h2 className="text-[12vw] font-bold heading text-white text-center leading-[0.8] uppercase">
            FIDGET<br/>ZONE
         </h2>
         <p className="text-zinc-400 font-mono text-xl mt-6 tracking-widest uppercase">
            [ PAINT THE GRID ]
         </p>
      </div>
      
    </section>
  );
}

// Separate component to isolate state for thousands of DOM nodes efficiently
function HoverTile() {
  const [active, setActive] = useState(false);
  
  return (
    <div 
      className="w-full h-full border-[0.5px] border-white/5 transition-colors ease-out"
      style={{ 
         backgroundColor: active ? "#00FFCC" : "transparent", 
         transitionDuration: active ? "0s" : "1.5s", // Snap to color, fade out slowly
         border: active ? "1px solid #00FFCC" : "0.5px solid rgba(255,255,255,0.05)"
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    />
  );
}
