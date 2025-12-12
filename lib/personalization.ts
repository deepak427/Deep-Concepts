// Profile-based micro-copy personalization system

import type { UserProfile } from '@/types/learning';

interface MicroCopy {
  welcome: string;
  moduleIntro: string;
  encouragement: string;
  levelUp: string;
  achievementUnlock: string;
  reviewPrompt: string;
}

const MICRO_COPY: Record<UserProfile['type'], MicroCopy> = {
  developer: {
    welcome: 'Ready to build quantum applications?',
    moduleIntro: 'Let\'s explore how you can implement this in code',
    encouragement: 'Great work! You\'re building solid quantum foundations',
    levelUp: 'Level up! Your quantum development skills are growing',
    achievementUnlock: 'Achievement unlocked! You\'re becoming a quantum developer',
    reviewPrompt: 'Time to debug your understanding with a quick review'
  },
  student: {
    welcome: 'Let\'s learn quantum computing together!',
    moduleIntro: 'Here\'s what you\'ll learn in this section',
    encouragement: 'Excellent progress! You\'re mastering these concepts',
    levelUp: 'Level up! Your quantum knowledge is expanding',
    achievementUnlock: 'Achievement unlocked! You\'re making great progress',
    reviewPrompt: 'Let\'s review what you\'ve learned to strengthen your understanding'
  },
  founder: {
    welcome: 'Discover how quantum computing can transform your business',
    moduleIntro: 'Let\'s explore the business applications of this concept',
    encouragement: 'Impressive! You\'re gaining strategic quantum insights',
    levelUp: 'Level up! Your quantum business acumen is growing',
    achievementUnlock: 'Achievement unlocked! You\'re building quantum expertise',
    reviewPrompt: 'Let\'s review key concepts that matter for your business'
  },
  researcher: {
    welcome: 'Let\'s dive deep into quantum computing research',
    moduleIntro: 'Here are the theoretical foundations you need to know',
    encouragement: 'Excellent work! You\'re developing deep quantum understanding',
    levelUp: 'Level up! Your quantum research expertise is advancing',
    achievementUnlock: 'Achievement unlocked! You\'re mastering quantum theory',
    reviewPrompt: 'Time to reinforce your theoretical understanding'
  }
};

/**
 * Get personalized micro-copy based on user profile
 */
export function getPersonalizedCopy(
  profileType: UserProfile['type'],
  copyType: keyof MicroCopy
): string {
  return MICRO_COPY[profileType][copyType];
}

/**
 * Get all personalized copy for a profile
 */
export function getAllPersonalizedCopy(profileType: UserProfile['type']): MicroCopy {
  return MICRO_COPY[profileType];
}

/**
 * Get personalized module introduction
 */
export function getModuleIntro(
  profileType: UserProfile['type'],
  moduleName: string
): string {
  const baseIntro = MICRO_COPY[profileType].moduleIntro;
  return `${baseIntro} - ${moduleName}`;
}

/**
 * Get personalized encouragement message
 */
export function getEncouragementMessage(
  profileType: UserProfile['type'],
  context?: 'correct' | 'incorrect' | 'progress'
): string {
  const base = MICRO_COPY[profileType].encouragement;
  
  if (context === 'incorrect') {
    const incorrectMessages: Record<UserProfile['type'], string> = {
      developer: 'Good try! Even the best developers debug their understanding',
      student: 'That\'s okay! Learning means making mistakes and growing',
      founder: 'Not quite, but you\'re building valuable insights',
      researcher: 'Interesting attempt! Let\'s explore the correct approach'
    };
    return incorrectMessages[profileType];
  }
  
  return base;
}

/**
 * Get personalized level up message
 */
export function getLevelUpMessage(
  profileType: UserProfile['type'],
  newLevel: number,
  levelTitle: string
): string {
  const baseMessage = MICRO_COPY[profileType].levelUp;
  return `${baseMessage} - You're now ${levelTitle}!`;
}

/**
 * Get personalized achievement message
 */
export function getAchievementMessage(
  profileType: UserProfile['type'],
  achievementTitle: string
): string {
  const baseMessage = MICRO_COPY[profileType].achievementUnlock;
  return `${baseMessage}: ${achievementTitle}`;
}

/**
 * Get personalized review prompt
 */
export function getReviewPrompt(
  profileType: UserProfile['type'],
  itemCount: number
): string {
  const basePrompt = MICRO_COPY[profileType].reviewPrompt;
  const itemText = itemCount === 1 ? 'concept' : 'concepts';
  return `${basePrompt} (${itemCount} ${itemText} waiting)`;
}
