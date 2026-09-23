/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, Upload, Check, RotateCcw, X, Sparkles, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { saveCustomAudio, clearCustomAudio, getCustomAudio } from '../utils/audioStorage';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getIsMuted());
  const [currentTrack, setCurrentTrack] = useState(soundEffects.getTrackName());
  const [isPlaying, setIsPlaying] = useState(soundEffects.isMusicPlaying());
  const [isUploading, setIsUploading] = useState(false);
  const [hasCustomSong, setHasCustomSong] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = soundEffects.subscribeTrackChange((track, playing) => {
      setCurrentTrack(track);
      setIsPlaying(playing);
      setIsMuted(soundEffects.getIsMuted());
    });

    getCustomAudio().then((saved) => {
      if (saved) {
        setHasCustomSong(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    setIsPlaying(soundEffects.isMusicPlaying());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Save to IndexedDB for permanent browser persistence
      await saveCustomAudio(file, file.name);
      const objectUrl = URL.createObjectURL(file);
      soundEffects.setCustomAudioTrack(objectUrl, file.name);

      if (soundEffects.getIsMuted()) {
        soundEffects.toggleMute();
      } else {
        soundEffects.startAmbientMusic();
      }

      setHasCustomSong(true);
      setUploadSuccess(true);
      setIsPlaying(true);
      setIsMuted(false);

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save custom audio', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    await clearCustomAudio();
    setHasCustomSong(false);
    soundEffects.setCustomAudioTrack('', 'Raatein Bhi Kuchh Kehti Hain');
    soundEffects.startAmbientMusic();
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#250d23] via-[#1a081a] to-[#120513] border-2 border-amber-400/40 shadow-royal p-6 sm:p-8 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-rose-500/30 border border-amber-300/40 flex items-center justify-center shadow-md">
              <Music className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
                <span>Background Music</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-pink-200/70 font-sans">
                Dedicated soundtrack for Dr. Aisha Habibi
              </p>
            </div>
          </div>

          {/* Current Playing Track Box */}
          <div className="p-4 rounded-2xl bg-[#2e102b]/70 border border-pink-400/30 mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-cinzel text-amber-300 tracking-wider block">
                {isPlaying && !isMuted ? '✦ Now Playing ✦' : '✦ Audio Paused ✦'}
              </span>
              <p className="font-serif text-base sm:text-lg text-white font-semibold truncate mt-0.5">
                {currentTrack}
              </p>
              <p className="text-xs text-stone-300/80 font-sans mt-0.5">
                {hasCustomSong ? 'Custom uploaded audio track' : 'Romantic acoustic melody & flute'}
              </p>
            </div>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleTogglePlay}
              className={`p-3.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isMuted
                  ? 'bg-stone-800 border-stone-600 text-stone-400'
                  : 'bg-gradient-to-r from-amber-400 to-rose-400 border-amber-200 text-stone-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
              }`}
              title={isMuted ? 'Play Music' : 'Mute Music'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Upload Audio File Section */}
          <div className="p-5 rounded-2xl bg-amber-400/10 border-2 border-dashed border-amber-300/50 text-center mb-6 relative hover:border-amber-300 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Upload className="w-8 h-8 text-amber-300 mx-auto mb-2 animate-bounce" />

            <h4 className="font-serif text-base font-semibold text-amber-100 mb-1">
              Upload Your Song / Music File
            </h4>
            <p className="text-xs text-pink-200/80 font-sans max-w-xs mx-auto mb-4">
              Select your uploaded romantic song (MP3, M4A, WAV). It will play continuously and loop across all stages!
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 text-stone-950 font-serif font-bold text-sm shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Music className="w-4 h-4" />
              <span>{isUploading ? 'Loading Audio…' : 'Select Music File'}</span>
            </motion.button>

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs text-emerald-300 font-sans flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Your custom music is now playing in the background!</span>
              </motion.div>
            )}
          </div>

          {/* Footer controls & Reset */}
          <div className="flex items-center justify-between text-xs text-stone-300">
            {hasCustomSong ? (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1.5 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Romantic Theme</span>
              </button>
            ) : (
              <span className="text-amber-200/70 font-serif italic flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Romantic ambient melody active</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
