import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Respects both system preference and app-level override
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    // Check localStorage for user override
    const stored = localStorage.getItem('reducedMotion');
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    return false;
  });

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no user override exists
      const stored = localStorage.getItem('reducedMotion');
      if (stored === null) {
        setReducedMotion(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}

/**
 * Set user's reduced motion preference override
 */
export function setReducedMotionPreference(enabled: boolean): void {
  localStorage.setItem('reducedMotion', String(enabled));
  window.dispatchEvent(new Event('storage'));
}

/**
 * Clear user's reduced motion preference override
 */
export function clearReducedMotionPreference(): void {
  localStorage.removeItem('reducedMotion');
  window.dispatchEvent(new Event('storage'));
}
