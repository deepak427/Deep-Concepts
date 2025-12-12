import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  quality: 'high' | 'medium' | 'low';
}

/**
 * Hook to monitor and adapt to device performance
 * Automatically adjusts quality settings based on FPS
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    quality: 'high',
  });

  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let animationFrameId: number;
    let fpsHistory: number[] = [];

    const measureFPS = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / delta);
        fpsHistory.push(currentFPS);

        // Keep only last 5 measurements
        if (fpsHistory.length > 5) {
          fpsHistory.shift();
        }

        // Calculate average FPS
        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;

        // Determine quality level
        let quality: 'high' | 'medium' | 'low' = 'high';
        if (avgFPS < 30) {
          quality = 'low';
        } else if (avgFPS < 45) {
          quality = 'medium';
        }

        // Get memory usage if available
        let memory: number | undefined;
        if ('memory' in performance) {
          // @ts-ignore - Chrome-specific API
          memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
        }

        setMetrics({
          fps: Math.round(avgFPS),
          memory,
          quality,
        });

        setFrameCount(0);
        setLastTime(currentTime);
      } else {
        setFrameCount((prev) => prev + 1);
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [frameCount, lastTime]);

  const isLowPerformance = useCallback(() => {
    return metrics.quality === 'low';
  }, [metrics.quality]);

  const shouldReduceEffects = useCallback(() => {
    return metrics.quality !== 'high';
  }, [metrics.quality]);

  return {
    ...metrics,
    isLowPerformance,
    shouldReduceEffects,
  };
}

/**
 * Hook to detect if device is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const smallScreen = window.innerWidth < 768;
      setIsMobile(mobile || smallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to detect network speed
 */
export function useNetworkSpeed() {
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('fast');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType;

      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setSpeed('slow');
      } else if (effectiveType === '3g') {
        setSpeed('medium');
      } else {
        setSpeed('fast');
      }

      const handleChange = () => {
        const type = connection.effectiveType;
        if (type === 'slow-2g' || type === '2g') {
          setSpeed('slow');
        } else if (type === '3g') {
          setSpeed('medium');
        } else {
          setSpeed('fast');
        }
      };

      connection.addEventListener('change', handleChange);
      return () => connection.removeEventListener('change', handleChange);
    }
  }, []);

  return speed;
}
