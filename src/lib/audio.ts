class AudioFeedback {
  private context: AudioContext | null = null;

  constructor() {
    // Initialize on first user interaction typically, but here we setup structure
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    }
  }

  private playTone(frequency: number, type: OscillatorType, duration: number) {
    if (!this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.context.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playSuccess() {
    this.playTone(1200, 'sine', 0.1);
    setTimeout(() => this.playTone(1800, 'sine', 0.1), 100);
  }

  playError() {
    this.playTone(200, 'sawtooth', 0.3);
  }

  playWarning() {
    this.playTone(600, 'triangle', 0.2);
  }
}

export const audioFeedback = new AudioFeedback();