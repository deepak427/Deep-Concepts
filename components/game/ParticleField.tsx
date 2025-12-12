import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../../lib/particleEngine';

interface ParticleFieldProps {
  showQuantumFoam?: boolean;
}

export function ParticleField({ showQuantumFoam = true }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ParticleEngine.initialize(canvas);
    ParticleEngine.start();

    // Spawn persistent background field (Starfield / Network)
    if (showQuantumFoam) {
      ParticleEngine.spawnBackgroundField();
    }

    return () => {
      ParticleEngine.stop();
    };
  }, [showQuantumFoam]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
