// Review card component for spaced repetition

import type { ReviewItem } from '@/types/learning';

interface ReviewCardProps {
  reviewItem: ReviewItem;
  onStart: (item: ReviewItem) => void;
}

export function ReviewCard({ reviewItem, onStart }: ReviewCardProps) {
  const reasonLabels = {
    'incorrect': 'Needs Review',
    'low-confidence': 'Build Confidence',
    'spaced-repetition': 'Refresh Memory'
  };

  const reasonColors = {
    'incorrect': 'bg-red-900/30 border-red-500 text-red-400',
    'low-confidence': 'bg-yellow-900/30 border-yellow-500 text-yellow-400',
    'spaced-repetition': 'bg-blue-900/30 border-blue-500 text-blue-400'
  };

  const priorityIcons = {
    1: '⭐',
    2: '⭐⭐',
    3: '⭐⭐⭐'
  };

  const daysUntilReview = Math.ceil(
    (new Date(reviewItem.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = daysUntilReview < 0;

  return (
    <div className="review-card bg-void-900 border-2 border-void-800 rounded-none p-4 hover:border-quantum-500 transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.5)] group">
      <div className="flex items-start justify-between mb-4 border-b border-void-800 pb-2">
        <div className="flex-1">
          <h3 className="font-display text-slate-200 mb-1 tracking-wide uppercase text-sm">
            {reviewItem.moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <p className="text-xs font-mono text-slate-500">
            &gt; CONCEPT: {reviewItem.conceptId}
          </p>
        </div>
        <span className="text-lg filter drop-shadow-md" title={`Priority: ${reviewItem.priority}`}>
          {priorityIcons[reviewItem.priority as keyof typeof priorityIcons] || '⭐'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${reasonColors[reviewItem.reason]}`}>
          {reasonLabels[reviewItem.reason]}
        </span>
        {isOverdue ? (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-red-900/30 border border-red-500 text-red-400 animate-pulse">
            ! OVERDUE !
          </span>
        ) : daysUntilReview === 0 ? (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-emerald-900/30 border border-emerald-500 text-emerald-400">
            DUE_TODAY
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            DUE: {daysUntilReview} DAY{daysUntilReview !== 1 ? 'S' : ''}
          </span>
        )}
      </div>

      <button
        onClick={() => onStart(reviewItem)}
        className="w-full bg-quantum-600 hover:bg-quantum-500 text-void-950 font-display uppercase tracking-wider py-2 px-4 rounded-none transition-colors border-2 border-quantum-400 shadow-[2px_2px_0_rgba(34,211,238,0.3)] active:translate-y-0.5 active:shadow-none text-xs"
      >
        Initialize_Review
      </button>
    </div>
  );
}
