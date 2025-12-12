// Mastery level calculation

import type { ModuleProgress, ConfidenceRating } from '@/types/learning';

export interface MasteryWeights {
  interactionsCompleted: number;
  quizAccuracy: number;
  confidenceAccuracy: number;
  selfRating: number;
}

export const DEFAULT_WEIGHTS: MasteryWeights = {
  interactionsCompleted: 0.4,  // 40%
  quizAccuracy: 0.3,            // 30%
  confidenceAccuracy: 0.2,      // 20%
  selfRating: 0.1               // 10%
};

export function calculateConfidenceAccuracy(ratings: ConfidenceRating[]): number {
  if (ratings.length === 0) return 0;
  
  let accurateCount = 0;
  
  for (const rating of ratings) {
    const isAccurate = 
      (rating.level === 'high' && rating.wasCorrect) ||
      (rating.level === 'low' && !rating.wasCorrect) ||
      (rating.level === 'medium');
    
    if (isAccurate) accurateCount++;
  }
  
  return (accurateCount / ratings.length) * 100;
}

export function calculateMastery(
  moduleData: ModuleProgress,
  totalInteractions: number,
  weights: MasteryWeights = DEFAULT_WEIGHTS
): number {
  // Interaction completion score
  const interactionScore = totalInteractions > 0
    ? (moduleData.interactionsCompleted.length / totalInteractions) * 100
    : 0;
  
  // Quiz accuracy score
  const totalQuestions = moduleData.quizResults.length;
  const correctAnswers = moduleData.quizResults.filter(r => r.correct).length;
  const quizScore = totalQuestions > 0
    ? (correctAnswers / totalQuestions) * 100
    : 0;
  
  // Confidence accuracy score
  const confidenceScore = calculateConfidenceAccuracy(moduleData.confidenceRatings);
  
  // Self-rating score
  const selfRatingScore = (moduleData.selfRating / 5) * 100;
  
  // Calculate weighted mastery
  const mastery = 
    interactionScore * weights.interactionsCompleted +
    quizScore * weights.quizAccuracy +
    confidenceScore * weights.confidenceAccuracy +
    selfRatingScore * weights.selfRating;
  
  // Clamp to [0, 100]
  return Math.max(0, Math.min(100, mastery));
}

export function isModuleComplete(
  moduleData: ModuleProgress,
  requiredInteractions: string[]
): boolean {
  const hasAllInteractions = requiredInteractions.every(
    id => moduleData.interactionsCompleted.includes(id)
  );
  
  // Lowered threshold from 70% to 50% for better UX
  return hasAllInteractions && moduleData.masteryLevel >= 50;
}
