// Review session component for spaced repetition

import { useState, useEffect } from 'react';
import { useLearningStore } from '@/lib/learningState';
import { getReviewsDue, sortReviewQueue } from '@/lib/reviewScheduler';
import { Quiz, type QuizQuestion } from './Quiz';
import { ReviewCard } from './ReviewCard';
import type { ReviewItem } from '@/types/learning';
import { MODULES } from '@/constants';
import { CheckCircle, BookOpen } from 'lucide-react';

interface ReviewSessionProps {
  onComplete?: () => void;
}

export function ReviewSession({ onComplete }: ReviewSessionProps) {
  const { reviewQueue, modules } = useLearningStore();
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number | null>(null);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);

  // Get reviews that are due
  const dueReviews = getReviewsDue(reviewQueue);
  const sortedReviews = sortReviewQueue(dueReviews);

  // Filter out completed reviews
  const remainingReviews = sortedReviews.filter(
    review => !completedReviews.includes(`${review.moduleId}-${review.conceptId}`)
  );

  const currentReview = currentReviewIndex !== null ? remainingReviews[currentReviewIndex] : null;

  const handleStartReview = (item: ReviewItem) => {
    const index = remainingReviews.findIndex(
      r => r.moduleId === item.moduleId && r.conceptId === item.conceptId
    );
    setCurrentReviewIndex(index);
  };

  const handleReviewComplete = () => {
    if (currentReview) {
      setCompletedReviews(prev => [
        ...prev,
        `${currentReview.moduleId}-${currentReview.conceptId}`
      ]);
    }

    // Move to next review or complete session
    if (currentReviewIndex !== null && currentReviewIndex < remainingReviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setCurrentReviewIndex(null);
    }
  };

  // Generate quiz questions from review item
  const getReviewQuestions = (review: ReviewItem): QuizQuestion[] => {
    const module = MODULES.find(m => m.id === review.moduleId);
    if (!module || !module.quiz) {
      return [];
    }

    // Convert module quiz to QuizQuestion format
    return [{
      id: review.conceptId,
      question: module.quiz.question,
      options: module.quiz.options.map(opt => opt.text),
      correctAnswer: module.quiz.options.findIndex(opt => opt.isCorrect),
      explanation: module.quiz.options.find(opt => opt.isCorrect)?.explanation || '',
      requiresConfidence: true
    }];
  };

  // If no reviews due
  if (remainingReviews.length === 0 && completedReviews.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-void-900 border-2 border-void-800 rounded-none p-8 text-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display text-emerald-400 mb-2 uppercase tracking-wide">
            All Caught Up!
          </h2>
          <p className="text-slate-400 font-mono text-sm mb-8 bg-void-950 p-4 border border-void-700">
            &gt; SYSTEM_STATUS: QUEUE_EMPTY // EXCELLENT_WORK
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-quantum-600 hover:bg-quantum-500 text-void-950 font-display uppercase tracking-wider rounded-none transition-colors border-2 border-quantum-400 shadow-[4px_4px_0_rgba(34,211,238,0.3)]"
          >
            Return_Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If session complete
  if (remainingReviews.length === 0 && completedReviews.length > 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-void-900 border-2 border-void-800 rounded-none p-8 text-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display text-emerald-400 mb-2 uppercase tracking-wide">
            Session_Complete!
          </h2>
          <div className="bg-void-950 p-4 border border-void-700 mb-8 font-mono text-sm">
            <p className="text-slate-300 mb-2">
              &gt; PROCESSED: {completedReviews.length} concept{completedReviews.length !== 1 ? 's' : ''}
            </p>
            <p className="text-slate-500">
              &gt; STATUS: KNOWLEDGE_REINFORCED
            </p>
          </div>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-quantum-600 hover:bg-quantum-500 text-void-950 font-display uppercase tracking-wider rounded-none transition-colors border-2 border-quantum-400 shadow-[4px_4px_0_rgba(34,211,238,0.3)]"
          >
            Return_Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If currently reviewing
  if (currentReview) {
    const questions = getReviewQuestions(currentReview);

    if (questions.length === 0) {
      // Skip if no questions available
      handleReviewComplete();
      return null;
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentReviewIndex(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Review List
          </button>
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Review {completedReviews.length + 1} of {sortedReviews.length}
          </p>
        </div>

        <Quiz
          moduleId={currentReview.moduleId}
          questions={questions}
          onComplete={handleReviewComplete}
          isReviewMode={true}
          reviewConceptId={currentReview.conceptId}
        />
      </div>
    );
  }

  // Show review list
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 border-b-2 border-void-800 pb-4">
        <h1 className="text-3xl font-display text-slate-200 mb-2 uppercase tracking-wide text-shadow-sm">Review Session</h1>
        <p className="font-mono text-slate-500 text-sm">
          &gt; QUEUE_STATUS: {remainingReviews.length} concept{remainingReviews.length !== 1 ? 's' : ''} pending
        </p>
      </div>

      {completedReviews.length > 0 && (
        <div className="mb-6 px-4 py-3 bg-emerald-900/20 border-2 border-emerald-500/50 rounded-none relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />
          <p className="text-emerald-400 font-mono text-sm relative z-10">
            &gt; SESSION_LOG: {completedReviews.length} review{completedReviews.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {remainingReviews.map((review, index) => (
          <ReviewCard
            key={`${review.moduleId}-${review.conceptId}`}
            reviewItem={review}
            onStart={handleStartReview}
          />
        ))}
      </div>

      {completedReviews.length > 0 && (
        <div className="mt-8 text-center border-t-2 border-void-800 pt-6">
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-void-800 hover:bg-void-700 text-slate-300 font-display uppercase tracking-wider rounded-none transition-colors border-2 border-slate-600 shadow-[4px_4px_0_rgba(148,163,184,0.2)]"
          >
            Terminate_Session
          </button>
        </div>
      )}
    </div>
  );
}
