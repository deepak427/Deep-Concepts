// Boss Battle Component - Turn-based battle system

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';
import { getBossById, generateBossChallenge, type BossChallenge, type Boss } from '@/constants/bosses';
import { BossBar } from './BossBar';
import { Zap, Heart, Shield, Sparkles } from 'lucide-react';

interface BossBattleProps {
  bossId: string;
  onVictory: () => void;
  onDefeat: () => void;
  onExit: () => void;
}

export function BossBattle({ bossId, onVictory, onDefeat, onExit }: BossBattleProps) {
  const boss = getBossById(bossId);
  const { addXP, unlockAchievement, endBossBattle: markBossDefeated } = useLearningStore();

  // Battle state
  const [bossHealth, setBossHealth] = useState(boss?.maxHealth || 100);
  const [explorerHealth, setExplorerHealth] = useState(100);
  const [turn, setTurn] = useState<'explorer' | 'boss'>('explorer');
  const [currentChallenge, setCurrentChallenge] = useState<BossChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  if (!boss) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Boss not found!</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  // Start battle with first challenge
  useEffect(() => {
    if (!currentChallenge && turn === 'explorer' && !showVictory && !showDefeat) {
      const challenge = generateBossChallenge(bossId, challengesCompleted);
      setCurrentChallenge(challenge);
      addToBattleLog(`${boss.name} challenges you!`);
    }
  }, [turn, currentChallenge, bossId, challengesCompleted, boss.name, showVictory, showDefeat]);

  // Check for battle end
  useEffect(() => {
    if (bossHealth <= 0 && !showVictory) {
      setShowVictory(true);
      addToBattleLog(`🎉 Victory! You defeated ${boss.name}!`);
      
      // Award rewards
      setTimeout(() => {
        markBossDefeated(true); // Mark boss as defeated in state
        addXP(boss.defeatReward.xp, `boss-defeat-${boss.id}`);
        if (boss.defeatReward.achievementId) {
          unlockAchievement(boss.defeatReward.achievementId);
        }
        setTimeout(() => onVictory(), 2000);
      }, 1500);
    } else if (explorerHealth <= 0 && !showDefeat) {
      setShowDefeat(true);
      addToBattleLog(`💀 Defeat! ${boss.name} has bested you...`);
      markBossDefeated(false); // Mark battle as ended (not defeated)
      setTimeout(() => onDefeat(), 2000);
    }
  }, [bossHealth, explorerHealth, boss, addXP, unlockAchievement, onVictory, onDefeat, showVictory, showDefeat]);

  const addToBattleLog = (message: string) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnimating || turn !== 'explorer') return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentChallenge || isAnimating) return;

    setIsAnimating(true);
    const isCorrect = selectedAnswer === currentChallenge.correctAnswer;

    if (isCorrect) {
      // Explorer deals damage to boss
      const damage = currentChallenge.damage;
      setBossHealth(prev => Math.max(0, prev - damage));
      addToBattleLog(`⚡ Correct! You deal ${damage} damage to ${boss.name}!`);
      setChallengesCompleted(prev => prev + 1);

      setTimeout(() => {
        setIsAnimating(false);
        setSelectedAnswer(null);
        setCurrentChallenge(null);
        
        // Boss turn if still alive
        if (bossHealth - damage > 0) {
          setTurn('boss');
          setTimeout(() => executeBossAttack(), 1500);
        }
      }, 1500);
    } else {
      // Explorer takes damage
      const damage = 10;
      setExplorerHealth(prev => Math.max(0, prev - damage));
      addToBattleLog(`❌ Incorrect! You take ${damage} damage!`);

      setTimeout(() => {
        setIsAnimating(false);
        setSelectedAnswer(null);
        setCurrentChallenge(null);
        
        // Boss turn if explorer still alive
        if (explorerHealth - damage > 0) {
          setTurn('boss');
          setTimeout(() => executeBossAttack(), 1500);
        }
      }, 1500);
    }
  };

  const executeBossAttack = () => {
    if (!boss.attacks.length) return;

    const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
    const damage = attack.damage;
    
    setExplorerHealth(prev => Math.max(0, prev - damage));
    addToBattleLog(`${boss.name} uses ${attack.name}! You take ${damage} damage!`);

    setTimeout(() => {
      setTurn('explorer');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Boss Bar */}
      <BossBar
        boss={boss}
        bossHealth={bossHealth}
        bossMaxHealth={boss.maxHealth}
        explorerHealth={explorerHealth}
        explorerMaxHealth={100}
        turn={turn}
      />

      {/* Main Battle Area */}
      <div className="pt-40 pb-20 px-4 max-w-4xl mx-auto relative z-10">
        {/* Boss Visual */}
        <motion.div
          className="text-center mb-8"
          animate={
            isAnimating && selectedAnswer === currentChallenge?.correctAnswer
              ? { x: [0, -10, 10, -10, 10, 0], scale: [1, 0.95, 1] }
              : {}
          }
        >
          <motion.div
            className="text-9xl mb-4 inline-block"
            animate={{
              scale: turn === 'boss' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {boss.avatar}
          </motion.div>
        </motion.div>

        {/* Battle Log */}
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 min-h-[120px]">
          <AnimatePresence mode="popLayout">
            {battleLog.map((log, index) => (
              <motion.div
                key={`${log}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm mb-2 text-gray-300"
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Challenge Area */}
        <AnimatePresence mode="wait">
          {currentChallenge && turn === 'explorer' && !showVictory && !showDefeat && (
            <motion.div
              key={currentChallenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
            >
              <div className="flex items-start gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Challenge</h3>
                  <p className="text-gray-200 leading-relaxed">{currentChallenge.question}</p>
                </div>
              </div>

              {currentChallenge.hint && (
                <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-300">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Hint: {currentChallenge.hint}
                  </p>
                </div>
              )}

              {currentChallenge.options && (
                <div className="space-y-3 mb-6">
                  {currentChallenge.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnimating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedAnswer === index
                          ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50'
                          : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                      } border-2 ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-white bg-white'
                              : 'border-gray-400'
                          }`}
                        >
                          {selectedAnswer === index && (
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null || isAnimating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                    selectedAnswer !== null && !isAnimating
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/50'
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isAnimating ? 'Processing...' : 'Submit Answer'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {turn === 'boss' && !showVictory && !showDefeat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <Shield className="w-16 h-16 text-red-400" />
              </motion.div>
              <p className="text-xl text-red-400 font-bold">Boss is attacking...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Screen */}
        <AnimatePresence>
          {showVictory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-9xl mb-6"
                >
                  🎉
                </motion.div>
                <h2 className="text-5xl font-bold mb-4 text-yellow-400">Victory!</h2>
                <p className="text-2xl mb-6">You defeated {boss.name}!</p>
                <div className="space-y-2 text-lg">
                  <p className="text-green-400">+{boss.defeatReward.xp} XP</p>
                  {boss.defeatReward.achievementId && (
                    <p className="text-purple-400">🏆 Achievement Unlocked!</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {showDefeat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-9xl mb-6"
                >
                  💀
                </motion.div>
                <h2 className="text-5xl font-bold mb-4 text-red-400">Defeat</h2>
                <p className="text-2xl mb-6">{boss.name} has bested you...</p>
                <p className="text-gray-400">Train more and try again!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Button */}
      {!showVictory && !showDefeat && (
        <button
          onClick={onExit}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-lg transition-colors border border-gray-600"
        >
          Exit Battle
        </button>
      )}
    </div>
  );
}