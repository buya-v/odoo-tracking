import { useCallback } from 'react';

export const useHaptic = () => {
  const triggerError = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); // Error pattern
    }
  }, []);

  const triggerSuccess = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Short success pulse
    }
  }, []);

  return { triggerError, triggerSuccess };
};