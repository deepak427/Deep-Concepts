// Context for XP gain animations and notifications

import { createContext, useContext } from 'react';

interface XPContextValue {
  showXPGain: (amount: number, source: string) => void;
}

const XPContext = createContext<XPContextValue | null>(null);

export function useXPNotification() {
  const context = useContext(XPContext);
  if (!context) {
    // Return a no-op function if context is not available
    return {
      showXPGain: () => {}
    };
  }
  return context;
}

export const XPProvider = XPContext.Provider;
