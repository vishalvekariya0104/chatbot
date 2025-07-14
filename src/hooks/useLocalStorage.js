import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;

    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const valueToStore = JSON.stringify(storedValue);
        window.localStorage.setItem(key, valueToStore);
      }
    } catch (error) {
      console.error("Failed to write to localStorage:", key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
