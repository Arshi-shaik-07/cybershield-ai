// Web Audio API Synthesizer - Solid High-Impact Cybersecurity Audio Engine

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(enabled) {
    this.enabled = enabled;
  }

  // SOLID, POWERFUL CYBER INTRUSION ALARM (Dual-oscillator + sub-bass + dual-pulse klaxon)
  playAlarmAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Pulse 1 at t=0, Pulse 2 at t=0.22s
      [0, 0.22].forEach((offset) => {
        const t = now + offset;

        // 1. Solid High Siren Oscillator (Sawtooth + Square hybrid for edge)
        const oscHigh = this.ctx.createOscillator();
        const gainHigh = this.ctx.createGain();
        oscHigh.type = 'sawtooth';
        oscHigh.frequency.setValueAtTime(960, t);
        oscHigh.frequency.exponentialRampToValueAtTime(580, t + 0.16);

        gainHigh.gain.setValueAtTime(0.25, t);
        gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.19);

        // 2. Heavy Sub-Bass Core for "Solid" physical punch
        const oscSub = this.ctx.createOscillator();
        const gainSub = this.ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(220, t);
        oscSub.frequency.exponentialRampToValueAtTime(110, t + 0.16);

        gainSub.gain.setValueAtTime(0.35, t);
        gainSub.gain.exponentialRampToValueAtTime(0.001, t + 0.19);

        // 3. Transient Attack Click (Punchy arrival thump)
        const oscClick = this.ctx.createOscillator();
        const gainClick = this.ctx.createGain();
        oscClick.type = 'triangle';
        oscClick.frequency.setValueAtTime(1400, t);
        oscClick.frequency.exponentialRampToValueAtTime(200, t + 0.04);

        gainClick.gain.setValueAtTime(0.2, t);
        gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        // Connect & play
        oscHigh.connect(gainHigh);
        oscSub.connect(gainSub);
        oscClick.connect(gainClick);

        gainHigh.connect(this.ctx.destination);
        gainSub.connect(this.ctx.destination);
        gainClick.connect(this.ctx.destination);

        oscHigh.start(t);
        oscSub.start(t);
        oscClick.start(t);

        oscHigh.stop(t + 0.2);
        oscSub.stop(t + 0.2);
        oscClick.stop(t + 0.05);
      });
    } catch (e) {
      // AudioContext error safe fallback
    }
  }

  playRadarPing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      // AudioContext safe fallback
    }
  }

  playBlockMinted() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) {
      // AudioContext safe fallback
    }
  }

  playKeyClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {
      // AudioContext safe fallback
    }
  }

  playContainmentSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - High C
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (e) {
      // AudioContext safe fallback
    }
  }
}

export const soundFX = new SoundFX();
