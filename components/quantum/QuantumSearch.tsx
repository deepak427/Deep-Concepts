import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';

interface SearchResult {
  mode: 'classical' | 'quantum';
  attempts: number;
}

export function QuantumSearch() {
  const SEARCH_SPACE_SIZE = 16;
  const [target] = useState(() => Math.floor(Math.random() * SEARCH_SPACE_SIZE));
  const [mode, setMode] = useState<'classical' | 'quantum'>('classical');
  const [revealed, setRevealed] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [quantumPhase, setQuantumPhase] = useState<'idle' | 'superposition' | 'oracle' | 'amplification' | 'found'>('idle');
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);
  const [isRunningTrials, setIsRunningTrials] = useState(false);
  
  const { addXP, unlockAchievement, completeInteraction } = useLearningStore();

  // Calculate averages
  const classicalAverage = searchHistory
    .filter(r => r.mode === 'classical')
    .reduce((sum, r) => sum + r.attempts, 0) / 
    (searchHistory.filter(r => r.mode === 'classical').length || 1);

  const quantumAverage = searchHistory
    .filter(r => r.mode === 'quantum')
    .reduce((sum, r) => sum + r.attempts, 0) / 
    (searchHistory.filter(r => r.mode === 'quantum').length || 1);

  const reset = () => {
    setRevealed([]);
    setAttempts(0);
    setQuantumPhase('idle');
  };

  const switchMode = (newMode: 'classical' | 'quantum') => {
    setMode(newMode);
    reset();
  };

  const handleBoxClick = (idx: number) => {
    if (mode === 'quantum') return;
    if (revealed.includes(idx)) return;
    
    const newRevealed = [...revealed, idx];
    const newAttempts = attempts + 1;
    
    setRevealed(newRevealed);
    setAttempts(newAttempts);

    // Found the target
    if (idx === target) {
      setSearchHistory(prev => [...prev, { mode: 'classical', attempts: newAttempts }]);
      
      // Award XP
      addXP(20, 'classical-search-complete');
      completeInteraction('quantum-search', 'classical-search');
    }
  };

  const runQuantumSearch = () => {
    if (quantumPhase !== 'idle') return;

    setQuantumPhase('superposition');
    
    // Superposition phase
    setTimeout(() => {
      setQuantumPhase('oracle');
      
      // Oracle phase
      setTimeout(() => {
        setQuantumPhase('amplification');
        
        // Amplification phase
        setTimeout(() => {
          setQuantumPhase('found');
          
          // Quantum search typically finds in sqrt(N) iterations
          // For N=16, sqrt(16) = 4 iterations
          const quantumAttempts = Math.ceil(Math.sqrt(SEARCH_SPACE_SIZE));
          setAttempts(quantumAttempts);
          setSearchHistory(prev => [...prev, { mode: 'quantum', attempts: quantumAttempts }]);
          
          // Award XP
          addXP(30, 'quantum-search-complete');
          completeInteraction('quantum-search', 'quantum-search');
          
          // Check for achievement
          if (searchHistory.length >= 5) {
            const recentClassical = searchHistory
              .filter(r => r.mode === 'classical')
              .slice(-3);
            const recentQuantum = searchHistory
              .filter(r => r.mode === 'quantum')
              .slice(-3);
            
            if (recentClassical.length >= 3 && recentQuantum.length >= 3) {
              const classicalAvg = recentClassical.reduce((sum, r) => sum + r.attempts, 0) / 3;
              const quantumAvg = recentQuantum.reduce((sum, r) => sum + r.attempts, 0) / 3;
              
              if (quantumAvg < classicalAvg) {
                unlockAchievement('amplitude-amplifier');
                addXP(50, 'amplitude-amplifier-achievement');
              }
            }
          }
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const runMultipleTrials = async (numTrials: number) => {
    setIsRunningTrials(true);
    
    for (let i = 0; i < numTrials; i++) {
      // Simulate classical search
      const classicalAttempts = Math.floor(Math.random() * SEARCH_SPACE_SIZE) + 1;
      setSearchHistory(prev => [...prev, { mode: 'classical', attempts: classicalAttempts }]);
      
      // Simulate quantum search
      const quantumAttempts = Math.ceil(Math.sqrt(SEARCH_SPACE_SIZE)) + 
        (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0); // Add some variance
      setSearchHistory(prev => [...prev, { mode: 'quantum', attempts: Math.max(1, quantumAttempts) }]);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsRunningTrials(false);
    addXP(40, 'multi-trial-analysis');
    completeInteraction('quantum-search', 'multi-trial-runner');
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8">
      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => switchMode('classical')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'classical' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/50' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Classical Search
        </button>
        <button 
          onClick={() => switchMode('quantum')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'quantum' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Quantum Search
        </button>
      </div>

      {/* Search Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6">
        {Array.from({ length: SEARCH_SPACE_SIZE }).map((_, idx) => {
          const isTarget = idx === target;
          const isRevealed = revealed.includes(idx);
          const isFound = mode === 'classical' && isRevealed && isTarget;
          const isMiss = mode === 'classical' && isRevealed && !isTarget;
          
          let boxColor = '#1e293b'; // default slate-800
          let boxOpacity = 1;
          let boxScale = 1;
          
          if (mode === 'quantum') {
            if (quantumPhase === 'superposition') {
              boxColor = '#6366f1'; // indigo
              boxOpacity = 0.6;
            } else if (quantumPhase === 'oracle') {
              boxColor = isTarget ? '#8b5cf6' : '#6366f1';
              boxOpacity = isTarget ? 1 : 0.4;
            } else if (quantumPhase === 'amplification' || quantumPhase === 'found') {
              boxColor = isTarget ? '#a855f7' : '#1e293b';
              boxOpacity = isTarget ? 1 : 0.2;
              boxScale = isTarget ? 1.1 : 0.9;
            }
          } else {
            if (isFound) boxColor = '#22c55e'; // green
            if (isMiss) boxColor = '#ef4444'; // red
          }

          return (
            <motion.div
              key={idx}
              onClick={() => handleBoxClick(idx)}
              animate={{
                backgroundColor: boxColor,
                opacity: boxOpacity,
                scale: boxScale
              }}
              whileHover={mode === 'classical' && !isRevealed ? { scale: 1.05 } : {}}
              whileTap={mode === 'classical' && !isRevealed ? { scale: 0.95 } : {}}
              className={`
                h-16 rounded-lg border border-slate-600 flex items-center justify-center font-mono text-sm
                ${mode === 'classical' && !isRevealed ? 'cursor-pointer' : 'cursor-default'}
                transition-colors duration-300
              `}
            >
              {mode === 'classical' && isRevealed && (
                <span className="text-2xl">
                  {isTarget ? '✓' : '✗'}
                </span>
              )}
              {mode === 'quantum' && quantumPhase !== 'idle' && (
                <span className="text-xs text-slate-300">
                  {quantumPhase === 'superposition' && '6.25%'}
                  {quantumPhase === 'oracle' && (isTarget ? '↑' : '6.25%')}
                  {(quantumPhase === 'amplification' || quantumPhase === 'found') && 
                    (isTarget ? '95%' : '0.3%')}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Status Display */}
      <div className="text-center min-h-[5rem] mb-6">
        {mode === 'classical' && (
          <div className="space-y-2">
            <p className="text-slate-300 text-lg">
              Attempts: <span className="font-bold text-cyan-400">{attempts}</span>
            </p>
            <p className="text-xs text-slate-500">
              Expected average: {Math.ceil(SEARCH_SPACE_SIZE / 2)} attempts
            </p>
            {revealed.includes(target) && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 font-medium"
              >
                Found in {attempts} attempts!
              </motion.p>
            )}
          </div>
        )}
        
        {mode === 'quantum' && (
          <div className="flex flex-col items-center space-y-3">
            {quantumPhase === 'idle' && (
              <button 
                onClick={runQuantumSearch}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Run Quantum Algorithm
              </button>
            )}
            
            <AnimatePresence mode="wait">
              {quantumPhase === 'superposition' && (
                <motion.p
                  key="superposition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-purple-300 animate-pulse"
                >
                  Creating equal superposition...
                </motion.p>
              )}
              
              {quantumPhase === 'oracle' && (
                <motion.p
                  key="oracle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-purple-300 animate-pulse"
                >
                  Oracle marking target state...
                </motion.p>
              )}
              
              {quantumPhase === 'amplification' && (
                <motion.p
                  key="amplification"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-purple-300 animate-pulse"
                >
                  Amplifying target amplitude...
                </motion.p>
              )}
              
              {quantumPhase === 'found' && (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <p className="text-green-400 font-medium text-lg">
                    Target found efficiently!
                  </p>
                  <p className="text-slate-300">
                    Quantum iterations: <span className="font-bold text-purple-400">{attempts}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Expected: ~{Math.ceil(Math.sqrt(SEARCH_SPACE_SIZE))} iterations (√N)
                  </p>
                  <button
                    onClick={reset}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300 underline"
                  >
                    Run Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Multi-Trial Runner */}
      <div className="border-t border-slate-700 pt-6 mt-6">
        <h3 className="text-slate-200 font-medium mb-3 text-center">
          Performance Comparison
        </h3>
        
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => runMultipleTrials(10)}
            disabled={isRunningTrials}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Run 10 Trials
          </button>
          <button
            onClick={() => runMultipleTrials(50)}
            disabled={isRunningTrials}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Run 50 Trials
          </button>
          <button
            onClick={() => setSearchHistory([])}
            disabled={isRunningTrials || searchHistory.length === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear History
          </button>
        </div>

        {searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            <div className="bg-slate-800 rounded-lg p-4 border border-cyan-600/30">
              <p className="text-xs text-slate-400 mb-1">Classical Average</p>
              <p className="text-2xl font-bold text-cyan-400">
                {classicalAverage.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchHistory.filter(r => r.mode === 'classical').length} trials
              </p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-purple-600/30">
              <p className="text-xs text-slate-400 mb-1">Quantum Average</p>
              <p className="text-2xl font-bold text-purple-400">
                {quantumAverage.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchHistory.filter(r => r.mode === 'quantum').length} trials
              </p>
            </div>
          </motion.div>
        )}

        {searchHistory.length > 0 && quantumAverage < classicalAverage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-green-400 text-sm mt-4"
          >
            ⚡ Quantum search is {((classicalAverage / quantumAverage - 1) * 100).toFixed(0)}% faster on average!
          </motion.p>
        )}
      </div>
    </div>
  );
}
