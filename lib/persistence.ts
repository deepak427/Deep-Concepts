// localStorage persistence with error handling and performance optimization
import { performanceMonitor } from './performanceMonitor';

export class PersistenceService {
  private inMemoryState: Record<string, unknown> = {};
  private storageAvailable: boolean = true;
  private saveTimeout: NodeJS.Timeout | null = null;
  private pendingState: unknown = null;

  constructor(private storageKey: string = 'learning-state') {
    this.checkStorageAvailability();
  }

  private checkStorageAvailability(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.storageAvailable = true;
    } catch (error) {
      console.warn('localStorage unavailable, using in-memory storage', error);
      this.storageAvailable = false;
    }
  }

  // Debounced save for performance (< 50ms target)
  save<T>(state: T): void {
    // Store in memory immediately
    this.pendingState = state;
    this.inMemoryState[this.storageKey] = state;

    // Debounce localStorage writes
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      performanceMonitor.measure('persistence', () => {
        this.flushToStorage();
      });
    }, 100); // Debounce by 100ms
  }

  // Immediate save without debouncing
  saveImmediate<T>(state: T): void {
    this.pendingState = state;
    this.inMemoryState[this.storageKey] = state;
    performanceMonitor.measure('persistence', () => {
      this.flushToStorage();
    });
  }

  private flushToStorage(): void {
    if (!this.pendingState) return;

    if (this.storageAvailable) {
      try {
        const serialized = JSON.stringify(this.pendingState);
        localStorage.setItem(this.storageKey, serialized);
        this.pendingState = null;
      } catch (error) {
        console.warn('localStorage save failed, using in-memory storage', error);
        this.storageAvailable = false;
      }
    }
  }

  load<T>(): T | null {
    if (this.storageAvailable) {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return null;
        
        return JSON.parse(data, this.dateReviver) as T;
      } catch (error) {
        console.warn('localStorage read failed, using in-memory storage', error);
        this.storageAvailable = false;
        return (this.inMemoryState[this.storageKey] as T) || null;
      }
    } else {
      return (this.inMemoryState[this.storageKey] as T) || null;
    }
  }

  clear(): void {
    if (this.storageAvailable) {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (error) {
        console.warn('localStorage clear failed', error);
      }
    }
    delete this.inMemoryState[this.storageKey];
  }

  // Reviver function to restore Date objects
  private dateReviver(key: string, value: unknown): unknown {
    if (typeof value === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }

  isAvailable(): boolean {
    return this.storageAvailable;
  }
}

export const persistenceService = new PersistenceService();
