/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, Heart, RotateCcw, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SurpriseGift, QuestionStage } from '../types';
import { soundEffects } from '../utils/audio';

interface GrandRevealProps {
  collectedGifts: SurpriseGift[];
  stages?: QuestionStage[];
  onRestart: () => void;
  onExploreStages: () => void;
}

export const GrandReveal: React.FC<GrandRevealProps> = ({
  collectedGifts,
  stages = [],
  onRestart,
  onExploreStages,
}) => {
  const [isWishBlown, setIsWishBlown] = useState(false);
  const [showTreasury, setShowTreasury] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    soundEffects.playGrandFinale();

    // Continuous celebration fireworks confetti
    const duration = 6000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f472b6', '#fbbf24', '#f43f5e', '#ffffff', '#e879f9'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f472b6', '#fbbf24', '#f43f5e', '#ffffff', '#e879f9'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleBlowWish = () => {
    if (isWishBlown) return;
    setIsWishBlown(true);
    soundEffects.playCelebrationChimes();
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#ff69b4', '#ffffff', '#ff1493'],
    });
  };

  // Rising celebratory balloons
  const balloons = [
    { color: '#f472b6', left: '8%', delay: 0 },
    { color: '#fbbf24', left: '18%', delay: 1.2 },
    { color: '#ec4899', left: '30%', delay: 0.4 },
    { color: '#fb7185', left: '42%', delay: 2.1 },
    { color: '#a855f7', left: '55%', delay: 0.8 },
    { color: '#ffd700', left: '68%', delay: 1.6 },
    { color: '#f43f5e', left: '80%', delay: 0.2 },
    { color: '#f472b6', left: '92%', delay: 1.9 },
  ];

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 z-20 overflow-hidden">
      {/* Floating Birthday Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {balloons.map((b, i) => (
          <motion.div
            key={`balloon-${i}`}
            initial={{ y: '105vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.9, 0.9, 0],
              x: [0, (i % 2 === 0 ? 25 : -25), 0],
            }}
            transition={{
              duration: 10 + i * 1.5,
              delay: b.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ left: b.left }}
            className="absolute flex flex-col items-center"
          >
            {/* Balloon Body */}
            <div
              className="w-12 h-16 sm:w-16 sm:h-20 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] relative shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 0 20px ${b.color}80`,
              }}
            >
              {/* Highlight reflection */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-6 bg-white/40 rounded-full rotate-[-30deg] blur-[0.5px]" />
            </div>
            {/* Balloon Knot */}
            <div
              className="w-2.5 h-2.5 -mt-1 rounded-sm rotate-45"
              style={{ backgroundColor: b.color }}
            />
            {/* Balloon String */}
            <div className="w-0.5 h-16 bg-white/30" />
          </motion.div>
        ))}

        {/* Decorative Blooming Lotus (Left) */}
        <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-14 opacity-90">
          <svg width="130" height="100" viewBox="0 0 130 100" fill="none" className="filter drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]">
            <path d="M65 80C30 80 10 55 15 25C25 50 48 72 65 80Z" fill="#ec4899" />
            <path d="M65 80C100 80 120 55 115 25C105 50 82 72 65 80Z" fill="#ec4899" />
            <path d="M65 80C42 75 25 50 35 15C48 38 60 62 65 80Z" fill="#fb7185" />
            <path d="M65 80C88 75 105 50 95 15C82 38 70 62 65 80Z" fill="#fb7185" />
            <path d="M65 80C56 55 54 22 65 5C76 22 74 55 65 80Z" fill="#fbcfe8" />
            <circle cx="65" cy="62" r="5" fill="#fef08a" />
          </svg>
        </div>

        {/* Decorative Blooming Tulips (Right) */}
        <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-14 opacity-90">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="filter drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            <path d="M50 95C48 75 45 50 50 35" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
            <path d="M75 95C78 75 82 55 78 40" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 35C40 35 32 20 40 8C50 15 50 30 50 35Z" fill="#f43f5e" />
            <path d="M50 35C60 35 68 20 60 8C50 15 50 30 50 35Z" fill="#fb7185" />
            <path d="M45 10C50 4 55 4 55 10C53 22 47 22 45 10Z" fill="#fed7aa" />
          </svg>
        </div>
      </div>

      {/* Main Royal Celebration Centerpiece */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        className="relative max-w-3xl w-full mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#350d22] via-[#200717] to-[#12030f] border-2 border-amber-300/80 p-6 sm:p-12 shadow-[0_0_70px_rgba(245,187,85,0.45)] text-center"
      >
        {/* Subtle Indian Jali Background */}
        <div className="absolute inset-0 bg-jali-pattern opacity-30 pointer-events-none" />

        {/* Golden Border Accents */}
        <div className="absolute inset-3 border border-amber-400/30 rounded-2xl pointer-events-none" />

        {/* Crown Descending Animation */}
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.4 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, type: 'spring', bounce: 0.45 }}
          className="relative mx-auto mb-4"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/30 to-amber-300/40 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(251,191,36,0.75)]">
            <Crown className="w-14 h-14 sm:w-16 sm:h-16 text-amber-300 fill-amber-300/30 animate-pulse filter drop-shadow-[0_0_12px_#fef08a]" />
          </div>
          {/* Subtle sparkles dancing around crown */}
          <div className="absolute top-0 right-1/3 text-amber-200 animate-ping text-xs">✦</div>
          <div className="absolute bottom-2 left-1/3 text-rose-300 animate-ping text-xs">✦</div>
        </motion.div>

        {/* Grand Headline 1: HAPPY BIRTHDAY, PRINCESS AISHA 👑 */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-cinzel text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-wider gold-gradient-text filter drop-shadow-md mb-2 uppercase"
        >
          Happy Birthday, Dr. Aisha Habibi 👑
        </motion.h1>

        {/* Subtitle: Dr. Aisha Habibi ✨ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-serif text-2xl sm:text-4xl font-semibold text-pink-200 tracking-wide mb-5 flex items-center justify-center gap-2"
        >
          <span>Dr. Aisha Habibi</span>
          <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4" />

        {/* Final Affectionate Birthday Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-xl mx-auto mb-6 p-4 sm:p-6 rounded-2xl bg-amber-400/10 border border-amber-300/30 shadow-inner"
        >
          <p className="font-serif text-xl sm:text-2xl text-amber-100 font-semibold italic leading-relaxed mb-3">
            “Today isn't just another day…<br />
            it's the day the world got a little more beautiful. 🌷✨”
          </p>
          <p className="font-script text-2xl sm:text-3xl text-pink-300">
            Happy Birthday, Dr. Aisha Habibi. 👑🦋
          </p>
        </motion.div>

        {/* Dedicated Heartfelt Letter for Dr. Aisha */}
        <div className="max-w-xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#280c1f]/80 border border-rose-400/25 text-left mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-cinzel text-amber-300 uppercase tracking-widest mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Royal Coronation Decrees & Eternal Prayers</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-stone-200 leading-relaxed mb-3">
            To our dearest Dr. Aisha Habibi, on the eve of your birthday:
          </p>
          <p className="font-serif italic text-amber-200/90 text-sm sm:text-base leading-relaxed mb-3">
            “तुम सलामत रहो हज़ार बरस, हर बरस के हों दिन पचास हज़ार…”
          </p>
          <p className="font-sans text-xs sm:text-sm text-stone-300 leading-relaxed">
            May your stethoscope always heal, your laughter always brighten every room you enter,
            and your heart remain as serene and pure as a blossoming lotus. May tomorrow bring the start
            of your most blessed and radiant year yet.
          </p>
        </div>

        {/* Interactive Candle / Birthday Wish Station */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 max-w-md mx-auto flex flex-col items-center">
          <span className="text-xs font-cinzel text-amber-200 tracking-wider mb-2 uppercase">
            ✦ Make A Birthday Wish Station ✦
          </span>
          <div className="relative my-2">
            <div
              className={`w-3.5 h-5 rounded-full blur-[1px] transition-all duration-500 ${
                isWishBlown
                  ? 'bg-stone-500 opacity-20'
                  : 'bg-amber-300 shadow-[0_0_20px_#fef08a] animate-pulse'
              }`}
            />
            <div className="w-6 h-12 bg-gradient-to-b from-rose-300 to-rose-500 rounded-t-sm mx-auto -mt-1 shadow-md border-t border-rose-200" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleBlowWish}
            disabled={isWishBlown}
            className={`mt-3 px-5 py-2 rounded-full text-xs font-serif font-bold tracking-wide flex items-center gap-1.5 transition-all ${
              isWishBlown
                ? 'bg-stone-800 text-stone-400 cursor-default'
                : 'bg-gradient-to-r from-amber-400 to-rose-400 text-stone-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>
              {isWishBlown ? 'Wish Granted by the Heavens! ✨' : 'Blow the Candle & Make a Wish 🕯️'}
            </span>
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => {
              setShowGallery(!showGallery);
              if (!showGallery) setShowTreasury(false);
            }}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-500/30 to-amber-500/30 hover:bg-white/20 border border-pink-300/50 text-pink-100 font-serif text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(244,114,182,0.3)]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{showGallery ? 'Hide Photo Gallery' : "Aisha's Royal Photo Album 🌸"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => {
              setShowTreasury(!showTreasury);
              if (!showTreasury) setShowGallery(false);
            }}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-serif text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>{showTreasury ? 'Hide Royal Treasury' : `View All ${collectedGifts.length} Gifts Unlocked 💎`}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onExploreStages}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-pink-400/40 text-pink-100 font-serif text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 text-pink-300" />
            <span>Revisit Envelopes</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onRestart}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 text-stone-950 font-serif text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Royal Journey</span>
          </motion.button>
        </div>

        {/* Aisha's Photo Album Gallery */}
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-6 border-t border-pink-300/30 text-left"
          >
            <h3 className="font-cinzel text-base sm:text-lg text-amber-200 mb-2 text-center tracking-wider">
              ✦ Dr. Aisha Habibi’s Royal Memory Gallery ✦
            </h3>
            <p className="text-center text-xs text-pink-200/80 mb-5 font-sans">
              All photographic rewards unlocked through the magical envelopes & royal confession
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
              {stages.map((stage) => {
                const photo = stage.photoReward;
                if (!photo) return null;
                const customPhoto = localStorage.getItem(`aisha_photo_${photo.filename}`);
                const src = customPhoto || `/${photo.filename}`;

                return (
                  <div
                    key={`gallery-photo-${stage.id}`}
                    className="p-3 rounded-2xl bg-[#280d22]/90 border border-amber-300/30 shadow-md flex flex-col items-center"
                  >
                    <div className="relative w-full h-44 rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-pink-400/20">
                      <img
                        src={src}
                        alt={photo.memoryTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center text-center p-2"><span class="text-xs font-serif text-amber-200">${photo.memoryTitle}</span><span class="text-[10px] text-stone-400">${photo.filename}</span></div>`;
                          }
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-black/60 text-amber-300 border border-amber-300/30">
                        {stage.isConfession ? 'Confession 💍' : `Envelope #${stage.stageNumber}`}
                      </span>
                    </div>
                    <h4 className="font-serif text-xs font-semibold text-amber-100 text-center">
                      {photo.memoryTitle}
                    </h4>
                    <p className="text-[10px] text-pink-200/80 italic text-center mt-1">
                      “{photo.caption}”
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Royal Treasury of Gifts */}
        {showTreasury && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-6 border-t border-amber-300/30 text-left"
          >
            <h3 className="font-cinzel text-base sm:text-lg text-amber-200 mb-4 text-center tracking-wider">
              ✦ Dr. Aisha Habibi’s Royal Treasury ({collectedGifts.length} Mementos) ✦
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {collectedGifts.map((gift, idx) => (
                <div
                  key={`gift-${idx}`}
                  className="p-3 rounded-xl bg-[#280d22]/90 border border-amber-300/20 flex items-center gap-3"
                >
                  <span className="text-2xl shrink-0">{gift.symbol}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-cinzel text-pink-300 block truncate">
                      {gift.tag}
                    </span>
                    <h4 className="font-serif text-xs font-semibold text-amber-100 truncate">
                      {gift.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 truncate">{gift.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
