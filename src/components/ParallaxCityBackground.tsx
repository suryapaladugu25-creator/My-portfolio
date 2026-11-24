import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxCityBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Multi-tier parallax speeds
  const ySun = useTransform(scrollY, [0, 1000], [0, 150]);
  const yDistantSkyline = useTransform(scrollY, [0, 1000], [0, 100]);
  const yMidBuildings = useTransform(scrollY, [0, 1000], [0, 50]);
  const yForegroundPalms = useTransform(scrollY, [0, 1000], [0, -40]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* ── Layer 1: Retro Neon Sunset Sky ── */}
      <div className="absolute inset-0 vice-sunset-gradient opacity-95"></div>

      {/* ── Layer 2: Giant Miami Retro Sun with Parallax ── */}
      <motion.div
        style={{ y: ySun }}
        className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 w-80 h-80 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-t from-vice-pink via-vice-orange to-vice-yellow opacity-85 shadow-[0_0_90px_rgba(255,0,127,0.8)]"
      >
        {/* Horizontal sun stripes */}
        <div className="w-full h-full flex flex-col justify-end space-y-2 pb-10 opacity-35">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full bg-[#07030D]" style={{ height: `${i * 3 + 4}px` }}></div>
          ))}
        </div>
      </motion.div>

      {/* ── Layer 3: Drifting Volumetric Clouds ── */}
      <div className="absolute inset-0 overflow-hidden opacity-45">
        <motion.div
          animate={{ x: ['-20%', '100%'] }}
          transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
          className="absolute top-28 left-0 w-96 h-28 bg-gradient-to-r from-vice-pink/30 to-vice-purple/20 blur-2xl rounded-full"
        />
        <motion.div
          animate={{ x: ['-30%', '100%'] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear', delay: 15 }}
          className="absolute top-44 left-0 w-[500px] h-32 bg-gradient-to-r from-vice-cyan/25 to-vice-pink/20 blur-3xl rounded-full"
        />
      </div>

      {/* ── Layer 4: Distant City Skyscrapers Silhouette (Parallax Mid-Speed) ── */}
      <motion.div
        style={{ y: yDistantSkyline }}
        className="absolute bottom-28 inset-x-0 h-72 md:h-96 flex items-end opacity-90"
      >
        <svg className="w-full h-full text-[#16062B] fill-current" viewBox="0 0 1400 450" preserveAspectRatio="none">
          <rect x="40" y="80" width="80" height="370" />
          <polygon points="80,20 40,80 120,80" />
          <rect x="150" y="140" width="100" height="310" />
          <rect x="280" y="50" width="120" height="400" />
          <polygon points="340,5 280,50 400,50" />
          <rect x="430" y="190" width="90" height="260" />
          <rect x="540" y="110" width="140" height="340" />
          <rect x="710" y="65" width="110" height="385" />
          <rect x="850" y="160" width="95" height="290" />
          <rect x="970" y="90" width="130" height="360" />
          <polygon points="1035,35 970,90 1100,90" />
          <rect x="1130" y="170" width="100" height="280" />
          <rect x="1260" y="130" width="90" height="320" />
        </svg>
      </motion.div>

      {/* ── Layer 5: Mid-Ground Ocean Drive Hotels with Animated Neon Signs ── */}
      <motion.div
        style={{ y: yMidBuildings }}
        className="absolute bottom-16 inset-x-0 h-48 md:h-64 flex items-end justify-between px-4"
      >
        {/* Ocean View Hotel */}
        <div className="relative w-44 md:w-64 h-48 bg-[#0E041B] border-t-4 border-vice-cyan/70 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex flex-col items-center pt-2">
          {/* Animated Neon Hotel Sign */}
          <div className="px-3 py-1 bg-black/80 border-2 border-vice-pink rounded shadow-neon-pink animate-neonFlicker">
            <span className="font-bangers text-vice-pink text-xs md:text-sm tracking-wider">★ OCEAN VIEW ★</span>
          </div>
          {/* Hotel Lit Windows Grid */}
          <div className="grid grid-cols-4 gap-2 mt-4 px-3 w-full opacity-65">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded-sm ${i % 3 === 0 ? 'bg-vice-cyan' : i % 2 === 0 ? 'bg-vice-yellow' : 'bg-vice-pink/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Vice Palms Resort */}
        <div className="relative hidden md:flex w-72 h-56 bg-[#090214] border-t-4 border-vice-pink/70 shadow-[0_0_25px_rgba(255,0,127,0.4)] flex-col items-center pt-2">
          <div className="px-3 py-1 bg-black/80 border-2 border-vice-cyan rounded shadow-neon-cyan animate-pulse">
            <span className="font-bangers text-vice-cyan text-sm tracking-wider">VICE PALMS</span>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4 px-3 w-full opacity-70">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded-sm ${i % 4 === 0 ? 'bg-vice-yellow' : i % 2 === 0 ? 'bg-vice-pink' : 'bg-black'}`}
              />
            ))}
          </div>
        </div>

        {/* Flamingo Club */}
        <div className="relative w-40 md:w-60 h-44 bg-[#0A0216] border-t-4 border-vice-yellow/70 shadow-[0_0_25px_rgba(255,222,89,0.4)] flex flex-col items-center pt-2">
          <div className="px-3 py-1 bg-black/80 border-2 border-vice-yellow rounded shadow-neon-yellow">
            <span className="font-bangers text-vice-yellow text-xs md:text-sm tracking-wider">FLAMINGO CLUB</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3 px-3 w-full opacity-60">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-vice-cyan rounded-sm" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Layer 6: Ocean Drive Highway with Headlight Traffic Streams ── */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#06020D] border-t-4 border-vice-pink/70 overflow-hidden flex items-center">
        {/* Animated Moving Traffic Streams */}
        <motion.div
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-3 w-28 h-2 bg-gradient-to-r from-transparent via-vice-cyan to-white rounded-full shadow-[0_0_15px_#00F0FF]"
        />
        <motion.div
          animate={{ x: ['120%', '-20%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="absolute bottom-3 w-32 h-2 bg-gradient-to-r from-vice-pink via-red-500 to-transparent rounded-full shadow-[0_0_15px_#FF007F]"
        />
        <div className="w-full border-t-2 border-dashed border-vice-yellow/30"></div>
      </div>

      {/* ── Layer 7: Foreground Swaying Giant Palm Trees (Fastest Parallax) ── */}
      <motion.div
        style={{ y: yForegroundPalms }}
        animate={{ rotate: [-2.5, 3.5, -2.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-12 md:left-6 bottom-4 origin-bottom w-48 md:w-72 text-[#040108] z-10"
      >
        <svg viewBox="0 0 200 350" fill="currentColor">
          <path d="M95,350 Q98,200 120,90 Q90,50 10,70 Q70,90 100,105 Q60,30 110,10 Q115,50 120,90 Q160,20 185,50 Q145,85 125,95 Q190,90 195,130 Q150,135 125,100 Z" />
        </svg>
      </motion.div>

      <motion.div
        style={{ y: yForegroundPalms }}
        animate={{ rotate: [2.5, -3, 2.5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-12 md:right-8 bottom-0 origin-bottom w-52 md:w-80 text-[#040108] z-10"
      >
        <svg viewBox="0 0 200 350" fill="currentColor">
          <path d="M105,350 Q98,180 85,85 Q50,40 5,60 Q60,80 80,95 Q40,20 85,5 Q95,45 90,85 Q130,15 170,45 Q125,75 100,90 Q170,80 180,120 Q130,125 100,95 Z" />
        </svg>
      </motion.div>

      {/* Halftone & Scanlines Layer */}
      <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 comic-scanlines opacity-20 pointer-events-none"></div>
    </div>
  );
};

