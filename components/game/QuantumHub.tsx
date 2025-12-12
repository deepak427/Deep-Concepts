import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useLearningStore } from '@/lib/learningState';
import { getModuleChallenges } from '@/constants/modules';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { PixelCard } from '../shared/PixelCard';
import { cn } from '@/lib/utils';

interface Island {
  id: string;
  name: string;
  npcId: string;
  color: string;
  glowColor: string;
  position: { x: number; y: number; z: number }; // Added z for depth
  requiredModuleId?: string; // The module that must be completed to unlock this one
}

const ISLANDS: Island[] = [
  {
    id: 'intro',
    name: 'Bits vs Qubits',
    npcId: 'dr-qubit',
    color: 'blue',
    glowColor: '#3b82f6',
    position: { x: 50, y: 20, z: 0 },
  },
  {
    id: 'superposition',
    name: 'Superposition Island',
    npcId: 'dr-qubit',
    color: 'cyan',
    glowColor: '#06b6d4',
    position: { x: 30, y: 35, z: -10 },
    requiredModuleId: 'intro'
  },
  {
    id: 'entanglement',
    name: 'Entanglement Valley',
    npcId: 'entangla',
    color: 'purple',
    glowColor: '#a855f7',
    position: { x: 70, y: 35, z: -10 },
    requiredModuleId: 'superposition'
  },
  {
    id: 'gates',
    name: 'Circuit City',
    npcId: 'circuit-master',
    color: 'yellow',
    glowColor: '#eab308',
    position: { x: 50, y: 50, z: -20 },
    requiredModuleId: 'entanglement'
  },
  {
    id: 'algorithm',
    name: 'Algorithm Temple',
    npcId: 'oracle',
    color: 'green',
    glowColor: '#22c55e',
    position: { x: 30, y: 65, z: -30 },
    requiredModuleId: 'gates'
  },
  {
    id: 'hardware',
    name: 'Cryogenic Caverns',
    npcId: 'hardware-harry',
    color: 'red',
    glowColor: '#ef4444',
    position: { x: 70, y: 65, z: -30 },
    requiredModuleId: 'algorithm'
  },
];

interface QuantumHubProps {
  onIslandClick: (islandId: string) => void;
}

export function QuantumHub({ onIslandClick }: QuantumHubProps) {
  const { modules, userProfile } = useLearningStore();
  const reducedMotion = useReducedMotion();

  const getMasteryStars = (masteryLevel: number) => Math.floor(masteryLevel / 20);

  const getChallengeCount = (islandId: string) => {
    const challenges = getModuleChallenges(islandId as any);
    return challenges.length;
  };

  const isIslandUnlocked = (island: Island) => {
    if (!island.requiredModuleId) return true;
    if (userProfile.type === 'developer') return true;
    return !!modules[island.requiredModuleId]?.completed;
  };

  const getCurrentObjective = () => {
    const nextIsland = ISLANDS.find(island => {
      const isUnlocked = isIslandUnlocked(island);
      const isCompleted = modules[island.id]?.completed;
      return isUnlocked && !isCompleted;
    });
    return nextIsland ? `Travel to ${nextIsland.name}` : "Explore Quantum Realm";
  };

  const backgroundParticles = useMemo(() => {
    const particleCount = reducedMotion ? 20 : 50;
    return [...Array(particleCount)].map((_, i) => ({
      id: `star-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }));
  }, [reducedMotion]);

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1b26_0%,_#050508_100%)] opacity-80" />

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/70"
            style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
            animate={reducedMotion ? {} : { opacity: [0, 0.8, 0] }}
            transition={reducedMotion ? {} : {
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white via-quantum-400 to-synapse-500 mb-4 uppercase tracking-tight">
            Quantum Realm
          </h1>
          <p className="text-slate-400 mb-6">
            Choose your learning path through quantum computing
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-void-900 border-2 border-quantum-500 text-quantum-300">
            <span className="w-2 h-2 bg-quantum-500 animate-pulse" />
            <span className="font-display text-xs tracking-widest">
              MISSION: {getCurrentObjective()}
            </span>
          </div>
        </motion.div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ISLANDS.map((island, index) => {
            const moduleData = modules[island.id];
            const masteryLevel = moduleData?.masteryLevel || 0;
            const masteryStars = getMasteryStars(masteryLevel);
            const challengeCount = getChallengeCount(island.id);
            const completedChallenges = moduleData?.interactionsCompleted?.length || 0;
            const unlocked = isIslandUnlocked(island);

            const islandEmojis: Record<string, string> = {
              'intro': '💾',
              'superposition': '🌊',
              'entanglement': '🔮',
              'gates': '⚡',
              'algorithm': '🔍',
              'hardware': '❄️',
            };

            return (
              <motion.div
                key={island.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => unlocked && onIslandClick(island.id)}
              >
                <PixelCard
                  variant={unlocked ? 'interactive' : 'default'}
                  padding="md"
                  className={cn(
                    "h-full transition-all duration-300",
                    !unlocked && "opacity-60",
                    unlocked && "hover:scale-105"
                  )}
                  style={{
                    borderColor: unlocked ? island.glowColor : undefined,
                    filter: unlocked ? 'none' : 'grayscale(100%)'
                  }}
                >
                  {/* Island Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 border-2 flex items-center justify-center text-2xl relative"
                      style={{ borderColor: island.glowColor }}
                    >
                      <span>{unlocked ? islandEmojis[island.id] : '🔒'}</span>
                      {unlocked && masteryStars > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-energy-500 border border-energy-400 flex items-center justify-center">
                          <span className="text-xs text-void-950">★</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-display text-sm tracking-wider uppercase" style={{ color: island.glowColor }}>
                        {island.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {unlocked ? `${completedChallenges}/${challengeCount}` : 'Locked'}
                        </span>
                        {unlocked && masteryLevel > 0 && (
                          <span className="text-xs text-energy-400">
                            {masteryLevel}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {unlocked && (
                    <div className="mb-4">
                      <div className="w-full h-2 bg-void-950 border border-void-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(completedChallenges / challengeCount) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full transition-colors"
                          style={{ backgroundColor: island.glowColor }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mastery Stars */}
                  {unlocked && (
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={cn(
                            "text-sm",
                            star <= masteryStars ? "text-energy-400" : "text-void-700"
                          )}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Lock Message */}
                  {!unlocked && island.requiredModuleId && (
                    <div className="text-center">
                      <p className="text-xs text-red-400 font-display">
                        Complete {ISLANDS.find(i => i.id === island.requiredModuleId)?.name} first
                      </p>
                    </div>
                  )}
                </PixelCard>
              </motion.div>
            );
          })}
        </div>

        {/* Learning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <PixelCard variant="glass" padding="lg">
            <div className="text-center">
              <h2 className="font-display text-quantum-400 text-lg mb-4 uppercase tracking-widest">
                Learning Path
              </h2>
              <p className="text-slate-400 mb-6">
                Progress through modules in order for the best learning experience. 
                Each module builds on concepts from previous ones.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-quantum-400">💡</span>
                  <span className="text-slate-400">Interactive visualizations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-energy-400">🎯</span>
                  <span className="text-slate-400">Hands-on challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-synapse-400">⭐</span>
                  <span className="text-slate-400">Mastery tracking</span>
                </div>
              </div>
            </div>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}
