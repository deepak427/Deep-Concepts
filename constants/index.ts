// Central export point for all constants

export {
  MODULE_CONTENT,
  getModuleContent,
  getRequiredInteractions,
  getModuleChallenges,
  getRetrievalQuestions,
  ACHIEVEMENT_CONDITIONS
} from './modules';

export { XP_REWARDS } from '@/lib/xpSystem';

export type {
  ModuleContent,
  RetrievalQuestion,
  InteractiveSimulation,
  Challenge
} from './modules';

export { MODULES } from './legacy';

export {
  PARTICLES,
  POWERUPS,
  COSMETICS,
  TOOLS,
  ALL_ITEMS,
  getItemById,
  getItemsByType,
  getItemsByRarity,
  HIDDEN_AREA_REWARDS,
  QUEST_ITEM_REWARDS,
  BOSS_ITEM_REWARDS
} from './items';
