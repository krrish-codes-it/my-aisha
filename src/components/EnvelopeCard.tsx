/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Heart, Flame, ShieldAlert, Award } from 'lucide-react';
import { QuestionStage, QuestionOption, ConfessionData } from '../types';
import { soundEffects } from '../utils/audio';

interface EnvelopeCardProps {
  stage: QuestionStage;
  totalStages: number;
  onSelectOption: (option: QuestionOption) => void;
  isTransitioning: boolean;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  stage,
  totalStages,
  onSelectOption,
  isTransitioning,
}) => {
  const [isLetterRevealed, setIsLetterRevealed] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // When stage changes, automatically trigger letter unfolding
  useEffect(() => {
    setIsLetterRevealed(false);
    setSelectedOptionId(null);

    const timer = setTimeout(() => {
      setIsLetterRevealed(true);
      soundEffects.playEnvelopeOpen();
    }, 280);

    return () => clearTimeout(timer);
  }, [stage.id]);

  const handleOptionClick = (option: QuestionOption) => {
    if (selectedOptionId || isTransitioning) return;
    setSelectedOptionId(option.id);
    soundEffects.playOptionClick();
    onSelectOption(option);
  };

  const { theme } = stage;

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-8 z-10 perspective-1000">
      {/* Outer Envelope Container */}
      <motion.div
        key={stage.id}
        initial={{ scale: 0.88, opacity: 0, y: 35 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.08, opacity: 0, y: -30 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative rounded-3xl p-1.5 sm:p-2.5 transition-all duration-500 shadow-royal"
        style={{
          background: `linear-gradient(135deg, ${theme.envelopeColor} 0%, #150918 100%)`,
          border: `1.5px solid ${theme.primaryColor}55`,
          boxShadow: `0 20px 60px -15px ${theme.envelopeColor}, 0 0 35px ${theme.ambientGlow}`,
        }}
      >
        {/* Envelope Top Flap Silhouette */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-7 rounded-t-2xl pointer-events-none opacity-80"
          style={{
            background: `linear-gradient(to bottom, ${theme.envelopeFlapColor}, ${theme.envelopeColor})`,
            borderTop: `1px solid ${theme.primaryColor}80`,
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Envelope Inner Lining & Royal Letter */}
        <div
          className="relative rounded-2xl overflow-hidden p-5 sm:p-9 transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse at top, ${theme.innerLiningColor}12 0%, #17091a 80%)`,
            border: `1px solid ${theme.primaryColor}30`,
          }}
        >
          {/* Subtle Indian Jali Motif */}
          <div className="absolute inset-0 bg-jali-pattern opacity-40 pointer-events-none" />

          {/* Letter Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b pb-3 mb-5 border-amber-300/20">
            {/* Stage Counter */}
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full font-cinzel text-xs font-bold tracking-widest uppercase border"
                style={{
                  borderColor: `${theme.primaryColor}60`,
                  color: theme.primaryColor,
                  background: `${theme.primaryColor}15`,
                }}
              >
                Envelope {stage.stageNumber} / {totalStages}
              </span>
              <span className="text-xs text-stone-400 font-sans hidden sm:inline">
                • {theme.environmentName}
              </span>
            </div>

            {/* Recipient tag */}
            <div className="flex items-center gap-1.5 text-amber-200 text-xs font-serif italic">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>For Dr. Aisha Habibi</span>
            </div>
          </div>

          {/* If this is the Royal Confession Stage (Stage 11) */}
          {stage.isConfession && stage.confessionData ? (
            <ConfessionLetterContent
              stage={stage}
              confessionData={stage.confessionData}
              onAccept={() => {
                handleOptionClick({
                  id: 'confession-yes',
                  text: stage.confessionData?.yesText || 'YES! Always & Forever, With All My Heart! 💍❤️',
                  isCompliment: true,
                });
              }}
              isDisabled={selectedOptionId !== null || isTransitioning}
            />
          ) : (
            <>
              {/* Theme Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative z-10 text-center mb-4"
              >
                <span
                  className="text-xs font-cinzel uppercase tracking-widest font-semibold"
                  style={{ color: theme.accentColor }}
                >
                  ✦ Stage {stage.stageNumber} • {stage.themeTitle} ✦
                </span>

                {/* Question Text */}
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold tracking-wide text-white mt-2 mb-3 leading-snug">
                  {stage.question}
                </h2>

                {/* Shayari / Poetic Couplet */}
                {stage.shayariOrQuote && (
                  <p className="font-serif italic text-amber-200/90 text-sm sm:text-base mb-1 tracking-wide">
                    {stage.shayariOrQuote}
                  </p>
                )}
              </motion.div>

              {/* Answer Options Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mt-6">
                {stage.options.map((option, idx) => {
                  const optionNumber = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={selectedOptionId !== null || isTransitioning}
                      className={`group relative text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/25 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] text-amber-100'
                          : 'bg-[#200e26]/80 hover:bg-[#2c1335] border-white/15 hover:border-amber-300/60 text-stone-200'
                      }`}
                      style={{
                        boxShadow: isSelected ? `0 0 20px ${theme.primaryColor}60` : undefined,
                      }}
                    >
                      {/* Option Badge */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-cinzel text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-400 text-[#17051a]'
                            : 'bg-white/10 group-hover:bg-amber-400/30 text-amber-200'
                        }`}
                      >
                        {optionNumber}
                      </div>

                      {/* Option Text */}
                      <span className="font-sans text-sm sm:text-base leading-relaxed font-medium">
                        {option.text}
                      </span>

                      {/* Small Sparkle on hover */}
                      <Sparkles className="w-4 h-4 text-amber-300/40 group-hover:text-amber-300 shrink-0 ml-auto transition-colors" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Letter Footer Hint */}
              <div className="relative z-10 mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-sans">
                <span className="flex items-center gap-1.5 text-pink-200/80">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
                  Choose an answer to unfold the surprise
                </span>
                <span className="font-cinzel text-amber-300/80 tracking-widest">
                  GIFT {stage.stageNumber}: {stage.surprise.name}
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface ConfessionLetterContentProps {
  stage: QuestionStage;
  confessionData: ConfessionData;
  onAccept: () => void;
  isDisabled: boolean;
}

const ConfessionLetterContent: React.FC<ConfessionLetterContentProps> = ({
  stage,
  confessionData,
  onAccept,
  isDisabled,
}) => {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  const [teaseMessage, setTeaseMessage] = useState<string | null>(null);

  const playfulTeases = [
    "Doctor Habibi, 'No' is clinically forbidden! 💕🩺",
    "Aise kaise No? Look at these puppy eyes... 🥺❤️",
    "Error 404: 'No' does not exist in our destiny! 😂✨",
    "The stars in the sky only permit a YES! 🌙💖",
    "Dil toh toot jayega... please press YES! 💔➡️💍",
    "System detected an illegal answer! The universe demands YES! 👑",
  ];

  const handleNoInteraction = () => {
    soundEffects.playPlayfulBuzzer();
    const nextCount = noHoverCount + 1;
    setNoHoverCount(nextCount);
    
    // Playful dodge movement
    const randomAngle = Math.random() * 2 * Math.PI;
    const distance = 40 + Math.min(100, nextCount * 18);
    const newX = Math.cos(randomAngle) * distance;
    const newY = Math.sin(randomAngle) * distance;
    
    setDodgeOffset({ x: Math.max(-120, Math.min(120, newX)), y: Math.max(-40, Math.min(40, newY)) });
    setTeaseMessage(playfulTeases[(nextCount - 1) % playfulTeases.length]);
  };

  return (
    <div className="relative z-10 flex flex-col items-center">
      {/* Confession Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-amber-300 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300/30">
          ✦ THE SACRED FINAL ENVELOPE • DIL KI DASTAN ✦
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 mt-3 mb-1">
          {confessionData.title}
        </h2>
        <p className="text-pink-200/80 font-serif italic text-sm sm:text-base">
          {confessionData.subtitle}
        </p>
      </motion.div>

      {/* Royal Parchment Letter Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative w-full rounded-2xl p-5 sm:p-7 bg-[#1c0817]/90 border border-amber-400/30 shadow-[0_0_30px_rgba(244,63,94,0.25)] text-stone-200"
      >
        {/* Ornate corner flourishes */}
        <div className="absolute top-2 left-2 text-amber-300/40 text-xs font-serif pointer-events-none">⚜</div>
        <div className="absolute top-2 right-2 text-amber-300/40 text-xs font-serif pointer-events-none">⚜</div>
        <div className="absolute bottom-2 left-2 text-amber-300/40 text-xs font-serif pointer-events-none">⚜</div>
        <div className="absolute bottom-2 right-2 text-amber-300/40 text-xs font-serif pointer-events-none">⚜</div>

        {/* Floating Heart Embers */}
        <div className="absolute top-3 right-4 flex items-center gap-1 text-rose-400/60 animate-pulse pointer-events-none">
          <Heart className="w-3.5 h-3.5 fill-rose-500/40" />
          <Sparkles className="w-3 h-3 text-amber-300/60" />
        </div>

        {/* Letter Paragraphs */}
        <div className="space-y-3 font-serif text-sm sm:text-base leading-relaxed text-amber-50/95 tracking-wide">
          {confessionData.letter.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className={i === 0 ? 'text-amber-200 font-semibold text-base sm:text-lg border-b border-amber-400/20 pb-2 mb-3' : ''}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Proposal Question Highlight Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-rose-950/80 via-[#2d091e]/90 to-amber-950/80 border-2 border-amber-300/60 shadow-[0_0_25px_rgba(251,191,36,0.35)] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-xl sm:text-2xl animate-bounce">💍</span>
            <p className="font-serif font-bold text-base sm:text-lg sm:leading-relaxed text-amber-100 drop-shadow">
              “{confessionData.proposalQuestion}”
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Teasing Message when NO is attempted */}
      <AnimatePresence>
        {teaseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-3 px-4 py-1.5 rounded-full bg-rose-500/25 border border-rose-400/50 text-rose-200 text-xs sm:text-sm font-sans font-medium text-center shadow-lg"
          >
            {teaseMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Statements: YES and NO buttons */}
      <div className="relative w-full max-w-lg mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Pulsating Royal YES Statement Button */}
        <motion.button
          type="button"
          onClick={onAccept}
          disabled={isDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(251,191,36,0.4)',
              '0 0 35px rgba(244,63,94,0.6)',
              '0 0 20px rgba(251,191,36,0.4)',
            ],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 hover:from-amber-300 hover:via-rose-400 hover:to-amber-200 text-[#170513] font-serif font-bold text-base sm:text-lg border-2 border-amber-200 flex items-center justify-center gap-2.5 shadow-2xl cursor-pointer transition-transform"
        >
          <Sparkles className="w-5 h-5 text-amber-950 shrink-0" />
          <span>{confessionData.yesText}</span>
          <Heart className="w-5 h-5 text-rose-950 fill-rose-950 shrink-0" />
        </motion.button>

        {/* Playful NO Statement Button (Dodges & Teases) */}
        <motion.button
          type="button"
          onMouseEnter={handleNoInteraction}
          onClick={handleNoInteraction}
          animate={{ x: dodgeOffset.x, y: dodgeOffset.y }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-stone-300 hover:text-stone-100 text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer select-none"
        >
          {confessionData.noText}
        </motion.button>
      </div>

      {/* Confession Guarantee Footer */}
      <div className="mt-5 text-center text-xs font-serif italic text-amber-200/70 flex items-center gap-1.5">
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400/50" />
        <span>Stage 11 of 11 • A lifetime promise dedicated to Dr. Aisha Habibi</span>
      </div>
    </div>
  );
};

