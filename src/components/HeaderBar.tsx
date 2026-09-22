/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Crown, Compass, Edit3, Camera, Upload } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderBarProps {
  currentStage: number;
  totalStages: number;
  crownLevel: number;
  unlockedSurprisesCount: number;
  onOpenStageSelect: () => void;
  onOpenEditor: () => void;
  activeThemeColor?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentStage,
  totalStages,
  crownLevel,
  unlockedSurprisesCount,
  onOpenStageSelect,
  onOpenEditor,
  activeThemeColor = '#f472b6',
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getIsMuted());
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('aisha_profile_picture') || '/1000146035.jpg';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('aisha_profile_picture');
      if (saved) setProfilePic(saved);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAudioToggle = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEffects.playOptionClick();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProfilePic(result);
          try {
            localStorage.setItem('aisha_profile_picture', result);
          } catch (err) {
            console.error('Could not save profile picture to localStorage', err);
          }
          soundEffects.playOptionClick();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Crown progression indicator string
  const getCrownIndicator = () => {
    if (crownLevel >= 11) return '👑✨🦋💍🌷';
    if (crownLevel >= 8) return '👑✨🦋🌷';
    if (crownLevel >= 5) return '👑✨🦋';
    if (crownLevel >= 2) return '👑✨';
    return '👑';
  };

  const progressPercent = Math.min(100, Math.round((currentStage / totalStages) * 100));

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-[#120716]/85 backdrop-blur-md border-b border-amber-400/20 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Royal Profile Picture & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar Picture Circle (Click to change) */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change Dr. Aisha Habibi's photo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-300/80 shadow-[0_0_12px_rgba(251,191,36,0.35)] overflow-hidden bg-rose-950 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
              <img
                src={profilePic}
                alt="Dr. Aisha Habibi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-tr from-amber-500/40 to-rose-500/40 items-center justify-center font-serif text-amber-200 text-xs font-bold">
                AH
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <Camera className="w-4 h-4 text-amber-200 drop-shadow" />
              </div>
            </button>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border border-black/50 flex items-center justify-center text-[8px] pointer-events-none">
              ✨
            </span>
          </div>

          {/* Upload Button next to the picture circle */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/40 text-amber-200 text-[11px] font-sans font-medium transition-colors shadow-sm cursor-pointer"
            title="Upload photo for the circle"
          >
            <Camera className="w-3 h-3 text-amber-300" />
            <span className="hidden xs:inline">Upload Photo</span>
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-sm sm:text-base font-semibold tracking-wide text-amber-100">
                Dr. Aisha Habibi
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] tracking-wider uppercase font-cinzel rounded bg-amber-400/20 text-amber-300 border border-amber-300/30">
                Royal Birthday
              </span>
            </div>
            <div className="text-[11px] text-pink-200/70 font-sans flex items-center gap-1">
              <span>Lots and Loads of Love to my ButterscotchButterfly</span>
              <span>•</span>
              <span className="text-amber-300 font-medium">10 Questions + Royal Confession</span>
            </div>
          </div>
        </div>

        {/* Center: Crown Progression & Progress Status */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div
              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-300/40 text-xs font-semibold text-amber-200 flex items-center gap-1.5 shadow-sm"
              title="Princess Crown Progression"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="tracking-wider">{getCrownIndicator()}</span>
              <span className="text-[10px] text-amber-200/80 hidden md:inline">
                ({unlockedSurprisesCount} gifts unlocked)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 w-28 sm:w-40">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, #f472b6 0%, ${activeThemeColor} 50%, #fbbf24 100%)`,
                  boxShadow: '0 0 8px rgba(251,191,36,0.6)',
                }}
              />
            </div>
            <span className="text-[11px] font-cinzel text-amber-200 font-semibold whitespace-nowrap">
              {String(currentStage).padStart(2, '0')} / {totalStages}
            </span>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Ambient Music Toggle */}
          <button
            type="button"
            onClick={handleAudioToggle}
            className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center ${
              isMuted
                ? 'bg-white/5 border-white/20 text-stone-400 hover:text-white'
                : 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
            }`}
            title={isMuted ? 'Play Ambient Romantic Music' : 'Mute Music'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Jump to Stage / Map */}
          <button
            type="button"
            onClick={onOpenStageSelect}
            className="px-2 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 text-stone-200 hover:text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Explore Envelopes & Royal Confession"
          >
            <Compass className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Envelopes</span>
          </button>

          {/* Question Customizer */}
          <button
            type="button"
            onClick={onOpenEditor}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Personalize or Edit Questions"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
