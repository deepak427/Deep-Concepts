// Feedback message component with psychological safety

interface FeedbackMessageProps {
  type: 'correct' | 'incorrect' | 'encouragement' | 'info';
  message: string;
  details?: string;
}

const NEGATIVE_PHRASES = ['wrong', 'incorrect', 'failed', 'error', 'bad'];

function sanitizeFeedback(message: string): string {
  let sanitized = message;
  NEGATIVE_PHRASES.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    sanitized = sanitized.replace(regex, match => {
      if (match.toLowerCase() === 'wrong') return 'not quite';
      if (match.toLowerCase() === 'incorrect') return 'not quite right';
      if (match.toLowerCase() === 'failed') return 'didn\'t work';
      if (match.toLowerCase() === 'error') return 'issue';
      if (match.toLowerCase() === 'bad') return 'could be better';
      return match;
    });
  });
  return sanitized;
}

export function FeedbackMessage({ type, message, details }: FeedbackMessageProps) {
  const sanitizedMessage = sanitizeFeedback(message);

  const styles = {
    correct: {
      bg: 'bg-emerald-900/20',
      border: 'border-emerald-500',
      text: 'text-emerald-400',
      shadow: 'shadow-[4px_4px_0_rgba(16,185,129,0.2)]',
      icon: '✓'
    },
    incorrect: {
      bg: 'bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-400',
      shadow: 'shadow-[4px_4px_0_rgba(239,68,68,0.2)]',
      icon: '!'
    },
    encouragement: {
      bg: 'bg-purple-900/20',
      border: 'border-purple-500',
      text: 'text-purple-400',
      shadow: 'shadow-[4px_4px_0_rgba(168,85,247,0.2)]',
      icon: '★'
    },
    info: {
      bg: 'bg-void-900',
      border: 'border-slate-600',
      text: 'text-slate-300',
      shadow: 'shadow-[4px_4px_0_rgba(148,163,184,0.2)]',
      icon: 'i'
    }
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} ${style.shadow} border-2 p-4 my-4 relative overflow-hidden`}
      role="alert"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-5 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />
      <div className="flex items-start gap-4 relative z-10">
        <div className={`w-8 h-8 flex items-center justify-center border-2 ${style.border} bg-void-950 font-display text-lg`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <p className="font-display uppercase tracking-wide text-sm pt-1">{sanitizedMessage}</p>
          {details && (
            <p className="text-xs font-mono mt-2 opacity-80 border-t border-current pt-2 border-opacity-30">
              &gt; {sanitizeFeedback(details)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
