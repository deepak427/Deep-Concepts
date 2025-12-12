import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { MeasurementResult } from '../../types/quantum';

// Lazy load BlochSphere for better performance
const BlochSphere = lazy(() => 
  import('../quantum/BlochSphere').then(module => ({ default: module.BlochSphere }))
);

export const BitsVsQubits = () => {
  const [mode, setMode] = useState<'bit' | 'qubit'>('bit');
  const [bitValue, setBitValue] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);

  const handleMeasurement = (result: MeasurementResult) => {
    console.log('Measurement result:', result);
  };

  const handleChallengeComplete = (success: boolean) => {
    if (success) {
      setChallengeResult('Success! You set the qubit to 75% probability of |1⟩! 🎉');
    } else {
      setChallengeResult('Not quite. Try adjusting the qubit state to get closer to 75%.');
    }
    setTimeout(() => setChallengeResult(null), 3000);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8">
      <div className="flex gap-4 mb-8 bg-slate-800 p-1 rounded-lg w-fit mx-auto">
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${mode === 'bit' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setMode('bit')}
        >
          Classical Bit
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${mode === 'qubit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setMode('qubit')}
        >
          Qubit
        </button>
      </div>

      {mode === 'bit' ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-colors cursor-pointer ${bitValue === 1 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
            onClick={() => setBitValue(v => v === 0 ? 1 : 0)}
          >
            {bitValue}
          </div>
          <p className="text-sm text-slate-400">Click circle to flip bit</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowChallenge(!showChallenge)}
              className="text-sm text-purple-400 hover:text-purple-300 underline"
            >
              {showChallenge ? 'Hide Challenge' : 'Show Challenge'}
            </button>
          </div>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner size="large" message="Loading Bloch Sphere..." />}>
              <BlochSphere 
                onMeasurement={handleMeasurement}
                onChallengeComplete={handleChallengeComplete}
                showChallenge={showChallenge}
              />
            </Suspense>
          </ErrorBoundary>
          {challengeResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 p-4 rounded-lg ${challengeResult.includes('Success') ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}
            >
              {challengeResult}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};