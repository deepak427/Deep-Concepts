// Level up modal with celebration animation

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelTitle } from '@/lib/xpSystem';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useParticles } from '@/lib/useParticles';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
  show: boolean;
}

export function LevelUpModal({ level, onClose, show }: LevelUpModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const title = getLevelTitle(level);
  const particles = useParticles();

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Trigger particle explosion at center
      particles.levelUpAtCenter();

      // Auto-close after 4 seconds (longer to enjoy animation)
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, reducedMotion ? 0 : 300);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void-950/80 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-energy-500 blur-2xl opacity-20 animate-pulse" />

            <div className="relative bg-void-900 p-8 max-w-md text-center border-4 border-quantum-500 shadow-[8px_8px_0_rgba(6,182,212,0.5)] overflow-hidden">
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 bg-repeat-y pointer-events-none" />

              {/* Background beams */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-full bg-gradient-to-b from-quantum-500/10 to-transparent pointer-events-none" />

              {/* Icon */}
              <motion.div
                className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center border-4 border-quantum-400 bg-void-950 shadow-[4px_4px_0_rgba(6,182,212,0.3)]"
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-12 h-12 text-quantum-400" />
                <Sparkles className="absolute top-0 right-0 w-8 h-8 text-yellow-400 animate-bounce" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-quantum-300 to-white mb-2 uppercase tracking-wide drop-shadow-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                LEVEL UP!
              </motion.h2>

              <div className="bg-void-950/80 p-6 border-2 border-void-800 mb-6 backdrop-blur-md relative z-10">
                <div className="text-5xl font-display font-bold text-white mb-1 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">{level}</div>
                <div className="text-quantum-400 font-display tracking-widest uppercase text-sm border-t-2 border-void-800 pt-2 mt-2">
                  &gt; {title}
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-quantum-600 text-void-950 font-display font-bold hover:bg-quantum-500 transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-[0px] active:shadow-none uppercase tracking-wider"
              >
                Claim Rewards
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
