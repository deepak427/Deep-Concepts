// Example usage of the new module content structure

import {
  MODULE_CONTENT,
  getModuleContent,
  getRequiredInteractions,
  getModuleChallenges,
  getRetrievalQuestions,
  ACHIEVEMENT_CONDITIONS
} from './modules';
import { XP_REWARDS } from '@/lib/xpSystem';

// Example 1: Get complete module content
const bitsQubitsModule = getModuleContent('bits-qubits');
if (bitsQubitsModule) {
  console.log('Learning Objectives:', bitsQubitsModule.learningObjectives);
  console.log('Required Interactions:', bitsQubitsModule.requiredInteractions);
  console.log('Interactive Simulations:', bitsQubitsModule.interactiveSimulations);
}

// Example 2: Get required interactions for mastery calculation
const requiredInteractions = getRequiredInteractions('superposition');
console.log('Must complete:', requiredInteractions);
// Output: ['wave-interference', 'superposition-prediction']

// Example 3: Get all challenges in a module
const challenges = getModuleChallenges('gates');
console.log('Challenges:', challenges);
// Output: [
//   { id: 'puzzle-1', description: 'Create superposition using H gate', xpReward: 30 },
//   { id: 'puzzle-2', description: 'Create Bell state using H and CNOT', xpReward: 50 },
//   ...
// ]

// Example 4: Get retrieval practice questions
const questions = getRetrievalQuestions('entanglement');
console.log('Retrieval Questions:', questions);
// Output: Array of questions for active recall

// Example 5: Award XP for different activities
function awardXP(activityType: keyof typeof XP_REWARDS) {
  const xp = XP_REWARDS[activityType];
  console.log(`Awarded ${xp} XP for ${activityType}`);
  return xp;
}

awardXP('MODULE_COMPLETE'); // 100 XP
awardXP('QUIZ_CORRECT'); // 20 XP
awardXP('INTERACTIVE_COMPLETION'); // 30 XP

// Example 6: Check achievement unlock conditions
const firstCollapseCondition = ACHIEVEMENT_CONDITIONS['first-collapse'];
console.log('First Collapse Achievement:', firstCollapseCondition);
// Output: { type: 'interaction-count', interactionId: 'measurement-challenge', count: 1 }

// Example 7: Iterate through all modules
MODULE_CONTENT.forEach(module => {
  console.log(`Module: ${module.title}`);
  console.log(`  Learning Objectives: ${module.learningObjectives.length}`);
  console.log(`  Required Interactions: ${module.requiredInteractions.length}`);
  console.log(`  Retrieval Questions: ${module.retrievalPractice.length}`);
  console.log(`  Total Challenges: ${getModuleChallenges(module.id).length}`);
});

// Example 8: Find modules with specific simulation types
const modulesWithCircuitBuilder = MODULE_CONTENT.filter(module =>
  module.interactiveSimulations.some(sim => sim.type === 'circuit-builder')
);
console.log('Modules with Circuit Builder:', modulesWithCircuitBuilder.map(m => m.title));

// Example 9: Calculate total XP available in a module
function calculateModuleXP(moduleId: string) {
  const challenges = getModuleChallenges(moduleId as any);
  const challengeXP = challenges.reduce((sum, c) => sum + c.xpReward, 0);
  const moduleCompletionXP = XP_REWARDS.MODULE_COMPLETE;
  const quizXP = XP_REWARDS.QUIZ_CORRECT;

  return {
    challenges: challengeXP,
    completion: moduleCompletionXP,
    quiz: quizXP,
    total: challengeXP + moduleCompletionXP + quizXP
  };
}

console.log('XP available in Gates module:', calculateModuleXP('gates'));

// Example 10: Get all achievements that can be unlocked in a module
function getModuleAchievements(moduleId: string) {
  const challenges = getModuleChallenges(moduleId as any);
  const achievementIds = challenges
    .filter(c => c.achievementId)
    .map(c => c.achievementId);

  return achievementIds;
}

console.log('Achievements in Entanglement module:', getModuleAchievements('entanglement'));
