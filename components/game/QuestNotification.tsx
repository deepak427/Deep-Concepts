// Quest notification component for objective completion feedback

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface QuestNotificationData {
  type: 'objective' | 'complete';
  title: string;
  description: string;
  xpReward?: number;
  achievementUnlocked?: string;
}

interface QuestNotificationProps {
  notification: QuestNotificationData | null;
  onDismiss: () => void;
}

export function QuestNotification({ notification, onDismiss }: QuestNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for exit animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className={`bg-gradient-to-br rounded-2xl p-5 border shadow-2xl min-w-[320px] max-w-md ${
            notification.type === 'complete'
              ? 'from-green-900/90 to-emerald-900/90 border-green-500/50 shadow-green-500/20'
              : 'from-blue-900/90 to-cyan-900/90 border-blue-500/50 shadow-blue-500/20'
          }`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                notification.type === 'complete'
                  ? 'bg-green-500/20'
                  : 'bg-blue-500/20'
              }`}>
                {notification.type === 'complete' ? (
                  <Trophy className="text-green-400" size={28} />
                ) : (
                  <CheckCircle2 className="text-blue-400" size={28} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  {notification.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {notification.description}
                </p>

                {/* Rewards */}
                <div className="flex items-center gap-3">
                  {notification.xpReward && (
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                      <Star size={16} className="fill-yellow-400" />
                      <span>+{notification.xpReward} XP</span>
                    </div>
                  )}
                  {notification.achievementUnlocked && (
                    <div className="flex items-center gap-1 text-purple-400 text-sm font-medium">
                      <Trophy size={16} />
                      <span>Achievement!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className={`h-1 mt-4 rounded-full ${
                notification.type === 'complete'
                  ? 'bg-green-500/50'
                  : 'bg-blue-500/50'
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing quest notifications
export function useQuestNotifications() {
  const [notification, setNotification] = useState<QuestNotificationData | null>(null);

  const showObjectiveComplete = (objectiveDescription: string) => {
    setNotification({
      type: 'objective',
      title: 'Objective Complete!',
      description: objectiveDescription
    });
  };

  const showQuestComplete = (questTitle: string, xpReward: number, achievementId?: string) => {
    setNotification({
      type: 'complete',
      title: 'Quest Complete!',
      description: questTitle,
      xpReward,
      achievementUnlocked: achievementId
    });
  };

  const dismiss = () => {
    setNotification(null);
  };

  return {
    notification,
    showObjectiveComplete,
    showQuestComplete,
    dismiss
  };
}
