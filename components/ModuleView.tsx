import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModuleData } from '../types';
import { Quiz } from './Quiz';
import { IntroComparison } from './interactives/IntroComparison';
import { BitsVsQubits } from './interactives/BitsVsQubits';
import { EntanglementDemo } from './interactives/EntanglementDemo';
import { GroverDemo } from './interactives/GroverDemo';

interface ModuleViewProps {
  module: ModuleData;
  onModuleComplete: () => void;
  onNext: () => void;
  isLastModule: boolean;
}

export const ModuleView: React.FC<ModuleViewProps> = ({ module, onModuleComplete, onNext, isLastModule }) => {
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset quiz state when module changes
  useEffect(() => {
    setQuizCompleted(false);
  }, [module.id]);

  const handleQuizPass = () => {
    setQuizCompleted(true);
    onModuleComplete();
  };

  const renderInteractive = () => {
    switch (module.id) {
        case 'intro': return <IntroComparison />;
        case 'bits-qubits': return <BitsVsQubits />;
        case 'entanglement': return <EntanglementDemo />;
        case 'algorithm': return <GroverDemo />;
        case 'superposition':
            return (
                <div className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center">
                    <div className="h-32 w-full flex items-center justify-center overflow-hidden">
                        <motion.div 
                           animate={{ y: [10, -10, 10] }} 
                           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                           className="w-full h-1 bg-cyan-500/50 absolute"
                        />
                        <motion.div 
                           animate={{ y: [-10, 10, -10] }} 
                           transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                           className="w-full h-1 bg-purple-500/50 absolute"
                        />
                        <p className="relative z-10 bg-slate-900 px-4 py-1 text-xs text-slate-400">Visualizing Interference</p>
                    </div>
                </div>
            );
        case 'gates':
             return (
                 <div className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-700 text-center">
                     <div className="flex justify-center gap-4 mb-4">
                         {['X', 'H', 'Z'].map(g => (
                             <div key={g} className="w-12 h-12 bg-slate-800 border border-cyan-500/50 flex items-center justify-center font-bold rounded shadow hover:scale-110 transition-transform cursor-default">
                                 {g}
                             </div>
                         ))}
                     </div>
                     <p className="text-sm text-slate-400">Quantum Gates act like musical notes, changing the qubit's frequency and phase.</p>
                 </div>
             );
        case 'hardware':
             return (
                 <div className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center">
                     <div className="w-32 h-48 bg-gradient-to-b from-slate-700 via-amber-600/20 to-amber-600/10 rounded-full border-2 border-slate-600 relative overflow-hidden flex items-center justify-center">
                        <motion.div 
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-[10px] text-amber-500 font-mono absolute bottom-4"
                        >
                            15mK
                        </motion.div>
                     </div>
                     <p className="mt-4 text-xs text-slate-400">Dilution Refrigerator</p>
                 </div>
             );
        default: return null;
    }
  };

  return (
    <motion.div 
        key={module.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-6 py-10"
    >
      <header className="mb-8">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">{module.shortTitle}</h2>
        <h1 className="text-4xl font-extrabold text-white mb-4">{module.title}</h1>
        <p className="text-xl text-slate-300 leading-relaxed">{module.description}</p>
      </header>

      <section className="mb-10">
        <div className="bg-slate-800/30 p-6 rounded-xl border-l-4 border-cyan-500">
            <h3 className="font-semibold text-white mb-3">Key Concepts</h3>
            <ul className="space-y-2">
                {module.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-cyan-500 mt-1">•</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
      </section>

      <section>
          {renderInteractive()}
      </section>

      <section className="mb-12">
          <Quiz data={module.quiz} onComplete={handleQuizPass} />
      </section>

      {quizCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
              <button 
                onClick={onNext}
                className="group flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all transform hover:-translate-y-1"
              >
                  {isLastModule ? "Complete Course" : "Next Module"}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
          </motion.div>
      )}
    </motion.div>
  );
};