import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { pageTransition, getReducedMotionVariants } from '@/lib/transitions';

interface ViewTransitionProps {
  children: ReactNode;
  viewKey: string;
  className?: string;
}

/**
 * Wrapper component for smooth view transitions
 * Automatically handles reduced motion preferences
 */
export function ViewTransition({ children, viewKey, className = '' }: ViewTransitionProps) {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? getReducedMotionVariants(pageTransition) : pageTransition;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
