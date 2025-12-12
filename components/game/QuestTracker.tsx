// Quest tracker component - displays tracked quest objectives on HUD

import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { getQuestById } from '@/constants/quests';

export function QuestTracker() {
  const { trackedQuestId, isObjectiveCompleted } = useLearningStore();

  if (!trackedQuestId) return null;

  const quest = getQuestById(trackedQuestId);
  if (!quest) return null;

  const completedCount = quest.objectives.filter(obj => 
    isObjectiveCompleted(quest.id, obj.id)
  ).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed right-4 top-24 z-30 pointer-events-none"
      >
        <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 w-80 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <Target className="text-blue-400" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{quest.title}</h3>
              <p className="text-xs text-gray-400">
                {completedCount}/{quest.objectives.length} objectives
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            {quest.objectives.map((objective) => {
              const completed = isObjectiveCompleted(quest.id, objective.id);
              return (
                <motion.div
                  key={objective.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  {completed ? (
                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={14} />
                  ) : (
                    <Circle className="text-gray-600 flex-shrink-0 mt-0.5" size={14} />
                  )}
                  <span className={`text-xs ${
                    completed ? 'text-gray-500 line-through' : 'text-gray-300'
                  }`}>
                    {objective.description}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
