# Layout Components

This directory contains layout-level components that structure the application.

## OnboardingFlow

The `OnboardingFlow` component provides a multi-step onboarding experience for new users.

### Features

- **Welcome Screen**: Introduces users to the quantum computing learning platform
- **Self-Assessment Quiz**: 3 questions to gauge user's current knowledge level
- **Profile Selection**: Allows users to identify as developer, student, founder, or researcher
- **State Persistence**: Stores profile and assessment results in learning state
- **Smooth Animations**: Uses Framer Motion for polished transitions between steps

### Usage

```tsx
import { OnboardingFlow } from './components/layout/OnboardingFlow';
import { useLearningStore } from './lib/learningState';

function App() {
  const onboardingCompleted = useLearningStore(
    state => state.userProfile.onboardingCompleted
  );

  if (!onboardingCompleted) {
    return <OnboardingFlow onComplete={() => {}} />;
  }

  return <MainApp />;
}
```

### Profile Types

- **Developer**: Focused on building quantum applications
- **Student**: Learning quantum computing concepts
- **Founder**: Understanding quantum for business applications
- **Researcher**: Exploring quantum computing research

### Self-Assessment

The quiz evaluates:
1. Familiarity with quantum computing concepts
2. Experience with quantum algorithms/circuits
3. Background in mathematics and physics

Scores range from 0-9 and are stored in `userProfile.selfAssessmentScore`.

### Personalization

Once onboarding is complete, the user's profile type is used throughout the app to personalize:
- Welcome messages
- Module introductions
- Encouragement feedback
- Level-up notifications
- Achievement messages
- Review prompts

See `lib/personalization.ts` for the full personalization system.

## Requirements Validated

- **1.1**: Onboarding flow displays before module content
- **1.2**: Self-assessment quiz with 3 questions
- **1.3**: User profile selection UI
- **1.4**: Profile and assessment stored in learning state
- **1.5**: Profile-based micro-copy personalization system

---

## Dashboard

The `Dashboard` component provides a comprehensive view of the user's learning progress, achievements, and areas needing attention.

### Features

- **Welcome Section**: Personalized greeting based on user profile with XP progress bar
- **Welcome Back Message**: Displays for returning users (24+ hours since last session)
- **Module Progress**: Shows mastery levels for all modules with visual progress bars
- **Struggling Concepts**: Highlights modules with mastery < 70% that need review
- **Review Queue**: Displays concepts waiting for review with "Start Review Session" button
- **Achievements Display**: Shows unlocked achievement badges with progress tracking
- **Quick Stats**: Summary card with total XP, level, modules completed, and achievements

### Usage

```tsx
import { Dashboard } from './components/layout/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}
```

### Layout Structure

The Dashboard uses a responsive grid layout:
- **Left Column (2/3 width)**: Module progress, struggling concepts, review queue
- **Right Column (1/3 width)**: Achievements and quick stats

### Personalization

The Dashboard adapts to user profile type:
- **Welcome messages** vary by profile (developer, student, founder, researcher)
- **Review prompts** use profile-specific language
- **Encouragement** tailored to user's learning style

### Data Sources

The Dashboard reads from the learning store:
- `userProfile`: For personalization and onboarding status
- `xp` & `level`: For progress display and level title
- `achievements`: For achievement badges
- `modules`: For mastery levels and completion status
- `reviewQueue`: For review session prompts
- `lastSessionDate`: For welcome back message

### Struggling Concepts Logic

Modules appear in "Concepts You Struggle With" when:
1. Mastery level < 70%
2. At least one interaction completed
3. Sorted by mastery level (lowest first)

### Review Queue Display

Shows when `reviewQueue.length > 0`:
- Count of concepts waiting for review
- Personalized prompt based on user profile
- "Start Review Session" button (TODO: implement navigation)

### Requirements Validated

- **9.4**: Display current XP, level, and XP progress bar
- **9.5**: Display unlocked achievements with badges
- **12.2**: Show module mastery levels
- **11.2**: Create "Concepts you struggle with" section
- **14.5**: Add welcome-back message for returning users
