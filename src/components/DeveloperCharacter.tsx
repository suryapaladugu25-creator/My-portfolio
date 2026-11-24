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
  const [blink, setBlink] = useState<boolean>(false);
  const [typingHand, setTypingHand] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  // Blinking loop (blinks every 3.5 - 5 seconds)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Subtle keyboard activity on left hand
  useEffect(() => {
    const typeInterval = setInterval(() => {
      setTypingHand(prev => (prev === 0 ? 1 : 0));
    }, 240);
    return () => clearInterval(typeInterval);
  }, []);

  // Gentle eye/head reaction to cursor movement (subtle tracking)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (shouldReduceMotion) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  return (
    <div className="relative w-full max-w-[420px] md:max-w-[480px] flex flex-col items-center select-none">
      
      {/* Small "HI!" Speech Bubble near the waving hand */}
      {showHiBubble && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 18, 
            delay: 0.3 
          }}
          className="absolute top-2 md:top-4 right-2 md:right-6 z-40 bg-white text-black px-3.5 py-1.5 rounded-full border-3 border-black shadow-[3px_3px_0px_#00F0FF] font-bangers text-xl tracking-wider rotate-6 flex items-center gap-1"
        >
          <span>HI!</span>
          <span className="text-sm">👋</span>
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

      {/* SVG Comic Developer Character Canvas */}
      <svg
        viewBox="0 0 500 520"
        className="w-full h-auto filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <linearGradient id="neonGlowPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007F" />
            <stop offset="100%" stopColor="#FF5400" />
          </linearGradient>

          <linearGradient id="darkHoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E192B" />
            <stop offset="60%" stopColor="#120D1D" />
            <stop offset="100%" stopColor="#08050D" />
          </linearGradient>

          <linearGradient id="hoodInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D0716" />
            <stop offset="100%" stopColor="#1A1226" />
          </linearGradient>

          <linearGradient id="screenCode" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0C1527" />
            <stop offset="100%" stopColor="#050811" />
          </linearGradient>

          <linearGradient id="sunglassesLens" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#120D1F" />
            <stop offset="50%" stopColor="#1F1333" />
            <stop offset="100%" stopColor="#0B0614" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5C4A3" />
            <stop offset="100%" stopColor="#E0A780" />
          </linearGradient>
        </defs>

        {/* ── Background: Gamer Chair ── */}
        <path
          d="M170,120 Q250,90 330,120 L350,340 Q250,360 150,340 Z"
          fill="#160B24"
          stroke="#000"
          strokeWidth="6"
        />
        {/* Chair Headrest with Neon Accent */}
        <rect x="200" y="80" width="100" height="42" rx="8" fill="#FF007F" stroke="#000" strokeWidth="5" />
        <text x="250" y="107" fill="#FFF" fontFamily="Bangers" fontSize="17" textAnchor="middle" letterSpacing="2">
          VYPR
        </text>

        {/* ── Character Torso: Modern Dark Streetwear Hoodie ── */}
        <g>
          {/* Main hoodie body with broad athletic boy shoulders */}
          <path
            d="M140,320 Q250,290 360,320 L385,480 L115,480 Z"
            fill="url(#darkHoodieGrad)"
            stroke="#000"
            strokeWidth="6"
          />

          {/* Folded Hood framing neck and shoulders */}
          <path
            d="M165,305 Q250,280 335,305 Q355,340 330,365 Q250,375 170,365 Q145,340 165,305 Z"
            fill="url(#hoodInner)"
            stroke="#000"
            strokeWidth="5"
          />

          {/* Hoodie V-collar seam */}
          <path
            d="M215,315 L250,375 L285,315"
            fill="#120822"
            stroke="#000"
            strokeWidth="5"
          />

          {/* Hoodie drawstrings with electric cyan / pink aglets */}
          <path d="M232,365 Q230,405 228,425" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="225" y="425" width="6" height="10" rx="2" fill="#00F0FF" stroke="#000" strokeWidth="2" />

          <path d="M268,365 Q270,405 272,425" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="269" y="425" width="6" height="10" rx="2" fill="#FF007F" stroke="#000" strokeWidth="2" />

          {/* Minimalist developer chest badge: </> */}
          <rect x="175" y="380" width="36" height="22" rx="4" fill="#0C0517" stroke="#00F0FF" strokeWidth="2" />
          <text x="193" y="396" fill="#00F0FF" fontFamily="JetBrains Mono" fontSize="12" fontWeight="bold" textAnchor="middle">
            &lt;/&gt;
          </text>

          {/* Kangaroo Pocket Outline */}
          <path
            d="M180,445 L320,445 L335,480 L165,480 Z"
            fill="#100A1A"
            stroke="#000"
            strokeWidth="4"
          />
        </g>

        {/* ── Character Head, Hair & Facial Features ── */}
        <motion.g
          animate={shouldReduceMotion ? {} : {
            x: mousePos.x * 0.35,
            y: mousePos.y * 0.3,
          }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        >
          {/* Athletic Neck */}
          <rect x="228" y="260" width="44" height="55" fill="url(#skinGrad)" stroke="#000" strokeWidth="5" />
          <path d="M242,280 L250,295 L258,280" stroke="#C88E67" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* Ears (Male anatomical placement on sides) */}
          {/* Left Ear */}
          <ellipse cx="180" cy="225" rx="8" ry="14" fill="url(#skinGrad)" stroke="#000" strokeWidth="4" />
          <path d="M178,220 Q182,225 178,230" stroke="#C88E67" strokeWidth="2" fill="none" />

          {/* Right Ear */}
          <ellipse cx="320" cy="225" rx="8" ry="14" fill="url(#skinGrad)" stroke="#000" strokeWidth="4" />
          <path d="M322,220 Q318,225 322,230" stroke="#C88E67" strokeWidth="2" fill="none" />

          {/* Defined Male Jawline and Face Base */}
          <path
            d="M184,175 Q250,155 316,175 L316,225 Q310,270 285,295 L250,308 L215,295 Q190,270 184,225 Z"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="6"
          />

          {/* ── Stylish Modern Short Black Hair (Textured crop fade for young male developer) ── */}
          {/* Hair Base */}
          <path
            d="M174,180 Q180,125 225,110 Q250,105 285,112 Q320,125 326,180 L318,170 Q312,135 280,126 Q245,122 215,130 Q188,142 182,175 Z"
            fill="#0F0918"
            stroke="#000"
            strokeWidth="6"
          />
          {/* Spiky Textured Front Tufts */}
          <polygon points="205,126 220,102 232,124" fill="#0F0918" stroke="#000" strokeWidth="4" />
          <polygon points="230,122 248,96 262,120" fill="#0F0918" stroke="#000" strokeWidth="4" />
          <polygon points="258,120 276,104 290,124" fill="#0F0918" stroke="#000" strokeWidth="4" />
          <polygon points="285,124 304,114 314,136" fill="#0F0918" stroke="#000" strokeWidth="4" />

          {/* Neon Purple/Cyan Subtle Hair Rim Reflection */}
          <path d="M212,118 Q250,108 290,118" stroke="#00F0FF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M232,106 Q252,100 275,108" stroke="#FF007F" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />

          {/* Sideburns (Clean male fade) */}
          <polygon points="182,175 186,215 180,215" fill="#0F0918" stroke="#000" strokeWidth="3" />
          <polygon points="318,175 314,215 320,215" fill="#0F0918" stroke="#000" strokeWidth="3" />

          {/* Expressive, Confident Male Eyebrows */}
          <path d="M200,192 Q222,184 235,193" stroke="#000" strokeWidth="6" strokeLinecap="round" />
          <path d="M265,193 Q278,184 300,192" stroke="#000" strokeWidth="6" strokeLinecap="round" />

          {/* ── Eyes & Cool Sunglasses / Gaze ── */}
          {blink ? (
            /* Blinking closed eyes */
            <>
              <line x1="205" y1="214" x2="232" y2="214" stroke="#000" strokeWidth="5" strokeLinecap="round" />
              <line x1="268" y1="214" x2="295" y2="214" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : (
            /* Expressive anime/comic male developer eyes */
            <>
              {/* Left Eye */}
              <ellipse cx="218" cy="214" rx="14" ry="10" fill="#FFF" stroke="#000" strokeWidth="4" />
              <circle
                cx={218 + (shouldReduceMotion ? 0 : mousePos.x * 0.16)}
                cy={214 + (shouldReduceMotion ? 0 : mousePos.y * 0.16)}
                r="6"
                fill="#160C24"
              />
              <circle cx="215" cy="211" r="2.5" fill="#FFF" />
              <circle cx="221" cy="216" r="1.5" fill="#00F0FF" />

              {/* Right Eye */}
              <ellipse cx="282" cy="214" rx="14" ry="10" fill="#FFF" stroke="#000" strokeWidth="4" />
              <circle
                cx={282 + (shouldReduceMotion ? 0 : mousePos.x * 0.16)}
                cy={214 + (shouldReduceMotion ? 0 : mousePos.y * 0.16)}
                r="6"
                fill="#160C24"
              />
              <circle cx="279" cy="211" r="2.5" fill="#FFF" />
              <circle cx="285" cy="216" r="1.5" fill="#00F0FF" />

              {/* Upper eyelid contour line */}
              <path d="M204,208 Q218,202 232,208" stroke="#000" strokeWidth="3" fill="none" />
              <path d="M268,208 Q282,202 296,208" stroke="#000" strokeWidth="3" fill="none" />
            </>
          )}

          {/* Masculine Nose Bridge & Tip */}
          <path d="M248,208 L244,238 L256,238" stroke="#C4845D" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Confident, Friendly Male Smile */}
          <path d="M230,262 Q250,278 270,262" stroke="#000" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          {/* Subtle lower lip line */}
          <path d="M242,274 Q250,277 258,274" stroke="#C88E67" strokeWidth="3" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* ── Left Arm (Resting on Desk / Typing on Keyboard) ── */}
        <g>
          {/* Left Sleeve */}
          <path d="M140,335 Q125,400 160,450 L195,435 Q170,390 175,340 Z" fill="#150F22" stroke="#000" strokeWidth="5" />
          {/* Sleeve Cuff */}
          <rect x="155" y="440" width="35" height="12" rx="3" fill="#201535" stroke="#000" strokeWidth="3" />
          {/* Left Typing Hand */}
          <motion.ellipse
            cx="200"
            cy={typingHand === 0 ? 462 : 466}
            rx="16"
            ry="11"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="4"
            transition={{ duration: 0.1 }}
          />
        </g>

        {/* ── Desk & Sleek Coding Laptop / Display ── */}
        {/* Desk Surface */}
        <polygon points="30,445 470,445 495,520 5,520" fill="#0B0614" stroke="#000" strokeWidth="6" />
        <line x1="30" y1="445" x2="470" y2="445" stroke="#00F0FF" strokeWidth="3.5" />

        {/* Laptop / Ultrawide Display */}
        <rect
          x="120"
          y="315"
          width="260"
          height="140"
          rx="10"
          fill="url(#screenCode)"
          stroke="#00F0FF"
          strokeWidth="5"
          filter="drop-shadow(0 0 16px rgba(0,240,255,0.45))"
        />
        {/* Screen Stand */}
        <rect x="238" y="445" width="24" height="20" fill="#191024" stroke="#000" strokeWidth="4" />

        {/* Active Syntax Code Lines on Screen */}
        <g opacity="0.9">
          <rect x="138" y="332" width="55" height="6" rx="2.5" fill="#FF007F" />
          <rect x="200" y="332" width="85" height="6" rx="2.5" fill="#00F0FF" />
          <rect x="150" y="348" width="115" height="6" rx="2.5" fill="#FFDE59" />
          <rect x="150" y="364" width="135" height="6" rx="2.5" fill="#FFF" />
          <rect x="165" y="380" width="70" height="6" rx="2.5" fill="#A855F7" />
          <rect x="165" y="396" width="125" height="6" rx="2.5" fill="#00F0FF" />
          <rect x="138" y="412" width="45" height="6" rx="2.5" fill="#22C55E" />
          {/* Blinking Cyan Cursor */}
          <rect x="189" y="412" width="7" height="8" fill="#00F0FF" className="animate-pulse" />
        </g>

        {/* Laptop Keyboard Surface */}
        <polygon points="175,458 325,458 340,490 160,490" fill="#160E24" stroke="#000" strokeWidth="4" />
        <line x1="174" y1="472" x2="326" y2="472" stroke="#FF007F" strokeWidth="2.5" opacity="0.75" />

        {/* ── Right Arm: Raised Beside Face Waving at Shoulder/Head Level ── */}
        {/* Upper Arm and Elbow bent naturally upward from the hoodie body */}
        <g>
          {/* Upper Arm from hoodie shoulder */}
          <path
            d="M345,330 Q390,340 405,295 L375,280 Q365,310 335,320 Z"
            fill="#150F22"
            stroke="#000"
            strokeWidth="5"
          />

          {/* Forearm angled upward toward head height */}
          <path
            d="M375,285 L405,295 L420,230 L390,222 Z"
            fill="#1A122A"
            stroke="#000"
            strokeWidth="5"
          />

          {/* Hoodie Sleeve Cuff */}
          <rect
            x="386"
            y="218"
            width="36"
            height="14"
            rx="3"
            transform="rotate(-12 404 225)"
            fill="#201535"
            stroke="#000"
            strokeWidth="3.5"
          />
        </g>

        {/* Waving Hand Component: Raised beside face at head/shoulder height (x: ~405, y: ~175) */}
        {/* Palm is upright, vertical, facing directly toward viewer with all 5 fingers visible and spread */}
        <motion.g
          animate={shouldReduceMotion ? {} : {
            rotate: [-12, 12, -12],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: "402px", originY: "216px" }}
        >
          {/* Vertical Upright Palm */}
          <path
            d="M388,185 C386,172 418,172 418,185 L418,212 C418,218 388,218 388,212 Z"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="4"
          />

          {/* 1. Thumb (facing naturally inward toward face) */}
          <path
            d="M389,195 C377,192 374,180 382,176 C388,174 391,185 391,192 Z"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="3.5"
          />

          {/* 2. Index Finger (vertical, naturally spread) */}
          <rect
            x="389"
            y="146"
            width="7"
            height="28"
            rx="3.5"
            transform="rotate(-4 392 160)"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="3.5"
          />

          {/* 3. Middle Finger (tallest, upright vertical) */}
          <rect
            x="397"
            y="142"
            width="7.5"
            height="32"
            rx="3.75"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="3.5"
          />

          {/* 4. Ring Finger (vertical, slightly spread) */}
          <rect
            x="406"
            y="145"
            width="7"
            height="29"
            rx="3.5"
            transform="rotate(4 409 160)"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="3.5"
          />

          {/* 5. Pinky Finger (outermost, spread naturally outward) */}
          <rect
            x="414"
            y="153"
            width="6.5"
            height="23"
            rx="3.25"
            transform="rotate(10 417 164)"
            fill="url(#skinGrad)"
            stroke="#000"
            strokeWidth="3.5"
          />

          {/* Natural Palm Knuckle & Lifeline Crease */}
          <path d="M394,188 Q404,192 413,188" stroke="#C88E67" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M396,196 Q402,203 400,210" stroke="#C88E67" strokeWidth="2" fill="none" strokeLinecap="round" />
        </motion.g>

      </svg>
    </div>
  );
};
export default DeveloperCharacter;
