---
inclusion: always
---

# DeepConcepts: Quantum Computing - Project Standards

## Project Overview

An interactive educational web app teaching quantum computing concepts through visual demonstrations, quizzes, and progressive learning modules.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Framer Motion** for animations
- **Lucide React** for icons
- **LocalStorage** for progress tracking

## Code Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use descriptive variable names
- Keep components small and focused (single responsibility)
- Avoid prop drilling - use composition

## Component Structure

```tsx
// ✅ CORRECT - Clean component structure
export function ComponentName({ prop1, prop2 }: Props) {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Side effects
  }, []);
  
  const handleAction = () => {
    // Event handlers
  };
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## State Management

- Use `useState` for local component state
- Use `localStorage` for persistence (progress tracking)
- Pass state down through props (no global state needed for this app)
- Lift state up when multiple components need it

## Error Handling

- Use try-catch for localStorage operations
- Provide fallback UI for errors
- Never crash the app - graceful degradation
- Log errors to console in development

## Performance

- Use `React.memo` sparingly (only for expensive renders)
- Lazy load interactive components if needed
- Optimize images (use WebP)
- Keep bundle size small
