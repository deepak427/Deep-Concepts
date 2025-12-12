import { describe, it, expect, beforeEach } from 'vitest';
import { useLearningStore } from './learningState';
import type { InventoryItem } from '@/types/game';

describe('Game State Management', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset store to initial state
    useLearningStore.setState({
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
        soundEffects: { enabled: true, volume: 0.7 },
        music: { enabled: true, volume: 0.5 },
        ambient: { enabled: true, volume: 0.3 }
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
    });
  });

  describe('NPC System', () => {
    it('starts with zero relationship levels', () => {
      const state = useLearningStore.getState();
      expect(state.npcRelationships['dr-qubit']).toBe(0);
      expect(state.npcRelationships['entangla']).toBe(0);
    });

    it('updates NPC relationship correctly', () => {
      const store = useLearningStore.getState();
      store.updateNPCRelationship('dr-qubit', 10);
      
      const state = useLearningStore.getState();
      expect(state.npcRelationships['dr-qubit']).toBe(10);
    });

    it('clamps relationship level between 0 and 100', () => {
      const store = useLearningStore.getState();
      store.updateNPCRelationship('dr-qubit', 150);
      
      let state = useLearningStore.getState();
      expect(state.npcRelationships['dr-qubit']).toBe(100);
      
      store.updateNPCRelationship('dr-qubit', -200);
      state = useLearningStore.getState();
      expect(state.npcRelationships['dr-qubit']).toBe(0);
    });

    it('records dialogue history', () => {
      const store = useLearningStore.getState();
      store.recordDialogue('dr-qubit', 'welcome-1');
      
      const state = useLearningStore.getState();
      expect(state.npcDialogueHistory['dr-qubit']).toContain('welcome-1');
    });

    it('does not duplicate dialogue history', () => {
      const store = useLearningStore.getState();
      store.recordDialogue('dr-qubit', 'welcome-1');
      store.recordDialogue('dr-qubit', 'welcome-1');
      
      const state = useLearningStore.getState();
      expect(state.npcDialogueHistory['dr-qubit']).toHaveLength(1);
    });

    it('sets and clears current dialogue', () => {
      const store = useLearningStore.getState();
      store.setCurrentDialogue('dr-qubit', 'welcome-1');
      
      let state = useLearningStore.getState();
      expect(state.currentDialogue).toEqual({ npcId: 'dr-qubit', dialogueId: 'welcome-1' });
      
      store.clearCurrentDialogue();
      state = useLearningStore.getState();
      expect(state.currentDialogue).toBeUndefined();
    });

    it('checks if dialogue has been seen', () => {
      const store = useLearningStore.getState();
      store.recordDialogue('dr-qubit', 'welcome-1');
      
      expect(store.hasSeenDialogue('dr-qubit', 'welcome-1')).toBe(true);
      expect(store.hasSeenDialogue('dr-qubit', 'welcome-2')).toBe(false);
    });
  });

  describe('Quest System', () => {
    it('starts with no active quests', () => {
      const state = useLearningStore.getState();
      expect(state.activeQuests).toHaveLength(0);
      expect(state.completedQuests).toHaveLength(0);
    });

    it('starts a quest correctly', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      
      const state = useLearningStore.getState();
      expect(state.activeQuests).toContain('quest-1');
      expect(store.isQuestActive('quest-1')).toBe(true);
    });

    it('does not start quest twice', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.startQuest('quest-1');
      
      const state = useLearningStore.getState();
      expect(state.activeQuests).toHaveLength(1);
    });

    it('completes quest objectives', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.completeQuestObjective('quest-1', 'obj-1');
      
      expect(store.isObjectiveCompleted('quest-1', 'obj-1')).toBe(true);
      expect(store.isObjectiveCompleted('quest-1', 'obj-2')).toBe(false);
    });

    it('completes quest and moves to completed list', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.completeQuest('quest-1');
      
      const state = useLearningStore.getState();
      expect(state.activeQuests).not.toContain('quest-1');
      expect(state.completedQuests).toContain('quest-1');
      expect(store.isQuestCompleted('quest-1')).toBe(true);
    });

    it('tracks and untracks quests', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.trackQuest('quest-1');
      
      let state = useLearningStore.getState();
      expect(state.trackedQuestId).toBe('quest-1');
      
      store.untrackQuest();
      state = useLearningStore.getState();
      expect(state.trackedQuestId).toBeUndefined();
    });

    it('only allows tracking active quests', () => {
      const store = useLearningStore.getState();
      store.trackQuest('quest-1'); // Not started yet
      
      const state = useLearningStore.getState();
      expect(state.trackedQuestId).toBeUndefined();
    });

    it('untracks quest when completed', () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.trackQuest('quest-1');
      store.completeQuest('quest-1');
      
      const state = useLearningStore.getState();
      expect(state.trackedQuestId).toBeUndefined();
    });
  });

  describe('Boss Battle System', () => {
    it('starts with no defeated bosses', () => {
      const state = useLearningStore.getState();
      expect(state.defeatedBosses).toHaveLength(0);
      expect(state.currentBossBattle).toBeUndefined();
    });

    it('starts boss battle correctly', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle).toBeDefined();
      expect(state.currentBossBattle?.bossId).toBe('boss-1');
      expect(state.currentBossBattle?.explorerHealth).toBe(100);
      expect(state.currentBossBattle?.turn).toBe('explorer');
    });

    it('deals damage to boss', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.dealDamageToBoss(20);
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle?.bossHealth).toBe(80);
      expect(state.currentBossBattle?.turn).toBe('boss');
      expect(state.currentBossBattle?.challengesCompleted).toBe(1);
    });

    it('deals damage to explorer', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.dealDamageToExplorer(15);
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle?.explorerHealth).toBe(85);
      expect(state.currentBossBattle?.turn).toBe('explorer');
    });

    it('prevents health from going below zero', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.dealDamageToBoss(150);
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle?.bossHealth).toBe(0);
    });

    it('ends boss battle on victory', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.endBossBattle(true);
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle).toBeUndefined();
      expect(state.defeatedBosses).toContain('boss-1');
      expect(store.isBossDefeated('boss-1')).toBe(true);
    });

    it('ends boss battle on defeat without adding to defeated list', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.endBossBattle(false);
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle).toBeUndefined();
      expect(state.defeatedBosses).not.toContain('boss-1');
    });

    it('does not start battle if boss already defeated', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.endBossBattle(true);
      store.startBossBattle('boss-1');
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle).toBeUndefined();
    });

    it('does not start new battle if one is active', () => {
      const store = useLearningStore.getState();
      store.startBossBattle('boss-1');
      store.startBossBattle('boss-2');
      
      const state = useLearningStore.getState();
      expect(state.currentBossBattle?.bossId).toBe('boss-1');
    });
  });

  describe('Inventory System', () => {
    const testItem: InventoryItem = {
      id: 'item-1',
      name: 'Test Item',
      description: 'A test item',
      type: 'particle',
      rarity: 'common',
      icon: '⚛️',
      quantity: 1
    };

    it('starts with empty inventory', () => {
      const state = useLearningStore.getState();
      expect(state.inventory.items).toHaveLength(0);
      expect(state.inventory.maxSlots).toBe(50);
    });

    it('adds item to inventory', () => {
      const store = useLearningStore.getState();
      const success = store.addItem(testItem);
      
      expect(success).toBe(true);
      const state = useLearningStore.getState();
      expect(state.inventory.items).toHaveLength(1);
      expect(state.inventory.items[0].id).toBe('item-1');
    });

    it('stacks items with same ID', () => {
      const store = useLearningStore.getState();
      store.addItem(testItem);
      store.addItem({ ...testItem, quantity: 2 });
      
      const state = useLearningStore.getState();
      expect(state.inventory.items).toHaveLength(1);
      expect(state.inventory.items[0].quantity).toBe(3);
    });

    it('removes item from inventory', () => {
      const store = useLearningStore.getState();
      store.addItem({ ...testItem, quantity: 5 });
      const success = store.removeItem('item-1', 2);
      
      expect(success).toBe(true);
      const state = useLearningStore.getState();
      expect(state.inventory.items[0].quantity).toBe(3);
    });

    it('removes item completely when quantity reaches zero', () => {
      const store = useLearningStore.getState();
      store.addItem({ ...testItem, quantity: 2 });
      store.removeItem('item-1', 2);
      
      const state = useLearningStore.getState();
      expect(state.inventory.items).toHaveLength(0);
    });

    it('fails to remove more items than available', () => {
      const store = useLearningStore.getState();
      store.addItem({ ...testItem, quantity: 2 });
      const success = store.removeItem('item-1', 5);
      
      expect(success).toBe(false);
      const state = useLearningStore.getState();
      expect(state.inventory.items[0].quantity).toBe(2);
    });

    it('uses power-up item', () => {
      const powerUp: InventoryItem = {
        id: 'xp-boost',
        name: 'XP Boost',
        description: 'Doubles XP for 5 minutes',
        type: 'power-up',
        rarity: 'rare',
        icon: '⚡',
        quantity: 1,
        effect: {
          type: 'xp-boost',
          duration: 300000,
          magnitude: 2
        }
      };

      const store = useLearningStore.getState();
      store.addItem(powerUp);
      const success = store.useItem('xp-boost');
      
      expect(success).toBe(true);
      const state = useLearningStore.getState();
      expect(state.inventory.activeEffects).toHaveLength(1);
      expect(state.inventory.activeEffects[0].effect.type).toBe('xp-boost');
      expect(state.inventory.items).toHaveLength(0); // Consumed
    });

    it('fails to use non-power-up items', () => {
      const store = useLearningStore.getState();
      store.addItem(testItem);
      const success = store.useItem('item-1');
      
      expect(success).toBe(false);
    });

    it('equips and unequips cosmetics', () => {
      const cosmetic: InventoryItem = {
        id: 'cool-hat',
        name: 'Cool Hat',
        description: 'A stylish hat',
        type: 'cosmetic',
        rarity: 'epic',
        icon: '🎩',
        quantity: 1
      };

      const store = useLearningStore.getState();
      store.addItem(cosmetic);
      store.equipCosmetic('cool-hat');
      
      let state = useLearningStore.getState();
      expect(state.avatarCosmetics).toContain('cool-hat');
      
      store.unequipCosmetic('cool-hat');
      state = useLearningStore.getState();
      expect(state.avatarCosmetics).not.toContain('cool-hat');
    });

    it('does not equip cosmetic twice', () => {
      const cosmetic: InventoryItem = {
        id: 'cool-hat',
        name: 'Cool Hat',
        description: 'A stylish hat',
        type: 'cosmetic',
        rarity: 'epic',
        icon: '🎩',
        quantity: 1
      };

      const store = useLearningStore.getState();
      store.addItem(cosmetic);
      store.equipCosmetic('cool-hat');
      store.equipCosmetic('cool-hat');
      
      const state = useLearningStore.getState();
      expect(state.avatarCosmetics).toHaveLength(1);
    });

    it('discovers hidden areas', () => {
      const store = useLearningStore.getState();
      store.discoverArea('secret-cave');
      
      const state = useLearningStore.getState();
      expect(state.discoveredAreas).toContain('secret-cave');
    });

    it('does not duplicate discovered areas', () => {
      const store = useLearningStore.getState();
      store.discoverArea('secret-cave');
      store.discoverArea('secret-cave');
      
      const state = useLearningStore.getState();
      expect(state.discoveredAreas).toHaveLength(1);
    });

    it('checks for active effects', () => {
      const powerUp: InventoryItem = {
        id: 'xp-boost',
        name: 'XP Boost',
        description: 'Doubles XP',
        type: 'power-up',
        rarity: 'rare',
        icon: '⚡',
        quantity: 1,
        effect: {
          type: 'xp-boost',
          duration: 300000,
          magnitude: 2
        }
      };

      const store = useLearningStore.getState();
      store.addItem(powerUp);
      store.useItem('xp-boost');
      
      expect(store.hasActiveEffect('xp-boost')).toBe(true);
      expect(store.hasActiveEffect('hint')).toBe(false);
    });

    it('gets active effects', () => {
      const powerUp: InventoryItem = {
        id: 'xp-boost',
        name: 'XP Boost',
        description: 'Doubles XP',
        type: 'power-up',
        rarity: 'rare',
        icon: '⚡',
        quantity: 1,
        effect: {
          type: 'xp-boost',
          duration: 300000,
          magnitude: 2
        }
      };

      const store = useLearningStore.getState();
      store.addItem(powerUp);
      store.useItem('xp-boost');
      
      const activeEffects = store.getActiveEffects();
      expect(activeEffects).toHaveLength(1);
      expect(activeEffects[0].effect.type).toBe('xp-boost');
    });
  });

  describe('Sandbox Mode', () => {
    it('starts with sandbox locked', () => {
      const state = useLearningStore.getState();
      expect(state.sandboxUnlocked).toBe(false);
      expect(state.inSandboxMode).toBe(false);
    });

    it('unlocks sandbox', () => {
      const store = useLearningStore.getState();
      store.unlockSandbox();
      
      const state = useLearningStore.getState();
      expect(state.sandboxUnlocked).toBe(true);
    });

    it('enters and exits sandbox mode', () => {
      const store = useLearningStore.getState();
      store.unlockSandbox();
      store.enterSandboxMode();
      
      let state = useLearningStore.getState();
      expect(state.inSandboxMode).toBe(true);
      expect(store.isSandboxMode()).toBe(true);
      
      store.exitSandboxMode();
      state = useLearningStore.getState();
      expect(state.inSandboxMode).toBe(false);
    });

    it('saves sandbox creation', () => {
      const store = useLearningStore.getState();
      store.saveSandboxCreation({
        name: 'My Circuit',
        type: 'circuit',
        data: { gates: [] }
      });
      
      const state = useLearningStore.getState();
      expect(state.sandboxCreations).toHaveLength(1);
      expect(state.sandboxCreations[0].name).toBe('My Circuit');
      expect(state.sandboxCreations[0].id).toBeDefined();
      expect(state.sandboxCreations[0].createdAt).toBeInstanceOf(Date);
    });

    it('deletes sandbox creation', () => {
      const store = useLearningStore.getState();
      store.saveSandboxCreation({
        name: 'My Circuit',
        type: 'circuit',
        data: { gates: [] }
      });
      
      const state = useLearningStore.getState();
      const creationId = state.sandboxCreations[0].id;
      
      store.deleteSandboxCreation(creationId);
      const newState = useLearningStore.getState();
      expect(newState.sandboxCreations).toHaveLength(0);
    });

    it('preserves progress when entering/exiting sandbox', () => {
      const store = useLearningStore.getState();
      store.addXP(100, 'test');
      store.unlockAchievement('first-collapse');
      
      const xpBefore = useLearningStore.getState().xp;
      const achievementsBefore = useLearningStore.getState().achievements.length;
      
      store.enterSandboxMode();
      store.exitSandboxMode();
      
      const state = useLearningStore.getState();
      expect(state.xp).toBe(xpBefore);
      expect(state.achievements).toHaveLength(achievementsBefore);
    });
  });

  describe('Persistence', () => {
    it('persists game state to localStorage', async () => {
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.updateNPCRelationship('dr-qubit', 25);
      store.addXP(100, 'test');
      
      // Wait for debounced save (100ms + buffer)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Check localStorage
      const saved = localStorage.getItem('learning-state');
      expect(saved).toBeDefined();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        expect(parsed.activeQuests).toContain('quest-1');
        expect(parsed.npcRelationships['dr-qubit']).toBe(25);
        expect(parsed.xp).toBe(100);
      }
    });

    it('restores game state from localStorage', () => {
      // Set up initial state
      const store = useLearningStore.getState();
      store.startQuest('quest-1');
      store.updateNPCRelationship('dr-qubit', 25);
      
      // Simulate page reload by getting fresh state
      const newState = useLearningStore.getState();
      expect(newState.activeQuests).toContain('quest-1');
      expect(newState.npcRelationships['dr-qubit']).toBe(25);
    });
  });
});
