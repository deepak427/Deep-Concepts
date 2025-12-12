# Learning Components

Generic, reusable learning components that are domain-agnostic and can be used for any educational content.

## Components

### Quiz
Interactive quiz component with confidence rating support.
- Multiple choice questions
- Confidence level assessment (low/medium/high)
- Immediate feedback with explanations
- XP rewards for correct answers
- Progress tracking

**Usage:**
```tsx
import { Quiz } from '@/components/learning';

<Quiz
  moduleId="quantum-basics"
  questions={[
    {
      id: 'q1',
      question: 'What is a qubit?',
      options: ['A classical bit', 'A quantum bit', 'A byte', 'A quantum gate'],
      correctAnswer: 1,
      explanation: 'A qubit is a quantum bit...',
      requiresConfidence: true
    }
  ]}
  onComplete={() => console.log('Quiz completed!')}
/>
```

### ConfidenceRating
Allows users to rate their confidence in an answer.
- Three levels: Low, Medium, High
- Visual feedback with emojis
- Accessible keyboard navigation

### FeedbackMessage
Displays feedback with psychological safety principles.
- Automatically sanitizes negative language
- Different styles for correct/incorrect/encouragement/info
- Accessible with ARIA labels

### XPBar
Animated progress bar showing XP and level progress.
- Smooth animations for XP changes
- Shows current level and title
- Progress to next level
- Responsive design

### LevelUpModal
Celebration modal when user levels up.
- Animated entrance
- Shows new level and title
- Auto-closes after 3 seconds
- Accessible dialog

### AchievementBadge
Displays achievement badges with unlock status.
- Category-based color coding
- Locked/unlocked states
- Optional detailed view
- Hover effects

### MasteryIndicator
Circular progress indicator for module mastery.
- 0-100% scale
- Color-coded by mastery level
- Multiple sizes
- Smooth animations

### ReviewCard
Card component for spaced repetition review items.
- Shows module and concept
- Priority indicators
- Due date tracking
- Reason for review (incorrect/low-confidence/spaced-repetition)

## Design Principles

All components follow these principles:
- **Psychological Safety**: Avoid negative language, encourage learning
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation
- **Minimal Code**: Simple, focused implementations
- **Reusability**: Domain-agnostic, can be used for any subject
- **Visual Feedback**: Clear, immediate feedback for all interactions


### ReviewSession
Complete review session flow with quiz integration.

**Features:**
- Displays all due reviews sorted by priority
- Tracks completed reviews in session
- Shows progress through session
- Automatic removal from queue on success
- Completion summary with encouragement
- "All caught up" state when no reviews due

**Props:**
- `onComplete`: Callback when session is complete or user exits

**Usage:**
```tsx
import { ReviewSession } from '@/components/learning';

<ReviewSession 
  onComplete={() => {
    // Navigate back to dashboard
    navigate('/dashboard');
  }}
/>
```

## Review System

The review system implements spaced repetition and confidence-based review scheduling to help users retain knowledge.

### How Reviews Are Added

Reviews are automatically added to the queue based on user performance:

1. **Incorrect Answers**: Automatically added with priority 3 (highest)
2. **Low Confidence**: Added with priority 2 even if answer is correct
3. **Low Self-Rating**: Added when module self-rating is ≤ 2
4. **Spaced Repetition**: Automatically added for completed modules after 1+ days

### Review Priority

- **Priority 3** (⭐⭐⭐): Incorrect answers - needs immediate attention
- **Priority 2** (⭐⭐): Low confidence - build understanding
- **Priority 1** (⭐): Spaced repetition - refresh memory

### Review Flow

1. User sees review notification in Dashboard showing number of due reviews
2. Clicks "Start Review Session" button
3. Reviews are presented as a list, sorted by priority
4. User clicks "Start Review" on any card
5. Quiz component opens in review mode
6. Correct answers automatically remove items from queue
7. User can return to list or continue to next review
8. Session completes when all due reviews are done

### Review Scheduling

The system uses intelligent scheduling:

- **Incorrect/Low Confidence**: Due in 1 day
- **Spaced Repetition**: Due 1 day after module completion
- **Future Reviews**: Not shown until due date arrives

### Integration Points

The review system integrates with:

- **Quiz Component**: Tracks answers and confidence, removes from queue on success
- **Learning State**: Manages review queue with persistence
- **Dashboard**: Displays review notifications and session button
- **Module Progress**: Triggers spaced repetition for completed modules
- **Review Scheduler**: Handles due date calculations and sorting

### State Management

Reviews are stored in the learning state:

```typescript
interface ReviewItem {
  moduleId: string;
  conceptId: string;
  reason: 'incorrect' | 'low-confidence' | 'spaced-repetition';
  priority: number;
  nextReviewDate: Date;
}
```

The `checkSpacedRepetition()` function runs on Dashboard mount to add any modules that need review.

### Example Usage

See `ReviewSession.example.tsx` for complete examples including:
- Basic review session
- Dashboard integration
- Automatic review addition
- Manual review queue management
