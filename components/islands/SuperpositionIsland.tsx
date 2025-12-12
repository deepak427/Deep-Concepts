import { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, MessageCircle } from 'lucide-react';
import { WaveInterference } from '../quantum/WaveInterference';
import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { InteractiveWrapper } from '../shared/InteractiveWrapper';

interface SuperpositionIslandProps {
  onComplete?: () => void;
}

export function SuperpositionIsland({ onComplete }: SuperpositionIslandProps) {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [showNPC, setShowNPC] = useState(false);

  const { modules, completeInteraction, addXP } = useLearningStore();
  const particles = useParticles();
  const islandProgress = modules['superposition'];
  const drQubit = NPCS['dr-qubit'];

  const handleChallengeComplete = (challengeId: string, success: boolean) => {
    if (success) {
      completeInteraction('superposition', challengeId);
      addXP(40, `superposition-${challengeId}`);
      particles.xpGainAtCenter(40);
    }
  };

  const masteryStars = Math.floor((islandProgress?.masteryLevel || 0) / 20);

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24">
      <div className="container space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 mb-4 bg-void-900 p-4 border-4 border-quantum-500">
            <Waves className="w-8 h-8 md:w-10 md:h-10 text-quantum-400" />
            <h1 className="text-2xl md:text-4xl font-display text-quantum-400 uppercase tracking-widest">
              Superposition
            </h1>
          </div>
          
          <p className="text-slate-300 mb-4">
            Where quantum waves dance between possibilities
          </p>

          {/* Mastery Display */}
          <div className="flex items-center justify-center gap-2 bg-void-950 px-4 py-2 border-2 border-void-800 inline-block">
            <span className="text-xs text-slate-500 uppercase">Mastery:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= masteryStars ? 'text-energy-400' : 'text-void-800'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* NPC Section */}
          <div className="lg:col-span-1 space-y-6">
            <PixelCard variant="interactive" padding="md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-void-950 border-2 border-quantum-500 flex items-center justify-center text-2xl">
                  {drQubit?.avatar || '🧑‍🔬'}
                </div>
                <div>
                  <h3 className="font-display text-quantum-300 text-sm">
                    {drQubit?.name || 'Dr. Qubit'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {drQubit?.title || 'Quantum Physicist'}
                  </p>
                </div>
              </div>

              <PixelButton
                onClick={() => setShowNPC(true)}
                variant="primary"
                size="sm"
                fullWidth
              >
                <MessageCircle className="w-4 h-4" />
                Talk
              </PixelButton>
            </PixelCard>

            {/* Progress */}
            <PixelCard padding="md">
              <h3 className="font-display text-slate-400 text-xs uppercase mb-3">
                Progress
              </h3>
              <div className="space-y-2">
                {['wave-interference', 'superposition-prediction'].map((task) => (
                  <div key={task} className="flex justify-between text-xs">
                    <span className="text-slate-400">{task.replace('-', ' ')}</span>
                    <span className={
                      islandProgress?.interactionsCompleted.includes(task)
                        ? 'text-green-500'
                        : 'text-slate-600'
                    }>
                      {islandProgress?.interactionsCompleted.includes(task) ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>

          {/* Interactive Section */}
          <div className="lg:col-span-3">
            <InteractiveWrapper
              title="Wave Interference Lab"
              description="Explore how quantum waves interfere to create superposition states"
              objectives={[
                'Understand wave interference patterns',
                'See how amplitudes determine probabilities',
                'Create constructive and destructive interference'
              ]}
              fullscreenEnabled
            >
              {/* Mode Selection */}
              <div className="flex gap-2 mb-4">
                <PixelButton
                  variant={activeChallenge === 'wave-interference' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveChallenge('wave-interference')}
                >
                  Explore
                </PixelButton>
                <PixelButton
                  variant={activeChallenge === 'superposition-prediction' ? 'energy' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveChallenge('superposition-prediction')}
                >
                  Challenge
                </PixelButton>
              </div>

              <WaveInterference
                onChallengeComplete={(success) =>
                  handleChallengeComplete(activeChallenge || 'wave-interference', success)
                }
                showChallenge={activeChallenge === 'superposition-prediction'}
              />
            </InteractiveWrapper>
          </div>
        </div>

        {/* NPC Dialogue */}
        {showNPC && drQubit && (
          <NPCDialogue
            npc={drQubit}
            onClose={() => setShowNPC(false)}
          />
        )}
      </div>
    </div>
  );
}

