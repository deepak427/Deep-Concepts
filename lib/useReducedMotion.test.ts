import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion, setReducedMotionPreference, clearReducedMotionPreference } from './useReducedMotion';

describe('useReducedMotion', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false by default when no preference is set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when system preference is set to reduce', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should respect user override from localStorage', () => {
    localStorage.setItem('reducedMotion', 'true');
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should update when user preference is set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      setReducedMotionPreference(true);
    });

    expect(localStorage.getItem('reducedMotion')).toBe('true');
  });

  it('should clear user preference', () => {
    localStorage.setItem('reducedMotion', 'true');
    
    act(() => {
      clearReducedMotionPreference();
    });

    expect(localStorage.getItem('reducedMotion')).toBeNull();
  });

  it('should prioritize user override over system preference', () => {
    // System says reduce motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // But user explicitly disabled it
    localStorage.setItem('reducedMotion', 'false');
    
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
