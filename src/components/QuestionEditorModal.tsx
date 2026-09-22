/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Plus, Edit2 } from 'lucide-react';
import { QuestionStage } from '../types';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: QuestionStage[];
  onSaveStages: (updatedStages: QuestionStage[]) => void;
  onResetDefaults: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  stages,
  onSaveStages,
  onResetDefaults,
}) => {
  const [editableStages, setEditableStages] = useState<QuestionStage[]>(stages);
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  if (!isOpen) return null;

  const currentStage = editableStages[selectedStageIndex] || editableStages[0];

  const handleUpdateCurrentStage = (field: keyof QuestionStage, value: any) => {
    const updated = [...editableStages];
    updated[selectedStageIndex] = {
      ...updated[selectedStageIndex],
      [field]: value,
    };
    setEditableStages(updated);
  };

  const handleUpdateOption = (optionIndex: number, text: string) => {
    const updated = [...editableStages];
    const newOptions = [...updated[selectedStageIndex].options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      text,
    };
    updated[selectedStageIndex] = {
      ...updated[selectedStageIndex],
      options: newOptions,
    };
    setEditableStages(updated);
  };

  const handleSave = () => {
    onSaveStages(editableStages);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-3xl overflow-hidden bg-[#1e0a1f] border border-amber-400/40 shadow-royal"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-amber-300/20 flex items-center justify-between bg-[#2a0e2a]">
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-300" />
                Customize Questions for Doctor Aisha
              </h3>
              <p className="text-xs text-pink-200/70 font-sans">
                Easily personalize question text, shayari, and answer options
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Stage Selector Sidebar */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto p-2 space-y-1 bg-[#160617]">
              {editableStages.map((st, idx) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans transition-all flex items-center justify-between cursor-pointer ${
                    selectedStageIndex === idx
                      ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                      : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">
                    {st.stageNumber}. {st.themeTitle}
                  </span>
                  <span className="text-sm shrink-0 ml-1">{st.surprise.symbol}</span>
                </button>
              ))}
            </div>

            {/* Stage Editing Form */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-cinzel text-amber-300 uppercase tracking-wider mb-1">
                  Theme Title (Stage {currentStage.stageNumber})
                </label>
                <input
                  type="text"
                  value={currentStage.themeTitle}
                  onChange={(e) => handleUpdateCurrentStage('themeTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 text-white font-serif text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-amber-300 uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <textarea
                  rows={2}
                  value={currentStage.question}
                  onChange={(e) => handleUpdateCurrentStage('question', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 text-white font-serif text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-amber-300 uppercase tracking-wider mb-1">
                  Urdu / Hindi Shayari Couplet
                </label>
                <input
                  type="text"
                  value={currentStage.shayariOrQuote || ''}
                  onChange={(e) => handleUpdateCurrentStage('shayariOrQuote', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 text-amber-200 font-serif italic text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-xs font-cinzel text-amber-300 uppercase tracking-wider mb-2">
                  Answer Choices (4 Options)
                </label>
                <div className="space-y-2">
                  {currentStage.options.map((opt, optIdx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-white/10 text-amber-200 text-xs font-cinzel flex items-center justify-center font-bold">
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-stone-200 text-xs sm:text-sm font-sans focus:outline-none focus:border-amber-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Complimentary Reaction */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-cinzel text-amber-300 uppercase tracking-wider mb-1">
                  Complimentary Reaction Message
                </label>
                <textarea
                  rows={2}
                  value={currentStage.complimentResponse.message}
                  onChange={(e) => {
                    const updated = {
                      ...currentStage.complimentResponse,
                      message: e.target.value,
                    };
                    handleUpdateCurrentStage('complimentResponse', updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 text-stone-200 font-sans text-xs focus:outline-none focus:border-amber-300"
                />
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-amber-300/20 bg-[#160617] flex items-center justify-between">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-4 py-2 rounded-full border border-stone-600 hover:border-stone-400 text-stone-300 text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-stone-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-serif font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
