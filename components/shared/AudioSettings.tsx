import { Volume2, VolumeX, Music, Radio } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import { audioManager } from '@/lib/audioManager';
import { useEffect } from 'react';

export function AudioSettings() {
  const { audioConfig, updateAudioConfig } = useLearningStore();

  // Sync audio manager with config
  useEffect(() => {
    audioManager.updateConfig(audioConfig);
  }, [audioConfig]);

  const handleVolumeChange = (
    category: 'soundEffects' | 'music' | 'ambient',
    volume: number
  ) => {
    updateAudioConfig({
      [category]: { volume }
    });
    audioManager.setVolume(category, volume);
  };

  const handleToggle = (
    category: 'soundEffects' | 'music' | 'ambient',
    enabled: boolean
  ) => {
    updateAudioConfig({
      [category]: { enabled }
    });
    audioManager.setEnabled(category, enabled);
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Audio Settings
      </h2>

      {/* Sound Effects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {audioConfig.soundEffects.enabled ? (
              <Volume2 className="w-5 h-5 text-blue-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">
              Sound Effects
            </span>
          </div>
          <button
            onClick={() =>
              handleToggle('soundEffects', !audioConfig.soundEffects.enabled)
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              audioConfig.soundEffects.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label="Toggle sound effects"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                audioConfig.soundEffects.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {audioConfig.soundEffects.enabled && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
              {Math.round(audioConfig.soundEffects.volume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={audioConfig.soundEffects.volume * 100}
              onChange={(e) =>
                handleVolumeChange('soundEffects', parseInt(e.target.value) / 100)
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              aria-label="Sound effects volume"
            />
          </div>
        )}
      </div>

      {/* Music */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className={`w-5 h-5 ${
              audioConfig.music.enabled ? 'text-purple-500' : 'text-gray-400'
            }`} />
            <span className="font-medium text-gray-900 dark:text-white">
              Music
            </span>
          </div>
          <button
            onClick={() => handleToggle('music', !audioConfig.music.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              audioConfig.music.enabled ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            aria-label="Toggle music"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                audioConfig.music.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {audioConfig.music.enabled && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
              {Math.round(audioConfig.music.volume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={audioConfig.music.volume * 100}
              onChange={(e) =>
                handleVolumeChange('music', parseInt(e.target.value) / 100)
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              aria-label="Music volume"
            />
          </div>
        )}
      </div>

      {/* Ambient Audio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 ${
              audioConfig.ambient.enabled ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="font-medium text-gray-900 dark:text-white">
              Ambient Audio
            </span>
          </div>
          <button
            onClick={() => handleToggle('ambient', !audioConfig.ambient.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              audioConfig.ambient.enabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
            aria-label="Toggle ambient audio"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                audioConfig.ambient.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {audioConfig.ambient.enabled && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
              {Math.round(audioConfig.ambient.volume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={audioConfig.ambient.volume * 100}
              onChange={(e) =>
                handleVolumeChange('ambient', parseInt(e.target.value) / 100)
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              aria-label="Ambient audio volume"
            />
          </div>
        )}
      </div>

      {/* Test Sounds */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Test sounds:
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => audioManager.playSound('measurement-pop')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Measurement
          </button>
          <button
            onClick={() => audioManager.playSound('level-up-fanfare')}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
          >
            Level Up
          </button>
          <button
            onClick={() => audioManager.playSound('xp-gain')}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            XP Gain
          </button>
        </div>
      </div>
    </div>
  );
}
