// Boss Battle System - Boss Definitions

import type { NPCId } from '@/types/game';

export interface Boss {
  id: string;
  name: string;
  title: string;
  islandId: string;
  npcId: NPCId;
  maxHealth: number;
  attacks: BossAttack[];
  weaknesses: string[]; // Challenge types that deal extra damage
  defeatReward: BossDefeatReward;
  avatar: string; // emoji for now
  masteryThreshold: number; // Stars required to unlock (1-5)
  description: string;
}

export interface BossAttack {
  name: string;
  damage: number;
  description: string;
  animation: 'shake' | 'pulse' | 'flash' | 'spin';
}

export interface BossDefeatReward {
  xp: number;
  achievementId?: string;
  items?: Array<{ id: string; quantity: number }>;
  unlocksIsland?: string;
}

export interface BossBattle {
  bossId: string;
  explorerHealth: number;
  explorerMaxHealth: number;
  bossHealth: number;
  bossMaxHealth: number;
  currentChallenge?: BossChallenge;
  challengesCompleted: number;
  active: boolean;
  turn: 'explorer' | 'boss';
}

export interface BossChallenge {
  id: string;
  type: 'quiz' | 'circuit' | 'prediction' | 'classification';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  damage: number; // Damage dealt to boss on correct answer
  hint?: string;
}

// Boss Definitions
export const BOSSES: Boss[] = [
  {
    id: 'measurement-monster',
    name: 'The Measurement Monster',
    title: 'Guardian of Superposition Island',
    islandId: 'superposition',
    npcId: 'dr-qubit',
    maxHealth: 100,
    masteryThreshold: 3,
    avatar: '👾',
    description: 'A chaotic entity that collapses quantum states with a mere glance. Defeat it by mastering measurement and probability.',
    attacks: [
      {
        name: 'Collapse Wave',
        damage: 15,
        description: 'Forces a measurement, dealing damage',
        animation: 'pulse'
      },
      {
        name: 'Probability Drain',
        damage: 20,
        description: 'Drains your understanding of probability',
        animation: 'shake'
      }
    ],
    weaknesses: ['measurement', 'probability'],
    defeatReward: {
      xp: 500,
      achievementId: 'measurement-master',
      items: [
        { id: 'quantum-particle-rare', quantity: 3 }
      ]
    }
  },
  {
    id: 'entanglement-enigma',
    name: 'The Entanglement Enigma',
    title: 'Keeper of Entanglement Valley',
    islandId: 'entanglement',
    npcId: 'entangla',
    maxHealth: 120,
    masteryThreshold: 3,
    avatar: '🌀',
    description: 'A mysterious being that exists in multiple states simultaneously. Only true understanding of correlation can defeat it.',
    attacks: [
      {
        name: 'Correlation Confusion',
        damage: 18,
        description: 'Tangles your understanding',
        animation: 'spin'
      },
      {
        name: 'Bell State Blast',
        damage: 22,
        description: 'Unleashes entangled fury',
        animation: 'flash'
      }
    ],
    weaknesses: ['entanglement', 'correlation'],
    defeatReward: {
      xp: 600,
      achievementId: 'entanglement-expert',
      items: [
        { id: 'entangled-pair', quantity: 2 }
      ]
    }
  },
  {
    id: 'circuit-chaos',
    name: 'Circuit Chaos',
    title: 'Overlord of Circuit City',
    islandId: 'circuits',
    npcId: 'circuit-master',
    maxHealth: 150,
    masteryThreshold: 4,
    avatar: '⚡',
    description: 'A being of pure quantum logic that scrambles circuits. Master gate operations to restore order.',
    attacks: [
      {
        name: 'Gate Scramble',
        damage: 20,
        description: 'Randomizes your circuit knowledge',
        animation: 'shake'
      },
      {
        name: 'CNOT Cascade',
        damage: 25,
        description: 'Overwhelming controlled operations',
        animation: 'pulse'
      }
    ],
    weaknesses: ['gates', 'circuits'],
    defeatReward: {
      xp: 750,
      achievementId: 'circuit-champion',
      items: [
        { id: 'quantum-gate-kit', quantity: 1 }
      ],
      unlocksIsland: 'algorithms'
    }
  },
  {
    id: 'algorithm-anomaly',
    name: 'The Algorithm Anomaly',
    title: 'Sentinel of Algorithm Temple',
    islandId: 'algorithms',
    npcId: 'oracle',
    maxHealth: 180,
    masteryThreshold: 4,
    avatar: '🔮',
    description: 'An entity that exists in superposition across all search spaces. Defeat it with quantum speedup.',
    attacks: [
      {
        name: 'Oracle Strike',
        damage: 25,
        description: 'Marks you with confusion',
        animation: 'flash'
      },
      {
        name: 'Amplitude Drain',
        damage: 30,
        description: 'Reduces your quantum advantage',
        animation: 'pulse'
      }
    ],
    weaknesses: ['algorithms', 'search'],
    defeatReward: {
      xp: 900,
      achievementId: 'algorithm-ace',
      items: [
        { id: 'oracle-crystal', quantity: 1 }
      ]
    }
  },
  {
    id: 'decoherence-demon',
    name: 'The Decoherence Demon',
    title: 'Terror of Cryogenic Caverns',
    islandId: 'hardware',
    npcId: 'hardware-harry',
    maxHealth: 200,
    masteryThreshold: 5,
    avatar: '❄️',
    description: 'The ultimate challenge - a manifestation of noise and error. Only perfect hardware knowledge can prevail.',
    attacks: [
      {
        name: 'Thermal Noise',
        damage: 28,
        description: 'Heats up your understanding',
        animation: 'shake'
      },
      {
        name: 'Error Cascade',
        damage: 35,
        description: 'Overwhelming decoherence',
        animation: 'pulse'
      }
    ],
    weaknesses: ['hardware', 'decoherence'],
    defeatReward: {
      xp: 1200,
      achievementId: 'quantum-master',
      items: [
        { id: 'dilution-fridge-model', quantity: 1 },
        { id: 'quantum-particle-legendary', quantity: 5 }
      ]
    }
  }
];

// Helper functions
export function getBossById(bossId: string): Boss | undefined {
  return BOSSES.find(boss => boss.id === bossId);
}

export function getBossByIsland(islandId: string): Boss | undefined {
  return BOSSES.find(boss => boss.islandId === islandId);
}

export function isBossUnlocked(masteryStars: number, requiredStars: number): boolean {
  return masteryStars >= requiredStars;
}

// Challenge generators for each boss
export function generateBossChallenge(bossId: string, difficulty: number): BossChallenge {
  const boss = getBossById(bossId);
  if (!boss) {
    throw new Error(`Boss ${bossId} not found`);
  }

  // Generate challenges based on boss type
  switch (bossId) {
    case 'measurement-monster':
      return generateMeasurementChallenge(difficulty);
    case 'entanglement-enigma':
      return generateEntanglementChallenge(difficulty);
    case 'circuit-chaos':
      return generateCircuitChallenge(difficulty);
    case 'algorithm-anomaly':
      return generateAlgorithmChallenge(difficulty);
    case 'decoherence-demon':
      return generateHardwareChallenge(difficulty);
    default:
      return generateMeasurementChallenge(difficulty);
  }
}

function generateMeasurementChallenge(difficulty: number): BossChallenge {
  const challenges = [
    {
      question: 'A qubit is in state |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩. What is the probability of measuring |1⟩?',
      options: ['0%', '25%', '50%', '100%'],
      correctAnswer: 2,
      damage: 20
    },
    {
      question: 'After measuring a qubit in superposition, what happens to its state?',
      options: ['It remains in superposition', 'It collapses to |0⟩ or |1⟩', 'It becomes entangled', 'It disappears'],
      correctAnswer: 1,
      damage: 20
    },
    {
      question: 'If a qubit has 75% probability of |1⟩, what is its approximate state?',
      options: ['|0⟩', '|1⟩', 'Mostly |1⟩', 'Equal superposition'],
      correctAnswer: 2,
      damage: 25
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: `measurement-${Date.now()}`,
    type: 'quiz',
    ...challenge,
    hint: 'Remember: probability = |amplitude|²'
  };
}

function generateEntanglementChallenge(difficulty: number): BossChallenge {
  const challenges = [
    {
      question: 'In a Bell state, if qubit A is measured as |0⟩, what will qubit B be?',
      options: ['Random', 'Always |0⟩', 'Always |1⟩', 'Depends on the Bell state'],
      correctAnswer: 3,
      damage: 22
    },
    {
      question: 'Can entanglement be used to send information faster than light?',
      options: ['Yes, always', 'No, never', 'Only with special equipment', 'Only for short distances'],
      correctAnswer: 1,
      damage: 22
    },
    {
      question: 'What happens when you measure one qubit of an entangled pair?',
      options: ['Nothing', 'Both collapse', 'Only the measured one collapses', 'They become more entangled'],
      correctAnswer: 1,
      damage: 25
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: `entanglement-${Date.now()}`,
    type: 'quiz',
    ...challenge,
    hint: 'Entanglement creates correlation, not communication'
  };
}

function generateCircuitChallenge(difficulty: number): BossChallenge {
  const challenges = [
    {
      question: 'What does the Hadamard (H) gate do?',
      options: ['Flips the qubit', 'Creates superposition', 'Measures the qubit', 'Entangles qubits'],
      correctAnswer: 1,
      damage: 25
    },
    {
      question: 'Which gate is needed to create entanglement?',
      options: ['X gate', 'H gate', 'CNOT gate', 'Z gate'],
      correctAnswer: 2,
      damage: 25
    },
    {
      question: 'What is the result of applying X gate to |0⟩?',
      options: ['|0⟩', '|1⟩', 'Superposition', 'Error'],
      correctAnswer: 1,
      damage: 20
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: `circuit-${Date.now()}`,
    type: 'quiz',
    ...challenge,
    hint: 'Think about how gates transform quantum states'
  };
}

function generateAlgorithmChallenge(difficulty: number): BossChallenge {
  const challenges = [
    {
      question: 'How many queries does Grover\'s algorithm need to search N items?',
      options: ['N', 'N/2', '√N', 'log(N)'],
      correctAnswer: 2,
      damage: 30
    },
    {
      question: 'What is the key advantage of quantum algorithms?',
      options: ['They are faster for all problems', 'They use superposition and interference', 'They need less memory', 'They are easier to program'],
      correctAnswer: 1,
      damage: 30
    },
    {
      question: 'Which problem can quantum computers solve exponentially faster?',
      options: ['Sorting', 'Searching', 'Factoring large numbers', 'Matrix multiplication'],
      correctAnswer: 2,
      damage: 35
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: `algorithm-${Date.now()}`,
    type: 'quiz',
    ...challenge,
    hint: 'Quantum advantage comes from interference patterns'
  };
}

function generateHardwareChallenge(difficulty: number): BossChallenge {
  const challenges = [
    {
      question: 'Why do quantum computers need to be so cold?',
      options: ['To save energy', 'To reduce thermal noise', 'To make them faster', 'To prevent overheating'],
      correctAnswer: 1,
      damage: 35
    },
    {
      question: 'What is decoherence?',
      options: ['When qubits lose quantum properties', 'When qubits get entangled', 'When measurements fail', 'When gates malfunction'],
      correctAnswer: 0,
      damage: 35
    },
    {
      question: 'What temperature do quantum computers operate at?',
      options: ['Room temperature', '0°C', 'Near absolute zero', '-100°C'],
      correctAnswer: 2,
      damage: 40
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: `hardware-${Date.now()}`,
    type: 'quiz',
    ...challenge,
    hint: 'Quantum states are fragile and need extreme conditions'
  };
}
