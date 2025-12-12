import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Map, Backpack, ScrollText, HelpCircle, Sparkles } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { getLevelTitle, getNextLevelThreshold } from '@/lib/xpSystem';
import { useState, useEffect, useRef } from 'react';
import { PixelButton } from '../shared/PixelButton';

interface GameHUDProps {
  onMapClick: () => void;
  onQuestLogClick: () => void;
  onInventoryClick?: () => void;
  onAchievementsClick?: () => void;
  onHelpClick?: () => void;
  challengeInfo?: {
    title: string;
    description: string;
    progress?: number;
  };
}

export function GameHUD({
  onMapClick,
  onQuestLogClick,
  onInventoryClick,
  onAchievementsClick,
  onHelpClick,
  challengeInfo
}: GameHUDProps) {
  const { xp, level, achievements = [], activeQuests = [] } = useLearningStore();
  const levelTitle = getLevelTitle(level);
  const nextThreshold = getNextLevelThreshold(level);
  const currentThreshold = level > 1 ? getNextLevelThreshold(level - 1) || 0 : 0;
  const progress = nextThreshold ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100 : 100;

  // Level-up notification state
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, title: '' });
  const prevLevelRef = useRef(level);

  // XP animation state
  const [xpGain, setXpGain] = useState<number | null>(null);
  const prevXpRef = useRef(xp);

  // Detect level up
  useEffect(() => {
    if (level > prevLevelRef.current) {
      setLevelUpData({ level, title: levelTitle });
      setShowLevelUp(true);

      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
    prevLevelRef.current = level;
  }, [level, levelTitle]);

  // Detect XP gain
  useEffect(() => {
    if (xp > prevXpRef.current) {
      const gain = xp - prevXpRef.current;
      setXpGain(gain);

      // Clear XP gain display after animation
      const timer = setTimeout(() => {
        setXpGain(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
    prevXpRef.current = xp;
  }, [xp]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Left: Level & XP */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="pixel-panel px-4 py-2 md:px-6 md:py-3 pointer-events-auto flex items-center gap-4 bg-void-900 w-full md:w-auto justify-between md:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl md:text-4xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">👤</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-display font-bold text-sm md:text-lg tracking-wide">LVL {level}</span>
                    <span className="text-quantum-400 text-xs font-display tracking-wider uppercase hidden sm:inline-block">{levelTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 md:mt-2">
                    <div className="w-24 md:w-32 h-3 md:h-4 bg-void-950 border-2 border-void-800 relative">
                      <motion.div
                        key={xp}
                        initial={{ width: `${Math.min(progress, 100)}%` }}
                        animate={{
                          width: `${Math.min(progress, 100)}%`
                        }}
                        transition={{
                          width: { duration: 0.5, ease: 'linear' }
                        }}
                        className="h-full bg-quantum-500 box-border border-r-2 border-white"
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-slate-400 font-mono">{Math.floor(xp)} XP</span>
                  </div>
                </div>
              </div>

              {/* XP Gain Indicator */}
              <AnimatePresence>
                {xpGain !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 1.5, ease: 'linear' }}
                    className="absolute top-0 right-0 text-energy-400 font-display font-bold text-xl pointer-events-none drop-shadow-[2px_2px_0_rgba(0,0,0,1)] bg-void-950/80 px-2 border-2 border-energy-500"
                  >
                    +{xpGain} XP
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right: Actions */}
            <div className="flex gap-2 md:gap-3 pointer-events-auto items-center justify-end">
              <PixelButton onClick={onMapClick} size="md" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center !p-0" title="Map">
                <Map size={18} className="md:w-5 md:h-5" />
              </PixelButton>

              <PixelButton onClick={onQuestLogClick} variant="secondary" size="md" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center !p-0 relative" title="Quest Log">
                <ScrollText size={18} className="text-blue-400 md:w-5 md:h-5" />
                {activeQuests?.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 border-2 border-white text-white text-[10px] md:text-xs font-bold flex items-center justify-center shadow-sm">
                    {activeQuests.length}
                  </span>
                )}
              </PixelButton>

              <PixelButton onClick={onInventoryClick} variant="secondary" size="md" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center !p-0 hidden sm:flex" title="Inventory">
                <Backpack size={18} className="text-synapse-400 md:w-5 md:h-5" />
              </PixelButton>

              <PixelButton onClick={onAchievementsClick} variant="secondary" size="md" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center !p-0 relative" title="Achievements">
                <Trophy size={18} className="text-energy-400 md:w-5 md:h-5" />
                {achievements?.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-energy-500 border-2 border-void-900 text-void-950 text-[10px] md:text-xs font-bold flex items-center justify-center shadow-sm">
                    {achievements.length}
                  </span>
                )}
              </PixelButton>

              <PixelButton onClick={onHelpClick} variant="secondary" size="md" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center !p-0 hidden sm:flex" title="Help">
                <HelpCircle size={18} className="text-retro-green md:w-5 md:h-5" />
              </PixelButton>
            </div>
          </div>

          {/* Challenge Info */}
          <AnimatePresence>
            {challengeInfo && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 mx-auto max-w-2xl pointer-events-auto"
              >
                <div className="pixel-panel px-6 py-4 flex items-center justify-between bg-void-900">
                  <div className="flex-1">
                    <h3 className="text-quantum-400 font-display text-sm tracking-wide">{challengeInfo.title}</h3>
                    <p className="text-slate-300 text-xs font-mono mt-1">{challengeInfo.description}</p>
                  </div>
                  {challengeInfo.progress !== undefined && (
                    <div className="ml-4 font-display text-energy-400 text-xl">
                      {Math.round(challengeInfo.progress)}%
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Level-Up Notification */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-void-900 border-4 border-quantum-500 p-8 shadow-pixel-lg relative max-w-md w-full text-center pointer-events-auto">
              <div className="absolute inset-0 border-4 border-white opacity-20 pointer-events-none"></div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mb-4"
              >
                <Sparkles className="text-energy-400 w-16 h-16" />
              </motion.div>

              <h2 className="text-3xl font-display text-white mb-2 uppercase tracking-widest">Level Up!</h2>
              <div className="text-6xl font-display text-quantum-400 mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                {levelUpData.level}
              </div>
              <p className="text-synapse-400 font-display text-lg mb-8">{levelUpData.title}</p>

              <PixelButton onClick={() => setShowLevelUp(false)} variant="primary" size="lg" className="w-full">
                CONTINUE
              </PixelButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

