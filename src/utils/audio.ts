/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCustomAudio } from './audioStorage';

// Elegant Audio Manager supporting real uploaded MP3/Audio playback with Web Audio synth fallback

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;
  private ambientInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private currentTrackName: string = 'Raatein Bhi Kuchh Kehti Hain';
  private trackChangeListeners: Array<(trackName: string, isPlaying: boolean) => void> = [];

  constructor() {
    // Attempt to hydrate custom audio from storage on startup in browser
    if (typeof window !== 'undefined') {
      this.initSavedAudio();
    }
  }

  private async initSavedAudio() {
    try {
      const saved = await getCustomAudio();
      if (saved && saved.blob) {
        const objectUrl = URL.createObjectURL(saved.blob);
        this.setCustomAudioTrack(objectUrl, saved.name);
      } else {
        // Check if a default file exists in public/
        fetch('/background_music.mp3', { method: 'HEAD' })
          .then((res) => {
            if (res.ok) {
              this.setCustomAudioTrack('/background_music.mp3', 'Romantic Special Track');
            }
          })
          .catch(() => {
            // Synth fallback
          });
      }
    } catch {
      // Synth fallback
    }
  }

  public subscribeTrackChange(listener: (trackName: string, isPlaying: boolean) => void) {
    this.trackChangeListeners.push(listener);
    listener(this.currentTrackName, this.isMusicPlaying());
    return () => {
      this.trackChangeListeners = this.trackChangeListeners.filter((l) => l !== listener);
    };
  }

  private notifyTrackChange() {
    const playing = this.isMusicPlaying();
    this.trackChangeListeners.forEach((l) => l(this.currentTrackName, playing));
  }

  public setCustomAudioTrack(src: string, trackName?: string) {
    if (!this.bgAudio) {
      this.bgAudio = new Audio();
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
    }
    this.bgAudio.src = src;
    this.bgAudio.volume = this.isMuted ? 0 : 0.65;
    if (trackName) {
      this.currentTrackName = trackName;
    }
    this.stopAmbientMusic(); // Stop synth so uploaded audio plays cleanly
    this.notifyTrackChange();
  }

  public getTrackName(): string {
    return this.currentTrackName;
  }

  public isMusicPlaying(): boolean {
    if (this.bgAudio && !this.bgAudio.paused) return true;
    return this.isAmbientPlaying;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
    }
    if (this.bgAudio) {
      this.bgAudio.volume = this.isMuted ? 0 : 0.65;
      if (!this.isMuted && this.bgAudio.paused) {
        this.bgAudio.play().catch(() => {});
      }
    } else {
      if (!this.isMuted && !this.isAmbientPlaying) {
        this.startAmbientMusic();
      }
    }
    this.notifyTrackChange();
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play a soft bell/chime note
  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 1.2, delay: number = 0, volume: number = 0.2) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }

  // Sound: Wax Seal Crack & Open
  public playSealCrack() {
    this.playTone(280, 'triangle', 0.35, 0, 0.25);
    this.playTone(420, 'sine', 0.5, 0.08, 0.2);
    this.playTone(560, 'sine', 0.8, 0.15, 0.15);
  }

  // Sound: Envelope Opening Glissando / Whoosh
  public playEnvelopeOpen() {
    const scale = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    scale.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 1.0, idx * 0.07, 0.15);
    });
  }

  // Sound: Option Select
  public playOptionClick() {
    this.playTone(659.25, 'triangle', 0.4, 0, 0.15);
    this.playTone(783.99, 'sine', 0.6, 0.06, 0.15);
  }

  // Sound: Royal Celebration / Correct Answer
  public playCelebrationChimes() {
    // Raag Yaman / Bhupali style celebratory sequence
    const notes = [
      440, 493.88, 554.37, 659.25, 739.99, 880, 987.77, 1108.73
    ];
    notes.forEach((f, i) => {
      this.playTone(f, 'sine', 1.4, i * 0.09, 0.2);
      if (i % 2 === 0) {
        this.playTone(f * 1.5, 'triangle', 1.0, i * 0.09 + 0.03, 0.08);
      }
    });
  }

  // Sound: Butterfly Flutter / Fairy Sparkle
  public playSparkle() {
    const sparkles = [1200, 1400, 1600, 1900, 2200];
    sparkles.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.4, idx * 0.05, 0.08);
    });
  }

  // Sound: Playful Buzzer / Dodging button sound
  public playPlayfulBuzzer() {
    this.playTone(320, 'sawtooth', 0.5, 0, 0.08);
    this.playTone(280, 'sine', 0.6, 0.08, 0.12);
  }

  // Sound: Grand Finale Birthday Fanfare
  public playGrandFinale() {
    const chords = [
      [523.25, 659.25, 783.99], // C
      [587.33, 739.99, 880.00], // D
      [659.25, 830.61, 987.77], // E
      [783.99, 987.77, 1174.66, 1318.51], // G - High celebration
    ];
    chords.forEach((chord, step) => {
      chord.forEach((freq) => {
        this.playTone(freq, 'sine', 2.0, step * 0.35, 0.22);
        this.playTone(freq * 0.5, 'triangle', 2.2, step * 0.35, 0.15);
      });
    });
  }

  // Play background music (either custom HTML5 audio or romantic melodic synth)
  public startAmbientMusic() {
    if (this.bgAudio && this.bgAudio.src) {
      this.bgAudio.volume = this.isMuted ? 0 : 0.65;
      this.bgAudio.play().catch(() => {});
      this.notifyTrackChange();
      return;
    }

    if (this.isAmbientPlaying) return;
    this.initContext();
    this.isAmbientPlaying = true;

    // Romantic acoustic melody: Raatein Bhi Kuchh Kehti Hain & Saahiba motif
    // Notes: D4, F#4, A4, B4, C#5, D5 (293.66, 369.99, 440.0, 493.88, 554.37, 587.33)
    const melodyPhrase = [
      { f: 293.66, dur: 1.8 }, // D4 - Raa
      { f: 369.99, dur: 1.8 }, // F#4 - tein
      { f: 440.00, dur: 2.2 }, // A4 - bhi
      { f: 493.88, dur: 1.6 }, // B4 - kuchh
      { f: 440.00, dur: 1.8 }, // A4 - keh
      { f: 369.99, dur: 2.4 }, // F#4 - ti
      { f: 329.63, dur: 2.5 }, // E4 - hain
      { f: 293.66, dur: 1.8 }, // D4 - jab
      { f: 369.99, dur: 1.8 }, // F#4 - te
      { f: 440.00, dur: 2.2 }, // A4 - ri
      { f: 493.88, dur: 2.0 }, // B4 - yaad
      { f: 554.37, dur: 2.5 }, // C#5 - aa
      { f: 493.88, dur: 1.8 }, // B4 - ti
      { f: 440.00, dur: 2.8 }, // A4 - hai
      { f: 369.99, dur: 2.2 }, // F#4 - Tu mera sukoon
      { f: 440.00, dur: 2.2 }, // A4
      { f: 493.88, dur: 2.4 }, // B4 - tu mera pyaar
      { f: 587.33, dur: 3.2 }, // D5
      { f: 554.37, dur: 2.2 }, // C#5
      { f: 493.88, dur: 2.0 }, // B4
      { f: 440.00, dur: 2.4 }, // A4
      { f: 369.99, dur: 2.8 }, // F#4 - aakhri ikraar
    ];

    let noteIndex = 0;
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

      const note = melodyPhrase[noteIndex % melodyPhrase.length];
      
      // Warm, expressive flute tone
      this.playTone(note.f, 'sine', note.dur, 0, 0.12);
      // Gentle cello/drone warmth an octave below
      if (noteIndex % 2 === 0) {
        this.playTone(note.f * 0.5, 'triangle', note.dur * 1.2, 0.05, 0.06);
      }
      // Delicate harp shimmer on top
      if (noteIndex % 3 === 0) {
        this.playTone(note.f * 1.5, 'sine', 1.0, 0.18, 0.03);
      }

      noteIndex = (noteIndex + 1) % melodyPhrase.length;
    }, 1100);

    this.notifyTrackChange();
  }

  public stopAmbientMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.isAmbientPlaying = false;
    this.notifyTrackChange();
  }
}

export const soundEffects = new AudioManager();
