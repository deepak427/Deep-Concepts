import type { InventoryItem } from '@/types/game';

// Particle Items
export const PARTICLES: InventoryItem[] = [
  {
    id: 'qubit-particle',
    name: 'Quantum Particle',
    description: 'A mysterious quantum particle that exists in superposition.',
    type: 'particle',
    rarity: 'common',
    icon: '⚛️',
    quantity: 1
  },
  {
    id: 'entangled-pair',
    name: 'Entangled Pair',
    description: 'Two particles forever connected by quantum entanglement.',
    type: 'particle',
    rarity: 'rare',
    icon: '🔗',
    quantity: 1
  },
  {
    id: 'superposition-crystal',
    name: 'Superposition Crystal',
    description: 'A crystal that exists in multiple states simultaneously.',
    type: 'particle',
    rarity: 'epic',
    icon: '💠',
    quantity: 1
  },
  {
    id: 'quantum-foam',
    name: 'Quantum Foam',
    description: 'The fabric of spacetime at the smallest scales.',
    type: 'particle',
    rarity: 'legendary',
    icon: '✨',
    quantity: 1
  }
];

// Power-up Items
export const POWERUPS: InventoryItem[] = [
  {
    id: 'xp-boost-small',
    name: 'XP Boost (Small)',
    description: 'Increases XP gain by 50% for 5 minutes.',
    type: 'power-up',
    rarity: 'common',
    icon: '⚡',
    quantity: 1,
    effect: {
      type: 'xp-boost',
      magnitude: 1.5,
      duration: 300000 // 5 minutes
    }
  },
  {
    id: 'xp-boost-large',
    name: 'XP Boost (Large)',
    description: 'Doubles XP gain for 10 minutes.',
    type: 'power-up',
    rarity: 'rare',
    icon: '⚡',
    quantity: 1,
    effect: {
      type: 'xp-boost',
      magnitude: 2,
      duration: 600000 // 10 minutes
    }
  },
  {
    id: 'hint-crystal',
    name: 'Hint Crystal',
    description: 'Reveals a helpful hint for the current challenge.',
    type: 'power-up',
    rarity: 'rare',
    icon: '💎',
    quantity: 1,
    effect: {
      type: 'hint'
    }
  },
  {
    id: 'challenge-skip',
    name: 'Challenge Skip',
    description: 'Skip a difficult challenge without penalty.',
    type: 'power-up',
    rarity: 'epic',
    icon: '🎫',
    quantity: 1,
    effect: {
      type: 'skip-challenge'
    }
  },
  {
    id: 'secret-revealer',
    name: 'Secret Revealer',
    description: 'Reveals all hidden areas on the current island.',
    type: 'power-up',
    rarity: 'legendary',
    icon: '🔮',
    quantity: 1,
    effect: {
      type: 'reveal-hidden'
    }
  }
];

// Cosmetic Items
export const COSMETICS: InventoryItem[] = [
  {
    id: 'lab-coat',
    name: 'Lab Coat',
    description: 'A pristine white lab coat for the aspiring quantum scientist.',
    type: 'cosmetic',
    rarity: 'common',
    icon: '🥼',
    quantity: 1
  },
  {
    id: 'quantum-goggles',
    name: 'Quantum Goggles',
    description: 'Stylish goggles that let you see probability waves.',
    type: 'cosmetic',
    rarity: 'rare',
    icon: '🥽',
    quantity: 1
  },
  {
    id: 'entanglement-badge',
    name: 'Entanglement Badge',
    description: 'A badge showing your mastery of quantum entanglement.',
    type: 'cosmetic',
    rarity: 'epic',
    icon: '🏅',
    quantity: 1
  },
  {
    id: 'quantum-crown',
    name: 'Quantum Crown',
    description: 'The ultimate symbol of quantum mastery.',
    type: 'cosmetic',
    rarity: 'legendary',
    icon: '👑',
    quantity: 1
  },
  {
    id: 'superposition-cape',
    name: 'Superposition Cape',
    description: 'A cape that exists in multiple colors at once.',
    type: 'cosmetic',
    rarity: 'legendary',
    icon: '🦸',
    quantity: 1
  }
];

// Tool Items
export const TOOLS: InventoryItem[] = [
  {
    id: 'measurement-device',
    name: 'Measurement Device',
    description: 'Precision instrument for measuring quantum states.',
    type: 'tool',
    rarity: 'common',
    icon: '📏',
    quantity: 1
  },
  {
    id: 'circuit-builder',
    name: 'Circuit Builder',
    description: 'Advanced tool for constructing quantum circuits.',
    type: 'tool',
    rarity: 'rare',
    icon: '🔧',
    quantity: 1
  },
  {
    id: 'bloch-sphere-analyzer',
    name: 'Bloch Sphere Analyzer',
    description: 'Visualize and manipulate qubits in 3D space.',
    type: 'tool',
    rarity: 'epic',
    icon: '🔬',
    quantity: 1
  },
  {
    id: 'quantum-simulator',
    name: 'Quantum Simulator',
    description: 'Simulate complex quantum systems with ease.',
    type: 'tool',
    rarity: 'legendary',
    icon: '🖥️',
    quantity: 1
  }
];

// All items combined
export const ALL_ITEMS: InventoryItem[] = [
  ...PARTICLES,
  ...POWERUPS,
  ...COSMETICS,
  ...TOOLS
];

// Helper function to get item by ID
export function getItemById(id: string): InventoryItem | undefined {
  return ALL_ITEMS.find(item => item.id === id);
}

// Helper function to get items by type
export function getItemsByType(type: InventoryItem['type']): InventoryItem[] {
  return ALL_ITEMS.filter(item => item.type === type);
}

// Helper function to get items by rarity
export function getItemsByRarity(rarity: InventoryItem['rarity']): InventoryItem[] {
  return ALL_ITEMS.filter(item => item.rarity === rarity);
}

// Hidden area rewards
export const HIDDEN_AREA_REWARDS: Record<string, InventoryItem[]> = {
  'secret-lab': [
    { ...getItemById('quantum-simulator')!, quantity: 1 },
    { ...getItemById('xp-boost-large')!, quantity: 2 }
  ],
  'quantum-vault': [
    { ...getItemById('quantum-crown')!, quantity: 1 },
    { ...getItemById('secret-revealer')!, quantity: 1 }
  ],
  'probability-cave': [
    { ...getItemById('superposition-crystal')!, quantity: 3 },
    { ...getItemById('hint-crystal')!, quantity: 2 }
  ],
  'entanglement-nexus': [
    { ...getItemById('entangled-pair')!, quantity: 5 },
    { ...getItemById('entanglement-badge')!, quantity: 1 }
  ]
};

// Quest rewards
export const QUEST_ITEM_REWARDS: Record<string, InventoryItem[]> = {
  'first-measurement': [
    { ...getItemById('measurement-device')!, quantity: 1 }
  ],
  'circuit-master': [
    { ...getItemById('circuit-builder')!, quantity: 1 },
    { ...getItemById('xp-boost-small')!, quantity: 1 }
  ],
  'entanglement-expert': [
    { ...getItemById('entangled-pair')!, quantity: 2 },
    { ...getItemById('entanglement-badge')!, quantity: 1 }
  ],
  'quantum-champion': [
    { ...getItemById('quantum-crown')!, quantity: 1 },
    { ...getItemById('quantum-simulator')!, quantity: 1 }
  ]
};

// Boss defeat rewards
export const BOSS_ITEM_REWARDS: Record<string, InventoryItem[]> = {
  'measurement-monster': [
    { ...getItemById('bloch-sphere-analyzer')!, quantity: 1 },
    { ...getItemById('xp-boost-large')!, quantity: 1 }
  ],
  'superposition-sphinx': [
    { ...getItemById('superposition-crystal')!, quantity: 1 },
    { ...getItemById('superposition-cape')!, quantity: 1 }
  ],
  'entanglement-entity': [
    { ...getItemById('quantum-foam')!, quantity: 1 },
    { ...getItemById('secret-revealer')!, quantity: 1 }
  ]
};
