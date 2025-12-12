import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Save, Download, X, Trash2, ArrowLeft } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { BlochSphere } from '@/components/quantum/BlochSphere';
import { WaveInterference } from '@/components/quantum/WaveInterference';
import { CircuitBuilder } from '@/components/quantum/CircuitBuilder';
import { QuantumSearch } from '@/components/quantum/QuantumSearch';
import { DecoherenceLab } from '@/components/quantum/DecoherenceLab';

type ToolType = 'bloch-sphere' | 'wave-interference' | 'circuit' | 'search' | 'decoherence';

interface SandboxModeProps {
  onExit: () => void;
}

export default function SandboxMode({ onExit }: SandboxModeProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [creationName, setCreationName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCreations, setShowCreations] = useState(false);
  
  const { 
    sandboxCreations, 
    saveSandboxCreation, 
    deleteSandboxCreation,
    exitSandboxMode 
  } = useLearningStore();

  const tools = [
    { id: 'bloch-sphere' as ToolType, name: 'Bloch Sphere', icon: '🎯', description: 'Visualize qubit states' },
    { id: 'wave-interference' as ToolType, name: 'Wave Interference', icon: '🌊', description: 'Explore superposition' },
    { id: 'circuit' as ToolType, name: 'Circuit Builder', icon: '⚡', description: 'Build quantum circuits' },
    { id: 'search' as ToolType, name: 'Quantum Search', icon: '🔍', description: 'Compare search algorithms' },
    { id: 'decoherence' as ToolType, name: 'Decoherence Lab', icon: '❄️', description: 'Study quantum noise' }
  ];

  const handleSaveCreation = () => {
    if (!creationName.trim() || !selectedTool) return;

    // Capture current state of the tool
    const data = captureToolState(selectedTool);
    
    saveSandboxCreation({
      name: creationName,
      type: selectedTool,
      data,
      thumbnail: undefined // Could capture screenshot here
    });

    setCreationName('');
    setShowSaveDialog(false);
  };

  const captureToolState = (tool: ToolType): any => {
    // In a real implementation, this would capture the actual state
    // from the tool component. For now, return placeholder data.
    return {
      tool,
      timestamp: Date.now()
    };
  };

  const handleExportImage = () => {
    // Capture the current tool view as an image
    const element = document.getElementById('sandbox-tool-container');
    if (!element) return;

    // In a real implementation, use html2canvas or similar
    console.log('Export image functionality would go here');
  };

  const handleExit = () => {
    exitSandboxMode();
    onExit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold">Quantum Playground</h1>
                <p className="text-sm text-purple-300">Experiment freely - no objectives, no limits</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedTool && (
                <>
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Creation
                  </button>
                  
                  <button
                    onClick={handleExportImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Image
                  </button>
                </>
              )}
              
              <button
                onClick={() => setShowCreations(!showCreations)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                My Creations ({sandboxCreations.length})
              </button>
              
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit Sandbox
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedTool ? (
          /* Tool Selection */
          <div>
            <h2 className="text-xl font-semibold mb-6">Choose a Tool to Experiment With</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <motion.button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-left hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-purple-200">{tool.description}</p>
                  <div className="mt-4 text-xs text-green-400 font-medium">
                    ✓ All features unlocked
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Tool View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {tools.find(t => t.id === selectedTool)?.name}
              </h2>
              <button
                onClick={() => setSelectedTool(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tools
              </button>
            </div>
            
            <div id="sandbox-tool-container" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              {selectedTool === 'bloch-sphere' && <BlochSphere />}
              {selectedTool === 'wave-interference' && <WaveInterference />}
              {selectedTool === 'circuit' && <CircuitBuilder />}
              {selectedTool === 'search' && <QuantumSearch />}
              {selectedTool === 'decoherence' && <DecoherenceLab />}
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Save Creation</h3>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="text"
                value={creationName}
                onChange={(e) => setCreationName(e.target.value)}
                placeholder="Give your creation a name..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                autoFocus
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCreation}
                  disabled={!creationName.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creations Panel */}
      <AnimatePresence>
        {showCreations && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-br from-purple-900 to-indigo-900 border-l border-white/20 shadow-2xl z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">My Creations</h3>
                <button
                  onClick={() => setShowCreations(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {sandboxCreations.length === 0 ? (
                <div className="text-center text-white/60 py-12">
                  <Beaker className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No creations yet</p>
                  <p className="text-sm mt-1">Start experimenting and save your work!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sandboxCreations.map((creation) => (
                    <motion.div
                      key={creation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{creation.name}</h4>
                          <p className="text-sm text-purple-300 capitalize">{creation.type.replace('-', ' ')}</p>
                        </div>
                        <button
                          onClick={() => deleteSandboxCreation(creation.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-white/60">
                        {new Date(creation.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
