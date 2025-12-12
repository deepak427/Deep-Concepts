# Learning System Library

This directory contains the core learning state management system for the DeepConcepts Quantum Computing application.

## Overview

The learning system provides gamification, progress tracking, and personalized learning features through a centralized state management approach using Zustand.

## Modules

### `learningState.ts`
The main Zustand store that manages all learning-related state including:
- User profile and onboarding status
- XP and level progression
- Achievement tracking
- Module progress and mastery levels
- Review queue for spaced repetition
- Session tracking

**Key Actions:**
- `addXP(amount, source)` - Award XP and handle level-ups
- `unlockAchievement(id)` - Unlock achievement badges
- `completeInteraction(moduleId, interactionId)` - Track completed interactions
- `recordQuizResult(moduleId, result)` - Record quiz performance
- `updateModuleMastery(moduleId)` - Recalculate mastery percentage
- `addToReviewQueue(item)` - Add concepts for review
- `completeOnboarding(profile)` - Set user profile

### `xpSystem.ts`
XP and leveling system with progressive thresholds:
- 8 levels from "Classical Thinker" to "Quantum Theorist"
- XP rewards for different activities (quiz, interactions, challenges)
- Level calculation and progression tracking

**Key Functions:**
- `calculateLevel(xp)` - Determine level from XP amount
- `getLevelTitle(level)` - Get title for a level
- `getNextLevelThreshold(level)` - Get XP needed for next level

### `achievementSystem.ts`
Achievement definitions and unlock logic:
- 12 predefined achievements across 4 categories:
  - Interaction (first collapse, circuit architect)
  - Mastery (perfect mastery, quantum scholar)
  - Challenge (amplitude amplifier, myth buster)
  - Persistence (dedicated learner, review champion)

**Key Functions:**
- `getAchievementById(id)` - Retrieve achievement definition
- `checkAchievementUnlock(id, unlocked)` - Check if can unlock

### `masteryCalculator.ts`
Mastery level calculation using weighted formula:
- 40% interaction completion
- 30% quiz accuracy
- 20% confidence accuracy
- 10% self-rating

**Key Functions:**
- `calculateMastery(moduleData, totalInteractions)` - Calculate 0-100 mastery score
- `calculateConfidenceAccuracy(ratings)` - Measure confidence calibration
- `isModuleComplete(moduleData, requiredInteractions)` - Check completion (70% threshold)

### `reviewScheduler.ts`
Spaced repetition scheduling system:
- Creates review items for incorrect answers, low confidence, or time-based review
- Prioritizes review queue by urgency
- Implements spaced repetition intervals (1, 3, 7, 14, 30 days)

**Key Functions:**
- `createReviewItem(moduleId, conceptId, reason, priority)` - Create review entry
- `sortReviewQueue(queue)` - Sort by priority and date
- `getReviewsDue(queue, currentDate)` - Filter items due for review

### `persistence.ts`
localStorage wrapper with graceful error handling:
- Automatic fallback to in-memory storage on errors
- Date object preservation during serialization
- Quota exceeded error handling

**Key Features:**
- Graceful degradation when localStorage unavailable
- Automatic JSON serialization/deserialization
- Date reviver for proper Date object restoration

## Usage Example

```typescript
import { useLearningStore } from '@/lib/learningState';

function MyComponent() {
  const { xp, level, addXP, unlockAchievement } = useLearningStore();
  
  const handleQuizComplete = () => {
    addXP(20, 'quiz-correct');
    unlockAchievement('first-collapse');
  };
  
  return (
    <div>
      <p>Level {level} - {xp} XP</p>
      <button onClick={handleQuizComplete}>Complete Quiz</button>
    </div>
  );
}
```

## Testing

All modules include comprehensive unit tests:
- `xpSystem.test.ts` - Level calculation and XP rewards
- `masteryCalculator.test.ts` - Mastery formula and completion logic
- `persistence.test.ts` - Storage and error handling
- `learningState.test.ts` - Integration tests for the full store

Run tests with:
```bash
npm test
```

## State Persistence

All state changes are automatically persisted to localStorage. The state is restored on page load, providing a seamless experience across sessions.

## Requirements Validated

This implementation satisfies the following requirements:
- **9.1, 9.2**: XP and level calculation
- **12.1**: Mastery level calculation
- **11.5**: Spaced repetition scheduling
- **15.1, 15.2, 15.3, 15.4**: localStorage persistence with error handling
