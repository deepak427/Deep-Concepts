# Design Document

## Overview

This design transforms the DeepConcepts Quantum Computing application into "Quantum Quest" - an immersive adventure game where learning happens through exploration, NPC interactions, quests, and boss battles. The system combines evidence-based learning science with game design principles to create an experience where users master quantum computing by playing, not studying.

The architecture maintains the existing React + TypeScript + Vite foundation while adding:
- **Game Layer**: 3D isometric Quantum Realm hub, NPC system, quest management, boss battles
- **Visual Effects**: Comprehensive particle system, animations, transitions, and audio
- **Learning Core**: Centralized state management (Zustand), XP/mastery systems, spaced repetition
- **Quantum Simulations**: Three.js for 3D visualizations, Canvas for 2D experiments
- **Game Systems**: Inventory, collectibles, power-ups, sandbox mode

The design prioritizes "show, don't tell" - users learn by doing, experimenting, and discovering rather than reading text.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                   Game Shell (HUD)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  XP & Level  │  │  Quest Log   │  │  Inventory   │  │
│  │     Bar      │  │    Button    │  │    Button    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Game View Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Quantum Realm Hub (3D Isometric)                │  │
│  │  • Floating Islands                              │  │
│  │  • NPCs with Dialogue                            │  │
│  │  • Particle Effects                              │  │
│  │  • Teleportation System                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Island View (Challenge/Quest Area)              │  │
│  │  • NPC Interactions                              │  │
│  │  • Quantum Experiments                           │  │
│  │  • Boss Battles                                  │  │
│  │  • Sandbox Mode                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Game State (Zustand)                        │
│  • Explorer Progress  • Quest Status                    │
│  • XP & Levels        • Island Mastery                  │
│  • Achievements       • NPC Relationships               │
│  • Inventory          • Unlocked Areas                  │
│  • Review Queue       • Boss Defeats                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Persistence Layer                           │
│  • localStorage (primary)                               │
│  • Optional backend service (future)                    │
└─────────────────────────────────────────────────────────┘
```

### Component Organization

```
src/
├── components/
│   ├── game/                  # Game-specific components
│   │   ├── QuantumHub.tsx     # 3D isometric hub world
│   │   ├── GameHUD.tsx        # Heads-up display
│   │   ├── NPCDialogue.tsx    # NPC interaction system
│   │   ├── QuestLog.tsx       # Quest tracking UI
│   │   ├── Inventory.tsx      # Inventory system
│   │   ├── ParticleField.tsx  # Particle effect system
│   │   ├── BossBar.tsx        # Boss battle UI
│   │   └── TeleportEffect.tsx # Transition animations
│   ├── learning/              # Generic learning components
│   │   ├── Quiz.tsx
│   │   ├── ConfidenceRating.tsx
│   │   ├── XPBar.tsx
│   │   ├── LevelUpModal.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── MasteryIndicator.tsx
│   │   ├── ReviewCard.tsx
│   │   └── FeedbackMessage.tsx
│   ├── quantum/               # Quantum-specific visualizations
│   │   ├── BlochSphere.tsx
│   │   ├── WaveInterference.tsx
│   │   ├── EntanglementPair.tsx
│   │   ├── CircuitBuilder.tsx
│   │   ├── QuantumSearch.tsx
│   │   ├── DilutionFridge.tsx
│   │   └── DecoherenceLab.tsx
│   ├── islands/               # Island-specific views
│   │   ├── SuperpositionIsland.tsx
│   │   ├── EntanglementValley.tsx
│   │   ├── CircuitCity.tsx
│   │   ├── AlgorithmTemple.tsx
│   │   └── CryogenicCaverns.tsx
│   └── shared/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Tooltip.tsx
├── lib/
│   ├── gameState.ts           # Zustand store (game + learning)
│   ├── xpSystem.ts            # XP calculations
│   ├── achievementSystem.ts   # Achievement logic
│   ├── masteryCalculator.ts   # Mastery stars (1-5)
│   ├── reviewScheduler.ts     # Spaced repetition
│   ├── questSystem.ts         # Quest management
│   ├── npcSystem.ts           # NPC dialogue & relationships
│   ├── particleEngine.ts      # Particle effect engine
│   ├── audioManager.ts        # Sound effects & music
│   └── persistence.ts         # localStorage wrapper
├── types/
│   ├── game.ts                # Game-specific types
│   ├── learning.ts            # Generic learning types
│   └── quantum.ts             # Quantum-specific types
└── constants/
    ├── islands.ts             # Island definitions (replaces modules)
    ├── npcs.ts                # NPC data & dialogue
    ├── quests.ts              # Quest definitions
    ├── achievements.ts        # Achievement definitions
    ├── bosses.ts              # Boss battle configurations
    └── levels.ts              # Level thresholds & titles
```

## Components and Interfaces

### Game Systems

#### Quantum Realm Hub (3D Isometric World)

**Technology:** CSS 3D transforms or lightweight Three.js scene

**Features:**
- Isometric projection of floating islands
- Click-to-teleport navigation
- Hover effects showing island info
- Animated particle background (quantum foam)
- Dynamic lighting based on mastery
- Smooth camera transitions

**Implementation Approach:**
```typescript
interface HubIslandView {
  island: Island;
  position3D: { x: number; y: number; z: number };
  rotation: number;
  scale: number;
  glowIntensity: number; // Based on mastery
}

function renderHub(islands: Island[], cameraPosition: Vector3) {
  // Convert 3D positions to 2D isometric coordinates
  // Apply parallax for depth
  // Render islands back-to-front
  // Add particle effects
  // Handle click detection
}
```

#### NPC Dialogue System

**Features:**
- Animated dialogue boxes with character portraits
- Typewriter text effect
- Dialogue choices with branching
- Relationship tracking
- Context-aware responses based on progress

**Dialogue Flow:**
```typescript
interface DialogueManager {
  currentNPC: NPC;
  currentDialogue: NPCDialogue;
  dialogueHistory: string[];
  
  startConversation(npcId: string): void;
  selectChoice(choiceIndex: number): void;
  endConversation(): void;
  getAvailableDialogue(npcId: string, state: GameState): NPCDialogue;
}
```

#### Quest System

**Features:**
- Quest log UI accessible from HUD
- Quest tracking with visual indicators
- Objective completion notifications
- Reward distribution
- Quest prerequisites and unlocking

**Quest Management:**
```typescript
interface QuestManager {
  activeQuests: Quest[];
  
  startQuest(questId: string): void;
  completeObjective(questId: string, objectiveId: string): void;
  completeQuest(questId: string): void;
  trackQuest(questId: string): void;
  checkPrerequisites(questId: string, state: GameState): boolean;
}
```

#### Boss Battle System

**Features:**
- Health bars for Explorer and Boss
- Turn-based challenge system
- Attack animations
- Victory/defeat conditions
- Dramatic visual effects

**Battle Flow:**
```typescript
interface BossBattleManager {
  battle: BossBattle;
  
  startBattle(bossId: string): void;
  presentChallenge(): Challenge;
  processChallengeResult(correct: boolean): void;
  applyDamage(target: 'explorer' | 'boss', amount: number): void;
  checkBattleEnd(): 'victory' | 'defeat' | 'ongoing';
  endBattle(result: 'victory' | 'defeat'): void;
}
```

#### Particle Effect Engine

**Features:**
- Multiple particle types (foam, clouds, beams, explosions)
- Pooling for performance
- Configurable colors, sizes, durations
- Trigger-based spawning
- Canvas or WebGL rendering

**Particle System:**
```typescript
interface ParticleEngine {
  activeParticles: Particle[];
  particlePool: Particle[];
  
  spawn(effect: ParticleEffect): void;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  clear(): void;
}

interface Particle {
  type: ParticleEffectType;
  position: Vector2;
  velocity: Vector2;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}
```

#### Inventory System

**Features:**
- Grid-based inventory UI
- Item categories and filtering
- Drag-and-drop item management
- Item tooltips with descriptions
- Active effect indicators
- Item usage and consumption

**Inventory Management:**
```typescript
interface InventoryManager {
  inventory: Inventory;
  
  addItem(item: InventoryItem): boolean;
  removeItem(itemId: string, quantity: number): boolean;
  useItem(itemId: string): void;
  equipCosmetic(itemId: string): void;
  getActiveEffects(): ActiveEffect[];
  checkEffect(effectType: string): boolean;
}
```

#### Audio Manager

**Features:**
- Sound effect playback with pooling
- Background music with crossfading
- Ambient audio loops
- Volume controls per category
- Spatial audio for 3D effects (optional)

**Audio System:**
```typescript
interface AudioManager {
  config: AudioConfig;
  soundPool: Map<string, HTMLAudioElement[]>;
  
  playSound(soundId: string, volume?: number): void;
  playMusic(trackId: string, fadeIn?: boolean): void;
  stopMusic(fadeOut?: boolean): void;
  setVolume(category: 'soundEffects' | 'music' | 'ambient', volume: number): void;
  preloadSounds(soundIds: string[]): Promise<void>;
}
```

### Learning State Management

**Zustand Store Structure:**

```typescript
interface GameState {
  // Explorer Profile
  explorerProfile: {
    name?: string;
    startingIsland: string;
    onboardingCompleted: boolean;
    tutorialCompleted: boolean;
    tutorialStep: number;
  };
  
  // Progress Tracking
  xp: number;
  level: number;
  achievements: Achievement[];
  
  // Island Progress (replaces modules)
  islands: {
    [islandId: string]: {
      unlocked: boolean;
      masteryStars: 0 | 1 | 2 | 3 | 4 | 5;
      challengesCompleted: string[];
      quizResults: QuizResult[];
      confidenceRatings: ConfidenceRating[];
      selfRating: number; // 1-5
      lastVisited: Date;
      bossDefeated: boolean;
    };
  };
  
  // Quest System
  activeQuests: Quest[];
  completedQuests: string[];
  trackedQuestId?: string;
  
  // NPC System
  npcRelationships: { [npcId: string]: number };
  npcDialogueHistory: { [npcId: string]: string[] };
  
  // Boss Battles
  defeatedBosses: string[];
  currentBossBattle?: BossBattle;
  
  // Inventory
  inventory: Inventory;
  
  // World State
  currentLocation: 'hub' | string;
  unlockedAreas: string[];
  discoveredSecrets: string[];
  
  // Review System
  reviewQueue: ReviewItem[];
  
  // Sandbox
  sandboxUnlocked: boolean;
  sandboxCreations: SandboxCreation[];
  
  // Audio
  audioConfig: AudioConfig;
  
  // Actions - Learning
  addXP: (amount: number, source: string) => void;
  unlockAchievement: (id: string) => void;
  updateIslandMastery: (islandId: string) => void;
  addToReviewQueue: (item: ReviewItem) => void;
  completeChallenge: (islandId: string, challengeId: string) => void;
  
  // Actions - Game
  teleportToIsland: (islandId: string) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  updateNPCRelationship: (npcId: string, delta: number) => void;
  startBossBattle: (bossId: string) => void;
  endBossBattle: (victory: boolean) => void;
  addInventoryItem: (item: InventoryItem) => void;
  useInventoryItem: (itemId: string) => void;
  unlockArea: (areaId: string) => void;
  saveSandboxCreation: (creation: SandboxCreation) => void;
}
```

### XP System

**XP Award Structure:**
- Module completion: 100 XP
- Correct quiz answer: 20 XP
- Interactive simulation completion: 30 XP
- Circuit puzzle solved: 50 XP
- Prediction challenge correct: 40 XP
- Review session completed: 25 XP
- Perfect confidence match: +10 XP bonus

**Level Progression:**
```typescript
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Classical Thinker' },
  { level: 2, xp: 200, title: 'Qubit Explorer' },
  { level: 3, xp: 500, title: 'Superposition Apprentice' },
  { level: 4, xp: 900, title: 'Entanglement Adept' },
  { level: 5, xp: 1400, title: 'Gate Master' },
  { level: 6, xp: 2000, title: 'Algorithm Architect' },
  { level: 7, xp: 2700, title: 'Quantum Engineer' },
  { level: 8, xp: 3500, title: 'Quantum Theorist' }
];
```

### Achievement System

**Achievement Categories:**

1. **Interaction Achievements**
   - "First Collapse" - Measure your first qubit
   - "Collapsed 100 Qubits" - Measure 100 times
   - "Circuit Architect" - Build 10 circuits
   - "Perfect Prediction" - Correctly predict 5 superposition outcomes

2. **Mastery Achievements**
   - "Entanglement Adept" - Complete Entanglement module with 100% mastery
   - "Perfect Mastery" - Achieve 100% mastery in any module
   - "Quantum Scholar" - Achieve 80%+ mastery in all modules

3. **Challenge Achievements**
   - "Amplitude Amplifier" - Beat classical search average
   - "Circuit Puzzle Master" - Solve all circuit puzzles
   - "Myth Buster" - Perfect score on Entanglement myths

4. **Persistence Achievements**
   - "Dedicated Learner" - Visit 5 days in a row
   - "Review Champion" - Complete 20 review sessions

### Mastery Calculation (Star System)

**Mastery is now represented as 1-5 stars instead of percentages for better game feel.**

```typescript
function calculateMasteryStars(islandData: IslandProgress): 0 | 1 | 2 | 3 | 4 | 5 {
  const weights = {
    challengesCompleted: 0.4,  // 40%
    quizAccuracy: 0.3,         // 30%
    confidenceAccuracy: 0.2,   // 20%
    selfRating: 0.1            // 10%
  };
  
  const challengeScore = 
    (islandData.challengesCompleted.length / totalChallenges) * 100;
  
  const quizScore = 
    (correctAnswers / totalQuestions) * 100;
  
  const confidenceScore = 
    calculateConfidenceAccuracy(islandData.confidenceRatings);
  
  const selfRatingScore = 
    (islandData.selfRating / 5) * 100;
  
  const totalScore = (
    challengeScore * weights.challengesCompleted +
    quizScore * weights.quizAccuracy +
    confidenceScore * weights.confidenceAccuracy +
    selfRatingScore * weights.selfRating
  );
  
  // Convert percentage to stars
  if (totalScore < 20) return 0;
  if (totalScore < 40) return 1;
  if (totalScore < 60) return 2;
  if (totalScore < 80) return 3;
  if (totalScore < 95) return 4;
  return 5; // Perfect mastery
}
```

## Data Models

### Core Types

```typescript
// Learning Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'interaction' | 'mastery' | 'challenge' | 'persistence';
}

interface QuizResult {
  questionId: string;
  correct: boolean;
  confidenceLevel?: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface ReviewItem {
  moduleId: string;
  conceptId: string;
  reason: 'incorrect' | 'low-confidence' | 'spaced-repetition';
  priority: number;
  nextReviewDate: Date;
}

interface ConfidenceRating {
  questionId: string;
  level: 'low' | 'medium' | 'high';
  wasCorrect: boolean;
}

// Quantum Types
interface QubitState {
  theta: number;  // Polar angle (0 to π)
  phi: number;    // Azimuthal angle (0 to 2π)
}

interface QuantumGate {
  type: 'X' | 'H' | 'Z' | 'CNOT' | 'S' | 'T';
  targetQubit: number;
  controlQubit?: number;  // For CNOT
}

interface QuantumCircuit {
  numQubits: number;
  gates: Array<{
    gate: QuantumGate;
    position: number;  // Step in circuit
  }>;
}

interface MeasurementResult {
  outcome: 0 | 1;
  probability: number;
}
```

### Module Content Structure

```typescript
interface ModuleContent {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  
  sections: Section[];
  
  interactiveSimulations: InteractiveSimulation[];
  
  retrievalPractice: RetrievalQuestion[];
  
  quiz: Quiz;
  
  requiredInteractions: string[];  // IDs of interactions needed for completion
}

interface InteractiveSimulation {
  id: string;
  type: 'bloch-sphere' | 'wave-interference' | 'entanglement' | 'circuit-builder' | 'quantum-search' | 'decoherence-lab';
  config: any;  // Simulation-specific configuration
  challenges?: Challenge[];
}

interface Challenge {
  id: string;
  description: string;
  targetCondition: (state: any) => boolean;
  xpReward: number;
  achievementId?: string;
}
```

### Game-Specific Data Models

```typescript
// NPC System
interface NPC {
  id: string;
  name: string;
  title: string;
  personality: 'enthusiastic' | 'mysterious' | 'challenging' | 'wise' | 'grumpy';
  islandId: string;
  portraitUrl: string;
  idleAnimation: string;
  relationshipLevel: number; // 0-100
}

interface NPCDialogue {
  npcId: string;
  text: string;
  choices?: DialogueChoice[];
  condition?: (state: GameState) => boolean;
  onComplete?: (state: GameState) => void;
}

interface DialogueChoice {
  text: string;
  nextDialogueId?: string;
  unlockQuestId?: string;
  requirementCheck?: (state: GameState) => boolean;
}

// Quest System
interface Quest {
  id: string;
  title: string;
  description: string;
  npcId: string;
  islandId: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'main' | 'side' | 'daily' | 'hidden';
  prerequisites?: string[]; // Quest IDs that must be completed first
}

interface QuestObjective {
  id: string;
  description: string;
  type: 'experiment' | 'puzzle' | 'boss' | 'collect' | 'discover';
  targetId: string; // ID of the challenge/item/area
  completed: boolean;
}

interface QuestReward {
  xp: number;
  items?: InventoryItem[];
  unlocksIsland?: string;
  unlocksBoss?: string;
  achievementId?: string;
}

// Island System
interface Island {
  id: string;
  name: string;
  theme: string; // e.g., "Superposition Island", "Entanglement Valley"
  description: string;
  npcId: string;
  position: { x: number; y: number; z: number }; // 3D position in hub
  masteryStars: 0 | 1 | 2 | 3 | 4 | 5;
  unlocked: boolean;
  challenges: Challenge[];
  bossId?: string;
  particleEffect: ParticleEffectType;
  glowColor: string; // Hex color for mastery aura
}

// Boss Battle System
interface Boss {
  id: string;
  name: string;
  title: string; // e.g., "The Measurement Monster"
  islandId: string;
  health: number;
  maxHealth: number;
  attacks: BossAttack[];
  weaknesses: string[]; // Challenge types that deal extra damage
  defeatReward: QuestReward;
  portraitUrl: string;
  animationSet: string;
}

interface BossAttack {
  name: string;
  damage: number;
  description: string;
  animationType: string;
}

interface BossBattle {
  bossId: string;
  explorerHealth: number;
  explorerMaxHealth: number;
  bossHealth: number;
  currentChallenge?: Challenge;
  challengesCompleted: number;
  active: boolean;
}

// Inventory System
interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'particle' | 'power-up' | 'cosmetic' | 'tool';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  quantity: number;
  effect?: ItemEffect;
}

interface ItemEffect {
  type: 'xp-boost' | 'hint' | 'skip-challenge' | 'reveal-hidden';
  duration?: number; // milliseconds, if temporary
  magnitude?: number; // e.g., 1.5 for 50% XP boost
}

interface Inventory {
  items: InventoryItem[];
  maxSlots: number;
  activeEffects: ActiveEffect[];
}

interface ActiveEffect {
  itemId: string;
  effect: ItemEffect;
  startTime: Date;
  endTime?: Date;
}

// Particle System
type ParticleEffectType = 
  | 'quantum-foam'
  | 'probability-cloud'
  | 'entanglement-beam'
  | 'measurement-collapse'
  | 'teleport-trail'
  | 'xp-gain'
  | 'level-up'
  | 'achievement-unlock';

interface ParticleEffect {
  type: ParticleEffectType;
  position: { x: number; y: number; z?: number };
  color: string;
  duration: number;
  intensity: number;
  onComplete?: () => void;
}

// Audio System
interface AudioConfig {
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

interface SoundEffect {
  id: string;
  url: string;
  type: 'action' | 'success' | 'error' | 'ambient' | 'music';
  volume?: number; // Override default volume
}

// Game State (extends Learning State)
interface GameState extends LearningState {
  // Explorer Info
  explorerName?: string;
  avatarCosmetics: string[]; // IDs of equipped cosmetic items
  
  // World State
  currentLocation: 'hub' | string; // 'hub' or island ID
  islands: { [islandId: string]: Island };
  unlockedAreas: string[];
  
  // NPC Relationships
  npcRelationships: { [npcId: string]: number }; // 0-100
  npcDialogueHistory: { [npcId: string]: string[] }; // Dialogue IDs seen
  
  // Quest Progress
  activeQuests: Quest[];
  completedQuests: string[]; // Quest IDs
  trackedQuestId?: string; // Currently tracked quest
  
  // Boss Progress
  defeatedBosses: string[]; // Boss IDs
  currentBossBattle?: BossBattle;
  
  // Inventory
  inventory: Inventory;
  
  // Sandbox Mode
  sandboxUnlocked: boolean;
  sandboxCreations: SandboxCreation[];
  
  // Audio Settings
  audioConfig: AudioConfig;
  
  // Tutorial
  tutorialCompleted: boolean;
  tutorialStep: number;
}

interface SandboxCreation {
  id: string;
  name: string;
  type: 'circuit' | 'experiment' | 'visualization';
  data: any; // Type-specific data
  createdAt: Date;
  thumbnail?: string; // Base64 image
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

Before defining properties, I've analyzed the requirements to eliminate redundancy:

**Consolidations:**
- Multiple feedback consistency properties (10.3, 10.4, 10.5, 14.1-14.4, 18.3-18.5) can be consolidated into a single comprehensive feedback property
- XP award properties (3.5, 5.5, 6.5, 9.1) can be consolidated into one XP consistency property
- Achievement unlocking properties (9.5, 12.5) can be consolidated
- State persistence properties (10.2, 11.3, 13.4, 15.1) can be consolidated
- Review queue management properties (11.1, 11.4, 13.3) can be consolidated

**Unique Properties Retained:**
- Mathematical correctness properties (3.3, 5.3) are unique to their domains
- Measurement and correlation properties (2.3, 4.2, 4.3) are unique quantum behaviors
- Mastery calculation (12.1) is a complex formula requiring dedicated testing
- Round-trip persistence (15.2) is distinct from general persistence

### Correctness Properties

Property 1: Onboarding data persistence
*For any* valid onboarding completion data (user profile and self-assessment results), storing it in Learning State should result in that exact data being retrievable from the state.
**Validates: Requirements 1.4**

Property 2: Profile-based personalization
*For any* user profile type (developer, student, founder, researcher), the micro-copy generation function should return distinct, profile-specific text that differs from other profile types.
**Validates: Requirements 1.5**

Property 3: Qubit rotation updates state
*For any* valid rotation input (mouse drag or touch gesture), the qubit state angles (theta, phi) should update proportionally to the input delta, remaining within valid ranges (theta: 0 to π, phi: 0 to 2π).
**Validates: Requirements 2.2**

Property 4: Measurement produces binary outcome
*For any* qubit state, performing a measurement should produce exactly one outcome: either 0 or 1, never both, never neither, and never any other value.
**Validates: Requirements 2.3**

Property 5: Histogram matches measurements
*For any* sequence of measurement outcomes, the histogram data structure should contain counts that exactly sum to the total number of measurements, with each outcome count matching the number of times that outcome occurred.
**Validates: Requirements 2.4**

Property 6: Wave parameter updates are reactive
*For any* phase adjustment to wave parameters, the wave visualization data should update synchronously, with the new phase value reflected in the wave calculation before the next render.
**Validates: Requirements 3.2**

Property 7: Wave superposition is mathematically correct
*For any* two wave functions with amplitudes A1, A2 and phases φ1, φ2, the combined wave amplitude at any point should equal A1·sin(x + φ1) + A2·sin(x + φ2), and the resulting probability should equal the square of the combined amplitude.
**Validates: Requirements 3.3**

Property 8: Correct predictions award XP consistently
*For any* correct prediction, challenge solution, or quiz answer, XP should be awarded according to the defined XP table, with the user's total XP increasing by exactly the specified amount.
**Validates: Requirements 3.5, 5.5, 6.5, 9.1**

Property 9: Bell state creates perfect correlation
*For any* initial qubit states, creating a Bell state should result in two qubits where measuring one qubit determines the other qubit's measurement outcome with 100% correlation (either perfectly correlated or perfectly anti-correlated depending on Bell state type).
**Validates: Requirements 4.2**

Property 10: Entangled measurements are correlated
*For any* entangled qubit pair and any measurement of qubit A, the subsequent measurement of qubit B should produce an outcome that maintains the correlation defined by the entanglement type (e.g., for Bell state |Φ+⟩, if A=0 then B=0, if A=1 then B=1).
**Validates: Requirements 4.3**

Property 11: Correlation statistics are accurate
*For any* set of measurement pairs (A_i, B_i), the correlation statistic should equal the number of matching pairs divided by total pairs, and this calculated value should match the displayed correlation percentage.
**Validates: Requirements 4.4**

Property 12: Gate placement updates circuit
*For any* valid gate placement (gate type, target qubit, position), adding the gate to the circuit should result in the circuit's gate array containing that gate at the specified position, and removing it should restore the previous state.
**Validates: Requirements 5.2**

Property 13: Quantum gate transformations are correct
*For any* quantum circuit and initial state, applying each gate in sequence should transform the state according to the gate's unitary matrix: X flips |0⟩↔|1⟩, H creates equal superposition, Z adds phase, CNOT flips target if control is |1⟩.
**Validates: Requirements 5.3**

Property 14: Circuit validation matches target state
*For any* user-constructed circuit and target state, the validation function should return true if and only if applying the circuit to the initial state produces a final state that matches the target state within numerical precision (ε < 0.001).
**Validates: Requirements 5.4**

Property 15: Classical search guess count is accurate
*For any* classical search session, the recorded guess count should exactly equal the number of box clicks made before finding the marked item.
**Validates: Requirements 6.2**

Property 16: Quantum search has better average performance
*For any* marked item position and sufficient number of trials (n ≥ 20), the average number of quantum search iterations should be less than or equal to √N (where N is the search space size), which is less than the classical average of N/2.
**Validates: Requirements 6.4**

Property 17: Achievement unlocking is consistent
*For any* achievement condition being met (e.g., 100% mastery, beating classical search, solving all puzzles), the achievement should be unlocked exactly once, added to the user's achievement list, and remain unlocked permanently.
**Validates: Requirements 6.5, 9.5, 12.5**

Property 18: Decoherence is proportional to parameters
*For any* decoherence parameters (temperature T, noise N, time t), the qubit state fidelity should decrease monotonically as any parameter increases, with fidelity F(T2, N, t) < F(T1, N, t) when T2 > T1.
**Validates: Requirements 7.4**

Property 19: Feedback is always provided
*For any* user answer (quiz, classification, scenario question), feedback should be provided immediately, with the feedback text being non-empty and appropriate to the answer correctness and confidence level.
**Validates: Requirements 7.5, 8.3, 10.3, 10.4, 10.5, 14.1, 14.2, 14.3, 14.4, 18.3, 18.4, 18.5**

Property 20: Classification mechanics work for all cards
*For any* scenario card, the user should be able to classify it into exactly one of the three categories ("Quantum can help a lot", "Quantum could help but complicated", "Quantum will not help much"), and the classification should be recorded in the user's state.
**Validates: Requirements 8.2**

Property 21: Streak counting is accurate
*For any* sequence of classification answers, the streak count should equal the length of the longest consecutive subsequence of correct answers ending at the current position, resetting to 0 after any incorrect answer.
**Validates: Requirements 8.4**

Property 22: Misconception detection identifies related concepts
*For any* set of incorrect classification answers, the misconception detection function should return a non-empty list of module IDs where each module ID corresponds to a concept related to at least one incorrect answer.
**Validates: Requirements 8.5**

Property 23: Level calculation matches threshold table
*For any* XP amount, the calculated level should be the highest level L where XP ≥ threshold(L), and should never exceed the maximum defined level.
**Validates: Requirements 9.2**

Property 24: Level titles map correctly
*For any* level number, the displayed level title should exactly match the title defined in the level threshold table for that level number.
**Validates: Requirements 9.3**

Property 25: Profile data display is accurate
*For any* user state, the profile display should show XP, level, and next level threshold values that exactly match the values in the learning state, with no rounding errors or stale data.
**Validates: Requirements 9.4**

Property 26: Confidence and correctness are both stored
*For any* quiz answer submission that includes a confidence rating, both the answer correctness (boolean) and confidence level (low/medium/high) should be stored in the quiz results array with matching timestamps.
**Validates: Requirements 10.2**

Property 27: Review queue management is consistent
*For any* incorrect answer, low-confidence answer, or low self-rating, a review item should be added to the review queue with appropriate priority, and should be removed only when the user demonstrates improved understanding on that concept.
**Validates: Requirements 11.1, 11.4, 13.3**

Property 28: Review section displays queue items
*For any* non-empty review queue, the Review section should display questions corresponding to items in the queue, prioritized by the priority field, with higher priority items appearing first.
**Validates: Requirements 11.2**

Property 29: State updates reflect completed reviews
*For any* completed review question, the learning state should be updated to reflect the new performance data, and the mastery level for the associated module should be recalculated.
**Validates: Requirements 11.3**

Property 30: Spaced repetition scheduling is time-based
*For any* module completed more than T days ago (where T is the spaced repetition interval), that module should appear in the spaced repetition suggestions list if the user has not reviewed it since completion.
**Validates: Requirements 11.5**

Property 31: Mastery calculation follows defined formula
*For any* module progress data (interactions completed, quiz results, confidence ratings, self-rating), the calculated mastery percentage should equal the weighted sum: 40% × (interactions/total) + 30% × (correct/total) + 20% × confidenceAccuracy + 10% × (selfRating/5), clamped to [0, 100].
**Validates: Requirements 12.1**

Property 32: Displayed mastery matches calculated value
*For any* module, the mastery percentage displayed in the UI should exactly match the value returned by the mastery calculation function for that module's current state.
**Validates: Requirements 12.2**

Property 33: Completion requires 70% mastery
*For any* module, the completion status should be true if and only if all required interactions are completed AND the mastery level is at least 70%.
**Validates: Requirements 12.3**

Property 34: Low mastery triggers suggestions
*For any* module with mastery level below 70%, the system should generate at least one suggestion identifying a specific section or interactive simulation to revisit.
**Validates: Requirements 12.4**

Property 35: Self-rating affects review personalization
*For any* self-rating data collected across modules, the Review section content should be influenced by this data, with modules having lower self-ratings appearing more frequently in review suggestions.
**Validates: Requirements 13.4, 13.5**

Property 36: Negative language is avoided in feedback
*For any* incorrect answer, the feedback text should not contain negative phrases from a predefined blocklist (e.g., "wrong", "incorrect", "failed"), and should instead use encouraging phrases from an approved list.
**Validates: Requirements 14.1**

Property 37: Progress events trigger positive feedback
*For any* progress event (module completion, level up, achievement unlock, streak milestone), positive feedback should be displayed with specific details about what the user accomplished.
**Validates: Requirements 14.3, 14.4**

Property 38: Return after absence shows welcome message
*For any* user session starting more than 24 hours after the previous session, a welcome-back message should be displayed acknowledging the user's return.
**Validates: Requirements 14.5**

Property 39: State changes persist to localStorage
*For any* learning state mutation (XP change, achievement unlock, module progress update), the updated state should be serialized and written to localStorage before the mutation function returns.
**Validates: Requirements 15.1**

Property 40: State restoration is a round-trip
*For any* learning state, serializing it to localStorage and then deserializing it should produce a state object that is deeply equal to the original state (all fields match, including nested objects and arrays).
**Validates: Requirements 15.2**

Property 41: localStorage errors are handled gracefully
*For any* localStorage operation that throws an error (quota exceeded, unavailable, security error), the system should catch the error, log it, and continue functioning with in-memory state without crashing.
**Validates: Requirements 15.3, 15.4**

Property 42: Section completion provides visual feedback
*For any* section completion event, visual feedback should be displayed within 100ms, including at least one of: progress bar update, checkmark animation, or success message.
**Validates: Requirements 16.5**

Property 43: Retrieval questions appear after micro-sections
*For any* micro-section completion, a retrieval practice question should be presented before allowing navigation to the next section, unless the user has already answered a question for that micro-section in the current session.
**Validates: Requirements 18.1**

Property 44: Question types are varied
*For any* set of 10 consecutive retrieval practice questions, at least 2 different question types (multiple choice, drag-and-drop, prediction, etc.) should be used.
**Validates: Requirements 18.2**

Property 45: Keyboard navigation works for interactive elements
*For any* interactive element (button, input, draggable item, clickable card), keyboard navigation should allow focusing the element with Tab, activating it with Enter or Space, and navigating away with Tab or Shift+Tab.
**Validates: Requirements 20.1**

Property 46: ARIA labels exist for content
*For any* content element that conveys information visually (icon, chart, animation, color-coded status), an appropriate ARIA label or aria-describedby attribute should exist providing equivalent text information.
**Validates: Requirements 20.2**

Property 47: Color contrast meets WCAG standards
*For any* text and background color combination used in the UI, the contrast ratio should be at least 4.5:1 for normal text or 3:1 for large text (18pt+ or 14pt+ bold), as measured by the WCAG 2.1 formula.
**Validates: Requirements 20.3**

Property 48: Reduced motion preference is respected
*For any* animation or transition, if the user's prefers-reduced-motion setting is "reduce", the animation duration should be reduced to ≤100ms or the animation should be replaced with an instant state change.
**Validates: Requirements 20.4**

### Game-Specific Properties

Property 49: Island hover displays complete information
*For any* island in the Quantum Realm hub, hovering over it should display all required information: island name, mastery stars (0-5), NPC name, and challenge count, with no missing fields.
**Validates: Requirements 21.2**

Property 50: Island click triggers navigation
*For any* unlocked island, clicking it should trigger a teleportation animation and navigate to that island's view, updating the current location in game state.
**Validates: Requirements 21.3**

Property 51: Mastery glow intensity correlates with stars
*For any* island with mastery stars > 0, the glow intensity should be proportional to the mastery level, with 5 stars producing maximum glow and 1 star producing minimum glow.
**Validates: Requirements 21.5**

Property 52: NPC arrival displays character
*For any* island, arriving at that island should display the island's NPC with their character portrait and idle animation.
**Validates: Requirements 22.1**

Property 53: NPC dialogue reflects personality
*For any* NPC dialogue, the text should contain personality-specific language patterns that distinguish it from other NPCs' dialogue (e.g., Dr. Qubit uses enthusiastic language, Entangla uses mysterious language).
**Validates: Requirements 22.2**

Property 54: Challenge completion updates NPC dialogue
*For any* NPC, the available dialogue after completing a challenge should differ from the dialogue before completion, reflecting the Explorer's progress.
**Validates: Requirements 22.3**

Property 55: Dialogue choices affect unlocks
*For any* dialogue choice that specifies an unlock condition, selecting that choice should unlock the specified challenge or quest.
**Validates: Requirements 22.4**

Property 56: High mastery triggers special dialogue
*For any* island with 5 mastery stars, the NPC should have at least one special dialogue option that acknowledges the Explorer's expertise.
**Validates: Requirements 22.5**

Property 57: Quest cards contain complete information
*For any* quest, the quest card should display all required fields: objective description, XP reward, difficulty (1-5), and any item rewards.
**Validates: Requirements 23.1**

Property 58: Quest log displays all active quests
*For any* game state with active quests, the quest log should display all quests in the activeQuests array, with no quests missing or duplicated.
**Validates: Requirements 23.2**

Property 59: Quest objective completion provides timely feedback
*For any* quest objective completion, visual feedback (particle effects) and audio feedback should be triggered within 100ms.
**Validates: Requirements 23.3**

Property 60: Quest completion awards specified rewards
*For any* completed quest, the Explorer should receive exactly the XP, items, and unlocks specified in the quest's reward definition.
**Validates: Requirements 23.4**

Property 61: Only one quest can be tracked
*For any* game state, at most one quest ID should be stored in trackedQuestId, and setting a new tracked quest should replace the previous one.
**Validates: Requirements 23.5**

Property 62: Boss unlocks at mastery threshold
*For any* island with a boss, the boss battle should become available when the island's mastery stars reach the required threshold (typically 3+ stars).
**Validates: Requirements 24.1**

Property 63: Boss battle damage is consistent
*For any* correct challenge answer during a boss battle, the boss's health should decrease by the damage amount specified for that challenge type.
**Validates: Requirements 24.3**

Property 64: Explorer damage is consistent
*For any* incorrect challenge answer during a boss battle, the Explorer's health should decrease by the damage amount specified in the boss's attack.
**Validates: Requirements 24.4**

Property 65: Boss defeat awards specified rewards
*For any* defeated boss, the Explorer should receive the XP, achievement, and items specified in the boss's defeatReward definition.
**Validates: Requirements 24.5**

Property 66: Action feedback timing is consistent
*For any* Explorer action (measurement, gate placement, quest completion), particle effects should spawn within 100ms of the action.
**Validates: Requirements 25.1**

Property 67: Measurement triggers collapse animation
*For any* qubit measurement, a collapse particle effect should be spawned at the qubit's position.
**Validates: Requirements 25.2**

Property 68: Entanglement triggers beam effects
*For any* entanglement creation, beam particle effects should connect the two entangled particles.
**Validates: Requirements 25.3**

Property 69: XP gain triggers floating numbers
*For any* XP gain event, floating number particles should spawn showing the XP amount and animate upward.
**Validates: Requirements 25.4**

Property 70: Teleportation triggers fade effects
*For any* island teleportation, fade-out and fade-in particle effects should be triggered in sequence.
**Validates: Requirements 25.5**

Property 71: HUD XP bar animates on gain
*For any* XP gain, the XP bar in the HUD should animate from the old value to the new value with a smooth transition.
**Validates: Requirements 26.3**

Property 72: Level-up triggers HUD notification
*For any* level increase, a level-up notification should appear in the HUD with celebration particle effects.
**Validates: Requirements 26.4**

Property 73: Challenge HUD doesn't obscure view
*For any* active challenge, the challenge information displayed in the HUD should not overlap with the main interactive area (measured by bounding box intersection).
**Validates: Requirements 26.5**

Property 74: Item collection adds to inventory
*For any* collectible item, collecting it should add it to the inventory with the correct quantity, or increment the quantity if it already exists.
**Validates: Requirements 27.1**

Property 75: Inventory groups items by category
*For any* inventory with multiple items, items should be grouped such that all items of the same category appear together in the display.
**Validates: Requirements 27.2**

Property 76: Power-up usage applies effect
*For any* power-up item, using it should create an active effect entry with the correct effect type, magnitude, and duration.
**Validates: Requirements 27.3**

Property 77: Cosmetic equip updates avatar
*For any* cosmetic item, equipping it should add its ID to the avatarCosmetics array and trigger an avatar re-render.
**Validates: Requirements 27.4**

Property 78: Hidden area discovery grants items
*For any* hidden area, discovering it should add at least one item to the inventory with rarity ≥ 'rare'.
**Validates: Requirements 27.5**

Property 79: Sandbox unlocks all tools
*For any* game state in sandbox mode, all quantum tools and visualizations should be accessible regardless of the Explorer's progress in normal mode.
**Validates: Requirements 28.1**

Property 80: Sandbox removes objectives
*For any* game state in sandbox mode, no quest objectives, timers, or performance metrics should be active or displayed.
**Validates: Requirements 28.2**

Property 81: Sandbox creations can be saved
*For any* sandbox creation, saving it should add it to the sandboxCreations array with a unique ID and timestamp.
**Validates: Requirements 28.3**

Property 82: Sandbox simulations match normal mode
*For any* quantum simulation (e.g., qubit measurement, gate application), the result in sandbox mode should match the result in normal mode for the same input parameters.
**Validates: Requirements 28.4**

Property 83: Sandbox exit preserves progress
*For any* game state, entering and exiting sandbox mode should not modify XP, level, achievements, island progress, or quest status.
**Validates: Requirements 28.5**

Property 84: Starting island choice awards bonus
*For any* starting island selection during onboarding, the Explorer should receive a starting bonus (XP or item) specific to that island.
**Validates: Requirements 29.5**

Property 85: Action sound timing is consistent
*For any* Explorer action with an associated sound effect, the sound should play within 50ms of the action.
**Validates: Requirements 30.2**

Property 86: Measurement plays pop sound
*For any* qubit measurement, the "measurement-pop" sound effect should be played.
**Validates: Requirements 30.3**

Property 87: Level-up plays fanfare sound
*For any* level increase, the "level-up-fanfare" sound effect should be played.
**Validates: Requirements 30.4**

## Error Handling

### localStorage Errors

**Strategy:** Graceful degradation with in-memory fallback

```typescript
class PersistenceService {
  private inMemoryState: LearningState | null = null;
  
  save(state: LearningState): void {
    try {
      localStorage.setItem('learning-state', JSON.stringify(state));
    } catch (error) {
      console.warn('localStorage unavailable, using in-memory storage', error);
      this.inMemoryState = state;
    }
  }
  
  load(): LearningState | null {
    try {
      const data = localStorage.getItem('learning-state');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('localStorage read failed, using in-memory storage', error);
      return this.inMemoryState;
    }
  }
}
```

### Quantum Simulation Errors

**Strategy:** Validate inputs and provide fallback visualizations

```typescript
function simulateQubitMeasurement(state: QubitState): MeasurementResult {
  // Validate state
  if (state.theta < 0 || state.theta > Math.PI) {
    console.error('Invalid theta, using default');
    state.theta = Math.PI / 2;
  }
  
  // Calculate probability with numerical stability
  const prob1 = Math.pow(Math.sin(state.theta / 2), 2);
  const clampedProb = Math.max(0, Math.min(1, prob1));
  
  // Perform measurement
  const outcome = Math.random() < clampedProb ? 1 : 0;
  
  return { outcome, probability: clampedProb };
}
```

### User Input Validation

**Strategy:** Validate early, provide clear feedback

```typescript
function validateCircuitPlacement(
  gate: QuantumGate,
  circuit: QuantumCircuit,
  position: number
): ValidationResult {
  // Check qubit bounds
  if (gate.targetQubit >= circuit.numQubits) {
    return {
      valid: false,
      message: 'Target qubit is out of range. This circuit has only ' + 
               circuit.numQubits + ' qubits.'
    };
  }
  
  // Check CNOT control qubit
  if (gate.type === 'CNOT' && gate.controlQubit === gate.targetQubit) {
    return {
      valid: false,
      message: 'Control and target qubits must be different.'
    };
  }
  
  return { valid: true };
}
```

### Network Errors (Future Backend)

**Strategy:** Retry with exponential backoff, fallback to localStorage

```typescript
async function syncToBackend(state: LearningState): Promise<void> {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(state)
      });
      return;
    } catch (error) {
      attempt++;
      if (attempt === maxRetries) {
        console.warn('Backend sync failed, data saved locally only');
        return;
      }
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

## Testing Strategy

### Dual Testing Approach

This project requires both unit testing and property-based testing to ensure correctness:

**Unit Tests** verify:
- Specific examples and edge cases
- UI component rendering
- Integration between components
- Error handling paths

**Property-Based Tests** verify:
- Universal properties across all inputs
- Mathematical correctness
- State management consistency
- Data transformation correctness

### Property-Based Testing Framework

**Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference its design document property with format: `// Feature: interactive-quantum-learning, Property N: [property text]`

**Example Property Test:**

```typescript
import fc from 'fast-check';

// Feature: interactive-quantum-learning, Property 4: Measurement produces binary outcome
test('qubit measurement always produces 0 or 1', () => {
  fc.assert(
    fc.property(
      fc.record({
        theta: fc.float({ min: 0, max: Math.PI }),
        phi: fc.float({ min: 0, max: 2 * Math.PI })
      }),
      (state) => {
        const result = simulateQubitMeasurement(state);
        return result.outcome === 0 || result.outcome === 1;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: interactive-quantum-learning, Property 7: Wave superposition is mathematically correct
test('wave superposition calculation is correct', () => {
  fc.assert(
    fc.property(
      fc.record({
        A1: fc.float({ min: 0, max: 1 }),
        A2: fc.float({ min: 0, max: 1 }),
        phi1: fc.float({ min: 0, max: 2 * Math.PI }),
        phi2: fc.float({ min: 0, max: 2 * Math.PI }),
        x: fc.float({ min: 0, max: 2 * Math.PI })
      }),
      ({ A1, A2, phi1, phi2, x }) => {
        const expected = A1 * Math.sin(x + phi1) + A2 * Math.sin(x + phi2);
        const actual = calculateWaveSuperposition(A1, A2, phi1, phi2, x);
        return Math.abs(actual - expected) < 0.0001;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Framework:** Vitest (already compatible with Vite)

**Test Organization:**
```
src/
├── components/
│   ├── learning/
│   │   ├── Quiz.test.tsx
│   │   ├── XPBar.test.tsx
│   │   └── ...
│   └── quantum/
│       ├── BlochSphere.test.tsx
│       ├── CircuitBuilder.test.tsx
│       └── ...
├── lib/
│   ├── xpSystem.test.ts
│   ├── masteryCalculator.test.ts
│   └── ...
```

**Example Unit Tests:**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateLevel } from './xpSystem';

describe('XP System', () => {
  it('calculates correct level for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });
  
  it('calculates correct level for 200 XP', () => {
    expect(calculateLevel(200)).toBe(2);
  });
  
  it('never exceeds maximum level', () => {
    expect(calculateLevel(999999)).toBe(8);
  });
});

describe('Mastery Calculator', () => {
  it('returns 0 for no progress', () => {
    const mastery = calculateMastery({
      interactionsCompleted: [],
      quizResults: [],
      confidenceRatings: [],
      selfRating: 0
    });
    expect(mastery).toBe(0);
  });
  
  it('returns 100 for perfect progress', () => {
    const mastery = calculateMastery({
      interactionsCompleted: ['all', 'interactions'],
      quizResults: [{ correct: true }, { correct: true }],
      confidenceRatings: [
        { level: 'high', wasCorrect: true },
        { level: 'high', wasCorrect: true }
      ],
      selfRating: 5
    });
    expect(mastery).toBe(100);
  });
});
```

### Integration Testing

**Focus Areas:**
- Onboarding flow → Learning state persistence
- Module completion → XP award → Level up
- Quiz answer → Confidence rating → Review queue
- Circuit builder → Validation → Achievement unlock

**Example Integration Test:**

```typescript
describe('Module Completion Flow', () => {
  it('completes module and awards XP when mastery threshold met', async () => {
    const { user, store } = setupTest();
    
    // Complete all interactions
    await user.completeInteraction('bits-qubits', 'bloch-sphere');
    await user.completeInteraction('bits-qubits', 'measurement-challenge');
    
    // Answer quiz correctly
    await user.answerQuiz('bits-qubits', { correct: true, confidence: 'high' });
    
    // Provide self-rating
    await user.provideSelfRating('bits-qubits', 4);
    
    // Verify module completion
    const state = store.getState();
    expect(state.modules['bits-qubits'].completed).toBe(true);
    expect(state.modules['bits-qubits'].masteryLevel).toBeGreaterThanOrEqual(70);
    expect(state.xp).toBeGreaterThan(0);
  });
});
```

### Visual Regression Testing (Optional)

For critical visualizations (Bloch Sphere, Circuit Builder), consider visual regression tests using Playwright or Chromatic to catch rendering issues.

### Performance Testing

**Targets:**
- Bloch Sphere rendering: 60 FPS
- Circuit simulation: < 100ms for circuits up to 10 gates
- State persistence: < 50ms
- Page load: < 2s on 3G connection

### Accessibility Testing

**Tools:**
- axe-core for automated WCAG checks
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS)

**Checklist:**
- [ ] All interactive elements keyboard accessible
- [ ] All images have alt text
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Focus indicators visible
- [ ] ARIA labels on custom components
- [ ] Reduced motion respected

## Implementation Notes

### Three.js Integration for Bloch Sphere

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createBlochSphere(container: HTMLElement): BlochSphereController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  // Create sphere
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4a9eff,
    transparent: true,
    opacity: 0.3
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  
  // Create state vector arrow
  const arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    1,
    0xff0000,
    0.2,
    0.1
  );
  scene.add(arrowHelper);
  
  // Add controls
  const controls = new OrbitControls(camera, renderer.domElement);
  
  return {
    updateState(theta: number, phi: number) {
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      arrowHelper.setDirection(new THREE.Vector3(x, y, z));
    },
    render() {
      renderer.render(scene, camera);
    }
  };
}
```

### Zustand Store Setup

```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useLearningStore = create(
  persist<LearningState>(
    (set, get) => ({
      // Initial state
      userProfile: {
        type: 'student',
        onboardingCompleted: false,
        selfAssessmentScore: 0
      },
      xp: 0,
      level: 1,
      achievements: [],
      modules: {},
      reviewQueue: [],
      
      // Actions
      addXP: (amount, source) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > state.level;
        
        return {
          xp: newXP,
          level: newLevel,
          // Trigger level-up modal if needed
        };
      }),
      
      unlockAchievement: (id) => set((state) => {
        if (state.achievements.find(a => a.id === id)) {
          return state; // Already unlocked
        }
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        return {
          achievements: [...state.achievements, {
            ...achievement,
            unlockedAt: new Date()
          }]
        };
      }),
      
      updateModuleMastery: (moduleId) => set((state) => {
        const moduleData = state.modules[moduleId];
        const mastery = calculateMastery(moduleData);
        return {
          modules: {
            ...state.modules,
            [moduleId]: {
              ...moduleData,
              masteryLevel: mastery,
              completed: mastery >= 70 && 
                         moduleData.interactionsCompleted.length >= 
                         REQUIRED_INTERACTIONS[moduleId].length
            }
          }
        };
      })
    }),
    {
      name: 'learning-state',
      getStorage: () => localStorage
    }
  )
);
```

### Framer Motion Animation Patterns

```typescript
// Level-up modal
const levelUpVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

// XP gain animation
const xpGainVariants = {
  initial: { y: 0, opacity: 1 },
  animate: {
    y: -50,
    opacity: 0,
    transition: { duration: 1 }
  }
};

// Achievement unlock
const achievementVariants = {
  hidden: { x: 300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};
```

### Accessibility Implementation

```typescript
// Reduced motion hook
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

// Usage in components
function AnimatedComponent() {
  const reducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.5
      }}
    />
  );
}
```

This design provides a comprehensive blueprint for transforming the quantum computing educational site into a deeply interactive, gamified learning experience grounded in evidence-based learning science principles.
