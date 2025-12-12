import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PixelButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'energy' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, children, ...props }, ref) => {

        const variants = {
            primary: 'bg-quantum-500 border-quantum-400 text-void-950 hover:bg-quantum-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:bg-quantum-600',
            secondary: 'bg-void-800 border-void-600 text-slate-300 hover:bg-void-700 hover:border-quantum-500 hover:text-quantum-400',
            danger: 'bg-red-600 border-red-500 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]',
            energy: 'bg-energy-500 border-energy-400 text-void-950 hover:bg-energy-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]',
            ghost: 'bg-transparent border-quantum-500 text-quantum-400 hover:bg-quantum-500/10 hover:text-quantum-300',
        };

        const sizes = {
            sm: 'px-3 py-2 text-xs min-h-[36px] border-2',
            md: 'px-4 py-3 text-sm min-h-[44px] border-2 md:border-4',
            lg: 'px-6 py-4 text-base min-h-[52px] border-2 md:border-4',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98, translateY: 1 }}
                className={cn(
                    'font-display tracking-widest uppercase transition-all duration-200 relative',
                    'focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:ring-offset-2 focus:ring-offset-void-950',
                    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
                    'active:shadow-none active:translate-y-1',
                    fullWidth && 'w-full',
                    variants[variant],
                    sizes[size],
                    size === 'sm' ? 'shadow-[2px_2px_0_rgba(0,0,0,0.5)]' : 'shadow-[4px_4px_0_rgba(0,0,0,0.5)]',
                    className
                )}
                {...props}
            >
                <span className="relative z-10">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-pulse">●</span>
                            LOADING
                        </span>
                    ) : children}
                </span>
            </motion.button>
        );
    }
);

PixelButton.displayName = 'PixelButton';
