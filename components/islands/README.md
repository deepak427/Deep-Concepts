# Island Components

Island-specific views for the Quantum Quest game. Each island represents a quantum computing concept and includes:

- **NPC Integration**: Each island has a unique NPC character with personality-driven dialogue
- **Quest System**: Quests guide the Explorer through learning objectives
- **Interactive Challenges**: Quantum simulations and experiments specific to the island's theme
- **Particle Effects**: Visual feedback for actions and achievements
- **Mastery Tracking**: Progress visualization with star ratings

## Islands

### SuperpositionIsland
- **Theme**: Wave interference and probability amplitudes
- **NPC**: Dr. Qubit (enthusiastic quantum physicist)
- **Challenges**: Wave interference lab, prediction challenges
- **Color Scheme**: Purple/Blue gradient
- **Module**: `superposition`

### EntanglementValley
- **Theme**: Quantum correlation and Bell states
- **NPC**: Entangla (mysterious quantum mystic)
- **Challenges**: Bell state creation, myth vs reality cards
- **Color Scheme**: Pink/Purple gradient
- **Module**: `entanglement`

### CircuitCity
- **Theme**: Quantum gates and circuit building
- **NPC**: Circuit Master (challenging gate architect)
- **Challenges**: Circuit puzzles (3 difficulty levels)
- **Color Scheme**: Blue/Cyan gradient
- **Module**: `gates`

### AlgorithmTemple
- **Theme**: Quantum algorithms and search
- **NPC**: The Oracle (wise algorithm sage)
- **Challenges**: Classical vs quantum search, Grover's algorithm
- **Color Scheme**: Violet/Purple gradient
- **Module**: `algorithm`

### CryogenicCaverns
- **Theme**: Quantum hardware and decoherence
- **NPC**: Hardware Harry (grumpy hardware engineer)
- **Challenges**: Dilution fridge tour, decoherence lab
- **Color Scheme**: Cyan/Blue gradient
- **Module**: `hardware`

## Usage

```tsx
import { SuperpositionIsland } from '@/components/islands';

function App() {
  return <SuperpositionIsland />;
}
```

## Integration Points

Each island integrates with:

1. **Learning State** (`useLearningStore`): Tracks progress, XP, and mastery
2. **Particle System** (`useParticles`): Visual effects for actions
3. **NPC System** (`NPCDialogue`): Character interactions
4. **Quest System** (`QuestTracker`): Quest management
5. **Quantum Components**: Reusable simulations from `components/quantum`

## Design Patterns

### Consistent Structure
All islands follow the same layout:
- Header with island name and mastery stars
- Quest tracker
- NPC dialogue section (left column)
- Interactive challenge area (right column)
- Learning objectives footer

### Accessibility
- Keyboard navigation support
- ARIA labels for interactive elements
- Reduced motion support via `useReducedMotion`
- Focus indicators on all interactive elements

### Performance
- Lazy loading of heavy quantum components
- Particle effect pooling
- Optimized Three.js rendering (where applicable)
- Responsive design for mobile/tablet/desktop

## Particle Effects

Each island spawns themed particle effects:
- **SuperpositionIsland**: `xp-gain` (green)
- **EntanglementValley**: `entanglement-beam` (pink)
- **CircuitCity**: `achievement-unlock` (blue)
- **AlgorithmTemple**: `probability-cloud` (violet)
- **CryogenicCaverns**: `quantum-foam` (cyan)

## Future Enhancements

- Boss battles for each island
- Hidden areas and secrets
- Island-specific collectibles
- Dynamic weather/atmosphere effects
- Multiplayer co-op challenges
