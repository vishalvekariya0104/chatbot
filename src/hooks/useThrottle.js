import { useRef, useCallback } from 'react';

export function useThrottle(func, delay) {
  const timeoutRef = useRef(null);
  const lastArgsRef = useRef([]);
  const lastThisRef = useRef(null);

  const throttledFunction = useCallback(
    function (...args) {
      lastArgsRef.current = args;
      lastThisRef.current = this;

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          func.apply(lastThisRef.current, lastArgsRef.current);
          timeoutRef.current = null;
        }, delay);
      }
    },
    [func, delay]
  );

  return throttledFunction;
}