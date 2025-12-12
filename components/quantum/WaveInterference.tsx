import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';

interface WaveInterferenceProps {
  onChallengeComplete?: (success: boolean) => void;
  showChallenge?: boolean;
  moduleId?: string;
}

interface WaveParams {
  amplitude1: number;
  amplitude2: number;
  phase1: number;
  phase2: number;
}

type PredictionType = 'more-zero' | 'more-one' | 'equal';

export function WaveInterference({
  onChallengeComplete,
  showChallenge = false,
  moduleId = 'superposition'
}: WaveInterferenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [waveParams, setWaveParams] = useState<WaveParams>({
    amplitude1: 0.5,
    amplitude2: 0.5,
    phase1: 0,
    phase2: 0
  });

  const [prediction, setPrediction] = useState<PredictionType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { addXP, completeInteraction } = useLearningStore();

  // Calculate combined wave amplitude at a point
  const calculateWaveAmplitude = (x: number, params: WaveParams): number => {
    const wave1 = params.amplitude1 * Math.sin(x + params.phase1);
    const wave2 = params.amplitude2 * Math.sin(x + params.phase2);
    return wave1 + wave2;
  };

  // Calculate probability from wave amplitude
  const calculateProbability = (params: WaveParams): { prob0: number; prob1: number } => {
    // Sample the combined wave at a representative point
    const amplitude = calculateWaveAmplitude(Math.PI / 2, params);

    // Probability is proportional to amplitude squared
    // Normalize to [0, 1] range
    const maxAmplitude = params.amplitude1 + params.amplitude2;
    const minAmplitude = -(params.amplitude1 + params.amplitude2);

    // Map amplitude to probability
    // Positive amplitude -> more likely |1⟩
    // Negative amplitude -> more likely |0⟩
    const normalized = (amplitude - minAmplitude) / (maxAmplitude - minAmplitude);

    return {
      prob0: 1 - normalized,
      prob1: normalized
    };
  };

  // Draw waves on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#0d0812'; // Void 950
      ctx.fillRect(0, 0, width, height);

      const centerY = height / 2;
      const scale = height / 4;
      const points = 200;

      // Draw center line
      ctx.strokeStyle = '#2d1b2e'; // Void 800
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw wave 1 (blue to cyan)
      ctx.strokeStyle = '#22d3ee'; // Quantum 400
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const waveX = (i / points) * Math.PI * 4;
        const y = centerY - waveParams.amplitude1 * Math.sin(waveX + waveParams.phase1) * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw wave 2 (red/magenta)
      ctx.strokeStyle = '#e879f9'; // Synapse 400
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const waveX = (i / points) * Math.PI * 4;
        const y = centerY - waveParams.amplitude2 * Math.sin(waveX + waveParams.phase2) * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw combined wave (white/energy)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const waveX = (i / points) * Math.PI * 4;
        const combined = calculateWaveAmplitude(waveX, waveParams);
        const y = centerY - combined * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw legend
      ctx.font = '14px "Press Start 2P"';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('Wave 1', 10, 20);
      ctx.fillStyle = '#e879f9';
      ctx.fillText('Wave 2', 10, 40);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Combined', 10, 60);
    };

    draw();
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [waveParams]);

  // Handle prediction submission
  const handlePredictionSubmit = () => {
    if (!prediction) return;

    const { prob0, prob1 } = calculateProbability(waveParams);
    const diff = Math.abs(prob1 - prob0);
    const threshold = 0.15; // 15% difference to be considered "more"

    let correctPrediction: PredictionType;
    if (diff < threshold) {
      correctPrediction = 'equal';
    } else if (prob1 > prob0) {
      correctPrediction = 'more-one';
    } else {
      correctPrediction = 'more-zero';
    }

    const correct = prediction === correctPrediction;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      addXP(40, 'wave-interference-prediction');
      completeInteraction(moduleId, 'wave-interference-prediction');
      onChallengeComplete?.(true);
    } else {
      onChallengeComplete?.(false);
    }
  };

  // Reset prediction
  const handleReset = () => {
    setPrediction(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const { prob0, prob1 } = calculateProbability(waveParams);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <h3 className="text-lg font-display text-slate-300 mb-4 tracking-wider">Wave Interference</h3>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full border-2 border-void-700 bg-void-950"
        />

        {/* Wave Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wave 1 Controls */}
          <div className="space-y-4 p-4 border border-quantum-500/30 bg-void-950/50">
            <h4 className="font-display text-xs text-quantum-400 uppercase tracking-widest">Wave 1 (Cyan)</h4>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Amplitude: {waveParams.amplitude1.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={waveParams.amplitude1}
                onChange={(e) =>
                  setWaveParams({ ...waveParams, amplitude1: parseFloat(e.target.value) })
                }
                className="w-full accent-quantum-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Phase: {(waveParams.phase1 / Math.PI).toFixed(2)}π
              </label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={waveParams.phase1}
                onChange={(e) =>
                  setWaveParams({ ...waveParams, phase1: parseFloat(e.target.value) })
                }
                className="w-full accent-quantum-400"
              />
            </div>
          </div>

          {/* Wave 2 Controls */}
          <div className="space-y-4 p-4 border border-synapse-400/30 bg-void-950/50">
            <h4 className="font-display text-xs text-synapse-400 uppercase tracking-widest">Wave 2 (Magenta)</h4>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Amplitude: {waveParams.amplitude2.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={waveParams.amplitude2}
                onChange={(e) =>
                  setWaveParams({ ...waveParams, amplitude2: parseFloat(e.target.value) })
                }
                className="w-full accent-synapse-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Phase: {(waveParams.phase2 / Math.PI).toFixed(2)}π
              </label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={waveParams.phase2}
                onChange={(e) =>
                  setWaveParams({ ...waveParams, phase2: parseFloat(e.target.value) })
                }
                className="w-full accent-synapse-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Probability Display */}
      <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <h3 className="text-lg font-display text-slate-300 mb-4 tracking-wider">Qubit Probability</h3>
        <p className="text-xs font-mono text-slate-500 mb-4">
          &gt;&gt; PROBABILITY_DISTRIBUTION_ANALYSIS
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-xs font-mono text-slate-300">
              <span>|0⟩ STATE</span>
              <span>{(prob0 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-void-950 border border-void-700 h-4">
              <motion.div
                className="bg-cyan-600 h-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${prob0 * 100}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-30 bg-repeat-y bg-[length:100%_2px]"></div>
              </motion.div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-xs font-mono text-slate-300">
              <span>|1⟩ STATE</span>
              <span>{(prob1 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-void-950 border border-void-700 h-4">
              <motion.div
                className="bg-purple-600 h-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${prob1 * 100}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-30 bg-repeat-y bg-[length:100%_2px]"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Challenge */}
      {showChallenge && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-xl font-semibold mb-2 text-purple-900">Prediction Challenge</h3>
          <p className="text-sm text-gray-700 mb-4">
            Adjust the wave parameters, then predict: Will the qubit be more likely to measure |0⟩, |1⟩, or equal probability?
          </p>

          {!showResult ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => setPrediction('more-zero')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${prediction === 'more-zero'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                >
                  More |0⟩
                </button>
                <button
                  onClick={() => setPrediction('equal')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${prediction === 'equal'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
                    }`}
                >
                  Equal
                </button>
                <button
                  onClick={() => setPrediction('more-one')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${prediction === 'more-one'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border-2 border-red-300 text-red-700 hover:bg-red-50'
                    }`}
                >
                  More |1⟩
                </button>
              </div>

              <button
                onClick={handlePredictionSubmit}
                disabled={!prediction}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Prediction
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-orange-100 border-2 border-orange-400'
                }`}
            >
              <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
                {isCorrect ? '🎉 Correct!' : 'Not quite!'}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                {isCorrect
                  ? 'Great job! You correctly predicted the probability distribution. When waves interfere constructively, they amplify each other. When they interfere destructively, they cancel out.'
                  : `The actual result is: ${Math.abs(prob1 - prob0) < 0.15
                    ? 'Equal probability'
                    : prob1 > prob0
                      ? 'More likely |1⟩'
                      : 'More likely |0⟩'
                  }. Try adjusting the phases to see how constructive and destructive interference work!`}
              </p>
              {isCorrect && (
                <p className="text-sm font-semibold text-green-700">+40 XP earned!</p>
              )}
              <button
                onClick={handleReset}
                className="mt-3 w-full bg-white px-4 py-2 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
