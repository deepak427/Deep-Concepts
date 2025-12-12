// Quest Log component - displays active and completed quests

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, Circle, Target, Trophy } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { getQuestById, calculateQuestProgress } from '@/constants/quests';

interface QuestLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestLog({ isOpen, onClose }: QuestLogProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const {
    activeQuests,
    completedQuests,
    trackedQuestId,
    questObjectives,
    trackQuest,
    untrackQuest,
    isObjectiveCompleted
  } = useLearningStore();

  const activeQuestData = activeQuests.map(id => getQuestById(id)).filter(Boolean);
  const completedQuestData = completedQuests.map(id => getQuestById(id)).filter(Boolean);

  const handleTrackQuest = (questId: string) => {
    if (trackedQuestId === questId) {
      untrackQuest();
    } else {
      trackQuest(questId);
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'main': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'side': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'daily': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'hidden': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Quest Log Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-l border-blue-500/30 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Trophy className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Quest Log</h2>
                    <p className="text-sm text-gray-400">
                      {activeQuests.length} active • {completedQuests.length} completed
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close quest log"
                >
                  <X className="text-gray-400" size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'active'
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  Active ({activeQuests.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'completed'
                    ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  Completed ({completedQuests.length})
                </button>
              </div>
            </div>

            {/* Quest List */}
            <div className="overflow-y-auto h-[calc(100%-180px)] p-6 space-y-4">
              {activeTab === 'active' && (
                <>
                  {activeQuestData.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4">
                        <Trophy className="text-blue-400" size={48} />
                      </div>
                      <p className="text-gray-400 text-lg">No active quests</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Talk to NPCs on islands to start new quests!
                      </p>
                    </div>
                  ) : (
                    activeQuestData.map((quest) => {
                      if (!quest) return null;

                      const progress = calculateQuestProgress({
                        ...quest,
                        objectives: quest.objectives.map(obj => ({
                          ...obj,
                          completed: isObjectiveCompleted(quest.id, obj.id)
                        }))
                      });
                      const isTracked = trackedQuestId === quest.id;

                      return (
                        <motion.div
                          key={quest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-5 border transition-all ${isTracked
                            ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
                            : 'border-slate-700/50 hover:border-slate-600/50'
                            }`}
                        >
                          {/* Quest Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded border ${getQuestTypeColor(quest.type)}`}>
                                  {quest.type.toUpperCase()}
                                </span>
                                <div className="flex gap-0.5">
                                  {getDifficultyStars(quest.difficulty)}
                                </div>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">{quest.title}</h3>
                              <p className="text-sm text-gray-400 mb-2">{quest.description}</p>

                            </div>
                            <button
                              onClick={() => handleTrackQuest(quest.id)}
                              className={`p-2 rounded-lg transition-all ${isTracked
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                              aria-label={isTracked ? 'Untrack quest' : 'Track quest'}
                            >
                              <Target size={20} />
                            </button>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              />
                            </div>
                          </div>

                          {/* Objectives */}
                          <div className="space-y-2 mb-3">
                            {quest.objectives.map((objective) => {
                              const completed = isObjectiveCompleted(quest.id, objective.id);
                              return (
                                <div
                                  key={objective.id}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  {completed ? (
                                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                                  ) : (
                                    <Circle className="text-gray-600 flex-shrink-0 mt-0.5" size={16} />
                                  )}
                                  <span className={completed ? 'text-gray-500 line-through' : 'text-gray-300'}>
                                    {objective.description}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Rewards */}
                          <div className="pt-3 border-t border-slate-700/50">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-yellow-400">
                                <Star size={16} className="fill-yellow-400" />
                                <span className="font-medium">{quest.rewards.xp} XP</span>
                              </div>
                              {quest.rewards.items && quest.rewards.items.length > 0 && (
                                <div className="text-gray-400">
                                  +{quest.rewards.items.length} item{quest.rewards.items.length > 1 ? 's' : ''}
                                </div>
                              )}
                              {quest.rewards.achievementId && (
                                <div className="text-purple-400">
                                  <Trophy size={16} className="inline" /> Achievement
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </>
              )}

              {activeTab === 'completed' && (
                <>
                  {completedQuestData.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
                        <CheckCircle2 className="text-green-400" size={48} />
                      </div>
                      <p className="text-gray-400 text-lg">No completed quests yet</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Complete quests to see them here!
                      </p>
                    </div>
                  ) : (
                    completedQuestData.map((quest) => {
                      if (!quest) return null;

                      return (
                        <motion.div
                          key={quest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-green-900/20 to-slate-900/50 rounded-xl p-5 border border-green-500/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                              <CheckCircle2 className="text-green-400" size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded border ${getQuestTypeColor(quest.type)}`}>
                                  {quest.type.toUpperCase()}
                                </span>
                                <div className="flex gap-0.5">
                                  {getDifficultyStars(quest.difficulty)}
                                </div>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">{quest.title}</h3>
                              <p className="text-sm text-gray-400 mb-2">{quest.description}</p>

                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
