import React from 'react';
import { ArrowUp, Heart, Sparkles, Flame } from 'lucide-react';

interface FooterProps {
  onBackToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop }) => {
  return (
    <footer className="relative bg-[#07030E] border-t-4 border-black py-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Branding */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bangers text-2xl text-white tracking-wider">
              SURYA<span className="text-vice-pink">.PALADUGU</span>
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-vice-cyan text-black font-bold border border-black">
              GTA VI EDITION
            </span>
          </div>
          <p className="font-mono text-xs text-zinc-400 mt-1">
            Engineered with React 19, TypeScript, Tailwind CSS & Framer Motion.
          </p>
          <p className="font-mono text-[11px] text-zinc-500 mt-0.5">
            Inspired by Vice City neon aesthetics, Team VYPR open source spirit, and athletic reflexes.
          </p>
        </div>

        {/* Center Comic Badge */}
        <div className="inline-flex items-center gap-2 bg-[#120722] px-4 py-2 rounded-full border-2 border-vice-pink text-xs font-mono text-vice-yellow">
          <Flame className="w-4 h-4 text-vice-pink animate-pulse" />
          <span>STAY HUNGRY. COMMIT OFTEN.</span>
        </div>

        {/* Right: Back to Top Button */}
        <div>
          <button
            onClick={onBackToTop}
            className="font-bangers text-lg tracking-wider px-5 py-2 bg-vice-yellow hover:bg-vice-pink text-black border-2 border-black shadow-[4px_4px_0px_#00F0FF] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 uppercase"
          >
            <ArrowUp className="w-4 h-4" />
            BACK TO HQ TOP
          </button>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800 text-center font-mono text-xs text-zinc-400">
        © {new Date().getFullYear()} Surya Paladugu. All Rights Reserved. Built for high performance.
      </div>
    </footer>
  );
};
