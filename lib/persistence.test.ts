import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PersistenceService } from './persistence';

describe('PersistenceService', () => {
  let service: PersistenceService;
  const testKey = 'test-state';

  beforeEach(() => {
    service = new PersistenceService(testKey);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save and load', () => {
    it('saves and loads simple state', () => {
      const state = { count: 42, name: 'test' };
      service.saveImmediate(state); // Use immediate save for testing
      const loaded = service.load();
      expect(loaded).toEqual(state);
    });

    it('saves and loads complex state', () => {
      const state = {
        nested: { value: 123 },
        array: [1, 2, 3],
        string: 'hello'
      };
      service.saveImmediate(state); // Use immediate save for testing
      const loaded = service.load();
      expect(loaded).toEqual(state);
    });

    it('returns null when no data exists', () => {
      const loaded = service.load();
      expect(loaded).toBeNull();
    });

    it('preserves Date objects', () => {
      const now = new Date();
      const state = { timestamp: now };
      service.saveImmediate(state); // Use immediate save for testing
      const loaded = service.load<typeof state>();
      expect(loaded?.timestamp).toBeInstanceOf(Date);
      expect(loaded?.timestamp.getTime()).toBe(now.getTime());
    });
  });

  describe('clear', () => {
    it('removes saved state', () => {
      const state = { value: 123 };
      service.saveImmediate(state); // Use immediate save for testing
      service.clear();
      const loaded = service.load();
      expect(loaded).toBeNull();
    });
  });

  describe('error handling', () => {
    it('handles localStorage unavailable gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const state = { value: 123 };
      expect(() => service.save(state)).not.toThrow();

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });

    it('falls back to in-memory storage on error', () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem;
      const originalGetItem = Storage.prototype.getItem;
      
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const newService = new PersistenceService('fallback-test');
      const state = { value: 456 };
      
      newService.saveImmediate(state); // Use immediate save for testing
      const loaded = newService.load();
      expect(loaded).toEqual(state);

      // Restore
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('isAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(service.isAvailable()).toBe(true);
    });
  });
});
