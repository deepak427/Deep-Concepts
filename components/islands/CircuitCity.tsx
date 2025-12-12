import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, MessageCircle } from 'lucide-react';
import { QuestTracker } from '../game/QuestTracker';
import { CircuitBuilder } from '../quantum/CircuitBuilder';
import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { cn } from '@/lib/utils';

interface CircuitCityProps {
  onComplete?: () => void;
}

export function CircuitCity({ onComplete }: CircuitCityProps) {
  const reducedMotion = useReducedMotion();
  const particles = useParticles();
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);
  const [showNPC, setShowNPC] = useState(false);

  const gameState = useLearningStore();
  const islandProgress = gameState.modules['gates'];
  const sparky = NPCS['circuit-master'];

  const handlePuzzleComplete = (puzzleId: string, success: boolean) => {
    if (success) {
      gameState.completeInteraction('gates', puzzleId);

      // Award XP based on puzzle difficulty
      const xpRewards: Record<string, number> = {
        'puzzle-1': 30,
        'puzzle-2': 50,
        'puzzle-3': 70
      };
      const xp = xpRewards[puzzleId] || 30;
      gameState.addXP(xp, `gates-${puzzleId}`);

      // Spawn circuit completion effect at screen center
      particles.xpGainAtCenter(xp);
    }
  };

  return (
    <div className="min-h-screen bg-void-950 relative overflow-x-hidden font-mono text-slate-200">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      {/* Animated Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5" />

      {/* Island Header */}
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'linear' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-4 mb-4 bg-void-900 p-4 border-4 border-double border-blue-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <Cpu className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-display text-blue-500 uppercase tracking-widest text-shadow-sm">
              Circuit City
            </h1>
            <Zap className="w-10 h-10 text-blue-500" />
          </div>
          <div className="bg-void-900/80 border border-void-700 max-w-3xl mx-auto p-4 backdrop-blur-sm">
            <p className="text-lg text-slate-300 font-display uppercase tracking-wider leading-relaxed mb-3">
              &gt; Master the art of quantum gates and build circuits that transform reality.
            </p>
            <div className="text-sm text-slate-400 font-mono leading-relaxed border-t border-void-700 pt-3">
              <p className="mb-2">🔧 <strong className="text-blue-400">What are Quantum Gates?</strong></p>
              <p className="mb-2">Think of gates as instructions that change qubit states. Like switches that can flip bits, rotate phases, or create entanglement between qubits.</p>
              <p>🔗 <strong className="text-blue-400">Circuit Building:</strong> Chain gates together to perform complex quantum operations - from simple bit flips to creating Bell states!</p>
            </div>
          </div>

          {/* Mastery Stars */}
          <div className="flex items-center justify-center gap-3 mt-6 bg-void-950 inline-block px-6 py-2 border-2 border-void-800">
            <span className="text-xs font-display text-slate-500 uppercase tracking-widest">Mastery_Level:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: star * 0.1, duration: 0.3, ease: 'linear' }}
                  className={`text-xl ${star <= (islandProgress?.masteryLevel || 0) / 20
                    ? 'text-energy-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]'
                    : 'text-void-800'
                    }`}
                >
                  ★
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quest Tracker */}
        <div className="mb-8">
          <QuestTracker />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'linear' }}
            className="lg:col-span-1 space-y-6"
          >
            {/* NPC Interaction Card */}
            <PixelCard variant="interactive" className="bg-void-900 border-blue-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-void-950 border-2 border-blue-500 flex items-center justify-center text-4xl shadow-pixel">
                  {sparky?.avatar || '⚡'}
                </div>
                <div>
                  <h3 className="font-display text-blue-400 text-lg mb-1">{sparky?.name || 'Sparky'}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider px-2 py-1 bg-void-950 border border-void-800 inline-block">
                    {sparky?.title || 'Circuit Master'}
                  </p>
                </div>
              </div>

              <PixelButton
                onClick={() => setShowNPC(true)}
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                INIT_DIALOGUE
              </PixelButton>
            </PixelCard>

            {/* Active NPC Dialogue Overlay */}
            {showNPC && sparky && (
              <NPCDialogue
                npc={sparky}
                onClose={() => setShowNPC(false)}
              />
            )}

            {/* Island Info Card */}
            <PixelCard className="bg-void-900">
              <h3 className="text-sm font-display text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-void-800 pb-2">
                Circuit_Puzzles
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Superposition</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('puzzle-1')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('puzzle-1') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Bell_State</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('puzzle-2')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('puzzle-2') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Advanced_3-Qubit</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('puzzle-3')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('puzzle-3') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Gate Reference Card */}
            <div className="mt-6 bg-void-950 border border-blue-500/30 p-4 font-mono text-xs text-slate-400">
              <h3 className="font-display text-blue-400 uppercase tracking-widest mb-3 border-b border-blue-500/30 pb-2">Gate_Reference</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-energy-400 font-bold">X</span> <span>Bit Flip (NOT)</span></div>
                <div className="flex justify-between"><span className="text-energy-400 font-bold">H</span> <span>Hadamard</span></div>
                <div className="flex justify-between"><span className="text-energy-400 font-bold">Z</span> <span>Phase Flip</span></div>
                <div className="flex justify-between"><span className="text-energy-400 font-bold">CNOT</span> <span>Controlled NOT</span></div>
                <div className="flex justify-between"><span className="text-energy-400 font-bold">S</span> <span>Phase (π/2)</span></div>
                <div className="flex justify-between"><span className="text-energy-400 font-bold">T</span> <span>T Gate (π/4)</span></div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Challenge Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'linear' }}
            className="lg:col-span-2"
          >
            <PixelCard className="h-full bg-void-900 border-blue-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-2 border-void-800 pb-4">
                <h2 className="text-xl font-display text-blue-400 uppercase tracking-widest text-shadow">
                  Circuit Builder
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActivePuzzle(null)}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activePuzzle === null
                        ? "bg-blue-500 text-void-950 border-blue-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-blue-500 hover:text-blue-500"
                    )}
                  >
                    Sandbox
                  </button>
                  <button
                    onClick={() => setActivePuzzle('puzzle-1')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activePuzzle === 'puzzle-1'
                        ? "bg-energy-500 text-void-950 border-energy-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-energy-500 hover:text-energy-500"
                    )}
                  >
                    Puzzle_1
                  </button>
                  <button
                    onClick={() => setActivePuzzle('puzzle-2')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activePuzzle === 'puzzle-2'
                        ? "bg-energy-500 text-void-950 border-energy-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-energy-500 hover:text-energy-500"
                    )}
                  >
                    Puzzle_2
                  </button>
                  <button
                    onClick={() => setActivePuzzle('puzzle-3')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activePuzzle === 'puzzle-3'
                        ? "bg-energy-500 text-void-950 border-energy-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-energy-500 hover:text-energy-500"
                    )}
                  >
                    Puzzle_3
                  </button>
                </div>
              </div>

              {/* Circuit Builder Component */}
              <div className="bg-void-950 border-2 border-void-800 p-2 min-h-[400px] relative">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500"></div>

                <CircuitBuilder
                  onPuzzleComplete={(success: boolean) =>
                    activePuzzle && handlePuzzleComplete(activePuzzle, success)
                  }
                />
              </div>

              {/* Learning Objectives */}
              <div className="mt-6 p-4 bg-void-950 border border-blue-500/30">
                <h3 className="font-display text-xs text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500"></span>
                  Module_Objectives
                </h3>
                <ul className="space-y-2 text-sm text-slate-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Gate Operations:</strong> Learn how X, H, Z, and CNOT gates transform qubit states
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Circuit Design:</strong> Chain gates together to create complex quantum operations
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Quantum States:</strong> Build superposition and entanglement using gate sequences
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Problem Solving:</strong> Complete puzzles by designing circuits to match target outputs
                    </div>
                  </li>
                </ul>
              </div>
            </PixelCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

