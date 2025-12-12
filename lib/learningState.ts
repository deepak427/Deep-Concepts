// Zustand store for learning state management

import { create } from 'zustand';
import type { LearningStore, LearningState, ModuleProgress, ReviewItem, QuizResult, ConfidenceRating, UserProfile } from '@/types/learning';
import type { NPCId, InventoryItem, ActiveEffect, ItemEffect } from '@/types/game';
import { calculateLevel } from './xpSystem';
import { calculateMastery } from './masteryCalculator';
import { getAchievementById, checkAchievementUnlock } from './achievementSystem';
import { createReviewItem } from './reviewScheduler';
import { persistenceService } from './persistence';
import { getRequiredInteractions } from '@/constants';

const STORAGE_KEY = 'learning-state';

// Extended state with game features
export interface GameState extends LearningState {
  // NPC System
  npcRelationships: Record<NPCId, number>; // 0-100 relationship level
  npcDialogueHistory: Record<NPCId, string[]>; // Dialogue IDs seen
  currentDialogue?: { npcId: NPCId; dialogueId: string };

  // Quest System
  activeQuests: string[]; // Quest IDs currently active
  completedQuests: string[]; // Quest IDs completed
  trackedQuestId?: string; // Currently tracked quest
  questObjectives: Record<string, Record<string, boolean>>; // questId -> objectiveId -> completed

  // Boss Battle System
  defeatedBosses: string[]; // Boss IDs that have been defeated
  currentBossBattle?: {
    bossId: string;
    explorerHealth: number;
    explorerMaxHealth: number;
    bossHealth: number;
    bossMaxHealth: number;
    challengesCompleted: number;
    turn: 'explorer' | 'boss';
  };

  // Inventory System
  inventory: {
    items: InventoryItem[];
    maxSlots: number;
    activeEffects: ActiveEffect[];
  };
  avatarCosmetics: string[]; // IDs of equipped cosmetic items
  discoveredAreas: string[]; // Hidden area IDs discovered

  // Sandbox Mode
  sandboxUnlocked: boolean;
  inSandboxMode: boolean;
  sandboxCreations: SandboxCreation[];
}

export interface SandboxCreation {
  id: string;
  name: string;
  type: 'circuit' | 'bloch-sphere' | 'wave-interference' | 'entanglement' | 'search' | 'decoherence';
  data: any; // Type-specific data
  createdAt: Date;
  thumbnail?: string; // Base64 image
}

// Initial state
const initialState: GameState = {
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
  lastSessionDate: undefined,
  audioConfig: {
    soundEffects: {
      enabled: true,
      volume: 0.7
    },
    music: {
      enabled: true,
      volume: 0.5
    },
    ambient: {
      enabled: true,
      volume: 0.3
    }
  },
  npcRelationships: {
    'dr-qubit': 0,
    'entangla': 0,
    'circuit-master': 0,
    'oracle': 0,
    'hardware-harry': 0
  },
  npcDialogueHistory: {
    'dr-qubit': [],
    'entangla': [],
    'circuit-master': [],
    'oracle': [],
    'hardware-harry': []
  },
  currentDialogue: undefined,
  activeQuests: [],
  completedQuests: [],
  trackedQuestId: undefined,
  questObjectives: {},
  defeatedBosses: [],
  currentBossBattle: undefined,
  inventory: {
    items: [],
    maxSlots: 50,
    activeEffects: []
  },
  avatarCosmetics: [],
  discoveredAreas: [],
  sandboxUnlocked: false,
  inSandboxMode: false,
  sandboxCreations: []
};

// Load persisted state
function loadPersistedState(): GameState {
  const persisted = persistenceService.load<Partial<GameState>>();
  return {
    ...initialState,
    ...persisted,
    // Ensure nested objects are merged correctly
    userProfile: { ...initialState.userProfile, ...(persisted?.userProfile || {}) },
    audioConfig: { ...initialState.audioConfig, ...(persisted?.audioConfig || {}) },
    npcRelationships: { ...initialState.npcRelationships, ...(persisted?.npcRelationships || {}) },
    npcDialogueHistory: { ...initialState.npcDialogueHistory, ...(persisted?.npcDialogueHistory || {}) },
    inventory: { ...initialState.inventory, ...(persisted?.inventory || {}) },
    // Ensure arrays are actually arrays (defensive coding against corrupted local storage)
    achievements: Array.isArray(persisted?.achievements) ? persisted.achievements : initialState.achievements,
    activeQuests: Array.isArray(persisted?.activeQuests) ? persisted.activeQuests : initialState.activeQuests,
    completedQuests: Array.isArray(persisted?.completedQuests) ? persisted.completedQuests : initialState.completedQuests,
    defeatedBosses: Array.isArray(persisted?.defeatedBosses) ? persisted.defeatedBosses : initialState.defeatedBosses,
    discoveredAreas: Array.isArray(persisted?.discoveredAreas) ? persisted.discoveredAreas : initialState.discoveredAreas,
    sandboxCreations: Array.isArray(persisted?.sandboxCreations) ? persisted.sandboxCreations : initialState.sandboxCreations,
  } as GameState;
}

// Save state to persistence
function saveState(state: GameState) {
  persistenceService.save(state);
}

// Extended store with game actions
export interface GameStore extends LearningStore {
  // NPC Actions
  npcRelationships: Record<NPCId, number>;
  npcDialogueHistory: Record<NPCId, string[]>;
  currentDialogue?: { npcId: NPCId; dialogueId: string };
  updateNPCRelationship: (npcId: NPCId, delta: number) => void;
  recordDialogue: (npcId: NPCId, dialogueId: string) => void;
  setCurrentDialogue: (npcId: NPCId, dialogueId: string) => void;
  clearCurrentDialogue: () => void;
  hasSeenDialogue: (npcId: NPCId, dialogueId: string) => boolean;

  // Quest Actions
  activeQuests: string[];
  completedQuests: string[];
  trackedQuestId?: string;
  questObjectives: Record<string, Record<string, boolean>>;
  startQuest: (questId: string) => void;
  completeQuestObjective: (questId: string, objectiveId: string) => void;
  completeQuest: (questId: string) => void;
  trackQuest: (questId: string) => void;
  untrackQuest: () => void;
  isQuestActive: (questId: string) => boolean;
  isQuestCompleted: (questId: string) => boolean;
  isObjectiveCompleted: (questId: string, objectiveId: string) => boolean;

  // Boss Battle Actions
  defeatedBosses: string[];
  currentBossBattle?: {
    bossId: string;
    explorerHealth: number;
    explorerMaxHealth: number;
    bossHealth: number;
    bossMaxHealth: number;
    challengesCompleted: number;
    turn: 'explorer' | 'boss';
  };
  startBossBattle: (bossId: string) => void;
  dealDamageToBoss: (damage: number) => void;
  dealDamageToExplorer: (damage: number) => void;
  endBossBattle: (victory: boolean) => void;
  isBossDefeated: (bossId: string) => boolean;
  isBossUnlocked: (bossId: string, masteryStars: number) => boolean;

  // Inventory Actions
  inventory: {
    items: InventoryItem[];
    maxSlots: number;
    activeEffects: ActiveEffect[];
  };
  avatarCosmetics: string[];
  discoveredAreas: string[];
  addItem: (item: InventoryItem) => boolean;
  removeItem: (itemId: string, quantity: number) => boolean;
  useItem: (itemId: string) => boolean;
  equipCosmetic: (itemId: string) => void;
  unequipCosmetic: (itemId: string) => void;
  discoverArea: (areaId: string) => void;
  getActiveEffects: () => ActiveEffect[];
  hasActiveEffect: (effectType: string) => boolean;
  cleanupExpiredEffects: () => void;

  // Sandbox Mode Actions
  sandboxUnlocked: boolean;
  inSandboxMode: boolean;
  sandboxCreations: SandboxCreation[];
  unlockSandbox: () => void;
  enterSandboxMode: () => void;
  exitSandboxMode: () => void;
  saveSandboxCreation: (creation: Omit<SandboxCreation, 'id' | 'createdAt'>) => void;
  deleteSandboxCreation: (creationId: string) => void;
  isSandboxMode: () => boolean;
}

export const useLearningStore = create<GameStore>((set, get) => ({
  ...loadPersistedState(),

  addXP: (amount: number, source: string) => {
    set((state) => {
      const newXP = state.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.level;

      const newState = {
        ...state,
        xp: newXP,
        level: newLevel
      };

      saveState(newState);

      if (leveledUp) {
        console.log(`Level up! Now level ${newLevel}`);
      }

      return newState;
    });
  },

  unlockAchievement: (id: string) => {
    set((state) => {
      if (!checkAchievementUnlock(id, state.achievements)) {
        return state;
      }

      const achievement = getAchievementById(id);
      if (!achievement) {
        console.warn(`Achievement ${id} not found`);
        return state;
      }

      const newState = {
        ...state,
        achievements: [
          ...state.achievements,
          {
            ...achievement,
            unlockedAt: new Date()
          }
        ]
      };

      saveState(newState);
      return newState;
    });
  },

  updateModuleMastery: (moduleId: string) => {
    set((state) => {
      const moduleData = state.modules[moduleId];
      if (!moduleData) {
        console.warn(`Module ${moduleId} not found`);
        return state;
      }

      // Get required interactions from module content
      const requiredInteractions = getRequiredInteractions(moduleId as any);
      const totalInteractions = Math.max(1, requiredInteractions.length);
      const mastery = calculateMastery(moduleData, totalInteractions);

      const newState = {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...moduleData,
            masteryLevel: mastery,
            completed: mastery >= 70 && moduleData.interactionsCompleted.length >= totalInteractions
          }
        }
      };

      saveState(newState);
      return newState;
    });
  },

  addToReviewQueue: (item: ReviewItem) => {
    set((state) => {
      // Check if item already exists
      const exists = state.reviewQueue.some(
        r => r.moduleId === item.moduleId && r.conceptId === item.conceptId
      );

      if (exists) {
        return state;
      }

      const newState = {
        ...state,
        reviewQueue: [...state.reviewQueue, item]
      };

      saveState(newState);
      return newState;
    });
  },

  completeInteraction: (moduleId: string, interactionId: string) => {
    set((state) => {
      const moduleData = state.modules[moduleId] || {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };

      // Check if interaction already completed
      if (moduleData.interactionsCompleted.includes(interactionId)) {
        return state;
      }

      const newState = {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...moduleData,
            interactionsCompleted: [...moduleData.interactionsCompleted, interactionId],
            lastVisited: new Date()
          }
        }
      };

      saveState(newState);
      return newState;
    });

    // Update mastery after interaction
    get().updateModuleMastery(moduleId);
  },

  recordQuizResult: (moduleId: string, result: QuizResult) => {
    set((state) => {
      const moduleData = state.modules[moduleId] || {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };

      const newState = {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...moduleData,
            quizResults: [...moduleData.quizResults, result],
            lastVisited: new Date()
          }
        }
      };

      saveState(newState);
      return newState;
    });

    // Add to review queue if incorrect or low confidence
    if (!result.correct || result.confidenceLevel === 'low') {
      const priority = !result.correct ? 3 : 2;
      const reviewItem = createReviewItem(
        moduleId,
        result.questionId,
        !result.correct ? 'incorrect' : 'low-confidence',
        priority
      );
      get().addToReviewQueue(reviewItem);
    }

    // Update mastery after quiz
    get().updateModuleMastery(moduleId);
  },

  recordConfidenceRating: (moduleId: string, rating: ConfidenceRating) => {
    set((state) => {
      const moduleData = state.modules[moduleId] || {
        completed: false,
        masteryLevel: 0,
        interactionsCompleted: [],
        quizResults: [],
        confidenceRatings: [],
        selfRating: 0,
        lastVisited: new Date()
      };

      const newState = {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...moduleData,
            confidenceRatings: [...moduleData.confidenceRatings, rating],
            lastVisited: new Date()
          }
        }
      };

      saveState(newState);
      return newState;
    });

    // Update mastery after confidence rating
    get().updateModuleMastery(moduleId);
  },

  setSelfRating: (moduleId: string, rating: number) => {
    set((state) => {
      const moduleData = state.modules[moduleId];
      if (!moduleData) {
        console.warn(`Module ${moduleId} not found`);
        return state;
      }

      const newState = {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...moduleData,
            selfRating: rating,
            lastVisited: new Date()
          }
        }
      };

      saveState(newState);
      return newState;
    });

    // Add to review queue if low self-rating
    if (rating <= 2) {
      const reviewItem = createReviewItem(
        moduleId,
        'self-assessment',
        'low-confidence',
        2
      );
      get().addToReviewQueue(reviewItem);
    }

    // Update mastery after self-rating
    get().updateModuleMastery(moduleId);
  },

  completeOnboarding: (profile: UserProfile) => {
    set((state) => {
      const newState = {
        ...state,
        userProfile: profile
      };

      saveState(newState);
      return newState;
    });
  },

  removeFromReviewQueue: (moduleId: string, conceptId: string) => {
    set((state) => {
      const newState = {
        ...state,
        reviewQueue: state.reviewQueue.filter(
          item => !(item.moduleId === moduleId && item.conceptId === conceptId)
        )
      };

      saveState(newState);
      return newState;
    });
  },

  updateLastSession: () => {
    set((state) => {
      const newState = {
        ...state,
        lastSessionDate: new Date()
      };

      saveState(newState);
      return newState;
    });
  },

  checkSpacedRepetition: () => {
    const state = get();
    const currentDate = new Date();

    Object.entries(state.modules).forEach(([moduleId, moduleData]) => {
      if (!moduleData.completed) return;

      const daysSinceLastVisit = Math.floor(
        (currentDate.getTime() - new Date(moduleData.lastVisited).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if module needs spaced repetition review (1 day after completion)
      if (daysSinceLastVisit >= 1) {
        // Check if already in review queue
        const alreadyInQueue = state.reviewQueue.some(
          item => item.moduleId === moduleId && item.reason === 'spaced-repetition'
        );

        if (!alreadyInQueue) {
          const reviewItem = createReviewItem(
            moduleId,
            'module-review',
            'spaced-repetition',
            1
          );
          get().addToReviewQueue(reviewItem);
        }
      }
    });
  },

  // NPC Actions
  updateNPCRelationship: (npcId: NPCId, delta: number) => {
    set((state) => {
      const currentLevel = state.npcRelationships[npcId] || 0;
      const newLevel = Math.max(0, Math.min(100, currentLevel + delta));

      const newState = {
        ...state,
        npcRelationships: {
          ...state.npcRelationships,
          [npcId]: newLevel
        }
      };

      saveState(newState);
      return newState;
    });
  },

  recordDialogue: (npcId: NPCId, dialogueId: string) => {
    set((state) => {
      const history = state.npcDialogueHistory[npcId] || [];

      // Don't add duplicates
      if (history.includes(dialogueId)) {
        return state;
      }

      const newState = {
        ...state,
        npcDialogueHistory: {
          ...state.npcDialogueHistory,
          [npcId]: [...history, dialogueId]
        }
      };

      saveState(newState);
      return newState;
    });
  },

  setCurrentDialogue: (npcId: NPCId, dialogueId: string) => {
    set((state) => ({
      ...state,
      currentDialogue: { npcId, dialogueId }
    }));

    // Record that we've seen this dialogue
    get().recordDialogue(npcId, dialogueId);
  },

  clearCurrentDialogue: () => {
    set((state) => ({
      ...state,
      currentDialogue: undefined
    }));
  },

  hasSeenDialogue: (npcId: NPCId, dialogueId: string) => {
    const state = get();
    const history = state.npcDialogueHistory[npcId] || [];
    return history.includes(dialogueId);
  },

  // Quest Actions
  startQuest: (questId: string) => {
    set((state) => {
      // Don't start if already active or completed
      if (state.activeQuests.includes(questId) || state.completedQuests.includes(questId)) {
        return state;
      }

      const newState = {
        ...state,
        activeQuests: [...state.activeQuests, questId],
        questObjectives: {
          ...state.questObjectives,
          [questId]: {} // Initialize empty objectives for this quest
        }
      };

      saveState(newState);
      return newState;
    });
  },

  completeQuestObjective: (questId: string, objectiveId: string) => {
    set((state) => {
      const questObjectives = state.questObjectives[questId] || {};

      const newState = {
        ...state,
        questObjectives: {
          ...state.questObjectives,
          [questId]: {
            ...questObjectives,
            [objectiveId]: true
          }
        }
      };

      saveState(newState);
      return newState;
    });
  },

  completeQuest: (questId: string) => {
    set((state) => {
      // Remove from active quests
      const activeQuests = state.activeQuests.filter(id => id !== questId);

      // Add to completed quests if not already there
      const completedQuests = state.completedQuests.includes(questId)
        ? state.completedQuests
        : [...state.completedQuests, questId];

      // Untrack if this was the tracked quest
      const trackedQuestId = state.trackedQuestId === questId ? undefined : state.trackedQuestId;

      const newState = {
        ...state,
        activeQuests,
        completedQuests,
        trackedQuestId
      };

      saveState(newState);
      return newState;
    });
  },

  trackQuest: (questId: string) => {
    set((state) => {
      // Only track if quest is active
      if (!state.activeQuests.includes(questId)) {
        return state;
      }

      const newState = {
        ...state,
        trackedQuestId: questId
      };

      saveState(newState);
      return newState;
    });
  },

  untrackQuest: () => {
    set((state) => {
      const newState = {
        ...state,
        trackedQuestId: undefined
      };

      saveState(newState);
      return newState;
    });
  },

  isQuestActive: (questId: string) => {
    const state = get();
    return state.activeQuests.includes(questId);
  },

  isQuestCompleted: (questId: string) => {
    const state = get();
    return state.completedQuests.includes(questId);
  },

  isObjectiveCompleted: (questId: string, objectiveId: string) => {
    const state = get();
    const questObjectives = state.questObjectives[questId] || {};
    return questObjectives[objectiveId] === true;
  },

  // Boss Battle Actions
  startBossBattle: (bossId: string) => {
    set((state) => {
      // Don't start if already defeated
      if (state.defeatedBosses.includes(bossId)) {
        console.warn(`Boss ${bossId} already defeated`);
        return state;
      }

      // Don't start if battle already active
      if (state.currentBossBattle) {
        console.warn('A boss battle is already in progress');
        return state;
      }

      const newState = {
        ...state,
        currentBossBattle: {
          bossId,
          explorerHealth: 100,
          explorerMaxHealth: 100,
          bossHealth: 100, // Will be set by component based on boss data
          bossMaxHealth: 100,
          challengesCompleted: 0,
          turn: 'explorer' as const
        }
      };

      saveState(newState);
      return newState;
    });
  },

  dealDamageToBoss: (damage: number) => {
    set((state) => {
      if (!state.currentBossBattle) {
        console.warn('No active boss battle');
        return state;
      }

      const newHealth = Math.max(0, state.currentBossBattle.bossHealth - damage);

      const newState = {
        ...state,
        currentBossBattle: {
          ...state.currentBossBattle,
          bossHealth: newHealth,
          challengesCompleted: state.currentBossBattle.challengesCompleted + 1,
          turn: 'boss' as const
        }
      };

      saveState(newState);
      return newState;
    });
  },

  dealDamageToExplorer: (damage: number) => {
    set((state) => {
      if (!state.currentBossBattle) {
        console.warn('No active boss battle');
        return state;
      }

      const newHealth = Math.max(0, state.currentBossBattle.explorerHealth - damage);

      const newState = {
        ...state,
        currentBossBattle: {
          ...state.currentBossBattle,
          explorerHealth: newHealth,
          turn: 'explorer' as const
        }
      };

      saveState(newState);
      return newState;
    });
  },

  endBossBattle: (victory: boolean) => {
    set((state) => {
      if (!state.currentBossBattle) {
        console.warn('No active boss battle');
        return state;
      }

      const bossId = state.currentBossBattle.bossId;

      // Add to defeated bosses if victory
      const defeatedBosses = victory && !state.defeatedBosses.includes(bossId)
        ? [...state.defeatedBosses, bossId]
        : state.defeatedBosses;

      const newState = {
        ...state,
        defeatedBosses,
        currentBossBattle: undefined
      };

      saveState(newState);
      return newState;
    });
  },

  isBossDefeated: (bossId: string) => {
    const state = get();
    return state.defeatedBosses.includes(bossId);
  },

  isBossUnlocked: (bossId: string, masteryStars: number) => {
    // Import boss data to check threshold
    const { getBossById } = require('@/constants/bosses');
    const boss = getBossById(bossId);
    if (!boss) return false;
    return masteryStars >= boss.masteryThreshold;
  },

  // Inventory Actions
  addItem: (item: InventoryItem) => {
    const state = get();

    // Check if inventory is full
    const totalItems = state.inventory.items.reduce((sum, i) => sum + i.quantity, 0);
    if (totalItems >= state.inventory.maxSlots) {
      console.warn('Inventory is full');
      return false;
    }

    set((state) => {
      // Check if item already exists
      const existingItemIndex = state.inventory.items.findIndex(i => i.id === item.id);

      let newItems: InventoryItem[];
      if (existingItemIndex >= 0) {
        // Update quantity
        newItems = [...state.inventory.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
      } else {
        // Add new item
        newItems = [...state.inventory.items, item];
      }

      const newState = {
        ...state,
        inventory: {
          ...state.inventory,
          items: newItems
        }
      };

      saveState(newState);
      return newState;
    });

    return true;
  },

  removeItem: (itemId: string, quantity: number) => {
    const state = get();
    const item = state.inventory.items.find(i => i.id === itemId);

    if (!item || item.quantity < quantity) {
      console.warn(`Cannot remove ${quantity} of item ${itemId}`);
      return false;
    }

    set((state) => {
      const newItems = state.inventory.items
        .map(i => {
          if (i.id === itemId) {
            return { ...i, quantity: i.quantity - quantity };
          }
          return i;
        })
        .filter(i => i.quantity > 0);

      const newState = {
        ...state,
        inventory: {
          ...state.inventory,
          items: newItems
        }
      };

      saveState(newState);
      return newState;
    });

    return true;
  },

  useItem: (itemId: string) => {
    const state = get();
    const item = state.inventory.items.find(i => i.id === itemId);

    if (!item) {
      console.warn(`Item ${itemId} not found`);
      return false;
    }

    // Only power-ups can be used
    if (item.type !== 'power-up' || !item.effect) {
      console.warn(`Item ${itemId} cannot be used`);
      return false;
    }

    // Create active effect
    const activeEffect: ActiveEffect = {
      itemId: item.id,
      effect: item.effect,
      startTime: new Date(),
      endTime: item.effect.duration
        ? new Date(Date.now() + item.effect.duration)
        : undefined
    };

    set((state) => {
      const newState = {
        ...state,
        inventory: {
          ...state.inventory,
          activeEffects: [...state.inventory.activeEffects, activeEffect]
        }
      };

      saveState(newState);
      return newState;
    });

    // Remove one from inventory
    get().removeItem(itemId, 1);

    return true;
  },

  equipCosmetic: (itemId: string) => {
    const state = get();
    const item = state.inventory.items.find(i => i.id === itemId);

    if (!item || item.type !== 'cosmetic') {
      console.warn(`Cosmetic item ${itemId} not found`);
      return;
    }

    // Don't equip if already equipped
    if (state.avatarCosmetics.includes(itemId)) {
      return;
    }

    set((state) => {
      const newState = {
        ...state,
        avatarCosmetics: [...state.avatarCosmetics, itemId]
      };

      saveState(newState);
      return newState;
    });
  },

  unequipCosmetic: (itemId: string) => {
    set((state) => {
      const newState = {
        ...state,
        avatarCosmetics: state.avatarCosmetics.filter(id => id !== itemId)
      };

      saveState(newState);
      return newState;
    });
  },

  discoverArea: (areaId: string) => {
    const state = get();

    // Don't add if already discovered
    if (state.discoveredAreas.includes(areaId)) {
      return;
    }

    set((state) => {
      const newState = {
        ...state,
        discoveredAreas: [...state.discoveredAreas, areaId]
      };

      saveState(newState);
      return newState;
    });
  },

  getActiveEffects: () => {
    const state = get();
    const now = new Date();

    // Filter out expired effects
    return state.inventory.activeEffects.filter(effect => {
      if (!effect.endTime) return true; // Permanent effects
      return new Date(effect.endTime) > now;
    });
  },

  hasActiveEffect: (effectType: string) => {
    const activeEffects = get().getActiveEffects();
    return activeEffects.some(effect => effect.effect.type === effectType);
  },

  cleanupExpiredEffects: () => {
    set((state) => {
      const now = new Date();
      const activeEffects = state.inventory.activeEffects.filter(effect => {
        if (!effect.endTime) return true;
        return new Date(effect.endTime) > now;
      });

      const newState = {
        ...state,
        inventory: {
          ...state.inventory,
          activeEffects
        }
      };

      saveState(newState);
      return newState;
    });
  },

  // Sandbox Mode Actions
  unlockSandbox: () => {
    set((state) => {
      const newState = {
        ...state,
        sandboxUnlocked: true
      };

      saveState(newState);
      return newState;
    });
  },

  enterSandboxMode: () => {
    set((state) => {
      // Store current state before entering sandbox
      const newState = {
        ...state,
        inSandboxMode: true
      };

      saveState(newState);
      return newState;
    });
  },

  exitSandboxMode: () => {
    set((state) => {
      // Restore normal mode without affecting progress
      const newState = {
        ...state,
        inSandboxMode: false
      };

      saveState(newState);
      return newState;
    });
  },

  saveSandboxCreation: (creation: Omit<SandboxCreation, 'id' | 'createdAt'>) => {
    set((state) => {
      const newCreation: SandboxCreation = {
        ...creation,
        id: `sandbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      const newState = {
        ...state,
        sandboxCreations: [...state.sandboxCreations, newCreation]
      };

      saveState(newState);
      return newState;
    });
  },

  deleteSandboxCreation: (creationId: string) => {
    set((state) => {
      const newState = {
        ...state,
        sandboxCreations: state.sandboxCreations.filter(c => c.id !== creationId)
      };

      saveState(newState);
      return newState;
    });
  },

  isSandboxMode: () => {
    const state = get();
    return state.inSandboxMode;
  },

  // Audio Actions
  updateAudioConfig: (config: Partial<import('@/types/learning').AudioConfig>) => {
    set((state) => {
      const newAudioConfig = {
        ...state.audioConfig,
        ...(config.soundEffects && {
          soundEffects: { ...state.audioConfig.soundEffects, ...config.soundEffects }
        }),
        ...(config.music && {
          music: { ...state.audioConfig.music, ...config.music }
        }),
        ...(config.ambient && {
          ambient: { ...state.audioConfig.ambient, ...config.ambient }
        })
      };

      const newState = {
        ...state,
        audioConfig: newAudioConfig
      };

      saveState(newState);
      return newState;
    });
  }
}));
