"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const SKILLS = [
  "NEXT.JS", "REACT.JS", "NODE.JS", "EXPRESS", "MONGODB", "POSTGRESQL",
  "PRISMA", "TYPESCRIPT", "TAILWIND", "GITHUB", "DOCKER", "AWS", "LINUX", "HTML5", "CSS3"
];

const TOTAL_TILES = 75; // 5 columns x 15 rows roughly (depends on screen)

export function SkillsBrutalist() {
  // Distribute exactly 15 skills predictably avoiding hydration mismatch
  const getTiles = () => {
    const tiles = [];
    let skillIndex = 0;
    
    for (let i = 0; i < TOTAL_TILES; i++) {
      // Place a skill exactly every 5 blocks
      if (i % 5 === 2 && skillIndex < SKILLS.length) {
        tiles.push({ id: i, skill: SKILLS[skillIndex] });
        skillIndex++;
      } else {
        tiles.push({ id: i, skill: null });
      }
    }
    return tiles;
  };

  const tiles = getTiles();

  return (
    <section id="skills" className="min-h-screen brutal-border-b flex flex-col bg-black relative overflow-hidden">
      
      {/* Massive Typographic Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-difference z-20">
         <motion.h2 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="text-[18vw] md:text-[14vw] font-bold heading text-white uppercase leading-[0.8] opacity-30 text-center"
         >
           TECH
           <br />
           STACK
         </motion.h2>
      </div>

      {/* Blended Fidget Grid */}
      <div className="flex-grow grid grid-cols-[repeat(5,minmax(0,1fr))] md:grid-cols-[repeat(10,minmax(0,1fr))] auto-rows-fr relative z-10">
         {tiles.map((tile) => (
            <HoverSkillTile key={tile.id} skill={tile.skill} />
         ))}
      </div>
    </section>
  );
}

function HoverSkillTile({ skill }: { skill: string | null }) {
  const [active, setActive] = useState(false);
  
  return (
    <div 
      className="border border-white/5 flex items-center justify-center p-2 relative overflow-hidden transition-all ease-out cursor-crosshair min-h-[80px]"
      style={{ 
         backgroundColor: active ? "#00FFCC" : "transparent",
         borderColor: active ? "white" : "rgba(255,255,255,0.05)",
         transitionDuration: active ? "0s" : "1.5s"
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {skill ? (
        <span 
          className="font-mono text-sm md:text-xl uppercase tracking-[0.2em] font-bold transition-all ease-out z-10"
          style={{
            color: active ? "#000" : "rgb(113 113 122)",
            transitionDuration: active ? "0s" : "1.5s",
            transform: active ? "scale(1.1)" : "scale(1)"
          }}
        >
          {active ? `[${skill}]` : skill}
        </span>
      ) : (
        <div 
          className="w-2 h-2 rounded-full transition-all ease-out" 
          style={{
             backgroundColor: active ? "black" : "transparent",
             transitionDuration: active ? "0s" : "1.5s"
          }}
        />
      )}
    </div>
  );
}
