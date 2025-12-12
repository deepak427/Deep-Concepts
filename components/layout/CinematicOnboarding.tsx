import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Atom, Cpu, Snowflake } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { BlochSphere } from '@/components/quantum/BlochSphere';
import type { UserProfile } from '@/types/learning';
import type { MeasurementResult } from '@/types/quantum';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface CinematicOnboardingProps {
  onComplete: () => void;
}

type OnboardingStep =
  | 'portal-discovery'
  | 'dr-qubit-intro'
  | 'tutorial-measurement'
  | 'tutorial-rotation'
  | 'island-selection'
  | 'teleporting';

interface IslandOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  bonus: {
    xp: number;
    item?: string;
  };
  profileType: UserProfile['type'];
}

const ISLAND_OPTIONS: IslandOption[] = [
  {
    id: 'superposition-island',
    name: 'Superposition Island',
    description: 'Master the art of quantum states and probability',
    icon: <Sparkles className="w-12 h-12" />,
    color: 'from-blue-400 to-purple-500',
    glowColor: 'shadow-blue-500/50',
    bonus: { xp: 50, item: 'probability-crystal' },
    profileType: 'student'
  },
  {
    id: 'circuit-city',
    name: 'Circuit City',
    description: 'Build quantum circuits and master gate operations',
    icon: <Cpu className="w-12 h-12" />,
    color: 'from-green-400 to-cyan-500',
    glowColor: 'shadow-green-500/50',
    bonus: { xp: 50, item: 'quantum-gate-kit' },
    profileType: 'developer'
  },
  {
    id: 'algorithm-temple',
    name: 'Algorithm Temple',
    description: 'Unlock the secrets of quantum algorithms',
    icon: <Zap className="w-12 h-12" />,
    color: 'from-yellow-400 to-orange-500',
    glowColor: 'shadow-yellow-500/50',
    bonus: { xp: 50, item: 'algorithm-scroll' },
    profileType: 'founder'
  },
  {
    id: 'cryogenic-caverns',
    name: 'Cryogenic Caverns',
    description: 'Explore the hardware that powers quantum computing',
    icon: <Snowflake className="w-12 h-12" />,
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'shadow-cyan-500/50',
    bonus: { xp: 50, item: 'cooling-crystal' },
    profileType: 'researcher'
  }
];

export function CinematicOnboarding({ onComplete }: CinematicOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('portal-discovery');
  const [selectedIsland, setSelectedIsland] = useState<IslandOption | null>(null);
  const [tutorialProgress, setTutorialProgress] = useState({
    measured: false,
    rotated: false
  });
  const [drQubitDialogue, setDrQubitDialogue] = useState(0);

  const completeOnboarding = useLearningStore(state => state.completeOnboarding);
  const addXP = useLearningStore(state => state.addXP);
  const addInventoryItem = useLearningStore(state => (state as any).addInventoryItem);
  const reducedMotion = useReducedMotion();

  const handleMeasurement = (result: MeasurementResult) => {
    if (!tutorialProgress.measured) {
      setTutorialProgress(prev => ({ ...prev, measured: true }));
    }
  };

  const handleIslandSelect = (island: IslandOption) => {
    setSelectedIsland(island);
  };

  const handleComplete = () => {
    if (!selectedIsland) return;

    // Complete onboarding with profile based on island choice
    const profile: UserProfile = {
      type: selectedIsland.profileType,
      onboardingCompleted: true,
      selfAssessmentScore: 5 // Default mid-range score
    };

    completeOnboarding(profile);

    // Award starting bonus
    addXP(selectedIsland.bonus.xp, 'onboarding-bonus');

    // Add inventory item if the function exists (game layer feature)
    if (selectedIsland.bonus.item && addInventoryItem) {
      addInventoryItem({
        id: selectedIsland.bonus.item,
        name: selectedIsland.bonus.item.split('-').map(w =>
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' '),
        description: `A special gift from Dr. Qubit to help you on your journey.`,
        type: 'tool',
        rarity: 'rare',
        icon: '✨',
        quantity: 1
      });
    }

    setStep('teleporting');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const advanceDrQubitDialogue = () => {
    if (drQubitDialogue < 2) {
      setDrQubitDialogue(prev => prev + 1);
    } else {
      setStep('tutorial-measurement');
    }
  };

  const advanceTutorial = () => {
    if (step === 'tutorial-measurement' && tutorialProgress.measured) {
      setStep('tutorial-rotation');
    } else if (step === 'tutorial-rotation') {
      setStep('island-selection');
    }
  };

  return (
    <div className="fixed inset-0 bg-void-950 overflow-hidden z-50">
      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!reducedMotion && Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-600 rounded-none"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, 0, Math.random() * 0.5 + 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Portal Discovery */}
        {step === 'portal-discovery' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center space-y-8 px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  delay: 0.5
                }}
                className="relative mx-auto w-64 h-64 border-4 border-void-800 bg-void-900 shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
              >
                {/* Pixel Portal effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 opacity-50"
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2, repeat: Infinity, ease: 'linear'
                  }}
                />
                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-20 bg-repeat-y" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Atom className="w-24 h-24 text-quantum-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h1 className="text-4xl font-display text-white mb-4 uppercase tracking-wide text-shadow-sm">
                  PORTAL_DETECTED
                </h1>
                <p className="text-xl font-mono text-slate-400 mb-8 border-t border-b border-void-800 py-2 inline-block">
                  &gt; GATEWAY_TO_QUANTUM_REALM_DETECTED
                </p>
                <br />
                <motion.button
                  onClick={() => setStep('dr-qubit-intro')}
                  className="px-8 py-4 bg-quantum-600 border-2 border-quantum-400 text-void-950 font-display uppercase tracking-wider text-sm shadow-[6px_6px_0_rgba(34,211,238,0.3)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_rgba(34,211,238,0.3)] active:translate-y-0 active:shadow-none transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ENTER_QUANTUM_REALM &gt;
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Dr. Qubit Introduction */}
        {step === 'dr-qubit-intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full p-4"
          >
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-center mb-8"
              >
                <div className="text-9xl mb-4 filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">🧑‍🔬</div>
                <h2 className="text-4xl font-display text-white mb-2 uppercase tracking-wide">Dr. Qubit</h2>
                <p className="text-quantum-400 font-mono text-lg">&lt; ROLE: QUANTUM_PHYSICIST_GUIDE &gt;</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-void-900 border-2 border-void-700 p-8 shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative"
              >
                <div className="absolute top-0 left-0 bg-quantum-500 text-void-950 text-xs px-2 py-1 font-mono uppercase font-bold">Message_Log</div>
                <AnimatePresence mode="wait">
                  {drQubitDialogue === 0 && (
                    <motion.p
                      key="dialogue-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xl font-mono text-slate-300 mb-6 leading-relaxed mt-4"
                    >
                      &gt; WELCOME_EXPLORER. I am Dr. Qubit.
                      <br /><br />
                      &gt; STATUS: REALITY_CHECK_FAILED. Particles here exist in multiple states.
                    </motion.p>
                  )}
                  {drQubitDialogue === 1 && (
                    <motion.p
                      key="dialogue-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xl font-mono text-slate-300 mb-6 leading-relaxed mt-4"
                    >
                      &gt; INSTRUCTION_MODE: HANDS_ON.
                      <br /><br />
                      &gt; OBJECTIVE: Visit islands, meet entities, resolve paradoxes.
                    </motion.p>
                  )}
                  {drQubitDialogue === 2 && (
                    <motion.p
                      key="dialogue-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xl font-mono text-slate-300 mb-6 leading-relaxed mt-4"
                    >
                      &gt; FUNDAMENTAL_UNIT: QUBIT.
                      <br /><br />
                      &gt; PROPERTIES: SUPERPOSITION (0 AND 1).
                      <br />
                      &gt; INITIATING_DEMO...
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={advanceDrQubitDialogue}
                  className="w-full px-6 py-3 bg-quantum-600 border-2 border-quantum-400 text-void-950 font-display uppercase tracking-wider text-sm shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(34,211,238,0.3)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {drQubitDialogue < 2 ? 'NEXT_MESSAGE >' : 'INITIATE_PROTOCOL'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Tutorial - Measurement */}
        {step === 'tutorial-measurement' && (
          <motion.div
            key="tutorial-measure"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full p-4"
          >
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-void-900 border-2 border-void-700 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                  <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-wide">
                    System: Bloch_Sphere_Viz
                  </h3>
                  <p className="text-sm font-mono text-slate-400 mb-4">
                    &gt; 3D_REPRESENTATION: Qubit State Vector.
                  </p>
                  <p className="text-sm font-mono text-slate-400 mb-4">
                    &gt; INSTRUCTION: Click [MEASURE] to collapse vector to |0&gt; or |1&gt;.
                  </p>
                  {tutorialProgress.measured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-900/20 border-2 border-emerald-500 p-4"
                    >
                      <p className="text-emerald-400 font-mono text-xs">
                        &gt; SUCCESS: QUANTUM_STATE_COLLAPSED.
                      </p>
                    </motion.div>
                  )}
                </div>

                {tutorialProgress.measured && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={advanceTutorial}
                    className="w-full px-6 py-4 bg-quantum-600 border-2 border-quantum-400 text-void-950 font-display uppercase tracking-wider text-lg shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    NEXT_MODULE: ROTATION
                  </motion.button>
                )}
              </div>

              <div className="bg-void-900 border-2 border-void-700 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                <BlochSphere
                  onMeasurement={handleMeasurement}
                  showChallenge={false}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Tutorial - Rotation */}
        {step === 'tutorial-rotation' && (
          <motion.div
            key="tutorial-rotate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full p-4"
          >
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-void-900 border-2 border-void-700 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                  <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-wide">
                    Control_Qubit_State
                  </h3>
                  <p className="text-sm font-mono text-slate-400 mb-4">
                    &gt; INTERACTION: Drag sphere to rotate vector.
                  </p>
                  <p className="text-sm font-mono text-slate-400 mb-4">
                    &gt; NOTE: Position maps to probability density.
                    <br />
                    &gt; STATUS: SUPERPOSITION_ACTIVE.
                  </p>
                  <div className="bg-blue-900/20 border-2 border-blue-500 p-4 mb-4">
                    <p className="text-blue-400 font-mono text-xs">
                      &gt; TIP: Align with axes for deterministic outcomes.
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={advanceTutorial}
                  className="w-full px-6 py-4 bg-quantum-600 border-2 border-quantum-400 text-void-950 font-display uppercase tracking-wider text-lg shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  START_EXPLORATION_PROTOCOL
                </motion.button>
              </div>

              <div className="bg-void-900 border-2 border-void-700 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                <BlochSphere
                  onMeasurement={handleMeasurement}
                  showChallenge={false}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Island Selection */}
        {step === 'island-selection' && (
          <motion.div
            key="islands"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-full p-4 py-12"
          >
            <div className="max-w-6xl w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-5xl font-display text-white mb-4 uppercase tracking-wide text-shadow-sm">
                  Select_Insertion_Point
                </h2>
                <p className="text-xl font-mono text-slate-400">
                  &gt; AVAILABLE_ZONES_DETECTED: 4
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {ISLAND_OPTIONS.map((island, index) => (
                  <motion.button
                    key={island.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleIslandSelect(island)}
                    className={`relative p-8 border-2 text-left transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)] ${selectedIsland?.id === island.id
                        ? `border-white bg-void-800 shadow-[6px_6px_0_rgba(255,255,255,0.2)]`
                        : 'border-void-700 bg-void-900 hover:border-quantum-500 hover:translate-y-[-2px]'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 border-2 ${selectedIsland?.id === island.id
                          ? 'bg-void-950 border-white text-white'
                          : 'bg-void-950 border-void-700 text-slate-500'
                        }`}>
                        {island.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-display text-white mb-2 uppercase tracking-wide">
                          {island.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-400">
                          {island.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-void-950 border border-void-800 p-3 mt-4">
                      <p className="text-[10px] font-mono text-slate-500 mb-1 uppercase">&gt; INITIAL_REWARDS:</p>
                      <p className="text-quantum-400 font-mono text-xs font-bold">
                        +{island.bonus.xp} XP {island.bonus.item && `+ [ITEM: ${island.bonus.item.split('-').map(w =>
                          w.charAt(0).toUpperCase() + w.slice(1)
                        ).join('_')}]`}
                      </p>
                    </div>

                    {selectedIsland?.id === island.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 border-2 border-green-300 flex items-center justify-center text-void-950 font-bold shadow-sm"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {selectedIsland && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleComplete}
                  className="w-full px-8 py-4 bg-quantum-600 border-2 border-quantum-400 text-void-950 font-display uppercase tracking-wider text-xl shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  INITIATE_TRANSPORT_TO_{selectedIsland.name.toUpperCase().replace(/ /g, '_')}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 6: Teleporting */}
        {step === 'teleporting' && (
          <motion.div
            key="teleport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 360, 720]
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut'
                }}
                className="text-9xl mb-8 filter drop-shadow-[4px_4px_0_rgba(34,211,238,0.5)]"
              >
                ✨
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-display text-white uppercase tracking-widest"
              >
                TRANSPORT_IN_PROGRESS...
              </motion.h2>
              <p className="mt-4 font-mono text-quantum-400">
                &gt; TARGET: {selectedIsland?.name.toUpperCase()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
