import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to optimize touch interactions for mobile devices
 * Prevents default touch behaviors that can interfere with custom interactions
 */
export function useTouchOptimized(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Prevent default touch behaviors for better custom interactions
    const handleTouchStart = (e: TouchEvent) => {
      // Allow single touch for interaction
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling during interaction
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };

    // Use passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [elementRef]);
}

/**
 * Hook for enhanced touch gestures (swipe, pinch, etc.)
 */
export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onPinch?: (scale: number) => void;
    onTap?: () => void;
    onDoubleTap?: () => void;
  }
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Detect swipe (minimum 50px movement, max 300ms)
      if (deltaTime < 300 && (absX > 50 || absY > 50)) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && callbacks.onSwipeRight) {
            callbacks.onSwipeRight();
          } else if (deltaX < 0 && callbacks.onSwipeLeft) {
            callbacks.onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && callbacks.onSwipeDown) {
            callbacks.onSwipeDown();
          } else if (deltaY < 0 && callbacks.onSwipeUp) {
            callbacks.onSwipeUp();
          }
        }
      }
      // Detect tap (small movement, quick)
      else if (absX < 10 && absY < 10 && deltaTime < 300) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        // Double tap detection (within 300ms)
        if (timeSinceLastTap < 300 && callbacks.onDoubleTap) {
          callbacks.onDoubleTap();
          lastTapRef.current = 0; // Reset to prevent triple tap
        } else {
          if (callbacks.onTap) {
            callbacks.onTap();
          }
          lastTapRef.current = now;
        }
      }

      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, callbacks]);
}

/**
 * Detect if device is touch-capable
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy property
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get optimal touch target size (minimum 44x44px for accessibility)
 */
export function getTouchTargetSize(baseSize: number): number {
  const MIN_TOUCH_SIZE = 44;
  return isTouchDevice() ? Math.max(baseSize, MIN_TOUCH_SIZE) : baseSize;
}
