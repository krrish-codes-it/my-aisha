/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Heart, Gift, Music } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { MusicPlayerModal } from './MusicPlayerModal';

interface OpeningEnvelopeProps {
  onStartJourney: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({ onStartJourney }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [trackName, setTrackName] = useState(soundEffects.getTrackName());

  useEffect(() => {
    const unsub = soundEffects.subscribeTrackChange((t) => setTrackName(t));
    return () => unsub();
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    soundEffects.startAmbientMusic();
    soundEffects.playSealCrack();

    setTimeout(() => {
      soundEffects.playEnvelopeOpen();
    }, 400);

    setTimeout(() => {
      setIsOpened(true);
    }, 900);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 z-20">
      {/* Decorative Surroundings: Tulips, Lotus blossoms, ribbons, glowing lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] bg-gradient-to-tr from-pink-500/15 via-amber-400/15 to-purple-600/15 rounded-full blur-3xl" />

        {/* Decorative Lotus Flower (Bottom Left) */}
        <div className="absolute bottom-4 left-4 sm:bottom-12 sm:left-12 opacity-85 transition-transform hover:scale-105">
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none" className="filter drop-shadow-[0_4px_12px_rgba(244,114,182,0.4)]">
            {/* Outer Petals */}
            <path d="M60 70C30 70 10 50 15 25C25 45 45 65 60 70Z" fill="#f472b6" fillOpacity="0.75" />
            <path d="M60 70C90 70 110 50 105 25C95 45 75 65 60 70Z" fill="#f472b6" fillOpacity="0.75" />
            {/* Mid Petals */}
            <path d="M60 70C40 65 25 45 35 15C45 35 55 55 60 70Z" fill="#fb7185" fillOpacity="0.85" />
            <path d="M60 70C80 65 95 45 85 15C75 35 65 55 60 70Z" fill="#fb7185" fillOpacity="0.85" />
            {/* Center Petal */}
            <path d="M60 70C52 50 50 20 60 5C70 20 68 50 60 70Z" fill="#fbcfe8" />
            <circle cx="60" cy="55" r="4" fill="#fef08a" />
          </svg>
          <span className="text-[10px] uppercase font-cinzel text-pink-300 tracking-widest block text-center mt-1">
            Divine Lotus
          </span>
        </div>

        {/* Decorative Tulips & Ribbons (Bottom Right) */}
        <div className="absolute bottom-6 right-6 sm:bottom-14 sm:right-14 opacity-85">
          <svg width="110" height="95" viewBox="0 0 110 95" fill="none" className="filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.35)]">
            {/* Tulip Stems */}
            <path d="M50 90C45 70 42 45 45 30" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 90C72 70 78 50 72 38" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Tulip Bloom 1 */}
            <path d="M45 30C35 30 30 15 35 5C45 12 45 25 45 30Z" fill="#fb7185" />
            <path d="M45 30C55 30 60 15 55 5C45 12 45 25 45 30Z" fill="#f43f5e" />
            <path d="M40 8C45 2 48 2 50 8C48 20 42 20 40 8Z" fill="#fecdd3" />
            {/* Golden Silk Ribbon bow */}
            <path d="M30 75C40 68 55 68 65 75C75 82 85 92 88 95" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          <span className="text-[10px] uppercase font-cinzel text-amber-300 tracking-widest block text-center mt-1">
            Tulip Bloom
          </span>
        </div>

        {/* Candlelight Diya / Glow (Top Right) */}
        <div className="absolute top-16 right-8 sm:top-20 sm:right-20 flex flex-col items-center opacity-80">
          <div className="w-3 h-4 bg-amber-200 rounded-full blur-[1.5px] animate-pulse shadow-[0_0_16px_#fef08a]" />
          <div className="w-8 h-3.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-b-full border-t border-amber-400/40" />
        </div>
      </div>

      {/* Main Envelope Experience */}
      <div className="max-w-xl w-full mx-auto relative perspective-1000">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* Closed Envelope View */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative cursor-pointer group"
              onClick={handleOpenEnvelope}
            >
              {/* Envelope Body */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a101f] via-[#3d1629] to-[#1f0916] border border-amber-400/40 p-6 sm:p-10 shadow-royal transition-all duration-300 group-hover:border-amber-400/70 group-hover:shadow-[0_0_40px_rgba(245,187,85,0.35)]">
                {/* Traditional Indian Border Motif */}
                <div className="absolute inset-2 border border-amber-300/20 rounded-xl pointer-events-none" />
                <div className="absolute top-4 left-4 text-amber-300/40 text-xs font-cinzel">✦ ✦ ✦</div>
                <div className="absolute top-4 right-4 text-amber-300/40 text-xs font-cinzel">✦ ✦ ✦</div>
                <div className="absolute bottom-4 left-4 text-amber-300/40 text-xs font-cinzel">✦ ✦ ✦</div>
                <div className="absolute bottom-4 right-4 text-amber-300/40 text-xs font-cinzel">✦ ✦ ✦</div>

                {/* Silk Ribbon Band */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-b from-amber-400/20 via-amber-300/30 to-amber-500/20 border-x border-amber-400/40 pointer-events-none flex items-center justify-center">
                  <div className="w-0.5 h-full bg-amber-200/50" />
                </div>

                {/* Envelope Front Content */}
                <div className="relative z-10 text-center flex flex-col items-center py-6 sm:py-8">
                  {/* Subtle pre-title */}
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-200 text-xs font-cinzel tracking-widest uppercase mb-4"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Royal Birthday Present</span>
                  </motion.div>

                  {/* Formal Dedication: For Dr. Aisha Habibi */}
                  <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-amber-100 mb-2 filter drop-shadow-md">
                    For Dr. Aisha Habibi
                  </h1>

                  <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3" />

                  {/* Subtitle: A Birthday Surprise Awaits You... */}
                  <p className="font-script text-2xl sm:text-3xl text-pink-200 mb-6">
                    A Birthday Surprise Awaits You…
                  </p>

                  <p className="font-sans text-xs sm:text-sm text-amber-100/70 max-w-md mx-auto leading-relaxed mb-6">
                    10 Envelopes, 10 Surprises & 1 Royal Confession.<br />
                    A continuous magical journey woven with flowers, shayari, butterflies, and crowns.
                  </p>

                  {/* Background Music pill & quick selector */}
                  <div className="mb-6 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMusicModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/40 text-amber-200 text-xs font-serif flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                      title="Set or Change Background Music"
                    >
                      <Music className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="truncate max-w-[200px]">Soundtrack: {trackName}</span>
                      <span className="text-[10px] text-pink-200 underline ml-1">Change / Upload</span>
                    </button>
                  </div>

                  {/* Wax Seal / Clickable Button */}
                  <div className="relative mt-2">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-300 shadow-[0_0_25px_rgba(244,63,94,0.6)] flex flex-col items-center justify-center relative cursor-pointer"
                    >
                      {/* Wax drips effect */}
                      <div className="absolute -bottom-1 left-3 w-3 h-3 bg-red-800 rounded-full blur-[0.5px]" />
                      <div className="absolute -top-1 right-3 w-2.5 h-2.5 bg-red-700 rounded-full blur-[0.5px]" />

                      <Crown className="w-6 h-6 text-amber-200 mb-0.5" />
                      <span className="font-cinzel text-amber-100 text-xs font-bold tracking-wider">
                        AISHA
                      </span>
                      <span className="text-[9px] text-amber-200/80 font-sans tracking-tight">
                        Break Seal
                      </span>
                    </motion.div>

                    {/* Shimmering pulse around the seal */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ping pointer-events-none" />
                  </div>

                  <span className="mt-4 text-xs font-sans tracking-wide text-amber-300/80 flex items-center gap-1.5 animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Tap the royal seal to open
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Opened Envelope Transition Card */
            <motion.div
              key="opened-envelope"
              initial={{ scale: 0.85, opacity: 0, rotateX: 25 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#2e1224] via-[#1f0b18] to-[#12050e] border-2 border-amber-400/50 p-6 sm:p-10 shadow-royal text-center"
            >
              {/* Floating petals inside */}
              <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <Crown className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>

              <div className="font-script text-3xl sm:text-4xl text-amber-200 mb-2">
                Welcome, Dr. Aisha Habibi 👑
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
                Your Birthday & Confession Tunnel Has Begun
              </h2>

              <p className="font-sans text-stone-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6">
                Every envelope holds a playful question, a complimentary reaction, blooming flowers,
                and a surprise gift to crown you on your birthday tomorrow.
              </p>

              {/* Romantic Indian Shayari Quote */}
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/25 max-w-md mx-auto mb-8 text-amber-100 font-serif italic text-sm sm:text-base leading-relaxed">
                “खुदा करे कि उम्र भर ये सिलसिला चले,<br />
                जहाँ भी तू कदम रखे वहां बहार चले।”
              </div>

              {/* Enter Stage 1 Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  soundEffects.playCelebrationChimes();
                  onStartJourney();
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 text-[#190615] font-serif font-bold text-base sm:text-lg shadow-[0_0_25px_rgba(251,191,36,0.5)] flex items-center gap-2.5 mx-auto cursor-pointer"
              >
                <span>Enter Envelope 01 / 11</span>
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
      />
    </div>
  );
};
