import { describe, it, expect } from 'vitest';
import {
  getPersonalizedCopy,
  getAllPersonalizedCopy,
  getEncouragementMessage,
  getLevelUpMessage,
  getAchievementMessage,
  getReviewPrompt
} from './personalization';

describe('Personalization System', () => {
  describe('getPersonalizedCopy', () => {
    it('returns developer-specific copy', () => {
      const copy = getPersonalizedCopy('developer', 'welcome');
      expect(copy).toContain('build');
    });

    it('returns student-specific copy', () => {
      const copy = getPersonalizedCopy('student', 'welcome');
      expect(copy).toContain('learn');
    });

    it('returns founder-specific copy', () => {
      const copy = getPersonalizedCopy('founder', 'welcome');
      expect(copy).toContain('business');
    });

    it('returns researcher-specific copy', () => {
      const copy = getPersonalizedCopy('researcher', 'welcome');
      expect(copy).toContain('research');
    });
  });

  describe('getAllPersonalizedCopy', () => {
    it('returns all copy types for a profile', () => {
      const copy = getAllPersonalizedCopy('developer');
      expect(copy).toHaveProperty('welcome');
      expect(copy).toHaveProperty('moduleIntro');
      expect(copy).toHaveProperty('encouragement');
      expect(copy).toHaveProperty('levelUp');
      expect(copy).toHaveProperty('achievementUnlock');
      expect(copy).toHaveProperty('reviewPrompt');
    });

    it('returns different copy for different profiles', () => {
      const devCopy = getAllPersonalizedCopy('developer');
      const studentCopy = getAllPersonalizedCopy('student');
      expect(devCopy.welcome).not.toBe(studentCopy.welcome);
    });
  });

  describe('getEncouragementMessage', () => {
    it('returns base encouragement without context', () => {
      const message = getEncouragementMessage('developer');
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });

    it('returns different message for incorrect context', () => {
      const baseMessage = getEncouragementMessage('developer');
      const incorrectMessage = getEncouragementMessage('developer', 'incorrect');
      expect(incorrectMessage).not.toBe(baseMessage);
    });

    it('returns profile-specific incorrect messages', () => {
      const devMessage = getEncouragementMessage('developer', 'incorrect');
      const studentMessage = getEncouragementMessage('student', 'incorrect');
      expect(devMessage).not.toBe(studentMessage);
    });
  });

  describe('getLevelUpMessage', () => {
    it('includes level title in message', () => {
      const message = getLevelUpMessage('developer', 2, 'Qubit Explorer');
      expect(message).toContain('Qubit Explorer');
    });

    it('returns different messages for different profiles', () => {
      const devMessage = getLevelUpMessage('developer', 2, 'Qubit Explorer');
      const studentMessage = getLevelUpMessage('student', 2, 'Qubit Explorer');
      expect(devMessage).not.toBe(studentMessage);
    });
  });

  describe('getAchievementMessage', () => {
    it('includes achievement title in message', () => {
      const message = getAchievementMessage('developer', 'First Collapse');
      expect(message).toContain('First Collapse');
    });

    it('returns different messages for different profiles', () => {
      const devMessage = getAchievementMessage('developer', 'First Collapse');
      const studentMessage = getAchievementMessage('student', 'First Collapse');
      expect(devMessage).not.toBe(studentMessage);
    });
  });

  describe('getReviewPrompt', () => {
    it('includes item count in message', () => {
      const message = getReviewPrompt('developer', 5);
      expect(message).toContain('5');
    });

    it('uses singular form for 1 item', () => {
      const message = getReviewPrompt('developer', 1);
      expect(message).toContain('concept');
      expect(message).not.toContain('concepts');
    });

    it('uses plural form for multiple items', () => {
      const message = getReviewPrompt('developer', 3);
      expect(message).toContain('concepts');
    });

    it('returns different messages for different profiles', () => {
      const devMessage = getReviewPrompt('developer', 3);
      const studentMessage = getReviewPrompt('student', 3);
      expect(devMessage).not.toBe(studentMessage);
    });
  });
});
