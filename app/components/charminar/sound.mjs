// A quiet, explicitly illustrative sound bed; no recorded voices or archival audio.
export class BazaarSound {
  async start() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.context.destination);
      const buffer = this.context.createBuffer(1, this.context.sampleRate * 4, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < data.length; i++) {
        previous = (previous + (Math.random() * 2 - 1) * 0.025) / 1.025;
        data[i] = previous * 3;
      }
      this.wind = this.context.createBufferSource();
      this.wind.buffer = buffer;
      this.wind.loop = true;
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;
      this.wind.connect(filter).connect(this.master);
      this.wind.start();
    }
    await this.context.resume();
    this.master.gain.setTargetAtTime(0.13, this.context.currentTime, 0.4);
    return true;
  }

  pause() {
    if (this.context?.state === 'running') this.context.suspend().catch(() => {});
  }

  melody(kind = 'evening') {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    const notes = kind === 'courtyard' ? [392, 494, 587, 494, 440, 392] : [330, 392, 440, 392, 330, 294];
    notes.forEach((frequency, i) => {
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      const time = ctx.currentTime + i * .38;
      gain.gain.setValueAtTime(.001, time); gain.gain.linearRampToValueAtTime(.22, time + .04); gain.gain.exponentialRampToValueAtTime(.001, time + .35);
      oscillator.connect(gain).connect(this.master); oscillator.start(time); oscillator.stop(time + .4);
    });
  }

  cue(kind) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    if (kind === 'chai') {
      const source = ctx.createBufferSource();
      source.buffer = this.wind.buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      source.connect(filter).connect(gain).connect(this.master);
      source.start();
      source.stop(ctx.currentTime + 2.1);
      return;
    }
    [0, 0.14, 0.34].forEach((offset, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = (kind === 'bangles' ? 1800 : 600) * [1, 1.25, 1.5][i];
      gain.gain.setValueAtTime(0.15, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.5);
      oscillator.connect(gain).connect(this.master);
      oscillator.start(ctx.currentTime + offset);
      oscillator.stop(ctx.currentTime + offset + 0.6);
    });
  }

  tumblerClick() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  lockUnlocked() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    // Harmonic brass chime
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
      osc.connect(gain).connect(this.master);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
    });
  }

  radioTuning(freq) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    // Static noise with pitch modulating based on proximity to 880 kHz
    const dist = Math.abs(freq - 880);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300 + Math.min(600, dist * 4), ctx.currentTime);
    const vol = dist < 20 ? 0.08 : 0.03;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  boxVictory() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    // Triumphant Deccani royal fanfare
    const notes = [
      { f: 392.00, d: 0.18 }, // G4
      { f: 523.25, d: 0.18 }, // C5
      { f: 659.25, d: 0.18 }, // E5
      { f: 783.99, d: 0.28 }, // G5
      { f: 659.25, d: 0.18 }, // E5
      { f: 1046.50, d: 0.8 }, // C6
    ];
    let time = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);
      osc.connect(gain).connect(this.master);
      osc.start(time);
      osc.stop(time + n.d + 0.05);
      time += n.d * 0.8;
    });
  }

  dispose() {
    this.wind?.stop();
    this.context?.close().catch(() => {});
    this.context = null;
  }
}
