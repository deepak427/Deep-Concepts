# Implementation Plan

- [x] 1. Set up project infrastructure and dependencies





  - Install Three.js, Zustand, fast-check, and Vitest dependencies
  - Configure Vitest for testing
  - Create directory structure: components/learning, components/quantum, lib/, types/
  - Set up TypeScript path aliases for cleaner imports
  - _Requirements: 19.1, 19.2_

- [x] 2. Implement core learning state management





  - Create learning state types in types/learning.ts
  - Implement Zustand store with persistence middleware in lib/learningState.ts
  - Create XP system with level calculation in lib/xpSystem.ts
  - Create achievement system in lib/achievementSystem.ts
  - Create mastery calculator in lib/masteryCalculator.ts
  - Create review scheduler in lib/reviewScheduler.ts
  - Create localStorage persistence wrapper with error handling in lib/persistence.ts
  - _Requirements: 9.1, 9.2, 12.1, 11.5, 15.1, 15.2, 15.3, 15.4_

- [ ]* 2.1 Write property test for XP and level calculation
  - **Property 8: Correct predictions award XP consistently**
  - **Property 23: Level calculation matches threshold table**
  - **Validates: Requirements 9.1, 9.2**

- [ ]* 2.2 Write property test for mastery calculation
  - **Property 31: Mastery calculation follows defined formula**
  - **Validates: Requirements 12.1**

- [ ]* 2.3 Write property test for localStorage persistence
  - **Property 39: State changes persist to localStorage**
  - **Property 40: State restoration is a round-trip**
  - **Property 41: localStorage errors are handled gracefully**
  - **Validates: Requirements 15.1, 15.2, 15.3, 15.4**

- [ ]* 2.4 Write unit tests for state management
  - Test Zustand store actions (addXP, unlockAchievement, updateModuleMastery)
  - Test achievement unlocking logic
  - Test review queue management
  - _Requirements: 9.1, 9.5, 11.1, 11.4_

- [x] 3. Create generic learning components





  - Create Quiz component with confidence rating in components/learning/Quiz.tsx
  - Create ConfidenceRating component in components/learning/ConfidenceRating.tsx
  - Create XPBar component with animated progress in components/learning/XPBar.tsx
  - Create LevelUpModal with celebration animation in components/learning/LevelUpModal.tsx
  - Create AchievementBadge component in components/learning/AchievementBadge.tsx
  - Create MasteryIndicator component in components/learning/MasteryIndicator.tsx
  - Create ReviewCard component in components/learning/ReviewCard.tsx
  - Create FeedbackMessage component with psychological safety in components/learning/FeedbackMessage.tsx
  - _Requirements: 10.1, 9.3, 9.4, 9.5, 12.2, 11.2, 14.1, 14.2, 14.3, 14.4_

- [ ]* 3.1 Write property test for feedback consistency
  - **Property 19: Feedback is always provided**
  - **Property 36: Negative language is avoided in feedback**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 18.3, 18.4, 18.5**

- [ ]* 3.2 Write property test for confidence rating storage
  - **Property 26: Confidence and correctness are both stored**
  - **Validates: Requirements 10.2**

- [ ]* 3.3 Write unit tests for learning components
  - Test Quiz component rendering and interaction
  - Test XPBar animation and progress display
  - Test LevelUpModal appearance on level change
  - Test AchievementBadge unlock animation
  - _Requirements: 10.1, 9.3, 9.4, 9.5_

- [x] 4. Implement Bloch Sphere visualization with Three.js





  - Create BlochSphere component in components/quantum/BlochSphere.tsx
  - Set up Three.js scene with sphere geometry and lighting
  - Implement state vector arrow that updates based on theta and phi
  - Add OrbitControls for camera manipulation
  - Create rotation controls for user input (mouse/touch)
  - Implement measurement button and outcome display
  - Create histogram visualization for measurement results
  - Add challenge validation for 75% probability target
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 4.1 Write property test for qubit rotation
  - **Property 3: Qubit rotation updates state**
  - **Validates: Requirements 2.2**

- [ ]* 4.2 Write property test for measurement outcomes
  - **Property 4: Measurement produces binary outcome**
  - **Property 5: Histogram matches measurements**
  - **Validates: Requirements 2.3, 2.4**

- [ ]* 4.3 Write unit tests for Bloch Sphere
  - Test component rendering
  - Test rotation input handling
  - Test measurement button interaction
  - Test histogram data structure
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Implement wave interference visualization





  - Create WaveInterference component in components/quantum/WaveInterference.tsx
  - Implement Canvas-based wave rendering
  - Create phase control sliders for two waves
  - Calculate and display combined wave in real-time
  - Show connection between wave amplitude and qubit probability
  - Implement prediction challenge UI
  - Add validation and XP reward for correct predictions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.1 Write property test for wave superposition
  - **Property 6: Wave parameter updates are reactive**
  - **Property 7: Wave superposition is mathematically correct**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 5.2 Write unit tests for wave interference
  - Test component rendering
  - Test phase control updates
  - Test prediction challenge logic
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 6. Implement entanglement visualization





  - Create EntanglementPair component in components/quantum/EntanglementPair.tsx
  - Display two qubit visualizations side-by-side
  - Implement "Create Bell State" button with animation
  - Create measurement interface for both qubits
  - Display correlation statistics table
  - Implement Myth vs Reality card deck
  - Add card classification with explanations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 6.1 Write property test for entanglement correlation
  - **Property 9: Bell state creates perfect correlation**
  - **Property 10: Entangled measurements are correlated**
  - **Property 11: Correlation statistics are accurate**
  - **Validates: Requirements 4.2, 4.3, 4.4**

- [ ]* 6.2 Write unit tests for entanglement
  - Test component rendering
  - Test Bell state creation
  - Test measurement correlation display
  - Test Myth vs Reality card deck
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 7. Implement quantum circuit builder





  - Create CircuitBuilder component in components/quantum/CircuitBuilder.tsx
  - Create gate palette with X, H, Z, CNOT, S, T gates
  - Implement drag-and-drop gate placement with Framer Motion
  - Create qubit lines (up to 3 qubits)
  - Implement state transformation display step-by-step
  - Create circuit validation logic
  - Implement pre-built circuit puzzles
  - Add puzzle validation and XP rewards
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.1 Write property test for circuit operations
  - **Property 12: Gate placement updates circuit**
  - **Property 13: Quantum gate transformations are correct**
  - **Property 14: Circuit validation matches target state**
  - **Validates: Requirements 5.2, 5.3, 5.4**

- [ ]* 7.2 Write unit tests for circuit builder
  - Test gate palette rendering
  - Test drag-and-drop mechanics
  - Test circuit validation
  - Test puzzle system
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 8. Implement quantum search algorithm demo





  - Create QuantumSearch component in components/quantum/QuantumSearch.tsx
  - Implement Classical Mode search interface with clickable boxes
  - Track and display guess count for classical search
  - Implement Quantum Mode with animation stages (superposition, oracle, amplification)
  - Create multi-trial runner to demonstrate average performance
  - Add comparison display showing quantum vs classical averages
  - Implement achievement unlock for beating classical average
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 8.1 Write property test for search algorithms
  - **Property 15: Classical search guess count is accurate**
  - **Property 16: Quantum search has better average performance**
  - **Validates: Requirements 6.2, 6.4**

- [ ]* 8.2 Write unit tests for quantum search
  - Test Classical Mode interface
  - Test guess counting
  - Test Quantum Mode animation triggers
  - Test achievement unlock logic
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 9. Implement hardware visualization





  - Create DilutionFridge component in components/quantum/DilutionFridge.tsx
  - Create vertical diagram with labeled temperature stages
  - Implement scroll-based or step-based zoom animation
  - Create DecoherenceLab component in components/quantum/DecoherenceLab.tsx
  - Add controls for temperature, noise level, and time
  - Visualize qubit state degradation based on parameters
  - Implement scenario questions with feedback
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 9.1 Write property test for decoherence simulation
  - **Property 18: Decoherence is proportional to parameters**
  - **Validates: Requirements 7.4**

- [ ]* 9.2 Write unit tests for hardware visualization
  - Test DilutionFridge rendering
  - Test DecoherenceLab controls
  - Test scenario question feedback
  - _Requirements: 7.1, 7.3, 7.5_

- [x] 10. Implement application classification challenge





  - Create ApplicationClassifier component in components/quantum/ApplicationClassifier.tsx
  - Create card-based UI with scenario cards
  - Implement drag-and-drop or click classification into three categories
  - Display immediate explanations after classification
  - Implement streak tracking and display
  - Create misconception detection logic
  - Add module suggestions based on incorrect answers
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 10.1 Write property test for classification system
  - **Property 20: Classification mechanics work for all cards**
  - **Property 21: Streak counting is accurate**
  - **Property 22: Misconception detection identifies related concepts**
  - **Validates: Requirements 8.2, 8.4, 8.5**

- [ ]* 10.2 Write unit tests for application classifier
  - Test card rendering
  - Test classification mechanics
  - Test streak display
  - Test misconception detection
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [x] 11. Implement onboarding flow





  - Create OnboardingFlow component in components/layout/OnboardingFlow.tsx
  - Create self-assessment quiz with 3 questions
  - Create user profile selection UI (developer, student, founder, researcher)
  - Implement onboarding completion handler
  - Store profile and assessment results in learning state
  - Create profile-based micro-copy personalization system
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 11.1 Write property test for onboarding persistence
  - **Property 1: Onboarding data persistence**
  - **Property 2: Profile-based personalization**
  - **Validates: Requirements 1.4, 1.5**

- [ ]* 11.2 Write unit tests for onboarding
  - Test onboarding flow rendering
  - Test quiz questions
  - Test profile selection
  - Test completion handler
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 12. Implement dashboard and profile view





  - Create Dashboard component in components/layout/Dashboard.tsx
  - Display current XP, level, and XP progress bar
  - Display unlocked achievements with badges
  - Show module mastery levels
  - Create "Concepts you struggle with" section
  - Implement "Review Session" button and flow
  - Add welcome-back message for returning users
  - _Requirements: 9.4, 9.5, 12.2, 11.2, 14.5_

- [ ]* 12.1 Write property test for profile display
  - **Property 25: Profile data display is accurate**
  - **Property 37: Progress events trigger positive feedback**
  - **Property 38: Return after absence shows welcome message**
  - **Validates: Requirements 9.4, 14.3, 14.4, 14.5**

- [ ]* 12.2 Write unit tests for dashboard
  - Test XP and level display
  - Test achievement display
  - Test mastery indicators
  - Test review session button
  - _Requirements: 9.4, 9.5, 12.2, 11.2_

- [x] 13. Implement review system





  - Update Quiz component to support review mode
  - Create review queue display in Dashboard
  - Implement review session flow
  - Add spaced repetition scheduling logic
  - Update learning state after review completion
  - Remove items from queue on successful review
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 13.1 Write property test for review system
  - **Property 27: Review queue management is consistent**
  - **Property 28: Review section displays queue items**
  - **Property 29: State updates reflect completed reviews**
  - **Property 30: Spaced repetition scheduling is time-based**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ]* 13.2 Write unit tests for review system
  - Test review queue display
  - Test review session flow
  - Test spaced repetition logic
  - Test state updates
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 14. Update module view with new interactions





  - Update ModuleView component to integrate new quantum visualizations
  - Add module completion summary with learning objectives
  - Implement self-rating widget (1-5 scale)
  - Add retrieval practice questions after micro-sections
  - Implement mastery-based completion (70% threshold)
  - Add suggestions for low mastery modules
  - Update module navigation to show mastery percentages
  - _Requirements: 12.3, 12.4, 13.1, 13.2, 13.3, 18.1_

- [ ]* 14.1 Write property test for module completion
  - **Property 33: Completion requires 70% mastery**
  - **Property 34: Low mastery triggers suggestions**
  - **Property 35: Self-rating affects review personalization**
  - **Validates: Requirements 12.3, 12.4, 13.3, 13.4, 13.5**

- [ ]* 14.2 Write property test for retrieval practice
  - **Property 43: Retrieval questions appear after micro-sections**
  - **Property 44: Question types are varied**
  - **Validates: Requirements 18.1, 18.2**

- [ ]* 14.3 Write unit tests for updated module view
  - Test module completion summary
  - Test self-rating widget
  - Test retrieval practice integration
  - Test mastery-based completion
  - _Requirements: 12.3, 13.1, 13.2, 18.1_

- [x] 15. Update sidebar with progress indicators





  - Update Sidebar component to show mastery percentages
  - Add XP bar to sidebar header
  - Display current level and title
  - Show achievement count
  - Add visual indicators for modules needing review
  - _Requirements: 9.4, 12.2_

- [ ]* 15.1 Write unit tests for updated sidebar
  - Test mastery percentage display
  - Test XP bar rendering
  - Test level display
  - Test achievement count
  - _Requirements: 9.4, 12.2_

- [x] 16. Implement accessibility features





  - Add keyboard navigation support to all interactive components
  - Implement ARIA labels for visualizations and custom components
  - Create useReducedMotion hook
  - Update all animations to respect reduced motion preference
  - Add reduced motion toggle to settings
  - Ensure color contrast meets WCAG 2.1 AA standards
  - Add focus indicators to all interactive elements
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ]* 16.1 Write property test for accessibility
  - **Property 45: Keyboard navigation works for interactive elements**
  - **Property 46: ARIA labels exist for content**
  - **Property 47: Color contrast meets WCAG standards**
  - **Property 48: Reduced motion preference is respected**
  - **Validates: Requirements 20.1, 20.2, 20.3, 20.4**

- [ ]* 16.2 Write unit tests for accessibility
  - Test keyboard navigation
  - Test ARIA labels
  - Test reduced motion hook
  - Test focus indicators
  - _Requirements: 20.1, 20.2, 20.4_

- [x] 17. Integrate all components into main App





  - Update App.tsx to include onboarding flow
  - Add Dashboard route/view
  - Integrate learning state with all components
  - Add level-up modal trigger
  - Add achievement unlock notifications
  - Implement XP gain animations
  - Add visual feedback for section completion
  - Wire up all module interactions to learning state
  - _Requirements: 1.1, 9.3, 9.5, 16.5_

- [ ]* 17.1 Write property test for visual feedback
  - **Property 42: Section completion provides visual feedback**
  - **Validates: Requirements 16.5**

- [ ]* 17.2 Write integration tests for complete flows
  - Test onboarding → module → completion → XP → level up flow
  - Test quiz → confidence → review queue flow
  - Test achievement unlock flow
  - Test review session flow
  - _Requirements: 1.1, 9.1, 9.3, 10.2, 11.1_

- [x] 18. Update module content with new structure





  - Update constants/modules.ts with new module content structure
  - Add learning objectives for each module
  - Define required interactions for each module
  - Create retrieval practice questions
  - Add challenge definitions for interactive simulations
  - Define achievement unlock conditions
  - _Requirements: All module-specific requirements_

- [ ]* 18.1 Write unit tests for module content
  - Test module content structure
  - Test required interactions definitions
  - Test challenge definitions
  - _Requirements: All module-specific requirements_

- [x] 19. Polish and optimize





  - Optimize Three.js rendering performance (target 60 FPS)
  - Optimize circuit simulation performance (< 100ms for 10 gates)
  - Ensure state persistence is fast (< 50ms)
  - Add loading states for heavy components
  - Implement code splitting for quantum visualizations
  - Add error boundaries for graceful error handling
  - Test on mobile devices and adjust touch interactions
  - _Requirements: Performance targets from design_

- [ ]* 19.1 Write performance tests
  - Test Bloch Sphere rendering FPS
  - Test circuit simulation timing
  - Test state persistence timing
  - _Requirements: Performance targets from design_

- [x] 20. Final checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Quantum Quest Game Layer

- [x] 21. Implement Quantum Realm Hub (3D Isometric World)





  - Create QuantumHub component with isometric projection
  - Implement island positioning and rendering
  - Add hover effects showing island info (name, stars, NPC, challenges)
  - Implement click-to-teleport navigation
  - Add particle background (quantum foam)
  - Create mastery glow aura system
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ]* 21.1 Write property test for island navigation
  - **Property 50: Island click triggers navigation**
  - **Property 51: Mastery glow intensity correlates with stars**
  - **Validates: Requirements 21.3, 21.5**

- [ ]* 21.2 Write unit tests for Quantum Hub
  - Test island rendering
  - Test hover information display
  - Test teleportation animation
  - _Requirements: 21.1, 21.2, 21.3_

- [x] 22. Implement NPC System





  - Create NPC data models and constants in constants/npcs.ts
  - Create NPCDialogue component with animated dialogue boxes
  - Implement character portraits and idle animations
  - Create dialogue choice system
  - Implement relationship tracking
  - Add context-aware dialogue based on progress
  - Create personality-specific dialogue generation
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ]* 22.1 Write property test for NPC dialogue
  - **Property 52: NPC arrival displays character**
  - **Property 53: NPC dialogue reflects personality**
  - **Property 54: Challenge completion updates NPC dialogue**
  - **Validates: Requirements 22.1, 22.2, 22.3**

- [ ]* 22.2 Write unit tests for NPC system
  - Test dialogue box rendering
  - Test choice selection
  - Test relationship updates
  - _Requirements: 22.1, 22.2, 22.4_

- [x] 23. Implement Quest System





  - Create quest data models in constants/quests.ts
  - Create QuestLog component accessible from HUD
  - Implement quest card UI with objectives and rewards
  - Create quest tracking system
  - Implement quest completion and reward distribution
  - Add quest prerequisite checking
  - Create quest objective completion notifications
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ]* 23.1 Write property test for quest system
  - **Property 57: Quest cards contain complete information**
  - **Property 58: Quest log displays all active quests**
  - **Property 60: Quest completion awards specified rewards**
  - **Validates: Requirements 23.1, 23.2, 23.4**

- [ ]* 23.2 Write unit tests for quest system
  - Test quest log display
  - Test quest tracking
  - Test reward distribution
  - _Requirements: 23.1, 23.2, 23.4_

- [x] 24. Implement Boss Battle System






  - Create boss data models in constants/bosses.ts
  - Create BossBar component with health displays
  - Implement turn-based battle flow
  - Create boss attack animations
  - Implement damage calculation for both sides
  - Add victory/defeat conditions and rewards
  - Create boss unlock based on mastery threshold
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ]* 24.1 Write property test for boss battles
  - **Property 62: Boss unlocks at mastery threshold**
  - **Property 63: Boss battle damage is consistent**
  - **Property 64: Explorer damage is consistent**
  - **Property 65: Boss defeat awards specified rewards**
  - **Validates: Requirements 24.1, 24.3, 24.4, 24.5**

- [ ]* 24.2 Write unit tests for boss battles
  - Test battle initialization
  - Test damage calculation
  - Test victory/defeat conditions
  - _Requirements: 24.2, 24.3, 24.4_

- [x] 25. Implement Particle Effect System





  - Create ParticleField component with Canvas rendering
  - Implement particle engine with pooling
  - Create particle types: quantum foam, probability clouds, beams, explosions
  - Add particle spawning for all game events
  - Implement measurement collapse animation
  - Create entanglement beam effects
  - Add XP gain floating numbers
  - Create teleportation fade effects
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ]* 25.1 Write property test for particle effects
  - **Property 66: Action feedback timing is consistent**
  - **Property 67: Measurement triggers collapse animation**
  - **Property 69: XP gain triggers floating numbers**
  - **Validates: Requirements 25.1, 25.2, 25.4**

- [ ]* 25.2 Write unit tests for particle system
  - Test particle spawning
  - Test particle lifecycle
  - Test particle pooling
  - _Requirements: 25.1, 25.2, 25.3_

- [x] 26. Implement Game HUD





  - Create GameHUD component with level, XP bar, and buttons
  - Add map, inventory, and help quick access buttons
  - Implement XP bar animation on gain
  - Create level-up notification system
  - Add challenge-specific HUD information
  - Ensure HUD doesn't obscure main view
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ]* 26.1 Write property test for HUD
  - **Property 71: HUD XP bar animates on gain**
  - **Property 72: Level-up triggers HUD notification**
  - **Property 73: Challenge HUD doesn't obscure view**
  - **Validates: Requirements 26.3, 26.4, 26.5**

- [ ]* 26.2 Write unit tests for HUD
  - Test HUD rendering
  - Test button functionality
  - Test XP bar animation
  - _Requirements: 26.1, 26.2, 26.3_

- [x] 27. Implement Inventory System





  - Create Inventory component with grid layout
  - Implement item categories and filtering
  - Create item collection system with animations
  - Implement power-up usage and active effects
  - Add cosmetic equipping and avatar updates
  - Create hidden area discovery rewards
  - Add item tooltips with descriptions
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ]* 27.1 Write property test for inventory
  - **Property 74: Item collection adds to inventory**
  - **Property 75: Inventory groups items by category**
  - **Property 76: Power-up usage applies effect**
  - **Property 77: Cosmetic equip updates avatar**
  - **Validates: Requirements 27.1, 27.2, 27.3, 27.4**

- [ ]* 27.2 Write unit tests for inventory
  - Test item addition
  - Test category grouping
  - Test power-up usage
  - Test cosmetic equipping
  - _Requirements: 27.1, 27.2, 27.3, 27.4_

- [x] 28. Implement Sandbox Mode (Quantum Playground)





  - Create sandbox mode toggle and UI
  - Unlock all tools in sandbox mode
  - Remove objectives and timers in sandbox
  - Implement creation saving system
  - Add export to image functionality
  - Ensure simulations match normal mode
  - Preserve progress when exiting sandbox
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ]* 28.1 Write property test for sandbox mode
  - **Property 79: Sandbox unlocks all tools**
  - **Property 80: Sandbox removes objectives**
  - **Property 82: Sandbox simulations match normal mode**
  - **Property 83: Sandbox exit preserves progress**
  - **Validates: Requirements 28.1, 28.2, 28.4, 28.5**

- [ ]* 28.2 Write unit tests for sandbox mode
  - Test tool unlocking
  - Test objective removal
  - Test creation saving
  - Test progress preservation
  - _Requirements: 28.1, 28.2, 28.3, 28.5_

- [x] 29. Implement Cinematic Onboarding





  - Create cinematic intro animation (portal discovery)
  - Implement Dr. Qubit introduction with dialogue
  - Create interactive tutorial with real qubit
  - Add visual island selection (no text-heavy profiles)
  - Implement starting bonus system
  - Add smooth transitions between onboarding steps
  - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5_

- [ ]* 29.1 Write property test for onboarding
  - **Property 84: Starting island choice awards bonus**
  - **Validates: Requirements 29.5**

- [ ]* 29.2 Write unit tests for onboarding
  - Test intro animation
  - Test tutorial flow
  - Test island selection
  - Test starting bonus
  - _Requirements: 29.1, 29.2, 29.3, 29.4_

- [x] 30. Implement Audio System





  - Create AudioManager in lib/audioManager.ts
  - Implement sound effect playback with pooling
  - Add ambient quantum hum background audio
  - Create measurement pop sound
  - Add level-up fanfare sound
  - Implement volume controls for each category
  - Add audio settings UI
  - Ensure sound timing meets requirements (50ms)
  - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_

- [ ]* 30.1 Write property test for audio system
  - **Property 85: Action sound timing is consistent**
  - **Property 86: Measurement plays pop sound**
  - **Property 87: Level-up plays fanfare sound**
  - **Validates: Requirements 30.2, 30.3, 30.4**

- [ ]* 30.2 Write unit tests for audio system
  - Test sound playback
  - Test volume controls
  - Test sound pooling
  - _Requirements: 30.1, 30.2, 30.5_

- [x] 31. Create Island-Specific Views




  - Create SuperpositionIsland component with Dr. Qubit
  - Create EntanglementValley component with Entangla
  - Create CircuitCity component with Circuit Master
  - Create AlgorithmTemple component with The Oracle
  - Create CryogenicCaverns component with Hardware Harry
  - Integrate NPCs, quests, and challenges for each island
  - Add island-specific particle effects and themes
  - _Requirements: 21.1, 22.1, 23.1_

- [ ]* 31.1 Write unit tests for island views
  - Test island rendering
  - Test NPC integration
  - Test challenge availability
  - _Requirements: 21.1, 22.1_

- [x] 32. Update Game State Management




  - Extend Zustand store with game-specific state
  - Implement island progress tracking
  - Add NPC relationship management
  - Create quest state management
  - Implement boss battle state
  - Add inventory state management
  - Create sandbox mode state
  - Ensure all state changes persist to localStorage
  - _Requirements: All game requirements_

- [ ]* 32.1 Write property test for game state
  - **Property 49: Island hover displays complete information**
  - **Property 55: Dialogue choices affect unlocks**
  - **Property 61: Only one quest can be tracked**
  - **Validates: Requirements 21.2, 22.4, 23.5**

- [ ]* 32.2 Write unit tests for game state
  - Test state mutations
  - Test persistence
  - Test state restoration
  - _Requirements: All game requirements_

- [x] 33. Integrate Game Layer with Learning Core




  - Connect XP system to quest rewards
  - Link mastery calculation to island stars
  - Integrate achievements with boss defeats
  - Connect review system to quest suggestions
  - Ensure spaced repetition works with islands
  - Link confidence ratings to NPC dialogue
  - _Requirements: All requirements_

- [ ]* 33.1 Write integration tests for game + learning
  - Test quest completion → XP → level up flow
  - Test challenge completion → mastery → boss unlock flow
  - Test boss defeat → achievement unlock flow
  - _Requirements: All requirements_

- [x] 34. Polish and Optimize Game Experience





  - Optimize particle rendering (target 60 FPS)
  - Optimize 3D hub rendering
  - Add loading states for heavy components
  - Implement smooth transitions between all views
  - Test on mobile devices
  - Ensure touch interactions work well
  - Add error boundaries for game components
  - _Requirements: Performance targets_

- [ ]* 34.1 Write performance tests for game
  - Test particle system FPS
  - Test hub rendering performance
  - Test audio playback performance
  - _Requirements: Performance targets_

- [x] 35. Final Game Checkpoint




  - Ensure all game features work together
  - Test complete Explorer journey: onboarding → islands → quests → bosses → sandbox
  - Verify all particle effects trigger correctly
  - Test all NPC interactions
  - Verify audio plays correctly
  - Ensure inventory system works
  - Test sandbox mode thoroughly
  - Ask user if questions arise
