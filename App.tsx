import React, { useState, useEffect, memo } from 'react';
import { OnboardingFlow } from './components/layout/OnboardingFlow';
import { Dashboard } from './components/layout/Dashboard';
import { AchievementsView } from './components/layout/AchievementsView';
import { SettingsView } from './components/layout/SettingsView';
import { HelpView } from './components/layout/HelpView';
import { LevelUpModal } from './components/learning/LevelUpModal';
import { AchievementBadge } from './components/learning/AchievementBadge';
import { AchievementToast } from './components/game/AchievementToast';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { QuantumHub } from './components/game/QuantumHub';
import { GameHUD } from './components/game/GameHUD';

import { BitsVsQubitsIsland } from './components/islands/BitsVsQubitsIsland';
import { SuperpositionIsland } from './components/islands/SuperpositionIsland';
import { EntanglementValley } from './components/islands/EntanglementValley';
import { CircuitCity } from './components/islands/CircuitCity';
import { AlgorithmTemple } from './components/islands/AlgorithmTemple';
import { CryogenicCaverns } from './components/islands/CryogenicCaverns';
import { ModuleId } from './types';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from './lib/learningState';
import { useReducedMotion } from './lib/useReducedMotion';
import { XPProvider } from './lib/xpContext';
import './styles/accessibility.css';
import './styles/design-system.css';
import { PixelCursor } from './components/shared/PixelCursor';
import { ResponsiveNav } from './components/shared/ResponsiveNav';
import { FeedbackSystem, useFeedback } from './components/shared/FeedbackSystem';

type View = 'hub' | 'dashboard' | 'island' | 'achievements' | 'settings' | 'help';

function App() {
  const [currentView, setCurrentView] = useState<View>('hub');
  const [currentIslandId, setCurrentIslandId] = useState<ModuleId>('intro');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [xpGains, setXpGains] = useState<Array<{ id: string; amount: number; source: string }>>([]);

  const { userProfile, level, achievements, xp, updateLastSession } = useLearningStore();
  const onboardingCompleted = userProfile.onboardingCompleted;
  const reducedMotion = useReducedMotion();
  const [prevLevel, setPrevLevel] = useState(level);
  const feedback = useFeedback();

  // Update last session on mount
  useEffect(() => {
    if (onboardingCompleted) {
      updateLastSession();
    }
  }, [onboardingCompleted, updateLastSession]);

  // Detect level up
  useEffect(() => {
    if (level > prevLevel) {
      setLevelUpLevel(level);
      setShowLevelUpModal(true);
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  // Track previous achievements for unlock detection
  const [prevAchievementIds, setPrevAchievementIds] = useState<string[]>(
    achievements.map(a => a.id)
  );

  // Detect new achievements
  useEffect(() => {
    const currentIds = achievements.map(a => a.id);
    const newIds = currentIds.filter(id => !prevAchievementIds.includes(id));

    if (newIds.length > 0) {
      setNewAchievements(prev => [...prev, ...newIds]);
      setPrevAchievementIds(currentIds);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNewAchievements(prev => prev.filter(id => !newIds.includes(id)));
      }, 5000);
    }
  }, [achievements, prevAchievementIds]);

  const handleIslandClick = (islandId: string) => {
    setCurrentIslandId(islandId as ModuleId);
    setCurrentView('island');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
  };

  const showXPGain = (amount: number, source: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setXpGains(prev => [...prev, { id, amount, source }]);
    setTimeout(() => {
      setXpGains(prev => prev.filter(xp => xp.id !== id));
    }, 2000);
  };

  const renderIslandExperience = () => {
    switch (currentIslandId) {
      case 'intro':
        return <BitsVsQubitsIsland onComplete={handleBackToHub} />;
      case 'bits-qubits':
        return <BitsVsQubitsIsland onComplete={handleBackToHub} />;
      case 'superposition':
        return <SuperpositionIsland onComplete={handleBackToHub} />;
      case 'entanglement':
        return <EntanglementValley onComplete={handleBackToHub} />;
      case 'gates':
        return <CircuitCity onComplete={handleBackToHub} />;
      case 'algorithm':
        return <AlgorithmTemple onComplete={handleBackToHub} />;
      case 'hardware':
        return <CryogenicCaverns onComplete={handleBackToHub} />;
      default:
        return <BitsVsQubitsIsland onComplete={handleBackToHub} />;
    }
  };

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return <OnboardingFlow onComplete={() => { }} />;
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  return (
    <ErrorBoundary>
      <XPProvider value={{ showXPGain }}>
        <div className="min-h-screen bg-void-950 text-slate-200 font-sans selection:bg-quantum-500/30 relative">
          <PixelCursor />

          {/* Responsive Navigation */}
          <ResponsiveNav
            currentView={currentView}
            onNavigate={handleNavigate}
            userLevel={level}
            xp={xp}
          />

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] opacity-20" />
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {currentView === 'hub' && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <QuantumHub onIslandClick={handleIslandClick} />
              </motion.div>
            )}

            {currentView === 'island' && (
              <motion.div
                key="island"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                {renderIslandExperience()}
              </motion.div>
            )}

            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <Dashboard />
              </motion.div>
            )}

            {currentView === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <AchievementsView />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <SettingsView />
              </motion.div>
            )}

            {currentView === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <HelpView />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback System */}
          <FeedbackSystem
            messages={feedback.messages}
            onDismiss={feedback.dismissFeedback}
            position="top-right"
          />

          {/* Level Up Modal */}
          <LevelUpModal
            level={levelUpLevel}
            show={showLevelUpModal}
            onClose={() => setShowLevelUpModal(false)}
          />

          {/* Achievement Notifications */}
          <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none md:top-20">
            <AnimatePresence>
              {newAchievements.map(achievementId => {
                const achievement = achievements.find(a => a.id === achievementId);
                if (!achievement) return null;

                return (
                  <AchievementToast
                    key={achievementId}
                    achievement={achievement}
                    onClose={() => {
                      setNewAchievements(prev => prev.filter(id => id !== achievementId));
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* XP Animations */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <AnimatePresence>
              {xpGains.map(xp => (
                <motion.div
                  key={xp.id}
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    y: reducedMotion ? -20 : -100,
                    opacity: 0,
                    scale: reducedMotion ? 1 : 1.2
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.5 : 2, ease: 'easeOut' }}
                  className="text-2xl md:text-4xl font-display text-energy-400"
                  style={{ textShadow: '2px 2px 0 #000' }}
                >
                  +{xp.amount} XP
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </XPProvider>
    </ErrorBoundary>
  );
}

// Memoize the App component to prevent unnecessary re-renders
export default memo(App);