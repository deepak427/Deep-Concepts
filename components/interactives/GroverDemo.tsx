import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const GroverDemo = () => {
  const [target] = useState(10); // Fixed target for simplicity
  const [mode, setMode] = useState<'classical' | 'quantum'>('classical');
  const [revealed, setRevealed] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [quantumPhase, setQuantumPhase] = useState(0); // 0: init, 1: superposition, 2: amplify

  const reset = () => {
    setRevealed([]);
    setAttempts(0);
    setQuantumPhase(0);
  };

  const handleBoxClick = (idx: number) => {
    if (mode === 'quantum') return;
    if (revealed.includes(idx)) return;
    
    setRevealed([...revealed, idx]);
    setAttempts(prev => prev + 1);
  };

  const runQuantum = () => {
      setQuantumPhase(1);
      setTimeout(() => {
          setQuantumPhase(2);
      }, 1500);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8">
      <div className="flex justify-center gap-4 mb-6">
        <button 
            onClick={() => { setMode('classical'); reset(); }}
            className={`px-4 py-2 rounded text-sm ${mode === 'classical' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
            Classical Search
        </button>
        <button 
            onClick={() => { setMode('quantum'); reset(); }}
            className={`px-4 py-2 rounded text-sm ${mode === 'quantum' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
            Quantum Search
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6">
        {Array.from({ length: 16 }).map((_, idx) => (
            <motion.div
                key={idx}
                onClick={() => handleBoxClick(idx)}
                initial={{ scale: 1, opacity: 1 }}
                animate={
                    mode === 'quantum' && quantumPhase === 2
                        ? { 
                            scale: idx === target ? 1.1 : 0.8, 
                            opacity: idx === target ? 1 : 0.3,
                            backgroundColor: idx === target ? '#a855f7' : '#1e293b'
                          } 
                        : {
                            backgroundColor: revealed.includes(idx) 
                                ? (idx === target ? '#22c55e' : '#ef4444') 
                                : '#1e293b'
                        }
                }
                className={`
                    h-14 rounded cursor-pointer border border-slate-600 flex items-center justify-center font-mono text-sm
                    ${mode === 'classical' && 'hover:bg-slate-700'}
                `}
            >
                {mode === 'classical' && revealed.includes(idx) && (idx === target ? '✓' : '✗')}
                {mode === 'quantum' && quantumPhase > 0 && (
                    <span className="text-[10px] text-slate-400">{quantumPhase === 1 ? '6%' : (idx === target ? '95%' : '0.3%')}</span>
                )}
            </motion.div>
        ))}
      </div>

      <div className="text-center min-h-[3rem]">
        {mode === 'classical' && (
             <p className="text-slate-300">Attempts: {attempts} <br/><span className="text-xs text-slate-500">Average needed: 8</span></p>
        )}
        {mode === 'quantum' && (
            <div className="flex flex-col items-center">
                {quantumPhase === 0 && (
                    <button onClick={runQuantum} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1 rounded">Run Algorithm</button>
                )}
                {quantumPhase === 1 && <p className="text-purple-300 animate-pulse">Creating Superposition...</p>}
                {quantumPhase === 2 && <p className="text-green-400">Amplitude Amplified! Found target efficiently.</p>}
            </div>
        )}
      </div>
    </div>
  );
};