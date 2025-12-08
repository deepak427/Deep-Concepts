import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const BitsVsQubits = () => {
  const [mode, setMode] = useState<'bit' | 'qubit'>('bit');
  const [bitValue, setBitValue] = useState(0);
  const [qubitAngle, setQubitAngle] = useState(45); // Degrees
  const [measurement, setMeasurement] = useState<number | null>(null);

  const measureQubit = () => {
    // Probability of being 0 is cos^2(angle/2)
    // Simplified for this demo: map angle 0-90 to probability
    const prob0 = Math.cos((qubitAngle * Math.PI) / 180) ** 2;
    const result = Math.random() < prob0 ? 0 : 1;
    setMeasurement(result);
  };

  useEffect(() => {
    setMeasurement(null);
  }, [mode, qubitAngle]);

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8 flex flex-col items-center">
      <div className="flex gap-4 mb-8 bg-slate-800 p-1 rounded-lg">
        <button 
            className={`px-4 py-2 rounded-md transition-colors ${mode === 'bit' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('bit')}
        >
            Classical Bit
        </button>
        <button 
            className={`px-4 py-2 rounded-md transition-colors ${mode === 'qubit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('qubit')}
        >
            Qubit
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-64 w-full">
        {mode === 'bit' ? (
            <div className="flex flex-col items-center gap-4">
                <div 
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-colors cursor-pointer ${bitValue === 1 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
                    onClick={() => setBitValue(v => v === 0 ? 1 : 0)}
                >
                    {bitValue}
                </div>
                <p className="text-sm text-slate-400">Click circle to flip bit</p>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-600 flex items-center justify-center">
                    {/* Visualizing the vector */}
                    <motion.div 
                        className="absolute w-1 h-14 bg-purple-500 origin-bottom rounded-full"
                        style={{ bottom: '50%', rotate: measurement !== null ? (measurement === 0 ? 0 : 90) : qubitAngle }}
                        animate={{ rotate: measurement !== null ? (measurement === 0 ? 0 : 90) : qubitAngle }}
                    />
                    <div className="absolute top-2 text-xs text-slate-400 font-mono">|0⟩</div>
                    <div className="absolute right-2 text-xs text-slate-400 font-mono">|1⟩</div>
                    
                    {measurement !== null && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-purple-500/20 rounded-full flex items-center justify-center"
                        >
                            <span className="text-3xl font-bold text-white">{measurement}</span>
                        </motion.div>
                    )}
                </div>

                <div className="w-full px-8">
                     <label className="text-xs text-slate-400 mb-2 block">Superposition Mix</label>
                     <input 
                        type="range" 
                        min="0" 
                        max="90" 
                        value={qubitAngle} 
                        onChange={(e) => {
                            setQubitAngle(parseInt(e.target.value));
                            setMeasurement(null);
                        }}
                        className="w-full accent-purple-500"
                        disabled={measurement !== null}
                     />
                     <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Mostly 0</span>
                        <span>Mix</span>
                        <span>Mostly 1</span>
                     </div>
                </div>

                <button 
                    onClick={measureQubit}
                    disabled={measurement !== null}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-purple-900/20"
                >
                    {measurement !== null ? "Collapsed!" : "Measure State"}
                </button>
                {measurement !== null && (
                     <button onClick={() => setMeasurement(null)} className="text-sm text-purple-400 underline">
                         Reset
                     </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};