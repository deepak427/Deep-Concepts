import type { CircuitPuzzle } from '../types/quantum';

// Pre-built circuit puzzles for learning quantum gates
export const CIRCUIT_PUZZLES: CircuitPuzzle[] = [
  {
    id: 'puzzle-1-bit-flip',
    title: 'Puzzle 1: Bit Flip',
    description: 'Transform |0⟩ into |1⟩ using a single gate.',
    numQubits: 1,
    initialState: [
      { real: 1, imaginary: 0 }, // |0⟩
      { real: 0, imaginary: 0 }  // |1⟩
    ],
    targetState: [
      { real: 0, imaginary: 0 }, // |0⟩
      { real: 1, imaginary: 0 }  // |1⟩
    ],
    xpReward: 30,
    hint: 'The X gate flips |0⟩ to |1⟩'
  },
  {
    id: 'puzzle-2-superposition',
    title: 'Puzzle 2: Equal Superposition',
    description: 'Create an equal superposition (|0⟩+|1⟩)/√2 from |0⟩.',
    numQubits: 1,
    initialState: [
      { real: 1, imaginary: 0 },
      { real: 0, imaginary: 0 }
    ],
    targetState: [
      { real: 1/Math.sqrt(2), imaginary: 0 },
      { real: 1/Math.sqrt(2), imaginary: 0 }
    ],
    xpReward: 40,
    hint: 'The Hadamard gate creates equal superposition'
  },
  {
    id: 'puzzle-3-minus-state',
    title: 'Puzzle 3: Minus State',
    description: 'Create the |-⟩ state: (|0⟩-|1⟩)/√2 from |0⟩.',
    numQubits: 1,
    initialState: [
      { real: 1, imaginary: 0 },
      { real: 0, imaginary: 0 }
    ],
    targetState: [
      { real: 1/Math.sqrt(2), imaginary: 0 },
      { real: -1/Math.sqrt(2), imaginary: 0 }
    ],
    xpReward: 50,
    hint: 'Try combining X and H gates'
  },
  {
    id: 'puzzle-4-bell-state',
    title: 'Puzzle 4: Bell State',
    description: 'Create a Bell state (|00⟩+|11⟩)/√2 from |00⟩.',
    numQubits: 2,
    initialState: [
      { real: 1, imaginary: 0 }, // |00⟩
      { real: 0, imaginary: 0 }, // |01⟩
      { real: 0, imaginary: 0 }, // |10⟩
      { real: 0, imaginary: 0 }  // |11⟩
    ],
    targetState: [
      { real: 1/Math.sqrt(2), imaginary: 0 }, // |00⟩
      { real: 0, imaginary: 0 },               // |01⟩
      { real: 0, imaginary: 0 },               // |10⟩
      { real: 1/Math.sqrt(2), imaginary: 0 }   // |11⟩
    ],
    xpReward: 60,
    hint: 'Use H on one qubit, then CNOT'
  },
  {
    id: 'puzzle-5-three-qubit',
    title: 'Puzzle 5: Three-Qubit Superposition',
    description: 'Create equal superposition of all 8 basis states.',
    numQubits: 3,
    initialState: [
      { real: 1, imaginary: 0 }, // |000⟩
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 },
      { real: 0, imaginary: 0 }
    ],
    targetState: Array(8).fill(null).map(() => ({ 
      real: 1/Math.sqrt(8), 
      imaginary: 0 
    })),
    xpReward: 70,
    hint: 'Apply H to all three qubits'
  },
  {
    id: 'puzzle-6-phase-flip',
    title: 'Puzzle 6: Phase Flip',
    description: 'Transform |+⟩ into |-⟩ using phase gates.',
    numQubits: 1,
    initialState: [
      { real: 1/Math.sqrt(2), imaginary: 0 },
      { real: 1/Math.sqrt(2), imaginary: 0 }
    ],
    targetState: [
      { real: 1/Math.sqrt(2), imaginary: 0 },
      { real: -1/Math.sqrt(2), imaginary: 0 }
    ],
    xpReward: 50,
    hint: 'The Z gate adds a phase flip to |1⟩'
  }
];

// Get puzzle by ID
export function getPuzzleById(id: string): CircuitPuzzle | undefined {
  return CIRCUIT_PUZZLES.find(p => p.id === id);
}

// Get puzzles by difficulty (based on number of qubits)
export function getPuzzlesByDifficulty(numQubits: number): CircuitPuzzle[] {
  return CIRCUIT_PUZZLES.filter(p => p.numQubits === numQubits);
}
