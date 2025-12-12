import React from 'react';
import { ModuleData, ModuleId } from '../types';
import { Check, Lock, AlertCircle, Trophy } from 'lucide-react';
import { MODULES } from '../constants';
import { useLearningStore } from '@/lib/learningState';
import { getLevelTitle, getNextLevelThreshold } from '@/lib/xpSystem';

interface SidebarProps {
  currentModuleId: ModuleId;
  completedModules: ModuleId[];
  onSelectModule: (id: ModuleId) => void;
  isOpen: boolean;
  toggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModuleId, completedModules, onSelectModule, isOpen, toggle }) => {
  const { xp, level, achievements, modules, reviewQueue } = useLearningStore();
  
  const levelTitle = getLevelTitle(level);
  const nextThreshold = getNextLevelThreshold(level);
  const currentThreshold = level > 1 ? getNextLevelThreshold(level - 1) || 0 : 0;
  
  const progress = nextThreshold
    ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  // Check if module needs review
  const moduleNeedsReview = (moduleId: ModuleId) => {
    return reviewQueue.some(item => item.moduleId === moduleId);
  };

  // Get mastery percentage for a module
  const getModuleMastery = (moduleId: ModuleId): number => {
    const moduleData = modules[moduleId];
    return moduleData?.masteryLevel || 0;
  };

  return (
    <>
        {/* Overlay for mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden" 
            onClick={toggle}
            role="button"
            aria-label="Close navigation menu"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                toggle();
              }
            }}
          />
        )}
        
        <aside 
          className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
          role="navigation"
          aria-label="Main navigation"
        >
            <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">D</div>
                        <span className="font-bold text-lg text-white tracking-tight">DeepConcepts</span>
                    </div>
                    <button 
                      onClick={toggle} 
                      className="md:hidden text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded p-1"
                      aria-label="Close navigation menu"
                    >
                      ✕
                    </button>
                </div>

                {/* XP Bar in Header */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm font-semibold text-white">Level {level}</span>
                            <span className="text-xs text-slate-400 ml-2">{levelTitle}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                            {Math.floor(xp)} XP
                        </span>
                    </div>
                    <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            role="progressbar"
                            aria-valuenow={Math.floor(progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`XP progress: ${Math.floor(progress)}%`}
                        />
                    </div>
                    {nextThreshold && (
                        <p className="text-xs text-slate-500">
                            {nextThreshold - Math.floor(xp)} XP to next level
                        </p>
                    )}
                </div>

                {/* Achievement Count */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Trophy size={14} className="text-yellow-500" />
                    <span>{achievements.length} Achievement{achievements.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-220px)]">
                <div className="mb-6 px-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Course Progress</p>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500" 
                            style={{ width: `${(completedModules.length / MODULES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <nav className="space-y-1" aria-label="Course modules">
                    {MODULES.map((module, index) => {
                        const isCompleted = completedModules.includes(module.id);
                        const isCurrent = module.id === currentModuleId;
                        const isLocked = false; // All modules unlocked for better UX
                        const needsReview = moduleNeedsReview(module.id);
                        const mastery = getModuleMastery(module.id);
                        const hasMastery = mastery > 0;

                        return (
                            <button
                                key={module.id}
                                disabled={isLocked}
                                onClick={() => {
                                    onSelectModule(module.id);
                                    if(window.innerWidth < 768) toggle();
                                }}
                                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors text-sm relative focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                    isCurrent 
                                        ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                                        : isLocked 
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                                aria-label={`${module.shortTitle}${isCompleted ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}${needsReview ? ' (needs review)' : ''}${hasMastery ? `, ${Math.round(mastery)}% mastery` : ''}`}
                                aria-current={isCurrent ? 'page' : undefined}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border flex-shrink-0 ${
                                    isCompleted 
                                        ? 'bg-green-500 border-green-500 text-slate-900' 
                                        : isCurrent 
                                            ? 'border-cyan-500 text-cyan-500' 
                                            : isLocked 
                                                ? 'border-slate-700 bg-slate-800'
                                                : 'border-slate-500'
                                }`}>
                                    {isCompleted ? <Check size={14} /> : (isLocked ? <Lock size={12}/> : index + 1)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="truncate">{module.shortTitle}</div>
                                    {hasMastery && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <div 
                                              className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"
                                              role="progressbar"
                                              aria-valuenow={Math.round(mastery)}
                                              aria-valuemin={0}
                                              aria-valuemax={100}
                                              aria-label={`Mastery level: ${Math.round(mastery)}%`}
                                            >
                                                <div 
                                                    className={`h-full transition-all duration-300 ${
                                                        mastery >= 90 ? 'bg-green-500' :
                                                        mastery >= 70 ? 'bg-blue-500' :
                                                        mastery >= 50 ? 'bg-yellow-500' :
                                                        'bg-slate-600'
                                                    }`}
                                                    style={{ width: `${mastery}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500" aria-hidden="true">{Math.round(mastery)}%</span>
                                        </div>
                                    )}
                                </div>
                                {needsReview && (
                                    <AlertCircle 
                                        size={16} 
                                        className="text-yellow-500 flex-shrink-0" 
                                        aria-label="Needs review"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-slate-800 px-2 opacity-50">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Coming Soon</p>
                    <div className="space-y-2">
                        <div className="text-sm text-slate-700 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"/> Artificial Intelligence</div>
                        <div className="text-sm text-slate-700 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"/> Blockchain</div>
                    </div>
                </div>
            </div>
        </aside>
    </>
  );
};