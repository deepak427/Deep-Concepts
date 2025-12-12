# Quest System Documentation

## Overview

The Quest System is a core game mechanic in Quantum Quest that provides structured learning objectives through NPC-given quests. Players complete objectives to earn XP, items, and unlock new content.

## Architecture

### Data Models

**Quest** (`types/game.ts`)
- `id`: Unique quest identifier
- `title`: Display name
- `description`: Quest description
- `npcId`: NPC who gives the quest
- `islandId`: Island where quest takes place
- `objectives`: Array of quest objectives
- `rewards`: XP, items, achievements, unlocks
- `difficulty`: 1-5 star rating
- `type`: main, side, daily, or hidden
- `prerequisites`: Required completed quests

**QuestObjective**
- `id`: Unique objective identifier
- `description`: What the player needs to do
- `type`: experiment, puzzle, boss, collect, discover
- `targetId`: ID of the challenge/item/area
- `completed`: Boolean completion status

**QuestReward**
- `xp`: Experience points awarded
- `items`: Array of items with quantities
- `unlocksIsland`: Optional island unlock
- `unlocksBoss`: Optional boss unlock
- `achievementId`: Optional achievement unlock

### State Management

Quest state is managed in the Zustand store (`lib/learningState.ts`):

```typescript
interface GameState {
  activeQuests: string[];        // Quest IDs currently active
  completedQuests: string[];     // Quest IDs completed
  trackedQuestId?: string;       // Currently tracked quest
  questObjectives: Record<string, Record<string, boolean>>; // questId -> objectiveId -> completed
}
```

### Actions

- `startQuest(questId)`: Activates a quest
- `completeQuestObjective(questId, objectiveId)`: Marks objective as complete
- `completeQuest(questId)`: Completes quest and awards rewards
- `trackQuest(questId)`: Sets quest as tracked (shows in HUD)
- `untrackQuest()`: Removes tracked quest
- `isQuestActive(questId)`: Checks if quest is active
- `isQuestCompleted(questId)`: Checks if quest is completed
- `isObjectiveCompleted(questId, objectiveId)`: Checks objective status

## Components

### QuestLog (`components/game/QuestLog.tsx`)

Side panel that displays all active and completed quests.

**Features:**
- Tab navigation (Active/Completed)
- Quest cards with progress bars
- Objective checklists
- Track/untrack functionality
- Reward display
- Difficulty stars
- Quest type badges

**Props:**
```typescript
interface QuestLogProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### QuestTracker (`components/game/QuestTracker.tsx`)

HUD overlay showing the currently tracked quest.

**Features:**
- Compact objective list
- Real-time progress updates
- Auto-hides when no quest tracked
- Non-intrusive positioning

### QuestNotification (`components/game/QuestNotification.tsx`)

Toast notifications for quest events.

**Features:**
- Objective completion notifications
- Quest completion celebrations
- XP and achievement displays
- Auto-dismiss after 4 seconds
- Smooth animations

**Hook:**
```typescript
const {
  notification,
  showObjectiveComplete,
  showQuestComplete,
  dismiss
} = useQuestNotifications();
```

### GameHUD Updates

Added quest log button to HUD:
- Scroll icon with active quest count badge
- Opens QuestLog panel on click

## Quest Data

All quests are defined in `constants/quests.ts`:

### Quest Chains

1. **Superposition Island** (Dr. Qubit)
   - superposition-basics → wave-mastery → prediction-challenge

2. **Entanglement Valley** (Entangla)
   - bell-state-quest → correlation-study → myth-buster-quest

3. **Circuit City** (Circuit Master)
   - gate-basics → circuit-puzzles → advanced-circuits

4. **Algorithm Temple** (The Oracle)
   - grover-introduction → search-mastery → algorithm-challenge

5. **Cryogenic Caverns** (Hardware Harry)
   - cooling-basics → decoherence-study → hardware-mastery

### Quest Types

- **Main**: Story progression quests
- **Side**: Optional bonus quests
- **Daily**: Repeatable daily challenges
- **Hidden**: Secret discovery quests

## Usage Example

```typescript
import { useLearningStore } from '@/lib/learningState';
import { getQuestById } from '@/constants/quests';
import { useQuestNotifications } from '@/components/game/QuestNotification';

function MyComponent() {
  const {
    startQuest,
    completeQuestObjective,
    completeQuest,
    addXP,
    unlockAchievement
  } = useLearningStore();
  
  const { showObjectiveComplete, showQuestComplete } = useQuestNotifications();

  // Start a quest
  const handleStartQuest = () => {
    startQuest('superposition-basics');
  };

  // Complete an objective
  const handleCompleteObjective = () => {
    const questId = 'superposition-basics';
    const objectiveId = 'rotate-qubit';
    
    completeQuestObjective(questId, objectiveId);
    showObjectiveComplete('Rotate the qubit on the Bloch Sphere');
    
    // Check if quest is complete
    const quest = getQuestById(questId);
    const allComplete = quest.objectives.every(obj => 
      isObjectiveCompleted(questId, obj.id)
    );
    
    if (allComplete) {
      completeQuest(questId);
      addXP(quest.rewards.xp, `quest-${questId}`);
      
      if (quest.rewards.achievementId) {
        unlockAchievement(quest.rewards.achievementId);
      }
      
      showQuestComplete(quest.title, quest.rewards.xp, quest.rewards.achievementId);
    }
  };
}
```

## Helper Functions

### Quest Queries

```typescript
import {
  getQuestById,
  getQuestsByNPC,
  getQuestsByIsland,
  checkQuestPrerequisites,
  getAvailableQuests,
  calculateQuestProgress,
  isQuestComplete
} from '@/constants/quests';

// Get specific quest
const quest = getQuestById('superposition-basics');

// Get all quests for an NPC
const drQubitQuests = getQuestsByNPC('dr-qubit');

// Get all quests on an island
const islandQuests = getQuestsByIsland('superposition-island');

// Check if prerequisites are met
const canStart = checkQuestPrerequisites('wave-mastery', completedQuests);

// Get all available quests for player
const available = getAvailableQuests(completedQuests);

// Calculate quest progress (0-100)
const progress = calculateQuestProgress(quest);

// Check if quest is complete
const complete = isQuestComplete(quest);
```

## Integration Points

### With NPC System

Quests are given by NPCs. Each NPC has a `questsAvailable` array:

```typescript
const npc = getNPCById('dr-qubit');
const availableQuests = npc.questsAvailable; // ['superposition-basics', 'wave-mastery', ...]
```

### With XP System

Quest completion awards XP:

```typescript
addXP(quest.rewards.xp, `quest-${quest.id}`);
```

### With Achievement System

Some quests unlock achievements:

```typescript
if (quest.rewards.achievementId) {
  unlockAchievement(quest.rewards.achievementId);
}
```

### With Boss System

Final quests in each chain unlock boss battles:

```typescript
if (quest.rewards.unlocksBoss) {
  // Boss becomes available
}
```

## Testing

Comprehensive test suite in `components/game/QuestLog.test.tsx`:

- Quest data retrieval
- State management (start, complete, track)
- Progress calculation
- Reward validation
- Prerequisite checking
- Quest types and difficulty

Run tests:
```bash
npm run test components/game/QuestLog.test.tsx
```

## Future Enhancements

- Quest journal with lore entries
- Quest chains with branching paths
- Time-limited quests
- Co-op quests (if multiplayer added)
- Quest rewards preview
- Quest difficulty scaling
- Quest abandonment
- Quest replay for rewards

## Requirements Validated

This implementation validates the following requirements:

- **23.1**: Quest cards contain complete information (title, description, objectives, rewards, difficulty)
- **23.2**: Quest log displays all active quests
- **23.3**: Quest objective completion provides timely feedback (notifications within 100ms)
- **23.4**: Quest completion awards specified rewards (XP, items, unlocks)
- **23.5**: Only one quest can be tracked at a time

## Properties Tested

- **Property 57**: Quest cards contain complete information
- **Property 58**: Quest log displays all active quests
- **Property 60**: Quest completion awards specified rewards
- **Property 61**: Only one quest can be tracked
