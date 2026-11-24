import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface DeveloperCharacterProps {
  isWaving?: boolean;
  actionSpeech?: string;
  showHiBubble?: boolean;
}

export const DeveloperCharacter: React.FC<DeveloperCharacterProps> = ({ 
  isWaving = true,
  actionSpeech,
  showHiBubble = true
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  // Gentle reaction to cursor movement (subtle 3D parallax tracking)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (shouldReduceMotion) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  return (
    <div className="relative w-full max-w-[420px] md:max-w-[490px] flex flex-col items-center select-none">
      
      {/* Floating "HI!" Speech Bubble near the waving hand */}
      {showHiBubble && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 18, 
            delay: 0.25 
          }}
          className="absolute top-1 md:top-2 right-2 md:right-4 z-40 bg-white text-black px-3.5 py-1.5 rounded-full border-3 border-black shadow-[3px_3px_0px_#00F0FF] font-bangers text-xl tracking-wider rotate-6 flex items-center gap-1.5"
        >
          <span>HI!</span>
          <span className="text-base animate-pulse">👋</span>
        </motion.div>
      )}

      {/* Dynamic Action / Dialog Speech Bubble */}
      {actionSpeech && (
        <motion.div
          key={actionSpeech}
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 z-30 bg-[#FFF] text-black px-4 py-2 font-bangers text-base sm:text-lg tracking-wide border-4 border-black rounded-2xl shadow-[4px_4px_0px_#FF007F] max-w-[280px] text-center pointer-events-none"
        >
          {actionSpeech}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-black rotate-45" />
        </motion.div>
      )}

      {/* SVG Container: Layering Chair, Character Avatar & Coding Station */}
      <svg
        viewBox="0 0 500 520"
        className="w-full h-auto filter drop-shadow-[0_16px_35px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Subtle Vice City Neon Rim Glow Filters */}
          <filter id="avatarNeonRim" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00F0FF" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#FF007F" floodOpacity="0.35" />
          </filter>

          <filter id="spNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00F0FF" floodOpacity="0.8" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FF007F" floodOpacity="0.6" />
          </filter>

          <linearGradient id="screenCode" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1324" />
            <stop offset="100%" stopColor="#040710" />
          </linearGradient>

          <linearGradient id="neonCyanPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#FF007F" />
          </linearGradient>
        </defs>

        {/* ── Layer 1: Background Gamer Chair ── */}
        <g>
          {/* Ambient chair back glow */}
          <ellipse cx="250" cy="220" rx="140" ry="160" fill="#9D00FF" opacity="0.15" />
          
          {/* Chair Body */}
          <path
            d="M165,115 Q250,85 335,115 L355,345 Q250,365 145,345 Z"
            fill="#140924"
            stroke="#000"
            strokeWidth="6"
          />
          {/* Cyan/Magenta Edge Accent lines on chair */}
          <path d="M172,130 L158,335" stroke="#FF007F" strokeWidth="3" opacity="0.8" />
          <path d="M328,130 L342,335" stroke="#00F0FF" strokeWidth="3" opacity="0.8" />

          {/* Chair Headrest with "VYPR" Monogram */}
          <rect x="195" y="70" width="110" height="42" rx="8" fill="#FF007F" stroke="#000" strokeWidth="5" />
          <text x="250" y="97" fill="#FFF" fontFamily="Bangers" fontSize="18" textAnchor="middle" letterSpacing="2">
            VYPR
          </text>
        </g>

        {/* ── Layer 2: Premium Personalized Surya Developer Avatar (Transparent PNG) ── */}
        <motion.g
          animate={shouldReduceMotion ? {} : {
            x: mousePos.x * 0.35,
            y: [0, -3.5, 0],
          }}
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            x: { ease: "easeOut", duration: 0.25 }
          }}
          style={{ originX: "250px", originY: "300px" }}
        >
          {/* Neon rim ambient aura directly behind avatar */}
          <ellipse cx="250" cy="260" rx="160" ry="170" fill="#00F0FF" opacity="0.12" filter="blur(20px)" />
          <ellipse cx="270" cy="240" rx="140" ry="150" fill="#FF007F" opacity="0.1" filter="blur(25px)" />

          {/* Transparent PNG Character Cutout */}
          <image
            href="/surya-avatar.png"
            x="40"
            y="42"
            width="420"
            height="420"
            preserveAspectRatio="xMidYMid meet"
            filter="url(#avatarNeonRim)"
          />

          {/* Subtle Glowing "SP" Monogram Emblem Highlight on Hoodie Chest */}
          <g transform="translate(205, 305)" filter="url(#spNeonGlow)">
            <rect x="0" y="0" width="34" height="20" rx="5" fill="#080410" stroke="#00F0FF" strokeWidth="2" opacity="0.9" />
            <text x="17" y="15" fill="#FFF" fontFamily="Bangers" fontSize="14" textAnchor="middle" letterSpacing="1">
              <tspan fill="#00F0FF">S</tspan><tspan fill="#FF007F">P</tspan>
            </text>
          </g>
        </motion.g>

        {/* ── Layer 3: Foreground Coding Monitor & Futuristic Cyberpunk Desk ── */}
        <g>
          {/* Cyberpunk Desk Surface */}
          <polygon points="25,445 475,445 500,520 0,520" fill="#090514" stroke="#000" strokeWidth="6" />
          <line x1="25" y1="445" x2="475" y2="445" stroke="#00F0FF" strokeWidth="3.5" />

          {/* Futuristic Coding Display / Laptop Bezel */}
          <rect
            x="115"
            y="315"
            width="270"
            height="142"
            rx="10"
            fill="url(#screenCode)"
            stroke="#00F0FF"
            strokeWidth="5"
            filter="drop-shadow(0 0 16px rgba(0,240,255,0.45))"
          />
          {/* Monitor Stand Base */}
          <rect x="236" y="445" width="28" height="20" fill="#180F28" stroke="#000" strokeWidth="4" />

          {/* Active Animated Code Lines on Screen */}
          <g opacity="0.92">
            <rect x="134" y="332" width="60" height="6.5" rx="3" fill="#FF007F" />
            <rect x="200" y="332" width="90" height="6.5" rx="3" fill="#00F0FF" />
            <rect x="146" y="348" width="120" height="6.5" rx="3" fill="#FFDE59" />
            <rect x="146" y="364" width="145" height="6.5" rx="3" fill="#FFF" />
            <rect x="162" y="380" width="75" height="6.5" rx="3" fill="#A855F7" />
            <rect x="162" y="396" width="130" height="6.5" rx="3" fill="#00F0FF" />
            <rect x="134" y="412" width="50" height="6.5" rx="3" fill="#22C55E" />
            {/* Blinking Cyan Cursor */}
            <rect x="189" y="412" width="7.5" height="8.5" fill="#00F0FF" className="animate-pulse" />
          </g>

          {/* RGB Mechanical Keyboard Surface */}
          <polygon points="170,458 330,458 345,492 155,492" fill="#150C24" stroke="#000" strokeWidth="4" />
          <line x1="168" y1="472" x2="332" y2="472" stroke="#FF007F" strokeWidth="2.5" opacity="0.8" />
        </g>

      </svg>
    </div>
  );
};
export default DeveloperCharacter;
