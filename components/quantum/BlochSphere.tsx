import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion } from 'framer-motion';
import type { QubitState, MeasurementResult, MeasurementHistory } from '../../types/quantum';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface BlochSphereProps {
  onMeasurement?: (result: MeasurementResult) => void;
  onChallengeComplete?: (success: boolean) => void;
  showChallenge?: boolean;
}

export function BlochSphere({
  onMeasurement,
  onChallengeComplete,
  showChallenge = false
}: BlochSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    arrow: THREE.ArrowHelper;
  } | null>(null);
  const reducedMotion = useReducedMotion();

  const [qubitState, setQubitState] = useState<QubitState>({
    theta: Math.PI / 2,
    phi: 0
  });

  const [measurementHistory, setMeasurementHistory] = useState<MeasurementHistory>({
    outcomes: [],
    histogram: { zero: 0, one: 0 }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // void-950

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    // Cap pixel ratio at 2 for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Bloch sphere - wireframe style for retro look
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee, // cyan-400
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Inner glow sphere
    const innerGeometry = new THREE.SphereGeometry(0.95, 32, 32);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0x0f172a, // void-900
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    // Axes
    const axesHelper = new THREE.AxesHelper(1.2);
    // Custom colors for axes potentially? Default is RGB.
    scene.add(axesHelper);

    // Add axis labels (X, Y, Z)
    const createAxisLabel = (text: string, position: THREE.Vector3, color: number) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 64;
      canvas.height = 64;
      context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      context.font = 'bold 48px "Courier New"'; // Monospaced font
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.3, 0.3, 1);
      scene.add(sprite);
    };

    createAxisLabel('X', new THREE.Vector3(1.4, 0, 0), 0xff4444);
    createAxisLabel('Y', new THREE.Vector3(0, 1.4, 0), 0x44ff44);
    createAxisLabel('Z', new THREE.Vector3(0, 0, 1.4), 0x4444ff);

    // State vector arrow
    const arrowDirection = new THREE.Vector3(0, 0, 1);
    const arrowOrigin = new THREE.Vector3(0, 0, 0);
    const arrowLength = 1;
    const arrowColor = 0xff00ff; // Magenta
    const arrow = new THREE.ArrowHelper(
      arrowDirection,
      arrowOrigin,
      arrowLength,
      arrowColor,
      0.2,
      0.15
    );
    scene.add(arrow);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 6;


    // Animation loop with FPS monitoring
    let frameCount = 0;
    let lastFpsCheck = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // FPS monitoring (target: 60 FPS)
      frameCount++;
      const now = performance.now();
      if (now - lastFpsCheck >= 1000) {
        const fps = frameCount;
        if (fps < 50) {
          console.warn(`BlochSphere FPS: ${fps} (target: 60)`);
        }
        frameCount = 0;
        lastFpsCheck = now;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    sceneRef.current = { scene, camera, renderer, controls, arrow };

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  // Update arrow when qubit state changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const { theta, phi } = qubitState;
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    const direction = new THREE.Vector3(x, y, z).normalize();
    sceneRef.current.arrow.setDirection(direction);
  }, [qubitState]);

  // Mouse/touch handlers for rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setQubitState(prev => {
      let newTheta = prev.theta - deltaY * 0.01;
      let newPhi = prev.phi + deltaX * 0.01;

      // Clamp theta to [0, π]
      newTheta = Math.max(0, Math.min(Math.PI, newTheta));

      // Wrap phi to [0, 2π]
      newPhi = ((newPhi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      return { theta: newTheta, phi: newPhi };
    });

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.05;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setQubitState(prev => ({
          ...prev,
          theta: Math.max(0, prev.theta - step)
        }));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setQubitState(prev => ({
          ...prev,
          theta: Math.min(Math.PI, prev.theta + step)
        }));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setQubitState(prev => ({
          ...prev,
          phi: ((prev.phi - step) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
        }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setQubitState(prev => ({
          ...prev,
          phi: (prev.phi + step) % (2 * Math.PI)
        }));
        break;
    }
  };

  // Calculate measurement probability
  const getProbabilityOfOne = (): number => {
    return Math.pow(Math.sin(qubitState.theta / 2), 2);
  };

  // Perform measurement
  const handleMeasure = () => {
    const prob1 = getProbabilityOfOne();
    const outcome = Math.random() < prob1 ? 1 : 0;

    const result: MeasurementResult = {
      outcome: outcome as 0 | 1,
      probability: outcome === 1 ? prob1 : 1 - prob1
    };

    setMeasurementHistory(prev => ({
      outcomes: [...prev.outcomes, result.outcome],
      histogram: {
        zero: prev.histogram.zero + (result.outcome === 0 ? 1 : 0),
        one: prev.histogram.one + (result.outcome === 1 ? 1 : 0)
      }
    }));

    onMeasurement?.(result);
  };

  // Check challenge completion
  const checkChallenge = () => {
    const prob1 = getProbabilityOfOne();
    const targetProb = 0.75;
    const tolerance = 0.05;
    const success = Math.abs(prob1 - targetProb) < tolerance;
    onChallengeComplete?.(success);
  };

  // Reset measurements
  const handleReset = () => {
    setMeasurementHistory({
      outcomes: [],
      histogram: { zero: 0, one: 0 }
    });
    setQubitState({ theta: Math.PI / 2, phi: 0 });
  };

  const prob1 = getProbabilityOfOne();
  const totalMeasurements = measurementHistory.outcomes.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloch Sphere Visualization */}
        <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-display text-slate-300 mb-4 tracking-wide">Bloch Sphere</h3>
          <div
            ref={containerRef}
            className="w-full h-96 border-2 border-void-700 bg-void-950 cursor-move focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:ring-offset-2 focus:ring-offset-void-900"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="application"
            aria-label="Interactive Bloch Sphere visualization. Use arrow keys to rotate the qubit state. Up/Down adjusts theta, Left/Right adjusts phi. Hold Shift for larger steps."
            aria-describedby="bloch-sphere-instructions"
          />
          <div id="bloch-sphere-instructions" className="mt-4 text-xs font-mono text-slate-500 bg-void-950 p-2 border border-void-800">
            <p>&gt; CLICK_DRAG to rotate viewpoint // ARROW_KEYS to rotate state (SHIFT for precision)</p>
            <p className="mt-2 text-cyan-400" aria-live="polite">
              θ = {qubitState.theta.toFixed(3)} rad, φ = {qubitState.phi.toFixed(3)} rad
            </p>
          </div>
        </div>

        {/* Controls and Measurements */}
        <div className="flex flex-col gap-4">
          {/* Probability Display */}
          <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-display text-slate-300 mb-4 tracking-wide">Measurement Probability</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-xs font-mono text-slate-400">
                  <span>|0⟩ STATE</span>
                  <span>{((1 - prob1) * 100).toFixed(1)}%</span>
                </div>
                <div
                  className="w-full bg-void-950 border border-void-700 h-4"
                  role="progressbar"
                  aria-valuenow={Math.round((1 - prob1) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className="bg-cyan-600 h-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${(1 - prob1) * 100}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  >
                    <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-20 bg-repeat-y bg-[length:100%_2px]" />
                  </motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs font-mono text-slate-400">
                  <span>|1⟩ STATE</span>
                  <span>{(prob1 * 100).toFixed(1)}%</span>
                </div>
                <div
                  className="w-full bg-void-950 border border-void-700 h-4"
                  role="progressbar"
                  aria-valuenow={Math.round(prob1 * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className="bg-purple-600 h-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${prob1 * 100}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  >
                    <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-20 bg-repeat-y bg-[length:100%_2px]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Measurement Controls */}
          <div className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-display text-slate-300 mb-4 tracking-wide">Measurement_Control</h3>
            <div className="flex gap-3">
              <button
                onClick={handleMeasure}
                className="flex-1 bg-quantum-600 text-void-950 px-6 py-3 border-2 border-quantum-400 font-display uppercase tracking-wider hover:bg-quantum-500 focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:ring-offset-2 focus:ring-offset-void-900 text-sm shadow-[4px_4px_0_rgba(34,211,238,0.3)] transition-all active:translate-y-1 active:shadow-none"
                style={{
                  transition: reducedMotion ? 'none' : 'all 200ms'
                }}
                aria-label="Measure the qubit state"
              >
                Measure
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 border-slate-600 text-slate-400 font-display uppercase tracking-wider hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-void-900 text-sm transition-all active:translate-y-1"
                aria-label="Reset measurements and qubit state"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Histogram */}
          {totalMeasurements > 0 && (
            <div
              className="bg-void-900 border-2 border-void-800 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
              role="region"
              aria-label="Measurement results histogram"
            >
              <h3 className="text-lg font-display text-slate-300 mb-4 tracking-wide">
                Results_Log ({totalMeasurements})
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-xs font-mono text-slate-400">
                    <span>|0⟩ OBSERVED</span>
                    <span>
                      {measurementHistory.histogram.zero} (
                      {((measurementHistory.histogram.zero / totalMeasurements) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-void-950 border border-void-700 h-6">
                    <div
                      className="bg-cyan-600 h-full flex items-center justify-center text-void-950 text-xs font-bold font-mono"
                      style={{
                        width: `${(measurementHistory.histogram.zero / totalMeasurements) * 100}%`
                      }}
                    >
                      {measurementHistory.histogram.zero > 0 && measurementHistory.histogram.zero}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs font-mono text-slate-400">
                    <span>|1⟩ OBSERVED</span>
                    <span>
                      {measurementHistory.histogram.one} (
                      {((measurementHistory.histogram.one / totalMeasurements) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-void-950 border border-void-700 h-6">
                    <div
                      className="bg-purple-600 h-full flex items-center justify-center text-void-950 text-xs font-bold font-mono"
                      style={{
                        width: `${(measurementHistory.histogram.one / totalMeasurements) * 100}%`
                      }}
                    >
                      {measurementHistory.histogram.one > 0 && measurementHistory.histogram.one}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Challenge */}
          {showChallenge && (
            <div
              className="bg-void-950 border-l-4 border-l-purple-500 p-6 border border-void-700"
              role="region"
              aria-label="Challenge"
            >
              <h3 className="text-lg font-display text-purple-400 mb-2 uppercase tracking-wide">Challenge_Objective</h3>
              <p className="text-xs font-mono text-slate-400 mb-4 bg-void-900 p-2 border border-void-800">
                &gt; TARGET: Set qubit to 75% |1⟩ probability (±5%)
              </p>
              <button
                onClick={checkChallenge}
                className="w-full bg-purple-600 text-white px-6 py-3 font-display uppercase tracking-wider hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-void-950 text-sm shadow-[4px_4px_0_rgba(168,85,247,0.3)] transition-all active:translate-y-1 active:shadow-none"
                style={{
                  transition: reducedMotion ? 'none' : 'all 200ms'
                }}
                aria-label="Check if your solution meets the challenge requirements"
              >
                Verify_Solution
              </button>
              <p className="text-xs text-purple-400 mt-2 font-mono text-center" aria-live="polite">
                CURRENT_PROBABILITY: {(prob1 * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
