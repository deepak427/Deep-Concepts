# Game Components

This directory contains game-specific components for the Quantum Quest experience.

## QuantumHub

The main 3D isometric hub world where players navigate between quantum islands.

### Features

- **3D Isometric Projection**: Islands are positioned in 3D space with depth-based scaling
- **Hover Effects**: Display island info including name, NPC, mastery stars, and challenge count
- **Click-to-Teleport**: Navigate to islands by clicking on them
- **Quantum Foam Background**: Animated particle effects create an immersive atmosphere
- **Mastery Glow Aura**: Visual feedback showing progress through glowing effects
- **Responsive Animations**: Smooth entrance, hover, and interaction animations

### Usage

```tsx
import { QuantumHub } from '@/components/game/QuantumHub';

function App() {
  const handleIslandClick = (islandId: string) => {
    // Navigate to island
    navigate(`/island/${islandId}`);
  };

  return <QuantumHub onIslandClick={handleIslandClick} />;
}
```

### Props

- `onIslandClick: (islandId: string) => void` - Callback when an island is clicked

### Island Configuration

Islands are defined with the following properties:

```typescript
interface Island {
  id: string;              // Unique identifier
  name: string;            // Display name
  npcId: string;           // Associated NPC
  color: string;           // Theme color
  glowColor: string;       // Hex color for glow effects
  position: {              // 3D position
    x: number;             // Horizontal (0-100%)
    y: number;             // Vertical (0-100%)
    z: number;             // Depth (negative = further back)
  };
  unlocked: boolean;       // Whether player can access
}
```

### Mastery Stars

Mastery is displayed as 0-5 stars based on module progress:

- 0 stars: 0-19% mastery
- 1 star: 20-39% mastery
- 2 stars: 40-59% mastery
- 3 stars: 60-79% mastery
- 4 stars: 80-94% mastery
- 5 stars: 95-100% mastery

The glow aura intensity increases with mastery level, providing visual feedback.

### Particle Effects

The component includes multiple particle systems:

1. **Quantum Foam**: Small particles that pulse and fade
2. **Floating Particles**: Larger particles that rise from bottom to top
3. **Background Stars**: Twinkling points of light

### Performance

- Particles are optimized with CSS transforms
- Animations use Framer Motion for smooth 60fps performance
- Islands are rendered with z-index based on depth for proper layering

## Other Components

- **GameHUD**: Heads-up display showing XP, level, and quick access buttons
- **NPCDialogue**: Interactive dialogue system with character portraits
- **ParticleEffect**: Individual particle effect component
- **ParticleField**: Particle system manager

## Requirements Validated

This implementation validates the following requirements:

- **21.1**: 3D isometric view of Quantum Realm with floating islands ✓
- **21.2**: Hover displays island name, mastery stars, NPC, and challenge count ✓
- **21.3**: Click triggers teleportation animation and navigation ✓
- **21.4**: Animated particle effects (quantum foam, probability clouds) ✓
- **21.5**: Mastery glow aura proportional to mastery level ✓

## Testing

Run tests with:

```bash
npm test -- QuantumHub.test.tsx
```

See `QuantumHub.example.tsx` for usage examples.


## Particle System

A comprehensive particle effect system providing visual feedback for all game events.

### Features

- **9 Particle Effect Types**: Quantum foam, probability clouds, entanglement beams, measurement collapse, teleport trails, XP gain, level up, achievement unlock, explosions
- **High Performance**: Particle pooling and Canvas rendering for 60 FPS
- **Easy Integration**: React hook (`useParticles`) for simple component integration
- **Customizable**: Colors, durations, and intensities can be configured
- **Automatic Lifecycle**: Particles are automatically cleaned up after their duration

### Usage

```tsx
import { useParticles } from '@/lib/useParticles';
import { ParticleField } from '@/components/game/ParticleField';

function App() {
  return (
    <>
      <ParticleField showQuantumFoam={true} />
      {/* Your app content */}
    </>
  );
}

function MyComponent() {
  const particles = useParticles();
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMeasurement = () => {
    particles.measurementCollapse(elementRef.current);
    particles.xpGain(elementRef.current, 20);
  };

  return (
    <div ref={elementRef}>
      <button onClick={handleMeasurement}>Measure</button>
    </div>
  );
}
```

### Available Effects

- `measurementCollapse(element)` - Explosive particles for qubit measurement
- `entanglementBeam(element1, element2)` - Connecting beam between particles
- `xpGain(element, amount)` - Floating XP text
- `levelUp(element)` - Celebration burst
- `achievementUnlock(element)` - Sparkling particles
- `teleportOut(element, onComplete)` - Fade-out with callback
- `teleportIn(element)` - Fade-in effect
- `explosion(element, color)` - Dramatic explosion
- `probabilityCloud(element)` - Soft expanding cloud
- `xpGainAtCenter(amount)` - XP at screen center
- `levelUpAtCenter()` - Level up at screen center

### Documentation

- `PARTICLE_SYSTEM.md` - Complete particle system documentation
- `PARTICLE_INTEGRATION_GUIDE.md` - Integration examples for all components
- `PARTICLE_IMPLEMENTATION_SUMMARY.md` - Implementation details and testing

### Requirements Validated

- **25.1**: Action feedback timing < 100ms ✓
- **25.2**: Measurement triggers collapse animation ✓
- **25.3**: Entanglement triggers beam effects ✓
- **25.4**: XP gain triggers floating numbers ✓
- **25.5**: Teleportation triggers fade effects ✓

### Testing

Run tests with:

```bash
npm test -- ParticleEffect.test.tsx
```

All 13 tests passing ✓
