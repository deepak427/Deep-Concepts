import { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, MessageCircle } from 'lucide-react';
import { BitsVsQubitsDemo } from '../interactives/BitsVsQubitsDemo';
import { useLearningStore } from '@/lib/learningState';
import { useParticles } from '@/lib/useParticles';
import { NPCDialogue } from '../game/NPCDialogue';
import { NPCS } from '@/constants/npcs';
import { PixelCard } from '../shared/PixelCard';
import { PixelButton } from '../shared/PixelButton';
import { InteractiveWrapper } from '../shared/InteractiveWrapper';

interface BitsVsQubitsIslandProps {
  onComplete?: () => void;
}

export function BitsVsQubitsIsland({ onComplete }: BitsVsQubitsIslandProps) {
  const [showNPC, setShowNPC] = useState(false);

  const { modules, completeInteraction, addXP } = useLearningStore();
  const particles = useParticles();
  const islandProgress = modules['bits-qubits'];
  const drQubit = NPCS['dr-qubit'];

  const handleChallengeComplete = (success: boolean) => {
    if (success) {
      completeInteraction('bits-qubits', 'comparison-complete');
      addXP(30, 'bits-qubits-understanding');
      particles.xpGainAtCenter(30);
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
          <div className="inline-flex items-center gap-4 mb-4 bg-void-900 p-4 border-4 border-blue-500">
            <Binary className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            <h1 className="text-2xl md:text-4xl font-display text-blue-500 uppercase tracking-widest">
              Bits vs Qubits
            </h1>
          </div>
          
          <p className="text-slate-300 mb-4">
            Discover the fundamental difference between classical and quantum information
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
                <div className="w-12 h-12 bg-void-950 border-2 border-blue-500 flex items-center justify-center text-2xl">
                  {drQubit?.avatar || '🧑‍🔬'}
                </div>
                <div>
                  <h3 className="font-display text-blue-300 text-sm">
                    {drQubit?.name || 'Dr. Qubit'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Information Theorist
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
                Learn More
              </PixelButton>
            </PixelCard>

            {/* Progress */}
            <PixelCard padding="md">
              <h3 className="font-display text-slate-400 text-xs uppercase mb-3">
                Understanding
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Classical Bits</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Quantum Qubits</span>
                  <span className={
                    islandProgress?.interactionsCompleted.includes('comparison-complete')
                      ? 'text-green-500'
                      : 'text-slate-600'
                  }>
                    {islandProgress?.interactionsCompleted.includes('comparison-complete') ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Superposition</span>
                  <span className={
                    islandProgress?.interactionsCompleted.includes('comparison-complete')
                      ? 'text-green-500'
                      : 'text-slate-600'
                  }>
                    {islandProgress?.interactionsCompleted.includes('comparison-complete') ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Key Concepts */}
            <PixelCard padding="md">
              <h3 className="font-display text-energy-400 text-xs uppercase mb-3">
                Key Concepts
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Classical bits: 0 or 1</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-synapse-500 mt-1">•</span>
                  <span>Qubits: |0⟩, |1⟩, or superposition</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-energy-500 mt-1">•</span>
                  <span>Measurement collapses superposition</span>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Interactive Section */}
          <div className="lg:col-span-3">
            <InteractiveWrapper
              title="Bits vs Qubits Comparison"
              description="Explore the fundamental differences between classical bits and quantum qubits"
              objectives={[
                'Understand classical bit behavior',
                'Experience quantum superposition',
                'See how measurement affects qubits'
              ]}
              fullscreenEnabled
            >
              <BitsVsQubitsDemo onChallengeComplete={handleChallengeComplete} />
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