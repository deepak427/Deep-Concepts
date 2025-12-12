import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X } from 'lucide-react';
import { usePerformance } from '@/lib/usePerformance';
import { ParticleEngine } from '@/lib/particleEngine';

/**
 * Performance debugging overlay
 * Shows FPS, particle count, memory usage, and quality level
 * Only visible in development or when explicitly enabled
 */
export function PerformanceDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const performance = usePerformance();
  const [particleCount, setParticleCount] = useState(0);
  const [particleFPS, setParticleFPS] = useState(60);
  const [particleQuality, setParticleQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Update particle stats every second
    const interval = setInterval(() => {
      setParticleCount(ParticleEngine.getParticleCount());
      setParticleFPS(ParticleEngine.getFPS());
      setParticleQuality(ParticleEngine.getQualityLevel());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityColor = (quality: string) => {
    if (quality === 'high') return 'text-green-400';
    if (quality === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5 text-cyan-400" />
      </button>

      {/* Performance overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl p-4 min-w-[280px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold">Performance</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="space-y-3 text-sm">
              {/* Overall FPS */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">FPS:</span>
                <span className={`font-mono font-bold ${getFPSColor(performance.fps)}`}>
                  {performance.fps}
                </span>
              </div>

              {/* Quality Level */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Quality:</span>
                <span className={`font-semibold uppercase ${getQualityColor(performance.quality)}`}>
                  {performance.quality}
                </span>
              </div>

              {/* Memory (if available) */}
              {performance.memory !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Memory:</span>
                  <span className="text-white font-mono">{performance.memory} MB</span>
                </div>
              )}

              <div className="border-t border-slate-700 pt-3 mt-3">
                <p className="text-slate-500 text-xs mb-2">Particle System</p>

                {/* Particle Count */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Particles:</span>
                  <span className="text-white font-mono">{particleCount}</span>
                </div>

                {/* Particle FPS */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-400">Particle FPS:</span>
                  <span className={`font-mono font-bold ${getFPSColor(particleFPS)}`}>
                    {particleFPS}
                  </span>
                </div>

                {/* Particle Quality */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-400">Particle Quality:</span>
                  <span className={`font-semibold uppercase text-xs ${getQualityColor(particleQuality)}`}>
                    {particleQuality}
                  </span>
                </div>
              </div>

              {/* Performance tips */}
              {performance.quality !== 'high' && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
                  ⚠️ Performance mode active. Effects reduced for better FPS.
                </div>
              )}
            </div>

            {/* Keyboard shortcut hint */}
            <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-slate-500 text-center">
              Press <kbd className="px-1 py-0.5 bg-slate-800 rounded">Ctrl+Shift+P</kbd> to toggle
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
