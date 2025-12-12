// Confidence rating component for quiz questions

import { useState } from 'react';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

interface ConfidenceRatingProps {
  onSelect: (level: ConfidenceLevel) => void;
  selected?: ConfidenceLevel;
  disabled?: boolean;
}

export function ConfidenceRating({ onSelect, selected, disabled = false }: ConfidenceRatingProps) {
  const [hoveredLevel, setHoveredLevel] = useState<ConfidenceLevel | null>(null);

  const levels: { value: ConfidenceLevel; label: string; emoji: string }[] = [
    { value: 'low', label: 'Low', emoji: '🤔' },
    { value: 'medium', label: 'Medium', emoji: '😊' },
    { value: 'high', label: 'High', emoji: '💪' }
  ];

  return (
    <div className="confidence-rating">
      <p className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">&gt; SELECT_CONFIDENCE_LEVEL:</p>
      <div className="flex gap-3">
        {levels.map(({ value, label, emoji }) => {
          const isSelected = selected === value;
          const isHovered = hoveredLevel === value;

          return (
            <button
              key={value}
              onClick={() => !disabled && onSelect(value)}
              onMouseEnter={() => setHoveredLevel(value)}
              onMouseLeave={() => setHoveredLevel(null)}
              disabled={disabled}
              className={`
                flex flex-col items-center gap-1 px-4 py-3 border-2 transition-all min-w-[100px]
                ${isSelected
                  ? 'border-quantum-400 bg-quantum-900/30 text-quantum-300 shadow-[4px_4px_0_rgba(34,211,238,0.2)]'
                  : 'border-void-700 bg-void-900 text-slate-500'
                }
                ${isHovered && !disabled ? 'translate-y-[-2px] shadow-[4px_4px_0_rgba(255,255,255,0.1)] border-slate-400 text-slate-300' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed border-void-800 bg-void-950 text-void-700' : 'cursor-pointer'}
              `}
              aria-label={`${label} confidence`}
              aria-pressed={isSelected}
            >
              <span className="text-2xl filter drop-shadow-md">{emoji}</span>
              <span className="text-xs font-display uppercase tracking-wider mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
