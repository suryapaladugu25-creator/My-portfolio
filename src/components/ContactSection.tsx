import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DeveloperCharacter } from './DeveloperCharacter';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, MessageSquare, Flame } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required mission dispatch fields!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid communication frequency (email)!');
      return;
    }

    setStatus('submitting');

    setTimeout(() => {
      setStatus('success');
      // Confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF007F', '#00F0FF', '#FFDE59', '#9D00FF']
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Chapter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 bg-white/95 dark:bg-[#120722]/85 p-5 rounded-lg border-2 border-vice-pink shadow-[6px_6px_0px_#FFDE59] transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-vice-pink text-black font-bangers text-lg px-2.5 py-0.5 border-2 border-black">
              ISSUE #06
            </span>
            <span className="text-sky-600 dark:text-vice-cyan font-mono text-sm uppercase tracking-widest font-bold">
              // SECURE TRANSMISSION CHANNEL
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bangers tracking-wider text-[#15152F] dark:text-white mt-1 transition-colors duration-300">
            RADIO SURYA: <span className="text-amber-500 dark:text-vice-yellow">DISPATCH HQ</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 px-3 py-1.5 rounded-full transition-colors duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          FREQUENCY ACTIVE: 24/7 OPEN FOR OPPORTUNITIES
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Developer Character waving in cinematic sunset */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full flex justify-center">
            <DeveloperCharacter 
              isWaving={true}
              showHiBubble={false}
              actionSpeech="LET'S BUILD SOMETHING LEGENDARY! 🚀" 
            />
          </div>

          {/* Quick Direct Channels Card */}
          <div className="mt-8 w-full bg-white dark:bg-[#140A28] rounded-xl border-3 border-black p-5 shadow-[5px_5px_0px_#00F0FF] space-y-3 font-mono text-xs transition-colors duration-300">
            <div className="flex items-center gap-3 text-[#2D2D44] dark:text-zinc-200">
              <Mail className="w-4 h-4 text-vice-pink" />
              <span>EMAIL: <strong className="text-[#15152F] dark:text-white">surya@example.com</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[#2D2D44] dark:text-zinc-200">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-vice-cyan" />
              <span>HQ BASE: <strong className="text-[#15152F] dark:text-white">Newton School of Technology</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[#2D2D44] dark:text-zinc-200">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-vice-yellow" />
              <span>RESPONSE TIME: <strong className="text-amber-600 dark:text-vice-yellow">Within 24 Hours</strong></span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-2 bg-purple-100 dark:bg-[#20103C] hover:bg-vice-pink hover:text-black font-bangers tracking-wider text-sm border-2 border-black rounded transition-colors text-purple-950 dark:text-white"
              >
                GITHUB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-2 bg-purple-100 dark:bg-[#20103C] hover:bg-vice-cyan hover:text-black font-bangers tracking-wider text-sm border-2 border-black rounded transition-colors text-purple-950 dark:text-white"
              >
                LINKEDIN
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Comic Validated Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#130724] rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#FF007F] relative overflow-hidden transition-colors duration-300"
          >
            <div className="absolute inset-0 halftone-overlay opacity-25 pointer-events-none" />

            <div className="relative z-10 mb-6">
              <h3 className="font-bangers text-3xl text-[#15152F] dark:text-white tracking-wide transition-colors duration-300">
                TRANSMIT MISSION BRIEFING
              </h3>
              <p className="text-[#2D2D44] dark:text-zinc-300 text-xs sm:text-sm font-sans mt-1 transition-colors duration-300">
                Have a project idea, open-source opportunity, or engineering position? Send the signal!
              </p>
            </div>

            {/* Error / Success Alerts */}
            {status === 'error' && (
              <div className="mb-5 p-3 rounded-lg bg-red-100 dark:bg-red-950/80 border-2 border-red-500 text-red-900 dark:text-red-200 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="mb-5 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 dark:border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300 font-bangers tracking-wider">
                    TRANSMISSION RECEIVED 10-4!
                  </div>
                  <div>Surya will radio back to your frequency shortly.</div>
                </div>
              </div>
            )}

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bangers text-purple-900 dark:text-vice-yellow text-sm tracking-wider uppercase mb-1">
                    AGENT NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tommy Vercetti"
                    className="w-full px-4 py-2.5 rounded-lg bg-purple-50 dark:bg-[#090314] text-[#15152F] dark:text-white border-2 border-black focus:border-vice-cyan focus:outline-none font-sans text-sm shadow-inner transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block font-bangers text-sky-600 dark:text-vice-cyan text-sm tracking-wider uppercase mb-1">
                    COMM FREQUENCY (EMAIL) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="agent@vicecity.net"
                    className="w-full px-4 py-2.5 rounded-lg bg-purple-50 dark:bg-[#090314] text-[#15152F] dark:text-white border-2 border-black focus:border-vice-pink focus:outline-none font-sans text-sm shadow-inner transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bangers text-vice-pink text-sm tracking-wider uppercase mb-1">
                  MISSION OBJECTIVE / SUBJECT
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Collaborate on next-gen AI / Full-Stack project"
                  className="w-full px-4 py-2.5 rounded-lg bg-purple-50 dark:bg-[#090314] text-[#15152F] dark:text-white border-2 border-black focus:border-vice-yellow focus:outline-none font-sans text-sm shadow-inner transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block font-bangers text-[#15152F] dark:text-white text-sm tracking-wider uppercase mb-1">
                  DEBRIEF / MESSAGE DETAILS *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hey Surya, saw your open source work and portfolio. Let's discuss an engineering challenge..."
                  className="w-full px-4 py-2.5 rounded-lg bg-purple-50 dark:bg-[#090314] text-[#15152F] dark:text-white border-2 border-black focus:border-vice-cyan focus:outline-none font-sans text-sm shadow-inner resize-none transition-colors duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-gradient-to-r from-vice-pink via-vice-magenta to-vice-yellow hover:from-vice-yellow hover:to-vice-pink text-black font-bangers text-2xl tracking-widest border-3 border-black shadow-[5px_5px_0px_#00F0FF] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <span>TRANSMITTING SIGNAL...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-black" />
                    DISPATCH SIGNAL NOW!
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
