import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, Maximize2, Minimize2 } from 'lucide-react';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { cn } from '../../lib/utils';

interface InteractiveWrapperProps {
  title: string;
  description: string;
  objectives?: string[];
  children: React.ReactNode;
  onReset?: () => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  className?: string;
  fullscreenEnabled?: boolean;
}

export function InteractiveWrapper({
  title,
  description,
  objectives,
  children,
  onReset,
  isPlaying,
  onPlayPause,
  className,
  fullscreenEnabled = false
}: InteractiveWrapperProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={cn(
      "relative",
      isFullscreen && "fixed inset-0 z-50 bg-void-950 p-4 overflow-auto",
      className
    )}>
      <PixelCard 
        variant="elevated" 
        padding="md"
        className={cn(
          "h-full",
          isFullscreen && "h-auto min-h-full"
        )}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-void-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-quantum-400 text-lg md:text-xl tracking-widest">
                {title}
              </h2>
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">INFO</span>
              </PixelButton>
            </div>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-slate-400 text-sm mb-3">
                    {description}
                  </p>
                  {objectives && objectives.length > 0 && (
                    <div className="bg-void-950 border border-quantum-500/30 p-3 rounded">
                      <h3 className="font-display text-quantum-400 text-xs tracking-widest mb-2">
                        OBJECTIVES
                      </h3>
                      <ul className="space-y-1">
                        {objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="text-quantum-500 mt-1 flex-shrink-0">&gt;&gt;</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onPlayPause && (
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={onPlayPause}
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="hidden sm:inline">PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">PLAY</span>
                  </>
                )}
              </PixelButton>
            )}
            
            {onReset && (
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">RESET</span>
              </PixelButton>
            )}

            {fullscreenEnabled && (
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center gap-2"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">EXIT</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">FULL</span>
                  </>
                )}
              </PixelButton>
            )}
          </div>
        </div>

        {/* Interactive Content */}
        <div className={cn(
          "relative bg-void-950 border-2 border-void-800 p-2 md:p-4",
          "min-h-[300px] md:min-h-[400px]",
          isFullscreen && "min-h-[60vh]"
        )}>
          {/* Decorative corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-quantum-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-quantum-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-quantum-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-quantum-500" />

          {/* Content */}
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>

        {/* Mobile-specific help text */}
        <div className="md:hidden mt-4 p-3 bg-void-950 border border-void-700 rounded">
          <p className="text-slate-500 text-xs text-center">
            💡 Tap and drag to interact • Use two fingers to zoom
          </p>
        </div>
      </PixelCard>
    </div>
  );
}