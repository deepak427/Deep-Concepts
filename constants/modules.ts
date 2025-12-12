// Comprehensive module content structure with learning objectives,
// required interactions, retrieval practice, and challenge definitions

import type { ModuleId } from '@/types';

export interface RetrievalQuestion {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'prediction' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  conceptId: string;
}

export interface InteractiveSimulation {
  id: string;
  type: 'bloch-sphere' | 'wave-interference' | 'entanglement' | 'circuit-builder' | 'quantum-search' | 'decoherence-lab' | 'application-classifier';
  config?: Record<string, unknown>;
  challenges?: Challenge[];
}

export interface Challenge {
  id: string;
  description: string;
  xpReward: number;
  achievementId?: string;
}

export interface ModuleContent {
  id: ModuleId;
  title: string;
  shortTitle: string;
  description: string;
  learningObjectives: string[];
  keyTakeaways: string[];
  requiredInteractions: string[];
  interactiveSimulations: InteractiveSimulation[];
  retrievalPractice: RetrievalQuestion[];
  quiz: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string;
    }>;
  };
}

export const MODULE_CONTENT: ModuleContent[] = [
  {
    id: 'intro',
    title: '1. What Is Quantum Computing?',
    shortTitle: 'Intro',
    description: 'Quantum computers are not just faster supercomputers. They operate on completely different laws of physics.',
    learningObjectives: [
      'Explain the fundamental difference between classical and quantum computers',
      'Identify which types of problems quantum computers are designed to solve',
      'Understand why quantum computers are not general-purpose replacements for classical computers'
    ],
    keyTakeaways: [
      'Classical computers use bits (switches).',
      'Quantum computers use qubits (waves/particles).',
      'They are designed for specific problems like nature simulation, not for checking email.'
    ],
    requiredInteractions: ['intro-comparison'],
    interactiveSimulations: [
      {
        id: 'intro-comparison',
        type: 'bloch-sphere',
        config: { introMode: true }
      }
    ],
    retrievalPractice: [
      {
        id: 'intro-rp-1',
        type: 'multiple-choice',
        question: 'What is the fundamental unit of information in a quantum computer?',
        options: ['Bit', 'Qubit', 'Byte', 'Quantum byte'],
        correctAnswer: 'Qubit',
        explanation: 'A qubit (quantum bit) is the fundamental unit of quantum information, unlike classical bits.',
        conceptId: 'quantum-basics'
      },
      {
        id: 'intro-rp-2',
        type: 'prediction',
        question: 'Predict: Would a quantum computer be better at streaming Netflix or simulating molecules?',
        options: ['Streaming Netflix', 'Simulating molecules'],
        correctAnswer: 'Simulating molecules',
        explanation: 'Quantum computers excel at simulating quantum systems like molecules, not classical tasks like video streaming.',
        conceptId: 'quantum-applications'
      }
    ],
    quiz: {
      question: "True or False: A quantum computer is just a classical computer with a faster processor.",
      options: [
        { id: 'a', text: "True", isCorrect: false, explanation: "Incorrect. Quantum computers operate on fundamentally different physics, not just faster clocks." },
        { id: 'b', text: "False", isCorrect: true, explanation: "Correct! They use quantum mechanics (superposition, entanglement) to solve problems in a new way." }
      ]
    }
  },
  {
    id: 'bits-qubits',
    title: '2. Bits vs. Qubits',
    shortTitle: 'Bits vs Qubits',
    description: 'The fundamental unit of information changes from a definite state to a probabilistic one.',
    learningObjectives: [
      'Distinguish between classical bits and quantum qubits',
      'Explain what happens when a qubit is measured',
      'Visualize qubit states using the Bloch sphere representation'
    ],
    keyTakeaways: [
      'A Classical Bit is always 0 OR 1.',
      'A Qubit exists in a state between 0 and 1 until measured.',
      'Measurement "collapses" the qubit into a definite state.'
    ],
    requiredInteractions: ['bloch-sphere-basic', 'measurement-challenge'],
    interactiveSimulations: [
      {
        id: 'bloch-sphere-basic',
        type: 'bloch-sphere',
        challenges: [
          {
            id: 'measurement-challenge',
            description: 'Set a qubit with 75% probability of measuring 1',
            xpReward: 40,
            achievementId: 'first-collapse'
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'bits-rp-1',
        type: 'multiple-choice',
        question: 'Before measurement, a qubit can be in:',
        options: ['Only state 0', 'Only state 1', 'A superposition of 0 and 1', 'Neither 0 nor 1'],
        correctAnswer: 'A superposition of 0 and 1',
        explanation: 'Qubits can exist in superposition, a combination of both 0 and 1 states simultaneously.',
        conceptId: 'qubit-superposition'
      },
      {
        id: 'bits-rp-2',
        type: 'prediction',
        question: 'If you measure a qubit in equal superposition 100 times, approximately how many times will you get 0?',
        options: ['0 times', '50 times', '100 times', 'It varies randomly'],
        correctAnswer: '50 times',
        explanation: 'Equal superposition means 50% probability for each outcome, so approximately 50 measurements will yield 0.',
        conceptId: 'measurement-probability'
      }
    ],
    quiz: {
      question: "What happens when you measure a qubit that is in a superposition?",
      options: [
        { id: 'a', text: "It stays in superposition.", isCorrect: false, explanation: "Measurement forces the quantum state to collapse." },
        { id: 'b', text: "It becomes 0 or 1.", isCorrect: true, explanation: "Spot on. The probability wave collapses into a single definite outcome." },
        { id: 'c', text: "It disappears.", isCorrect: false, explanation: "It doesn't vanish, it just becomes definite information." }
      ]
    }
  },
  {
    id: 'superposition',
    title: '3. Superposition',
    shortTitle: 'Superposition',
    description: 'Imagine a spinning coin. It is not heads or tails, but a mix of both probabilities.',
    learningObjectives: [
      'Explain superposition using wave interference as an analogy',
      'Predict how changing wave parameters affects measurement probabilities',
      'Understand how constructive and destructive interference create quantum computation'
    ],
    keyTakeaways: [
      'Superposition is a combination of states with associated "amplitudes".',
      'It allows quantum computers to explore a vast computational space.',
      'It is like a wave: peaks and troughs can add up or cancel out.'
    ],
    requiredInteractions: ['wave-interference', 'superposition-prediction'],
    interactiveSimulations: [
      {
        id: 'wave-interference',
        type: 'wave-interference',
        challenges: [
          {
            id: 'superposition-prediction',
            description: 'Predict whether adjusted parameters will result in more 0, more 1, or equal probability',
            xpReward: 40,
            achievementId: 'perfect-prediction'
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'super-rp-1',
        type: 'multiple-choice',
        question: 'Constructive interference in quantum computing leads to:',
        options: ['Higher probability of correct answer', 'Lower probability of correct answer', 'No change in probability', 'Measurement error'],
        correctAnswer: 'Higher probability of correct answer',
        explanation: 'Constructive interference amplifies the amplitude of desired states, increasing their measurement probability.',
        conceptId: 'wave-interference'
      },
      {
        id: 'super-rp-2',
        type: 'drag-drop',
        question: 'Match the wave behavior to its effect on qubit probability',
        options: ['Constructive interference', 'Destructive interference'],
        correctAnswer: ['Increases probability', 'Decreases probability'],
        explanation: 'Constructive interference adds amplitudes together (increases), while destructive interference cancels them out (decreases).',
        conceptId: 'interference-effects'
      }
    ],
    quiz: {
      question: "Which analogy best describes superposition?",
      options: [
        { id: 'a', text: "A coin resting on a table.", isCorrect: false, explanation: "That represents a classical bit (definite state)." },
        { id: 'b', text: "A spinning coin.", isCorrect: true, explanation: "Correct. While spinning, it embodies the potential for both Heads and Tails." },
        { id: 'c', text: "Two coins glued together.", isCorrect: false, explanation: "That's just more classical bits." }
      ]
    }
  },
  {
    id: 'entanglement',
    title: '4. Entanglement',
    shortTitle: 'Entanglement',
    description: 'Einstein called it "spooky action at a distance". When two particles become linked, they share a destiny.',
    learningObjectives: [
      'Explain quantum entanglement and how it differs from classical correlation',
      'Demonstrate perfect correlation between entangled qubit measurements',
      'Distinguish between quantum entanglement myths and reality'
    ],
    keyTakeaways: [
      'Entangled particles are correlated stronger than classical physics allows.',
      'Measuring one instantly reveals the state of the other.',
      'This does NOT allow faster-than-light communication.'
    ],
    requiredInteractions: ['entanglement-demo', 'bell-state-creation', 'myth-reality-cards'],
    interactiveSimulations: [
      {
        id: 'entanglement-demo',
        type: 'entanglement',
        challenges: [
          {
            id: 'bell-state-creation',
            description: 'Create a Bell state and observe perfect correlation',
            xpReward: 30
          },
          {
            id: 'myth-reality-cards',
            description: 'Complete the Myth vs Reality card deck with perfect score',
            xpReward: 50,
            achievementId: 'myth-buster'
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'entangle-rp-1',
        type: 'multiple-choice',
        question: 'Can entanglement be used to send messages faster than light?',
        options: ['Yes, instantly', 'No, it only reveals correlations', 'Yes, but only short distances', 'Only in theory'],
        correctAnswer: 'No, it only reveals correlations',
        explanation: 'Entanglement creates correlations but cannot transmit information faster than light. You still need classical communication to compare results.',
        conceptId: 'entanglement-limits'
      },
      {
        id: 'entangle-rp-2',
        type: 'prediction',
        question: 'If two qubits are entangled and you measure the first as 0, what will the second be?',
        options: ['Always 0', 'Always 1', 'Depends on entanglement type', 'Random'],
        correctAnswer: 'Depends on entanglement type',
        explanation: 'Different Bell states create different correlations: some are perfectly correlated (both same), others anti-correlated (opposite).',
        conceptId: 'bell-states'
      }
    ],
    quiz: {
      question: "If you have two entangled qubits, A and B, and you measure A as '0', what happens to B?",
      options: [
        { id: 'a', text: "Nothing, they are independent.", isCorrect: false, explanation: "Entanglement means they are no longer independent." },
        { id: 'b', text: "B's state is instantly determined.", isCorrect: true, explanation: "Correct. Their outcomes are perfectly correlated (or anti-correlated)." },
        { id: 'c', text: "B sends a message to A.", isCorrect: false, explanation: "No information travels between them; the correlation is intrinsic." }
      ]
    }
  },
  {
    id: 'gates',
    title: '5. Quantum Gates',
    shortTitle: 'Gates',
    description: 'Just as classical computers use logic gates (AND, OR), quantum computers use quantum gates to manipulate qubits.',
    learningObjectives: [
      'Identify common quantum gates (X, H, Z, CNOT) and their effects',
      'Build quantum circuits by combining gates in sequence',
      'Solve circuit puzzles to achieve target quantum states'
    ],
    keyTakeaways: [
      'Gates are operations that rotate or flip qubits.',
      'X Gate = Bit Flip (0 to 1).',
      'H Gate (Hadamard) = Creates Superposition.',
      'Quantum circuits are sequences of these gates.'
    ],
    requiredInteractions: ['circuit-builder', 'puzzle-1', 'puzzle-2', 'puzzle-3'],
    interactiveSimulations: [
      {
        id: 'circuit-builder',
        type: 'circuit-builder',
        challenges: [
          {
            id: 'puzzle-1',
            description: 'Create superposition using H gate',
            xpReward: 30
          },
          {
            id: 'puzzle-2',
            description: 'Create Bell state using H and CNOT',
            xpReward: 50
          },
          {
            id: 'puzzle-3',
            description: 'Solve advanced 3-qubit puzzle',
            xpReward: 70,
            achievementId: 'circuit-puzzle-master'
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'gates-rp-1',
        type: 'multiple-choice',
        question: 'Which gate creates an equal superposition from |0⟩?',
        options: ['X gate', 'H gate', 'Z gate', 'CNOT gate'],
        correctAnswer: 'H gate',
        explanation: 'The Hadamard (H) gate transforms |0⟩ into an equal superposition of |0⟩ and |1⟩.',
        conceptId: 'hadamard-gate'
      },
      {
        id: 'gates-rp-2',
        type: 'drag-drop',
        question: 'Match each gate to its primary function',
        options: ['X gate', 'H gate', 'CNOT gate'],
        correctAnswer: ['Bit flip', 'Create superposition', 'Entangle qubits'],
        explanation: 'X flips bits, H creates superposition, and CNOT creates entanglement between qubits.',
        conceptId: 'gate-functions'
      }
    ],
    quiz: {
      question: "What does the Hadamard (H) gate do to a qubit starting at 0?",
      options: [
        { id: 'a', text: "Keeps it at 0.", isCorrect: false, explanation: "The H gate changes the state." },
        { id: 'b', text: "Flips it to 1.", isCorrect: false, explanation: "That is the X gate." },
        { id: 'c', text: "Puts it in Superposition.", isCorrect: true, explanation: "Correct. It creates a 50/50 probability of measuring 0 or 1." }
      ]
    }
  },
  {
    id: 'algorithm',
    title: '6. Algorithms (Grover)',
    shortTitle: 'Algorithms',
    description: 'Quantum algorithms use interference to amplify the right answer and cancel out wrong answers.',
    learningObjectives: [
      'Compare classical and quantum search strategies',
      'Understand how Grover\'s algorithm uses amplitude amplification',
      'Demonstrate quantum speedup through interactive experimentation'
    ],
    keyTakeaways: [
      'Grover\'s Algorithm searches unsorted data faster than classical computers.',
      'It doesn\'t check items one by one.',
      'It increases the "amplitude" (brightness) of the correct answer.'
    ],
    requiredInteractions: ['quantum-search-demo', 'classical-vs-quantum', 'beat-classical'],
    interactiveSimulations: [
      {
        id: 'quantum-search-demo',
        type: 'quantum-search',
        challenges: [
          {
            id: 'classical-vs-quantum',
            description: 'Run both classical and quantum search to compare',
            xpReward: 30
          },
          {
            id: 'beat-classical',
            description: 'Beat the classical search average',
            xpReward: 50,
            achievementId: 'amplitude-amplifier'
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'algo-rp-1',
        type: 'multiple-choice',
        question: 'How many steps does Grover\'s algorithm take to search N items?',
        options: ['N steps', 'log(N) steps', '√N steps', '1 step'],
        correctAnswer: '√N steps',
        explanation: 'Grover\'s algorithm provides quadratic speedup, taking approximately √N steps compared to N/2 for classical search.',
        conceptId: 'grover-complexity'
      },
      {
        id: 'algo-rp-2',
        type: 'prediction',
        question: 'For searching 100 items, approximately how many steps does Grover\'s algorithm need?',
        options: ['10 steps', '50 steps', '100 steps', '1 step'],
        correctAnswer: '10 steps',
        explanation: '√100 = 10, so Grover\'s algorithm needs about 10 steps compared to 50 for classical search.',
        conceptId: 'quantum-speedup'
      }
    ],
    quiz: {
      question: "How does a quantum search algorithm find the target?",
      options: [
        { id: 'a', text: "It checks every box instantly.", isCorrect: false, explanation: "Common misconception. It takes roughly sqrt(N) steps." },
        { id: 'b', text: "Amplifies the probability of the correct answer.", isCorrect: true, explanation: "Correct. It uses constructive interference." },
        { id: 'c', text: "It guesses randomly.", isCorrect: false, explanation: "That would be no better than a classical attempt." }
      ]
    }
  },
  {
    id: 'hardware',
    title: '7. Hardware & Reality',
    shortTitle: 'Hardware',
    description: 'Building these machines is incredibly hard. They need to be colder than outer space.',
    learningObjectives: [
      'Explain why quantum computers require extreme cooling',
      'Understand decoherence and its impact on quantum computation',
      'Identify the physical challenges in building quantum hardware'
    ],
    keyTakeaways: [
      'Qubits are extremely fragile and sensitive to noise (heat, light).',
      'Decoherence causes the quantum state to collapse into errors.',
      'We use dilution refrigerators to keep them at near absolute zero.'
    ],
    requiredInteractions: ['dilution-fridge', 'decoherence-lab', 'hardware-scenarios'],
    interactiveSimulations: [
      {
        id: 'dilution-fridge',
        type: 'decoherence-lab',
        challenges: [
          {
            id: 'decoherence-lab',
            description: 'Experiment with temperature, noise, and time parameters',
            xpReward: 30
          },
          {
            id: 'hardware-scenarios',
            description: 'Answer all scenario questions correctly',
            xpReward: 40
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'hardware-rp-1',
        type: 'multiple-choice',
        question: 'What temperature do quantum computers typically operate at?',
        options: ['Room temperature', '0°C', 'Near absolute zero', '-100°C'],
        correctAnswer: 'Near absolute zero',
        explanation: 'Quantum computers operate at temperatures near absolute zero (around 0.015 Kelvin) to minimize thermal noise.',
        conceptId: 'quantum-cooling'
      },
      {
        id: 'hardware-rp-2',
        type: 'fill-blank',
        question: 'The loss of quantum information due to environmental interference is called ___.',
        options: [],
        correctAnswer: 'decoherence',
        explanation: 'Decoherence is the process where quantum states lose their quantum properties due to interaction with the environment.',
        conceptId: 'decoherence'
      }
    ],
    quiz: {
      question: "Why are quantum computers usually kept in giant gold chandeliers (dilution fridges)?",
      options: [
        { id: 'a', text: "To look cool.", isCorrect: false, explanation: "They do look cool, but that's not the reason." },
        { id: 'b', text: "To prevent noise/heat from destroying the state.", isCorrect: true, explanation: "Correct. Thermal energy causes decoherence." },
        { id: 'c', text: "To generate electricity.", isCorrect: false, explanation: "They consume electricity, not generate it." }
      ]
    }
  },
  {
    id: 'applications',
    title: '8. What Can It Do?',
    shortTitle: 'Future',
    description: 'Quantum isn\'t magic. It\'s a specialized tool for specific types of hard problems.',
    learningObjectives: [
      'Classify problems as suitable or unsuitable for quantum computing',
      'Distinguish between realistic quantum applications and hype',
      'Identify common misconceptions about quantum computing capabilities'
    ],
    keyTakeaways: [
      'GOOD FOR: Simulating molecules (drugs/materials), Optimization, Cryptography.',
      'BAD FOR: Streaming video, browsing the web, simple math.',
      'We are currently in the "NISQ" era (Noisy Intermediate-Scale Quantum).'
    ],
    requiredInteractions: ['application-classifier', 'classification-streak'],
    interactiveSimulations: [
      {
        id: 'application-classifier',
        type: 'application-classifier',
        challenges: [
          {
            id: 'classification-streak',
            description: 'Achieve a streak of 5 correct classifications',
            xpReward: 50
          }
        ]
      }
    ],
    retrievalPractice: [
      {
        id: 'app-rp-1',
        type: 'drag-drop',
        question: 'Classify these applications as "Good for Quantum" or "Bad for Quantum"',
        options: ['Drug discovery', 'Email', 'Battery optimization', 'Video streaming'],
        correctAnswer: ['Good', 'Bad', 'Good', 'Bad'],
        explanation: 'Quantum computers excel at simulating quantum systems (molecules, materials) but are not suited for classical tasks like email or streaming.',
        conceptId: 'quantum-applications'
      },
      {
        id: 'app-rp-2',
        type: 'multiple-choice',
        question: 'What does NISQ stand for?',
        options: ['New Integrated Superposition Quantum', 'Noisy Intermediate-Scale Quantum', 'Next-gen Intelligent System Quantum', 'Nuclear Ion Superconducting Quantum'],
        correctAnswer: 'Noisy Intermediate-Scale Quantum',
        explanation: 'NISQ describes the current era of quantum computers: they have 50-1000 qubits but are still noisy and error-prone.',
        conceptId: 'nisq-era'
      }
    ],
    quiz: {
      question: "Which task is a quantum computer likely to revolutionize?",
      options: [
        { id: 'a', text: "Running Instagram faster.", isCorrect: false, explanation: "Classical computers are already great at this." },
        { id: 'b', text: "Simulating new battery materials.", isCorrect: true, explanation: "Correct. Nature is quantum, so we need a quantum computer to simulate it." },
        { id: 'c', text: "Streaming 8K video.", isCorrect: false, explanation: "Bandwidth is a classical network problem." }
      ]
    }
  }
];

// Helper function to get module content by ID
export function getModuleContent(moduleId: ModuleId): ModuleContent | undefined {
  return MODULE_CONTENT.find(m => m.id === moduleId);
}

// Helper function to get all required interactions for a module
export function getRequiredInteractions(moduleId: ModuleId): string[] {
  const module = getModuleContent(moduleId);
  return module?.requiredInteractions || [];
}

// Helper function to get all challenges for a module
export function getModuleChallenges(moduleId: ModuleId): Challenge[] {
  const module = getModuleContent(moduleId);
  if (!module) return [];

  return module.interactiveSimulations.flatMap(sim => sim.challenges || []);
}

// Helper function to get retrieval practice questions for a module
export function getRetrievalQuestions(moduleId: ModuleId): RetrievalQuestion[] {
  const module = getModuleContent(moduleId);
  return module?.retrievalPractice || [];
}



// Achievement unlock conditions mapped to interactions
export const ACHIEVEMENT_CONDITIONS = {
  'first-collapse': {
    type: 'interaction-count',
    interactionId: 'measurement-challenge',
    count: 1
  },
  'collapsed-100': {
    type: 'interaction-count',
    interactionId: 'bloch-sphere-basic',
    count: 100
  },
  'circuit-architect': {
    type: 'interaction-count',
    interactionId: 'circuit-builder',
    count: 10
  },
  'perfect-prediction': {
    type: 'interaction-count',
    interactionId: 'superposition-prediction',
    count: 5
  },
  'entanglement-adept': {
    type: 'module-mastery',
    moduleId: 'entanglement',
    masteryLevel: 100
  },
  'perfect-mastery': {
    type: 'module-mastery',
    moduleId: 'any',
    masteryLevel: 100
  },
  'quantum-scholar': {
    type: 'all-modules-mastery',
    masteryLevel: 80
  },
  'amplitude-amplifier': {
    type: 'challenge-complete',
    challengeId: 'beat-classical'
  },
  'circuit-puzzle-master': {
    type: 'all-challenges-complete',
    moduleId: 'gates'
  },
  'myth-buster': {
    type: 'challenge-complete',
    challengeId: 'myth-reality-cards'
  },
  'dedicated-learner': {
    type: 'consecutive-days',
    days: 5
  },
  'review-champion': {
    type: 'review-count',
    count: 20
  }
} as const;
