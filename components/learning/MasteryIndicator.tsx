// Mastery level indicator component

interface MasteryIndicatorProps {
  masteryLevel: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function MasteryIndicator({
  masteryLevel,
  size = 'medium',
  showLabel = true
}: MasteryIndicatorProps) {
  const clampedMastery = Math.max(0, Math.min(100, masteryLevel));

  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-24 h-24 text-base'
  };

  const getColor = (mastery: number) => {
    if (mastery >= 90) return 'text-emerald-400';
    if (mastery >= 70) return 'text-quantum-400';
    if (mastery >= 50) return 'text-yellow-400';
    return 'text-slate-500';
  };

  const getStrokeColor = (mastery: number) => {
    if (mastery >= 90) return '#34d399'; // emerald-400
    if (mastery >= 70) return '#22d3ee'; // quantum-400 (cyan-400)
    if (mastery >= 50) return '#facc15'; // yellow-400
    return '#475569'; // slate-600
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedMastery / 100) * circumference;

  return (
    <div className="mastery-indicator flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} drop-shadow-md`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="#020617"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getStrokeColor(clampedMastery)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold ${getColor(clampedMastery)}`}>
            {Math.round(clampedMastery)}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          {clampedMastery >= 70 ? 'STATUS: MASTERED' : 'STATUS: LEARNING'}
        </span>
      )}
    </div>
  );
}
