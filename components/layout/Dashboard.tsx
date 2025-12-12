import { useLearningStore } from '@/lib/learningState';
import { getLevelTitle, getNextLevelThreshold, LEVEL_THRESHOLDS } from '@/lib/xpSystem';
import { MODULES } from '@/constants';
import { LearningProgress } from '@/components/shared/LearningProgress';
import { Trophy, BookOpen, Target } from 'lucide-react';
import { useState } from 'react';
import { PixelCard } from '@/components/shared/PixelCard';
import { PixelButton } from '@/components/shared/PixelButton';

export function Dashboard() {
  const { xp, level, achievements, modules } = useLearningStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'achievements'>('overview');

  const levelTitle = getLevelTitle(level);
  const nextLevelXP = getNextLevelThreshold(level);
  const currentLevelXP = LEVEL_THRESHOLDS.find(t => t.level === level)?.xp || 0;
  const xpProgress = nextLevelXP ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;

  // Transform modules for LearningProgress component
  const learningModules = MODULES.map(module => ({
    id: module.id,
    title: module.title,
    shortTitle: module.shortTitle,
    description: module.description,
    icon: module.icon,
    isUnlocked: true, // Simplified for now
    isCompleted: modules[module.id]?.completed || false,
    masteryLevel: modules[module.id]?.masteryLevel || 0,
    totalChallenges: 3, // Simplified
    completedChallenges: modules[module.id]?.interactionsCompleted?.length || 0,
    estimatedTime: module.estimatedTime || '15 min'
  }));

  const handleModuleClick = (moduleId: string) => {
    // Navigate to module
    window.location.hash = `#${moduleId}`;
  };

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24">
      <div className="container space-y-8">
        {/* Header */}
        <PixelCard variant="glow" padding="lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-quantum-400 uppercase tracking-widest mb-2">
                Dashboard
              </h1>
              <p className="text-slate-400">
                Track your quantum computing mastery journey
              </p>
            </div>

            {/* Level Progress */}
            <div className="bg-void-950 border-2 border-void-700 p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-energy-400">LVL {level}</span>
                <span className="text-xs text-slate-500">{levelTitle}</span>
              </div>
              <div className="w-full h-3 bg-void-800 border border-void-600 mb-2">
                <div
                  className="h-full bg-energy-500 transition-all duration-500"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{xp.toLocaleString()} XP</span>
                {nextLevelXP && <span>{nextLevelXP.toLocaleString()} XP</span>}
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <PixelButton
            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen className="w-4 h-4" />
            Overview
          </PixelButton>
          <PixelButton
            variant={activeTab === 'modules' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('modules')}
          >
            <Target className="w-4 h-4" />
            Modules
          </PixelButton>
          <PixelButton
            variant={activeTab === 'achievements' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('achievements')}
          >
            <Trophy className="w-4 h-4" />
            Achievements
          </PixelButton>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <PixelCard variant="elevated" padding="md">
              <div className="text-center">
                <div className="text-3xl font-display text-quantum-400 mb-2">
                  {Object.values(modules).filter(m => m.completed).length}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">
                  Modules Completed
                </div>
              </div>
            </PixelCard>

            <PixelCard variant="elevated" padding="md">
              <div className="text-center">
                <div className="text-3xl font-display text-energy-400 mb-2">
                  {Math.round(Object.values(modules).reduce((acc, m) => acc + m.masteryLevel, 0) / MODULES.length)}%
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">
                  Average Mastery
                </div>
              </div>
            </PixelCard>

            <PixelCard variant="elevated" padding="md">
              <div className="text-center">
                <div className="text-3xl font-display text-synapse-400 mb-2">
                  {achievements.length}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">
                  Achievements
                </div>
              </div>
            </PixelCard>
          </div>
        )}

        {activeTab === 'modules' && (
          <LearningProgress
            modules={learningModules}
            onModuleClick={handleModuleClick}
          />
        )}

        {activeTab === 'achievements' && (
          <PixelCard variant="elevated" padding="lg">
            <h2 className="font-display text-energy-500 text-xl mb-6 uppercase tracking-widest">
              Achievement Gallery
            </h2>
            
            {achievements.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-display text-sm uppercase mb-2">No Achievements Yet</p>
                <p className="text-sm">Complete modules to unlock achievements</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {achievements.map(achievement => (
                  <PixelCard key={achievement.id} variant="interactive" padding="sm">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3 className="font-display text-xs text-energy-400 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                  </PixelCard>
                ))}
              </div>
            )}
          </PixelCard>
        )}
      </div>
    </div>
  );
}
