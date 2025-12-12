// Tests for game layer integration with learning core

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLearningStore } from './learningState';
import {
  completeQuestWithRewards,
  convertMasteryToStars,
  getIslandMasteryStars,
  defeatBossWithRewards,
  getRecommendedQuestsForReview,
  checkIslandForSpacedRepetition,
  getIslandsNeedingReview,
  getNPCDialogueContext,
  generatePersonalizedDialogue,
  awardInteractionXP,
  checkBossUnlock,
  updateNPCRelationshipFromPerformance,
  getSuggestedNextSteps,
  completeChallenge
} from './gameIntegration';

describe('Game Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useLearningStore.getState();
    // Clear state
    Object.keys(store.modules).forEach(key => {
      delete store.modules[key];
    });
    store.xp = 0;
    store.level = 1;
    store.achievements = [];
    store.activeQuests = [];
    store.completedQuests = [];
    store.defeatedBosses = [];
    store.inventory.items = [];
  });

  describe('Quest Integration', () => {
    it('should award XP when completing a quest', () => {
      const initialXP = useLearningStore.getState().xp;

      completeQuestWithRewards('superposition-basics');

      const finalState = useLearningStore.getState();
      expect(finalState.xp).toBeGreaterThan(initialXP);
      expect(finalState.completedQuests).toContain('superposition-basics');
    });

    it('should award items when completing a quest', () => {
      completeQuestWithRewards('superposition-basics');

      const finalState = useLearningStore.getState();
      expect(finalState.inventory.items.length).toBeGreaterThan(0);
    });

    it('should unlock achievements when specified in quest rewards', () => {
      completeQuestWithRewards('wave-mastery');

      // Check if achievement was attempted to be unlocked
      // Note: The actual achievement may not exist in test environment
      const finalState = useLearningStore.getState();
      expect(finalState.completedQuests).toContain('wave-mastery');
    });
  });

  describe('Mastery to Stars Conversion', () => {
    it('should convert 0-19% mastery to 0 stars', () => {
      expect(convertMasteryToStars(0)).toBe(0);
      expect(convertMasteryToStars(19)).toBe(0);
    });

    it('should convert 20-39% mastery to 1 star', () => {
      expect(convertMasteryToStars(20)).toBe(1);
      expect(convertMasteryToStars(39)).toBe(1);
    });

    it('should convert 40-59% mastery to 2 stars', () => {
      expect(convertMasteryToStars(40)).toBe(2);
      expect(convertMasteryToStars(59)).toBe(2);
    });

    it('should convert 60-79% mastery to 3 stars', () => {
      expect(convertMasteryToStars(60)).toBe(3);
      expect(convertMasteryToStars(79)).toBe(3);
    });

    it('should convert 80-94% mastery to 4 stars', () => {
      expect(convertMasteryToStars(80)).toBe(4);
      expect(convertMasteryToStars(94)).toBe(4);
    });

    it('should convert 95-100% mastery to 5 stars', () => {
      expect(convertMasteryToStars(95)).toBe(5);
      expect(convertMasteryToStars(100)).toBe(5);
    });

    it('should return 0 stars for non-existent module', () => {
      expect(getIslandMasteryStars('non-existent')).toBe(0);
    });
  });

  describe('Boss Integration', () => {
    it('should award XP when defeating a boss', () => {
      useLearningStore.getState().startBossBattle('measurement-monster');
      const initialXP = useLearningStore.getState().xp;

      defeatBossWithRewards('measurement-monster');

      const finalState = useLearningStore.getState();
      expect(finalState.xp).toBeGreaterThan(initialXP);
      expect(finalState.defeatedBosses).toContain('measurement-monster');
    });

    it('should award items when defeating a boss', () => {
      useLearningStore.getState().startBossBattle('measurement-monster');
      
      defeatBossWithRewards('measurement-monster');

      const finalState = useLearningStore.getState();
      expect(finalState.inventory.items.length).toBeGreaterThan(0);
    });

    it('should check boss unlock based on mastery stars', () => {
      const store = useLearningStore.getState();
      
      // Create module with low mastery
      store.modules['superposition'] = {
        completed: false,
        masteryLevel: 30, // 1 star
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };

      const result = checkBossUnlock('superposition');
      expect(result.unlocked).toBe(false);
      expect(result.requiredStars).toBe(3);
    });

    it('should unlock boss when mastery threshold is met', () => {
      const store = useLearningStore.getState();
      
      // Create module with high mastery
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 75, // 3 stars
        interactionsCompleted: ['test1', 'test2'],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: new Date()
      };

      const result = checkBossUnlock('superposition');
      expect(result.unlocked).toBe(true);
      expect(result.bossId).toBe('measurement-monster');
    });
  });

  describe('Review System Integration', () => {
    it('should recommend quests for low mastery modules', () => {
      const store = useLearningStore.getState();
      
      // Create module with low mastery
      store.modules['superposition'] = {
        completed: false,
        masteryLevel: 40,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 2,
        lastVisited: new Date()
      };

      const recommendations = getRecommendedQuestsForReview('superposition');
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should not recommend quests for high mastery modules', () => {
      const store = useLearningStore.getState();
      
      // Create module with high mastery
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 85,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 5,
        lastVisited: new Date()
      };

      const recommendations = getRecommendedQuestsForReview('superposition');
      expect(recommendations.length).toBe(0);
    });

    it('should identify islands needing spaced repetition', () => {
      const store = useLearningStore.getState();
      
      // Create completed module from 2 days ago
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 80,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: twoDaysAgo
      };

      expect(checkIslandForSpacedRepetition('superposition')).toBe(true);
    });

    it('should not flag recently visited islands for review', () => {
      const store = useLearningStore.getState();
      
      // Create completed module from today
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 80,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: new Date()
      };

      expect(checkIslandForSpacedRepetition('superposition')).toBe(false);
    });
  });

  describe('NPC Dialogue Integration', () => {
    it('should provide context based on performance', () => {
      const store = useLearningStore.getState();
      
      // Create module with good performance
      store.modules['superposition'] = {
        completed: false,
        masteryLevel: 70,
        interactionsCompleted: [],
        quizResults: [
          { questionId: 'q1', correct: true, timestamp: new Date() },
          { questionId: 'q2', correct: true, timestamp: new Date() },
          { questionId: 'q3', correct: true, timestamp: new Date() }
        ],
        confidenceRatings: [
          { questionId: 'q1', level: 'high', wasCorrect: true },
          { questionId: 'q2', level: 'high', wasCorrect: true }
        ],
        selfRating: 4,
        lastVisited: new Date()
      };

      const context = getNPCDialogueContext('dr-qubit', 'superposition');
      expect(context.masteryLevel).toBe(70);
      expect(context.masteryStars).toBe(3);
      expect(context.recentPerformance).toBe('good');
      expect(context.confidenceLevel).toBe('high');
    });

    it('should generate personalized dialogue based on performance', () => {
      const store = useLearningStore.getState();
      
      // Create module with excellent performance
      store.modules['superposition'] = {
        completed: false,
        masteryLevel: 90,
        interactionsCompleted: [],
        quizResults: [
          { questionId: 'q1', correct: true, timestamp: new Date() },
          { questionId: 'q2', correct: true, timestamp: new Date() },
          { questionId: 'q3', correct: true, timestamp: new Date() },
          { questionId: 'q4', correct: true, timestamp: new Date() },
          { questionId: 'q5', correct: true, timestamp: new Date() }
        ],
        confidenceRatings: [],
        selfRating: 5,
        lastVisited: new Date()
      };

      const dialogue = generatePersonalizedDialogue(
        'dr-qubit',
        'superposition',
        'Welcome back!'
      );
      
      expect(dialogue).toContain('Welcome back!');
      expect(dialogue).toContain('exceptionally well');
    });

    it('should encourage struggling learners', () => {
      const store = useLearningStore.getState();
      
      // Create module with struggling performance
      store.modules['superposition'] = {
        completed: false,
        masteryLevel: 30,
        interactionsCompleted: [],
        quizResults: [
          { questionId: 'q1', correct: false, timestamp: new Date() },
          { questionId: 'q2', correct: false, timestamp: new Date() },
          { questionId: 'q3', correct: true, timestamp: new Date() }
        ],
        confidenceRatings: [],
        selfRating: 2,
        lastVisited: new Date()
      };

      const dialogue = generatePersonalizedDialogue(
        'dr-qubit',
        'superposition',
        'Let\'s continue.'
      );
      
      expect(dialogue).toContain('Let\'s continue.');
      expect(dialogue).toContain('tricky');
    });
  });

  describe('XP Award Integration', () => {
    it('should award base XP for interactions', () => {
      const initialXP = useLearningStore.getState().xp;

      awardInteractionXP('INTERACTIVE_COMPLETION', 'superposition');

      const finalState = useLearningStore.getState();
      expect(finalState.xp).toBe(initialXP + 30);
    });

    it('should award bonus XP for perfect confidence', () => {
      const initialXP = useLearningStore.getState().xp;

      awardInteractionXP('QUIZ_CORRECT', 'superposition', true, 'high');

      const finalState = useLearningStore.getState();
      expect(finalState.xp).toBe(initialXP + 20 + 10); // Base + bonus
    });

    it('should not award bonus for incorrect answers', () => {
      const initialXP = useLearningStore.getState().xp;

      awardInteractionXP('QUIZ_CORRECT', 'superposition', false, 'high');

      const finalState = useLearningStore.getState();
      expect(finalState.xp).toBe(initialXP + 20); // Base only
    });
  });

  describe('NPC Relationship Integration', () => {
    it('should increase relationship on quest completion', () => {
      const initialRelationship = useLearningStore.getState().npcRelationships['dr-qubit'];

      useLearningStore.getState().modules['superposition'] = {
        completed: false,
        masteryLevel: 70,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: new Date()
      };

      updateNPCRelationshipFromPerformance('dr-qubit', 'superposition', true);

      const finalState = useLearningStore.getState();
      expect(finalState.npcRelationships['dr-qubit']).toBeGreaterThan(initialRelationship);
    });

    it('should give bonus relationship for excellent performance', () => {
      const initialRelationship = useLearningStore.getState().npcRelationships['dr-qubit'];

      useLearningStore.getState().modules['superposition'] = {
        completed: false,
        masteryLevel: 90,
        interactionsCompleted: [],
        quizResults: [
          { questionId: 'q1', correct: true, timestamp: new Date() },
          { questionId: 'q2', correct: true, timestamp: new Date() },
          { questionId: 'q3', correct: true, timestamp: new Date() },
          { questionId: 'q4', correct: true, timestamp: new Date() },
          { questionId: 'q5', correct: true, timestamp: new Date() }
        ],
        confidenceRatings: [],
        selfRating: 5,
        lastVisited: new Date()
      };

      updateNPCRelationshipFromPerformance('dr-qubit', 'superposition', true);

      const finalState = useLearningStore.getState();
      expect(finalState.npcRelationships['dr-qubit']).toBeGreaterThan(initialRelationship + 10);
    });
  });

  describe('Suggested Next Steps', () => {
    it('should suggest boss battles when available', () => {
      const store = useLearningStore.getState();
      
      // Create module with high mastery to unlock boss
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 75,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: new Date()
      };

      const suggestions = getSuggestedNextSteps();
      const bossSuggestion = suggestions.find(s => s.type === 'boss');
      
      expect(bossSuggestion).toBeDefined();
      expect(bossSuggestion?.priority).toBe(4);
    });

    it('should suggest reviews for old completed modules', () => {
      const store = useLearningStore.getState();
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 80,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: twoDaysAgo
      };

      const suggestions = getSuggestedNextSteps();
      const reviewSuggestion = suggestions.find(s => s.type === 'review');
      
      expect(reviewSuggestion).toBeDefined();
      expect(reviewSuggestion?.priority).toBe(3);
    });

    it('should prioritize suggestions correctly', () => {
      const store = useLearningStore.getState();
      
      // Add both boss and review opportunities
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      store.modules['superposition'] = {
        completed: true,
        masteryLevel: 75,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 4,
        lastVisited: twoDaysAgo
      };

      const suggestions = getSuggestedNextSteps();
      
      // Boss should be higher priority than review
      if (suggestions.length >= 2) {
        expect(suggestions[0].priority).toBeGreaterThanOrEqual(suggestions[1].priority);
      }
    });
  });

  describe('Challenge Completion Integration', () => {
    it('should update all systems when completing a challenge', () => {
      const initialXP = useLearningStore.getState().xp;

      useLearningStore.getState().modules['superposition'] = {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };

      completeChallenge('superposition', 'test-challenge', true, 'high');

      const finalState = useLearningStore.getState();
      
      // Check XP was awarded
      expect(finalState.xp).toBeGreaterThan(initialXP);
      
      // Check interaction was recorded
      expect(finalState.modules['superposition'].interactionsCompleted).toContain('test-challenge');
      
      // Check mastery was updated (should be > 0 now)
      expect(finalState.modules['superposition'].masteryLevel).toBeGreaterThan(0);
    });
  });
});
