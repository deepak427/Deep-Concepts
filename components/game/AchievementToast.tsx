import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AchievementBadge } from '../learning/AchievementBadge';
import { useParticles } from '@/lib/useParticles';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Achievement } from '@/types/learning';

interface AchievementToastProps {
    achievement: Achievement;
    onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
    const particles = useParticles();
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        // Trigger particles when mounted
        if (containerRef.current) {
            particles.achievementUnlock(containerRef.current);
        }
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ x: reducedMotion ? 0 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reducedMotion ? 0 : 300, opacity: 0 }}
            transition={{
                type: reducedMotion ? 'tween' : 'spring',
                stiffness: 100,
                duration: reducedMotion ? 0.01 : undefined
            }}
            className="relative glass-panel bg-void-900/90 border-l-4 border-l-energy-500 rounded-lg shadow-2xl p-4 flex items-center gap-4 pointer-events-auto overflow-hidden group min-w-[320px]"
            role="alert"
            aria-live="polite"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-energy-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className="relative z-10">
                <AchievementBadge
                    achievement={achievement}
                    size="medium"
                    unlocked={true}
                />
            </div>

            {/* Text */}
            <div className="flex-1 relative z-10">
                <p className="text-energy-400 font-display font-bold text-xs uppercase tracking-wider mb-0.5">
                    Achievement Unlocked!
                </p>
                <p className="text-white font-bold text-lg leading-tight">
                    {achievement.title}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                    {achievement.description}
                </p>
            </div>

            {/* XP Reward (if any) */}
            <div className="flex flex-col items-center justify-center bg-void-950/50 rounded p-2 border border-white/5">
                <span className="text-energy-400 font-bold text-sm">+50</span>
                <span className="text-[10px] text-slate-500 uppercase">XP</span>
            </div>
        </motion.div>
    );
}
