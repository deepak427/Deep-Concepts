// Quest data models and constants for Quantum Quest

import type { Quest, QuestObjective, QuestReward, NPCId } from '@/types/game';

// Quest definitions for each island/NPC
export const QUESTS: Record<string, Quest> = {
  // Dr. Qubit's Quests (Superposition Island)
  'superposition-basics': {
    id: 'superposition-basics',
    title: 'First Steps in Superposition',
    description: 'Learn the basics of quantum superposition by experimenting with the Bloch Sphere.',
    npcId: 'dr-qubit',
    islandId: 'superposition-island',
    objectives: [
      {
        id: 'rotate-qubit',
        description: 'Rotate the qubit on the Bloch Sphere',
        type: 'experiment',
        targetId: 'bloch-sphere-rotation',
        completed: false
      },
      {
        id: 'measure-qubit',
        description: 'Measure the qubit 10 times',
        type: 'experiment',
        targetId: 'bloch-sphere-measurement',
        completed: false
      }
    ],
    rewards: {
      xp: 50,
      items: [{ id: 'quantum-particle-common', quantity: 1 }]
    },
    difficulty: 1,
    type: 'main',
    prerequisites: []
  },

  'wave-mastery': {
    id: 'wave-mastery',
    title: 'Master of Interference',
    description: 'Understand wave interference and how it creates probability distributions.',
    npcId: 'dr-qubit',
    islandId: 'superposition-island',
    objectives: [
      {
        id: 'adjust-phases',
        description: 'Adjust wave phases to create constructive interference',
        type: 'experiment',
        targetId: 'wave-interference-constructive',
        completed: false
      },
      {
        id: 'predict-outcome',
        description: 'Correctly predict 3 wave interference outcomes',
        type: 'puzzle',
        targetId: 'wave-prediction-challenge',
        completed: false
      }
    ],
    rewards: {
      xp: 75,
      items: [{ id: 'probability-cloud', quantity: 1 }],
      achievementId: 'wave-master'
    },
    difficulty: 2,
    type: 'main',
    prerequisites: ['superposition-basics']
  },

  'prediction-challenge': {
    id: 'prediction-challenge',
    title: 'The Prediction Challenge',
    description: 'Test your understanding by predicting measurement outcomes.',
    npcId: 'dr-qubit',
    islandId: 'superposition-island',
    objectives: [
      {
        id: 'predict-75-percent',
        description: 'Set a qubit with 75% probability of measuring 1',
        type: 'puzzle',
        targetId: 'probability-challenge',
        completed: false
      }
    ],
    rewards: {
      xp: 100,
      achievementId: 'superposition-adept',
      unlocksBoss: 'measurement-monster'
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['wave-mastery']
  },

  // Entangla's Quests (Entanglement Valley)
  'bell-state-quest': {
    id: 'bell-state-quest',
    title: 'Creating Quantum Correlations',
    description: 'Learn to create and measure Bell states.',
    npcId: 'entangla',
    islandId: 'entanglement-valley',
    objectives: [
      {
        id: 'create-bell-state',
        description: 'Create a Bell state',
        type: 'experiment',
        targetId: 'bell-state-creation',
        completed: false
      },
      {
        id: 'measure-correlation',
        description: 'Measure both qubits 20 times and observe correlation',
        type: 'experiment',
        targetId: 'correlation-measurement',
        completed: false
      }
    ],
    rewards: {
      xp: 80,
      items: [{ id: 'entanglement-beam', quantity: 1 }]
    },
    difficulty: 2,
    type: 'main',
    prerequisites: ['prediction-challenge']
  },

  'correlation-study': {
    id: 'correlation-study',
    title: 'The Nature of Correlation',
    description: 'Study the statistical properties of entangled measurements.',
    npcId: 'entangla',
    islandId: 'entanglement-valley',
    objectives: [
      {
        id: 'perfect-correlation',
        description: 'Achieve 100% correlation in measurements',
        type: 'experiment',
        targetId: 'perfect-correlation',
        completed: false
      }
    ],
    rewards: {
      xp: 90,
      items: [{ id: 'quantum-particle-rare', quantity: 1 }]
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['bell-state-quest']
  },

  'myth-buster-quest': {
    id: 'myth-buster-quest',
    title: 'Myth vs Reality',
    description: 'Separate quantum facts from science fiction.',
    npcId: 'entangla',
    islandId: 'entanglement-valley',
    objectives: [
      {
        id: 'classify-myths',
        description: 'Correctly classify all entanglement statements',
        type: 'puzzle',
        targetId: 'myth-reality-cards',
        completed: false
      }
    ],
    rewards: {
      xp: 100,
      achievementId: 'myth-buster',
      unlocksBoss: 'spooky-paradox'
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['correlation-study']
  },

  // Circuit Master's Quests (Circuit City)
  'gate-basics': {
    id: 'gate-basics',
    title: 'Gate Fundamentals',
    description: 'Learn the basic quantum gates and their operations.',
    npcId: 'circuit-master',
    islandId: 'circuit-city',
    objectives: [
      {
        id: 'place-x-gate',
        description: 'Place an X gate on a qubit',
        type: 'experiment',
        targetId: 'x-gate-placement',
        completed: false
      },
      {
        id: 'place-h-gate',
        description: 'Place an H gate to create superposition',
        type: 'experiment',
        targetId: 'h-gate-placement',
        completed: false
      },
      {
        id: 'place-cnot',
        description: 'Place a CNOT gate to entangle qubits',
        type: 'experiment',
        targetId: 'cnot-placement',
        completed: false
      }
    ],
    rewards: {
      xp: 70,
      items: [{ id: 'circuit-blueprint', quantity: 1 }]
    },
    difficulty: 2,
    type: 'main',
    prerequisites: ['myth-buster-quest']
  },

  'circuit-puzzles': {
    id: 'circuit-puzzles',
    title: 'Circuit Challenges',
    description: 'Solve increasingly complex circuit puzzles.',
    npcId: 'circuit-master',
    islandId: 'circuit-city',
    objectives: [
      {
        id: 'solve-puzzle-1',
        description: 'Solve the Equal Superposition puzzle',
        type: 'puzzle',
        targetId: 'circuit-puzzle-1',
        completed: false
      },
      {
        id: 'solve-puzzle-2',
        description: 'Solve the Bell State puzzle',
        type: 'puzzle',
        targetId: 'circuit-puzzle-2',
        completed: false
      },
      {
        id: 'solve-puzzle-3',
        description: 'Solve the Phase Flip puzzle',
        type: 'puzzle',
        targetId: 'circuit-puzzle-3',
        completed: false
      }
    ],
    rewards: {
      xp: 120,
      items: [{ id: 'quantum-particle-epic', quantity: 1 }]
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['gate-basics']
  },

  'advanced-circuits': {
    id: 'advanced-circuits',
    title: 'Master Circuit Builder',
    description: 'Build complex multi-qubit circuits.',
    npcId: 'circuit-master',
    islandId: 'circuit-city',
    objectives: [
      {
        id: 'build-3-qubit-circuit',
        description: 'Build a circuit using all 3 qubits',
        type: 'puzzle',
        targetId: 'three-qubit-circuit',
        completed: false
      }
    ],
    rewards: {
      xp: 150,
      achievementId: 'circuit-architect',
      unlocksBoss: 'gate-guardian'
    },
    difficulty: 4,
    type: 'main',
    prerequisites: ['circuit-puzzles']
  },

  // The Oracle's Quests (Algorithm Temple)
  'grover-introduction': {
    id: 'grover-introduction',
    title: 'Introduction to Quantum Search',
    description: 'Learn how Grover\'s algorithm searches faster than classical methods.',
    npcId: 'oracle',
    islandId: 'algorithm-temple',
    objectives: [
      {
        id: 'classical-search',
        description: 'Complete a classical search',
        type: 'experiment',
        targetId: 'classical-search-demo',
        completed: false
      },
      {
        id: 'quantum-search',
        description: 'Complete a quantum search',
        type: 'experiment',
        targetId: 'quantum-search-demo',
        completed: false
      }
    ],
    rewards: {
      xp: 90,
      items: [{ id: 'oracle-token', quantity: 1 }]
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['advanced-circuits']
  },

  'search-mastery': {
    id: 'search-mastery',
    title: 'Amplitude Amplification',
    description: 'Master the quantum search algorithm through repeated trials.',
    npcId: 'oracle',
    islandId: 'algorithm-temple',
    objectives: [
      {
        id: 'beat-classical-average',
        description: 'Beat the classical search average over 10 trials',
        type: 'puzzle',
        targetId: 'search-speedrun',
        completed: false
      }
    ],
    rewards: {
      xp: 120,
      achievementId: 'amplitude-amplifier'
    },
    difficulty: 4,
    type: 'main',
    prerequisites: ['grover-introduction']
  },

  'algorithm-challenge': {
    id: 'algorithm-challenge',
    title: 'The Algorithm Challenge',
    description: 'Demonstrate mastery of quantum algorithms.',
    npcId: 'oracle',
    islandId: 'algorithm-temple',
    objectives: [
      {
        id: 'perfect-search',
        description: 'Find the marked item in minimum iterations',
        type: 'puzzle',
        targetId: 'perfect-search-challenge',
        completed: false
      }
    ],
    rewards: {
      xp: 150,
      achievementId: 'algorithm-master',
      unlocksBoss: 'complexity-demon'
    },
    difficulty: 5,
    type: 'main',
    prerequisites: ['search-mastery']
  },

  // Hardware Harry's Quests (Cryogenic Caverns)
  'cooling-basics': {
    id: 'cooling-basics',
    title: 'Understanding Cryogenics',
    description: 'Learn why quantum computers need extreme cooling.',
    npcId: 'hardware-harry',
    islandId: 'cryogenic-caverns',
    objectives: [
      {
        id: 'explore-fridge',
        description: 'Explore the dilution refrigerator',
        type: 'discover',
        targetId: 'dilution-fridge-tour',
        completed: false
      }
    ],
    rewards: {
      xp: 60,
      items: [{ id: 'cooling-crystal', quantity: 1 }]
    },
    difficulty: 2,
    type: 'main',
    prerequisites: ['algorithm-challenge']
  },

  'decoherence-study': {
    id: 'decoherence-study',
    title: 'Fighting Decoherence',
    description: 'Study how environmental factors destroy quantum states.',
    npcId: 'hardware-harry',
    islandId: 'cryogenic-caverns',
    objectives: [
      {
        id: 'test-temperature',
        description: 'Observe decoherence at different temperatures',
        type: 'experiment',
        targetId: 'temperature-test',
        completed: false
      },
      {
        id: 'test-noise',
        description: 'Observe decoherence with different noise levels',
        type: 'experiment',
        targetId: 'noise-test',
        completed: false
      }
    ],
    rewards: {
      xp: 100,
      items: [{ id: 'quantum-particle-rare', quantity: 2 }]
    },
    difficulty: 3,
    type: 'main',
    prerequisites: ['cooling-basics']
  },

  'hardware-mastery': {
    id: 'hardware-mastery',
    title: 'Hardware Engineering',
    description: 'Master the engineering challenges of quantum hardware.',
    npcId: 'hardware-harry',
    islandId: 'cryogenic-caverns',
    objectives: [
      {
        id: 'answer-scenarios',
        description: 'Correctly answer all hardware scenario questions',
        type: 'puzzle',
        targetId: 'hardware-scenarios',
        completed: false
      }
    ],
    rewards: {
      xp: 150,
      achievementId: 'hardware-expert',
      unlocksBoss: 'decoherence-dragon'
    },
    difficulty: 4,
    type: 'main',
    prerequisites: ['decoherence-study']
  },

  // Daily/Side Quests
  'daily-measurements': {
    id: 'daily-measurements',
    title: 'Daily Measurements',
    description: 'Perform 50 qubit measurements today.',
    npcId: 'dr-qubit',
    islandId: 'superposition-island',
    objectives: [
      {
        id: 'measure-50',
        description: 'Measure qubits 50 times',
        type: 'collect',
        targetId: 'measurement-count',
        completed: false
      }
    ],
    rewards: {
      xp: 30,
      items: [{ id: 'quantum-particle-common', quantity: 3 }]
    },
    difficulty: 1,
    type: 'daily',
    prerequisites: []
  },

  'hidden-correlation': {
    id: 'hidden-correlation',
    title: 'Hidden Correlation',
    description: 'Discover the secret correlation pattern.',
    npcId: 'entangla',
    islandId: 'entanglement-valley',
    objectives: [
      {
        id: 'find-secret',
        description: 'Find the hidden correlation area',
        type: 'discover',
        targetId: 'secret-correlation-spot',
        completed: false
      }
    ],
    rewards: {
      xp: 200,
      items: [{ id: 'quantum-particle-legendary', quantity: 1 }]
    },
    difficulty: 5,
    type: 'hidden',
    prerequisites: ['myth-buster-quest']
  }
};

// Helper function to get quest by ID
export function getQuestById(questId: string): Quest | undefined {
  return QUESTS[questId];
}

// Helper function to get quests by NPC
export function getQuestsByNPC(npcId: NPCId): Quest[] {
  return Object.values(QUESTS).filter(quest => quest.npcId === npcId);
}

// Helper function to get quests by island
export function getQuestsByIsland(islandId: string): Quest[] {
  return Object.values(QUESTS).filter(quest => quest.islandId === islandId);
}

// Helper function to check if quest prerequisites are met
export function checkQuestPrerequisites(questId: string, completedQuests: string[]): boolean {
  const quest = getQuestById(questId);
  if (!quest) return false;

  return quest.prerequisites.every(prereqId => completedQuests.includes(prereqId));
}

// Helper function to get available quests for a player
export function getAvailableQuests(completedQuests: string[]): Quest[] {
  return Object.values(QUESTS).filter(quest => {
    // Quest not already completed
    if (completedQuests.includes(quest.id)) return false;

    // Prerequisites met
    return checkQuestPrerequisites(quest.id, completedQuests);
  });
}

// Helper function to calculate quest progress
export function calculateQuestProgress(quest: Quest): number {
  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  const totalObjectives = quest.objectives.length;
  return totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;
}

// Helper function to check if quest is complete
export function isQuestComplete(quest: Quest): boolean {
  return quest.objectives.every(obj => obj.completed);
}
