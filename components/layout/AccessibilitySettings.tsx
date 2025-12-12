import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useReducedMotion, setReducedMotionPreference, clearReducedMotionPreference } from '../../lib/useReducedMotion';

export function AccessibilitySettings() {
  const systemReducedMotion = useReducedMotion();
  const [userOverride, setUserOverride] = useState<boolean | null>(() => {
    const stored = localStorage.getItem('reducedMotion');
    return stored !== null ? stored === 'true' : null;
  });

  const effectiveReducedMotion = userOverride !== null ? userOverride : systemReducedMotion;

  const handleToggle = () => {
    if (userOverride === null) {
      // First toggle: set opposite of system preference
      const newValue = !systemReducedMotion;
      setReducedMotionPreference(newValue);
      setUserOverride(newValue);
    } else {
      // Toggle current override
      const newValue = !userOverride;
      setReducedMotionPreference(newValue);
      setUserOverride(newValue);
    }
  };

  const handleReset = () => {
    clearReducedMotionPreference();
    setUserOverride(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('reducedMotion');
      setUserOverride(stored !== null ? stored === 'true' : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Accessibility Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <label htmlFor="reduced-motion-toggle" className="text-lg font-medium block mb-1">
              Reduced Motion
            </label>
            <p className="text-sm text-gray-600">
              Minimize animations and transitions for a calmer experience
            </p>
            {userOverride === null && (
              <p className="text-xs text-gray-500 mt-1">
                Currently using system preference: {systemReducedMotion ? 'Enabled' : 'Disabled'}
              </p>
            )}
          </div>
          
          <button
            id="reduced-motion-toggle"
            onClick={handleToggle}
            className="ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ backgroundColor: effectiveReducedMotion ? '#3b82f6' : '#d1d5db' }}
            role="switch"
            aria-checked={effectiveReducedMotion}
            aria-label="Toggle reduced motion"
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{ transform: effectiveReducedMotion ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
            />
          </button>
        </div>

        {userOverride !== null && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            Reset to system preference
          </button>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            {effectiveReducedMotion ? (
              <EyeOff className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
            )}
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                {effectiveReducedMotion ? 'Reduced Motion Active' : 'Full Animations Active'}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {effectiveReducedMotion
                  ? 'Animations are minimized or disabled throughout the app.'
                  : 'Full animations and transitions are enabled for an engaging experience.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
