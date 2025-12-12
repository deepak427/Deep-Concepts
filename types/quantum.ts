// Quantum-specific types for visualizations and simulations

export interface QubitState {
  theta: number;  // Polar angle (0 to π)
  phi: number;    // Azimuthal angle (0 to 2π)
}

export interface MeasurementResult {
  outcome: 0 | 1;
  probability: number;
}

export interface MeasurementHistory {
  outcomes: (0 | 1)[];
  histogram: {
    zero: number;
    one: number;
  };
}

export interface BlochSphereChallenge {
  targetProbability: number;
  tolerance: number;
  xpReward: number;
}

export interface WaveParams {
  amplitude1: number;
  amplitude2: number;
  phase1: number;
  phase2: number;
}

export interface WaveInterferenceChallenge {
  xpReward: number;
}

// Quantum Circuit Types
export type GateType = 'X' | 'H' | 'Z' | 'CNOT' | 'S' | 'T';

export interface QuantumGate {
  type: GateType;
  targetQubit: number;
  controlQubit?: number; // For CNOT
}

export interface PlacedGate {
  gate: QuantumGate;
  position: number; // Column position in circuit
  id: string; // Unique identifier for drag-and-drop
}

export interface QuantumCircuit {
  numQubits: number;
  gates: PlacedGate[];
}

export interface CircuitPuzzle {
  id: string;
  title: string;
  description: string;
  numQubits: number;
  initialState: ComplexVector[];
  targetState: ComplexVector[];
  xpReward: number;
  hint?: string;
}

export interface ComplexVector {
  real: number;
  imaginary: number;
}

export interface CircuitState {
  amplitudes: ComplexVector[];
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}
