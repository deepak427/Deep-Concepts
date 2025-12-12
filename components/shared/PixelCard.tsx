import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'interactive' | 'elevated' | 'glow';
    padding?: 'sm' | 'md' | 'lg';
    animate?: boolean;
}

export const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
    ({ className, variant = 'default', padding = 'md', animate = false, children, ...props }, ref) => {
        
        const variants = {
            default: 'bg-void-900 border-void-700',
            glass: 'bg-void-900/80 border-void-700/50 backdrop-blur-sm',
            interactive: 'bg-void-900 border-void-700 hover:border-quantum-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer transition-all duration-300',
            elevated: 'bg-void-800 border-void-600 shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
            glow: 'bg-void-900 border-quantum-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
        };

        const paddings = {
            sm: 'p-3 md:p-4',
            md: 'p-4 md:p-6',
            lg: 'p-6 md:p-8',
        };

        const CardComponent = animate ? motion.div : 'div';
        const animationProps = animate ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3, ease: 'easeOut' }
        } : {};

        return (
            <CardComponent
                ref={ref}
                className={cn(
                    'border-2 md:border-4 text-slate-200 relative',
                    'shadow-[4px_4px_0_rgba(0,0,0,0.5)] md:shadow-[6px_6px_0_rgba(0,0,0,0.5)]',
                    'focus-within:ring-2 focus-within:ring-quantum-500 focus-within:ring-offset-2 focus-within:ring-offset-void-950',
                    variants[variant],
                    paddings[padding],
                    className
                )}
                {...animationProps}
                {...props}
            >
                {/* Pixel highlight effect */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/10 pointer-events-none" />
                
                {children}
            </CardComponent>
        );
    }
);

PixelCard.displayName = 'PixelCard';
