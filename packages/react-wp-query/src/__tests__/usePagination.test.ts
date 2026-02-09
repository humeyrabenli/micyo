import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';

describe('usePagination', () => {
  it('should return default pagination values', () => {
    const { result } = renderHook(() => usePagination(undefined));

    expect(result.current.pagination).toEqual({
      pages: 1,
      total: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('should return hasNext=false and hasPrev=false when page is undefined', () => {
    const { result } = renderHook(() => usePagination(undefined));

    expect(result.current.pagination.hasNext).toBe(false);
    expect(result.current.pagination.hasPrev).toBe(false);
  });

  it('should return hasPrev=false when page is 1', () => {
    const { result } = renderHook(() => usePagination(1));

    expect(result.current.pagination.hasPrev).toBe(false);
  });

  it('should update pagination when headers are set', () => {
    const { result } = renderHook(() => usePagination(1));

    const mockHeaders = new Headers();
    mockHeaders.set('x-wp-total', '50');
    mockHeaders.set('x-wp-totalpages', '5');

    act(() => {
      result.current.setHeaders(() => mockHeaders);
    });

    expect(result.current.pagination.total).toBe(50);
    expect(result.current.pagination.pages).toBe(5);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(result.current.pagination.hasPrev).toBe(false);
  });

  it('should show hasPrev when page > 1', () => {
    const { result } = renderHook(() => usePagination(2));

    const mockHeaders = new Headers();
    mockHeaders.set('x-wp-total', '50');
    mockHeaders.set('x-wp-totalpages', '5');

    act(() => {
      result.current.setHeaders(() => mockHeaders);
    });

    expect(result.current.pagination.hasPrev).toBe(true);
    expect(result.current.pagination.hasNext).toBe(true);
  });

  it('should show hasNext=false when on last page', () => {
    const { result } = renderHook(() => usePagination(5));

    const mockHeaders = new Headers();
    mockHeaders.set('x-wp-total', '50');
    mockHeaders.set('x-wp-totalpages', '5');

    act(() => {
      result.current.setHeaders(() => mockHeaders);
    });

    expect(result.current.pagination.hasNext).toBe(false);
    expect(result.current.pagination.hasPrev).toBe(true);
  });

  it('should handle single page pagination', () => {
    const { result } = renderHook(() => usePagination(1));

    const mockHeaders = new Headers();
    mockHeaders.set('x-wp-total', '5');
    mockHeaders.set('x-wp-totalpages', '1');

    act(() => {
      result.current.setHeaders(() => mockHeaders);
    });

    expect(result.current.pagination.total).toBe(5);
    expect(result.current.pagination.pages).toBe(1);
    expect(result.current.pagination.hasNext).toBe(false);
    expect(result.current.pagination.hasPrev).toBe(false);
  });

  it('should initialize headers as undefined', () => {
    const { result } = renderHook(() => usePagination(1));

    expect(result.current.headers).toBeUndefined();
  });

  it('should provide setHeaders function', () => {
    const { result } = renderHook(() => usePagination(1));

    expect(typeof result.current.setHeaders).toBe('function');
  });
});
