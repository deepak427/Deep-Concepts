import { describe, it, expect } from 'vitest';
import { calculateMastery, calculateConfidenceAccuracy, isModuleComplete, DEFAULT_WEIGHTS } from './masteryCalculator';
import type { ModuleProgress } from '@/types/learning';

describe('Mastery Calculator', () => {
  describe('calculateConfidenceAccuracy', () => {
    it('returns 0 for empty ratings', () => {
      expect(calculateConfidenceAccuracy([])).toBe(0);
    });

    it('returns 100 for all accurate ratings', () => {
      const ratings = [
        { questionId: '1', level: 'high' as const, wasCorrect: true },
        { questionId: '2', level: 'low' as const, wasCorrect: false },
        { questionId: '3', level: 'medium' as const, wasCorrect: true }
      ];
      expect(calculateConfidenceAccuracy(ratings)).toBe(100);
    });

    it('calculates correct percentage for mixed accuracy', () => {
      const ratings = [
        { questionId: '1', level: 'high' as const, wasCorrect: true },  // accurate
        { questionId: '2', level: 'high' as const, wasCorrect: false }, // inaccurate
        { questionId: '3', level: 'low' as const, wasCorrect: true },   // inaccurate
        { questionId: '4', level: 'medium' as const, wasCorrect: false } // accurate
      ];
      expect(calculateConfidenceAccuracy(ratings)).toBe(50);
    });
  });

  describe('calculateMastery', () => {
    it('returns 0 for no progress', () => {
      const moduleData: ModuleProgress = {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };
      const mastery = calculateMastery(moduleData, 5);
      expect(mastery).toBe(0);
    });

    it('calculates correct mastery for partial progress', () => {
      const moduleData: ModuleProgress = {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: ['int1', 'int2'],
        quizResults: [
          { questionId: 'q1', correct: true, timestamp: new Date() },
          { questionId: 'q2', correct: false, timestamp: new Date() }
        ],
        confidenceRatings: [
          { questionId: 'q1', level: 'high', wasCorrect: true }
        ],
        selfRating: 3,
        lastVisited: new Date()
      };
      const mastery = calculateMastery(moduleData, 5);
      
      // Expected: 40% * (2/5) + 30% * (1/2) + 20% * 100 + 10% * (3/5)
      // = 0.4 * 0.4 + 0.3 * 0.5 + 0.2 * 1 + 0.1 * 0.6
      // = 0.16 + 0.15 + 0.2 + 0.06 = 0.57 = 57%
      expect(mastery).toBeCloseTo(57, 0);
    });

    it('returns 100 for perfect progress', () => {
      const moduleData: ModuleProgress = {
        completed: true,
        masteryLevel: 100,
        interactionsCompleted: ['int1', 'int2', 'int3', 'int4', 'int5'],
        quizResults: [
          { questionId: 'q1', correct: true, timestamp: new Date() },
          { questionId: 'q2', correct: true, timestamp: new Date() }
        ],
        confidenceRatings: [
          { questionId: 'q1', level: 'high', wasCorrect: true },
          { questionId: 'q2', level: 'high', wasCorrect: true }
        ],
        selfRating: 5,
        lastVisited: new Date()
      };
      const mastery = calculateMastery(moduleData, 5);
      expect(mastery).toBe(100);
    });

    it('clamps mastery to 0-100 range', () => {
      const moduleData: ModuleProgress = {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };
      const mastery = calculateMastery(moduleData, 5);
      expect(mastery).toBeGreaterThanOrEqual(0);
      expect(mastery).toBeLessThanOrEqual(100);
    });
  });

  describe('isModuleComplete', () => {
    it('returns false when interactions not completed', () => {
      const moduleData: ModuleProgress = {
        completed: false,
        masteryLevel: 80,
        interactionsCompleted: ['int1'],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };
      expect(isModuleComplete(moduleData, ['int1', 'int2'])).toBe(false);
    });

    it('returns false when mastery below 70%', () => {
      const moduleData: ModuleProgress = {
        completed: false,
        masteryLevel: 60,
        interactionsCompleted: ['int1', 'int2'],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };
      expect(isModuleComplete(moduleData, ['int1', 'int2'])).toBe(false);
    });

    it('returns true when both conditions met', () => {
      const moduleData: ModuleProgress = {
        completed: true,
        masteryLevel: 75,
        interactionsCompleted: ['int1', 'int2'],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };
      expect(isModuleComplete(moduleData, ['int1', 'int2'])).toBe(true);
    });
  });
});
