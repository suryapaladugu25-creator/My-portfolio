import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DeveloperCharacter } from './DeveloperCharacter';
import { Terminal, Code, Sparkles, Flame, Mail, ExternalLink, ArrowDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface HeroSectionProps {
  onExploreMissions: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMissions,
  onContactClick
}) => {
  const [speech, setSpeech] = useState<string>('COMPILING DREAMS AT 144 FPS! ⚡');

  const speechLines = [
    'COMPILING DREAMS AT 144 FPS! ⚡',
    'CLEAN CODE. ZERO GLITCHES. 🚀',
    'CS @ NEWTON SCHOOL OF TECH 🎓',
    '10+ PRs MERGED IN TEAM VYPR! 🔥',
    'STATE CRICKET REFLEXES IN EVERY FUNCTION! 🏏'
  ];

  const cycleSpeech = () => {
    const currentIndex = speechLines.indexOf(speech);
    const nextIndex = (currentIndex + 1) % speechLines.length;
    setSpeech(speechLines[nextIndex]);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Bold Comic Headlines & Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col justify-center z-10"
        >
          {/* Top Mission Tag Badge */}
          <div className="inline-flex items-center gap-2 mb-4 self-start">
            <span className="font-bangers tracking-wider text-sm sm:text-base px-3 py-1 bg-vice-pink text-black border-2 border-black shadow-[3px_3px_0px_#00F0FF] uppercase">
              ★ ISSUE #01: THE ARCHITECT
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-vice-yellow bg-[#120822]/90 border border-vice-yellow/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              STATUS: READY TO DEPLOY
            </span>
          </div>

          {/* Main Title: GTA VI Vice City Comic Styled */}
          <h1 className="text-5xl sm:text-7xl xl:text-8xl font-bangers italic tracking-wider leading-none select-none filter drop-shadow-[0_0_24px_rgba(168,85,247,0.5)]">
            <span className="text-[#FFFFFF] drop-shadow-[0_4px_12px_rgba(168,85,247,0.6)]">
              SURYA
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#2563EB] drop-shadow-[0_0_20px_rgba(168,85,247,0.65)] comic-stroke">
              PALADUGU
            </span>
          </h1>

          {/* Subtitle Punchline */}
          <p className="mt-4 text-xl sm:text-2xl font-bangers tracking-wide text-vice-cyan uppercase">
            ENGINEERING THE FUTURE, ONE COMMIT AT A TIME.
          </p>

          {/* Descriptive Bio in comic frame */}
          <div className="mt-4 p-4 rounded-lg bg-[#0F081E]/85 border-2 border-black shadow-[5px_5px_0px_#9D00FF] backdrop-blur-sm max-w-xl">
            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-sans">
              B.Tech Computer Science student at <strong className="text-vice-yellow">Newton School of Technology</strong>.
              Open-source contributor with <strong className="text-vice-pink">Team VYPR</strong> (10+ PRs merged).
              Channeling the relentless precision of a state-level cricketer, competitive tennis player, and late-night guitar riffs into high-octane web engineering.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreMissions}
              className="font-bangers text-xl sm:text-2xl tracking-widest px-6 py-3 bg-gradient-to-r from-vice-pink via-vice-magenta to-vice-orange hover:from-vice-yellow hover:to-vice-pink text-black border-3 border-black shadow-[5px_5px_0px_#00F0FF] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 group uppercase"
            >
              <Flame className="w-6 h-6 text-yellow-300 group-hover:scale-125 transition-transform" />
              EXPLORE MISSIONS
            </button>

            <button
              onClick={onContactClick}
              className="font-bangers text-xl sm:text-2xl tracking-widest px-6 py-3 bg-[#170930] hover:bg-vice-cyan hover:text-black text-vice-cyan border-3 border-black shadow-[5px_5px_0px_#FF007F] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 uppercase"
            >
              <Terminal className="w-5 h-5" />
              RADIO HQ
            </button>
          </div>

          {/* Social Badges */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-md bg-[#120725] border-2 border-black shadow-[3px_3px_0px_#00F0FF] hover:bg-vice-pink hover:text-black text-white transition-all"
              title="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-md bg-[#120725] border-2 border-black shadow-[3px_3px_0px_#FF007F] hover:bg-vice-cyan hover:text-black text-white transition-all"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:surya@example.com"
              className="p-2.5 rounded-md bg-[#120725] border-2 border-black shadow-[3px_3px_0px_#FFDE59] hover:bg-vice-yellow hover:text-black text-white transition-all"
              title="Direct Email"
            >
              <Mail className="w-5 h-5" />
            </a>

            <div className="ml-3 hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-vice-cyan"></span>
              CLICK CHARACTER TO CYCLE SPEECH
            </div>
          </div>
        </motion.div>

        {/* Right Column: Animated Vector Developer Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center items-center z-10 cursor-pointer"
          onClick={cycleSpeech}
          title="Click to interact with Surya!"
        >
          <div className="relative group">
            {/* Ambient neon aura behind character */}
            <div className="absolute inset-0 bg-gradient-to-tr from-vice-pink/30 to-vice-cyan/30 rounded-3xl blur-2xl -z-10 group-hover:scale-110 transition-transform duration-500" />
            
            <DeveloperCharacter actionSpeech={speech} />
          </div>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <button
          onClick={onExploreMissions}
          className="text-zinc-400 hover:text-vice-yellow transition-colors flex flex-col items-center gap-1 font-bangers tracking-widest text-sm"
        >
          <span>SCROLL DOWN TO ADVANCE COMIC</span>
          <ArrowDown className="w-5 h-5 animate-bounce text-vice-pink" />
        </button>
      </div>
    </section>
  );
};
