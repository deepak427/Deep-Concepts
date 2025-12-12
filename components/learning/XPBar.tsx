// XP progress bar with animated progress

import { useEffect, useState } from 'react';
import { useLearningStore } from '@/lib/learningState';
import { getLevelTitle, getNextLevelThreshold } from '@/lib/xpSystem';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function XPBar() {
  const { xp, level } = useLearningStore();
  const [displayXP, setDisplayXP] = useState(xp);
  const reducedMotion = useReducedMotion();

  const levelTitle = getLevelTitle(level);
  const nextThreshold = getNextLevelThreshold(level);
  const currentThreshold = level > 1 ? getNextLevelThreshold(level - 1) || 0 : 0;

  // Animate XP changes (or update instantly if reduced motion)
  useEffect(() => {
    if (displayXP !== xp) {
      if (reducedMotion) {
        setDisplayXP(xp);
        return;
      }

      const duration = 500;
      const steps = 30;
      const increment = (xp - displayXP) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayXP(xp);
          clearInterval(timer);
        } else {
          setDisplayXP(prev => prev + increment);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [xp, displayXP, reducedMotion]);

  const progress = nextThreshold
    ? ((displayXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  return (
    <div className="xp-bar w-full">
      <div className="flex justify-between items-end mb-2 font-display uppercase tracking-widest">
        <div>
          <span className="text-sm text-quantum-400">LVL {level}:</span>
          <span className="text-xs text-slate-500 ml-2">{levelTitle}</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          XP: {Math.floor(displayXP)}
          {nextThreshold && <span className="text-void-600"> / {nextThreshold}</span>}
        </span>
      </div>
      <div className="relative w-full h-4 bg-void-950 border-2 border-void-800 p-[2px]">
        <div
          className="h-full bg-gradient-to-r from-quantum-600 to-purple-600 relative overflow-hidden"
          style={{
            width: `${Math.min(progress, 100)}%`,
            transition: reducedMotion ? 'none' : 'all 500ms ease-out'
          }}
          role="progressbar"
          aria-valuenow={Math.floor(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP progress: ${Math.floor(progress)}% to level ${level + 1}`}
        >
          {/* Scanline effect on bar */}
          <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-30 bg-repeat-y bg-[length:100%_2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
      {nextThreshold && (
        <p className="text-[10px] font-mono text-slate-600 mt-1 text-right">
          &gt; {nextThreshold - Math.floor(displayXP)} XP_REQ_FOR_NEXT_LEVEL
        </p>
      )}
    </div>
  );
}
