/**
 * Smooth transition utilities for view changes
 * Provides consistent animations across the app
 */

import { Variants } from 'framer-motion';

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Fade transition variants
 */
export const fadeTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * Slide from right transition
 */
export const slideFromRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Slide from left transition
 */
export const slideFromLeft: Variants = {
  initial: {
    x: '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Scale transition (for modals)
 */
export const scaleTransition: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Teleport transition (for island navigation)
 */
export const teleportTransition: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  fadeOut: {
    scale: 0.8,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
  fadeIn: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger child item
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Get reduced motion variants
 * Returns instant transitions when reduced motion is preferred
 */
export function getReducedMotionVariants(variants: Variants): Variants {
  const reduced: Variants = {};
  
  for (const key in variants) {
    const state = variants[key];
    if (typeof state === 'object' && state !== null) {
      reduced[key] = {
        ...state,
        transition: { duration: 0 },
      };
    } else {
      reduced[key] = state;
    }
  }
  
  return reduced;
}

/**
 * Transition timing presets
 */
export const transitionTiming = {
  instant: { duration: 0 },
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  bounce: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
};
