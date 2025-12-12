// Spaced repetition review scheduling

import type { ReviewItem, ModuleProgress } from '@/types/learning';

export const SPACED_REPETITION_INTERVALS = {
  FIRST_REVIEW: 1,      // 1 day
  SECOND_REVIEW: 3,     // 3 days
  THIRD_REVIEW: 7,      // 7 days
  FOURTH_REVIEW: 14,    // 14 days
  FIFTH_REVIEW: 30      // 30 days
} as const;

export function shouldScheduleReview(
  moduleData: ModuleProgress,
  currentDate: Date = new Date()
): boolean {
  if (!moduleData.completed) return false;
  
  const daysSinceLastVisit = Math.floor(
    (currentDate.getTime() - new Date(moduleData.lastVisited).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastVisit >= SPACED_REPETITION_INTERVALS.FIRST_REVIEW;
}

export function createReviewItem(
  moduleId: string,
  conceptId: string,
  reason: ReviewItem['reason'],
  priority: number = 1
): ReviewItem {
  const nextReviewDate = new Date();
  
  // Set next review date based on reason
  if (reason === 'incorrect' || reason === 'low-confidence') {
    nextReviewDate.setDate(nextReviewDate.getDate() + 1);
  } else if (reason === 'spaced-repetition') {
    nextReviewDate.setDate(nextReviewDate.getDate() + SPACED_REPETITION_INTERVALS.FIRST_REVIEW);
  }
  
  return {
    moduleId,
    conceptId,
    reason,
    priority,
    nextReviewDate
  };
}

export function sortReviewQueue(queue: ReviewItem[]): ReviewItem[] {
  return [...queue].sort((a, b) => {
    // First sort by priority (higher first)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    
    // Then by next review date (earlier first)
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
  });
}

export function getReviewsDue(
  queue: ReviewItem[],
  currentDate: Date = new Date()
): ReviewItem[] {
  return queue.filter(item => 
    new Date(item.nextReviewDate).getTime() <= currentDate.getTime()
  );
}
