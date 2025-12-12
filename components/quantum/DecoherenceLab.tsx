import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Radio, Clock, AlertCircle } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';

interface DecoherenceParams {
  temperature: number; // in mK (millikelvin)
  noiseLevel: number; // 0-100
  time: number; // in microseconds
}

interface ScenarioQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const SCENARIO_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'temp-effect',
    question: 'What happens to qubit coherence when temperature increases?',
    options: [
      'Coherence improves',
      'Coherence degrades faster',
      'No effect on coherence',
      'Coherence becomes perfect'
    ],
    correctAnswer: 1,
    explanation: 'Higher temperatures introduce more thermal noise, causing qubits to lose their quantum state faster through decoherence.'
  },
  {
    id: 'noise-source',
    question: 'Which is NOT a major source of noise in quantum computers?',
    options: [
      'Electromagnetic interference',
      'Cosmic rays',
      'Thermal fluctuations',
      'Gravity waves'
    ],
    correctAnswer: 3,
    explanation: 'While electromagnetic interference, cosmic rays, and thermal fluctuations all affect qubits, gravity waves are too weak to cause significant decoherence.'
  },
  {
    id: 'coherence-time',
    question: 'Why do quantum computers need to complete calculations quickly?',
    options: [
      'To save electricity',
      'Before qubits decohere',
      'To prevent overheating',
      'For user convenience'
    ],
    correctAnswer: 1,
    explanation: 'Qubits maintain their quantum state for only a limited time (coherence time). Calculations must finish before decoherence destroys the quantum information.'
  },
  {
    id: 'isolation',
    question: 'Why are quantum chips placed in dilution refrigerators?',
    options: [
      'To make them run faster',
      'To reduce thermal noise and decoherence',
      'To save space',
      'To look impressive'
    ],
    correctAnswer: 1,
    explanation: 'Extreme cooling to ~10mK reduces thermal noise to near zero, minimizing decoherence and allowing qubits to maintain quantum states longer.'
  }
];

interface DecoherenceLabProps {
  onScenarioComplete?: (correct: boolean) => void;
  moduleId?: string;
}

export function DecoherenceLab({
  onScenarioComplete,
  moduleId = 'hardware'
}: DecoherenceLabProps) {
  const [params, setParams] = useState<DecoherenceParams>({
    temperature: 10, // 10 mK - ideal operating temperature
    noiseLevel: 5,
    time: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [fidelity, setFidelity] = useState(1.0);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);

  const { addXP, completeInteraction } = useLearningStore();

  // Calculate fidelity based on parameters
  const calculateFidelity = (p: DecoherenceParams): number => {
    // Fidelity decreases with temperature, noise, and time
    // Using exponential decay model: F(t) = exp(-t/T2)

    // T2 (coherence time) depends on temperature and noise
    const tempFactor = p.temperature / 10; // Normalized to ideal 10mK
    const noiseFactor = p.noiseLevel / 100;

    // Base coherence time in microseconds (at ideal conditions)
    const baseT2 = 100;

    // Effective T2 decreases with temperature and noise
    const effectiveT2 = baseT2 / (1 + tempFactor + noiseFactor);

    // Calculate fidelity using exponential decay
    const f = Math.exp(-p.time / effectiveT2);

    return Math.max(0, Math.min(1, f));
  };

  // Update fidelity when parameters change
  useEffect(() => {
    const newFidelity = calculateFidelity(params);
    setFidelity(newFidelity);
  }, [params]);

  // Animation loop when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setParams(prev => {
        const newTime = prev.time + 1;
        if (newTime >= 200) {
          setIsRunning(false);
          return prev;
        }
        return { ...prev, time: newTime };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setParams(prev => ({ ...prev, time: 0 }));
    setFidelity(1.0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const question = SCENARIO_QUESTIONS[currentQuestion];
    const correct = selectedAnswer === question.correctAnswer;

    setShowFeedback(true);
    setAnsweredCorrectly(prev => [...prev, correct]);

    if (correct) {
      addXP(25, 'decoherence-scenario');
      completeInteraction(moduleId, `decoherence-scenario-${question.id}`);
      onScenarioComplete?.(true);
    } else {
      onScenarioComplete?.(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < SCENARIO_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const question = SCENARIO_QUESTIONS[currentQuestion];
  const correctAnswersCount = answeredCorrectly.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Decoherence Simulator */}
      <div className="bg-void-900 rounded-none border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display text-quantum-400 tracking-wide uppercase">Decoherence Simulator</h3>
        </div>

        <p className="text-xs font-mono text-slate-400 mb-6 bg-void-950 p-2 border border-void-700">
          &gt; SYSTEM_INSTRUCTION: Adjust parameters to observe qubit state fidelity degradation.
        </p>

        {/* Qubit State Visualization */}
        <div className="bg-void-950 rounded-none p-8 mb-6 border-2 border-void-700 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px]" />
          <div className="flex flex-col items-center relative z-10">
            <h4 className="text-sm font-display text-slate-300 mb-6 uppercase tracking-widest">Qubit_State_Fidelity</h4>

            {/* Visual representation of qubit degradation */}
            <div className="relative w-48 h-48 mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1a1423"
                  strokeWidth="8"
                />

                {/* Fidelity circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#fidelityGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - fidelity)}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - fidelity)}` }}
                  transition={{ duration: 0.3 }}
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="fidelityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                {/* Center text */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-display font-bold"
                  fill={fidelity > 0.7 ? '#10b981' : fidelity > 0.4 ? '#f59e0b' : '#ef4444'}
                >
                  {(fidelity * 100).toFixed(0)}%
                </text>
              </svg>
            </div>

            {/* Qubit state arrow with degradation */}
            <div className="relative w-32 h-32">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  rotate: [0, 360 * (1 - fidelity)],
                  scale: fidelity
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-1 h-16 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-none shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                <div className="absolute top-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-purple-500" />
              </motion.div>

              {/* Noise visualization */}
              {fidelity < 0.9 && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-red-500 rounded-none"
                      style={{
                        left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                        top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                        opacity: 1 - fidelity
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            <p className={`text-xs font-mono mt-4 text-center px-4 py-1 border ${fidelity > 0.9 ? 'border-green-500 text-green-400 bg-green-500/10' :
              fidelity > 0.7 ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                fidelity > 0.4 ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                  'border-red-500 text-red-500 bg-red-500/10 animate-pulse'
              }`}>
              {fidelity > 0.9 && '>> STATUS: COHERENT'}
              {fidelity > 0.7 && fidelity <= 0.9 && '>> STATUS: MINOR_DECAY'}
              {fidelity > 0.4 && fidelity <= 0.7 && '>> STATUS: DEGRADING'}
              {fidelity <= 0.4 && '>> STATUS: CRITICAL_FAILURE'}
            </p>
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temperature Control */}
          <div className="space-y-3 bg-void-950 p-4 border border-void-700">
            <div className="flex items-center gap-2 mb-2 border-b border-void-800 pb-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <label className="block text-xs font-display uppercase text-slate-300">
                Temperature
              </label>
            </div>
            <div className="text-xl font-mono text-red-400 mb-2">{params.temperature} mK</div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={params.temperature}
              onChange={(e) => setParams({ ...params, temperature: parseFloat(e.target.value) })}
              disabled={isRunning}
              className="w-full h-2 bg-void-800 appearance-none cursor-pointer accent-red-500"
            />
            <p className="text-[10px] font-mono text-slate-500">
              TARGET: 10-20 mK
            </p>
          </div>

          {/* Noise Level Control */}
          <div className="space-y-3 bg-void-950 p-4 border border-void-700">
            <div className="flex items-center gap-2 mb-2 border-b border-void-800 pb-2">
              <Radio className="w-4 h-4 text-yellow-500" />
              <label className="block text-xs font-display uppercase text-slate-300">
                Noise Level
              </label>
            </div>
            <div className="text-xl font-mono text-yellow-400 mb-2">{params.noiseLevel}%</div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.noiseLevel}
              onChange={(e) => setParams({ ...params, noiseLevel: parseFloat(e.target.value) })}
              disabled={isRunning}
              className="w-full h-2 bg-void-800 appearance-none cursor-pointer accent-yellow-500"
            />
            <p className="text-[10px] font-mono text-slate-500">
              TARGET: MINIMAL
            </p>
          </div>

          {/* Time Display */}
          <div className="space-y-3 bg-void-950 p-4 border border-void-700">
            <div className="flex items-center gap-2 mb-2 border-b border-void-800 pb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <label className="block text-xs font-display uppercase text-slate-300">
                Time Elapsed
              </label>
            </div>
            <div className="text-xl font-mono text-blue-400 mb-2">{params.time} μs</div>
            <div className="w-full bg-void-800 h-2">
              <motion.div
                className="bg-blue-500 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${(params.time / 200) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              LIMIT: 200 μs
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={isRunning || params.time >= 200}
            className="flex-1 bg-green-900/50 text-green-400 px-6 py-3 border-2 border-green-500 font-display uppercase tracking-wider hover:bg-green-500 hover:text-void-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs shadow-[4px_4px_0_rgba(22,163,74,0.2)]"
          >
            Init_Sequence
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="flex-1 bg-orange-900/50 text-orange-400 px-6 py-3 border-2 border-orange-500 font-display uppercase tracking-wider hover:bg-orange-500 hover:text-void-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs shadow-[4px_4px_0_rgba(234,88,12,0.2)]"
          >
            Halt
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-void-800 text-slate-300 px-6 py-3 border-2 border-slate-500 font-display uppercase tracking-wider hover:bg-slate-500 hover:text-void-950 transition-colors text-xs shadow-[4px_4px_0_rgba(100,116,139,0.2)]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scenario Questions */}
      <div className="bg-void-900 rounded-none border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-void-800 pb-2">
          <h3 className="text-lg font-display text-quantum-400 uppercase tracking-wide">Analysis_Scenarios</h3>
          <div className="text-xs font-mono text-slate-500">
            [{correctAnswersCount}/{answeredCorrectly.length}] SOLVED
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
            <span>Progress: Question {currentQuestion + 1}/{SCENARIO_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-void-950 border border-void-700 h-2">
            <div
              className="bg-quantum-500 h-full transition-all"
              style={{ width: `${((currentQuestion + 1) / SCENARIO_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-void-950 p-6 border-2 border-void-700">
          <h4 className="font-display text-sm text-slate-200 mb-6 leading-relaxed">{question.question}</h4>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 border-2 transition-all font-mono text-xs ${selectedAnswer === index
                  ? showFeedback
                    ? index === question.correctAnswer
                      ? 'bg-green-900/30 border-green-500 text-green-400'
                      : 'bg-red-900/30 border-red-500 text-red-400'
                    : 'bg-quantum-900/30 border-quantum-500 text-quantum-400'
                  : showFeedback && index === question.correctAnswer
                    ? 'bg-green-900/20 border-green-500/50 text-green-500'
                    : 'bg-void-900 border-void-700 text-slate-400 hover:border-quantum-500 hover:text-quantum-400'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${selectedAnswer === index
                    ? showFeedback
                      ? index === question.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-quantum-500 bg-quantum-500'
                    : 'border-slate-600'
                    }`}>
                    {selectedAnswer === index && (
                      <div className="w-1 h-1 bg-void-950" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border-l-4 ${selectedAnswer === question.correctAnswer
                ? 'bg-green-900/20 border-l-green-500'
                : 'bg-orange-900/20 border-l-orange-500'
                }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${selectedAnswer === question.correctAnswer ? 'text-green-500' : 'text-orange-500'
                  }`} />
                <div>
                  <p className={`font-display text-sm mb-2 ${selectedAnswer === question.correctAnswer ? 'text-green-400' : 'text-orange-400'
                    }`}>
                    {selectedAnswer === question.correctAnswer ? '>> CORRECT_ANSWER' : '>> INSPECTION_FAILED'}
                  </p>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">{question.explanation}</p>
                  {selectedAnswer === question.correctAnswer && (
                    <p className="text-xs font-bold text-green-500 mt-2 font-mono">&gt;&gt; +25 XP_AWARDED</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 mt-6 border-t border-void-800 pt-6">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-quantum-600 text-void-950 px-6 py-3 font-display uppercase tracking-wider hover:bg-quantum-500 transition-colors disabled:bg-void-800 disabled:text-slate-600 disabled:cursor-not-allowed text-xs shadow-[4px_4px_0_rgba(34,211,238,0.3)]"
              >
                Submit_Data
              </button>
            ) : (
              <>
                {currentQuestion > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="flex-1 bg-void-800 text-slate-300 px-6 py-3 border-2 border-void-600 font-display uppercase tracking-wider hover:bg-void-700 transition-colors text-xs"
                  >
                    &lt; Previous
                  </button>
                )}
                {currentQuestion < SCENARIO_QUESTIONS.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 bg-quantum-600 text-void-950 px-6 py-3 font-display uppercase tracking-wider hover:bg-quantum-500 transition-colors text-xs shadow-[4px_4px_0_rgba(34,211,238,0.3)]"
                  >
                    Next_Entry &gt;
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {answeredCorrectly.length === SCENARIO_QUESTIONS.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-void-900 border-2 border-green-500 p-6 shadow-[4px_4px_0_rgba(34,197,94,0.3)]"
        >
          <h3 className="text-lg font-display text-green-400 mb-2 uppercase tracking-wide">
            Analysis_Complete
          </h3>
          <p className="text-slate-300 mb-2 font-mono text-sm">
            Result: {correctAnswersCount}/{SCENARIO_QUESTIONS.length} correct
          </p>
          <p className="text-xs text-slate-500 font-mono">
            {correctAnswersCount === SCENARIO_QUESTIONS.length
              ? '> RATING: OPTIMAL. DECOHERENCE MASTERY CONFIRMED.'
              : '> RATING: ACCEPTABLE. REVIEW RECOMMENDED.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
