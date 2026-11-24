import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DeveloperCharacterProps {
  isWaving?: boolean;
  actionSpeech?: string;
}

export const DeveloperCharacter: React.FC<DeveloperCharacterProps> = ({ 
  isWaving = false,
  actionSpeech 
}) => {
  const [blink, setBlink] = useState<boolean>(false);
  const [typingHand, setTypingHand] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Blinking loop (blinks every 3.5 - 5 seconds)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Rapid typing hands loop
  useEffect(() => {
    if (isWaving) return;
    const typeInterval = setInterval(() => {
      setTypingHand(prev => (prev === 0 ? 1 : 0));
    }, 180);
    return () => clearInterval(typeInterval);
  }, [isWaving]);

  // Gentle eye/head reaction to cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] md:max-w-[500px] flex flex-col items-center select-none">
      {/* Comic Speech Bubble */}
      {actionSpeech && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="absolute -top-20 md:-top-24 right-4 md:right-8 z-30 speech-bubble px-4 py-2 font-bangers text-lg md:text-xl text-black border-4 border-black rounded-xl max-w-[260px] text-center"
        >
          {actionSpeech}
        </motion.div>
      )}

      {/* SVG Comic Developer Character Canvas */}
      <svg
        viewBox="0 0 500 520"
        className="w-full h-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
      >
        <defs>
          <linearGradient id="neonGlowPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007F" />
            <stop offset="100%" stopColor="#FF5400" />
          </linearGradient>
          <linearGradient id="screenCode" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D1628" />
            <stop offset="100%" stopColor="#060910" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B0F2E" />
            <stop offset="100%" stopColor="#0B0614" />
          </linearGradient>
        </defs>

        {/* ── Background: Gamer Chair ── */}
        <path
          d="M170,120 Q250,90 330,120 L350,340 Q250,360 150,340 Z"
          fill="#1C0D2A"
          stroke="#000"
          strokeWidth="6"
        />
        {/* Chair Headrest with Neon Accent */}
        <rect x="200" y="80" width="100" height="45" rx="8" fill="#FF007F" stroke="#000" strokeWidth="5" />
        <text x="250" y="108" fill="#FFF" fontFamily="Bangers" fontSize="18" textAnchor="middle">VYPR</text>

        {/* ── Character Torso (Stylish Dark Bomber / Hoodie with Neon Trim) ── */}
        <g>
          <path
            d="M150,320 Q250,300 350,320 L380,480 L120,480 Z"
            fill="url(#hoodieGrad)"
            stroke="#000"
            strokeWidth="6"
          />
          {/* Neon Pink & Cyan Collar Trim */}
          <path d="M210,310 L250,370 L290,310" fill="none" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" />
          <path d="M250,370 L250,480" stroke="#FF007F" strokeWidth="4" />
        </g>

        {/* ── Character Head & Face ── */}
        <motion.g
          animate={{
            x: mousePos.x * 0.4,
            y: mousePos.y * 0.4,
          }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        >
          {/* Neck */}
          <rect x="230" y="270" width="40" height="50" fill="#E8B088" stroke="#000" strokeWidth="5" />

          {/* Face base */}
          <path
            d="M190,170 Q250,150 310,170 Q325,240 300,285 Q250,320 200,285 Q175,240 190,170 Z"
            fill="#F2BF99"
            stroke="#000"
            strokeWidth="6"
          />

          {/* Stylized Modern Hair (Surya's crop fade + texture) */}
          <path
            d="M175,175 Q185,120 230,110 Q280,105 320,135 Q335,160 325,185 Q310,145 270,140 Q220,140 185,180 Z"
            fill="#120A1A"
            stroke="#000"
            strokeWidth="6"
          />
          {/* Hair highlights (magenta rim reflection) */}
          <path d="M205,125 Q245,115 285,125" stroke="#FF007F" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Eyebrows */}
          <path d="M205,200 Q225,192 235,202" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <path d="M265,202 Q275,192 295,200" stroke="#000" strokeWidth="5" strokeLinecap="round" />

          {/* Eyes (Open or Blinking) */}
          {blink ? (
            <>
              {/* Blinking closed eyes */}
              <line x1="208" y1="218" x2="232" y2="218" stroke="#000" strokeWidth="4" strokeLinecap="round" />
              <line x1="268" y1="218" x2="292" y2="218" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="220" cy="216" rx="12" ry="9" fill="#FFF" stroke="#000" strokeWidth="3" />
              <circle
                cx={220 + mousePos.x * 0.18}
                cy={216 + mousePos.y * 0.18}
                r="5"
                fill="#1E140A"
              />
              <circle cx="218" cy="214" r="2" fill="#FFF" />

              {/* Right Eye */}
              <ellipse cx="280" cy="216" rx="12" ry="9" fill="#FFF" stroke="#000" strokeWidth="3" />
              <circle
                cx={280 + mousePos.x * 0.18}
                cy={216 + mousePos.y * 0.18}
                r="5"
                fill="#1E140A"
              />
              <circle cx="278" cy="214" r="2" fill="#FFF" />
            </>
          )}

          {/* Nose */}
          <path d="M250,225 L245,248 L256,248" stroke="#C4845D" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Confident Smile */}
          <path d="M232,268 Q250,280 268,268" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* ── Desk & Dual Ultrawide Displays ── */}
        {/* Desk top */}
        <polygon points="40,440 460,440 490,520 10,520" fill="#0C0816" stroke="#000" strokeWidth="6" />
        <line x1="40" y1="440" x2="460" y2="440" stroke="#FF007F" strokeWidth="4" />

        {/* Computer Screen */}
        <rect
          x="110"
          y="310"
          width="280"
          height="145"
          rx="10"
          fill="url(#screenCode)"
          stroke="#00F0FF"
          strokeWidth="6"
          filter="drop-shadow(0 0 16px rgba(0,240,255,0.4))"
        />
        {/* Screen Stand */}
        <rect x="235" y="440" width="30" height="25" fill="#1C1428" stroke="#000" strokeWidth="4" />

        {/* Active Animated Code Lines on Screen */}
        <g opacity="0.85">
          <rect x="130" y="328" width="60" height="7" rx="3" fill="#FF007F" />
          <rect x="198" y="328" width="90" height="7" rx="3" fill="#00F0FF" />
          <rect x="145" y="344" width="110" height="7" rx="3" fill="#FFDE59" />
          <rect x="145" y="360" width="140" height="7" rx="3" fill="#FFF" />
          <rect x="160" y="376" width="75" height="7" rx="3" fill="#FF007F" />
          <rect x="160" y="392" width="120" height="7" rx="3" fill="#00F0FF" />
          <rect x="130" y="408" width="50" height="7" rx="3" fill="#22C55E" />
          {/* Blinking cursor on monitor */}
          <rect x="185" y="408" width="8" height="9" fill="#00F0FF" className="animate-pulse" />
        </g>

        {/* Keyboard on Desk */}
        <polygon points="170,455 330,455 345,490 155,490" fill="#181126" stroke="#000" strokeWidth="4" />
        {/* RGB Keyboard Backlight Glow */}
        <line x1="168" y1="472" x2="332" y2="472" stroke="#FF007F" strokeWidth="3" opacity="0.8" />

        {/* ── Hands: Typing or Waving ── */}
        {isWaving ? (
          /* Waving Arm (For Contact Scene) */
          <motion.g
            animate={{ rotate: [-10, 18, -10] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "340px", originY: "380px" }}
          >
            <path d="M340,360 Q380,260 410,220" stroke="#120A1A" strokeWidth="26" strokeLinecap="round" fill="none" />
            <circle cx="415" cy="210" r="18" fill="#F2BF99" stroke="#000" strokeWidth="4" />
            {/* Waving fingers */}
            <circle cx="410" cy="195" r="5" fill="#F2BF99" />
            <circle cx="422" cy="198" r="5" fill="#F2BF99" />
            <circle cx="432" cy="208" r="5" fill="#F2BF99" />
          </motion.g>
        ) : (
          /* Typing Hands bouncing alternately */
          <g>
            {/* Left Hand */}
            <motion.ellipse
              cx="215"
              cy={typingHand === 0 ? 462 : 466}
              rx="18"
              ry="12"
              fill="#F2BF99"
              stroke="#000"
              strokeWidth="4"
              transition={{ duration: 0.1 }}
            />
            {/* Right Hand */}
            <motion.ellipse
              cx="285"
              cy={typingHand === 1 ? 462 : 466}
              rx="18"
              ry="12"
              fill="#F2BF99"
              stroke="#000"
              strokeWidth="4"
              transition={{ duration: 0.1 }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
