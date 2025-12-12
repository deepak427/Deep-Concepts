---
inclusion: manual
---

# README Maintenance Guidelines

## Purpose

Keep the README.md up-to-date with the actual project state. Update it whenever:
- Project structure changes
- New features are added
- Dependencies change
- Setup instructions change

## README Structure

```markdown
# DeepConcepts: Quantum Computing

> An interactive educational web app that makes quantum computing concepts accessible through visual demonstrations and progressive learning.

## Features

- 8 progressive learning modules
- Interactive visualizations
- Knowledge check quizzes
- Progress tracking
- Responsive design

## Tech Stack

- React 19 + TypeScript
- Vite
- Framer Motion
- Lucide React
- Tailwind CSS (utility classes)

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173

## Project Structure

```
├── components/
│   ├── interactives/    # Interactive demos
│   ├── ModuleView.tsx   # Main module display
│   ├── Quiz.tsx         # Quiz component
│   └── Sidebar.tsx      # Navigation
├── constants.tsx        # Module data
├── types.ts            # TypeScript types
└── App.tsx             # Main app
```

## Module Topics

1. What Is Quantum Computing?
2. Bits vs. Qubits
3. Superposition
4. Entanglement
5. Quantum Gates
6. Algorithms (Grover)
7. Hardware & Reality
8. What Can It Do?

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
```

## Rules

- Keep it concise (under 200 lines)
- No marketing fluff
- Focus on technical setup
- Include actual commands that work
- Update when project changes
- Remove outdated information
