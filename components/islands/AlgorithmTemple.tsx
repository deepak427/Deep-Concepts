import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, MessageCircle } from 'lucide-react';

import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { QuantumSearch } from '../quantum/QuantumSearch';
import { QuestTracker } from '../game/QuestTracker';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { cn } from '@/lib/utils';

interface AlgorithmTempleProps {
  onComplete?: () => void;
}

export function AlgorithmTemple({ onComplete }: AlgorithmTempleProps) {
  const reducedMotion = useReducedMotion();
  const particles = useParticles();
  const [activeMode, setActiveMode] = useState<'classical' | 'quantum'>('classical');
  const [showNPC, setShowNPC] = useState(false);
  const oracle = NPCS['oracle'];

  const gameState = useLearningStore();
  const islandProgress = gameState.modules['algorithm'];

  const handleChallengeComplete = (challengeId: string, success: boolean) => {
    if (success) {
      gameState.completeInteraction('algorithm', challengeId);

      // Award XP based on challenge
      const xpRewards: Record<string, number> = {
        'classical-vs-quantum': 30,
        'beat-classical': 50
      };
      const xp = xpRewards[challengeId] || 30;
      gameState.addXP(xp, `algorithm-${challengeId}`);

      // Spawn quantum search effect at screen center
      particles.xpGainAtCenter(xp);
    }
  };

  return (
    <div className="min-h-screen bg-void-950 relative overflow-x-hidden font-mono text-slate-200">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)',
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
          <div className="inline-flex items-center justify-center gap-4 mb-4 bg-void-900 p-4 border-4 border-double border-violet-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <Search className="w-10 h-10 text-violet-500" />
            <h1 className="text-3xl md:text-4xl font-display text-violet-500 uppercase tracking-widest text-shadow-sm">
              Algorithm Temple
            </h1>
            <Sparkles className="w-10 h-10 text-violet-500" />
          </div>
          <div className="bg-void-900/80 border border-void-700 max-w-3xl mx-auto p-4 backdrop-blur-sm">
            <p className="text-lg text-slate-300 font-display uppercase tracking-wider leading-relaxed">
              &gt; Discover the power of quantum algorithms and amplitude amplification.
            </p>
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
          {/* NPC Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'linear' }}
            className="lg:col-span-1 space-y-6"
          >
            {/* NPC Interaction Card */}
            <PixelCard variant="interactive" className="bg-void-900 border-violet-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-void-950 border-2 border-violet-500 flex items-center justify-center text-4xl shadow-pixel">
                  {oracle?.avatar || '🔮'}
                </div>
                <div>
                  <h3 className="font-display text-violet-400 text-lg mb-1">{oracle?.name || 'Oracle Ada'}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider px-2 py-1 bg-void-950 border border-void-800 inline-block">
                    {oracle?.title || 'Algorithm Keeper'}
                  </p>
                </div>
              </div>

              <PixelButton
                onClick={() => setShowNPC(true)}
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                CONSULT_ORACLE
              </PixelButton>
            </PixelCard>

            {/* NPC Section Overlay */}
            {showNPC && (
              <NPCDialogue
                npc={oracle}
                onClose={() => setShowNPC(false)}
              />
            )}

            {/* Island Info Card */}
            <PixelCard className="bg-void-900">
              <h3 className="text-sm font-display text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-void-800 pb-2">
                Mission_Log
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Search_Demo</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('quantum-search-demo')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('quantum-search-demo') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Vs_Classical</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('classical-vs-quantum')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('classical-vs-quantum') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Beat_Average</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('beat-classical')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('beat-classical') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Algorithm Info Card */}
            <div className="mt-6 bg-void-950 border border-violet-500/30 p-4 font-mono text-xs text-slate-400">
              <h3 className="font-display text-violet-400 uppercase tracking-widest mb-3 border-b border-violet-500/30 pb-2">Grover's_Algorithm</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-void-800 pb-1">
                  <span className="text-slate-500">Classical:</span>
                  <span className="text-energy-400 font-bold">O(N) steps</span>
                </div>
                <div className="flex justify-between items-center border-b border-void-800 pb-1">
                  <span className="text-slate-500">Quantum:</span>
                  <span className="text-energy-400 font-bold">O(√N) steps</span>
                </div>
                <div className="mt-2 text-[10px] text-violet-300 bg-violet-900/20 p-2 border border-violet-500/20">
                  &gt; For 100 items: Classical needs ~50 steps, Quantum needs ~10 steps!
                </div>
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
            <PixelCard className="h-full bg-void-900 border-violet-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-2 border-void-800 pb-4">
                <h2 className="text-xl font-display text-violet-400 uppercase tracking-widest text-shadow">
                  Search Laboratory
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveMode('classical')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeMode === 'classical'
                        ? "bg-violet-500 text-void-950 border-violet-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-violet-500 hover:text-violet-500"
                    )}
                  >
                    Classical
                  </button>
                  <button
                    onClick={() => setActiveMode('quantum')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeMode === 'quantum'
                        ? "bg-quantum-500 text-void-950 border-quantum-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-quantum-500 hover:text-quantum-500"
                    )}
                  >
                    Quantum
                  </button>
                </div>
              </div>

              {/* Quantum Search Component */}
              <div className="bg-void-950 border-2 border-void-800 p-2 min-h-[400px] relative">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-violet-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-violet-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-violet-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-violet-500"></div>

                <QuantumSearch />
              </div>

              {/* Learning Objectives */}
              <div className="mt-6 p-4 bg-void-950 border border-violet-500/30">
                <h3 className="font-display text-xs text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-500"></span>
                  Module_Objectives
                </h3>
                <ul className="space-y-2 text-sm text-slate-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-1">&gt;&gt;</span>
                    How Grover's algorithm searches unsorted databases
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-1">&gt;&gt;</span>
                    Amplitude amplification and quantum speedup
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-1">&gt;&gt;</span>
                    Comparing classical and quantum search performance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-1">&gt;&gt;</span>
                    Why quantum algorithms excel at specific problems
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

