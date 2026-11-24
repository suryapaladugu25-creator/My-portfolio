import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Layers, 
  Cpu, 
  Globe, 
  Database, 
  Terminal, 
  GitBranch, 
  Sparkles,
  Zap,
  Box
} from 'lucide-react';

interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Languages' | 'Tools & 3D';
  level: string;
  iconName: string;
  glowColor: string;
  comicQuote: string;
  tags: string[];
}

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const skills: Skill[] = [
    {
      name: 'Python',
      category: 'Languages',
      level: '92% POWER',
      iconName: 'python',
      glowColor: '#FFDE59',
      comicQuote: '"Clean syntax, heavyweight logic. From data pipes to AI algorithms!"',
      tags: ['FastAPI', 'NumPy', 'Automation', 'AI/ML']
    },
    {
      name: 'C / C++',
      category: 'Languages',
      level: '88% POWER',
      iconName: 'c',
      glowColor: '#00F0FF',
      comicQuote: '"Direct pointer memory manipulation at machine-level speeds!"',
      tags: ['Memory Management', 'DSA', 'Low-Level', 'Algorithms']
    },
    {
      name: 'React 19 & Next.js',
      category: 'Frontend',
      level: '95% POWER',
      iconName: 'react',
      glowColor: '#00F0FF',
      comicQuote: '"Reactive UI state loops at a crisp 120 FPS without a single stutter!"',
      tags: ['Hooks', 'Server Components', 'Virtual DOM', 'Next.js']
    },
    {
      name: 'JavaScript / TypeScript',
      category: 'Languages',
      level: '94% POWER',
      iconName: 'ts',
      glowColor: '#FF007F',
      comicQuote: '"Strict types prevent explosions before runtime in production!"',
      tags: ['ESNext', 'Generics', 'Async/Await', 'Type Safety']
    },
    {
      name: 'Three.js & WebGL',
      category: 'Tools & 3D',
      level: '85% POWER',
      iconName: 'three',
      glowColor: '#9D00FF',
      comicQuote: '"Bending 3D vertices, shaders, and camera matrices in the browser!"',
      tags: ['GLSL Shaders', '3D Math', 'Cameras', 'PBR Lighting']
    },
    {
      name: 'Tailwind CSS',
      category: 'Frontend',
      level: '96% POWER',
      iconName: 'tailwind',
      glowColor: '#00F0FF',
      comicQuote: '"Hyper-fast utility styling turned into neon Vice City art!"',
      tags: ['Responsive', 'Custom Themes', 'Design Tokens', 'Animations']
    },
    {
      name: 'Node.js & Express',
      category: 'Backend',
      level: '90% POWER',
      iconName: 'node',
      glowColor: '#22c55e',
      comicQuote: '"Non-blocking asynchronous I/O powering microservices and APIs!"',
      tags: ['REST APIs', 'WebSockets', 'Middleware', 'Auth']
    },
    {
      name: 'PostgreSQL & MongoDB',
      category: 'Backend',
      level: '87% POWER',
      iconName: 'db',
      glowColor: '#3b82f6',
      comicQuote: '"Relational integrity meets high-throughput JSON document storage!"',
      tags: ['SQL Schemas', 'Indexing', 'Aggregations', 'Prisma']
    },
    {
      name: 'Git & GitHub Ops',
      category: 'Tools & 3D',
      level: '93% POWER',
      iconName: 'git',
      glowColor: '#FF5400',
      comicQuote: '"Team VYPR open source battleground—zero merge conflict fear!"',
      tags: ['Branching', 'PR Reviews', 'CI/CD Actions', 'Rebase']
    },
    {
      name: 'Linux & Terminal',
      category: 'Tools & 3D',
      level: '89% POWER',
      iconName: 'linux',
      glowColor: '#FFDE59',
      comicQuote: '"The terminal is my dashboard. Bash scripting and process mastery!"',
      tags: ['Zsh', 'Vim', 'Systemd', 'Shell Scripts']
    },
    {
      name: 'Framer Motion',
      category: 'Frontend',
      level: '94% POWER',
      iconName: 'motion',
      glowColor: '#FF007F',
      comicQuote: '"Physics-based spring curves that make pixels feel alive!"',
      tags: ['Spring Physics', 'Gestures', 'Keyframes', 'SVG Paths']
    },
    {
      name: 'Docker & Containers',
      category: 'Backend',
      level: '82% POWER',
      iconName: 'docker',
      glowColor: '#00F0FF',
      comicQuote: '"Packaging environments so they run identically in any cloud!"',
      tags: ['Dockerfile', 'Compose', 'Isolation', 'DevOps']
    }
  ];

  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Tools & 3D'];

  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  return (
    <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#100720]/80 p-5 rounded-lg border-2 border-vice-cyan shadow-[6px_6px_0px_#FF007F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-pink text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #02
            </span>
            <span className="text-vice-yellow font-mono text-sm uppercase tracking-widest font-bold">
              // TECH ARSENAL & FIREPOWER
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-white mt-1">
            WEAPONS OF <span className="text-vice-yellow">MASS CREATION</span>
          </h2>
        </div>

        {/* Live Hover Speech Bubble Preview on Desktop */}
        <div className="hidden lg:block min-w-[340px] max-w-[400px]">
          {hoveredSkill ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-black p-3.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_#FF007F] relative speech-bubble"
            >
              <div className="font-bangers text-vice-pink text-base tracking-wider uppercase">
                {hoveredSkill.name} // {hoveredSkill.level}
              </div>
              <p className="font-sans text-xs font-bold leading-snug mt-0.5">
                {hoveredSkill.comicQuote}
              </p>
            </motion.div>
          ) : (
            <div className="bg-[#190C34] text-zinc-400 p-3.5 rounded-xl border-2 border-dashed border-zinc-700 text-center font-mono text-xs">
              ⚡ HOVER OVER ANY WEAPON TO UNLOCK SURYA'S COMBAT NOTE
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`font-bangers text-lg tracking-wider px-4 py-1.5 border-2 border-black transition-all ${
              activeTab === cat
                ? 'bg-vice-yellow text-black shadow-[4px_4px_0px_#FF007F] -translate-y-0.5'
                : 'bg-[#150A2A] text-zinc-300 hover:text-white hover:bg-vice-pink hover:text-black shadow-[3px_3px_0px_#000]'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="bg-[#120822] rounded-xl border-3 border-black p-5 relative overflow-hidden group cursor-pointer transition-shadow"
              style={{
                boxShadow: `5px 5px 0px ${skill.glowColor}`,
              }}
            >
              {/* Halftone texture inside card */}
              <div className="absolute inset-0 halftone-overlay opacity-25 pointer-events-none group-hover:opacity-45 transition-opacity" />

              {/* Power Level Badge */}
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#090314] text-zinc-300 border border-zinc-800">
                  {skill.category}
                </span>
                <span className="font-bangers text-sm tracking-wider text-vice-yellow bg-black/60 px-2 py-0.5 rounded border border-vice-yellow/50">
                  {skill.level}
                </span>
              </div>

              {/* Skill Name & Header */}
              <h3 className="font-bangers text-2xl text-white group-hover:text-vice-cyan transition-colors mb-2 tracking-wide">
                {skill.name}
              </h3>

              {/* Mobile / Small screen speech snippet */}
              <p className="block lg:hidden text-zinc-300 text-xs italic mb-3 font-sans">
                {skill.comicQuote}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skill.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1B0F33] text-zinc-300 border border-vice-purple/30 group-hover:border-vice-cyan/50 transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Neon border hover glow effect */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: skill.glowColor, boxShadow: `0 0 12px ${skill.glowColor}` }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
