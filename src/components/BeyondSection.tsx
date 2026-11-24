import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Music, Bike, Compass, Flame, Shield, Sparkles } from 'lucide-react';

export const BeyondSection: React.FC = () => {
  const sports = [
    {
      title: 'STATE-LEVEL CRICKET',
      level: 'STATE COMPETITOR',
      role: 'Fast Bowler & Agile Fielder',
      description: 'Years of fast bowling under high pressure drilled relentless physical stamina, razor-sharp focus on the batsman’s crease, and split-second game intuition.',
      color: '#FF007F',
      icon: '🏏'
    },
    {
      title: 'DISTRICT BADMINTON',
      level: 'DISTRICT LEVEL',
      role: 'Singles / Doubles Specialist',
      description: 'Intense cross-court rallies requiring rapid directional changes in fractions of a second. Teaches hyper-quick cognitive reaction speeds.',
      color: '#00F0FF',
      icon: '🏸'
    },
    {
      title: 'COMPETITIVE TENNIS',
      level: 'TOURNAMENT PLAY',
      role: 'Baseline Tactician',
      description: 'Endurance rallies and precision topspin control. Translates directly into software engineering patience when isolating complex race conditions.',
      color: '#FFDE59',
      icon: '🎾'
    },
    {
      title: 'SKATING HOCKEY',
      level: 'CLUB LEAGUE',
      role: 'Wing Forward',
      description: 'High-speed balance on quad roller skates while maneuvering the puck in tight defense corridors. Raw kinetic balance and team synergy.',
      color: '#9D00FF',
      icon: '🛼'
    }
  ];

  return (
    <section id="beyond" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 bg-white/95 dark:bg-[#120822]/85 p-5 rounded-lg border-2 border-vice-pink shadow-[6px_6px_0px_#00F0FF] transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-yellow text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #05
            </span>
            <span className="text-vice-pink font-mono text-sm uppercase tracking-widest font-bold">
              // OFF-DUTY & KINETIC ENERGY
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-[#15152F] dark:text-white mt-1 transition-colors duration-300">
            BEYOND THE <span className="text-sky-600 dark:text-vice-cyan">TERMINAL</span>
          </h2>
        </div>

        <div className="text-left sm:text-right font-mono text-xs text-purple-950 dark:text-zinc-300">
          <span className="text-amber-600 dark:text-vice-yellow font-bold">PHILOSOPHY:</span> THE SOUND MIND & SOUND BODY
        </div>
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {sports.map((sport, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white dark:bg-[#140A28] rounded-xl border-3 border-black p-5 flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            style={{
              boxShadow: `6px 6px 0px ${sport.color}`
            }}
          >
            <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{sport.icon}</span>
                <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-black/60 text-purple-900 dark:text-zinc-200 border border-purple-200 dark:border-zinc-700 transition-colors duration-300">
                  {sport.level}
                </span>
              </div>

              <h3 className="font-bangers text-2xl text-[#15152F] dark:text-white group-hover:text-purple-600 dark:group-hover:text-vice-yellow transition-colors mb-1 tracking-wide">
                {sport.title}
              </h3>

              <div className="font-mono text-xs text-purple-700 dark:text-vice-pink mb-3 font-semibold">
                {sport.role}
              </div>

              <p className="text-[#2D2D44] dark:text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-300">
                {sport.description}
              </p>
            </div>

            <div 
              className="mt-4 pt-3 border-t border-purple-200 dark:border-zinc-800 text-[11px] font-mono font-bold transition-colors duration-300"
              style={{ color: sport.color }}
            >
              HIGH PERFORMANCE DISCIPLINE
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Wide Creative Panels: Guitar & Motorcycle Adventures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Guitar Creative Panel */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-purple-100 via-pink-50 to-white dark:from-[#1E0B38] dark:to-[#120626] rounded-xl border-3 border-black p-6 shadow-[6px_6px_0px_#FF007F] relative overflow-hidden transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-pink text-black border-2 border-black rounded-lg">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bangers text-3xl text-[#15152F] dark:text-white tracking-wide transition-colors duration-300">
                6-STRING GUITAR SESSIONS
              </h3>
              <p className="font-mono text-xs text-sky-600 dark:text-vice-cyan">Acoustic & Electric Harmonies</p>
            </div>
          </div>

          <p className="text-[#2D2D44] dark:text-zinc-200 text-sm leading-relaxed mb-4 transition-colors duration-300">
            Playing guitar is software architecture in acoustic form: intervals, chord voicings, and timing sync. Late-night practice refines auditory pattern recognition and creative problem solving.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-mono text-purple-950 dark:text-vice-yellow">
            <span className="bg-white dark:bg-[#27104B] px-3 py-1 rounded-full border border-purple-300 dark:border-vice-purple transition-colors duration-300">
              🎸 Fingerpicking & Blues Scales
            </span>
            <span className="bg-white dark:bg-[#27104B] px-3 py-1 rounded-full border border-purple-300 dark:border-vice-purple transition-colors duration-300">
              🎵 Rhythm Timing & Flow State
            </span>
          </div>
        </motion.div>

        {/* Motorcycle Cruiser Panel */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-cyan-50 via-sky-50 to-white dark:from-[#170E30] dark:to-[#0D051C] rounded-xl border-3 border-black p-6 shadow-[6px_6px_0px_#00F0FF] relative overflow-hidden transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-cyan text-black border-2 border-black rounded-lg">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bangers text-3xl text-[#15152F] dark:text-white tracking-wide transition-colors duration-300">
                DAWN MOTORCYCLE EXPEDITIONS
              </h3>
              <p className="font-mono text-xs text-amber-600 dark:text-vice-yellow">Clear Highway Horizons</p>
            </div>
          </div>

          <p className="text-[#2D2D44] dark:text-zinc-200 text-sm leading-relaxed mb-4 transition-colors duration-300">
            Hitting the open expressway at 5:00 AM before the city wakes. The road requires total situational awareness, sharp reflexes, and teaches respect for dynamic changing environments.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-mono text-sky-800 dark:text-vice-cyan">
            <span className="bg-white dark:bg-[#1D143D] px-3 py-1 rounded-full border border-purple-300 dark:border-vice-purple transition-colors duration-300">
              🏍️ High-Speed Spatial Awareness
            </span>
            <span className="bg-white dark:bg-[#1D143D] px-3 py-1 rounded-full border border-purple-300 dark:border-vice-purple transition-colors duration-300">
              🌅 Sunset & Dawn Highway Rides
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

