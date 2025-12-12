import { useState } from 'react';
import { motion } from 'framer-motion';
import { DilutionFridge } from '../quantum/DilutionFridge';
import { DecoherenceLab } from '../quantum/DecoherenceLab';

export const HardwareDemo = () => {
  const [activeTab, setActiveTab] = useState<'fridge' | 'decoherence'>('fridge');
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [scenarioResults, setScenarioResults] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0
  });

  const handleStageSelect = (stageIndex: number) => {
    setSelectedStage(stageIndex);
    console.log('Selected temperature stage:', stageIndex);
  };

  const handleScenarioComplete = (correct: boolean) => {
    setScenarioResults(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 my-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Quantum Hardware</h2>
        <p className="text-slate-400">
          Explore the extreme engineering required to build and operate quantum computers
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 bg-slate-800 p-1 rounded-lg w-fit">
        <button
          className={`px-6 py-3 rounded-md transition-colors font-semibold ${
            activeTab === 'fridge'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('fridge')}
        >
          Dilution Refrigerator
        </button>
        <button
          className={`px-6 py-3 rounded-md transition-colors font-semibold ${
            activeTab === 'decoherence'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('decoherence')}
        >
          Decoherence Lab
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'fridge' ? (
          <div>
            <DilutionFridge onStageSelect={handleStageSelect} />
            
            {selectedStage === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg p-6 border-2 border-purple-500"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  🎉 You've reached the quantum chip!
                </h3>
                <p className="text-slate-300">
                  At 10 millikelvin, you're now at one of the coldest places in the universe. 
                  This extreme environment is necessary for superconducting qubits to function.
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <div>
            <DecoherenceLab
              moduleId="hardware"
              onScenarioComplete={handleScenarioComplete}
            />
            
            {scenarioResults.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Your Progress:</span>
                  <span className="text-white font-bold">
                    {scenarioResults.correct} / {scenarioResults.total} correct
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(scenarioResults.correct / scenarioResults.total) * 100}%`
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Educational Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              Quantum computers require extreme cooling to ~10mK, colder than outer space
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>
              Decoherence is the enemy - qubits lose their quantum state due to noise and heat
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-1">•</span>
            <span>
              Coherence time limits how long calculations can run before quantum information is lost
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>
              Building quantum computers is one of the most challenging engineering feats ever attempted
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
