import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useFieldId from '../hooks/useFieldId';

describe('useFieldId', () => {
  it('should return provided id when given', () => {
    const { result } = renderHook(() => useFieldId('my-custom-id'));

    expect(result.current).toBe('my-custom-id');
  });

  it('should generate an id when none is provided', () => {
    const { result } = renderHook(() => useFieldId(undefined));

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe('string');
  });

  it('should generate unique ids for different instances', () => {
    const { result: result1 } = renderHook(() => useFieldId(undefined));
    const { result: result2 } = renderHook(() => useFieldId(undefined));

    expect(result1.current).not.toBe(result2.current);
  });

  it('should always return same custom id', () => {
    const { result, rerender } = renderHook(() => useFieldId('stable-id'));

    expect(result.current).toBe('stable-id');

    rerender();

    expect(result.current).toBe('stable-id');
  });
});
