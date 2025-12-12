# Quantum Components

Quantum computing-specific interactive visualizations and simulations.

## Components

### BlochSphere

An interactive 3D visualization of a qubit's quantum state using Three.js.

**Features:**
- 3D Bloch sphere with state vector arrow
- Interactive rotation controls (drag to rotate qubit state)
- Real-time probability display for |0⟩ and |1⟩ states
- Measurement button with outcome display
- Histogram showing measurement statistics
- Optional challenge mode (75% probability target)
- Reset functionality

**Props:**
- `onMeasurement?: (result: MeasurementResult) => void` - Callback when measurement is performed
- `onChallengeComplete?: (success: boolean) => void` - Callback when challenge is checked
- `showChallenge?: boolean` - Whether to display the challenge UI

**Usage:**
```tsx
import { BlochSphere } from './components/quantum/BlochSphere';

<BlochSphere 
  onMeasurement={(result) => console.log(result)}
  onChallengeComplete={(success) => console.log(success)}
  showChallenge={true}
/>
```

**Requirements Satisfied:**
- 2.1: Displays Bloch Sphere visualization
- 2.2: Allows rotation of qubit state through mouse/touch input
- 2.3: Implements measurement button with outcome display
- 2.4: Shows histogram of measurement results
- 2.5: Includes challenge validation for 75% probability target

### WaveInterference

An interactive Canvas-based visualization demonstrating wave superposition and its connection to qubit probability.

**Features:**
- Real-time wave rendering using HTML5 Canvas
- Independent controls for two waves (amplitude and phase)
- Visual display of wave 1, wave 2, and combined wave
- Real-time probability calculation showing connection to qubit states
- Prediction challenge with validation and XP rewards
- Immediate feedback on predictions

**Props:**
- `onChallengeComplete?: (success: boolean) => void` - Callback when prediction is submitted
- `showChallenge?: boolean` - Whether to display the prediction challenge UI
- `moduleId?: string` - Module ID for tracking interactions (default: 'superposition')

**Usage:**
```tsx
import { WaveInterference } from './components/quantum/WaveInterference';

<WaveInterference 
  onChallengeComplete={(success) => console.log(success)}
  showChallenge={true}
  moduleId="superposition"
/>
```

**Requirements Satisfied:**
- 3.1: Displays interactive wave interference graph
- 3.2: Updates wave visualizations in real-time based on phase controls
- 3.3: Calculates and displays combined wave and connection to qubit probability
- 3.4: Presents prediction challenge for probability outcomes
- 3.5: Awards bonus XP (40 XP) for correct predictions

### CircuitBuilder

An interactive quantum circuit builder with drag-and-drop gate placement and step-by-step state transformation display.

**Features:**
- Visual gate palette with X, H, Z, CNOT, S, and T gates
- Click-to-place gate interface on qubit lines
- Support for 1-3 qubits
- Real-time state transformation display showing probability amplitudes
- Pre-built circuit puzzles with validation
- XP rewards for solving puzzles
- Clear circuit functionality
- Visual feedback for gate placement and removal

**Props:**
- `numQubits?: number` - Number of qubits in the circuit (default: 3)
- `puzzle?: CircuitPuzzle` - Optional puzzle configuration with target state
- `onPuzzleComplete?: (success: boolean) => void` - Callback when puzzle solution is validated
- `onGateAdded?: () => void` - Callback when a gate is added to the circuit

**Usage:**
```tsx
import { CircuitBuilder } from './components/quantum/CircuitBuilder';
import { CIRCUIT_PUZZLES } from './constants/circuitPuzzles';

// Free-form circuit building
<CircuitBuilder numQubits={3} />

// With puzzle
<CircuitBuilder 
  numQubits={2}
  puzzle={CIRCUIT_PUZZLES[0]}
  onPuzzleComplete={(success) => console.log(success)}
  onGateAdded={() => console.log('Gate added')}
/>
```

**Gate Operations:**
- **X (NOT)**: Flips |0⟩↔|1⟩
- **H (Hadamard)**: Creates equal superposition
- **Z (Phase)**: Adds phase flip to |1⟩
- **CNOT**: Controlled NOT (requires control and target qubits)
- **S**: π/2 phase shift
- **T**: π/4 phase shift

**Pre-built Puzzles:**
1. Bit Flip: Transform |0⟩ to |1⟩ (30 XP)
2. Equal Superposition: Create (|0⟩+|1⟩)/√2 (40 XP)
3. Minus State: Create (|0⟩-|1⟩)/√2 (50 XP)
4. Bell State: Create (|00⟩+|11⟩)/√2 (60 XP)
5. Three-Qubit Superposition: Equal superposition of all 8 states (70 XP)
6. Phase Flip: Transform |+⟩ to |-⟩ (50 XP)

**Requirements Satisfied:**
- 5.1: Displays Quantum Circuit Builder with gate palette (X, H, Z, CNOT, S, T)
- 5.2: Implements click-to-place gate placement with smooth animations
- 5.3: Shows state transformations step-by-step
- 5.4: Validates user circuits against target states for puzzles
- 5.5: Awards XP and displays success animations for correct solutions

### QuantumSearch

An interactive demonstration comparing classical and quantum search algorithms, showcasing Grover's amplitude amplification.

**Features:**
- Classical Mode: Click-to-search interface with guess counting
- Quantum Mode: Animated visualization of superposition, oracle, and amplification phases
- Real-time attempt tracking for both modes
- Multi-trial runner for statistical comparison (10 or 50 trials)
- Average performance display showing quantum advantage
- Achievement unlock for beating classical average
- XP rewards for completing searches and running trials
- Visual feedback with color-coded states and animations

**Props:**
None - fully self-contained component

**Usage:**
```tsx
import { QuantumSearch } from './components/quantum/QuantumSearch';

<QuantumSearch />
```

**Search Mechanics:**
- **Classical Search**: Sequential checking, average N/2 attempts (8 for N=16)
- **Quantum Search**: Grover's algorithm, ~√N iterations (4 for N=16)
- **Multi-Trial Analysis**: Demonstrates quantum speedup over multiple runs

**XP Rewards:**
- Classical search completion: 20 XP
- Quantum search completion: 30 XP
- Multi-trial analysis: 40 XP
- Amplitude Amplifier achievement: 50 XP (unlocked when quantum average beats classical)

**Requirements Satisfied:**
- 6.1: Displays both Classical Mode and Quantum Mode search interfaces
- 6.2: Tracks and displays guess count for classical search
- 6.3: Animates quantum search phases (superposition, oracle, amplification)
- 6.4: Demonstrates quantum search finds target in fewer average tries
- 6.5: Awards Amplitude Amplifier achievement and bonus XP

### Upcoming Components

- Entanglement demonstrations
- Hardware visualizations (Dilution Fridge, Decoherence Lab)
- Application classification challenge


### DilutionFridge

An interactive visualization of a dilution refrigerator showing the cooling stages required to reach quantum computing temperatures.

**Features:**
- Vertical diagram with 7 temperature stages (300K to 10mK)
- Step-based zoom animation through cooling stages
- Color-coded temperature gradient visualization
- Detailed information for each cooling stage
- Progress indicator showing descent to quantum chip
- Interactive stage selection
- Educational content about extreme cooling requirements
- Smooth animations with Framer Motion

**Props:**
- `onStageSelect?: (stageIndex: number) => void` - Callback when a temperature stage is selected

**Usage:**
```tsx
import { DilutionFridge } from './components/quantum/DilutionFridge';

<DilutionFridge 
  onStageSelect={(stage) => console.log('Selected stage:', stage)}
/>
```

**Temperature Stages:**
1. Room Temperature (~300 K)
2. 50K Stage (liquid nitrogen cooling)
3. 4K Stage (liquid helium temperature)
4. Still Stage (~700 mK)
5. Cold Plate (~100 mK)
6. Mixing Chamber (~15 mK)
7. Quantum Chip (~10 mK - 250x colder than outer space)

**Requirements Satisfied:**
- 7.1: Displays stylized vertical diagram of dilution refrigerator with labeled temperature stages
- 7.2: Implements step-based zoom animation descending layer by layer to quantum chip

### DecoherenceLab

An interactive simulator demonstrating how temperature, noise, and time affect qubit coherence, with scenario questions for learning.

**Features:**
- Real-time decoherence simulation with visual qubit state degradation
- Adjustable parameters: temperature (10-300 mK), noise level (0-100%), time (0-200 μs)
- Fidelity calculation using exponential decay model
- Visual representation of qubit state with degradation effects
- Start/Stop/Reset controls for time-based simulation
- 4 scenario questions with multiple choice answers
- Immediate feedback with detailed explanations
- XP rewards (25 XP per correct answer)
- Progress tracking and completion summary
- Color-coded fidelity indicators (green/yellow/red)

**Props:**
- `onScenarioComplete?: (correct: boolean) => void` - Callback when scenario question is answered
- `moduleId?: string` - Module ID for XP tracking (default: 'hardware')

**Usage:**
```tsx
import { DecoherenceLab } from './components/quantum/DecoherenceLab';

<DecoherenceLab 
  moduleId="hardware"
  onScenarioComplete={(correct) => {
    console.log('Answer was:', correct ? 'correct' : 'incorrect');
  }}
/>
```

**Decoherence Model:**
- Fidelity: F(t) = exp(-t/T2)
- T2 (coherence time) decreases with temperature and noise
- Visual feedback shows state degradation proportional to fidelity loss
- Realistic parameter ranges based on actual quantum hardware

**Scenario Topics:**
1. Temperature effects on coherence
2. Noise sources in quantum computers
3. Coherence time and calculation speed
4. Purpose of extreme cooling

**Requirements Satisfied:**
- 7.3: Provides controls for temperature, noise level, and time duration
- 7.4: Visualizes qubit state degradation proportional to parameter values
- 7.5: Presents scenario questions with immediate feedback and explanations

## Design Patterns

All quantum components follow these patterns:
- **Consistent Styling**: White cards with rounded corners, shadow-lg, blue/purple gradients
- **Immediate Feedback**: Visual and textual responses to all user actions
- **XP Integration**: Rewards tied to learning state management via Zustand
- **Accessibility**: Keyboard navigation, ARIA labels, focus indicators
- **Responsive Design**: Mobile-first approach with grid layouts
- **Smooth Animations**: Framer Motion for state transitions and celebrations
- **Educational Focus**: Clear explanations, tooltips, and contextual help

## Testing

Run component tests with:
```bash
npm run test
```

Test files include:
- `BlochSphere.test.tsx`
- `WaveInterference.test.tsx`
- `CircuitBuilder.test.tsx`
- `QuantumSearch.test.tsx`
