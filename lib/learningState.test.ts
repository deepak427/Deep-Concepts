import { describe, it, expect, beforeEach } from 'vitest';
import { useLearningStore } from './learningState';

describe('Learning Store', () => {
  beforeEach(() => {
    // Clear localStorage first
    localStorage.clear();
    
    // Reset store to initial state by setting all properties
    useLearningStore.setState({
      userProfile: {
        type: 'student',
        onboardingCompleted: false,
        selfAssessmentScore: 0
      },
      xp: 0,
      level: 1,
      achievements: [],
      modules: {},
      reviewQueue: [],
      lastSessionDate: undefined
    });
  });

  describe('XP and Leveling', () => {
    it('starts at level 1 with 0 XP', () => {
      const state = useLearningStore.getState();
      expect(state.xp).toBe(0);
      expect(state.level).toBe(1);
    });

    it('adds XP correctly', () => {
      const store = useLearningStore.getState();
      store.addXP(50, 'test');
      
      const state = useLearningStore.getState();
      expect(state.xp).toBe(50);
    });

    it('levels up when XP threshold reached', () => {
      const store = useLearningStore.getState();
      store.addXP(200, 'test');
      
      const state = useLearningStore.getState();
      expect(state.level).toBe(2);
    });

    it('accumulates XP across multiple additions', () => {
      const store = useLearningStore.getState();
      store.addXP(100, 'quiz');
      store.addXP(100, 'interaction');
      store.addXP(100, 'challenge');
      
      const state = useLearningStore.getState();
      expect(state.xp).toBe(300);
      expect(state.level).toBe(2);
    });
  });

  describe('Achievements', () => {
    it('starts with no achievements', () => {
      const state = useLearningStore.getState();
      expect(state.achievements).toHaveLength(0);
    });

    it('unlocks achievement correctly', () => {
      const store = useLearningStore.getState();
      store.unlockAchievement('first-collapse');
      
      const state = useLearningStore.getState();
      expect(state.achievements).toHaveLength(1);
      expect(state.achievements[0].id).toBe('first-collapse');
      expect(state.achievements[0].unlockedAt).toBeInstanceOf(Date);
    });

    it('does not unlock same achievement twice', () => {
      const store = useLearningStore.getState();
      store.unlockAchievement('first-collapse');
      store.unlockAchievement('first-collapse');
      
      const state = useLearningStore.getState();
      expect(state.achievements).toHaveLength(1);
    });
  });

  describe('Module Progress', () => {
    it('creates module on first interaction', () => {
      const store = useLearningStore.getState();
      store.completeInteraction('test-module', 'interaction-1');
      
      const state = useLearningStore.getState();
      expect(state.modules['test-module']).toBeDefined();
      expect(state.modules['test-module'].interactionsCompleted).toContain('interaction-1');
    });

    it('does not duplicate completed interactions', () => {
      const store = useLearningStore.getState();
      store.completeInteraction('test-module', 'interaction-1');
      store.completeInteraction('test-module', 'interaction-1');
      
      const state = useLearningStore.getState();
      expect(state.modules['test-module'].interactionsCompleted).toHaveLength(1);
    });

    it('records quiz results', () => {
      const store = useLearningStore.getState();
      store.recordQuizResult('test-module', {
        questionId: 'q1',
        correct: true,
        confidenceLevel: 'high',
        timestamp: new Date()
      });
      
      const state = useLearningStore.getState();
      expect(state.modules['test-module'].quizResults).toHaveLength(1);
      expect(state.modules['test-module'].quizResults[0].correct).toBe(true);
    });

    it('adds incorrect answers to review queue', () => {
      const store = useLearningStore.getState();
      store.recordQuizResult('test-module', {
        questionId: 'q1',
        correct: false,
        timestamp: new Date()
      });
      
      const state = useLearningStore.getState();
      expect(state.reviewQueue.length).toBeGreaterThan(0);
      expect(state.reviewQueue[0].reason).toBe('incorrect');
    });

    it('updates mastery level after interactions', () => {
      const store = useLearningStore.getState();
      store.completeInteraction('test-module', 'int1');
      store.completeInteraction('test-module', 'int2');
      store.recordQuizResult('test-module', {
        questionId: 'q1',
        correct: true,
        confidenceLevel: 'high',
        timestamp: new Date()
      });
      
      const state = useLearningStore.getState();
      expect(state.modules['test-module'].masteryLevel).toBeGreaterThan(0);
    });
  });

  describe('Review Queue', () => {
    it('adds items to review queue', () => {
      const store = useLearningStore.getState();
      store.addToReviewQueue({
        moduleId: 'test-module',
        conceptId: 'concept-1',
        reason: 'incorrect',
        priority: 3,
        nextReviewDate: new Date()
      });
      
      const state = useLearningStore.getState();
      expect(state.reviewQueue).toHaveLength(1);
    });

    it('removes items from review queue', () => {
      const store = useLearningStore.getState();
      store.addToReviewQueue({
        moduleId: 'test-module',
        conceptId: 'concept-1',
        reason: 'incorrect',
        priority: 3,
        nextReviewDate: new Date()
      });
      store.removeFromReviewQueue('test-module', 'concept-1');
      
      const state = useLearningStore.getState();
      expect(state.reviewQueue).toHaveLength(0);
    });

    it('does not add duplicate review items', () => {
      const store = useLearningStore.getState();
      const item = {
        moduleId: 'test-module',
        conceptId: 'concept-1',
        reason: 'incorrect' as const,
        priority: 3,
        nextReviewDate: new Date()
      };
      store.addToReviewQueue(item);
      store.addToReviewQueue(item);
      
      const state = useLearningStore.getState();
      expect(state.reviewQueue).toHaveLength(1);
    });
  });

  describe('Onboarding', () => {
    it('completes onboarding with profile', () => {
      const store = useLearningStore.getState();
      store.completeOnboarding({
        type: 'developer',
        onboardingCompleted: true,
        selfAssessmentScore: 3
      });
      
      const state = useLearningStore.getState();
      expect(state.userProfile.type).toBe('developer');
      expect(state.userProfile.onboardingCompleted).toBe(true);
      expect(state.userProfile.selfAssessmentScore).toBe(3);
    });
  });

  describe('Session Tracking', () => {
    it('updates last session date', () => {
      const store = useLearningStore.getState();
      store.updateLastSession();
      
      const state = useLearningStore.getState();
      expect(state.lastSessionDate).toBeInstanceOf(Date);
    });
  });
});
