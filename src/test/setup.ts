import '@testing-library/jest-dom';

// Mock navigator.vibrate for tests
Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn(() => true),
  writable: true,
});