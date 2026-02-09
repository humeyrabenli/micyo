import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { SettingsProvider } from '../context/SettingsProvider';
import useSettings from '../hooks/useSettings';

const wrapper = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe('SettingsProvider', () => {
  it('should render children', () => {
    render(
      <SettingsProvider>
        <div data-testid="child">Hello</div>
      </SettingsProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should initialize with empty settings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings).toEqual([]);
  });

  it('should add a setting', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('theme', 'dark');
    });

    expect(result.current.settings).toHaveLength(1);
    expect(result.current.settings[0]).toEqual({ id: 'theme', value: 'dark' });
  });

  it('should add multiple settings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('theme', 'dark');
    });

    act(() => {
      result.current.addSetting('language', 'tr');
    });

    expect(result.current.settings).toHaveLength(2);
    expect(result.current.settings).toContainEqual({ id: 'theme', value: 'dark' });
    expect(result.current.settings).toContainEqual({ id: 'language', value: 'tr' });
  });

  it('should get a setting by id', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('apiUrl', 'https://api.example.com');
    });

    expect(result.current.getSetting('apiUrl', '')).toBe('https://api.example.com');
  });

  it('should return default value when setting not found', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.getSetting('nonExistent', 'default-value')).toBe('default-value');
  });

  it('should get correct setting among multiple settings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('key1', 'value1');
    });

    act(() => {
      result.current.addSetting('key2', 'value2');
    });

    act(() => {
      result.current.addSetting('key3', 'value3');
    });

    expect(result.current.getSetting('key2', null)).toBe('value2');
  });

  it('should handle object values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    const config = { debug: true, version: '1.0.0' };

    act(() => {
      result.current.addSetting('config', config);
    });

    expect(result.current.getSetting('config', null)).toEqual(config);
  });

  it('should handle array values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    const features = ['feature1', 'feature2', 'feature3'];

    act(() => {
      result.current.addSetting('features', features);
    });

    expect(result.current.getSetting('features', [])).toEqual(features);
  });

  it('should handle numeric values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('maxRetries', 3);
    });

    expect(result.current.getSetting('maxRetries', 0)).toBe(3);
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('darkMode', true);
    });

    expect(result.current.getSetting('darkMode', false)).toBe(true);
  });

  it('should allow setting all settings at once with setSettings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setSettings([
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
      ]);
    });

    expect(result.current.settings).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ]);
  });

  it('should return default value for falsy setting value', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.addSetting('empty', '');
    });

    // Note: Since implementation uses `setting?.value || defaultValue`,
    // falsy values will return the default
    expect(result.current.getSetting('empty', 'fallback')).toBe('fallback');
  });
});
