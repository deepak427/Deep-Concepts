
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Atom } from 'lucide-react';

export const IntroComparison = () => {
  const [activeCard, setActiveCard] = useState<'classical' | 'quantum' | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto my-8">
      {/* Classical Card */}
      <motion.div 
        className={`flex-1 p-6 rounded-xl border-2 cursor-pointer transition-colors overflow-hidden relative ${activeCard === 'classical' ? 'border-cyan-400 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}
        whileHover={{ scale: 1.02 }}
        onClick={() => setActiveCard('classical')}
      >
        <div className="flex items-center gap-3 mb-6 text-cyan-400 relative z-10">
          <Cpu size={32} />
          <h3 className="text-xl font-bold">Classical</h3>
        </div>

        {/* Visual: Classical Coin / Switch */}
        <div className="h-32 flex items-center justify-center mb-6 bg-slate-900/30 rounded-lg border border-slate-700/50">
           {activeCard === 'classical' ? (
             <motion.div 
                key="classical-active"
                className="w-20 h-20 rounded-full bg-cyan-600 border-4 border-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 0.4 }}
             >
                <span className="text-3xl font-bold text-white transform -scale-x-100">1</span>
             </motion.div>
           ) : (
             <div className="w-20 h-20 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-400">0</span>
             </div>
           )}
        </div>

        <div className="space-y-3 text-slate-300 relative z-10">
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"/> Uses <strong>Bits</strong> (0 or 1)</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"/> Heads OR Tails</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"/> Deterministic</p>
        </div>

        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: activeCard === 'classical' ? 'auto' : 0, opacity: activeCard === 'classical' ? 1 : 0 }}
            className="overflow-hidden"
        >
            <div className="pt-4 text-sm text-cyan-200 border-t border-slate-700 mt-4">
                Like a coin resting on a table. It has definitely chosen a side.
            </div>
        </motion.div>
      </motion.div>

      {/* Quantum Card */}
      <motion.div 
        className={`flex-1 p-6 rounded-xl border-2 cursor-pointer transition-colors overflow-hidden relative ${activeCard === 'quantum' ? 'border-purple-400 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}
        whileHover={{ scale: 1.02 }}
        onClick={() => setActiveCard('quantum')}
      >
        <div className="flex items-center gap-3 mb-6 text-purple-400 relative z-10">
          <Atom size={32} />
          <h3 className="text-xl font-bold">Quantum</h3>
        </div>

        {/* Visual: Spinning Coin */}
        <div className="h-32 flex items-center justify-center mb-6 bg-slate-900/30 rounded-lg border border-slate-700/50 [perspective:1000px]">
           <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 border-4 border-purple-300 flex items-center justify-center relative shadow-[0_0_25px_rgba(168,85,247,0.4)]"
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
           >
              {/* Backlight/Blur effect */}
              <div className="absolute inset-0 bg-white/30 rounded-full blur-sm" />
              <span className="text-white font-serif text-3xl font-bold relative z-10 mix-blend-overlay">Ψ</span>
           </motion.div>
        </div>

        <div className="space-y-3 text-slate-300 relative z-10">
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Uses <strong>Qubits</strong></p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Spinning Coin</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Probabilistic</p>
        </div>

        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: activeCard === 'quantum' ? 'auto' : 0, opacity: activeCard === 'quantum' ? 1 : 0 }}
            className="overflow-hidden"
        >
             <div className="pt-4 text-sm text-purple-200 border-t border-slate-700 mt-4">
                While spinning, it is not Heads or Tails. It is a mix of both probabilities at once.
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
