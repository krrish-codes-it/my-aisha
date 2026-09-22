/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Crown, ArrowRight, RotateCw, Image as ImageIcon, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionStage, QuestionOption } from '../types';
import { soundEffects } from '../utils/audio';

interface LotusPhotoRevealProps {
  isOpen: boolean;
  stage: QuestionStage;
  selectedOption: QuestionOption | null;
  onNextEnvelope: () => void;
  isLastStage: boolean;
}

export const LotusPhotoReveal: React.FC<LotusPhotoRevealProps> = ({
  isOpen,
  stage,
  selectedOption,
  onNextEnvelope,
  isLastStage,
}) => {
  const [bloomPhase, setBloomPhase] = useState<'bud' | 'blooming' | 'presented'>('bud');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  const isCompliment = selectedOption?.isCompliment ?? true;
  const responseData = isCompliment
    ? stage.complimentResponse
    : stage.playfulResponse;

  const photo = stage.photoReward;

  // Check local storage for custom uploaded photo mapping
  useEffect(() => {
    if (photo?.filename) {
      const stored = localStorage.getItem(`aisha_photo_${photo.filename}`);
      if (stored) {
        setCustomPhotoUrl(stored);
      } else {
        setCustomPhotoUrl(null);
      }
    }
  }, [photo?.filename]);

  // Handle lotus opening sequence
  useEffect(() => {
    if (isOpen) {
      setBloomPhase('bud');
      setImageLoaded(false);
      setImageError(false);

      // Play chime
      soundEffects.playCelebrationChimes();

      // Step 1: Start blooming after 250ms
      const t1 = setTimeout(() => {
        setBloomPhase('blooming');
      }, 250);

      // Step 2: Present photo after 1200ms
      const t2 = setTimeout(() => {
        setBloomPhase('presented');

        // Confetti burst as photo emerges
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fbbf24', '#f43f5e', '#ffffff', '#e879f9'],
        });
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen, stage.id]);

  const handleReplayBloom = () => {
    setBloomPhase('bud');
    setTimeout(() => setBloomPhase('blooming'), 200);
    setTimeout(() => setBloomPhase('presented'), 1100);
    soundEffects.playCelebrationChimes();
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && photo?.filename) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        localStorage.setItem(`aisha_photo_${photo.filename}`, base64);
        setCustomPhotoUrl(base64);
        setImageError(false);
        setImageLoaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  // Outer petals definition (8 petals surrounding the bud)
  const outerPetals = [
    { rotate: -80, scale: 1.1, color: '#f43f5e', delay: 0.1 },
    { rotate: -55, scale: 1.15, color: '#ec4899', delay: 0.15 },
    { rotate: -25, scale: 1.2, color: '#f472b6', delay: 0.2 },
    { rotate: 0, scale: 1.25, color: '#fb7185', delay: 0.25 },
    { rotate: 25, scale: 1.2, color: '#f472b6', delay: 0.2 },
    { rotate: 55, scale: 1.15, color: '#ec4899', delay: 0.15 },
    { rotate: 80, scale: 1.1, color: '#f43f5e', delay: 0.1 },
  ];

  // Middle petals definition (5 petals)
  const middlePetals = [
    { rotate: -60, scale: 1.05, color: '#fbcfe8', delay: 0.35 },
    { rotate: -30, scale: 1.1, color: '#fce7f3', delay: 0.4 },
    { rotate: 0, scale: 1.15, color: '#fed7aa', delay: 0.45 },
    { rotate: 30, scale: 1.1, color: '#fce7f3', delay: 0.4 },
    { rotate: 60, scale: 1.05, color: '#fbcfe8', delay: 0.35 },
  ];

  // Inner lotus heart petals
  const innerPetals = [
    { rotate: -35, scale: 0.95, color: '#fef08a', delay: 0.55 },
    { rotate: 0, scale: 1.0, color: '#fef3c7', delay: 0.6 },
    { rotate: 35, scale: 0.95, color: '#fef08a', delay: 0.55 },
  ];

  const photoSrc = customPhotoUrl || (photo ? `/${photo.filename}` : '');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-lg overflow-y-auto">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative max-w-xl w-full my-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#2a0e24] via-[#1a0717] to-[#0e030e] border-2 border-amber-300/60 p-4 sm:p-7 text-center shadow-[0_0_60px_rgba(244,114,182,0.4)]"
        >
          {/* Subtle Indian Jali Pattern in Background */}
          <div className="absolute inset-0 bg-jali-pattern opacity-25 pointer-events-none" />

          {/* Golden Filigree Border Inset */}
          <div className="absolute inset-2 border border-amber-400/30 rounded-2xl pointer-events-none" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-wider bg-amber-400/20 text-amber-200 border border-amber-300/30 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>ENVELOPE {stage.stageNumber} • ROYAL REWARD</span>
            </span>

            <button
              type="button"
              onClick={handleReplayBloom}
              title="Bloom Lotus Again"
              className="px-2.5 py-1 rounded-full text-[11px] font-sans text-pink-200/80 hover:text-pink-100 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span className="hidden sm:inline">Bloom Again</span>
            </button>
          </div>

          {/* Title Header */}
          <div className="relative z-10 mb-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 flex items-center justify-center gap-2">
              <span>{responseData.title}</span>
            </h2>
            <p className="text-xs text-pink-200/90 font-sans mt-0.5 max-w-md mx-auto">
              {responseData.message}
            </p>

            {/* Playful hint if it was a playful answer */}
            {'hint' in responseData && responseData.hint && (
              <div className="mt-1.5 px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-200 font-sans text-xs max-w-sm mx-auto">
                <span className="font-semibold text-amber-300">Playful Hint: </span>
                <span>{responseData.hint}</span>
              </div>
            )}
          </div>

          {/* LOTUS BLOSSOMING STAGE */}
          <div className="relative w-full h-64 sm:h-80 my-2 flex items-center justify-center overflow-hidden">
            {/* Ambient Aura behind Lotus */}
            <motion.div
              animate={{
                scale: bloomPhase === 'bud' ? [0.8, 1, 0.8] : [1.1, 1.3, 1.1],
                opacity: bloomPhase === 'bud' ? 0.4 : 0.8,
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-pink-500/30 via-rose-500/20 to-amber-400/30 blur-2xl pointer-events-none"
            />

            {/* LOTUS PETAL LAYERS (Visible during bud and blooming, stays as a glowing base) */}
            <div className="absolute bottom-4 sm:bottom-6 flex items-end justify-center pointer-events-none">
              {/* Outer Petals Layer */}
              {outerPetals.map((petal, i) => (
                <motion.div
                  key={`outer-${i}`}
                  initial={{
                    rotate: 0,
                    scaleY: 0.4,
                    scaleX: 0.3,
                    y: 40,
                    opacity: 0.7,
                  }}
                  animate={{
                    rotate: bloomPhase === 'bud' ? petal.rotate * 0.2 : petal.rotate,
                    scaleY: bloomPhase === 'bud' ? 0.6 : petal.scale,
                    scaleX: bloomPhase === 'bud' ? 0.5 : 1,
                    y: bloomPhase === 'bud' ? 20 : 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.1,
                    delay: petal.delay,
                    type: 'spring',
                    bounce: 0.35,
                  }}
                  className="absolute origin-bottom w-12 h-28 sm:w-14 sm:h-32 rounded-[50%_50%_50%_50%_/_75%_75%_25%_25%] shadow-[0_0_15px_rgba(244,114,182,0.5)] border-t border-white/40"
                  style={{
                    background: `linear-gradient(to top, #831843, ${petal.color}, #fce7f3)`,
                  }}
                />
              ))}

              {/* Middle Petals Layer */}
              {middlePetals.map((petal, i) => (
                <motion.div
                  key={`mid-${i}`}
                  initial={{ rotate: 0, scaleY: 0.3, scaleX: 0.3, y: 30 }}
                  animate={{
                    rotate: bloomPhase === 'bud' ? petal.rotate * 0.15 : petal.rotate,
                    scaleY: bloomPhase === 'bud' ? 0.5 : petal.scale,
                    scaleX: bloomPhase === 'bud' ? 0.4 : 0.95,
                    y: bloomPhase === 'bud' ? 15 : 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.0,
                    delay: petal.delay,
                    type: 'spring',
                    bounce: 0.4,
                  }}
                  className="absolute origin-bottom w-10 h-24 sm:w-12 sm:h-28 rounded-[50%_50%_50%_50%_/_80%_80%_20%_20%] shadow-[0_0_15px_rgba(251,191,36,0.4)] border-t border-amber-200/50"
                  style={{
                    background: `linear-gradient(to top, #9d174d, ${petal.color}, #ffffff)`,
                  }}
                />
              ))}

              {/* Inner Heart Petals */}
              {innerPetals.map((petal, i) => (
                <motion.div
                  key={`inner-${i}`}
                  initial={{ rotate: 0, scaleY: 0.2, scaleX: 0.2 }}
                  animate={{
                    rotate: bloomPhase === 'bud' ? petal.rotate * 0.1 : petal.rotate,
                    scaleY: bloomPhase === 'bud' ? 0.4 : petal.scale,
                    scaleX: bloomPhase === 'bud' ? 0.3 : 0.9,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: petal.delay,
                    type: 'spring',
                    bounce: 0.4,
                  }}
                  className="absolute origin-bottom w-8 h-20 sm:w-10 sm:h-22 rounded-[50%_50%_50%_50%_/_85%_85%_15%_15%] shadow-[0_0_20px_#fef08a]"
                  style={{
                    background: `linear-gradient(to top, #be185d, ${petal.color}, #fef9c3)`,
                  }}
                />
              ))}

              {/* Golden Lotus Core Glow */}
              <div className="w-10 h-8 rounded-full bg-amber-300 shadow-[0_0_30px_#fef08a] blur-[2px] -mb-1 relative z-10" />
            </div>

            {/* PRESENTED PICTURE CARD RISING FROM LOTUS */}
            <AnimatePresence>
              {bloomPhase === 'presented' && (
                <motion.div
                  initial={{ y: 80, scale: 0.25, opacity: 0, rotate: -4 }}
                  animate={{ y: -10, scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ y: 50, scale: 0.3, opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    type: 'spring',
                    bounce: 0.35,
                  }}
                  className="relative z-20 flex flex-col items-center max-w-[280px] sm:max-w-[320px] w-full"
                >
                  {/* Royal Golden Photo Frame */}
                  <div className="relative p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-200 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(251,191,36,0.6)] border-2 border-amber-200">
                    {/* Crown crest at top of frame */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#20061a] border border-amber-300 text-amber-300 text-[10px] font-cinzel font-bold flex items-center gap-1 shadow-md whitespace-nowrap">
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>{photo?.memoryTitle || 'Dr. Aisha Habibi'}</span>
                    </div>

                    {/* Image Box */}
                    <div className="relative w-48 h-52 sm:w-56 sm:h-60 rounded-xl overflow-hidden bg-[#1f0618] border border-amber-300/40 flex items-center justify-center">
                      {photoSrc && !imageError ? (
                        <img
                          src={photoSrc}
                          alt={photo?.memoryTitle || 'Dr. Aisha Habibi'}
                          referrerPolicy="no-referrer"
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageError(true)}
                          className={`w-full h-full object-cover object-center transition-all duration-700 ${
                            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                          }`}
                        />
                      ) : null}

                      {/* Loading or Fallback State */}
                      {(!imageLoaded || imageError) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#2e0c23] to-[#160514]">
                          <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-2">
                            <ImageIcon className="w-6 h-6 text-amber-300" />
                          </div>
                          <span className="font-serif text-sm font-semibold text-amber-100 mb-1">
                            {photo?.memoryTitle || 'Dr. Aisha Habibi'}
                          </span>
                          <p className="text-[10px] text-pink-200/70 font-sans mb-2 line-clamp-2">
                            {photo?.filename}
                          </p>

                          {/* Quick File Select Button if browser needs direct access */}
                          <label className="px-3 py-1 rounded-full text-[10px] font-sans font-medium bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-300/40 cursor-pointer flex items-center gap-1 transition-all">
                            <Camera className="w-3 h-3" />
                            <span>Select Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLocalFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {/* Vignette Overlay on photo */}
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                    </div>

                    {/* Bottom Filigree Tag */}
                    <div className="text-center pt-1.5 pb-0.5">
                      <span className="font-serif text-[11px] font-semibold text-stone-900 tracking-wide">
                        👑 Princess Aisha Moment
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Photo Caption & Memory Description */}
          {photo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 max-w-md mx-auto my-2 p-2.5 rounded-xl bg-amber-400/10 border border-amber-300/20 text-center"
            >
              <p className="font-serif text-xs sm:text-sm text-amber-100 font-medium italic leading-relaxed">
                “{photo.caption}”
              </p>
            </motion.div>
          )}

          {/* Urdu / Hindi Shayari Inscription */}
          {stage.complimentResponse.shayari && (
            <div className="relative z-10 max-w-md mx-auto my-2 text-center">
              <p className="font-serif text-xs sm:text-sm text-pink-200/90 italic">
                {stage.complimentResponse.shayari}
              </p>
            </div>
          )}

          {/* Unlocked Surprise Memento Ribbon */}
          <div className="relative z-10 max-w-sm mx-auto my-1.5 px-3 py-1.5 rounded-xl bg-pink-900/30 border border-pink-400/20 flex items-center justify-center gap-2">
            <span className="text-base">{stage.surprise.symbol}</span>
            <span className="text-[11px] font-serif text-amber-200">
              Surprise Gift Unlocked: <span className="font-semibold text-pink-100">{stage.surprise.name}</span>
            </span>
          </div>

          {/* Action Continue Button */}
          <div className="relative z-10 mt-3 pt-2 border-t border-amber-300/20 flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onNextEnvelope}
              className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-stone-950 font-serif text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.6)] cursor-pointer"
            >
              <span>{isLastStage ? 'Enter Grand Celebration Darbar 👑' : 'Unlock Next Envelope'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
