import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Volume2, VolumeX, Flame, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  soundEnabled,
  toggleSound
}) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'HQ' },
    { id: 'about', label: 'ORIGIN' },
    { id: 'skills', label: 'ARSENAL' },
    { id: 'projects', label: 'MISSIONS' },
    { id: 'hacktoberfest', label: 'VYPR OPS' },
    { id: 'beyond', label: 'OFF-DUTY' },
    { id: 'contact', label: 'RADIO SURYA' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-[#F5F3FF]/90 dark:bg-[#0A0612]/90 backdrop-blur-md border-b-2 border-vice-pink shadow-[0_4px_25px_rgba(157,0,255,0.15)] dark:shadow-[0_4px_25px_rgba(255,0,127,0.3)]'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo / Badge */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-vice-pink text-black font-bangers text-2xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_#00F0FF] group-hover:scale-105 group-hover:shadow-[3px_3px_0px_#FFDE59] transition-transform">
                SP
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-vice-cyan rounded-full animate-ping"></span>
            </div>
            <div>
              <span className="font-bangers tracking-wider text-xl md:text-2xl text-[#15152F] dark:text-white group-hover:text-vice-pink transition-colors">
                SURYA<span className="text-vice-cyan">.DEV</span>
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-vice-purple dark:text-vice-yellow uppercase -mt-1 font-bold">
                {isDark ? 'VICE CITY // NIGHT' : 'VICE CITY // DAYLIGHT'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/80 dark:bg-[#120822]/80 px-4 py-1.5 rounded-full border border-purple-200 dark:border-vice-purple/40 shadow-sm dark:shadow-inner">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3.5 py-1.5 font-bangers text-lg tracking-wider transition-colors duration-200 ${
                    isActive 
                      ? 'text-vice-pink dark:text-vice-yellow' 
                      : 'text-[#15152F]/80 hover:text-vice-pink dark:text-zinc-300 dark:hover:text-vice-cyan'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-vice-pink/15 to-vice-cyan/20 dark:from-vice-pink/30 dark:to-vice-cyan/30 rounded-full border border-vice-pink shadow-[0_0_12px_rgba(255,0,127,0.4)] dark:shadow-[0_0_12px_rgba(255,0,127,0.6)] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Synthwave Vibes' : 'Enable Synthwave Vibes'}
              className="p-2 rounded-lg bg-white dark:bg-[#150B28] border-2 border-zinc-300 dark:border-zinc-700 hover:border-vice-cyan text-zinc-700 dark:text-zinc-300 hover:text-vice-cyan transition-colors"
              aria-label="Toggle background audio"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-vice-pink dark:text-vice-cyan animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="relative p-2 rounded-lg bg-white dark:bg-[#150B28] border-2 border-zinc-300 dark:border-zinc-700 hover:border-vice-pink text-zinc-700 dark:text-zinc-300 hover:text-vice-pink transition-all shadow-[2px_2px_0px_#A855F7] dark:shadow-[2px_2px_0px_#00F0FF] group"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-vice-yellow group-hover:drop-shadow-[0_0_8px_#FFDE59]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-500 group-hover:drop-shadow-[0_0_8px_#F59E0B]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Resume / HIRE ME CTA */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 font-bangers text-lg tracking-wider px-4 py-1.5 bg-gradient-to-r from-vice-pink to-vice-purple hover:from-vice-yellow hover:to-vice-orange hover:text-black text-white border-2 border-black shadow-[4px_4px_0px_#00F0FF] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              <Flame className="w-4 h-4" />
              HIRE ME
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-vice-pink text-black border-2 border-black shadow-[3px_3px_0px_#00F0FF]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-[#F5F3FF]/98 dark:bg-[#0E061B]/95 backdrop-blur-xl border-b-4 border-vice-pink shadow-2xl lg:hidden p-6"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`text-left font-bangers text-2xl tracking-widest py-2 px-3 rounded-md transition-all border-l-4 ${
                    activeSection === item.id
                      ? 'border-vice-pink text-vice-pink dark:border-vice-yellow dark:text-vice-yellow bg-vice-pink/10 dark:bg-vice-pink/20 pl-4'
                      : 'border-transparent text-[#15152F] dark:text-white hover:border-vice-cyan hover:text-vice-cyan hover:pl-4'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-purple-200 dark:border-zinc-800 flex flex-col gap-3">
                {/* Theme Switcher in Mobile Drawer */}
                <button
                  onClick={toggleTheme}
                  className="w-full text-left font-bangers text-xl py-2 px-3 rounded flex items-center justify-between bg-white dark:bg-[#1A0C30] border-2 border-black text-[#15152F] dark:text-white shadow-[3px_3px_0px_#A855F7]"
                >
                  <span>{isDark ? '🌙 DARK MODE (ACTIVE)' : '☀️ LIGHT MODE (ACTIVE)'}</span>
                  <span className="text-xs font-mono text-vice-pink font-bold uppercase">TAP TO TOGGLE</span>
                </button>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('contact');
                  }}
                  className="w-full text-center font-bangers text-xl py-3 bg-vice-cyan text-black border-2 border-black shadow-[4px_4px_0px_#FF007F]"
                >
                  ⚡ DISPATCH SURYA (CONTACT)
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
