# Particle Effect System

A comprehensive particle system for Quantum Quest that provides visual feedback for all game events.

## Overview

The particle system consists of three main components:

1. **ParticleEngine** (`lib/particleEngine.ts`) - Core engine with pooling and Canvas rendering
2. **ParticleField** (`components/game/ParticleField.tsx`) - Background ambient particles
3. **ParticleEffect** (`components/game/ParticleEffect.tsx`) - Helper functions for spawning effects
4. **useParticles** (`lib/useParticles.ts`) - React hook for easy integration

## Features

- **High Performance**: Particle pooling prevents garbage collection overhead
- **Canvas Rendering**: Smooth 60 FPS rendering using Canvas API
- **Multiple Effect Types**: 9 different particle effects for various game events
- **Easy Integration**: Simple hook-based API for React components
- **Customizable**: Colors, durations, and intensities can be customized

## Particle Effect Types

### 1. Quantum Foam
Ambient background particles that float around the screen.
- **Use Case**: Background atmosphere in Quantum Realm hub
- **Color**: Cyan (#06b6d4)
- **Duration**: 2000ms

### 2. Probability Cloud
Soft, expanding cloud particles.
- **Use Case**: Superposition visualization, uncertainty representation
- **Color**: Purple (#8b5cf6)
- **Duration**: 1500ms

### 3. Entanglement Beam
Particles that connect two points.
- **Use Case**: Showing entanglement between qubits
- **Color**: Pink (#ec4899)
- **Duration**: 1000ms

### 4. Measurement Collapse
Explosive particles radiating outward.
- **Use Case**: Qubit measurement, wavefunction collapse
- **Color**: Orange (#f59e0b)
- **Duration**: 800ms

### 5. Teleport Trail
Particles with fade effect.
- **Use Case**: Island teleportation, navigation transitions
- **Color**: Blue (#3b82f6)
- **Duration**: 1200ms

### 6. XP Gain
Floating text showing XP amount.
- **Use Case**: XP rewards, quest completion
- **Color**: Green (#10b981)
- **Duration**: 1500ms

### 7. Level Up
Celebratory burst of particles.
- **Use Case**: Level up events
- **Color**: Yellow (#fbbf24)
- **Duration**: 2000ms

### 8. Achievement Unlock
Sparkling particles.
- **Use Case**: Achievement unlocks, milestones
- **Color**: Orange (#f59e0b)
- **Duration**: 2000ms

### 9. Explosion
Explosive particles with gravity.
- **Use Case**: Boss damage, dramatic events
- **Color**: Red (#ef4444)
- **Duration**: 1000ms

## Usage

### Basic Setup

Add the ParticleField to your app root:

```tsx
import { ParticleField } from './components/game/ParticleField';

function App() {
  return (
    <>
      <ParticleField showQuantumFoam={true} />
      {/* Your app content */}
    </>
  );
}
```

### Using the Hook

```tsx
import { useParticles } from '../../lib/useParticles';
import { useRef } from 'react';

function MyComponent() {
  const particles = useParticles();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMeasurement = () => {
    // Spawn particles at button location
    particles.measurementCollapse(buttonRef.current);
  };

  const handleXPGain = () => {
    // Show XP at screen center
    particles.xpGainAtCenter(50);
  };

  return (
    <button ref={buttonRef} onClick={handleMeasurement}>
      Measure Qubit
    </button>
  );
}
```

### Direct Function Calls

```tsx
import {
  spawnMeasurementCollapse,
  spawnXPGain,
  spawnLevelUp
} from './components/game/ParticleEffect';

// Spawn at specific coordinates
spawnMeasurementCollapse(100, 200);
spawnXPGain(150, 250, 50);
spawnLevelUp(200, 300);
```

### Entanglement Beam

```tsx
const particles = useParticles();
const qubit1Ref = useRef<HTMLDivElement>(null);
const qubit2Ref = useRef<HTMLDivElement>(null);

const handleEntangle = () => {
  particles.entanglementBeam(qubit1Ref.current, qubit2Ref.current);
};
```

### Teleportation with Callback

```tsx
const particles = useParticles();

const handleTeleport = () => {
  particles.teleportOut(elementRef.current, () => {
    // Navigate to new island
    navigateToIsland('superposition-island');
    
    // Spawn fade-in effect
    particles.teleportIn(elementRef.current);
  });
};
```

## Hook API Reference

### `useParticles()`

Returns an object with the following methods:

#### `measurementCollapse(element: HTMLElement | null)`
Spawns measurement collapse particles at element center.

#### `entanglementBeam(element1: HTMLElement | null, element2: HTMLElement | null)`
Creates a beam connecting two elements.

#### `xpGain(element: HTMLElement | null, amount: number)`
Shows floating XP text at element.

#### `levelUp(element: HTMLElement | null)`
Spawns level-up celebration at element.

#### `achievementUnlock(element: HTMLElement | null)`
Spawns achievement particles at element.

#### `teleportOut(element: HTMLElement | null, onComplete?: () => void)`
Fade-out effect with optional callback.

#### `teleportIn(element: HTMLElement | null)`
Fade-in effect.

#### `explosion(element: HTMLElement | null, color?: string)`
Explosion effect with optional custom color.

#### `probabilityCloud(element: HTMLElement | null)`
Probability cloud at element.

#### `xpGainAtCenter(amount: number)`
Shows XP at screen center.

#### `levelUpAtCenter()`
Level-up effect at screen center.

#### `screenCenter()`
Returns `{ x, y }` coordinates of screen center.

## Performance

The particle system is optimized for 60 FPS:

- **Particle Pooling**: Reuses particle objects to minimize garbage collection
- **Canvas Rendering**: Hardware-accelerated rendering
- **Automatic Cleanup**: Particles are removed after their lifetime
- **Efficient Updates**: Only active particles are updated

### Performance Targets

- **60 FPS**: Smooth rendering even with 100+ particles
- **< 100ms**: Particle spawn timing (meets requirement 25.1)
- **Low Memory**: Pooling prevents memory leaks

## Integration Examples

### Bloch Sphere Measurement

```tsx
function BlochSphere() {
  const particles = useParticles();
  const sphereRef = useRef<HTMLDivElement>(null);

  const handleMeasure = () => {
    const outcome = measureQubit();
    particles.measurementCollapse(sphereRef.current);
    
    // Award XP
    particles.xpGain(sphereRef.current, 20);
  };

  return (
    <div ref={sphereRef}>
      {/* Bloch sphere visualization */}
      <button onClick={handleMeasure}>Measure</button>
    </div>
  );
}
```

### Quest Completion

```tsx
function QuestLog() {
  const particles = useParticles();

  const handleQuestComplete = (quest: Quest) => {
    // Show XP gain
    particles.xpGainAtCenter(quest.rewards.xp);
    
    // Check for level up
    if (didLevelUp) {
      particles.levelUpAtCenter();
    }
    
    // Check for achievement
    if (quest.rewards.achievementId) {
      particles.achievementUnlock(questCardRef.current);
    }
  };

  return (
    // Quest UI
  );
}
```

### Boss Battle

```tsx
function BossBattle() {
  const particles = useParticles();
  const bossRef = useRef<HTMLDivElement>(null);

  const handleBossDamage = () => {
    particles.explosion(bossRef.current, '#ef4444');
  };

  const handleBossDefeat = () => {
    particles.explosion(bossRef.current, '#fbbf24');
    particles.achievementUnlock(bossRef.current);
    particles.xpGainAtCenter(500);
  };

  return (
    // Boss battle UI
  );
}
```

## Testing

Run tests with:

```bash
npm test ParticleEffect.test.tsx
```

Tests cover:
- Particle spawning
- Lifecycle management
- Multiple particle types
- Performance (particle pooling)

## Requirements Validation

This implementation validates the following requirements:

- **25.1**: Action feedback timing < 100ms ✓
- **25.2**: Measurement triggers collapse animation ✓
- **25.3**: Entanglement triggers beam effects ✓
- **25.4**: XP gain triggers floating numbers ✓
- **25.5**: Teleportation triggers fade effects ✓

## Future Enhancements

Potential improvements:

1. **WebGL Rendering**: For even better performance with 1000+ particles
2. **Particle Textures**: Custom sprites for more detailed effects
3. **Sound Integration**: Sync particles with audio effects
4. **Particle Trails**: Motion blur effects for fast-moving particles
5. **3D Particles**: Three.js integration for 3D particle effects

## Troubleshooting

### Particles not appearing
- Ensure ParticleField is rendered in your app
- Check that canvas is not hidden by z-index
- Verify ParticleEngine is initialized

### Performance issues
- Reduce particle intensity
- Decrease particle duration
- Check for memory leaks (use Chrome DevTools)

### Particles in wrong position
- Ensure element refs are attached
- Check element is mounted before spawning
- Verify getBoundingClientRect() returns valid values
