import { useEffect } from 'react';
import { ParticleEngine, ParticleEffect as ParticleEffectType } from '../../lib/particleEngine';

interface ParticleEffectProps {
  effect: ParticleEffectType;
  trigger?: boolean;
}

/**
 * Component for triggering particle effects
 * Use this component to spawn particles in response to game events
 */
export function ParticleEffect({ effect, trigger = true }: ParticleEffectProps) {
  useEffect(() => {
    if (trigger) {
      ParticleEngine.spawn(effect);
    }
  }, [trigger, effect]);

  return null;
}

// Helper functions for common particle effects

export function spawnMeasurementCollapse(x: number, y: number) {
  ParticleEngine.spawn({
    type: 'measurement-collapse',
    position: { x, y },
    color: '#f59e0b',
    intensity: 1
  });
}

export function spawnEntanglementBeam(x1: number, y1: number, x2: number, y2: number) {
  // Spawn particles along the beam path
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    
    setTimeout(() => {
      ParticleEngine.spawn({
        type: 'entanglement-beam',
        position: { x, y },
        color: '#ec4899',
        intensity: 0.5,
        duration: 800
      });
    }, i * 20);
  }
}

export function spawnXPGain(x: number, y: number, amount: number) {
  ParticleEngine.spawn({
    type: 'xp-gain',
    position: { x, y },
    color: '#10b981',
    text: `+${amount} XP`,
    duration: 1500
  });
}

export function spawnLevelUp(x: number, y: number) {
  ParticleEngine.spawn({
    type: 'level-up',
    position: { x, y },
    color: '#fbbf24',
    intensity: 1.5,
    duration: 2000
  });
}

export function spawnAchievementUnlock(x: number, y: number) {
  ParticleEngine.spawn({
    type: 'achievement-unlock',
    position: { x, y },
    color: '#f59e0b',
    intensity: 1.2,
    duration: 2000
  });
}

export function spawnTeleportFadeOut(x: number, y: number, onComplete?: () => void) {
  ParticleEngine.spawn({
    type: 'teleport-trail',
    position: { x, y },
    color: '#3b82f6',
    intensity: 1,
    duration: 600,
    onComplete
  });
}

export function spawnTeleportFadeIn(x: number, y: number) {
  ParticleEngine.spawn({
    type: 'teleport-trail',
    position: { x, y },
    color: '#06b6d4',
    intensity: 1,
    duration: 600
  });
}

export function spawnExplosion(x: number, y: number, color?: string) {
  ParticleEngine.spawn({
    type: 'explosion',
    position: { x, y },
    color: color || '#ef4444',
    intensity: 1,
    duration: 1000
  });
}

export function spawnProbabilityCloud(x: number, y: number) {
  ParticleEngine.spawn({
    type: 'probability-cloud',
    position: { x, y },
    color: '#8b5cf6',
    intensity: 0.8,
    duration: 1500
  });
}
