import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock AudioContext
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: class {
    createOscillator() {
      return {
        connect: () => {},
        start: () => {},
        stop: () => {},
        frequency: { value: 0 },
        type: ''
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: {
          exponentialRampToValueAtTime: () => {}
        }
      };
    }
    get destination() { return {}; }
    get currentTime() { return 0; }
  }
});

// Mock Navigator Vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: () => true,
});