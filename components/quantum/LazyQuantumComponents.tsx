import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBoundary } from '../shared/ErrorBoundary';

// Lazy load heavy quantum components for code splitting
export const LazyBlochSphere = lazy(() => 
  import('./BlochSphere').then(module => ({ default: module.BlochSphere }))
);

export const LazyCircuitBuilder = lazy(() =>
  import('./CircuitBuilder').then(module => ({ default: module.CircuitBuilder }))
);

export const LazyQuantumSearch = lazy(() =>
  import('./QuantumSearch').then(module => ({ default: module.QuantumSearch }))
);

export const LazyWaveInterference = lazy(() =>
  import('./WaveInterference').then(module => ({ default: module.WaveInterference }))
);

export const LazyDecoherenceLab = lazy(() =>
  import('./DecoherenceLab').then(module => ({ default: module.DecoherenceLab }))
);

export const LazyDilutionFridge = lazy(() =>
  import('./DilutionFridge').then(module => ({ default: module.DilutionFridge }))
);

export const LazyApplicationClassifier = lazy(() =>
  import('./ApplicationClassifier').then(module => ({ default: module.ApplicationClassifier }))
);

// Wrapper component with loading and error handling
interface LazyQuantumComponentProps {
  component: 'bloch' | 'circuit' | 'search' | 'wave' | 'decoherence' | 'fridge' | 'classifier';
  props?: Record<string, unknown>;
}

export function LazyQuantumComponent({ component, props = {} }: LazyQuantumComponentProps) {
  const componentMap = {
    bloch: LazyBlochSphere,
    circuit: LazyCircuitBuilder,
    search: LazyQuantumSearch,
    wave: LazyWaveInterference,
    decoherence: LazyDecoherenceLab,
    fridge: LazyDilutionFridge,
    classifier: LazyApplicationClassifier
  };

  const Component = componentMap[component];

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="large" message="Loading quantum visualization..." />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
