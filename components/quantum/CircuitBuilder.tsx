import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import type {
  QuantumGate,
  PlacedGate,
  QuantumCircuit,
  CircuitPuzzle,
  CircuitState,
  ComplexVector,
  GateType
} from '../../types/quantum';

interface CircuitBuilderProps {
  numQubits?: number;
  puzzle?: CircuitPuzzle;
  onPuzzleComplete?: (success: boolean) => void;
  onGateAdded?: () => void;
}

// Gate definitions with colors and descriptions
const GATE_DEFINITIONS: Record<GateType, { name: string; color: string; description: string }> = {
  X: { name: 'X (NOT)', color: 'bg-red-500', description: 'Flips |0⟩↔|1⟩' },
  H: { name: 'H (Hadamard)', color: 'bg-blue-500', description: 'Creates superposition' },
  Z: { name: 'Z (Phase)', color: 'bg-green-500', description: 'Adds phase flip' },
  CNOT: { name: 'CNOT', color: 'bg-purple-500', description: 'Controlled NOT' },
  S: { name: 'S (Phase)', color: 'bg-yellow-500', description: 'π/2 phase shift' },
  T: { name: 'T (π/8)', color: 'bg-pink-500', description: 'π/4 phase shift' }
};

export function CircuitBuilder({
  numQubits = 3,
  puzzle,
  onPuzzleComplete,
  onGateAdded
}: CircuitBuilderProps) {
  const [circuit, setCircuit] = useState<QuantumCircuit>({
    numQubits,
    gates: []
  });

  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [selectedControl, setSelectedControl] = useState<number | null>(null);
  const [currentState, setCurrentState] = useState<CircuitState>(
    puzzle ? { amplitudes: puzzle.initialState } : getInitialState(numQubits)
  );
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const gateIdCounter = useRef(0);

  // Get initial state |000...⟩
  function getInitialState(n: number): CircuitState {
    const size = Math.pow(2, n);
    const amplitudes: ComplexVector[] = Array(size).fill(null).map((_, i) => ({
      real: i === 0 ? 1 : 0,
      imaginary: 0
    }));
    return { amplitudes };
  }

  // Add gate to circuit
  const addGate = (qubitIndex: number, position: number) => {
    if (!selectedGate) return;

    // For CNOT, need control qubit
    if (selectedGate === 'CNOT') {
      if (selectedControl === null) {
        setSelectedControl(qubitIndex);
        return;
      }
      if (selectedControl === qubitIndex) {
        // Can't have same control and target
        setSelectedControl(null);
        return;
      }
    }

    const gate: QuantumGate = {
      type: selectedGate,
      targetQubit: qubitIndex,
      ...(selectedGate === 'CNOT' && selectedControl !== null && { controlQubit: selectedControl })
    };

    const placedGate: PlacedGate = {
      gate,
      position,
      id: `gate-${gateIdCounter.current++}`
    };

    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, placedGate]
    }));

    // Apply gate transformation
    const newState = applyGate(currentState, gate);
    setCurrentState(newState);

    // Reset selection
    setSelectedGate(null);
    setSelectedControl(null);
    onGateAdded?.();
  };

  // Remove gate from circuit
  const removeGate = (gateId: string) => {
    setCircuit(prev => ({
      ...prev,
      gates: prev.gates.filter(g => g.id !== gateId)
    }));

    // Recalculate state from scratch
    const newState = simulateCircuit({
      ...circuit,
      gates: circuit.gates.filter(g => g.id !== gateId)
    });
    setCurrentState(newState);
  };

  // Clear all gates
  const clearCircuit = () => {
    setCircuit(prev => ({ ...prev, gates: [] }));
    setCurrentState(puzzle ? { amplitudes: puzzle.initialState } : getInitialState(numQubits));
    setShowValidation(false);
  };

  // Validate puzzle solution
  const validatePuzzle = () => {
    if (!puzzle) return;

    const isCorrect = statesMatch(currentState.amplitudes, puzzle.targetState);
    setShowValidation(true);

    if (isCorrect) {
      setValidationMessage('🎉 Correct! You solved the puzzle!');
      onPuzzleComplete?.(true);
    } else {
      setValidationMessage('Not quite right. Keep trying!');
      onPuzzleComplete?.(false);
    }
  };

  // Check if two states match (within tolerance)
  function statesMatch(state1: ComplexVector[], state2: ComplexVector[], tolerance = 0.001): boolean {
    if (state1.length !== state2.length) return false;

    return state1.every((v, i) => {
      const diff = Math.sqrt(
        Math.pow(v.real - state2[i].real, 2) +
        Math.pow(v.imaginary - state2[i].imaginary, 2)
      );
      return diff < tolerance;
    });
  }

  // Apply a single gate to the state
  function applyGate(state: CircuitState, gate: QuantumGate): CircuitState {
    const n = numQubits;
    const size = Math.pow(2, n);
    const newAmplitudes: ComplexVector[] = Array(size).fill(null).map(() => ({ real: 0, imaginary: 0 }));

    for (let i = 0; i < size; i++) {
      const result = applyGateToIndex(i, gate, n, state.amplitudes);
      result.forEach(({ index, amplitude }) => {
        newAmplitudes[index].real += amplitude.real;
        newAmplitudes[index].imaginary += amplitude.imaginary;
      });
    }

    return { amplitudes: newAmplitudes };
  }

  // Apply gate to a specific basis state index
  function applyGateToIndex(
    index: number,
    gate: QuantumGate,
    n: number,
    amplitudes: ComplexVector[]
  ): Array<{ index: number; amplitude: ComplexVector }> {
    const target = gate.targetQubit;
    const control = gate.controlQubit;

    // Check if target bit is set
    const targetBit = (index >> target) & 1;

    switch (gate.type) {
      case 'X':
        // Flip target bit
        return [{
          index: index ^ (1 << target),
          amplitude: amplitudes[index]
        }];

      case 'H':
        // Hadamard: |0⟩ → (|0⟩+|1⟩)/√2, |1⟩ → (|0⟩-|1⟩)/√2
        const flippedIndex = index ^ (1 << target);
        const sign = targetBit === 0 ? 1 : -1;
        const factor = 1 / Math.sqrt(2);

        return [
          {
            index,
            amplitude: {
              real: amplitudes[index].real * factor,
              imaginary: amplitudes[index].imaginary * factor
            }
          },
          {
            index: flippedIndex,
            amplitude: {
              real: amplitudes[index].real * factor * sign,
              imaginary: amplitudes[index].imaginary * factor * sign
            }
          }
        ];

      case 'Z':
        // Phase flip if |1⟩
        return [{
          index,
          amplitude: targetBit === 1
            ? { real: -amplitudes[index].real, imaginary: -amplitudes[index].imaginary }
            : amplitudes[index]
        }];

      case 'CNOT':
        if (control === undefined) return [{ index, amplitude: amplitudes[index] }];

        // Check if control bit is set
        const controlBit = (index >> control) & 1;

        if (controlBit === 1) {
          // Flip target bit
          return [{
            index: index ^ (1 << target),
            amplitude: amplitudes[index]
          }];
        }
        return [{ index, amplitude: amplitudes[index] }];

      case 'S':
        // S gate: adds i phase to |1⟩
        return [{
          index,
          amplitude: targetBit === 1
            ? { real: -amplitudes[index].imaginary, imaginary: amplitudes[index].real }
            : amplitudes[index]
        }];

      case 'T':
        // T gate: adds e^(iπ/4) phase to |1⟩
        if (targetBit === 1) {
          const phase = Math.PI / 4;
          const cos = Math.cos(phase);
          const sin = Math.sin(phase);
          return [{
            index,
            amplitude: {
              real: amplitudes[index].real * cos - amplitudes[index].imaginary * sin,
              imaginary: amplitudes[index].real * sin + amplitudes[index].imaginary * cos
            }
          }];
        }
        return [{ index, amplitude: amplitudes[index] }];

      default:
        return [{ index, amplitude: amplitudes[index] }];
    }
  }

  // Simulate entire circuit from scratch with performance monitoring
  function simulateCircuit(circ: QuantumCircuit): CircuitState {
    const startTime = performance.now();

    let state = puzzle ? { amplitudes: puzzle.initialState } : getInitialState(circ.numQubits);

    // Sort gates by position
    const sortedGates = [...circ.gates].sort((a, b) => a.position - b.position);

    for (const placedGate of sortedGates) {
      state = applyGate(state, placedGate.gate);
    }

    const duration = performance.now() - startTime;
    // Target: < 100ms for 10 gates
    if (sortedGates.length >= 10 && duration > 100) {
      console.warn(`Circuit simulation took ${duration.toFixed(2)}ms for ${sortedGates.length} gates (target: <100ms for 10 gates)`);
    }

    return state;
  }

  // Get maximum position for new gates
  const maxPosition = circuit.gates.length > 0
    ? Math.max(...circuit.gates.map(g => g.position)) + 1
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Puzzle Description */}
      {puzzle && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-2xl font-bold mb-2 text-purple-900">{puzzle.title}</h3>
          <p className="text-gray-700 mb-4">{puzzle.description}</p>
          {puzzle.hint && (
            <p className="text-sm text-gray-600 italic">💡 Hint: {puzzle.hint}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gate Palette */}
        <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-display text-slate-300 mb-4 tracking-wide">Gate Palette</h3>
          <div className="space-y-3">
            {(Object.keys(GATE_DEFINITIONS) as GateType[]).map(gateType => (
              <motion.button
                key={gateType}
                onClick={() => {
                  setSelectedGate(gateType);
                  setSelectedControl(null);
                }}
                className={`w-full p-4 border-2 font-display text-xs tracking-wider text-void-950 transition-all uppercase ${selectedGate === gateType
                    ? 'bg-quantum-400 border-white scale-105 shadow-[4px_4px_0_rgba(0,0,0,0.5)]'
                    : 'bg-slate-200 border-slate-400 hover:scale-105 hover:bg-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-md font-bold mb-1">{GATE_DEFINITIONS[gateType].name}</div>
                <div className="text-[10px] opacity-70 font-mono">
                  {GATE_DEFINITIONS[gateType].description}
                </div>
              </motion.button>
            ))}
          </div>

          {selectedGate && (
            <div className="mt-4 p-3 bg-void-950 border border-quantum-500/30 text-quantum-400">
              <p className="text-xs font-mono">
                {selectedGate === 'CNOT' && selectedControl === null
                  ? '> SELECT_CONTROL_QUBIT'
                  : selectedGate === 'CNOT' && selectedControl !== null
                    ? `> CONTROL: q${selectedControl} // SELECT_TARGET`
                    : '> SELECT_QUBIT_LINE'}
              </p>
            </div>
          )}
        </div>

        {/* Circuit Display */}
        <div className="lg:col-span-2 bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display text-slate-300 tracking-wide">Quantum Circuit</h3>
            <button
              onClick={clearCircuit}
              className="px-4 py-2 bg-retro-red/20 text-retro-red border-2 border-retro-red hover:bg-retro-red hover:text-white transition-colors text-xs font-display uppercase tracking-wider"
            >
              Reset_Circuit
            </button>
          </div>

          {/* Circuit Grid */}
          <div className="space-y-8 mb-8">
            {Array.from({ length: numQubits }).map((_, qubitIndex) => (
              <div key={qubitIndex} className="relative">
                {/* Qubit label */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 font-display text-quantum-400 text-sm">
                  q{qubitIndex}
                </div>

                {/* Qubit line */}
                <div
                  className="h-14 border-b-2 border-void-700 relative cursor-pointer hover:border-quantum-500/50 transition-colors"
                  onClick={() => addGate(qubitIndex, maxPosition)}
                >
                  {/* Initial state */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                    |0⟩
                  </div>

                  {/* Gates on this qubit */}
                  {circuit.gates
                    .filter(g => g.gate.targetQubit === qubitIndex || g.gate.controlQubit === qubitIndex)
                    .map(placedGate => {
                      const isTarget = placedGate.gate.targetQubit === qubitIndex;
                      const gateType = placedGate.gate.type;
                      // Use simpler colors for pixel aesthetic
                      const bgColor = isTarget ? 'bg-slate-200' : 'bg-void-950';

                      return (
                        <motion.div
                          key={placedGate.id}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: `${placedGate.position * 80 + 40}px` }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {isTarget ? (
                            <div
                              className={`w-10 h-10 bg-slate-200 border-2 border-white flex items-center justify-center text-void-950 font-display font-bold text-sm cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,0.5)] hover:bg-white`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeGate(placedGate.id);
                              }}
                            >
                              {gateType}
                            </div>
                          ) : (
                            // Control dot for CNOT
                            <div className="w-4 h-4 bg-quantum-500 rounded-none border-2 border-white rotate-45" />
                          )}
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* State Display */}
          <div className="border-t-2 border-void-800 pt-6">
            <h4 className="font-display text-sm text-slate-400 mb-4 tracking-widest">CURRENT_STATE_VECTOR</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {currentState.amplitudes.map((amp, i) => {
                const magnitude = Math.sqrt(amp.real * amp.real + amp.imaginary * amp.imaginary);
                const probability = magnitude * magnitude;

                if (probability < 0.001) return null;

                const binaryState = i.toString(2).padStart(numQubits, '0');

                return (
                  <div key={i} className="bg-void-950 p-2 border border-void-700 text-sm font-mono">
                    <div className="text-quantum-400">|{binaryState}⟩</div>
                    <div className="text-xs text-slate-500">
                      {(probability * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Puzzle Validation */}
          {puzzle && (
            <div className="mt-4">
              <button
                onClick={validatePuzzle}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Check Solution
              </button>

              {showValidation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-4 rounded-lg ${validationMessage.includes('Correct')
                      ? 'bg-green-50 border-2 border-green-300 text-green-900'
                      : 'bg-yellow-50 border-2 border-yellow-300 text-yellow-900'
                    }`}
                >
                  {validationMessage}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
