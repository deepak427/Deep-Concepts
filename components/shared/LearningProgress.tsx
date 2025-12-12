import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Star } from 'lucide-react';
import { PixelCard } from './PixelCard';
import { cn } from '../../lib/utils';

interface LearningModule {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  masteryLevel: number;
  totalChallenges: number;
  completedChallenges: number;
  estimatedTime: string;
}

interface LearningProgressProps {
  modules: LearningModule[];
  currentModuleId?: string;
  onModuleClick: (moduleId: string) => void;
  className?: string;
}

export function LearningProgress({ 
  modules, 
  currentModuleId, 
  onModuleClick, 
  className 
}: LearningProgressProps) {
  
  const getMasteryStars = (masteryLevel: number): number => {
    if (masteryLevel < 20) return 0;
    if (masteryLevel < 40) return 1;
    if (masteryLevel < 60) return 2;
    if (masteryLevel < 80) return 3;
    if (masteryLevel < 95) return 4;
    return 5;
  };

  const getStatusColor = (module: LearningModule) => {
    if (!module.isUnlocked) return 'text-slate-600';
    if (module.isCompleted) return 'text-green-500';
    if (module.completedChallenges > 0) return 'text-quantum-400';
    return 'text-slate-400';
  };

  const getProgressColor = (module: LearningModule) => {
    if (!module.isUnlocked) return 'bg-slate-700';
    if (module.masteryLevel >= 80) return 'bg-green-500';
    if (module.masteryLevel >= 40) return 'bg-quantum-500';
    return 'bg-energy-500';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Overview */}
      <PixelCard variant="glow" padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-quantum-400 text-lg md:text-xl tracking-widest mb-2">
              LEARNING_PATH
            </h2>
            <p className="text-slate-400 text-sm">
              Master quantum computing through interactive modules
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-display text-green-500">
                {modules.filter(m => m.isCompleted).length}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-quantum-400">
                {modules.filter(m => m.isUnlocked && !m.isCompleted).length}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-slate-600">
                {modules.filter(m => !m.isUnlocked).length}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Locked
              </div>
            </div>
          </div>
        </div>
      </PixelCard>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => {
          const masteryStars = getMasteryStars(module.masteryLevel);
          const isActive = currentModuleId === module.id;
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PixelCard
                variant={isActive ? 'glow' : module.isUnlocked ? 'interactive' : 'default'}
                padding="md"
                className={cn(
                  "h-full transition-all duration-300",
                  !module.isUnlocked && "opacity-60 cursor-not-allowed",
                  isActive && "ring-2 ring-quantum-500"
                )}
                onClick={() => module.isUnlocked && onModuleClick(module.id)}
              >
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 border-2 flex items-center justify-center text-2xl",
                      module.isUnlocked ? "border-quantum-500 bg-quantum-500/10" : "border-slate-600 bg-slate-800"
                    )}>
                      {module.isUnlocked ? module.icon : '🔒'}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-display text-sm md:text-base tracking-wider",
                        getStatusColor(module)
                      )}>
                        {module.shortTitle}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        {module.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : module.isUnlocked ? (
                          <Circle className="w-4 h-4 text-quantum-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600" />
                        )}
                        <span className="text-xs text-slate-500">
                          {module.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={cn(
                    "px-2 py-1 text-xs font-display tracking-wider border",
                    module.isCompleted 
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : module.isUnlocked
                      ? "bg-quantum-500/20 border-quantum-500 text-quantum-400"
                      : "bg-slate-700/20 border-slate-600 text-slate-500"
                  )}>
                    {module.isCompleted ? 'DONE' : module.isUnlocked ? 'OPEN' : 'LOCKED'}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      Progress
                    </span>
                    <span className="text-xs font-display text-slate-400">
                      {module.completedChallenges}/{module.totalChallenges}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-void-950 border border-void-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(module.completedChallenges / module.totalChallenges) * 100}%` 
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={cn(
                        "h-full transition-colors",
                        getProgressColor(module)
                      )}
                    />
                  </div>
                </div>

                {/* Mastery Stars */}
                {module.isUnlocked && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">
                        Mastery
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= masteryStars 
                                ? "text-energy-400 fill-energy-400" 
                                : "text-slate-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-display text-slate-400">
                      {module.masteryLevel}%
                    </span>
                  </div>
                )}
              </PixelCard>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Tips */}
      <PixelCard variant="glass" padding="md" className="mt-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-quantum-500/20 border border-quantum-500 flex items-center justify-center flex-shrink-0">
            <span className="text-quantum-400 text-sm">💡</span>
          </div>
          <div>
            <h3 className="font-display text-quantum-400 text-sm tracking-wider mb-2">
              LEARNING_TIPS
            </h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Complete modules in order for the best learning experience</li>
              <li>• Aim for 80%+ mastery before moving to the next module</li>
              <li>• Use the interactive demos to visualize quantum concepts</li>
              <li>• Review previous modules if you're struggling with new concepts</li>
            </ul>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}