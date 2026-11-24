import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroSequence } from './components/IntroSequence';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { ParallaxCityBackground } from './components/ParallaxCityBackground';
import { HeroSection } from './components/HeroSection';
import { AboutComicSection } from './components/AboutComicSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { HacktoberfestSection } from './components/HacktoberfestSection';
import { BeyondSection } from './components/BeyondSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'hacktoberfest', 'beyond', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [showIntro]);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Ambient Synthwave Web Audio sound generator (pure client-side, zero 404 assets)
  const toggleSound = () => {
    if (soundEnabled) {
      // Turn off
      synthNodesRef.current.forEach((n) => {
        try {
          n.stop?.();
          n.disconnect?.();
        } catch (e) {}
      });
      synthNodesRef.current = [];
      setSoundEnabled(false);
    } else {
      // Turn on
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Create warm synth pad chord: D minor / F Major synthwave vibe (D3, A3, F4, C5)
        const freqs = [146.83, 220.0, 349.23, 523.25];
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
        masterGain.connect(ctx.destination);

        const nodes: any[] = [masterGain];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Low-pass warmth
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(500 + idx * 100, ctx.currentTime);

          gain.gain.setValueAtTime(0.25, ctx.currentTime);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start();
          nodes.push(osc, filter, gain);
        });

        synthNodesRef.current = nodes;
        setSoundEnabled(true);
      } catch (err) {
        console.warn('Audio context initialization blocked or unsupported:', err);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07030E] text-white selection:bg-vice-pink selection:text-white font-sans antialiased overflow-x-hidden">
      {/* GTA VI Animated Intro Sequence */}
      <AnimatePresence>
        {showIntro && (
          <IntroSequence onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Interactive Comic Crosshair Cursor */}
      <CustomCursor />

      {/* Living 7-Layer Parallax Vice City Sunset & Skyline Background */}
      <ParallaxCityBackground />

      {/* Floating Neon Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Comic Page Scanlines & Halftone Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none comic-scanlines z-[1] opacity-60" />

      {/* Main Comic Sections Container */}
      <main className="relative z-10 flex flex-col gap-12 sm:gap-16 pt-4">
        {/* HQ / Hero */}
        <HeroSection
          onExploreMissions={() => scrollToSection('projects')}
          onContactClick={() => scrollToSection('contact')}
        />

        {/* Issue #01: Origin Story (About) */}
        <AboutComicSection />

        {/* Issue #02: Arsenal (Skills) */}
        <SkillsSection />

        {/* Issue #03: Missions Archive (Projects) */}
        <ProjectsSection />

        {/* Issue #04: Team VYPR Open Source Special Ops (Hacktoberfest) */}
        <HacktoberfestSection />

        {/* Issue #05: Beyond the Terminal (Sports & Passions) */}
        <BeyondSection />

        {/* Issue #06: Dispatch HQ (Contact & Terminal) */}
        <ContactSection />
      </main>

      {/* Comic Footer */}
      <Footer onBackToTop={() => scrollToSection('hero')} />
    </div>
  );
};
export default App;
