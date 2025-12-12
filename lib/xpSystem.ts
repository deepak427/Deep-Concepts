// XP and level calculation system

export interface LevelThreshold {
  level: number;
  xp: number;
  title: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xp: 0, title: 'Classical Thinker' },
  { level: 2, xp: 200, title: 'Qubit Explorer' },
  { level: 3, xp: 500, title: 'Superposition Apprentice' },
  { level: 4, xp: 900, title: 'Entanglement Adept' },
  { level: 5, xp: 1400, title: 'Gate Master' },
  { level: 6, xp: 2000, title: 'Algorithm Architect' },
  { level: 7, xp: 2700, title: 'Quantum Engineer' },
  { level: 8, xp: 3500, title: 'Quantum Theorist' }
];

export const XP_REWARDS = {
  MODULE_COMPLETE: 100,
  QUIZ_CORRECT: 20,
  INTERACTIVE_COMPLETION: 30,
  CIRCUIT_PUZZLE: 50,
  PREDICTION_CHALLENGE: 40,
  REVIEW_COMPLETE: 25,
  PERFECT_CONFIDENCE: 10
} as const;

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  return 1;
}

export function getLevelTitle(level: number): string {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  return threshold?.title || 'Classical Thinker';
}

export function getNextLevelThreshold(currentLevel: number): number | null {
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextLevel?.xp ?? 0;
}

export function getXPForNextLevel(currentXP: number, currentLevel: number): number {
  const nextThreshold = getNextLevelThreshold(currentLevel);
  if (nextThreshold === null) return 0;
  return nextThreshold - currentXP;
}
