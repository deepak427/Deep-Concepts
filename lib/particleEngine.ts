// Particle Engine with pooling, interactions, and constellation effects
// Handles all particle effects in the game

export type ParticleEffectType =
  | 'quantum-foam'
  | 'probability-cloud'
  | 'entanglement-beam'
  | 'measurement-collapse'
  | 'teleport-trail'
  | 'xp-gain'
  | 'level-up'
  | 'achievement-unlock'
  | 'explosion'
  | 'constellation-node'; // New type for background network

export interface Vector2 {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  type: ParticleEffectType;
  position: Vector2;
  velocity: Vector2;
  baseVelocity: Vector2; // Store original velocity for return-to-flow
  color: string;
  size: number;
  life: number;
  maxLife: number;
  opacity: number;
  rotation?: number;
  rotationSpeed?: number;
  text?: string; // For XP numbers
  interactive?: boolean; // Reacts to mouse
  connected?: boolean; // Part of the constellation network
}

export interface ParticleEffect {
  type: ParticleEffectType;
  position: Vector2;
  color?: string;
  duration?: number;
  intensity?: number;
  text?: string; // For XP numbers
  onComplete?: () => void;
}

class ParticleEngineClass {
  private particles: Particle[] = [];
  private particlePool: Particle[] = [];
  private nextId = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private lastTime = 0;

  // Mouse state
  private mouseX = -1000;
  private mouseY = -1000;
  private isMouseDown = false;

  // Performance optimization
  private readonly MAX_PARTICLES = 800; // Increased for background nodes
  private readonly TARGET_FPS = 60;
  private readonly FRAME_TIME = 1000 / this.TARGET_FPS;
  private fpsHistory: number[] = [];
  private frameCount = 0;
  private lastFpsCheck = 0;
  private currentFps = 60;
  private qualityLevel: 'high' | 'medium' | 'low' = 'high';

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse listeners
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    window.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(effect: ParticleEffect) {
    // Adjust particle count based on performance
    let particleCount = this.calculateParticleCount(effect.type, effect.intensity);
    particleCount = this.adjustForPerformance(particleCount);

    // Prevent exceeding max particles
    const availableSlots = this.MAX_PARTICLES - this.particles.length;
    particleCount = Math.min(particleCount, availableSlots);

    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(effect, i, particleCount);
      this.particles.push(particle);
    }

    if (effect.onComplete) {
      setTimeout(effect.onComplete, (effect.duration || 1000));
    }
  }

  // New: Spawn a persistent background field
  spawnBackgroundField() {
    this.clear();
    const count = this.qualityLevel === 'high' ? 80 : this.qualityLevel === 'medium' ? 40 : 15;

    for (let i = 0; i < count; i++) {
      const particle = this.getFromPool();
      particle.id = `bg-${i}`;
      particle.type = 'constellation-node';
      particle.position = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      };

      const speed = 0.2 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;

      particle.velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
      particle.baseVelocity = { ...particle.velocity };

      particle.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4'; // Violet or Cyan
      particle.size = 1 + Math.random() * 2;
      particle.life = 999999; // Persistent
      particle.maxLife = 999999;
      particle.opacity = 0.3 + Math.random() * 0.4;
      particle.interactive = true;
      particle.connected = true;

      this.particles.push(particle);
    }
  }

  private adjustForPerformance(count: number): number {
    switch (this.qualityLevel) {
      case 'low':
        return Math.floor(count * 0.3);
      case 'medium':
        return Math.floor(count * 0.6);
      case 'high':
      default:
        return count;
    }
  }

  private calculateParticleCount(type: ParticleEffectType, intensity = 1): number {
    const baseCounts: Record<ParticleEffectType, number> = {
      'quantum-foam': 50,
      'probability-cloud': 30,
      'entanglement-beam': 20,
      'measurement-collapse': 40,
      'teleport-trail': 25,
      'xp-gain': 1, // Single floating number
      'level-up': 60,
      'achievement-unlock': 50,
      'explosion': 35,
      'constellation-node': 1
    };
    return Math.floor(baseCounts[type] * intensity);
  }

  private createParticle(effect: ParticleEffect, index: number, total: number): Particle {
    const particle = this.getFromPool();
    particle.id = `particle-${this.nextId++}`;
    particle.type = effect.type;
    particle.position = { ...effect.position };
    particle.color = effect.color || this.getDefaultColor(effect.type);
    particle.maxLife = effect.duration || this.getDefaultDuration(effect.type);
    particle.life = particle.maxLife;
    particle.opacity = 1;
    particle.interactive = false; // Default off for transient particles
    particle.connected = false;

    // Type-specific initialization
    switch (effect.type) {
      case 'quantum-foam':
        this.initQuantumFoam(particle, index, total);
        break;
      case 'probability-cloud':
        this.initProbabilityCloud(particle, index, total);
        break;
      case 'entanglement-beam':
        this.initEntanglementBeam(particle, index, total);
        break;
      case 'measurement-collapse':
        this.initMeasurementCollapse(particle, index, total);
        break;
      case 'teleport-trail':
        this.initTeleportTrail(particle, index, total);
        break;
      case 'xp-gain':
        this.initXPGain(particle, effect.text || '+0');
        break;
      case 'level-up':
        this.initLevelUp(particle, index, total);
        break;
      case 'achievement-unlock':
        this.initAchievementUnlock(particle, index, total);
        break;
      case 'explosion':
        this.initExplosion(particle, index, total);
        break;
    }

    particle.baseVelocity = { ...particle.velocity };
    return particle;
  }

  private initQuantumFoam(particle: Particle, index: number, total: number) {
    const angle = (index / total) * Math.PI * 2;
    const speed = 0.5 + Math.random() * 0.5;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    particle.size = 2 + Math.random() * 3;
    particle.interactive = true;
  }

  private initProbabilityCloud(particle: Particle, index: number, total: number) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.4;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    particle.size = 3 + Math.random() * 5;
    particle.opacity = 0.3 + Math.random() * 0.4;
    particle.interactive = true;
  }

  private initEntanglementBeam(particle: Particle, index: number, total: number) {
    const progress = index / total;
    particle.velocity = { x: 0, y: 0 };
    particle.size = 2 + Math.sin(progress * Math.PI) * 3;
    particle.rotation = progress * Math.PI * 2;
  }

  private initMeasurementCollapse(particle: Particle, index: number, total: number) {
    const angle = (index / total) * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    particle.size = 3 + Math.random() * 4;
  }

  private initTeleportTrail(particle: Particle, index: number, total: number) {
    particle.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: -1 - Math.random() * 2
    };
    particle.size = 2 + Math.random() * 4;
    particle.rotation = Math.random() * Math.PI * 2;
    particle.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  private initXPGain(particle: Particle, text: string) {
    particle.velocity = { x: 0, y: -2 };
    particle.size = 24;
    particle.text = text;
  }

  private initLevelUp(particle: Particle, index: number, total: number) {
    const angle = (index / total) * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed - 1
    };
    particle.size = 4 + Math.random() * 6;
    particle.rotation = Math.random() * Math.PI * 2;
    particle.rotationSpeed = (Math.random() - 0.5) * 0.3;
    particle.interactive = true;
  }

  private initAchievementUnlock(particle: Particle, index: number, total: number) {
    const angle = (index / total) * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed - 0.5
    };
    particle.size = 3 + Math.random() * 5;
    particle.interactive = true;
  }

  private initExplosion(particle: Particle, index: number, total: number) {
    const angle = (index / total) * Math.PI * 2;
    const speed = 3 + Math.random() * 4;
    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    particle.size = 4 + Math.random() * 6;
    particle.interactive = true;
  }

  private getDefaultColor(type: ParticleEffectType): string {
    const colors: Record<ParticleEffectType, string> = {
      'quantum-foam': '#06b6d4',
      'probability-cloud': '#8b5cf6',
      'entanglement-beam': '#ec4899',
      'measurement-collapse': '#f59e0b',
      'teleport-trail': '#3b82f6',
      'xp-gain': '#10b981',
      'level-up': '#fbbf24',
      'achievement-unlock': '#f59e0b',
      'explosion': '#ef4444',
      'constellation-node': '#ffffff'
    };
    return colors[type];
  }

  private getDefaultDuration(type: ParticleEffectType): number {
    const durations: Record<ParticleEffectType, number> = {
      'quantum-foam': 2000,
      'probability-cloud': 1500,
      'entanglement-beam': 1000,
      'measurement-collapse': 800,
      'teleport-trail': 1200,
      'xp-gain': 1500,
      'level-up': 2000,
      'achievement-unlock': 2000,
      'explosion': 1000,
      'constellation-node': 999999
    };
    return durations[type];
  }

  private getFromPool(): Particle {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop()!;
    }
    return {
      id: '',
      type: 'quantum-foam',
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      baseVelocity: { x: 0, y: 0 },
      color: '#ffffff',
      size: 1,
      life: 0,
      maxLife: 1000,
      opacity: 1
    };
  }

  private returnToPool(particle: Particle) {
    if (this.particlePool.length < 1000) {
      this.particlePool.push(particle);
    }
  }

  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Update life for non-persistent particles
      if (particle.maxLife < 999999) {
        particle.life -= deltaTime;
        if (particle.life <= 0) {
          this.returnToPool(particle);
          this.particles.splice(i, 1);
          continue;
        }
      } else {
        // For persistent background particles, wrap around screen
        if (particle.position.x < -50) particle.position.x = window.innerWidth + 50;
        if (particle.position.x > window.innerWidth + 50) particle.position.x = -50;
        if (particle.position.y < -50) particle.position.y = window.innerHeight + 50;
        if (particle.position.y > window.innerHeight + 50) particle.position.y = -50;
      }

      // Mouse Interaction Calculations
      if (particle.interactive && this.mouseX > -100) {
        const dx = this.mouseX - particle.position.x;
        const dy = this.mouseY - particle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (distance < interactionRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;

          // Repel or Attract? (Let's repel for "quantum fluctuation" feel)
          const forceStrength = (1 - distance / interactionRadius) * 2;

          if (this.isMouseDown) {
            // Attraction when clicking (Gravity well)
            particle.velocity.x += forceDirectionX * forceStrength;
            particle.velocity.y += forceDirectionY * forceStrength;
          } else {
            // Repulsion normally (Quantum exclusion)
            particle.velocity.x -= forceDirectionX * forceStrength * 0.5;
            particle.velocity.y -= forceDirectionY * forceStrength * 0.5;
          }
        }
      }

      // Return to base velocity (drag/friction)
      const friction = 0.95;
      particle.velocity.x = particle.velocity.x * friction + particle.baseVelocity.x * (1 - friction);
      particle.velocity.y = particle.velocity.y * friction + particle.baseVelocity.y * (1 - friction);

      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;

      // Update rotation
      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed;
      }

      // Update opacity based on life (for transient particles)
      if (particle.maxLife < 999999) {
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = Math.min(1, lifeRatio * 2);
      }

      // Gravity for specific types
      if (particle.type === 'explosion' || particle.type === 'measurement-collapse') {
        particle.velocity.y += 0.05;
      }
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Constellation Lines (Entanglement Network)
    // Only if quality is high enough
    if ((this.qualityLevel === 'high' || this.qualityLevel === 'medium') && this.particles.length > 0) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.5;

      const connectDistance = 150;

      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        if (!p1.connected) continue;

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          if (!p2.connected) continue;

          const dx = p1.position.x - p2.position.x;
          const dy = p1.position.y - p2.position.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistance * connectDistance) {
            const opacity = 1 - Math.sqrt(distSq) / connectDistance;
            this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`; // Violet-ish
            this.ctx.moveTo(p1.position.x, p1.position.y);
            this.ctx.lineTo(p2.position.x, p2.position.y);
          }
        }
      }
      this.ctx.stroke();
    }

    // Draw Particles
    for (const particle of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.translate(particle.position.x, particle.position.y);

      if (particle.rotation !== undefined) {
        this.ctx.rotate(particle.rotation);
      }

      if (particle.text) {
        // Render text (for XP gain)
        this.ctx.font = `bold ${particle.size}px Outfit, sans-serif`;
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = particle.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(particle.text, 0, 0);
      } else {
        // Render particle with glow
        this.ctx.fillStyle = particle.color;

        // Add glow for quality modes
        if (this.qualityLevel === 'high') {
          this.ctx.shadowColor = particle.color;
          this.ctx.shadowBlur = particle.size * 2;
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  start() {
    if (this.animationFrameId !== null) return;

    this.lastTime = performance.now();
    this.lastFpsCheck = this.lastTime;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // FPS monitoring
      this.frameCount++;
      if (currentTime - this.lastFpsCheck >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsCheck = currentTime;
        this.adjustQuality();
      }

      // Only update and render if we have time in the frame budget
      if (deltaTime < this.FRAME_TIME * 2) {
        this.update(deltaTime);
        this.render();
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private adjustQuality() {
    this.fpsHistory.push(this.currentFps);
    if (this.fpsHistory.length > 5) {
      this.fpsHistory.shift();
    }

    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // Adjust quality based on FPS
    if (avgFps < 30 && this.qualityLevel !== 'low') {
      this.qualityLevel = 'low';
      // Re-spawn fewer background particles
      this.spawnBackgroundField();
      console.log('🎮 Particle quality reduced to LOW for performance');
    } else if (avgFps < 45 && this.qualityLevel === 'high') {
      this.qualityLevel = 'medium';
      this.spawnBackgroundField();
      console.log('🎮 Particle quality reduced to MEDIUM for performance');
    } else if (avgFps > 55 && this.qualityLevel !== 'high') {
      this.qualityLevel = 'high';
      // We could add more particles here but better to stay stable
      console.log('🎮 Particle quality increased to HIGH');
    }
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  clear() {
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  getFPS(): number {
    return this.currentFps;
  }

  getQualityLevel(): 'high' | 'medium' | 'low' {
    return this.qualityLevel;
  }

  setQualityLevel(level: 'high' | 'medium' | 'low') {
    this.qualityLevel = level;
  }
}

export const ParticleEngine = new ParticleEngineClass();

