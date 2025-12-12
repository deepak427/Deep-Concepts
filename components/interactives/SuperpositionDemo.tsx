import { useState } from 'react';
import { motion } from 'framer-motion';
import { WaveInterference } from '../quantum/WaveInterference';

export const SuperpositionDemo = () => {
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);

  const handleChallengeComplete = (success: boolean) => {
    if (success) {
      setChallengeResult('🎉 Excellent! You correctly predicted the probability distribution! +40 XP');
    } else {
      setChallengeResult('Not quite. Try adjusting the wave phases to see how constructive and destructive interference work!');
    }
    setTimeout(() => setChallengeResult(null), 4000);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Wave Superposition</h2>
        <p className="text-slate-400">
          Adjust the wave parameters to see how quantum superposition creates probability distributions.
          When waves interfere constructively, they amplify. When they interfere destructively, they cancel out.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowChallenge(!showChallenge)}
          className="text-sm text-purple-400 hover:text-purple-300 underline"
        >
          {showChallenge ? 'Hide Challenge' : 'Show Challenge'}
        </button>
      </div>

      <WaveInterference 
        onChallengeComplete={handleChallengeComplete}
        showChallenge={showChallenge}
        moduleId="superposition"
      />

      {challengeResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mt-4 p-4 rounded-lg ${
            challengeResult.includes('🎉') 
              ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
          }`}
        >
          {challengeResult}
        </motion.div>
      )}
    </div>
  );
};
