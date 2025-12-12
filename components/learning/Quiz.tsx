// Quiz component with confidence rating

import { useState } from 'react';
import { ConfidenceRating, type ConfidenceLevel } from './ConfidenceRating';
import { FeedbackMessage } from './FeedbackMessage';
import { useLearningStore } from '@/lib/learningState';
import { XP_REWARDS } from '@/lib/xpSystem';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useXPNotification } from '@/lib/xpContext';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  requiresConfidence?: boolean;
}

interface QuizProps {
  moduleId: string;
  questions: QuizQuestion[];
  onComplete?: () => void;
  isReviewMode?: boolean;
  reviewConceptId?: string;
}

export function Quiz({ moduleId, questions, onComplete, isReviewMode = false, reviewConceptId }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const reducedMotion = useReducedMotion();

  const { recordQuizResult, recordConfidenceRating, addXP, removeFromReviewQueue } = useLearningStore();
  const { showXPGain } = useXPNotification();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    // Check if confidence is required but not provided
    if (currentQuestion.requiresConfidence && confidenceLevel === null) {
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setShowFeedback(true);

    // Record quiz result
    recordQuizResult(moduleId, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      confidenceLevel: confidenceLevel || undefined,
      timestamp: new Date()
    });

    // Record confidence rating if provided
    if (confidenceLevel) {
      recordConfidenceRating(moduleId, {
        questionId: currentQuestion.id,
        level: confidenceLevel,
        wasCorrect: isCorrect
      });
    }

    // Award XP
    let xpAmount = isCorrect ? XP_REWARDS.QUIZ_CORRECT : 0;

    // Bonus XP for perfect confidence match
    if (isCorrect && confidenceLevel === 'high') {
      xpAmount += XP_REWARDS.PERFECT_CONFIDENCE;
    }

    if (xpAmount > 0) {
      addXP(xpAmount, 'quiz');
      showXPGain(xpAmount, 'quiz');
    }
  };

  const handleNext = () => {
    // If in review mode and answered correctly, remove from review queue
    if (isReviewMode && reviewConceptId && selectedAnswer === currentQuestion.correctAnswer) {
      removeFromReviewQueue(moduleId, reviewConceptId);
    }

    if (isLastQuestion) {
      onComplete?.();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setConfidenceLevel(null);
      setShowFeedback(false);
      setIsAnswered(false);
    }
  };

  const getFeedbackMessage = () => {
    if (selectedAnswer === null) return { type: 'info' as const, message: '' };

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      if (confidenceLevel === 'high') {
        return {
          type: 'correct' as const,
          message: 'Excellent! You knew it!',
          details: currentQuestion.explanation
        };
      } else if (confidenceLevel === 'low') {
        return {
          type: 'correct' as const,
          message: 'Great job! Trust your understanding more.',
          details: currentQuestion.explanation
        };
      } else {
        return {
          type: 'correct' as const,
          message: 'That\'s right!',
          details: currentQuestion.explanation
        };
      }
    } else {
      if (confidenceLevel === 'high') {
        return {
          type: 'incorrect' as const,
          message: 'Good try! Here\'s the key insight:',
          details: currentQuestion.explanation
        };
      } else {
        return {
          type: 'incorrect' as const,
          message: 'Not quite, but that\'s okay! Here\'s why:',
          details: currentQuestion.explanation
        };
      }
    }
  };

  const canSubmit = selectedAnswer !== null &&
    (!currentQuestion.requiresConfidence || confidenceLevel !== null);

  return (
    <div
      className="quiz bg-void-900 rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] border-2 border-void-800 p-6 max-w-2xl mx-auto"
      role="region"
      aria-label="Quiz"
    >
      {/* Review mode indicator */}
      {isReviewMode && (
        <div
          className="mb-6 px-4 py-2 bg-blue-900/20 border-l-4 border-blue-500"
          role="status"
          aria-live="polite"
        >
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            &gt; MODE: REVIEW_OPTIMIZATION
          </p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">
          <span>&gt; QUESTION_{currentQuestionIndex + 1}_OF_{questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%_COMPLETE</span>
        </div>
        <div
          className="w-full h-4 bg-void-950 border border-void-700 p-[2px]"
          role="progressbar"
          aria-valuenow={currentQuestionIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        >
          <div
            className="h-full bg-quantum-600 relative overflow-hidden"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              transition: reducedMotion ? 'none' : 'all 300ms steps(10)'
            }}
          >
            <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-30 bg-repeat-y bg-[length:100%_4px]" />
          </div>
        </div>
      </div>

      {/* Question */}
      <h3
        className="text-lg font-display text-white mb-6 uppercase tracking-wide leading-relaxed"
        id={`question-${currentQuestion.id}`}
      >
        {currentQuestion.question}
      </h3>

      {/* Answer options */}
      <div
        className="space-y-4 mb-8"
        role="radiogroup"
        aria-labelledby={`question-${currentQuestion.id}`}
      >
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showCorrectness = isAnswered;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${index + 1}: ${option}`}
              className={`
                w-full text-left p-4 rounded-none border-2 text-slate-300 font-mono text-sm relative overflow-hidden group
                ${isSelected && !showCorrectness ? 'border-quantum-500 bg-quantum-900/20' : 'border-void-700 bg-void-950'}
                ${showCorrectness && isSelected && isCorrect ? 'border-emerald-500 bg-emerald-900/20' : ''}
                ${showCorrectness && isSelected && !isCorrect ? 'border-red-500 bg-red-900/20' : ''}
                ${showCorrectness && !isSelected && isCorrect ? 'border-emerald-500 bg-emerald-900/20' : ''}
                ${!isAnswered ? 'hover:border-quantum-400 hover:bg-void-900 cursor-pointer active:translate-y-[2px]' : 'cursor-default'}
                ${isAnswered ? 'opacity-90' : ''}
                focus:outline-none focus:ring-0
                transition-all duration-75
                shadow-pixel-sm
              `}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-none border-2 flex items-center justify-center text-xs font-bold
                    ${showCorrectness && isCorrect ? 'border-emerald-500 text-emerald-500 bg-emerald-900/30' : ''}
                    ${showCorrectness && isSelected && !isCorrect ? 'border-red-500 text-red-500 bg-red-900/30' : ''}
                    ${!showCorrectness && isSelected ? 'border-quantum-500 text-quantum-500 bg-quantum-900/30' : 'border-void-600 text-void-600 bg-void-900'}
                  `}
                  aria-hidden="true"
                >
                  {showCorrectness && isCorrect && '✓'}
                  {showCorrectness && isSelected && !isCorrect && '✗'}
                  {!showCorrectness && isSelected && '>'}
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confidence rating */}
      {currentQuestion.requiresConfidence && !isAnswered && (
        <div className="mb-8 p-4 bg-void-950 border border-void-800">
          <ConfidenceRating
            onSelect={setConfidenceLevel}
            selected={confidenceLevel || undefined}
            disabled={isAnswered}
          />
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="mb-8">
          <FeedbackMessage {...getFeedbackMessage()} />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2 border-void-800">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              px-8 py-3 font-display uppercase tracking-wider text-sm border-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)]
              ${canSubmit
                ? 'bg-quantum-600 border-quantum-400 text-void-950 hover:bg-quantum-500 active:translate-y-1 active:shadow-none transition-all'
                : 'bg-void-800 border-void-600 text-void-500 cursor-not-allowed'
              }
            `}
            aria-label="Submit your answer"
          >
            Submit_Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-quantum-600 border-2 border-quantum-400 text-void-950 px-8 py-3 font-display uppercase tracking-wider text-sm shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 active:translate-y-1 active:shadow-none transition-all"
            aria-label={isLastQuestion ? 'Complete the quiz' : 'Go to next question'}
          >
            {isLastQuestion ? 'Complete_Quiz_>>' : 'Next_Question_>>'}
          </button>
        )}
      </div>
    </div>
  );
}
