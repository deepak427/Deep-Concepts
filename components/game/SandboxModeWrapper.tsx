import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import SandboxMode from './SandboxMode';

interface SandboxModeWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides sandbox mode toggle and ensures
 * progress is preserved when entering/exiting sandbox mode.
 */
export default function SandboxModeWrapper({ children }: SandboxModeWrapperProps) {
  const { 
    sandboxUnlocked, 
    inSandboxMode, 
    enterSandboxMode, 
    exitSandboxMode,
    xp,
    level,
    achievements
  } = useLearningStore();

  // Store progress snapshot when entering sandbox
  useEffect(() => {
    if (inSandboxMode) {
      // Store current progress in sessionStorage as backup
      sessionStorage.setItem('pre-sandbox-progress', JSON.stringify({
        xp,
        level,
        achievementCount: achievements.length
      }));
    }
  }, [inSandboxMode, xp, level, achievements.length]);

  // Verify progress is preserved when exiting
  useEffect(() => {
    if (!inSandboxMode) {
      const stored = sessionStorage.getItem('pre-sandbox-progress');
      if (stored) {
        const progress = JSON.parse(stored);
        
        // Verify progress hasn't changed (Property 83)
        if (progress.xp !== xp || progress.level !== level || progress.achievementCount !== achievements.length) {
          console.warn('Progress changed during sandbox mode - this should not happen');
        }
        
        sessionStorage.removeItem('pre-sandbox-progress');
      }
    }
  }, [inSandboxMode, xp, level, achievements.length]);

  if (inSandboxMode) {
    return <SandboxMode onExit={exitSandboxMode} />;
  }

  return (
    <>
      {children}
      
      {/* Sandbox Mode Toggle Button */}
      {sandboxUnlocked && (
        <motion.button
          onClick={enterSandboxMode}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-lg transition-all z-30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Quantum Playground</span>
        </motion.button>
      )}
      
      {/* Locked Sandbox Indicator (if not unlocked) */}
      {!sandboxUnlocked && (
        <motion.div
          className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gray-700/80 text-gray-300 rounded-full shadow-lg z-30 cursor-not-allowed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="w-5 h-5" />
          <span className="font-semibold">Playground Locked</span>
        </motion.div>
      )}
    </>
  );
}
