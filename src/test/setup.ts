import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock navigator.vibrate since it's not in JSDOM
Object.defineProperty(navigator, 'vibrate', {
  value: (pattern: number | number[]) => {
    return true;
  },
  writable: true,
});