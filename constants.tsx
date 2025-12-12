// Legacy constants file - maintained for backward compatibility
// New code should import from constants/modules.ts instead

import { ModuleData } from './types';

// Re-export from the new module structure
export { MODULE_CONTENT, getModuleContent, getRequiredInteractions, getModuleChallenges, getRetrievalQuestions, ACHIEVEMENT_CONDITIONS } from './constants/modules';
export { XP_REWARDS } from './lib/xpSystem';
export type { ModuleContent, RetrievalQuestion, InteractiveSimulation, Challenge } from './constants/modules';

// Legacy MODULES export for backward compatibility
export const MODULES: ModuleData[] = [
  {
    id: 'intro',
    title: '1. What Is Quantum Computing?',
    shortTitle: 'Intro',
    description: 'Quantum computers are not just faster supercomputers. They operate on completely different laws of physics.',
    keyTakeaways: [
      'Classical computers use bits (switches).',
      'Quantum computers use qubits (waves/particles).',
      'They are designed for specific problems like nature simulation, not for checking email.'
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
    keyTakeaways: [
      'A Classical Bit is always 0 OR 1.',
      'A Qubit exists in a state between 0 and 1 until measured.',
      'Measurement "collapses" the qubit into a definite state.'
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
    keyTakeaways: [
      'Superposition is a combination of states with associated "amplitudes".',
      'It allows quantum computers to explore a vast computational space.',
      'It is like a wave: peaks and troughs can add up or cancel out.'
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
    keyTakeaways: [
      'Entangled particles are correlated stronger than classical physics allows.',
      'Measuring one instantly reveals the state of the other.',
      'This does NOT allow faster-than-light communication.'
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
    keyTakeaways: [
      'Gates are operations that rotate or flip qubits.',
      'X Gate = Bit Flip (0 to 1).',
      'H Gate (Hadamard) = Creates Superposition.',
      'Quantum circuits are sequences of these gates.'
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
    keyTakeaways: [
      'Grover\'s Algorithm searches unsorted data faster than classical computers.',
      'It doesn\'t check items one by one.',
      'It increases the "amplitude" (brightness) of the correct answer.'
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
    keyTakeaways: [
      'Qubits are extremely fragile and sensitive to noise (heat, light).',
      'Decoherence causes the quantum state to collapse into errors.',
      'We use dilution refrigerators to keep them at near absolute zero.'
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
    keyTakeaways: [
      'GOOD FOR: Simulating molecules (drugs/materials), Optimization, Cryptography.',
      'BAD FOR: Streaming video, browsing the web, simple math.',
      'We are currently in the "NISQ" era (Noisy Intermediate-Scale Quantum).'
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
