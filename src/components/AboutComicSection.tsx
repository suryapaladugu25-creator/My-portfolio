import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Trophy, Code2, Music, Bike, Zap } from 'lucide-react';

export const AboutComicSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b-4 border-black pb-4 bg-[#120722]/80 p-5 rounded-lg border-2 border-vice-pink shadow-[6px_6px_0px_#00F0FF]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-yellow text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #01
            </span>
            <span className="text-vice-pink font-mono text-sm uppercase tracking-widest font-bold">
              // CLASSIFIED DOSSIER
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-white mt-1">
            ORIGIN STORY: <span className="text-vice-cyan">THE DUAL-LIFER</span>
          </h2>
        </div>
        <div className="hidden sm:block text-right">
          <span className="font-bangers text-2xl text-vice-yellow block">LOCATION: VICE CITY</span>
          <span className="font-mono text-xs text-zinc-400">COORDINATES: 25.7617° N, 80.1918° W</span>
        </div>
      </div>

      {/* Comic Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Panel 1: The Academic Crucible (Large Panel) */}
        <motion.div
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-7 bg-[#140A26] rounded-xl border-3 border-black shadow-[6px_6px_0px_#FF007F] p-6 relative overflow-hidden group"
        >
          {/* Halftone BG Accent */}
          <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />
          
          {/* Action Sound Badge */}
          <div className="absolute -top-1 -right-1 bg-vice-yellow text-black font-bangers text-xl px-4 py-1 border-2 border-black rotate-3 shadow-[3px_3px_0px_#000]">
            KAPOW!
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-pink text-black border-2 border-black rounded-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bangers text-2xl text-white tracking-wide">
                NEWTON SCHOOL OF TECHNOLOGY
              </h3>
              <p className="font-mono text-xs text-vice-cyan">B.Tech in Computer Science & Artificial Intelligence</p>
            </div>
          </div>

          <p className="text-zinc-200 text-base leading-relaxed mb-4">
            Deep in the digital trenches of computer science, mastering high-concurrency systems, low-level architecture, and forward-looking AI workflows. Not satisfied with textbook theory—every algorithm is tested against real-world performance benchmarks.
          </p>

          <div className="p-4 bg-[#090412] rounded-lg border-2 border-dashed border-vice-pink/60 flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
            <span className="text-vice-yellow font-bold">CORE FOCUS:</span>
            <span>Distributed Systems</span> •
            <span>Full-Stack Web Architectures</span> •
            <span>Interactive 3D Visual Computing</span> •
            <span>Data Structures & Optimization</span>
          </div>
        </motion.div>

        {/* Panel 2: Athletic Reflexes (Medium Panel) */}
        <motion.div
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-5 bg-[#170E2E] rounded-xl border-3 border-black shadow-[6px_6px_0px_#00F0FF] p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 halftone-dense opacity-20 pointer-events-none" />
          
          <div className="absolute -top-1 -right-1 bg-vice-cyan text-black font-bangers text-xl px-4 py-1 border-2 border-black -rotate-2 shadow-[3px_3px_0px_#000]">
            ZAP!
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-cyan text-black border-2 border-black rounded-lg">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bangers text-2xl text-white tracking-wide">
                ATHLETIC REFLEXES
              </h3>
              <p className="font-mono text-xs text-vice-yellow">State & District Sports Veteran</p>
            </div>
          </div>

          <p className="text-zinc-200 text-sm leading-relaxed mb-4">
            Long before writing asynchronous JavaScript, Surya was tracking 130 km/h cricket deliveries and timing high-velocity smash shots on the badminton and tennis courts.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center p-2 bg-[#0C0517] rounded border border-zinc-800">
              <span className="text-zinc-300">🏏 State-Level Cricket</span>
              <span className="text-vice-pink font-bold">Fast Bowler Reflexes</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#0C0517] rounded border border-zinc-800">
              <span className="text-zinc-300">🏸 District Badminton</span>
              <span className="text-vice-cyan font-bold">Agile Footwork</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#0C0517] rounded border border-zinc-800">
              <span className="text-zinc-300">🎾 Competitive Tennis & Hockey</span>
              <span className="text-vice-yellow font-bold">Split-Second Decisions</span>
            </div>
          </div>
        </motion.div>

        {/* Panel 3: Open Source Guerrilla (Medium Panel) */}
        <motion.div
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-6 bg-[#160D2C] rounded-xl border-3 border-black shadow-[6px_6px_0px_#FFDE59] p-6 relative overflow-hidden group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-yellow text-black border-2 border-black rounded-lg">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bangers text-2xl text-white tracking-wide">
                TEAM VYPR & OPEN SOURCE
              </h3>
              <p className="font-mono text-xs text-vice-pink">10+ Pull Requests Merged</p>
            </div>
          </div>

          <p className="text-zinc-200 text-sm leading-relaxed">
            Collaborating with developers across time zones in <strong className="text-vice-pink">Team VYPR</strong>.
            From debugging complex frontend edge cases to refactoring backend endpoints during Hacktoberfest, shipping code that thousands rely on is what drives the thrill.
          </p>

          <div className="mt-4 p-3 bg-[#0A0414] rounded border-l-4 border-vice-yellow text-xs font-mono text-zinc-300">
            "Code is poetry executed at the speed of electricity."
          </div>
        </motion.div>

        {/* Panel 4: The Harmonic Balance (Guitar & Motorcycle) */}
        <motion.div
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-6 bg-[#130722] rounded-xl border-3 border-black shadow-[6px_6px_0px_#9D00FF] p-6 relative overflow-hidden group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-vice-purple text-white border-2 border-black rounded-lg">
              <Music className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bangers text-2xl text-white tracking-wide">
                GUITAR RIFFS & HIGHWAY RUNS
              </h3>
              <p className="font-mono text-xs text-vice-cyan">Analog Passions in a Digital Era</p>
            </div>
          </div>

          <p className="text-zinc-200 text-sm leading-relaxed">
            When the terminal closes, the creative spark moves into acoustic frequencies and open throttles. Strumming rhythm progressions teaches harmonic structure; early-morning highway rides reset the cognitive buffer.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-vice-yellow">
            <span className="flex items-center gap-1.5 bg-[#1F0E3D] px-3 py-1.5 rounded-full border border-vice-purple">
              <Music className="w-3.5 h-3.5 text-vice-pink" /> 6-String Guitar Fingerpicking
            </span>
            <span className="flex items-center gap-1.5 bg-[#1F0E3D] px-3 py-1.5 rounded-full border border-vice-purple">
              <Bike className="w-3.5 h-3.5 text-vice-cyan" /> 5:00 AM Dawn Motorcycle Cruises
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
