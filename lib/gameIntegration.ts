// Game Layer Integration with Learning Core
// This module connects XP, mastery, achievements, quests, bosses, and reviews

import { useLearningStore } from './learningState';
import { XP_REWARDS } from './xpSystem';
import { getQuestById } from '@/constants/quests';
import { getBossById } from '@/constants/bosses';
import type { NPCId } from '@/types/game';

/**
 * Integration 1: Connect XP system to quest rewards
 * When a quest is completed, award the specified XP and items
 */
export function completeQuestWithRewards(questId: string): void {
  const quest = getQuestById(questId);
  
  if (!quest) {
    console.warn(`Quest ${questId} not found`);
    return;
  }

  // Get store actions
  const { addXP, addItem, unlockAchievement, completeQuest } = useLearningStore.getState();

  // Award XP from quest rewards
  addXP(quest.rewards.xp, `quest-${questId}`);

  // Award items if any
  if (quest.rewards.items) {
    quest.rewards.items.forEach(item => {
      addItem({
        id: item.id,
        name: item.id, // Will be looked up from items constants
        description: '',
        type: 'particle',
        rarity: 'common',
        icon: '✨',
        quantity: item.quantity
      });
    });
  }

  // Unlock achievement if specified
  if (quest.rewards.achievementId) {
    unlockAchievement(quest.rewards.achievementId);
  }

  // Unlock boss if specified
  if (quest.rewards.unlocksBoss) {
    console.log(`Boss ${quest.rewards.unlocksBoss} unlocked!`);
    // Boss unlock is handled by checking mastery threshold
  }

  // Unlock island if specified
  if (quest.rewards.unlocksIsland) {
    console.log(`Island ${quest.rewards.unlocksIsland} unlocked!`);
    // Island unlock logic would go here
  }

  // Mark quest as complete
  completeQuest(questId);
}

/**
 * Integration 2: Link mastery calculation to island stars
 * Convert mastery percentage (0-100) to stars (0-5)
 */
export function convertMasteryToStars(masteryPercentage: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (masteryPercentage < 20) return 0;
  if (masteryPercentage < 40) return 1;
  if (masteryPercentage < 60) return 2;
  if (masteryPercentage < 80) return 3;
  if (masteryPercentage < 95) return 4;
  return 5;
}

/**
 * Get mastery stars for a module/island
 */
export function getIslandMasteryStars(moduleId: string): 0 | 1 | 2 | 3 | 4 | 5 {
  const store = useLearningStore.getState();
  const moduleData = store.modules[moduleId];
  
  if (!moduleData) return 0;
  
  return convertMasteryToStars(moduleData.masteryLevel);
}

/**
 * Integration 3: Integrate achievements with boss defeats
 * When a boss is defeated, award achievement and rewards
 */
export function defeatBossWithRewards(bossId: string): void {
  const boss = getBossById(bossId);
  
  if (!boss) {
    console.warn(`Boss ${bossId} not found`);
    return;
  }

  // Get store actions
  const { addXP, addItem, unlockAchievement, endBossBattle } = useLearningStore.getState();

  // Award XP
  addXP(boss.defeatReward.xp, `boss-${bossId}`);

  // Award achievement if specified
  if (boss.defeatReward.achievementId) {
    unlockAchievement(boss.defeatReward.achievementId);
  }

  // Award items if any
  if (boss.defeatReward.items) {
    boss.defeatReward.items.forEach(item => {
      addItem({
        id: item.id,
        name: item.id,
        description: '',
        type: 'particle',
        rarity: 'rare',
        icon: '💎',
        quantity: item.quantity
      });
    });
  }

  // Unlock island if specified
  if (boss.defeatReward.unlocksIsland) {
    console.log(`Island ${boss.defeatReward.unlocksIsland} unlocked!`);
  }

  // Mark boss as defeated
  endBossBattle(true);
}

/**
 * Integration 4: Connect review system to quest suggestions
 * When a user has low mastery, suggest relevant quests
 */
export function getRecommendedQuestsForReview(moduleId: string): string[] {
  const store = useLearningStore.getState();
  const moduleData = store.modules[moduleId];
  
  if (!moduleData || moduleData.masteryLevel >= 70) {
    return [];
  }

  // Map modules to quest IDs that can help improve mastery
  const moduleToQuestMap: Record<string, string[]> = {
    'bits-qubits': ['superposition-basics', 'wave-mastery'],
    'superposition': ['superposition-basics', 'wave-mastery', 'prediction-challenge'],
    'entanglement': ['bell-state-quest', 'correlation-study', 'myth-buster-quest'],
    'gates': ['gate-basics', 'circuit-puzzles', 'advanced-circuits'],
    'algorithms': ['grover-introduction', 'search-mastery', 'algorithm-challenge'],
    'hardware': ['cooling-basics', 'decoherence-study', 'hardware-mastery']
  };

  const recommendedQuests = moduleToQuestMap[moduleId] || [];
  
  // Filter to only quests that are available (prerequisites met)
  return recommendedQuests.filter(questId => {
    const quest = getQuestById(questId);
    if (!quest) return false;
    
    // Check if already completed
    if (store.completedQuests.includes(questId)) return false;
    
    // Check prerequisites
    return quest.prerequisites.every(prereq => 
      store.completedQuests.includes(prereq)
    );
  });
}

/**
 * Integration 5: Ensure spaced repetition works with islands
 * Check if island needs review and create appropriate quest suggestions
 */
export function checkIslandForSpacedRepetition(moduleId: string): boolean {
  const store = useLearningStore.getState();
  const moduleData = store.modules[moduleId];
  
  if (!moduleData || !moduleData.completed) return false;
  
  const daysSinceLastVisit = Math.floor(
    (new Date().getTime() - new Date(moduleData.lastVisited).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Suggest review after 1 day for completed islands
  return daysSinceLastVisit >= 1;
}

/**
 * Get all islands that need spaced repetition review
 */
export function getIslandsNeedingReview(): string[] {
  const store = useLearningStore.getState();
  const moduleIds = Object.keys(store.modules);
  
  return moduleIds.filter(moduleId => checkIslandForSpacedRepetition(moduleId));
}

/**
 * Integration 6: Link confidence ratings to NPC dialogue
 * NPCs respond differently based on user's confidence and performance
 */
export function getNPCDialogueContext(npcId: NPCId, moduleId: string): {
  masteryLevel: number;
  masteryStars: 0 | 1 | 2 | 3 | 4 | 5;
  recentPerformance: 'excellent' | 'good' | 'struggling' | 'new';
  confidenceLevel: 'high' | 'medium' | 'low' | 'unknown';
} {
  const store = useLearningStore.getState();
  const moduleData = store.modules[moduleId];
  
  if (!moduleData) {
    return {
      masteryLevel: 0,
      masteryStars: 0,
      recentPerformance: 'new',
      confidenceLevel: 'unknown'
    };
  }

  const masteryStars = convertMasteryToStars(moduleData.masteryLevel);
  
  // Analyze recent quiz results (last 5)
  const recentQuizzes = moduleData.quizResults.slice(-5);
  const recentCorrect = recentQuizzes.filter(r => r.correct).length;
  const recentPerformance = 
    recentCorrect === 0 ? 'new' :
    recentCorrect >= 4 ? 'excellent' :
    recentCorrect >= 3 ? 'good' :
    'struggling';
  
  // Analyze recent confidence ratings
  const recentConfidence = moduleData.confidenceRatings.slice(-5);
  const avgConfidence = recentConfidence.length > 0
    ? recentConfidence.reduce((sum, r) => {
        const val = r.level === 'high' ? 3 : r.level === 'medium' ? 2 : 1;
        return sum + val;
      }, 0) / recentConfidence.length
    : 0;
  
  const confidenceLevel = 
    avgConfidence === 0 ? 'unknown' :
    avgConfidence >= 2.5 ? 'high' :
    avgConfidence >= 1.5 ? 'medium' :
    'low';

  return {
    masteryLevel: moduleData.masteryLevel,
    masteryStars,
    recentPerformance,
    confidenceLevel
  };
}

/**
 * Generate personalized NPC dialogue based on performance
 */
export function generatePersonalizedDialogue(
  npcId: NPCId,
  moduleId: string,
  baseDialogue: string
): string {
  const context = getNPCDialogueContext(npcId, moduleId);
  
  // Add personality-specific encouragement or challenge
  let personalizedDialogue = baseDialogue;
  
  if (context.recentPerformance === 'excellent') {
    personalizedDialogue += ' You\'re doing exceptionally well!';
  } else if (context.recentPerformance === 'struggling') {
    personalizedDialogue += ' Don\'t worry, quantum mechanics is tricky for everyone at first.';
  }
  
  if (context.confidenceLevel === 'low' && context.recentPerformance === 'good') {
    personalizedDialogue += ' You know more than you think - trust yourself!';
  } else if (context.confidenceLevel === 'high' && context.recentPerformance === 'struggling') {
    personalizedDialogue += ' Let\'s review the fundamentals together.';
  }
  
  return personalizedDialogue;
}

/**
 * Award XP for completing an interaction with appropriate bonuses
 */
export function awardInteractionXP(
  interactionType: keyof typeof XP_REWARDS,
  moduleId: string,
  wasCorrect?: boolean,
  confidenceLevel?: 'low' | 'medium' | 'high'
): void {
  const { addXP } = useLearningStore.getState();
  let xp = XP_REWARDS[interactionType];
  
  // Bonus for perfect confidence match
  if (wasCorrect !== undefined && confidenceLevel === 'high' && wasCorrect) {
    xp += XP_REWARDS.PERFECT_CONFIDENCE;
  }
  
  addXP(xp, `${interactionType}-${moduleId}`);
}

/**
 * Check if a boss should be unlocked based on island mastery
 */
export function checkBossUnlock(islandId: string): { unlocked: boolean; bossId?: string; requiredStars?: number } {
  const store = useLearningStore.getState();
  
  // Map islands to their bosses
  const islandToBossMap: Record<string, string> = {
    'superposition': 'measurement-monster',
    'entanglement': 'entanglement-enigma',
    'circuits': 'circuit-chaos',
    'algorithms': 'algorithm-anomaly',
    'hardware': 'decoherence-demon'
  };
  
  const bossId = islandToBossMap[islandId];
  if (!bossId) return { unlocked: false };
  
  const boss = getBossById(bossId);
  if (!boss) return { unlocked: false };
  
  // Check if already defeated
  if (store.defeatedBosses.includes(bossId)) {
    return { unlocked: true, bossId };
  }
  
  // Check mastery threshold
  const masteryStars = getIslandMasteryStars(islandId);
  const unlocked = masteryStars >= boss.masteryThreshold;
  
  return {
    unlocked,
    bossId,
    requiredStars: boss.masteryThreshold
  };
}

/**
 * Update NPC relationship based on quest completion and performance
 */
export function updateNPCRelationshipFromPerformance(
  npcId: NPCId,
  moduleId: string,
  questCompleted: boolean = false
): void {
  const { updateNPCRelationship } = useLearningStore.getState();
  const context = getNPCDialogueContext(npcId, moduleId);
  
  let relationshipDelta = 0;
  
  // Base relationship gain from quest completion
  if (questCompleted) {
    relationshipDelta += 10;
  }
  
  // Bonus for excellent performance
  if (context.recentPerformance === 'excellent') {
    relationshipDelta += 5;
  }
  
  // Bonus for high mastery
  if (context.masteryStars >= 4) {
    relationshipDelta += 5;
  }
  
  if (relationshipDelta > 0) {
    updateNPCRelationship(npcId, relationshipDelta);
  }
}

/**
 * Get suggested next steps for the player based on their progress
 */
export function getSuggestedNextSteps(): {
  type: 'quest' | 'review' | 'boss' | 'explore';
  id: string;
  reason: string;
  priority: number;
}[] {
  const store = useLearningStore.getState();
  const suggestions: {
    type: 'quest' | 'review' | 'boss' | 'explore';
    id: string;
    reason: string;
    priority: number;
  }[] = [];
  
  // Check for islands needing review (high priority)
  const islandsNeedingReview = getIslandsNeedingReview();
  islandsNeedingReview.forEach(moduleId => {
    suggestions.push({
      type: 'review',
      id: moduleId,
      reason: 'Time for spaced repetition review',
      priority: 3
    });
  });
  
  // Check for available bosses (high priority)
  const moduleIds = Object.keys(store.modules);
  moduleIds.forEach(moduleId => {
    const bossCheck = checkBossUnlock(moduleId);
    if (bossCheck.unlocked && bossCheck.bossId && !store.defeatedBosses.includes(bossCheck.bossId)) {
      suggestions.push({
        type: 'boss',
        id: bossCheck.bossId,
        reason: 'Boss battle available!',
        priority: 4
      });
    }
  });
  
  // Check for low mastery modules (medium priority)
  moduleIds.forEach(moduleId => {
    const recommendedQuests = getRecommendedQuestsForReview(moduleId);
    if (recommendedQuests.length > 0) {
      suggestions.push({
        type: 'quest',
        id: recommendedQuests[0],
        reason: `Improve mastery in ${moduleId}`,
        priority: 2
      });
    }
  });
  
  // Sort by priority (highest first)
  return suggestions.sort((a, b) => b.priority - a.priority);
}

/**
 * Track challenge completion and update relevant systems
 */
export function completeChallenge(
  moduleId: string,
  challengeId: string,
  wasCorrect: boolean,
  confidenceLevel?: 'low' | 'medium' | 'high'
): void {
  const { completeInteraction, updateModuleMastery } = useLearningStore.getState();
  
  // Record the interaction
  completeInteraction(moduleId, challengeId);
  
  // Award XP
  awardInteractionXP('INTERACTIVE_COMPLETION', moduleId, wasCorrect, confidenceLevel);
  
  // Update mastery
  updateModuleMastery(moduleId);
  
  // Check for boss unlock
  const bossCheck = checkBossUnlock(moduleId);
  if (bossCheck.unlocked && bossCheck.bossId) {
    console.log(`Boss ${bossCheck.bossId} is now available!`);
  }
}
