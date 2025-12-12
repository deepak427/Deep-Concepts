import { useState } from 'react';
import { Settings, Volume2, VolumeX, Monitor, Smartphone, Trash2, Download } from 'lucide-react';
import { PixelCard } from '@/components/shared/PixelCard';
import { PixelButton } from '@/components/shared/PixelButton';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useLearningStore } from '@/lib/learningState';
import { persistenceService } from '@/lib/persistence';

export function SettingsView() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'auto'>('dark');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const reducedMotion = useReducedMotion();
  const { xp, level, achievements } = useLearningStore();

  const handleResetProgress = () => {
    if (showResetConfirm) {
      // Clear localStorage
      persistenceService.clear();
      // Reload the page to reset the app state
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const handleExportProgress = () => {
    const data = persistenceService.load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24">
      <div className="container space-y-8">
        <PixelCard variant="glow" padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Settings className="w-8 h-8 text-quantum-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-quantum-400 uppercase tracking-widest">
                Settings
              </h1>
              <p className="text-slate-400">Customize your quantum learning experience</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Audio Settings */}
            <PixelCard variant="elevated" padding="md">
              <h3 className="font-display text-energy-400 text-lg mb-4 uppercase tracking-wider">
                Audio
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <span className="text-slate-300">Sound Effects</span>
                  </div>
                  <PixelButton
                    variant={audioEnabled ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? 'ON' : 'OFF'}
                  </PixelButton>
                </div>
              </div>
            </PixelCard>

            {/* Display Settings */}
            <PixelCard variant="elevated" padding="md">
              <h3 className="font-display text-energy-400 text-lg mb-4 uppercase tracking-wider">
                Display
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Theme</span>
                  <div className="flex gap-2">
                    <PixelButton
                      variant={theme === 'dark' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      <Monitor className="w-4 h-4" />
                      Dark
                    </PixelButton>
                    <PixelButton
                      variant={theme === 'auto' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setTheme('auto')}
                    >
                      <Smartphone className="w-4 h-4" />
                      Auto
                    </PixelButton>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Reduced Motion</span>
                  <span className={`text-sm ${reducedMotion ? 'text-energy-400' : 'text-slate-500'}`}>
                    {reducedMotion ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Performance Settings */}
            <PixelCard variant="elevated" padding="md">
              <h3 className="font-display text-energy-400 text-lg mb-4 uppercase tracking-wider">
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Particle Effects</span>
                  <PixelButton variant="primary" size="sm">
                    HIGH
                  </PixelButton>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Animation Quality</span>
                  <PixelButton variant="primary" size="sm">
                    HIGH
                  </PixelButton>
                </div>
              </div>
            </PixelCard>

            {/* Data Settings */}
            <PixelCard variant="elevated" padding="md">
              <h3 className="font-display text-energy-400 text-lg mb-4 uppercase tracking-wider">
                Data Management
              </h3>
              
              {/* Current Progress Summary */}
              <div className="mb-4 p-3 bg-void-950 border border-void-700 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Level:</span>
                  <span className="text-energy-400 font-display">{level}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">XP:</span>
                  <span className="text-quantum-400 font-display">{xp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Achievements:</span>
                  <span className="text-synapse-400 font-display">{achievements.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <PixelButton 
                  variant="secondary" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleExportProgress}
                >
                  <Download className="w-4 h-4" />
                  Export Progress
                </PixelButton>
                
                <PixelButton 
                  variant={showResetConfirm ? "primary" : "secondary"}
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleResetProgress}
                >
                  <Trash2 className="w-4 h-4" />
                  {showResetConfirm ? "CONFIRM RESET" : "Reset Progress"}
                </PixelButton>
                
                {showResetConfirm && (
                  <div className="text-xs text-slate-500 text-center p-2 bg-void-950 border border-red-500/30">
                    ⚠️ This will permanently delete all progress!<br/>
                    Click "CONFIRM RESET" again to proceed.
                  </div>
                )}
              </div>
            </PixelCard>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}