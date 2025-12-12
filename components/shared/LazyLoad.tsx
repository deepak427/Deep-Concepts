import { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyLoadProps {
  message?: string;
  fallback?: React.ReactNode;
}

/**
 * Lazy load a component with loading state and error boundary
 * Usage: const MyComponent = lazyLoad(() => import('./MyComponent'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadProps = {}
) {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadWrapper(props: React.ComponentProps<T>) {
    const fallback = options.fallback || (
      <LoadingSpinner message={options.message || 'Loading...'} />
    );

    return (
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

/**
 * Preload a lazy component
 * Call this to start loading a component before it's needed
 */
export function preload<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  importFunc();
}
