import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'xp';

interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  title: string;
  message: string;
  xpAmount?: number;
  duration?: number;
}

interface FeedbackSystemProps {
  messages: FeedbackMessage[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'center';
}

export function FeedbackSystem({ 
  messages, 
  onDismiss, 
  position = 'top-right' 
}: FeedbackSystemProps) {
  
  const getIcon = (type: FeedbackType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-quantum-500" />;
      case 'xp':
        return <Zap className="w-5 h-5 text-energy-500" />;
      default:
        return <Info className="w-5 h-5 text-quantum-500" />;
    }
  };

  const getStyles = (type: FeedbackType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'error':
        return 'bg-red-500/20 border-red-500 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'info':
        return 'bg-quantum-500/20 border-quantum-500 text-quantum-400';
      case 'xp':
        return 'bg-energy-500/20 border-energy-500 text-energy-400';
      default:
        return 'bg-quantum-500/20 border-quantum-500 text-quantum-400';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4 md:top-6 md:right-6';
      case 'top-center':
        return 'fixed top-4 left-1/2 -translate-x-1/2 md:top-6';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 md:bottom-6 md:right-6';
      case 'center':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'fixed top-4 right-4 md:top-6 md:right-6';
    }
  };

  return (
    <div className={cn(
      "z-50 pointer-events-none space-y-2 max-w-sm w-full",
      getPositionStyles()
    )}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : 0, y: position.includes('top') ? -20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "pointer-events-auto border-2 p-4 shadow-lg backdrop-blur-sm",
              "cursor-pointer transition-all duration-200 hover:scale-105",
              getStyles(message.type)
            )}
            onClick={() => onDismiss(message.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(message.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display text-sm tracking-wider uppercase">
                    {message.title}
                  </h3>
                  {message.type === 'xp' && message.xpAmount && (
                    <span className="font-display text-energy-400 text-sm">
                      +{message.xpAmount} XP
                    </span>
                  )}
                </div>
                
                <p className="text-sm opacity-90 leading-relaxed">
                  {message.message}
                </p>
              </div>

              {/* Close indicator */}
              <div className="flex-shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity">
                ✕
              </div>
            </div>

            {/* Progress bar for timed messages */}
            {message.duration && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: message.duration / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing feedback messages
export function useFeedback() {
  const [messages, setMessages] = React.useState<FeedbackMessage[]>([]);

  const showFeedback = React.useCallback((
    type: FeedbackType,
    title: string,
    message: string,
    options?: {
      xpAmount?: number;
      duration?: number;
    }
  ) => {
    const id = `feedback-${Date.now()}-${Math.random()}`;
    const newMessage: FeedbackMessage = {
      id,
      type,
      title,
      message,
      xpAmount: options?.xpAmount,
      duration: options?.duration || 5000,
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-dismiss after duration
    if (newMessage.duration) {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, newMessage.duration);
    }

    return id;
  }, []);

  const dismissFeedback = React.useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setMessages([]);
  }, []);

  // Convenience methods
  const showSuccess = React.useCallback((title: string, message: string, duration?: number) => {
    return showFeedback('success', title, message, { duration });
  }, [showFeedback]);

  const showError = React.useCallback((title: string, message: string, duration?: number) => {
    return showFeedback('error', title, message, { duration });
  }, [showFeedback]);

  const showWarning = React.useCallback((title: string, message: string, duration?: number) => {
    return showFeedback('warning', title, message, { duration });
  }, [showFeedback]);

  const showInfo = React.useCallback((title: string, message: string, duration?: number) => {
    return showFeedback('info', title, message, { duration });
  }, [showFeedback]);

  const showXP = React.useCallback((title: string, message: string, xpAmount: number, duration?: number) => {
    return showFeedback('xp', title, message, { xpAmount, duration });
  }, [showFeedback]);

  return {
    messages,
    showFeedback,
    dismissFeedback,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showXP,
  };
}