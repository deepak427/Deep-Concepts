import { useEffect, useCallback } from 'react';
import { audioManager } from './audioManager';
import { useLearningStore } from './learningState';

/**
 * Hook for playing audio with automatic config sync
 */
export function useAudio() {
  const audioConfig = useLearningStore((state) => state.audioConfig);

  // Sync audio manager with config on mount and updates
  useEffect(() => {
    audioManager.updateConfig(audioConfig);
  }, [audioConfig]);

  const playSound = useCallback((soundId: string, volume?: number) => {
    audioManager.playSound(soundId, volume);
  }, []);

  const playMusic = useCallback((trackId: string, fadeIn = false) => {
    audioManager.playMusic(trackId, fadeIn);
  }, []);

  const stopMusic = useCallback((fadeOut = false) => {
    audioManager.stopMusic(fadeOut);
  }, []);

  const playAmbient = useCallback((soundId: string) => {
    audioManager.playAmbient(soundId);
  }, []);

  const stopAmbient = useCallback(() => {
    audioManager.stopAmbient();
  }, []);

  return {
    playSound,
    playMusic,
    stopMusic,
    playAmbient,
    stopAmbient,
    config: audioConfig
  };
}

/**
 * Hook for preloading sounds on component mount
 */
export function usePreloadSounds(soundIds: string[]) {
  useEffect(() => {
    audioManager.preloadSounds(soundIds);
  }, [soundIds]);
}

/**
 * Hook for playing sound on specific events
 */
export function useSoundEffect(soundId: string, trigger: boolean) {
  const { playSound } = useAudio();

  useEffect(() => {
    if (trigger) {
      playSound(soundId);
    }
  }, [trigger, soundId, playSound]);
}
