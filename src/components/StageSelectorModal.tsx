/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { QuestionStage } from '../types';

interface StageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: QuestionStage[];
  currentStageId: number;
  onSelectStage: (stageId: number) => void;
  completedStageIds: number[];
}

export const StageSelectorModal: React.FC<StageSelectorModalProps> = ({
  isOpen,
  onClose,
  stages,
  currentStageId,
  onSelectStage,
  completedStageIds,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-3xl w-full max-h-[85vh] flex flex-col rounded-3xl overflow-hidden bg-[#1e0a1f] border border-amber-400/40 shadow-royal"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-amber-300/20 flex items-center justify-between bg-[#2a0e2a]">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  The Royal Envelopes & Confession of Dr. Aisha Habibi
                </h3>
                <p className="text-xs text-pink-200/70 font-sans">
                  Choose any envelope to travel to that world
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of Envelopes */}
          <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stages.map((st) => {
              const isCurrent = st.id === currentStageId;
              const isCompleted = completedStageIds.includes(st.id);

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    onSelectStage(st.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between relative group cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400/20 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : 'bg-[#280e29]/70 hover:bg-[#341235] border-white/10 hover:border-amber-300/40'
                  }`}
                  style={{
                    borderColor: isCurrent ? st.theme.primaryColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold tracking-wider"
                      style={{
                        backgroundColor: `${st.theme.primaryColor}25`,
                        color: st.theme.primaryColor,
                      }}
                    >
                      {st.isConfession ? 'CONFESSION 💍' : `ENVELOPE ${st.stageNumber}`}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-300 font-sans">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Unlocked
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 transition-colors mb-1 line-clamp-1">
                    {st.themeTitle}
                  </h4>

                  <p className="text-[11px] text-stone-300 font-sans line-clamp-2 mb-2 leading-tight">
                    {st.question}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-sans border-t border-white/10 pt-2 mt-auto">
                    <span className="truncate">{st.theme.environmentName}</span>
                    <span className="text-base shrink-0 ml-1">{st.surprise.symbol}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-amber-300/20 bg-[#160617] text-center text-xs text-amber-200/70 font-serif">
            “Each envelope reveals a distinct surprise, fragrance, and royal memory for Dr. Aisha Habibi.”
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
