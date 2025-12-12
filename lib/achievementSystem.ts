// Achievement definitions and unlock logic

import type { Achievement } from '@/types/learning';

export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  // Interaction Achievements
  {
    id: 'first-collapse',
    title: 'First Collapse',
    description: 'Measure your first qubit',
    icon: '🎯',
    category: 'interaction'
  },
  {
    id: 'collapsed-100',
    title: 'Collapsed 100 Qubits',
    description: 'Measure 100 times',
    icon: '💯',
    category: 'interaction'
  },
  {
    id: 'circuit-architect',
    title: 'Circuit Architect',
    description: 'Build 10 circuits',
    icon: '🏗️',
    category: 'interaction'
  },
  {
    id: 'perfect-prediction',
    title: 'Perfect Prediction',
    description: 'Correctly predict 5 superposition outcomes',
    icon: '🔮',
    category: 'interaction'
  },
  
  // Mastery Achievements
  {
    id: 'entanglement-adept',
    title: 'Entanglement Adept',
    description: 'Complete Entanglement module with 100% mastery',
    icon: '🔗',
    category: 'mastery'
  },
  {
    id: 'perfect-mastery',
    title: 'Perfect Mastery',
    description: 'Achieve 100% mastery in any module',
    icon: '⭐',
    category: 'mastery'
  },
  {
    id: 'quantum-scholar',
    title: 'Quantum Scholar',
    description: 'Achieve 80%+ mastery in all modules',
    icon: '🎓',
    category: 'mastery'
  },
  
  // Challenge Achievements
  {
    id: 'amplitude-amplifier',
    title: 'Amplitude Amplifier',
    description: 'Beat classical search average',
    icon: '⚡',
    category: 'challenge'
  },
  {
    id: 'circuit-puzzle-master',
    title: 'Circuit Puzzle Master',
    description: 'Solve all circuit puzzles',
    icon: '🧩',
    category: 'challenge'
  },
  {
    id: 'myth-buster',
    title: 'Myth Buster',
    description: 'Perfect score on Entanglement myths',
    icon: '💥',
    category: 'challenge'
  },
  
  // Persistence Achievements
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Visit 5 days in a row',
    icon: '🔥',
    category: 'persistence'
  },
  {
    id: 'review-champion',
    title: 'Review Champion',
    description: 'Complete 20 review sessions',
    icon: '🏆',
    category: 'persistence'
  }
];

export function getAchievementById(id: string): Omit<Achievement, 'unlockedAt'> | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function checkAchievementUnlock(
  achievementId: string,
  unlockedAchievements: Achievement[]
): boolean {
  return !unlockedAchievements.some(a => a.id === achievementId);
}
