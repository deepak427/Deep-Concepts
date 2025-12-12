import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Sparkles, MessageCircle } from 'lucide-react';
import { EntanglementDemo } from '../interactives/EntanglementDemo';
import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { QuestTracker } from '../game/QuestTracker';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { cn } from '@/lib/utils';

interface EntanglementValleyProps {
  onComplete?: () => void;
}

export function EntanglementValley({ onComplete }: EntanglementValleyProps) {
  const reducedMotion = useReducedMotion();
  const particles = useParticles();
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [showNPC, setShowNPC] = useState(false);

  const gameState = useLearningStore();
  const islandProgress = gameState.modules['entanglement'];
  const entangla = NPCS['entangla'];

  const handleChallengeComplete = (challengeId: string, success: boolean) => {
    if (success) {
      gameState.completeInteraction('entanglement', challengeId);

      // Award XP based on challenge
      const xpRewards: Record<string, number> = {
        'bell-state-creation': 30,
        'myth-reality-cards': 50
      };
      const xp = xpRewards[challengeId] || 30;
      gameState.addXP(xp, `entanglement-${challengeId}`);

      // Spawn entanglement beam effect at screen center
      particles.xpGainAtCenter(xp);
    }
  };

  return (
    <div className="min-h-screen bg-void-950 relative overflow-x-hidden font-mono text-slate-200">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(236, 72, 153, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.2) 1px, transparent 1px)',
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
          <div className="inline-flex items-center justify-center gap-4 mb-4 bg-void-900 p-4 border-4 border-double border-pink-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <Link2 className="w-10 h-10 text-pink-500" />
            <h1 className="text-3xl md:text-4xl font-display text-pink-500 uppercase tracking-widest text-shadow-sm">
              Entanglement Valley
            </h1>
            <Sparkles className="w-10 h-10 text-pink-500" />
          </div>
          <div className="bg-void-900/80 border border-void-700 max-w-3xl mx-auto p-4 backdrop-blur-sm">
            <p className="text-lg text-slate-300 font-display uppercase tracking-wider leading-relaxed">
              &gt; Where quantum particles share a mysterious connection across space and time.
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
            <PixelCard variant="interactive" className="bg-void-900 border-pink-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-void-950 border-2 border-pink-500 flex items-center justify-center text-4xl shadow-pixel">
                  {entangla?.avatar || '🔗'}
                </div>
                <div>
                  <h3 className="font-display text-pink-400 text-lg mb-1">{entangla?.name || 'Entangla'}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider px-2 py-1 bg-void-950 border border-void-800 inline-block">
                    {entangla?.title || 'Weaver of Connections'}
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
            {showNPC && entangla && (
              <NPCDialogue
                npc={entangla}
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
                  <span className="text-slate-400 font-mono">Entanglement_Demo</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('entanglement-demo')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('entanglement-demo') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Bell_State</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('bell-state-creation')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('bell-state-creation') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Myth_Checker</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('myth-reality-cards')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('myth-reality-cards') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Spooky Quote */}
            <div className="mt-6 bg-void-950 border border-pink-500/30 p-4 relative">
              <div className="absolute -top-3 left-4 bg-void-950 px-2 text-pink-500 text-xl">❝</div>
              <p className="text-xs font-mono text-slate-400 italic pt-2">
                "Spooky action at a distance"
              </p>
              <p className="text-[10px] text-pink-500 font-display mt-2 uppercase tracking-wider text-right">— Albert Einstein</p>
            </div>
          </motion.div>

          {/* Interactive Challenge Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'linear' }}
            className="lg:col-span-2"
          >
            <PixelCard className="h-full bg-void-900 border-pink-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-2 border-void-800 pb-4">
                <h2 className="text-xl font-display text-pink-400 uppercase tracking-widest text-shadow">
                  Entanglement Laboratory
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveChallenge('entanglement-demo')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeChallenge === 'entanglement-demo'
                        ? "bg-pink-500 text-void-950 border-pink-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-pink-500 hover:text-pink-500"
                    )}
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => setActiveChallenge('bell-state-creation')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeChallenge === 'bell-state-creation'
                        ? "bg-energy-500 text-void-950 border-energy-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-energy-500 hover:text-energy-500"
                    )}
                  >
                    Bell_State
                  </button>
                  <button
                    onClick={() => setActiveChallenge('myth-reality-cards')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeChallenge === 'myth-reality-cards'
                        ? "bg-quantum-500 text-void-950 border-quantum-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-quantum-500 hover:text-quantum-500"
                    )}
                  >
                    Myths
                  </button>
                </div>
              </div>

              {/* Entanglement Component */}
              <div className="bg-void-950 border-2 border-void-800 p-2 min-h-[400px] relative">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-pink-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-pink-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-pink-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-pink-500"></div>

                <EntanglementDemo
                  onChallengeComplete={(success) =>
                    handleChallengeComplete(activeChallenge || 'entanglement-demo', success)
                  }
                  showChallenge={activeChallenge === 'myth-reality-cards'}
                />
              </div>

              {/* Learning Objectives */}
              <div className="mt-6 p-4 bg-void-950 border border-pink-500/30">
                <h3 className="font-display text-xs text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500"></span>
                  Module_Objectives
                </h3>
                <ul className="space-y-2 text-sm text-slate-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">&gt;&gt;</span>
                    How entangled particles share quantum correlations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">&gt;&gt;</span>
                    Creating Bell states and measuring correlations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">&gt;&gt;</span>
                    Distinguishing quantum entanglement from classical correlation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">&gt;&gt;</span>
                    Why entanglement doesn't allow faster-than-light communication
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

