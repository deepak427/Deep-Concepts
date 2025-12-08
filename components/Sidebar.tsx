import React from 'react';
import { ModuleData, ModuleId } from '../types';
import { Check, Lock } from 'lucide-react';
import { MODULES } from '../constants';

interface SidebarProps {
  currentModuleId: ModuleId;
  completedModules: ModuleId[];
  onSelectModule: (id: ModuleId) => void;
  isOpen: boolean;
  toggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModuleId, completedModules, onSelectModule, isOpen, toggle }) => {
  return (
    <>
        {/* Overlay for mobile */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={toggle} />}
        
        <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">D</div>
                    <span className="font-bold text-lg text-white tracking-tight">DeepConcepts</span>
                </div>
                <button onClick={toggle} className="md:hidden text-slate-400">✕</button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                <div className="mb-6 px-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Course Progress</p>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500" 
                            style={{ width: `${(completedModules.length / MODULES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <nav className="space-y-1">
                    {MODULES.map((module, index) => {
                        const isCompleted = completedModules.includes(module.id);
                        const isCurrent = module.id === currentModuleId;
                        const isLocked = !isCompleted && index > 0 && !completedModules.includes(MODULES[index - 1].id);

                        return (
                            <button
                                key={module.id}
                                disabled={isLocked}
                                onClick={() => {
                                    onSelectModule(module.id);
                                    if(window.innerWidth < 768) toggle();
                                }}
                                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors text-sm ${
                                    isCurrent 
                                        ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                                        : isLocked 
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
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
                                <span className="truncate">{module.shortTitle}</span>
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