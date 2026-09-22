/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Elegant Web Audio API synthesizer for ambient Indian romantic music & sound effects

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;
  private ambientInterval: number | null = null;
  private droneGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

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
    if (!this.isMuted && !this.isAmbientPlaying) {
      this.startAmbientMusic();
    }
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

  // Ambient gentle Indian Raag background arpeggio (Bansuri / Harp feeling)
  public startAmbientMusic() {
    if (this.isAmbientPlaying) return;
    this.initContext();
    this.isAmbientPlaying = true;

    // Peaceful meditative Raag scale (D, E, F#, A, B, D)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99];

    let noteIndex = 0;
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      
      const pitch = scale[noteIndex % scale.length];
      const harmony = scale[(noteIndex + 3) % scale.length];
      
      // Soft gentle flute tone
      this.playTone(pitch, 'sine', 2.2, 0, 0.08);
      if (noteIndex % 3 === 0) {
        this.playTone(harmony, 'triangle', 2.6, 0.15, 0.04);
      }
      
      noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % scale.length;
    }, 1400);
  }

  public stopAmbientMusic() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.isAmbientPlaying = false;
  }
}

export const soundEffects = new AudioManager();
