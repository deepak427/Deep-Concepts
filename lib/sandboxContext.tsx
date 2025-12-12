import { createContext, useContext, ReactNode } from 'react';
import { useLearningStore } from './learningState';

interface SandboxContextValue {
  isSandboxMode: boolean;
  shouldTrackProgress: boolean;
  shouldShowObjectives: boolean;
  shouldShowTimers: boolean;
  shouldAwardXP: boolean;
}

const SandboxContext = createContext<SandboxContextValue>({
  isSandboxMode: false,
  shouldTrackProgress: true,
  shouldShowObjectives: true,
  shouldShowTimers: true,
  shouldAwardXP: true
});

export function useSandboxContext() {
  return useContext(SandboxContext);
}

interface SandboxProviderProps {
  children: ReactNode;
}

/**
 * Provider that makes sandbox mode state available throughout the app.
 * Ensures that:
 * - Quantum simulations work the same in sandbox mode (Property 82)
 * - Objectives and timers are hidden in sandbox mode (Property 80)
 * - Progress is not tracked in sandbox mode (Property 83)
 */
export function SandboxProvider({ children }: SandboxProviderProps) {
  const { inSandboxMode } = useLearningStore();

  const value: SandboxContextValue = {
    isSandboxMode: inSandboxMode,
    shouldTrackProgress: !inSandboxMode,
    shouldShowObjectives: !inSandboxMode,
    shouldShowTimers: !inSandboxMode,
    shouldAwardXP: !inSandboxMode
  };

  return (
    <SandboxContext.Provider value={value}>
      {children}
    </SandboxContext.Provider>
  );
}
