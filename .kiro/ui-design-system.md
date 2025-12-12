# Deep Concepts Design System (Pixel Art Edition)

## Core Aesthetics
**Theme**: "Pixel Quantum Realm" - A retro-futuristic, gamified interface where quantum concepts are 8-bit artifacts.
**Vibe**: Arcade, Retro-SciFi, Gamified, Nostalgic.

## Color Palette

### The Void (Backgrounds)
- **Void 950** (`#050508`): Deep void background.
- **Void 900** (`#0f1016`): Panel backgrounds.
- **Void 800** (`#1a1b26`): Borders / Secondary panels.

### Quantum Cyan (Primary / Focus)
- **Quantum 400** (`#22d3ee`): Primary actions, links, active states.
- **Quantum Glow** (`#22d3ee80`): Ambient glow for active elements.

### Synapse Purple (Secondary / Creativity)
- **Synapse 400** (`#c084fc`): Secondary accents, "Magic" moments, XP gains.

### Energy Gold (Reward / Alert)
- **Energy 400** (`#facc15`): Achievements, Warnings, High value items.

## Typography
- **Headings**: `Press Start 2P` (Blocky, arcade style) - "Game" feel.
- **Body**: `VT323` (Monospace, retro terminal) - "Code/Data" feel.

## UI Elements

### Pixel Panels
```css
background: #0f1016;
border: 4px solid #1a1b26;
box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5); /* Hard pixel shadow */
position: relative;
image-rendering: pixelated;
```

### Pixel Buttons
- **Hover**: Scale 1.05
- **Active**: Scale 0.95, TranslateY 2px (Physical press feel)

### Animations
- **Transitions**: Iris Wipe (`clip-path: circle(...)`)
- **Micro-interactions**: Pixel Sparkles, CRT scanlines.
