/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initialStages } from './data/questions';
import { QuestionStage, QuestionOption, SurpriseGift } from './types';
import { HeaderBar } from './components/HeaderBar';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { FloatingButterflies } from './components/FloatingButterflies';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { EnvelopeCard } from './components/EnvelopeCard';
import { LotusPhotoReveal } from './components/LotusPhotoReveal';
import { GrandReveal } from './components/GrandReveal';
import { StageSelectorModal } from './components/StageSelectorModal';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { soundEffects } from './utils/audio';

type GameMode = 'opening' | 'playing' | 'reveal';

export default function App() {
  const [stages, setStages] = useState<QuestionStage[]>(() => {
    const saved = localStorage.getItem('aisha_birthday_stages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 11) {
          return parsed;
        }
      } catch {
        // use default
      }
    }
    return initialStages;
  });

  const [mode, setMode] = useState<GameMode>(() => {
    const savedMode = localStorage.getItem('aisha_birthday_mode');
    return (savedMode as GameMode) || 'opening';
  });

  const [currentStageId, setCurrentStageId] = useState<number>(() => {
    const savedId = localStorage.getItem('aisha_birthday_stage_id');
    const parsed = savedId ? parseInt(savedId, 10) : 1;
    return parsed > 11 ? 1 : parsed;
  });

  const [completedStageIds, setCompletedStageIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('aisha_birthday_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [crownLevel, setCrownLevel] = useState<number>(() => {
    const saved = localStorage.getItem('aisha_birthday_crown');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Reaction Modal State
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const [isReactionOpen, setIsReactionOpen] = useState(false);
  const [isTunnelTransitioning, setIsTunnelTransitioning] = useState(false);
  const [butterflyTrigger, setButterflyTrigger] = useState(0);

  // Modals
  const [isStageSelectOpen, setIsStageSelectOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aisha_birthday_mode', mode);
    localStorage.setItem('aisha_birthday_stage_id', currentStageId.toString());
    localStorage.setItem('aisha_birthday_completed', JSON.stringify(completedStageIds));
    localStorage.setItem('aisha_birthday_crown', crownLevel.toString());
  }, [mode, currentStageId, completedStageIds, crownLevel]);

  // Current stage object
  const currentStageIndex = Math.max(0, stages.findIndex((s) => s.id === currentStageId));
  const currentStage = stages[currentStageIndex] || stages[0];

  // Start journey from opening scene
  const handleStartJourney = () => {
    setMode('playing');
    setCurrentStageId(1);
    setCrownLevel(1);
  };

  // Option selected by Doctor Aisha
  const handleSelectOption = (option: QuestionOption) => {
    setSelectedOption(option);
    setIsReactionOpen(true);
    setButterflyTrigger((prev) => prev + 1);

    // Increment crown level
    setCrownLevel((prev) => Math.min(stages.length, prev + 1));

    // Record stage completion
    if (!completedStageIds.includes(currentStage.id)) {
      setCompletedStageIds((prev) => [...prev, currentStage.id]);
    }
  };

  // Move to next envelope (continuous tunnel effect)
  const handleNextEnvelope = () => {
    setIsReactionOpen(false);
    setSelectedOption(null);

    // If on stage 15, transition to Grand Reveal!
    if (currentStage.id >= stages.length) {
      setIsTunnelTransitioning(true);
      setTimeout(() => {
        setMode('reveal');
        setIsTunnelTransitioning(false);
      }, 700);
      return;
    }

    // Tunnel camera push-in transition
    setIsTunnelTransitioning(true);
    setTimeout(() => {
      const nextId = currentStage.id + 1;
      setCurrentStageId(nextId);
      setIsTunnelTransitioning(false);
    }, 450);
  };

  // Jump to any stage from drawer
  const handleJumpToStage = (stageId: number) => {
    setCurrentStageId(stageId);
    if (mode !== 'playing') {
      setMode('playing');
    }
  };

  // Restart journey
  const handleRestart = () => {
    setMode('opening');
    setCurrentStageId(1);
    setCompletedStageIds([]);
    setCrownLevel(1);
    localStorage.removeItem('aisha_birthday_completed');
    localStorage.removeItem('aisha_birthday_crown');
    localStorage.removeItem('aisha_birthday_stage_id');
    localStorage.removeItem('aisha_birthday_mode');
    soundEffects.stopAmbientMusic();
  };

  // Save custom stages
  const handleSaveCustomStages = (newStages: QuestionStage[]) => {
    setStages(newStages);
    localStorage.setItem('aisha_birthday_stages', JSON.stringify(newStages));
  };

  const handleResetDefaults = () => {
    setStages(initialStages);
    localStorage.removeItem('aisha_birthday_stages');
  };

  // Collect unlocked surprises
  const collectedGifts: SurpriseGift[] = stages.map((s) => s.surprise);

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-between transition-colors duration-700 overflow-x-hidden"
      style={{
        background: mode === 'playing' ? currentStage.theme.backgroundGradient : '#120716',
      }}
    >
      {/* Background canvas with floating petals & sparkles */}
      <BackgroundCanvas
        flowerType={mode === 'playing' ? currentStage.theme.flowerType : 'lotus'}
        primaryColor={mode === 'playing' ? currentStage.theme.primaryColor : '#f472b6'}
        intensity={mode === 'reveal' ? 1.6 : 1.0}
      />

      {/* Floating Animated Butterflies */}
      <FloatingButterflies
        count={mode === 'reveal' ? 6 : 3}
        color={mode === 'playing' ? currentStage.theme.primaryColor : '#f472b6'}
        triggerKey={butterflyTrigger}
      />

      {/* Top Header Bar */}
      <HeaderBar
        currentStage={mode === 'reveal' ? stages.length : currentStage.id}
        totalStages={stages.length}
        crownLevel={crownLevel}
        unlockedSurprisesCount={completedStageIds.length}
        onOpenStageSelect={() => setIsStageSelectOpen(true)}
        onOpenEditor={() => setIsEditorOpen(true)}
        activeThemeColor={mode === 'playing' ? currentStage.theme.primaryColor : '#fbbf24'}
      />

      {/* Main Experience Router with Continuous Tunnel Animations */}
      <main className="flex-1 flex flex-col justify-center items-center pt-16 sm:pt-20 pb-8 z-10 w-full relative">
        <AnimatePresence mode="wait">
          {mode === 'opening' && (
            <motion.div
              key="opening-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <OpeningEnvelope onStartJourney={handleStartJourney} />
            </motion.div>
          )}

          {mode === 'playing' && (
            <motion.div
              key={`stage-${currentStage.id}`}
              initial={{ opacity: 0, scale: 0.9, z: -100 }}
              animate={{
                opacity: 1,
                scale: 1,
                z: 0,
              }}
              exit={{
                opacity: 0,
                scale: 1.15,
                filter: 'blur(4px)',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <EnvelopeCard
                stage={currentStage}
                totalStages={stages.length}
                onSelectOption={handleSelectOption}
                isTransitioning={isTunnelTransitioning}
              />
            </motion.div>
          )}

          {mode === 'reveal' && (
            <motion.div
              key="reveal-view"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full"
            >
              <GrandReveal
                collectedGifts={collectedGifts}
                stages={stages}
                onRestart={handleRestart}
                onExploreStages={() => setIsStageSelectOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lotus Opening Photo Reward Modal for Each Answer */}
      <LotusPhotoReveal
        isOpen={isReactionOpen}
        stage={currentStage}
        selectedOption={selectedOption}
        onNextEnvelope={handleNextEnvelope}
        isLastStage={currentStage.id === stages.length}
      />

      {/* Stage Selector Drawer / Modal */}
      <StageSelectorModal
        isOpen={isStageSelectOpen}
        onClose={() => setIsStageSelectOpen(false)}
        stages={stages}
        currentStageId={currentStage.id}
        onSelectStage={handleJumpToStage}
        completedStageIds={completedStageIds}
      />

      {/* Question Customizer / Editor */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        stages={stages}
        onSaveStages={handleSaveCustomStages}
        onResetDefaults={handleResetDefaults}
      />

      {/* Bottom Subtle Ambient Footer */}
      <footer className="relative z-10 py-3 text-center border-t border-white/5 bg-[#0f0412]/60 backdrop-blur-sm">
        <p className="font-serif text-xs text-amber-200/60 flex items-center justify-center gap-1.5">
          <span>Crafted with royal affection for Dr. Aisha Habibi</span>
          <span>•</span>
          <span className="text-pink-300">A Birthday Surprise Experience</span>
        </p>
      </footer>
    </div>
  );
}
