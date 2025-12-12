import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Thermometer, Zap } from 'lucide-react';

interface TemperatureStage {
  name: string;
  temperature: string;
  description: string;
  color: string;
}

const TEMPERATURE_STAGES: TemperatureStage[] = [
  {
    name: 'Room Temperature',
    temperature: '~300 K',
    description: 'Starting point - everyday temperature',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: '50K Stage',
    temperature: '~50 K',
    description: 'First cooling stage using liquid nitrogen',
    color: 'from-orange-400 to-yellow-400'
  },
  {
    name: '4K Stage',
    temperature: '~4 K',
    description: 'Liquid helium temperature',
    color: 'from-yellow-300 to-green-400'
  },
  {
    name: 'Still Stage',
    temperature: '~700 mK',
    description: 'Dilution refrigerator still',
    color: 'from-green-400 to-cyan-400'
  },
  {
    name: 'Cold Plate',
    temperature: '~100 mK',
    description: 'Cold plate for thermal anchoring',
    color: 'from-cyan-400 to-blue-400'
  },
  {
    name: 'Mixing Chamber',
    temperature: '~15 mK',
    description: 'Where quantum chip operates',
    color: 'from-blue-500 to-purple-500'
  },
  {
    name: 'Quantum Chip',
    temperature: '~10 mK',
    description: 'Superconducting qubits at near absolute zero',
    color: 'from-purple-600 to-pink-600'
  }
];

interface DilutionFridgeProps {
  onStageSelect?: (stageIndex: number) => void;
}

export function DilutionFridge({ onStageSelect }: DilutionFridgeProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStageClick = (index: number) => {
    setCurrentStage(index);
    onStageSelect?.(index);
  };

  const handleZoomIn = () => {
    if (currentStage < TEMPERATURE_STAGES.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentStage(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const handleZoomOut = () => {
    if (currentStage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentStage(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const handleReset = () => {
    setCurrentStage(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Visualization */}
      <div className="bg-void-900 rounded-none border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display text-cyan-400 tracking-wide uppercase">Dilution Refrigerator</h3>
          <div className="flex gap-2">
            <button
              onClick={handleZoomOut}
              disabled={currentStage === 0 || isAnimating}
              className="px-3 py-1 text-xs font-display uppercase tracking-wider rounded-none border-2 border-slate-600 text-slate-400 hover:bg-slate-800 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zoom Out
            </button>
            <button
              onClick={handleZoomIn}
              disabled={currentStage === TEMPERATURE_STAGES.length - 1 || isAnimating}
              className="px-3 py-1 text-xs font-display uppercase tracking-wider rounded-none bg-cyan-600 text-void-950 border-2 border-cyan-400 hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zoom In
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs font-display uppercase tracking-wider rounded-none border-2 border-slate-600 text-slate-400 hover:bg-slate-800 hover:border-slate-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Vertical Diagram */}
        <div className="relative h-[600px] bg-void-950 rounded-none border-2 border-void-700 overflow-hidden">
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px] z-10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col"
            >
              {TEMPERATURE_STAGES.map((stage, index) => {
                const isVisible = index <= currentStage;
                const isCurrent = index === currentStage;
                const height = isCurrent ? 60 : 15;

                return (
                  <motion.div
                    key={stage.name}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isVisible ? `${height}%` : 0,
                      opacity: isVisible ? 1 : 0
                    }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`relative border-b-2 border-void-950 cursor-pointer hover:brightness-110 transition-all ${isCurrent ? 'z-20' : ''
                      }`}
                    onClick={() => handleStageClick(index)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-b ${stage.color} opacity-80`} />
                    <div className="absolute inset-0 bg-void-950/20" /> {/* Darken slightly for retro feel */}

                    <div className="relative h-full flex flex-col justify-center px-6 text-white text-shadow-sm">
                      <div className="flex items-center gap-3">
                        {index === 0 && <Thermometer className="w-5 h-5 text-white" />}
                        {index === TEMPERATURE_STAGES.length - 1 && <Zap className="w-5 h-5 text-yellow-300" />}
                        <h4 className={`font-display tracking-wider ${isCurrent ? 'text-xl text-white' : 'text-sm text-white/80'}`}>
                          {stage.name}
                        </h4>
                      </div>

                      <p className={`font-mono mt-2 text-white ${isCurrent ? 'text-lg' : 'text-xs opacity-70'}`}>
                        {stage.temperature}
                      </p>

                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs font-mono mt-4 max-w-md bg-void-950/60 p-2 border border-white/20"
                        >
                          &gt; {stage.description}
                        </motion.p>
                      )}
                    </div>

                    {index < TEMPERATURE_STAGES.length - 1 && isCurrent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                      >
                        <ChevronDown className="w-8 h-8 animate-bounce text-white drop-shadow-md" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-xs font-mono text-slate-500 mt-4 text-center">
          &gt; CLICK_STAGE_TO_INSPECT // USE_CONTROLS_TO_NAVIGATE
        </p>
      </div>

      {/* Stage Information Panel */}
      <div className="bg-void-900 rounded-none border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <h3 className="text-lg font-display text-slate-300 mb-6 border-b-2 border-void-800 pb-2 tracking-wider">
          SYSTEM_STATUS: {TEMPERATURE_STAGES[currentStage].name.toUpperCase()}
        </h3>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-display text-cyan-400 text-shadow-sm">
                {TEMPERATURE_STAGES[currentStage].temperature}
              </p>
              <div className="mt-2 text-sm font-mono text-slate-400">
                &gt; Current Operating Temp
              </div>
            </div>
          </div>

          <div className="bg-void-950 p-4 border border-void-700">
            <p className="text-slate-300 font-mono text-sm leading-relaxed">
              {TEMPERATURE_STAGES[currentStage].description}
            </p>
          </div>

          {currentStage === TEMPERATURE_STAGES.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-void-950 rounded-none p-4 border-l-4 border-l-purple-500 border border-void-700"
            >
              <h5 className="font-display text-xs text-purple-400 uppercase tracking-widest mb-2">Extreme_Cold_Analysis</h5>
              <p className="text-xs text-slate-400 font-mono mb-2">
                &gt; Temp: 10mK (0.01 K) // Status: CRITICAL
              </p>
              <ul className="text-xs text-slate-500 font-mono space-y-2">
                <li className="flex gap-2">
                  <span className="text-purple-500">-</span>
                  <span>Superconductivity ACHIEVED</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">-</span>
                  <span>Thermal noise MINIMIZED</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">-</span>
                  <span>Coherence time MAXIMIZED</span>
                </li>
              </ul>
            </motion.div>
          )}

          {/* Progress Indicator */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
              <span>COOLING_PROGRESS</span>
              <span>{Math.round((currentStage / (TEMPERATURE_STAGES.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-void-950 border border-void-700 h-4">
              <motion.div
                className="bg-gradient-to-r from-cyan-600 to-purple-600 h-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStage / (TEMPERATURE_STAGES.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-20 bg-repeat-y bg-[length:100%_2px]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="bg-void-950 border-2 border-dashed border-void-700 p-6">
        <h3 className="text-sm font-display text-slate-400 uppercase tracking-widest mb-4">
          Data_Log: Dilution_Fridge
        </h3>
        <div className="space-y-3 text-xs font-mono text-slate-500">
          <p>
            &gt; SYSTEM_NOTE: Uses helium-3/helium-4 mix for cooling.
            Most sophisticated cooling system in existence.
          </p>
          <p>
            &gt; THERMAL_SHIELDING: Multi-stage isolation required.
            Quantum chip protection priority: ALPHA.
          </p>
          <p className="text-cyan-500/80 mt-2 border-t border-void-800 pt-2">
            *** FACT: QuChip runs 250x colder than deep space ***
          </p>
        </div>
      </div>
    </div>
  );
}
