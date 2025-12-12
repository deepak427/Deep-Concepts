/**
 * Performance monitoring utilities
 * Tracks and logs performance metrics for optimization
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;

  /**
   * Measure execution time of a function
   */
  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    return result;
  }

  /**
   * Measure execution time of an async function
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    return result;
  }

  /**
   * Start a manual measurement
   */
  start(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, duration: number): void {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    });

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // Log slow operations
    this.checkThresholds(name, duration);
  }

  /**
   * Check if operation exceeds performance thresholds
   */
  private checkThresholds(name: string, duration: number): void {
    const thresholds: Record<string, number> = {
      'persistence': 50,
      'circuit-simulation': 100,
      'three-js-render': 16.67, // 60 FPS
      'state-update': 10
    };

    const threshold = thresholds[name];
    if (threshold && duration > threshold) {
      console.warn(
        `⚠️ Performance: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }
  }

  /**
   * Get average duration for a specific metric
   */
  getAverage(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
  }

  /**
   * Get all metrics for a specific name
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, { count: number; avg: number; max: number }> {
    const summary: Record<string, { count: number; avg: number; max: number }> = {};

    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, avg: 0, max: 0 };
      }

      summary[metric.name].count++;
      summary[metric.name].max = Math.max(summary[metric.name].max, metric.duration);
    }

    // Calculate averages
    for (const name in summary) {
      summary[name].avg = this.getAverage(name);
    }

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const summary = this.getSummary();
    console.table(summary);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.performanceMonitor = performanceMonitor;
}
