# Sandbox Mode (Quantum Playground) Implementation

## Overview

Sandbox Mode provides a free experimentation environment where Explorers can use all quantum tools without objectives, timers, or performance tracking. This implementation satisfies Requirements 28.1-28.5.

## Features

### 1. Tool Unlocking (Property 79)
All quantum tools and visualizations are accessible in sandbox mode regardless of Explorer progress:
- Bloch Sphere
- Wave Interference
- Circuit Builder
- Quantum Search
- Decoherence Lab

### 2. No Objectives or Timers (Property 80)
When in sandbox mode:
- Quest objectives are hidden
- Timers are disabled
- Performance metrics are not tracked
- XP is not awarded

### 3. Creation Saving (Property 81)
Explorers can save their experiments:
- Each creation gets a unique ID and timestamp
- Creations are persisted to localStorage
- Creations can be deleted
- Supports multiple creation types (circuit, bloch-sphere, wave-interference, etc.)

### 4. Simulation Accuracy (Property 82)
Quantum simulations work identically in sandbox mode and normal mode:
- Same physics calculations
- Same measurement outcomes
- Same gate transformations
- No simplified or "fake" simulations

### 5. Progress Preservation (Property 83)
Entering and exiting sandbox mode does not affect:
- XP and level
- Achievements
- Module progress
- Quest status
- Island mastery
- Boss defeats

## Components

### SandboxMode.tsx
Main sandbox mode interface with:
- Tool selection grid
- Active tool display
- Save creation dialog
- Export to image functionality
- My Creations panel

### SandboxModeWrapper.tsx
Wrapper component that:
- Provides sandbox mode toggle button
- Manages enter/exit transitions
- Verifies progress preservation
- Shows locked state when sandbox not unlocked

### sandboxContext.tsx
Context provider that:
- Makes sandbox state available throughout app
- Controls whether to track progress
- Controls whether to show objectives/timers
- Controls whether to award XP

## State Management

### Learning State Extensions
```typescript
interface GameState {
  // Sandbox Mode
  sandboxUnlocked: boolean;      // Whether sandbox is available
  inSandboxMode: boolean;         // Currently in sandbox
  sandboxCreations: SandboxCreation[]; // Saved experiments
}

interface SandboxCreation {
  id: string;                     // Unique identifier
  name: string;                   // User-provided name
  type: 'circuit' | 'bloch-sphere' | ...; // Tool type
  data: any;                      // Tool-specific state
  createdAt: Date;                // Creation timestamp
  thumbnail?: string;             // Optional screenshot
}
```

### Actions
- `unlockSandbox()` - Make sandbox available
- `enterSandboxMode()` - Enter sandbox
- `exitSandboxMode()` - Return to normal mode
- `saveSandboxCreation(creation)` - Save experiment
- `deleteSandboxCreation(id)` - Delete saved experiment
- `isSandboxMode()` - Check if in sandbox

## Usage

### Basic Integration
```tsx
import { SandboxProvider } from '@/lib/sandboxContext';
import SandboxModeWrapper from '@/components/game/SandboxModeWrapper';

function App() {
  return (
    <SandboxProvider>
      <SandboxModeWrapper>
        {/* Your app content */}
      </SandboxModeWrapper>
    </SandboxProvider>
  );
}
```

### Unlocking Sandbox
```tsx
const { unlockSandbox } = useLearningStore();

// Unlock after completing first island
if (masteryStars >= 3) {
  unlockSandbox();
}
```

### Checking Sandbox Mode
```tsx
import { useSandboxContext } from '@/lib/sandboxContext';

function QuantumTool() {
  const { isSandboxMode, shouldAwardXP } = useSandboxContext();
  
  const handleSuccess = () => {
    if (shouldAwardXP) {
      addXP(50, 'tool-completion');
    }
    // Tool logic works the same regardless
  };
}
```

### Hiding Objectives
```tsx
function QuestTracker() {
  const { shouldShowObjectives } = useSandboxContext();
  
  if (!shouldShowObjectives) {
    return null; // Hide in sandbox mode
  }
  
  return <div>{/* Quest objectives */}</div>;
}
```

## Export to Image

The export functionality captures the current tool view as an image. Implementation uses:

```tsx
const handleExportImage = async () => {
  const element = document.getElementById('sandbox-tool-container');
  if (!element) return;
  
  // Use html2canvas or similar library
  const canvas = await html2canvas(element);
  const dataUrl = canvas.toDataURL('image/png');
  
  // Trigger download
  const link = document.createElement('a');
  link.download = 'quantum-experiment.png';
  link.href = dataUrl;
  link.click();
};
```

## Testing

### Unit Tests
- Sandbox unlocking
- Enter/exit sandbox mode
- Creation saving and deletion
- Progress preservation
- State persistence

### Property Tests (Optional)
- Property 79: All tools accessible in sandbox
- Property 80: No objectives in sandbox
- Property 81: Creations saved with unique IDs
- Property 82: Simulations match normal mode
- Property 83: Progress preserved on exit

## Design Decisions

### Why Separate inSandboxMode from sandboxUnlocked?
- `sandboxUnlocked` tracks permanent unlock status
- `inSandboxMode` tracks current mode
- Allows sandbox to be unlocked but not active
- Enables toggle button to show when available

### Why Context Provider?
- Makes sandbox state available throughout app
- Avoids prop drilling
- Centralizes logic for hiding objectives/timers
- Easy to check sandbox mode in any component

### Why Store Creations in State?
- Persists across sessions
- Can be displayed in UI
- Can be exported/shared in future
- Provides sense of accomplishment

## Future Enhancements

1. **Sharing Creations**
   - Export as JSON
   - Import from JSON
   - Share via URL

2. **Thumbnails**
   - Auto-capture screenshots
   - Display in creations panel
   - Use for social sharing

3. **Templates**
   - Pre-built starting points
   - Community templates
   - Challenge templates

4. **Collaboration**
   - Multi-user sandbox sessions
   - Real-time collaboration
   - Comments and annotations

## Performance Considerations

- Lazy load quantum tools (already implemented)
- Limit number of saved creations (consider pagination)
- Compress creation data before saving
- Use Web Workers for heavy simulations
- Debounce auto-save functionality

## Accessibility

- Keyboard navigation for tool selection
- ARIA labels for all interactive elements
- Focus management when entering/exiting
- Screen reader announcements for mode changes
- Reduced motion support for transitions
