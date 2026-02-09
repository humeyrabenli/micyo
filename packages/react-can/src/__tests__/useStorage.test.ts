import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useStorage from '../hooks/useStorage';

describe('useStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set and get an item from localStorage', () => {
    const { result } = renderHook(() => useStorage());

    act(() => {
      result.current.setItem('testKey', 'testValue');
    });

    expect(result.current.getItem('testKey')).toBe('testValue');
  });

  it('should return null for non-existent key', () => {
    const { result } = renderHook(() => useStorage());

    expect(result.current.getItem('nonExistentKey')).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const { result } = renderHook(() => useStorage());

    act(() => {
      result.current.setItem('testKey', 'testValue');
    });

    expect(result.current.getItem('testKey')).toBe('testValue');

    act(() => {
      result.current.removeItem('testKey');
    });

    expect(result.current.getItem('testKey')).toBeNull();
  });

  it('should overwrite existing item', () => {
    const { result } = renderHook(() => useStorage());

    act(() => {
      result.current.setItem('key', 'value1');
    });

    expect(result.current.getItem('key')).toBe('value1');

    act(() => {
      result.current.setItem('key', 'value2');
    });

    expect(result.current.getItem('key')).toBe('value2');
  });

  it('should handle localStorage errors gracefully for setItem', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useStorage());

    act(() => {
      result.current.setItem('key', 'value');
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain('Error setting localStorage key');
  });

  it('should handle localStorage errors gracefully for getItem', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    const { result } = renderHook(() => useStorage());

    const value = result.current.getItem('key');

    expect(value).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain('Error getting localStorage key');
  });

  it('should handle localStorage errors gracefully for removeItem', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    const { result } = renderHook(() => useStorage());

    act(() => {
      result.current.removeItem('key');
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain('Error deleting localStorage key');
  });
});
