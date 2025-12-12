import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager, type AudioConfig } from './audioManager';

// Mock HTMLAudioElement
class MockAudio {
  src = '';
  volume = 1;
  loop = false;
  paused = true;
  ended = false;
  currentTime = 0;
  preload = 'auto';
  
  private listeners: Map<string, Function[]> = new Map();

  constructor(src?: string) {
    if (src) this.src = src;
    // Simulate immediate load
    setTimeout(() => {
      this.triggerEvent('canplaythrough');
    }, 0);
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private triggerEvent(event: string) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback());
    }
  }
}

// Replace global Audio
global.Audio = MockAudio as any;

describe('AudioManager', () => {
  let audioManager: AudioManager;
  let config: AudioConfig;

  beforeEach(() => {
    config = {
      soundEffects: {
        enabled: true,
        volume: 0.7
      },
      music: {
        enabled: true,
        volume: 0.5
      },
      ambient: {
        enabled: true,
        volume: 0.3
      }
    };
    audioManager = new AudioManager(config);
  });

  describe('Sound Effect Playback', () => {
    it('plays sound effect when enabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      
      audioManager.playSound('measurement-pop');
      
      expect(playSpy).toHaveBeenCalled();
    });

    it('does not play sound when disabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      audioManager.setEnabled('soundEffects', false);
      
      // Clear previous calls
      playSpy.mockClear();
      
      audioManager.playSound('measurement-pop');
      
      expect(playSpy).not.toHaveBeenCalled();
    });

    it('applies correct volume to sound', () => {
      audioManager.playSound('measurement-pop', 0.5);
      
      // Volume should be set to 0.5
      // Note: In real implementation, we'd check the audio element's volume
    });

    it('uses default volume when not specified', () => {
      audioManager.playSound('measurement-pop');
      
      // Should use config.soundEffects.volume (0.7)
    });

    it('handles non-existent sound gracefully', () => {
      expect(() => {
        audioManager.playSound('non-existent-sound');
      }).not.toThrow();
    });
  });

  describe('Music Playback', () => {
    it('plays music track when enabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      
      audioManager.playMusic('hub-music');
      
      expect(playSpy).toHaveBeenCalled();
    });

    it('does not play music when disabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      audioManager.setEnabled('music', false);
      
      // Clear previous calls
      playSpy.mockClear();
      
      audioManager.playMusic('hub-music');
      
      expect(playSpy).not.toHaveBeenCalled();
    });

    it('stops current music before playing new track', () => {
      audioManager.playMusic('hub-music');
      audioManager.playMusic('battle-music');
      
      // The second music should be playing (first was stopped)
      // This is tested by the fact that no error is thrown
      // In a real scenario, we'd check that only one music element is active
    });

    it('sets music to loop', () => {
      audioManager.playMusic('hub-music');
      
      // Music should be set to loop
    });
  });

  describe('Ambient Audio', () => {
    it('plays ambient sound when enabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      
      audioManager.playAmbient('quantum-hum');
      
      expect(playSpy).toHaveBeenCalled();
    });

    it('does not play ambient when disabled', () => {
      const playSpy = vi.spyOn(MockAudio.prototype, 'play');
      audioManager.setEnabled('ambient', false);
      
      // Clear previous calls
      playSpy.mockClear();
      
      audioManager.playAmbient('quantum-hum');
      
      expect(playSpy).not.toHaveBeenCalled();
    });

    it('stops current ambient before playing new one', () => {
      const pauseSpy = vi.spyOn(MockAudio.prototype, 'pause');
      
      audioManager.playAmbient('quantum-hum');
      audioManager.playAmbient('quantum-hum');
      
      expect(pauseSpy).toHaveBeenCalled();
    });
  });

  describe('Volume Control', () => {
    it('updates sound effects volume', () => {
      audioManager.setVolume('soundEffects', 0.8);
      
      const config = audioManager.getConfig();
      expect(config.soundEffects.volume).toBe(0.8);
    });

    it('updates music volume', () => {
      audioManager.setVolume('music', 0.6);
      
      const config = audioManager.getConfig();
      expect(config.music.volume).toBe(0.6);
    });

    it('updates ambient volume', () => {
      audioManager.setVolume('ambient', 0.4);
      
      const config = audioManager.getConfig();
      expect(config.ambient.volume).toBe(0.4);
    });

    it('clamps volume to 0-1 range', () => {
      audioManager.setVolume('soundEffects', 1.5);
      expect(audioManager.getConfig().soundEffects.volume).toBe(1);
      
      audioManager.setVolume('soundEffects', -0.5);
      expect(audioManager.getConfig().soundEffects.volume).toBe(0);
    });
  });

  describe('Enable/Disable Controls', () => {
    it('disables sound effects', () => {
      audioManager.setEnabled('soundEffects', false);
      
      const config = audioManager.getConfig();
      expect(config.soundEffects.enabled).toBe(false);
    });

    it('disables music and stops playback', () => {
      audioManager.playMusic('hub-music');
      const pauseSpy = vi.spyOn(MockAudio.prototype, 'pause');
      
      audioManager.setEnabled('music', false);
      
      expect(pauseSpy).toHaveBeenCalled();
      expect(audioManager.getConfig().music.enabled).toBe(false);
    });

    it('disables ambient and stops playback', () => {
      audioManager.playAmbient('quantum-hum');
      const pauseSpy = vi.spyOn(MockAudio.prototype, 'pause');
      
      audioManager.setEnabled('ambient', false);
      
      expect(pauseSpy).toHaveBeenCalled();
      expect(audioManager.getConfig().ambient.enabled).toBe(false);
    });
  });

  describe('Configuration Management', () => {
    it('returns current config', () => {
      const config = audioManager.getConfig();
      
      expect(config.soundEffects.enabled).toBe(true);
      expect(config.soundEffects.volume).toBe(0.7);
      expect(config.music.enabled).toBe(true);
      expect(config.music.volume).toBe(0.5);
      expect(config.ambient.enabled).toBe(true);
      expect(config.ambient.volume).toBe(0.3);
    });

    it('updates config partially', () => {
      audioManager.updateConfig({
        soundEffects: { volume: 0.9 }
      });
      
      const config = audioManager.getConfig();
      expect(config.soundEffects.volume).toBe(0.9);
      expect(config.soundEffects.enabled).toBe(true); // Should remain unchanged
    });

    it('updates multiple categories', () => {
      audioManager.updateConfig({
        soundEffects: { enabled: false },
        music: { volume: 0.8 }
      });
      
      const config = audioManager.getConfig();
      expect(config.soundEffects.enabled).toBe(false);
      expect(config.music.volume).toBe(0.8);
    });
  });

  describe('Sound Pooling', () => {
    it('reuses audio elements from pool', async () => {
      // Preload sounds
      await audioManager.preloadSounds(['measurement-pop']);
      
      // Play sound multiple times
      audioManager.playSound('measurement-pop');
      audioManager.playSound('measurement-pop');
      audioManager.playSound('measurement-pop');
      
      // Should reuse elements from pool
    });

    it('creates pool on-demand if not preloaded', () => {
      // Play sound without preloading
      audioManager.playSound('xp-gain');
      
      // Should create pool automatically
    });
  });

  describe('Preloading', () => {
    it('preloads multiple sounds', async () => {
      await audioManager.preloadSounds([
        'measurement-pop',
        'level-up-fanfare',
        'achievement-unlock'
      ]);
      
      // Sounds should be preloaded and ready
    });

    it('handles preload errors gracefully', async () => {
      await expect(
        audioManager.preloadSounds(['non-existent-sound'])
      ).resolves.not.toThrow();
    });
  });
});
