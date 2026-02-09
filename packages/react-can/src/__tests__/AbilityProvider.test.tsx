import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { AbilityProvider } from '../context/AbilityProvider';
import useAbility from '../hooks/useAbility';

const createWrapper =
  (list?: string[], persistent?: boolean) =>
  ({ children }: { children: ReactNode }) => (
    <AbilityProvider list={list} persistent={persistent}>
      {children}
    </AbilityProvider>
  );

describe('AbilityProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should render children', () => {
    render(
      <AbilityProvider list={[]}>
        <div data-testid="child">Hello</div>
      </AbilityProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('should initialize with provided list', () => {
    const wrapper = createWrapper(['read', 'write'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    expect(result.current.abilities).toEqual(['read', 'write']);
  });

  it('should add a single ability', () => {
    const wrapper = createWrapper([], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.addAbility('delete');
    });

    expect(result.current.abilities).toContain('delete');
  });

  it('should not add duplicate abilities', () => {
    const wrapper = createWrapper(['read'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.addAbility('read');
    });

    const readCount = result.current.abilities.filter((a) => a === 'read').length;
    expect(readCount).toBe(1);
  });

  it('should add multiple abilities at once', () => {
    const wrapper = createWrapper([], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.addAbilities(['read', 'write', 'delete']);
    });

    expect(result.current.abilities).toContain('read');
    expect(result.current.abilities).toContain('write');
    expect(result.current.abilities).toContain('delete');
  });

  it('should not duplicate when adding multiple abilities', () => {
    const wrapper = createWrapper(['read'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.addAbilities(['read', 'write']);
    });

    const readCount = result.current.abilities.filter((a) => a === 'read').length;
    expect(readCount).toBe(1);
    expect(result.current.abilities).toContain('write');
  });

  it('should remove a single ability', () => {
    const wrapper = createWrapper(['read', 'write', 'delete'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.removeAbility('write');
    });

    expect(result.current.abilities).not.toContain('write');
    expect(result.current.abilities).toContain('read');
    expect(result.current.abilities).toContain('delete');
  });

  it('should remove multiple abilities at once', () => {
    const wrapper = createWrapper(['read', 'write', 'delete', 'admin'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.removeAbilities(['write', 'admin']);
    });

    expect(result.current.abilities).not.toContain('write');
    expect(result.current.abilities).not.toContain('admin');
    expect(result.current.abilities).toContain('read');
    expect(result.current.abilities).toContain('delete');
  });

  it('should clear all abilities', () => {
    const wrapper = createWrapper(['read', 'write', 'delete'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.clearAbilities();
    });

    expect(result.current.abilities).toEqual([]);
  });

  it('should check if ability exists with can()', () => {
    const wrapper = createWrapper(['read', 'write'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    expect(result.current.can('read')).toBe(true);
    expect(result.current.can('write')).toBe(true);
    expect(result.current.can('delete')).toBe(false);
  });

  it('should update can() after adding ability', () => {
    const wrapper = createWrapper([], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    expect(result.current.can('read')).toBe(false);

    act(() => {
      result.current.addAbility('read');
    });

    expect(result.current.can('read')).toBe(true);
  });

  it('should update can() after removing ability', () => {
    const wrapper = createWrapper(['read'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    expect(result.current.can('read')).toBe(true);

    act(() => {
      result.current.removeAbility('read');
    });

    expect(result.current.can('read')).toBe(false);
  });

  it('should set abilities directly with setAbilities', () => {
    const wrapper = createWrapper([], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.setAbilities(['admin', 'superuser']);
    });

    expect(result.current.abilities).toEqual(['admin', 'superuser']);
  });

  it('should handle removing non-existent ability gracefully', () => {
    const wrapper = createWrapper(['read'], false);

    const { result } = renderHook(() => useAbility(), { wrapper });

    act(() => {
      result.current.removeAbility('nonexistent');
    });

    expect(result.current.abilities).toEqual(['read']);
  });
});
