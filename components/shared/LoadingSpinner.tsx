import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  const reducedMotion = useReducedMotion();

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full`}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={reducedMotion ? {} : {
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
