import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName?: string;
  onReset?: () => void;
  onReturnToHub?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error boundary specifically for game components
 * Provides game-themed error UI and recovery options
 */
export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GameErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReturnToHub = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReturnToHub) {
      this.props.onReturnToHub();
    }
  };

  render() {
    if (this.state.hasError) {
      const componentName = this.props.componentName || 'Game Component';

      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-md w-full">
            {/* Glitch effect background */}
            <div className="relative bg-slate-800/50 backdrop-blur-md border-2 border-red-500/50 rounded-2xl p-8 shadow-2xl">
              {/* Animated error icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <AlertTriangle className="w-20 h-20 text-red-500 animate-pulse" />
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-ping" />
                </div>
              </div>

              {/* Error message */}
              <h2 className="text-2xl font-bold text-white text-center mb-3">
                Quantum Anomaly Detected
              </h2>
              <p className="text-slate-300 text-center mb-2">
                {componentName} encountered an unexpected error
              </p>
              <p className="text-slate-400 text-sm text-center mb-6">
                Don't worry, your progress is safe!
              </p>

              {/* Error details (collapsible) */}
              {this.state.error && (
                <details className="mb-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-3 text-xs text-red-400 font-mono">
                    <p className="font-semibold mb-2">{this.state.error.message}</p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap overflow-auto max-h-40 text-slate-500">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                {this.props.onReturnToHub && (
                  <button
                    onClick={this.handleReturnToHub}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <Home className="w-5 h-5" />
                    Return to Quantum Realm
                  </button>
                )}

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>

            {/* Decorative particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
