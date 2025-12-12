// Achievement badge component

import type { Achievement } from '@/types/learning';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  unlocked?: boolean;
}

export function AchievementBadge({
  achievement,
  size = 'medium',
  showDetails = false,
  unlocked = true
}: AchievementBadgeProps) {
  const reducedMotion = useReducedMotion();

  const sizeClasses = {
    small: 'w-12 h-12 text-2xl',
    medium: 'w-16 h-16 text-3xl',
    large: 'w-24 h-24 text-5xl'
  };

  const categoryColors = {
    interaction: 'from-blue-400 to-blue-600',
    mastery: 'from-purple-400 to-purple-600',
    challenge: 'from-orange-400 to-orange-600',
    persistence: 'from-green-400 to-green-600'
  };

  return (
    <div className="achievement-badge flex flex-col items-center gap-2">
      <div
        className={`
          ${sizeClasses[size]} 
          flex items-center justify-center border-2
          ${unlocked
            ? `bg-gradient-to-br ${categoryColors[achievement.category]} shadow-[4px_4px_0_rgba(0,0,0,0.3)] border-white/20`
            : 'bg-void-900 border-void-800 opacity-50 text-void-700'
          }
          ${unlocked && !reducedMotion ? 'hover:scale-105 hover:-translate-y-1 transition-transform' : ''}
        `}
        style={{
          transition: reducedMotion ? 'none' : 'all 300ms'
        }}
        title={achievement.description}
        role="img"
        aria-label={`${achievement.title} achievement ${unlocked ? 'unlocked' : 'locked'}: ${achievement.description}`}
        tabIndex={0}
      >
        <span className={unlocked ? 'filter drop-shadow-md' : 'grayscale opacity-30'}>
          {achievement.icon}
        </span>
      </div>
      {showDetails && (
        <div className="text-center max-w-xs">
          <h4 className="text-xs font-display uppercase tracking-wider text-slate-300">
            {achievement.title}
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">
            &gt; {achievement.description}
          </p>
          {achievement.unlockedAt && (
            <p className="text-[10px] font-mono text-quantum-400 mt-1">
              UNLOCKED: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
