// Utility to handle Haptic and Audio feedback as per Requirement 3
export const triggerFeedback = (type: 'success' | 'error' | 'warning') => {
  if (typeof window !== 'undefined' && window.navigator) {
    // Haptic Feedback
    if (type === 'error' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]); // 3 short vibrations
    } else if (type === 'success' && navigator.vibrate) {
      navigator.vibrate(50); // Single short blip
    }
  }

  // Audio Feedback (Simulated with Web Audio API for browser compatibility)
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.value = 800; // High pitch beep
      osc.type = 'sine';
    } else if (type === 'error') {
      osc.frequency.value = 150; // Low pitch error buzz
      osc.type = 'sawtooth';
    } else {
      osc.frequency.value = 400; // Warning
      osc.type = 'square';
    }

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  }
};