import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';

interface EntanglementDemoProps {
  onChallengeComplete?: (success: boolean) => void;
  showChallenge?: boolean;
  moduleId?: string;
}

interface QubitVisualization {
  state: 'superposition' | 'measured';
  outcome?: 0 | 1;
}

interface MeasurementPair {
  qubitA: 0 | 1;
  qubitB: 0 | 1;
}

interface MythCard {
  id: string;
  statement: string;
  isMyth: boolean;
  explanation: string;
}

const MYTH_CARDS: MythCard[] = [
  {
    id: 'ftl',
    statement: 'Entanglement allows faster-than-light communication',
    isMyth: true,
    explanation: 'Myth! While measurements are correlated, you cannot send information faster than light. The outcomes appear random to each observer until they compare results.'
  },
  {
    id: 'correlation',
    statement: 'Measuring one entangled qubit instantly determines the other',
    isMyth: false,
    explanation: 'Reality! This is the core of entanglement. When you measure one qubit, the other qubit\'s state is instantly determined, regardless of distance.'
  },
  {
    id: 'spooky',
    statement: 'Entanglement is just a hidden variable we haven\'t discovered yet',
    isMyth: true,
    explanation: 'Myth! Bell\'s theorem and experiments have shown that no local hidden variable theory can explain quantum correlations. The correlation is genuinely quantum.'
  },
  {
    id: 'distance',
    statement: 'Entanglement works regardless of the distance between qubits',
    isMyth: false,
    explanation: 'Reality! Entanglement correlations persist regardless of distance. This has been experimentally verified over hundreds of kilometers.'
  },
  {
    id: 'control',
    statement: 'You can control what outcome your entangled qubit will have',
    isMyth: true,
    explanation: 'Myth! You cannot control the outcome of your measurement. It appears random. You only know that it will be correlated with the other qubit.'
  },
  {
    id: 'bell-state',
    statement: 'A Bell state creates perfect correlation between two qubits',
    isMyth: false,
    explanation: 'Reality! Bell states like |Φ+⟩ create perfect correlation. If qubit A measures 0, qubit B will measure 0. If A measures 1, B measures 1.'
  }
];

export function EntanglementDemo({
  onChallengeComplete,
  showChallenge = false,
  moduleId = 'entanglement'
}: EntanglementDemoProps) {
  const [isEntangled, setIsEntangled] = useState(false);
  const [qubitA, setQubitA] = useState<QubitVisualization>({ state: 'superposition' });
  const [qubitB, setQubitB] = useState<QubitVisualization>({ state: 'superposition' });
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementPair[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Myth vs Reality game state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [classifiedCards, setClassifiedCards] = useState<{ [key: string]: 'myth' | 'reality' | null }>({});
  const [showCardResult, setShowCardResult] = useState(false);
  const [score, setScore] = useState(0);

  const { addXP, completeInteraction } = useLearningStore();

  // Create Bell State
  const handleCreateBellState = () => {
    setShowAnimation(true);
    setIsEntangled(false);
    
    setTimeout(() => {
      setIsEntangled(true);
      setQubitA({ state: 'superposition' });
      setQubitB({ state: 'superposition' });
      setShowAnimation(false);
      addXP(20, 'create-bell-state');
      completeInteraction(moduleId, 'create-bell-state');
    }, 1500);
  };

  // Measure Qubit A
  const handleMeasureA = () => {
    if (!isEntangled || qubitA.state === 'measured') return;

    // Random outcome for qubit A
    const outcomeA = Math.random() < 0.5 ? 0 : 1;
    
    // Due to entanglement, qubit B has the same outcome (for |Φ+⟩ Bell state)
    const outcomeB = outcomeA;

    setQubitA({ state: 'measured', outcome: outcomeA });
    setQubitB({ state: 'measured', outcome: outcomeB });
    
    setMeasurementHistory(prev => [...prev, { qubitA: outcomeA, qubitB: outcomeB }]);
    
    addXP(10, 'measure-entangled-qubit');
  };

  // Measure Qubit B
  const handleMeasureB = () => {
    if (!isEntangled || qubitB.state === 'measured') return;

    // Random outcome for qubit B
    const outcomeB = Math.random() < 0.5 ? 0 : 1;
    
    // Due to entanglement, qubit A has the same outcome
    const outcomeA = outcomeB;

    setQubitA({ state: 'measured', outcome: outcomeA });
    setQubitB({ state: 'measured', outcome: outcomeB });
    
    setMeasurementHistory(prev => [...prev, { qubitA: outcomeA, qubitB: outcomeB }]);
    
    addXP(10, 'measure-entangled-qubit');
  };

  // Reset qubits
  const handleReset = () => {
    setQubitA({ state: 'superposition' });
    setQubitB({ state: 'superposition' });
  };

  // Calculate correlation statistics
  const calculateCorrelation = () => {
    if (measurementHistory.length === 0) return { correlation: 0, matching: 0, total: 0 };
    
    const matching = measurementHistory.filter(pair => pair.qubitA === pair.qubitB).length;
    const total = measurementHistory.length;
    const correlation = (matching / total) * 100;
    
    return { correlation, matching, total };
  };

  // Handle card classification
  const handleClassifyCard = (classification: 'myth' | 'reality') => {
    const currentCard = MYTH_CARDS[currentCardIndex];
    const correct = (classification === 'myth' && currentCard.isMyth) || 
                   (classification === 'reality' && !currentCard.isMyth);
    
    setClassifiedCards(prev => ({ ...prev, [currentCard.id]: classification }));
    setShowCardResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      addXP(15, 'myth-reality-correct');
    }
  };

  // Move to next card
  const handleNextCard = () => {
    setShowCardResult(false);
    if (currentCardIndex < MYTH_CARDS.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Challenge complete
      const finalScore = score + (showCardResult && isCurrentCorrect() ? 1 : 0);
      const success = finalScore === MYTH_CARDS.length;
      
      if (success) {
        addXP(50, 'myth-buster-perfect');
        completeInteraction(moduleId, 'myth-reality-complete');
      }
      
      onChallengeComplete?.(success);
    }
  };

  // Check if current classification is correct
  const isCurrentCorrect = () => {
    const currentCard = MYTH_CARDS[currentCardIndex];
    const classification = classifiedCards[currentCard.id];
    return (classification === 'myth' && currentCard.isMyth) || 
           (classification === 'reality' && !currentCard.isMyth);
  };

  const stats = calculateCorrelation();
  const currentCard = MYTH_CARDS[currentCardIndex];
  const isGameComplete = currentCardIndex === MYTH_CARDS.length - 1 && showCardResult;

  return (
    <div className="flex flex-col gap-6">
      {/* Entangled Qubits Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-6">Entangled Qubit Pair</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Qubit A */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4 text-blue-600">Qubit A</h4>
            <div className="relative w-32 h-32 mb-4">
              <AnimatePresence mode="wait">
                {qubitA.state === 'superposition' ? (
                  <motion.div
                    key="superposition-a"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-white text-2xl font-bold"
                    >
                      ?
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="measured-a"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-4xl font-bold ${
                      qubitA.outcome === 0 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                  >
                    |{qubitA.outcome}⟩
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleMeasureA}
              disabled={!isEntangled || qubitA.state === 'measured'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Measure A
            </button>
          </div>

          {/* Entanglement Connection */}
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence>
              {showAnimation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>
            
            {isEntangled && !showAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-2"
                >
                  🔗
                </motion.div>
                <p className="text-sm font-semibold text-purple-600">Entangled!</p>
              </motion.div>
            )}
            
            <button
              onClick={handleCreateBellState}
              disabled={showAnimation}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              {isEntangled ? 'Create New Bell State' : 'Create Bell State'}
            </button>
            
            {isEntangled && (qubitA.state === 'measured' || qubitB.state === 'measured') && (
              <button
                onClick={handleReset}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Qubit B */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4 text-red-600">Qubit B</h4>
            <div className="relative w-32 h-32 mb-4">
              <AnimatePresence mode="wait">
                {qubitB.state === 'superposition' ? (
                  <motion.div
                    key="superposition-b"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-purple-400 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-white text-2xl font-bold"
                    >
                      ?
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="measured-b"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-4xl font-bold ${
                      qubitB.outcome === 0 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                  >
                    |{qubitB.outcome}⟩
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleMeasureB}
              disabled={!isEntangled || qubitB.state === 'measured'}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Measure B
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>How it works:</strong> When you create a Bell state (|Φ+⟩), the two qubits become entangled. 
            Measuring one qubit instantly determines the other's state, regardless of distance. 
            Try measuring multiple times to see the perfect correlation!
          </p>
        </div>
      </div>

      {/* Correlation Statistics */}
      {measurementHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Correlation Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.correlation.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 mt-1">Correlation</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.matching}</p>
              <p className="text-sm text-gray-600 mt-1">Matching Pairs</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-600">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Measurements</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-center">Qubit A</th>
                  <th className="py-2 px-4 text-center">Qubit B</th>
                  <th className="py-2 px-4 text-center">Match?</th>
                </tr>
              </thead>
              <tbody>
                {measurementHistory.slice(-10).reverse().map((pair, idx) => (
                  <tr key={measurementHistory.length - idx} className="border-b border-gray-100">
                    <td className="py-2 px-4">{measurementHistory.length - idx}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                        pair.qubitA === 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        |{pair.qubitA}⟩
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                        pair.qubitB === 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        |{pair.qubitB}⟩
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {pair.qubitA === pair.qubitB ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {measurementHistory.length > 10 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing last 10 measurements
            </p>
          )}
        </motion.div>
      )}

      {/* Myth vs Reality Card Deck */}
      {showChallenge && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-2xl font-semibold mb-2 text-purple-900">Myth vs Reality</h3>
          <p className="text-sm text-gray-700 mb-4">
            Test your understanding! Classify each statement as Myth or Reality.
          </p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Card {currentCardIndex + 1} of {MYTH_CARDS.length}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                Score: {score}/{MYTH_CARDS.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / MYTH_CARDS.length) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showCardResult ? (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-lg p-6 shadow-md mb-4"
              >
                <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                  "{currentCard.statement}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleClassifyCard('myth')}
                    className="px-6 py-4 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors border-2 border-red-300"
                  >
                    🚫 Myth
                  </button>
                  <button
                    onClick={() => handleClassifyCard('reality')}
                    className="px-6 py-4 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors border-2 border-green-300"
                  >
                    ✓ Reality
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`result-${currentCard.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-lg p-6 mb-4 ${
                  isCurrentCorrect()
                    ? 'bg-green-100 border-2 border-green-400'
                    : 'bg-orange-100 border-2 border-orange-400'
                }`}
              >
                <p className={`text-xl font-bold mb-3 ${
                  isCurrentCorrect() ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {isCurrentCorrect() ? '✓ Correct!' : '✗ Not quite!'}
                </p>
                <p className="text-sm text-gray-800 mb-4">
                  {currentCard.explanation}
                </p>
                {isCurrentCorrect() && (
                  <p className="text-sm font-semibold text-green-700">+15 XP earned!</p>
                )}
                
                {!isGameComplete && (
                  <button
                    onClick={handleNextCard}
                    className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Next Card
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isGameComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h4 className="text-xl font-bold text-purple-900 mb-2">Challenge Complete!</h4>
              <p className="text-gray-700 mb-4">
                Final Score: {score + (isCurrentCorrect() ? 1 : 0)}/{MYTH_CARDS.length}
              </p>
              {score + (isCurrentCorrect() ? 1 : 0) === MYTH_CARDS.length && (
                <p className="text-green-700 font-semibold">
                  🎉 Perfect score! +50 XP bonus earned!
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
