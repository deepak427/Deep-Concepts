# Optimization Guide for Developers

This guide explains how to use the optimization features implemented in the DeepConcepts Quantum Computing application.

## Table of Contents

1. [Error Boundaries](#error-boundaries)
2. [Lazy Loading Components](#lazy-loading-components)
3. [Performance Monitoring](#performance-monitoring)
4. [Touch Optimization](#touch-optimization)
5. [Loading States](#loading-states)
6. [Best Practices](#best-practices)

## Error Boundaries

### Basic Usage

Wrap any component that might throw errors:

```tsx
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary>
      <PotentiallyFailingComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback

Provide a custom error UI:

```tsx
<ErrorBoundary fallback={<div>Custom error message</div>}>
  <MyComponent />
</ErrorBoundary>
```

### When to Use

- Around heavy visualizations (Three.js, Canvas)
- Around lazy-loaded components
- Around components that fetch data
- At route boundaries

## Lazy Loading Components

### Using Lazy Quantum Components

```tsx
import { LazyQuantumComponent } from '@/components/quantum/LazyQuantumComponents';

function MyModule() {
  return (
    <LazyQuantumComponent 
      component="bloch" 
      props={{ 
        onMeasurement: handleMeasurement,
        showChallenge: true 
      }} 
    />
  );
}
```

### Available Components

- `bloch` - BlochSphere
- `circuit` - CircuitBuilder
- `search` - QuantumSearch
- `wave` - WaveInterference
- `decoherence` - DecoherenceLab
- `fridge` - DilutionFridge
- `classifier` - ApplicationClassifier

### Creating Your Own Lazy Component

```tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const LazyComponent = lazy(() => import('./HeavyComponent'));

function MyComponent() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### When to Use Lazy Loading

- Components > 50KB
- Components with heavy dependencies (Three.js, complex libraries)
- Components not needed on initial render
- Route-level components

## Performance Monitoring

### Measuring Operations

```typescript
import { performanceMonitor } from '@/lib/performanceMonitor';

// Synchronous operation
const result = performanceMonitor.measure('my-operation', () => {
  // Your code here
  return computeResult();
});

// Async operation
const result = await performanceMonitor.measureAsync('async-operation', async () => {
  // Your async code here
  return await fetchData();
});

// Manual measurement
const end = performanceMonitor.start('manual-operation');
// ... do work ...
end();
```

### Viewing Performance Data

In browser console:

```javascript
// View summary of all metrics
window.performanceMonitor.logSummary()

// Get average for specific metric
window.performanceMonitor.getAverage('persistence')

// Get all measurements for a metric
window.performanceMonitor.getMetrics('circuit-simulation')

// Clear all metrics
window.performanceMonitor.clear()
```

### Setting Custom Thresholds

Edit `lib/performanceMonitor.ts`:

```typescript
private checkThresholds(name: string, duration: number): void {
  const thresholds: Record<string, number> = {
    'my-operation': 100, // 100ms threshold
    // ... other thresholds
  };
  // ...
}
```

### When to Use

- Critical operations (persistence, simulation)
- Operations with performance targets
- Debugging performance issues
- Monitoring production performance

## Touch Optimization

### Using Touch Optimization Hook

```tsx
import { useTouchOptimized } from '@/lib/useTouchOptimized';

function InteractiveComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Optimize touch interactions
  useTouchOptimized(containerRef);
  
  return (
    <div ref={containerRef}>
      {/* Interactive content */}
    </div>
  );
}
```

### Detecting Touch Devices

```typescript
import { isTouchDevice } from '@/lib/useTouchOptimized';

if (isTouchDevice()) {
  // Show touch-specific UI
}
```

### Ensuring Proper Touch Target Size

```typescript
import { getTouchTargetSize } from '@/lib/useTouchOptimized';

const buttonSize = getTouchTargetSize(32); // Returns 44 on touch devices
```

### When to Use

- Custom drag interactions
- Canvas-based interactions
- Components that prevent scrolling
- Interactive visualizations

## Loading States

### Basic Usage

```tsx
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

function MyComponent() {
  if (isLoading) {
    return <LoadingSpinner size="medium" message="Loading data..." />;
  }
  
  return <div>Content</div>;
}
```

### Sizes

- `small` - 24px (for inline loading)
- `medium` - 48px (default, for cards)
- `large` - 64px (for full-page loading)

### With Suspense

```tsx
<Suspense fallback={<LoadingSpinner size="large" message="Loading..." />}>
  <LazyComponent />
</Suspense>
```

### When to Use

- Lazy-loaded components
- Data fetching
- Heavy computations
- Any operation > 200ms

## Best Practices

### 1. Always Use Error Boundaries

```tsx
// ✅ Good
<ErrorBoundary>
  <HeavyComponent />
</ErrorBoundary>

// ❌ Bad
<HeavyComponent />
```

### 2. Lazy Load Heavy Components

```tsx
// ✅ Good - Lazy loaded
const BlochSphere = lazy(() => import('./BlochSphere'));

// ❌ Bad - Eager loaded
import { BlochSphere } from './BlochSphere';
```

### 3. Monitor Critical Operations

```tsx
// ✅ Good
performanceMonitor.measure('save-state', () => {
  saveState(data);
});

// ❌ Bad - No monitoring
saveState(data);
```

### 4. Provide Loading Feedback

```tsx
// ✅ Good
{isLoading ? <LoadingSpinner /> : <Content />}

// ❌ Bad - No feedback
{!isLoading && <Content />}
```

### 5. Optimize Touch Interactions

```tsx
// ✅ Good
const ref = useRef<HTMLDivElement>(null);
useTouchOptimized(ref);

// ❌ Bad - Default touch behavior
<div onTouchStart={...} />
```

### 6. Use Immediate Save for Critical Data

```tsx
// ✅ Good - Critical data
persistenceService.saveImmediate(criticalData);

// ✅ Good - Non-critical data
persistenceService.save(regularData);
```

### 7. Respect Reduced Motion

```tsx
import { useReducedMotion } from '@/lib/useReducedMotion';

function AnimatedComponent() {
  const reducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
    />
  );
}
```

## Performance Checklist

Before deploying:

- [ ] Heavy components are lazy-loaded
- [ ] Error boundaries are in place
- [ ] Loading states are shown
- [ ] Critical operations are monitored
- [ ] Touch interactions are optimized
- [ ] Reduced motion is respected
- [ ] Performance thresholds are met
- [ ] Tests are passing

## Debugging Performance Issues

### 1. Check Performance Monitor

```javascript
window.performanceMonitor.logSummary()
```

Look for operations exceeding thresholds.

### 2. Use Browser DevTools

- **Performance Tab**: Record and analyze
- **Network Tab**: Check bundle sizes
- **Lighthouse**: Run audits

### 3. Check Console Warnings

Performance warnings are logged automatically:
- FPS drops in BlochSphere
- Slow circuit simulations
- Slow persistence operations

### 4. Profile React Components

```tsx
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

## Common Issues

### Issue: Component loads slowly

**Solution**: Lazy load it

```tsx
const Component = lazy(() => import('./Component'));
```

### Issue: Touch interactions feel laggy

**Solution**: Use touch optimization

```tsx
useTouchOptimized(elementRef);
```

### Issue: App crashes on error

**Solution**: Add error boundary

```tsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### Issue: No loading feedback

**Solution**: Add loading state

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <Component />
</Suspense>
```

## Resources

- [PERFORMANCE.md](../PERFORMANCE.md) - Detailed performance documentation
- [React.lazy](https://react.dev/reference/react/lazy) - Official React docs
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) - Official React docs
- [Web Performance](https://web.dev/performance/) - Google Web.dev

## Support

For questions or issues:
1. Check console for performance warnings
2. Review `window.performanceMonitor` data
3. Check browser DevTools Performance tab
4. Review this guide and PERFORMANCE.md
