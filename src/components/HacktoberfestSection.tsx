import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Flame, ShieldAlert, Award, Star, CheckCircle, ExternalLink } from 'lucide-react';

export const HacktoberfestSection: React.FC = () => {
  const prHighlights = [
    {
      repo: 'team-vypr/core-platform',
      title: 'Fix race conditions in WebSocket connection state machine',
      tags: ['TypeScript', 'Bugfix', 'Merged'],
      id: '#142'
    },
    {
      repo: 'team-vypr/ui-kit',
      title: 'Implement accessible high-contrast theme tokens & keyboard traps',
      tags: ['React', 'Accessibility', 'Merged'],
      id: '#108'
    },
    {
      repo: 'team-vypr/api-gateway',
      title: 'Optimize Redis cache invalidation on batch write spikes',
      tags: ['Node.js', 'Performance', 'Merged'],
      id: '#89'
    },
    {
      repo: 'team-vypr/docs-hub',
      title: 'Automate OpenAPI schema generation & interactive client playground',
      tags: ['Automation', 'Docs', 'Merged'],
      id: '#64'
    }
  ];

  return (
    <section id="hacktoberfest" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 bg-[#140826]/85 p-5 rounded-lg border-2 border-vice-yellow shadow-[6px_6px_0px_#FF007F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-pink text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #04
            </span>
            <span className="text-vice-yellow font-mono text-sm uppercase tracking-widest font-bold">
              // OPEN SOURCE SPECIAL OPS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-white mt-1">
            TEAM VYPR: <span className="text-vice-yellow">10+ PR CRUSADE</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-bangers text-xl bg-vice-cyan text-black px-4 py-2 border-2 border-black rotate-1 shadow-[3px_3px_0px_#000]">
            ⚡ HACKTOBERFEST VETERAN
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comic Cover Hero Banner */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="lg:col-span-5 bg-gradient-to-br from-[#1E0B38] via-[#120524] to-[#0A0314] rounded-2xl border-4 border-black p-6 relative overflow-hidden shadow-[8px_8px_0px_#00F0FF]"
        >
          {/* Halftone texture */}
          <div className="absolute inset-0 halftone-dense opacity-25 pointer-events-none" />

          {/* Action Starburst Badge */}
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-vice-pink text-black font-bangers flex items-center justify-center text-center text-xs p-1 rotate-12 border-2 border-black shadow-[3px_3px_0px_#FFDE59]">
            10+ PRs MERGED!
          </div>

          <div className="relative z-10">
            <div className="inline-block p-3 bg-vice-yellow text-black border-2 border-black rounded-lg mb-4">
              <GitPullRequest className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-bangers text-white tracking-wide mb-2">
              CODE CONTRIBUTOR WITH REAL IMPACT
            </h3>

            <p className="text-zinc-200 text-sm leading-relaxed mb-6 font-sans">
              Open source is more than submitting pull requests; it's communicating with distributed maintainers, dissecting unfamiliar codebases, respecting design guidelines, and delivering bulletproof, tested solutions.
            </p>

            {/* Achievement Stats Box */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#090312] p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#FF007F]">
                <div className="font-bangers text-3xl text-vice-pink">10+</div>
                <div className="font-mono text-xs text-zinc-300">PULL REQUESTS MERGED</div>
              </div>
              <div className="bg-[#090312] p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#00F0FF]">
                <div className="font-bangers text-3xl text-vice-cyan">100%</div>
                <div className="font-mono text-xs text-zinc-300">CI TESTS PASSED</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#170930] rounded-xl border border-vice-purple text-xs font-mono text-vice-yellow">
              "Every commit is a brick in the global developer commons."
            </div>
          </div>
        </motion.div>

        {/* Right Column: Mission Log / Merged PRs List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="font-bangers text-xl text-vice-cyan tracking-wider flex items-center gap-2">
            <Flame className="w-5 h-5 text-vice-pink" />
            HIGHLIGHTED PULL REQUEST LOGS
          </div>

          {prHighlights.map((pr, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 6 }}
              className="bg-[#120824] rounded-xl border-3 border-black p-4 shadow-[5px_5px_0px_#9D00FF] relative overflow-hidden group transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-vice-pink font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {pr.repo}
                </span>
                <span className="font-bangers text-sm px-2 py-0.5 bg-black text-vice-yellow border border-vice-yellow/50 rounded self-start">
                  PR {pr.id}
                </span>
              </div>

              <h4 className="text-white font-sans text-sm sm:text-base font-bold group-hover:text-vice-cyan transition-colors mb-2.5">
                {pr.title}
              </h4>

              <div className="flex flex-wrap gap-1.5">
                {pr.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1C0D36] text-zinc-300 border border-zinc-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

