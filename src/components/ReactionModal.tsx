/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Heart, ArrowRight, Gift, Flower } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionStage, QuestionOption } from '../types';
import { soundEffects } from '../utils/audio';

interface ReactionModalProps {
  isOpen: boolean;
  stage: QuestionStage;
  selectedOption: QuestionOption | null;
  onNextEnvelope: () => void;
  isLastStage: boolean;
}

export const ReactionModal: React.FC<ReactionModalProps> = ({
  isOpen,
  stage,
  selectedOption,
  onNextEnvelope,
  isLastStage,
}) => {
  const isCompliment = selectedOption?.isCompliment ?? true;

  useEffect(() => {
    if (isOpen) {
      if (isCompliment) {
        soundEffects.playCelebrationChimes();
        soundEffects.playSparkle();

        // Confetti burst with gold & pink palette
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#fbbf24', '#f43f5e', '#ffffff', '#e879f9'],
          });
        } catch {
          // ignore if canvas unavailable
        }
      } else {
        soundEffects.playSparkle();
      }
    }
  }, [isOpen, isCompliment]);

  if (!isOpen || !selectedOption) return null;

  const responseData = isCompliment
    ? stage.complimentResponse
    : stage.playfulResponse;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-xl w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#2a0e28] via-[#1c081b] to-[#120411] border-2 border-amber-400/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.35)]"
        >
          {/* Subtle Jali Pattern */}
          <div className="absolute inset-0 bg-jali-pattern opacity-30 pointer-events-none" />

          {/* Top Floating Badge */}
          <div className="relative z-10 flex justify-center -mt-2 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 border border-amber-200 text-stone-950 font-serif font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
            >
              <Crown className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>
                {isCompliment ? 'Crown Accolade Unlocked!' : 'Playful Habibi Reaction! 🌸'}
              </span>
            </motion.div>
          </div>

          {/* Reaction Title */}
          <div className="relative z-10 text-center mb-3">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide filter drop-shadow">
              {responseData.title}
            </h3>
          </div>

          {/* Reaction Message */}
          <div className="relative z-10 text-center mb-5">
            <p className="font-sans text-stone-200 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {responseData.message}
            </p>

            {/* Playful hint if it was a denial answer */}
            {'hint' in responseData && responseData.hint && (
              <div className="mt-3.5 p-3 rounded-xl bg-rose-500/15 border border-rose-400/30 text-rose-200 font-sans text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                <span className="font-semibold text-amber-300 block mb-0.5">
                  Playful Royal Hint:
                </span>
                {responseData.hint}
              </div>
            )}
          </div>

          {/* Shayari Couplet Card */}
          {responseData.shayari && (
            <div className="relative z-10 p-3.5 sm:p-4 rounded-xl bg-amber-400/10 border border-amber-300/30 text-center mb-5 max-w-lg mx-auto">
              <span className="text-[10px] uppercase font-cinzel text-amber-300 tracking-widest block mb-1">
                ✦ Shahi Shayari for Aisha ✦
              </span>
              <p className="font-serif italic text-amber-100 text-sm sm:text-base leading-relaxed">
                {responseData.shayari}
              </p>
            </div>
          )}

          {/* Unlocked Surprise Memento Card */}
          <div className="relative z-10 p-3.5 rounded-xl bg-[#2e122b]/80 border border-pink-400/30 flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/30 to-pink-500/30 border border-amber-300/40 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
              {stage.surprise.symbol}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-cinzel text-pink-300 tracking-wider">
                  Surprise Gift #{stage.stageNumber}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] rounded bg-amber-400/20 text-amber-200 font-sans font-medium">
                  {stage.surprise.tag}
                </span>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-semibold text-amber-100 truncate">
                {stage.surprise.name}
              </h4>
              <p className="text-[11px] text-stone-300 font-sans truncate">
                {stage.surprise.description}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="relative z-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                soundEffects.playSealCrack();
                onNextEnvelope();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 text-stone-950 font-serif font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>
                {isLastStage
                  ? 'Open The Final Grand Birthday Envelope 👑'
                  : `Journey to Envelope ${String(stage.id + 1).padStart(2, '0')}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
