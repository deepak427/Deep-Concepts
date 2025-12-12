import { useState } from 'react';
import { CircuitBuilder } from '../quantum/CircuitBuilder';
import { CIRCUIT_PUZZLES } from '../../constants/circuitPuzzles';
import { useLearningStore } from '../../lib/learningState';
import { motion, AnimatePresence } from 'framer-motion';

export function CircuitBuilderDemo() {
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  
  const { addXP, completeInteraction, unlockAchievement } = useLearningStore();

  const currentPuzzle = CIRCUIT_PUZZLES[selectedPuzzleIndex];

  const handlePuzzleComplete = (success: boolean) => {
    if (success && !completedPuzzles.has(currentPuzzle.id)) {
      // Award XP
      addXP(currentPuzzle.xpReward, `circuit-puzzle-${currentPuzzle.id}`);
      
      // Mark interaction as complete
      completeInteraction('quantum-gates', currentPuzzle.id);
      
      // Track completed puzzle
      setCompletedPuzzles(prev => new Set([...prev, currentPuzzle.id]));
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Check for achievement
      if (completedPuzzles.size + 1 >= CIRCUIT_PUZZLES.length) {
        unlockAchievement('circuit-puzzle-master');
      }
    }
  };

  const handleGateAdded = () => {
    // Track that user is building circuits
    completeInteraction('quantum-gates', 'circuit-builder-used');
  };

  return (
    <div className="space-y-6">
      {/* Puzzle Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Circuit Building Challenges</h2>
        <div className="flex flex-wrap gap-2">
          {CIRCUIT_PUZZLES.map((puzzle, index) => (
            <button
              key={puzzle.id}
              onClick={() => setSelectedPuzzleIndex(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPuzzleIndex === index
                  ? 'bg-purple-600 text-white'
                  : completedPuzzles.has(puzzle.id)
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {puzzle.title}
              {completedPuzzles.has(puzzle.id) && ' ✓'}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completedPuzzles.size} / {CIRCUIT_PUZZLES.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedPuzzles.size / CIRCUIT_PUZZLES.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Circuit Builder */}
      <CircuitBuilder
        numQubits={currentPuzzle.numQubits}
        puzzle={currentPuzzle}
        onPuzzleComplete={handlePuzzleComplete}
        onGateAdded={handleGateAdded}
      />

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-bold text-lg">Puzzle Solved!</div>
                <div className="text-sm">+{currentPuzzle.xpReward} XP</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select a gate from the palette on the left</li>
          <li>• Click on a qubit line to place the gate</li>
          <li>• For CNOT gates, first click the control qubit, then the target</li>
          <li>• Click on a placed gate to remove it</li>
          <li>• Watch the state display update as you build your circuit</li>
          <li>• Click "Check Solution" to validate your answer</li>
        </ul>
      </div>
    </div>
  );
}
