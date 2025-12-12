import { useCallback } from 'react';
import {
  spawnMeasurementCollapse,
  spawnEntanglementBeam,
  spawnXPGain,
  spawnLevelUp,
  spawnAchievementUnlock,
  spawnTeleportFadeOut,
  spawnTeleportFadeIn,
  spawnExplosion,
  spawnProbabilityCloud
} from '../components/game/ParticleEffect';

/**
 * Hook for spawning particle effects
 * Provides convenient methods for triggering particles from components
 */
export function useParticles() {
  const measurementCollapse = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnMeasurementCollapse(x, y);
  }, []);

  const entanglementBeam = useCallback((
    element1: HTMLElement | null,
    element2: HTMLElement | null
  ) => {
    if (!element1 || !element2) return;
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    spawnEntanglementBeam(x1, y1, x2, y2);
  }, []);

  const xpGain = useCallback((element: HTMLElement | null, amount: number) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnXPGain(x, y, amount);
  }, []);

  const levelUp = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnLevelUp(x, y);
  }, []);

  const achievementUnlock = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnAchievementUnlock(x, y);
  }, []);

  const teleportOut = useCallback((
    element: HTMLElement | null,
    onComplete?: () => void
  ) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnTeleportFadeOut(x, y, onComplete);
  }, []);

  const teleportIn = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnTeleportFadeIn(x, y);
  }, []);

  const explosion = useCallback((
    element: HTMLElement | null,
    color?: string
  ) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnExplosion(x, y, color);
  }, []);

  const probabilityCloud = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnProbabilityCloud(x, y);
  }, []);

  const screenCenter = useCallback(() => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }, []);

  const xpGainAtCenter = useCallback((amount: number) => {
    const { x, y } = screenCenter();
    spawnXPGain(x, y, amount);
  }, [screenCenter]);

  const levelUpAtCenter = useCallback(() => {
    const { x, y } = screenCenter();
    spawnLevelUp(x, y);
  }, [screenCenter]);

  return {
    measurementCollapse,
    entanglementBeam,
    xpGain,
    levelUp,
    achievementUnlock,
    teleportOut,
    teleportIn,
    explosion,
    probabilityCloud,
    xpGainAtCenter,
    levelUpAtCenter,
    screenCenter
  };
}
