import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Layers, Box, Terminal, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface Project {
  id: string;
  title: string;
  tagline: string;
  issueNumber: string;
  description: string;
  tech: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string;
  comicBadge: string;
  accentColor: string;
  bannerGradient: string;
}

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'llm-playground',
      title: 'LLM PLAYGROUND 3D',
      tagline: 'Interactive 3D Prompt Engineering & Vector Visualizer',
      issueNumber: 'MISSION #01',
      description: 'A cutting-edge WebGL prompt evaluation environment where LLM embeddings, latent tokens, and attention weights are rendered as a dynamic 3D celestial particle galaxy. Features real-time parameter tweaking and multi-model benchmarking.',
      tech: ['React', 'Three.js', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'GLSL'],
      features: [
        '3D Vector space embedding clusters',
        'Real-time token attention heatmap graphs',
        'Model benchmark comparisons (Latency vs. Perplexity)'
      ],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      comicBadge: 'FLAGSHIP',
      accentColor: '#00F0FF',
      bannerGradient: 'from-cyan-900/80 via-blue-900/60 to-purple-950/90'
    },
    {
      id: 'devhub',
      title: 'DEVHUB COLLABORATIVE',
      tagline: 'Real-time Multiplayer Code Editor & Audio Huddles',
      issueNumber: 'MISSION #02',
      description: 'High-throughput developer collaboration hub with sandboxed code execution, synchronized multi-cursor editing, live audio channels, and persistent project workspaces designed for distributed hackathons.',
      tech: ['Next.js', 'Node.js', 'WebSockets', 'Docker', 'Redis', 'WebRTC'],
      features: [
        'Sub-15ms multi-cursor CRDT synchronization',
        'Isolated Docker containers for Python & C++ execution',
        'Integrated peer-to-peer voice channels'
      ],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      comicBadge: 'POPULAR',
      accentColor: '#FF007F',
      bannerGradient: 'from-pink-900/80 via-purple-900/60 to-indigo-950/90'
    },
    {
      id: 'snippetvault',
      title: 'SNIPPETVAULT ENGINE',
      tagline: 'Instant Semantic Code Search & Encrypted Keychains',
      issueNumber: 'MISSION #03',
      description: 'Local-first developer vault for organizing, tagging, and instantly recalling code patterns. Uses client-side WebAssembly embedding search for zero-latency retrieval even in offline flight conditions.',
      tech: ['React', 'TypeScript', 'Rust / Wasm', 'IndexedDB', 'Tailwind'],
      features: [
        'Sub-millisecond fuzzy & semantic regex search',
        'Zero-knowledge AES-256 client-side encryption',
        'One-click GitHub Gist bidirectional sync'
      ],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      comicBadge: 'UTILITY',
      accentColor: '#FFDE59',
      bannerGradient: 'from-amber-900/80 via-orange-900/60 to-stone-950/90'
    },
    {
      id: 'algovis',
      title: 'ALGOVIS ARCADE',
      tagline: 'Retro Neon Algorithm & Graph Traversal Visualizer',
      issueNumber: 'MISSION #04',
      description: 'Transforms complex sorting algorithms, Dijkstra pathfinding, and dynamic programming trees into 80s arcade neon visualizations with synchronized 8-bit sound synthesis.',
      tech: ['React', 'HTML5 Canvas', 'Web Audio API', 'TypeScript', 'Tailwind'],
      features: [
        'Step-by-step memory stack inspection',
        'Interactive maze generator with A* search paths',
        'Synthesizer pitch feedback corresponding to element swaps'
      ],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      comicBadge: 'ARCADE',
      accentColor: '#9D00FF',
      bannerGradient: 'from-purple-900/80 via-violet-900/60 to-zinc-950/90'
    }
  ];

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 bg-[#0E061B]/85 p-5 rounded-lg border-2 border-vice-pink shadow-[6px_6px_0px_#FFDE59]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-cyan text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #03
            </span>
            <span className="text-vice-pink font-mono text-sm uppercase tracking-widest font-bold">
              // CLASSIFIED MISSIONS ARCHIVE
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-white mt-1">
            FEATURED <span className="text-vice-pink">MISSIONS & CODE</span>
          </h2>
        </div>
        <div className="text-left sm:text-right font-mono text-xs text-zinc-300">
          <span className="text-vice-yellow font-bold">STATUS:</span> ALL SYSTEMS DEPLOYED & TESTED
        </div>
      </div>

      {/* Projects Grid: Comic Cover Book Aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-[#120723] rounded-2xl border-4 border-black overflow-hidden flex flex-col justify-between group relative"
            style={{
              boxShadow: `8px 8px 0px ${project.accentColor}`,
            }}
          >
            {/* Top Comic Artwork Banner */}
            <div className={`relative h-56 bg-gradient-to-br ${project.bannerGradient} p-6 flex flex-col justify-between border-b-4 border-black overflow-hidden`}>
              {/* Halftone texture overlay */}
              <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

              {/* Top Banner Badges */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-bangers text-sm tracking-wider px-3 py-1 bg-black text-vice-yellow border-2 border-vice-yellow">
                  {project.issueNumber}
                </span>

                <span 
                  className="font-bangers text-sm tracking-widest px-3 py-1 bg-black border-2 rotate-3"
                  style={{ color: project.accentColor, borderColor: project.accentColor }}
                >
                  ★ {project.comicBadge}
                </span>
              </div>

              {/* Title inside banner */}
              <div className="relative z-10">
                <h3 className="font-bangers text-3xl sm:text-4xl text-white tracking-wider group-hover:text-vice-yellow transition-colors comic-stroke">
                  {project.title}
                </h3>
                <p className="font-mono text-xs text-zinc-200 mt-1 line-clamp-1">
                  {project.tagline}
                </p>
              </div>

              {/* Decorative Corner Action Stamp */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-black/40 border-2 border-white/20 blur-md pointer-events-none" />
            </div>

            {/* Bottom Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-[#110820]">
              <div>
                <p className="text-zinc-200 text-sm leading-relaxed font-sans mb-4">
                  {project.description}
                </p>

                {/* Key Mission Intel */}
                <div className="space-y-1.5 mb-5 bg-[#090314] p-3 rounded-lg border border-zinc-800">
                  <div className="font-mono text-[11px] text-vice-yellow font-bold uppercase tracking-wider mb-1">
                    KEY MISSION INTEL:
                  </div>
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <span className="text-vice-pink">▶</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2.5 py-1 rounded bg-[#1B0D33] text-zinc-200 border border-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center font-bangers text-lg tracking-wider py-2.5 px-4 bg-vice-cyan text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-vice-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  LAUNCH MISSION
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#1B0F33] text-white border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-vice-pink hover:text-black transition-all"
                  title="Source Code"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
