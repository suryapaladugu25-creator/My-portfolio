import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    // 0s: Dark screen & neon lights flickering on
    const t1 = setTimeout(() => setStep(1), 700);
    // 1.5s: Miami city reveal & retro car racing across screen
    const t2 = setTimeout(() => setStep(2), 1700);
    // 3.0s: Comic explosion + Title reveal ("SURYA PALADUGU", "WELCOME TO MY WORLD")
    const t3 = setTimeout(() => setStep(3), 3200);
    // 4.6s: Complete intro and hand over to live homepage
    const t4 = setTimeout(() => {
      onComplete();
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsSkipped(true);
    onComplete();
  };

  if (isSkipped) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-[#07030D] overflow-hidden flex items-center justify-center select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Skip Button */}
      <motion.button
        onClick={handleSkip}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-50 px-4 py-2 bg-black/70 border-2 border-vice-pink text-vice-pink hover:bg-vice-pink hover:text-black font-bangers text-lg tracking-wider rounded-md shadow-comic-pink transition-all duration-200 cursor-pointer flex items-center gap-2 group"
      >
        <span>SKIP INTRO</span>
        <span className="group-hover:translate-x-1 transition-transform">⏩</span>
      </motion.button>

      {/* Halftone & Scanline Overlays */}
      <div className="absolute inset-0 halftone-overlay pointer-events-none opacity-40 z-20"></div>
      <div className="absolute inset-0 comic-scanlines pointer-events-none opacity-30 z-20"></div>

      {/* Step 1 & 2: Miami City Backdrop with flickering Neon */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col justify-end pointer-events-none z-10"
          >
            {/* Sunset Sky Gradient */}
            <div className="absolute inset-0 vice-sunset-gradient opacity-90"></div>

            {/* Retro Sun */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-t from-vice-pink via-vice-orange to-vice-yellow opacity-85 shadow-[0_0_80px_#FF007F]">
              {/* Sun horizontal blinds/lines */}
              <div className="w-full h-full flex flex-col justify-end space-y-2 pb-6 opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full bg-[#07030D]" style={{ height: `${i * 2 + 3}px` }}></div>
                ))}
              </div>
            </div>

            {/* Animated Skyline Silhouettes */}
            <div className="relative w-full h-64 md:h-80 flex items-end justify-center">
              {/* Distant high-rises */}
              <svg className="w-full h-full text-[#140624] fill-current" viewBox="0 0 1200 400" preserveAspectRatio="none">
                <rect x="50" y="80" width="70" height="320" />
                <polygon points="85,30 50,80 120,80" />
                <rect x="140" y="140" width="90" height="260" />
                <rect x="250" y="60" width="110" height="340" />
                <polygon points="305,10 250,60 360,60" />
                <rect x="380" y="180" width="80" height="220" />
                <rect x="480" y="110" width="130" height="290" />
                <rect x="630" y="70" width="95" height="330" />
                <rect x="740" y="150" width="85" height="250" />
                <rect x="850" y="90" width="115" height="310" />
                <polygon points="907,40 850,90 965,90" />
                <rect x="980" y="160" width="90" height="240" />
                <rect x="1090" y="120" width="80" height="280" />
              </svg>

              {/* Swaying Palm Trees */}
              <motion.div
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-6 md:left-24 bottom-10 origin-bottom w-32 md:w-48 text-[#0A0214]"
              >
                <svg viewBox="0 0 200 350" fill="currentColor">
                  <path d="M95,350 Q98,200 120,90 Q90,50 10,70 Q70,90 100,105 Q60,30 110,10 Q115,50 120,90 Q160,20 185,50 Q145,85 125,95 Q190,90 195,130 Q150,135 125,100 Z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: [2, -2.5, 2] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-8 md:right-32 bottom-8 origin-bottom w-36 md:w-52 text-[#0A0214]"
              >
                <svg viewBox="0 0 200 350" fill="currentColor">
                  <path d="M105,350 Q98,180 85,85 Q50,40 5,60 Q60,80 80,95 Q40,20 85,5 Q95,45 90,85 Q130,15 170,45 Q125,75 100,90 Q170,80 180,120 Q130,125 100,95 Z" />
                </svg>
              </motion.div>
            </div>

            {/* Highway / Road */}
            <div className="w-full h-16 bg-[#05010A] border-t-4 border-vice-pink/60 relative overflow-hidden flex items-center">
              <div className="w-full h-1 border-t-2 border-dashed border-vice-yellow/50"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro Sports Car driving across screen (Step 2) */}
      <AnimatePresence>
        {step >= 2 && step < 3 && (
          <motion.div
            initial={{ x: '-120vw', y: '32vh' }}
            animate={{ x: '120vw', y: '32vh' }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute z-30 pointer-events-none"
          >
            <div className="relative w-72 md:w-96 filter drop-shadow-[0_0_20px_#00F0FF]">
              {/* Illustrated Retro Synth Car SVG */}
              <svg viewBox="0 0 450 160" fill="none" className="w-full">
                {/* Body */}
                <path d="M40,110 L100,105 L150,65 L270,60 L350,90 L420,100 L430,125 L380,130 L350,130 L320,110 L260,110 L230,130 L130,130 L100,110 L50,110 Z" fill="#FF007F" stroke="#000" strokeWidth="4" />
                {/* Cockpit / Windows */}
                <polygon points="160,70 265,65 330,90 195,95" fill="#00F0FF" stroke="#000" strokeWidth="3" opacity="0.9" />
                {/* Headlights & Tail Lights */}
                <rect x="415" y="105" width="15" height="12" fill="#00F0FF" className="animate-pulse" />
                <rect x="40" y="112" width="12" height="10" fill="#FF5400" />
                {/* Wheels */}
                <circle cx="95" cy="125" r="24" fill="#111" stroke="#FFDE59" strokeWidth="5" />
                <circle cx="335" cy="125" r="24" fill="#111" stroke="#FFDE59" strokeWidth="5" />
                {/* Neon underglow */}
                <ellipse cx="225" cy="140" rx="160" ry="10" fill="#00F0FF" opacity="0.6" />
              </svg>

              {/* Speed Lines */}
              <div className="absolute -left-24 top-1/2 flex flex-col space-y-2">
                <div className="w-32 h-1 bg-vice-cyan rounded-full animate-pulse"></div>
                <div className="w-20 h-1 bg-vice-pink rounded-full"></div>
                <div className="w-28 h-1 bg-vice-yellow rounded-full"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comic Book Explosion Transition & Big Title Reveal (Step 3) */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ scale: 0, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative z-40 text-center flex flex-col items-center justify-center p-4 max-w-4xl"
          >
            {/* Comic Bang/Burst Background Star */}
            <div className="absolute inset-0 -m-12 md:-m-24 z-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 500 500" className="w-[120%] h-[120%] text-vice-yellow/90 filter drop-shadow-[0_0_35px_#FF007F]">
                <polygon points="250,15 285,140 405,65 350,190 485,195 385,280 470,370 340,360 355,485 250,400 145,485 160,360 30,370 115,280 15,195 150,190 95,65 215,140" fill="currentColor" stroke="#000" strokeWidth="8" />
              </svg>
            </div>

            {/* Comic Title Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative z-10 bg-black px-6 py-2 border-4 border-black rounded-lg shadow-comic-pink -rotate-2 mb-3"
            >
              <span className="font-bangers tracking-widest text-vice-cyan text-xl md:text-2xl">
                ★ VICE CITY EDITION: CHAPTER 1 ★
              </span>
            </motion.div>

            {/* Main Name Reveal */}
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.25 }}
              className="relative z-10 font-bangers italic text-6xl md:text-8xl lg:text-9xl tracking-wider comic-stroke uppercase filter drop-shadow-[0_0_28px_rgba(168,85,247,0.55)]"
            >
              <span className="text-[#FFFFFF] drop-shadow-[0_4px_16px_rgba(168,85,247,0.6)]">SURYA </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#2563EB] drop-shadow-[0_0_22px_rgba(168,85,247,0.7)]">
                PALADUGU
              </span>
            </motion.h1>

            {/* Subtitle speech banner */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45, type: "spring" }}
              className="relative z-10 mt-4 bg-vice-cyan text-black font-bangers text-2xl md:text-4xl px-8 py-2 border-4 border-black shadow-comic-dark rotate-1"
            >
              WELCOME TO MY WORLD
            </motion.div>

            {/* Action Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="relative z-10 mt-6 flex flex-wrap gap-3 justify-center text-xs md:text-sm font-mono font-bold"
            >
              <span className="bg-vice-pink text-white px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000]">
                ⚡ FULL-STACK ARCHITECT
              </span>
              <span className="bg-vice-yellow text-black px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000]">
                🏏 ATHLETE
              </span>
              <span className="bg-vice-purple text-white px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000]">
                🎸 GUITARIST & RIDER
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

