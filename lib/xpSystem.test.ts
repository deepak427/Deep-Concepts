import { describe, it, expect } from 'vitest';
import { calculateLevel, getLevelTitle, getNextLevelThreshold, getXPForNextLevel, LEVEL_THRESHOLDS } from './xpSystem';

describe('XP System', () => {
  describe('calculateLevel', () => {
    it('returns level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('returns level 2 for 200 XP', () => {
      expect(calculateLevel(200)).toBe(2);
    });

    it('returns level 3 for 500 XP', () => {
      expect(calculateLevel(500)).toBe(3);
    });

    it('returns correct level for mid-range XP', () => {
      expect(calculateLevel(250)).toBe(2);
      expect(calculateLevel(750)).toBe(3);
    });

    it('never exceeds maximum level', () => {
      expect(calculateLevel(999999)).toBe(8);
    });

    it('handles boundary values correctly', () => {
      expect(calculateLevel(199)).toBe(1);
      expect(calculateLevel(200)).toBe(2);
      expect(calculateLevel(499)).toBe(2);
      expect(calculateLevel(500)).toBe(3);
    });
  });

  describe('getLevelTitle', () => {
    it('returns correct title for level 1', () => {
      expect(getLevelTitle(1)).toBe('Classical Thinker');
    });

    it('returns correct title for level 5', () => {
      expect(getLevelTitle(5)).toBe('Gate Master');
    });

    it('returns correct title for level 8', () => {
      expect(getLevelTitle(8)).toBe('Quantum Theorist');
    });

    it('returns default title for invalid level', () => {
      expect(getLevelTitle(99)).toBe('Classical Thinker');
    });
  });

  describe('getNextLevelThreshold', () => {
    it('returns correct threshold for level 1', () => {
      expect(getNextLevelThreshold(1)).toBe(200);
    });

    it('returns correct threshold for level 5', () => {
      expect(getNextLevelThreshold(5)).toBe(2000);
    });

    it('returns null for max level', () => {
      expect(getNextLevelThreshold(8)).toBe(null);
    });
  });

  describe('getXPForNextLevel', () => {
    it('calculates correct XP needed for next level', () => {
      expect(getXPForNextLevel(0, 1)).toBe(200);
      expect(getXPForNextLevel(100, 1)).toBe(100);
      expect(getXPForNextLevel(200, 2)).toBe(300);
    });

    it('returns 0 for max level', () => {
      expect(getXPForNextLevel(3500, 8)).toBe(0);
    });
  });

  describe('LEVEL_THRESHOLDS', () => {
    it('has 8 levels defined', () => {
      expect(LEVEL_THRESHOLDS).toHaveLength(8);
    });

    it('has increasing XP thresholds', () => {
      for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        expect(LEVEL_THRESHOLDS[i].xp).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1].xp);
      }
    });

    it('has unique level numbers', () => {
      const levels = LEVEL_THRESHOLDS.map(t => t.level);
      const uniqueLevels = new Set(levels);
      expect(uniqueLevels.size).toBe(LEVEL_THRESHOLDS.length);
    });
  });
});
