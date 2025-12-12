# Module Content Structure

This directory contains the comprehensive module content definitions for the quantum computing learning application.

## Files

### `modules.ts`
The main module content file containing:
- **Learning objectives**: What students should be able to do after completing the module
- **Required interactions**: Interactive simulations that must be completed
- **Retrieval practice questions**: Active recall exercises after micro-sections
- **Challenge definitions**: Specific challenges within interactive simulations
- **Achievement unlock conditions**: Criteria for unlocking achievements

### `legacy.ts`
Backward compatibility layer that converts the new `ModuleContent` format to the legacy `ModuleData` format.

### `circuitPuzzles.ts`
Specific puzzle definitions for the circuit builder interactive simulation.

### `index.ts`
Central export point for all constants.

## Usage

### Importing Module Content

```typescript
// New code - use the comprehensive module content
import { MODULE_CONTENT, getModuleContent } from '@/constants/modules';

const module = getModuleContent('bits-qubits');
console.log(module.learningObjectives);
console.log(module.requiredInteractions);
```

### Backward Compatibility

```typescript
// Legacy code - still works
import { MODULES } from '@/constants';

const modules = MODULES; // Array of ModuleData
```

## Module Content Structure

Each module contains:

```typescript
interface ModuleContent {
  id: ModuleId;
  title: string;
  shortTitle: string;
  description: string;
  learningObjectives: string[];        // NEW: What students should learn
  keyTakeaways: string[];
  requiredInteractions: string[];      // NEW: Must complete to finish module
  interactiveSimulations: InteractiveSimulation[];  // NEW: Available simulations
  retrievalPractice: RetrievalQuestion[];          // NEW: Active recall questions
  quiz: QuizData;
}
```

## Interactive Simulations

Each simulation can have multiple challenges:

```typescript
interface InteractiveSimulation {
  id: string;
  type: 'bloch-sphere' | 'wave-interference' | 'entanglement' | 'circuit-builder' | 'quantum-search' | 'decoherence-lab' | 'application-classifier';
  config?: Record<string, unknown>;
  challenges?: Challenge[];
}

interface Challenge {
  id: string;
  description: string;
  xpReward: number;
  achievementId?: string;  // Optional achievement to unlock
}
```

## Retrieval Practice

Questions for active recall after micro-sections:

```typescript
interface RetrievalQuestion {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'prediction' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  conceptId: string;  // For tracking which concepts need review
}
```

## XP Rewards

Standard XP rewards for different activities:

```typescript
const XP_REWARDS = {
  MODULE_COMPLETION: 100,
  QUIZ_CORRECT: 20,
  SIMULATION_COMPLETE: 30,
  REVIEW_SESSION: 25,
  CONFIDENCE_MATCH_BONUS: 10
};
```

## Achievement Conditions

Defines when achievements should be unlocked:

```typescript
const ACHIEVEMENT_CONDITIONS = {
  'first-collapse': {
    type: 'interaction-count',
    interactionId: 'measurement-challenge',
    count: 1
  },
  'perfect-mastery': {
    type: 'module-mastery',
    moduleId: 'any',
    masteryLevel: 100
  },
  // ... more conditions
};
```

## Helper Functions

### `getModuleContent(moduleId: ModuleId): ModuleContent | undefined`
Get complete module content by ID.

### `getRequiredInteractions(moduleId: ModuleId): string[]`
Get list of required interaction IDs for a module.

### `getModuleChallenges(moduleId: ModuleId): Challenge[]`
Get all challenges across all simulations in a module.

### `getRetrievalQuestions(moduleId: ModuleId): RetrievalQuestion[]`
Get all retrieval practice questions for a module.

## Adding New Modules

1. Add the module ID to the `ModuleId` type in `types.ts`
2. Add the complete module content to `MODULE_CONTENT` in `modules.ts`
3. Define learning objectives (what students should be able to do)
4. List required interactions (IDs of simulations that must be completed)
5. Create retrieval practice questions for key concepts
6. Define challenges with XP rewards
7. Map achievement unlock conditions if applicable

## Design Principles

- **Learning objectives** are action-oriented (students should be able to...)
- **Required interactions** ensure hands-on practice with core concepts
- **Retrieval practice** reinforces learning through active recall
- **Challenges** provide clear goals and immediate feedback
- **Achievement conditions** are specific and measurable
