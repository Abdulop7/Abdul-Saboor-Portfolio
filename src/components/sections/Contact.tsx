"use client";
import React from "react";
import { motion } from "framer-motion";

export function ContactBlock() {
  return (
    <section id="contact" className="min-h-screen flex flex-col bg-[#CCFF00] text-black">
      
      {/* Header Block */}
      <div className="p-8 md:p-16 lg:p-24 border-b border-black/20 flex flex-col justify-end min-h-[40vh]">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-mono text-black font-bold text-xl md:text-3xl uppercase tracking-widest mb-4 block">
             // TERMINAL_OUT
          </span>
          <h2 className="text-[18vw] md:text-[14vw] font-bold heading uppercase leading-[0.8] tracking-tighter">
            LET'S
            <br />
            TALK
          </h2>
        </motion.div>
      </div>

      {/* Massive Monolithic Grid */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2">
         
         {/* Information Col */}
         <div className="p-8 md:p-16 border-r border-black/20 flex flex-col justify-between">
            <p className="font-body text-2xl md:text-4xl uppercase leading-relaxed font-bold max-w-lg mb-12 mix-blend-multiply">
               Available for freelance opportunities, radical architecture collaborations, and high-performance system design.
            </p>
            <div>
               <p className="font-mono text-sm uppercase tracking-widest font-bold mb-2">Location Code</p>
               <p className="font-heading text-5xl uppercase font-bold text-black border-l-8 border-black pl-4">MULTAN, PK</p>
            </div>
         </div>

         {/* Interactive Links Col */}
         <div className="flex flex-col bg-black text-white">
            <ContactLink href="mailto:abdulsaboora691@gmail.com" label="Email" value="Message" />
            <ContactLink href="tel:+923098113300" label="Phone" value="Call Now" />
            
            <div className="grid grid-cols-2 mt-auto border-t border-white/20">
               <SocialLink href="https://www.linkedin.com/in/abdul-saboor-1333b8167" label="LinkedIn" />
               <SocialLink href="https://github.com/Abdulop7" label="GitHub" />
               <SocialLink href="https://www.instagram.com/abdul_saboor78/?hl=en" label="Instagram" />
               <SocialLink href="https://www.facebook.com/profile.php?id=61565458451605" label="Facebook" />
            </div>
         </div>
      </div>

    </section>
  );
}

function ContactLink({ href, label, value }: { href: string, label: string, value: string }) {
  return (
    <a 
      href={href} 
      className="group hover:bg-[#00FFCC] hover:text-black flex justify-between items-center p-8 md:p-12 border-b border-white/20 flex-grow transition-colors"
    >
      <span className="font-mono text-zinc-500 group-hover:text-black font-bold uppercase text-xl md:text-2xl tracking-widest">
         [{label}]
      </span>
      <span className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tighter truncate ml-4 group-hover:scale-105 transition-transform origin-right">
         {value}
      </span>
    </a>
  );
}

function SocialLink({ href, label }: { href: string, label: string }) {
  // Ensure the odd elements have border right correctly depending on grid structure
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="p-8 text-center border-r border-b border-white/20 hover:bg-[#FF3366] hover:text-black font-heading text-3xl font-bold text-white uppercase transition-colors flex items-center justify-center"
    >
      {label}
    </a>
  );
}
