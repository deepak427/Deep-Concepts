// Game-specific types for Quantum Quest

export type NPCId = 'dr-qubit' | 'entangla' | 'circuit-master' | 'oracle' | 'hardware-harry';

export interface NPC {
  id: NPCId;
  name: string;
  title: string;
  personality: string;
  location: string;
  avatar: string; // emoji for now, can be image later
  dialogues: NPCDialogue[];
  questsAvailable: string[];
}

export interface NPCDialogue {
  id: string;
  text: string;
  emotion?: 'happy' | 'excited' | 'mysterious' | 'challenging' | 'grumpy' | 'wise' | 'confused' | 'nervous' | 'neutral';
  choices?: DialogueChoice[];
  nextDialogue?: string;
  triggersQuest?: string;
}

export interface DialogueChoice {
  text: string;
  nextDialogue: string;
  requiresLevel?: number;
}

export interface Quest {
  id: string;
  npcId: NPCId;
  title: string;
  description: string;
  islandId: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'main' | 'side' | 'daily' | 'hidden';
  prerequisites: string[]; // Quest IDs that must be completed first
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'experiment' | 'puzzle' | 'boss' | 'collect' | 'discover';
  targetId: string; // ID of the challenge/item/area
  completed: boolean;
}

export interface QuestReward {
  xp: number;
  items?: Array<{ id: string; quantity: number }>;
  unlocksIsland?: string;
  unlocksBoss?: string;
  achievementId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'particle' | 'power-up' | 'cosmetic' | 'tool';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  quantity: number;
  effect?: ItemEffect;
}

export interface ItemEffect {
  type: 'xp-boost' | 'hint' | 'skip-challenge' | 'reveal-hidden';
  duration?: number; // milliseconds, if temporary
  magnitude?: number; // e.g., 1.5 for 50% XP boost
}

export interface ActiveEffect {
  itemId: string;
  effect: ItemEffect;
  startTime: Date;
  endTime?: Date;
}

export interface Inventory {
  items: InventoryItem[];
  maxSlots: number;
  activeEffects: ActiveEffect[];
}

export interface Island {
  id: string;
  name: string;
  description: string;
  npcId: NPCId;
  color: string;
  glowColor: string;
  position: { x: number; y: number };
  unlocked: boolean;
  masteryStars: number; // 0-5
  questsCompleted: number;
  totalQuests: number;
}

export type ParticleEffectType =
  | 'quantum-foam'
  | 'probability-cloud'
  | 'entanglement-beam'
  | 'measurement-collapse'
  | 'teleport-trail'
  | 'xp-gain'
  | 'level-up'
  | 'achievement-unlock'
  | 'explosion';

export interface ParticleEffect {
  id: string;
  type: ParticleEffectType;
  position: { x: number; y: number };
  color: string;
  duration: number;
  intensity: number;
}
