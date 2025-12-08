import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ModuleView } from './components/ModuleView';
import { MODULES } from './constants';
import { ModuleId } from './types';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [currentModuleId, setCurrentModuleId] = useState<ModuleId>('intro');
  const [completedModules, setCompletedModules] = useState<ModuleId[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('deepconcepts-progress');
    if (savedProgress) {
      setCompletedModules(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('deepconcepts-progress', JSON.stringify(completedModules));
  }, [completedModules]);

  const currentModuleIndex = MODULES.findIndex(m => m.id === currentModuleId);
  const currentModule = MODULES[currentModuleIndex];

  const handleModuleComplete = () => {
    if (!completedModules.includes(currentModuleId)) {
      setCompletedModules(prev => [...prev, currentModuleId]);
    }
  };

  const handleNext = () => {
    if (currentModuleIndex < MODULES.length - 1) {
      setCurrentModuleId(MODULES[currentModuleIndex + 1].id);
      window.scrollTo(0, 0);
    } else {
        setShowCompletionModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <Sidebar 
        currentModuleId={currentModuleId} 
        completedModules={completedModules}
        onSelectModule={setCurrentModuleId}
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="md:pl-72 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400">
                <Menu />
            </button>
            <span className="font-bold text-white">DeepConcepts</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full max-w-5xl mx-auto">
            <ModuleView 
                module={currentModule}
                onModuleComplete={handleModuleComplete}
                onNext={handleNext}
                isLastModule={currentModuleIndex === MODULES.length - 1}
            />
        </div>

        {/* Learning Coach / Footer */}
        <footer className="p-8 border-t border-slate-800 mt-auto bg-slate-900/50">
            <div className="max-w-3xl mx-auto flex items-center gap-4 text-sm text-slate-500">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    💡
                </div>
                <p>
                    {completedModules.length === 0 
                        ? "Welcome! Don't worry about the math. Focus on the concepts." 
                        : "Great progress. Try explaining what you just learned out loud to solidify it."}
                </p>
            </div>
        </footer>
      </main>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-slate-900 border border-cyan-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl shadow-cyan-900/50"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                        🎓
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Course Completed!</h2>
                    <p className="text-slate-300 mb-8">
                        You've taken your first steps into the quantum world. You now understand Qubits, Superposition, and Entanglement better than 99% of people.
                    </p>
                    <button 
                        onClick={() => setShowCompletionModal(false)}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Back to Review
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}