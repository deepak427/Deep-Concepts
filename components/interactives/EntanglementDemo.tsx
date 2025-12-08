import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2 } from 'lucide-react';

export const EntanglementDemo = () => {
  const [isEntangled, setIsEntangled] = useState(false);
  const [states, setStates] = useState<{a: number | null, b: number | null}>({ a: null, b: null });

  const measure = () => {
    if (!isEntangled) {
      setStates({
        a: Math.random() > 0.5 ? 1 : 0,
        b: Math.random() > 0.5 ? 1 : 0
      });
    } else {
      // If entangled, they correlate perfectly (simplified Bell state)
      const val = Math.random() > 0.5 ? 1 : 0;
      setStates({ a: val, b: val });
    }
  };

  const reset = () => {
      setStates({ a: null, b: null });
  };

  return (
    <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 my-8 flex flex-col items-center">
      <div className="flex justify-center items-center gap-12 relative mb-12">
        {/* Connection Line */}
        <AnimatePresence>
            {isEntangled && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] top-1/2 left-0 z-0"
                />
            )}
        </AnimatePresence>

        {/* Qubit A */}
        <div className="relative z-10 flex flex-col items-center gap-3">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 transition-all duration-300 ${states.a !== null ? 'bg-cyan-500 text-white border-cyan-300' : 'bg-slate-800 border-slate-600'}`}>
                {states.a ?? '?'}
             </div>
             <span className="text-sm font-mono text-slate-400">Qubit A</span>
        </div>

        <div className="z-10 bg-slate-900 p-2">
            <Link2 size={24} className={isEntangled ? "text-cyan-400" : "text-slate-600"} />
        </div>

        {/* Qubit B */}
        <div className="relative z-10 flex flex-col items-center gap-3">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 transition-all duration-300 ${states.b !== null ? 'bg-cyan-500 text-white border-cyan-300' : 'bg-slate-800 border-slate-600'}`}>
                {states.b ?? '?'}
             </div>
             <span className="text-sm font-mono text-slate-400">Qubit B</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
            onClick={() => { setIsEntangled(!isEntangled); reset(); }}
            className={`px-4 py-2 rounded border ${isEntangled ? 'border-red-500 text-red-400 hover:bg-red-500/10' : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'}`}
        >
            {isEntangled ? "Break Link" : "Entangle Particles"}
        </button>
        <button 
            onClick={measure}
            className="bg-slate-100 text-slate-900 px-6 py-2 rounded font-bold hover:bg-white hover:scale-105 transition-transform"
        >
            Measure
        </button>
      </div>
      
      <p className="mt-6 text-sm text-slate-400 min-h-[1.5rem]">
          {states.a !== null ? (
              isEntangled 
                ? "Outcomes matches instantly! (Perfect correlation)" 
                : "Outcomes are random and independent."
          ) : (
              isEntangled ? "Particles are linked. Ready to measure." : "Particles are independent."
          )}
      </p>
    </div>
  );
};