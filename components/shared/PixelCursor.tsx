import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function PixelCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show custom cursor on devices that support hover (desktop)
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        setIsVisible(mediaQuery.matches);

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        if (mediaQuery.matches) {
            window.addEventListener('mousemove', updateMousePosition);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference filter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
            animate={{
                x: mousePosition.x - 12, // Center cursor (24px / 2 = 12)
                y: mousePosition.y - 12,
                scale: isClicking ? 0.8 : 1,
                rotate: isClicking ? 45 : 0,
            }}
            transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
        >
            {/* Pixel Cursor: A retro square crosshair */}
            <div className="w-full h-full relative">
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-quantum-400 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_4px_#00f7ff]" />

                {/* Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white" />
            </div>
        </motion.div>
    );
}
