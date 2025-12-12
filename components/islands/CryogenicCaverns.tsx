import { useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Thermometer, MessageCircle } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { DecoherenceLab } from '../quantum/DecoherenceLab';
import { DilutionFridge } from '../quantum/DilutionFridge';
import { QuestTracker } from '../game/QuestTracker';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { cn } from '@/lib/utils';

interface CryogenicCavernsProps {
  onComplete?: () => void;
}

export function CryogenicCaverns({}: CryogenicCavernsProps) {
  const reducedMotion = useReducedMotion();
  const particles = useParticles();
  const [activeView, setActiveView] = useState<'fridge' | 'decoherence'>('fridge');
  const [showNPC, setShowNPC] = useState(false);
  const hardwareHarry = NPCS['hardware-harry'];

  const gameState = useLearningStore();
  const islandProgress = gameState.modules['hardware'];

  const handleChallengeComplete = (challengeId: string, success: boolean) => {
    if (success) {
      gameState.completeInteraction('hardware', challengeId);

      // Award XP based on challenge
      const xpRewards: Record<string, number> = {
        'decoherence-lab': 30,
        'hardware-scenarios': 40
      };
      const xp = xpRewards[challengeId] || 30;
      gameState.addXP(xp, `hardware-${challengeId}`);

      // Spawn ice crystal effect at screen center
      particles.probabilityCloud(null);
    }
  };

  return (
    <div className="min-h-screen bg-void-950 relative overflow-x-hidden font-mono text-slate-200">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
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
          <div className="inline-flex items-center justify-center gap-4 mb-4 bg-void-900 p-4 border-4 border-double border-cyan-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <Snowflake className="w-10 h-10 text-cyan-500" />
            <h1 className="text-3xl md:text-4xl font-display text-cyan-500 uppercase tracking-widest text-shadow-sm">
              Cryogenic Caverns
            </h1>
            <Thermometer className="w-10 h-10 text-cyan-500" />
          </div>
          <div className="bg-void-900/80 border border-void-700 max-w-3xl mx-auto p-4 backdrop-blur-sm">
            <p className="text-lg text-slate-300 font-display uppercase tracking-wider leading-relaxed mb-3">
              &gt; Explore the frigid depths where quantum computers operate at near absolute zero.
            </p>
            <div className="text-sm text-slate-400 font-mono leading-relaxed border-t border-void-700 pt-3">
              <p className="mb-2">🧊 <strong className="text-cyan-400">Why So Cold?</strong></p>
              <p className="mb-2">Quantum states are incredibly fragile. Heat causes vibrations that destroy quantum information (decoherence). We need temperatures 100x colder than space!</p>
              <p>⚡ <strong className="text-cyan-400">The Challenge:</strong> Keep qubits isolated from any disturbance while still being able to control and read them.</p>
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
          {/* NPC Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'linear' }}
            className="lg:col-span-1 space-y-6"
          >
            {/* NPC Interaction Card */}
            <PixelCard variant="interactive" className="bg-void-900 border-cyan-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-void-950 border-2 border-cyan-500 flex items-center justify-center text-4xl shadow-pixel">
                  {hardwareHarry?.avatar || '🥶'}
                </div>
                <div>
                  <h3 className="font-display text-cyan-400 text-lg mb-1">{hardwareHarry?.name || 'Hardware Harry'}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider px-2 py-1 bg-void-950 border border-void-800 inline-block">
                    {hardwareHarry?.title || 'Cryogenic Engineer'}
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

            {/* NPC Interaction Overlay */}
            {showNPC && (
              <NPCDialogue
                npc={hardwareHarry}
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
                  <span className="text-slate-400 font-mono">Fridge_Tour</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('dilution-fridge')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('dilution-fridge') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Decoherence</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('decoherence-lab')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('decoherence-lab') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm bg-void-950 p-2 border border-void-800">
                  <span className="text-slate-400 font-mono">Hardware_Ops</span>
                  <span className={`font-display text-xs ${islandProgress?.interactionsCompleted.includes('hardware-scenarios')
                    ? 'text-green-500'
                    : 'text-void-600'
                    }`}>
                    {islandProgress?.interactionsCompleted.includes('hardware-scenarios') ? '[COMPLETE]' : '[PENDING]'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Temperature Info Card */}
            <div className="mt-6 bg-void-950 border border-cyan-500/30 p-4 font-mono text-xs text-slate-400">
              <h3 className="font-display text-cyan-400 uppercase tracking-widest mb-3 border-b border-cyan-500/30 pb-2">Temperature_Scale</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-void-900/50 p-1">
                  <span>Room Temp</span>
                  <span className="font-bold text-energy-400">~300 K</span>
                </div>
                <div className="flex justify-between items-center bg-void-900/50 p-1">
                  <span>Liquid Nitrogen</span>
                  <span className="font-bold text-energy-400">77 K</span>
                </div>
                <div className="flex justify-between items-center bg-void-900/50 p-1">
                  <span>Liquid Helium</span>
                  <span className="font-bold text-energy-400">4 K</span>
                </div>
                <div className="flex justify-between items-center bg-cyan-950/30 p-1 border border-cyan-500/30">
                  <span className="text-cyan-400">Quantum Chip</span>
                  <span className="font-bold text-cyan-400">~0.015 K</span>
                </div>
                <div className="mt-2 text-[10px] text-cyan-300 text-center italic">
                  &gt; That's colder than outer space!
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
            <PixelCard className="h-full bg-void-900 border-cyan-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-2 border-void-800 pb-4">
                <h2 className="text-xl font-display text-cyan-400 uppercase tracking-widest text-shadow">
                  Hardware Laboratory
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('fridge')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeView === 'fridge'
                        ? "bg-cyan-500 text-void-950 border-cyan-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-cyan-500 hover:text-cyan-500"
                    )}
                  >
                    Dilution_Fridge
                  </button>
                  <button
                    onClick={() => setActiveView('decoherence')}
                    className={cn(
                      "px-3 py-1 text-xs font-display uppercase tracking-wider transition-all border-2",
                      activeView === 'decoherence'
                        ? "bg-quantum-500 text-void-950 border-quantum-500"
                        : "bg-void-950 text-slate-500 border-void-700 hover:border-quantum-500 hover:text-quantum-500"
                    )}
                  >
                    Decoherence_Lab
                  </button>
                </div>
              </div>

              {/* Hardware Components */}
              <div className="bg-void-950 border-2 border-void-800 p-2 min-h-[400px] relative">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500"></div>

                {activeView === 'fridge' ? (
                  <DilutionFridge
                    onStageSelect={() => handleChallengeComplete('dilution-fridge', true)}
                  />
                ) : (
                  <DecoherenceLab
                    onScenarioComplete={(success: boolean) =>
                      handleChallengeComplete('hardware-scenarios', success)
                    }
                    moduleId="hardware"
                  />
                )}
              </div>

              {/* Learning Objectives */}
              <div className="mt-6 p-4 bg-void-950 border border-cyan-500/30">
                <h3 className="font-display text-xs text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500"></span>
                  Module_Objectives
                </h3>
                <ul className="space-y-2 text-sm text-slate-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Extreme Cooling:</strong> Understand why qubits need temperatures near absolute zero
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Decoherence:</strong> Learn how heat and vibrations destroy quantum states
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Hardware Reality:</strong> Explore the engineering challenges of quantum computers
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">&gt;&gt;</span>
                    <div>
                      <strong className="text-slate-300">Dilution Fridge:</strong> See how we achieve temperatures colder than space
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

