import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';

interface ScenarioCard {
  id: string;
  title: string;
  description: string;
  correctCategory: 'high' | 'medium' | 'low';
  explanation: string;
  relatedConcepts: string[]; // Module IDs for misconception detection
}

const SCENARIOS: ScenarioCard[] = [
  {
    id: 'drug-discovery',
    title: 'Drug Discovery',
    description: 'Simulating molecular interactions to find new pharmaceutical compounds',
    correctCategory: 'high',
    explanation: 'Quantum computers excel at simulating quantum systems like molecules. This is one of the most promising near-term applications.',
    relatedConcepts: ['superposition', 'algorithms']
  },
  {
    id: 'password-cracking',
    title: 'Password Cracking',
    description: 'Breaking all encryption instantly with quantum computers',
    correctCategory: 'low',
    explanation: 'While Shor\'s algorithm can break RSA, it requires millions of qubits. Post-quantum cryptography already exists. This is overhyped.',
    relatedConcepts: ['algorithms', 'hardware']
  },
  {
    id: 'optimization',
    title: 'Supply Chain Optimization',
    description: 'Finding optimal routes and schedules for logistics',
    correctCategory: 'medium',
    explanation: 'Quantum optimization algorithms show promise, but classical algorithms are still very competitive. The advantage is unclear for many real-world problems.',
    relatedConcepts: ['algorithms']
  },
  {
    id: 'ai-training',
    title: 'AI Model Training',
    description: 'Training neural networks faster with quantum computers',
    correctCategory: 'low',
    explanation: 'Most AI training is limited by data, not computation. Quantum computers don\'t help with data collection. Classical GPUs are highly optimized for this.',
    relatedConcepts: ['algorithms']
  },
  {
    id: 'financial-modeling',
    title: 'Financial Risk Analysis',
    description: 'Monte Carlo simulations for portfolio optimization',
    correctCategory: 'medium',
    explanation: 'Quantum amplitude estimation can speed up Monte Carlo methods, but requires fault-tolerant quantum computers. Classical methods work well today.',
    relatedConcepts: ['algorithms', 'hardware']
  },
  {
    id: 'weather-prediction',
    title: 'Weather Forecasting',
    description: 'Predicting weather patterns weeks in advance',
    correctCategory: 'low',
    explanation: 'Weather is chaotic - small errors grow exponentially. More qubits won\'t solve this fundamental limit. Classical supercomputers are better suited.',
    relatedConcepts: ['hardware']
  },
  {
    id: 'materials-science',
    title: 'Materials Design',
    description: 'Discovering new materials with specific properties',
    correctCategory: 'high',
    explanation: 'Like drug discovery, this involves simulating quantum systems. Quantum computers can model electron interactions that classical computers struggle with.',
    relatedConcepts: ['superposition', 'algorithms']
  },
  {
    id: 'database-search',
    title: 'Database Search',
    description: 'Searching unsorted databases faster',
    correctCategory: 'low',
    explanation: 'Grover\'s algorithm provides only quadratic speedup. Real databases use indexing and other optimizations that are more practical.',
    relatedConcepts: ['algorithms']
  }
];

type Category = 'high' | 'medium' | 'low' | null;

export function ApplicationClassifier() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState<ScenarioCard[]>([]);
  const [completed, setCompleted] = useState(false);
  
  const { addXP, addToReviewQueue } = useLearningStore();

  const currentCard = SCENARIOS[currentCardIndex];
  const isLastCard = currentCardIndex === SCENARIOS.length - 1;

  const handleCategorySelect = (category: Category) => {
    if (showExplanation) return;
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;

    const isCorrect = selectedCategory === currentCard.correctCategory;
    setShowExplanation(true);

    if (isCorrect) {
      setStreak(prev => prev + 1);
      addXP(20, 'application-classification');
    } else {
      setStreak(0);
      setIncorrectCards(prev => [...prev, currentCard]);
    }
  };

  const handleNext = () => {
    if (isLastCard) {
      setCompleted(true);
      
      // Detect misconceptions and suggest modules
      if (incorrectCards.length > 0) {
        const misconceptions = detectMisconceptions(incorrectCards);
        misconceptions.forEach(moduleId => {
          addToReviewQueue({
            moduleId,
            conceptId: 'application-classification',
            reason: 'incorrect',
            priority: 2,
            nextReviewDate: new Date()
          });
        });
      }

      // Award achievement for perfect score
      if (incorrectCards.length === 0) {
        addXP(100, 'perfect-classification');
      }
    } else {
      setCurrentCardIndex(prev => prev + 1);
      setSelectedCategory(null);
      setShowExplanation(false);
    }
  };

  const detectMisconceptions = (incorrect: ScenarioCard[]): string[] => {
    const conceptCounts: Record<string, number> = {};
    
    incorrect.forEach(card => {
      card.relatedConcepts.forEach(concept => {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      });
    });

    // Return concepts that appear in 2+ incorrect answers
    return Object.entries(conceptCounts)
      .filter(([_, count]) => count >= 2)
      .map(([concept]) => concept);
  };

  if (completed) {
    const score = SCENARIOS.length - incorrectCards.length;
    const percentage = Math.round((score / SCENARIOS.length) * 100);
    const misconceptions = detectMisconceptions(incorrectCards);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-xl p-8 border border-slate-700"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Challenge Complete!</h3>
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6">
            <p className="text-4xl font-bold text-cyan-400 mb-2">{percentage}%</p>
            <p className="text-slate-300">
              You got {score} out of {SCENARIOS.length} correct
            </p>
          </div>

          {incorrectCards.length === 0 ? (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 font-semibold">Perfect Score! 🎉</p>
              <p className="text-green-200 text-sm mt-1">
                You have a great understanding of quantum computing applications!
              </p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-300 mb-2">Areas to review:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  {incorrectCards.map(card => (
                    <li key={card.id}>{card.title}</li>
                  ))}
                </ul>
              </div>

              {misconceptions.length > 0 && (
                <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                  <p className="text-purple-300 font-semibold mb-2">
                    Suggested modules to review:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {misconceptions.map(concept => (
                      <span
                        key={concept}
                        className="px-3 py-1 bg-purple-800 text-purple-200 rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
      {/* Progress and Streak */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400 text-sm">
          Card {currentCardIndex + 1} of {SCENARIOS.length}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Streak:</span>
          <motion.span
            key={streak}
            initial={{ scale: 1.5, color: '#22c55e' }}
            animate={{ scale: 1, color: '#94a3b8' }}
            className="text-lg font-bold"
          >
            {streak}
          </motion.span>
        </div>
      </div>

      {/* Scenario Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-slate-800 rounded-lg p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-white mb-3">{currentCard.title}</h3>
          <p className="text-slate-300">{currentCard.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Category Selection */}
      <div className="space-y-3 mb-6">
        <CategoryButton
          category="high"
          label="Quantum can help a lot"
          selected={selectedCategory === 'high'}
          correct={showExplanation && currentCard.correctCategory === 'high'}
          incorrect={showExplanation && selectedCategory === 'high' && currentCard.correctCategory !== 'high'}
          onClick={() => handleCategorySelect('high')}
          disabled={showExplanation}
        />
        <CategoryButton
          category="medium"
          label="Quantum could help but complicated"
          selected={selectedCategory === 'medium'}
          correct={showExplanation && currentCard.correctCategory === 'medium'}
          incorrect={showExplanation && selectedCategory === 'medium' && currentCard.correctCategory !== 'medium'}
          onClick={() => handleCategorySelect('medium')}
          disabled={showExplanation}
        />
        <CategoryButton
          category="low"
          label="Quantum will not help much"
          selected={selectedCategory === 'low'}
          correct={showExplanation && currentCard.correctCategory === 'low'}
          incorrect={showExplanation && selectedCategory === 'low' && currentCard.correctCategory !== 'low'}
          onClick={() => handleCategorySelect('low')}
          disabled={showExplanation}
        />
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-lg p-4 mb-6 ${
              selectedCategory === currentCard.correctCategory
                ? 'bg-green-900/30 border border-green-700'
                : 'bg-orange-900/30 border border-orange-700'
            }`}
          >
            <p className={`font-semibold mb-2 ${
              selectedCategory === currentCard.correctCategory
                ? 'text-green-300'
                : 'text-orange-300'
            }`}>
              {selectedCategory === currentCard.correctCategory
                ? '✓ Correct!'
                : 'Not quite right'}
            </p>
            <p className="text-slate-300 text-sm">{currentCard.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {isLastCard ? 'See Results' : 'Next Card'}
          </button>
        )}
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  category: string;
  label: string;
  selected: boolean;
  correct: boolean;
  incorrect: boolean;
  onClick: () => void;
  disabled: boolean;
}

function CategoryButton({ label, selected, correct, incorrect, onClick, disabled }: CategoryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
        correct
          ? 'border-green-500 bg-green-900/30 text-green-300'
          : incorrect
          ? 'border-red-500 bg-red-900/30 text-red-300'
          : selected
          ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300'
          : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
      } ${disabled && !correct && !incorrect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        {correct && <span className="text-green-400">✓</span>}
        {incorrect && <span className="text-red-400">✗</span>}
      </div>
    </motion.button>
  );
}
