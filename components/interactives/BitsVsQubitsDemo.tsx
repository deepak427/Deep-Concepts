import { useState } from 'react';
import { motion } from 'framer-motion';
import { PixelButton } from '../shared/PixelButton';
import { PixelCard } from '../shared/PixelCard';

interface BitsVsQubitsProps {
  onChallengeComplete?: (success: boolean) => void;
}

export function BitsVsQubitsDemo({ onChallengeComplete }: BitsVsQubitsProps) {
  const [selectedBit, setSelectedBit] = useState<0 | 1>(0);
  const [qubitState, setQubitState] = useState<'0' | '1' | 'superposition'>('0');
  const [showComparison, setShowComparison] = useState(false);
  const [measurementResult, setMeasurementResult] = useState<number | null>(null);

  const handleMeasureQubit = () => {
    if (qubitState === 'superposition') {
      // 50/50 chance for superposition
      const result = Math.random() < 0.5 ? 0 : 1;
      setMeasurementResult(result);
      setQubitState(result === 0 ? '0' : '1');
    } else {
      setMeasurementResult(qubitState === '0' ? 0 : 1);
    }
  };

  const resetQubit = () => {
    setQubitState('0');
    setMeasurementResult(null);
  };

  const createSuperposition = () => {
    setQubitState('superposition');
    setMeasurementResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Classical Bit Section */}
      <PixelCard variant="elevated" padding="md">
        <h3 className="font-display text-quantum-400 text-lg mb-4 uppercase tracking-widest">
          Classical Bit
        </h3>
        <p className="text-slate-400 mb-4 text-sm">
          A classical bit can only be in one definite state: either 0 or 1.
        </p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-2">
            <PixelButton
              variant={selectedBit === 0 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedBit(0)}
            >
              Set to 0
            </PixelButton>
            <PixelButton
              variant={selectedBit === 1 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedBit(1)}
            >
              Set to 1
            </PixelButton>
          </div>
        </div>

        <div className="bg-void-950 border-2 border-quantum-500 p-4 text-center">
          <div className="text-4xl font-display text-quantum-400 mb-2">
            {selectedBit}
          </div>
          <p className="text-xs text-slate-500">Current State: {selectedBit}</p>
        </div>
      </PixelCard>

      {/* Quantum Qubit Section */}
      <PixelCard variant="elevated" padding="md">
        <h3 className="font-display text-synapse-400 text-lg mb-4 uppercase tracking-widest">
          Quantum Qubit
        </h3>
        <p className="text-slate-400 mb-4 text-sm">
          A qubit can be in state |0⟩, |1⟩, or a superposition of both states simultaneously!
        </p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <PixelButton
            variant={qubitState === '0' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setQubitState('0'); setMeasurementResult(null); }}
          >
            |0⟩
          </PixelButton>
          <PixelButton
            variant={qubitState === '1' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setQubitState('1'); setMeasurementResult(null); }}
          >
            |1⟩
          </PixelButton>
          <PixelButton
            variant={qubitState === 'superposition' ? 'energy' : 'ghost'}
            size="sm"
            onClick={createSuperposition}
          >
            |+⟩ = (|0⟩ + |1⟩)/√2
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={resetQubit}
          >
            Reset
          </PixelButton>
        </div>

        <div className="bg-void-950 border-2 border-synapse-500 p-4 text-center mb-4">
          {qubitState === 'superposition' ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl font-display text-synapse-400 mb-2"
            >
              ?
            </motion.div>
          ) : (
            <div className="text-4xl font-display text-synapse-400 mb-2">
              |{qubitState}⟩
            </div>
          )}
          <p className="text-xs text-slate-500">
            Current State: {qubitState === 'superposition' ? 'Superposition' : `|${qubitState}⟩`}
          </p>
          {measurementResult !== null && (
            <p className="text-xs text-energy-400 mt-2">
              Last Measurement: {measurementResult}
            </p>
          )}
        </div>

        <PixelButton
          variant="energy"
          size="sm"
          onClick={handleMeasureQubit}
          disabled={qubitState !== 'superposition' && measurementResult !== null}
          fullWidth
        >
          Measure Qubit
        </PixelButton>
      </PixelCard>

      {/* Comparison Section */}
      <PixelCard variant="glow" padding="md">
        <h3 className="font-display text-energy-400 text-lg mb-4 uppercase tracking-widest">
          Key Differences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-void-950 border border-quantum-500 p-4">
            <h4 className="font-display text-quantum-400 text-sm mb-2">Classical Bit</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Always in definite state (0 or 1)</li>
              <li>• Measurement doesn't change state</li>
              <li>• Can be copied perfectly</li>
              <li>• Deterministic behavior</li>
            </ul>
          </div>
          
          <div className="bg-void-950 border border-synapse-500 p-4">
            <h4 className="font-display text-synapse-400 text-sm mb-2">Quantum Qubit</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Can be in superposition of states</li>
              <li>• Measurement collapses superposition</li>
              <li>• Cannot be cloned (no-cloning theorem)</li>
              <li>• Probabilistic measurement outcomes</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-energy-500/20 border border-energy-500">
          <p className="text-energy-400 text-sm font-display">
            💡 The power of quantum computing comes from qubits being in superposition, 
            allowing quantum computers to explore many possibilities simultaneously!
          </p>
        </div>
      </PixelCard>
    </div>
  );
}