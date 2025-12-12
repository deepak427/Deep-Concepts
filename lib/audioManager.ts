// Audio Manager for Quantum Quest
// Handles sound effects, music, and ambient audio with pooling

export interface AudioConfig {
  soundEffects: {
    enabled: boolean;
    volume: number; // 0-1
  };
  music: {
    enabled: boolean;
    volume: number; // 0-1
    currentTrack?: string;
  };
  ambient: {
    enabled: boolean;
    volume: number; // 0-1
  };
}

export interface SoundEffect {
  id: string;
  url: string;
  type: 'action' | 'success' | 'error' | 'ambient' | 'music';
  volume?: number; // Override default volume
}

class AudioManager {
  private config: AudioConfig;
  private soundPool: Map<string, HTMLAudioElement[]> = new Map();
  private musicElement: HTMLAudioElement | null = null;
  private ambientElement: HTMLAudioElement | null = null;
  private poolSize = 5; // Number of instances per sound
  private sounds: Map<string, SoundEffect> = new Map();

  constructor(config: AudioConfig) {
    this.config = config;
    this.initializeSounds();
  }

  private initializeSounds() {
    // Define all sound effects
    const soundEffects: SoundEffect[] = [
      // Action sounds
      { id: 'measurement-pop', url: '/sounds/measurement-pop.mp3', type: 'action' },
      { id: 'gate-place', url: '/sounds/gate-place.mp3', type: 'action' },
      { id: 'teleport', url: '/sounds/teleport.mp3', type: 'action' },
      { id: 'click', url: '/sounds/click.mp3', type: 'action' },

      // Success sounds
      { id: 'level-up-fanfare', url: '/sounds/level-up.mp3', type: 'success' },
      { id: 'achievement-unlock', url: '/sounds/achievement.mp3', type: 'success' },
      { id: 'quest-complete', url: '/sounds/quest-complete.mp3', type: 'success' },
      { id: 'boss-defeat', url: '/sounds/boss-defeat.mp3', type: 'success' },
      { id: 'xp-gain', url: '/sounds/xp-gain.mp3', type: 'success' },

      // Error sounds
      { id: 'error', url: '/sounds/error.mp3', type: 'error' },
      { id: 'damage', url: '/sounds/damage.mp3', type: 'error' },

      // Ambient sounds
      { id: 'quantum-hum', url: '/sounds/quantum-hum.mp3', type: 'ambient' },

      // Music
      { id: 'hub-music', url: '/sounds/hub-music.mp3', type: 'music' },
      { id: 'battle-music', url: '/sounds/battle-music.mp3', type: 'music' }
    ];

    soundEffects.forEach(sound => {
      this.sounds.set(sound.id, sound);
    });
  }

  async preloadSounds(soundIds: string[]): Promise<void> {
    const promises = soundIds.map(async (soundId) => {
      const sound = this.sounds.get(soundId);
      if (!sound) {
        console.warn(`Sound ${soundId} not found`);
        return;
      }

      // Create pool of audio elements
      const pool: HTMLAudioElement[] = [];
      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio(sound.url);
        audio.preload = 'auto';

        // Wait for audio to be ready
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('canplaythrough', () => resolve(), { once: true });
          audio.addEventListener('error', () => {
            console.warn(`Failed to load sound: ${soundId}`);
            resolve(); // Don't reject, just continue
          }, { once: true });

          // Timeout after 5 seconds
          setTimeout(() => resolve(), 5000);
        });

        pool.push(audio);
      }

      this.soundPool.set(soundId, pool);
    });

    await Promise.all(promises);
  }

  playSound(soundId: string, volume?: number): void {
    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    // Check if sound effects are enabled
    if (!this.config.soundEffects.enabled && sound.type === 'action') {
      return;
    }

    // Get or create pool
    let pool = this.soundPool.get(soundId);
    if (!pool) {
      // Create pool on-demand if not preloaded
      pool = [];
      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio(sound.url);
        pool.push(audio);
      }
      this.soundPool.set(soundId, pool);
    }

    // Find available audio element
    const audio = pool.find(a => a.paused || a.ended) || pool[0];

    // Set volume
    const finalVolume = volume ?? sound.volume ?? this.config.soundEffects.volume;
    audio.volume = Math.max(0, Math.min(1, finalVolume));

    // Play sound
    audio.currentTime = 0;
    const playPromise = audio.play();

    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Failed to play sound ${soundId}:`, error);
      });
    }
  }

  playMusic(trackId: string, fadeIn = false): void {
    if (!this.config.music.enabled) {
      return;
    }

    const sound = this.sounds.get(trackId);
    if (!sound || sound.type !== 'music') {
      console.warn(`Music track ${trackId} not found`);
      return;
    }

    // Stop current music if playing
    if (this.musicElement) {
      this.stopMusic(!fadeIn); // Fade out if new track is fading in
    }

    // Create new music element
    this.musicElement = new Audio(sound.url);
    this.musicElement.loop = true;
    this.musicElement.volume = fadeIn ? 0 : this.config.music.volume;

    const playPromise = this.musicElement.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Failed to play music ${trackId}:`, error);
      });
    }

    // Fade in if requested
    if (fadeIn) {
      this.fadeVolume(this.musicElement, 0, this.config.music.volume, 1000);
    }

    // Update config
    this.config.music.currentTrack = trackId;
  }

  stopMusic(fadeOut = false): void {
    if (!this.musicElement) {
      return;
    }

    if (fadeOut) {
      this.fadeVolume(this.musicElement, this.musicElement.volume, 0, 1000, () => {
        if (this.musicElement) {
          this.musicElement.pause();
          this.musicElement = null;
        }
      });
    } else {
      this.musicElement.pause();
      this.musicElement = null;
    }

    this.config.music.currentTrack = undefined;
  }

  playAmbient(soundId: string): void {
    if (!this.config.ambient.enabled) {
      return;
    }

    const sound = this.sounds.get(soundId);
    if (!sound || sound.type !== 'ambient') {
      console.warn(`Ambient sound ${soundId} not found`);
      return;
    }

    // Stop current ambient if playing
    if (this.ambientElement) {
      this.ambientElement.pause();
    }

    // Create new ambient element
    this.ambientElement = new Audio(sound.url);
    this.ambientElement.loop = true;
    this.ambientElement.volume = this.config.ambient.volume;

    const playPromise = this.ambientElement.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Failed to play ambient ${soundId}:`, error);
      });
    }
  }

  stopAmbient(): void {
    if (this.ambientElement) {
      this.ambientElement.pause();
      this.ambientElement = null;
    }
  }

  setVolume(category: 'soundEffects' | 'music' | 'ambient', volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.config[category].volume = clampedVolume;

    // Update currently playing audio
    if (category === 'music' && this.musicElement) {
      this.musicElement.volume = clampedVolume;
    }

    if (category === 'ambient' && this.ambientElement) {
      this.ambientElement.volume = clampedVolume;
    }
  }

  setEnabled(category: 'soundEffects' | 'music' | 'ambient', enabled: boolean): void {
    this.config[category].enabled = enabled;

    // Stop currently playing audio if disabled
    if (!enabled) {
      if (category === 'music' && this.musicElement) {
        this.stopMusic();
      }
      if (category === 'ambient' && this.ambientElement) {
        this.stopAmbient();
      }
    }
  }

  getConfig(): AudioConfig {
    return { ...this.config };
  }

  updateConfig(config: {
    soundEffects?: Partial<AudioConfig['soundEffects']>;
    music?: Partial<AudioConfig['music']>;
    ambient?: Partial<AudioConfig['ambient']>;
  }): void {
    if (config.soundEffects) {
      this.config.soundEffects = { ...this.config.soundEffects, ...config.soundEffects };
    }
    if (config.music) {
      this.config.music = { ...this.config.music, ...config.music };
    }
    if (config.ambient) {
      this.config.ambient = { ...this.config.ambient, ...config.ambient };
    }
  }

  private fadeVolume(
    audio: HTMLAudioElement,
    startVolume: number,
    endVolume: number,
    duration: number,
    onComplete?: () => void
  ): void {
    const startTime = Date.now();
    const volumeDelta = endVolume - startVolume;

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      audio.volume = startVolume + volumeDelta * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(fade);
  }
}

// Create singleton instance
const defaultConfig: AudioConfig = {
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

export const audioManager = new AudioManager(defaultConfig);

// Export for testing
export { AudioManager };
