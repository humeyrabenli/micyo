import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { WPProvider } from '../context/WPProvider';
import { useWPContext } from '../hooks/useWPContext';

// Mock @wordpress/api-fetch
vi.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: Object.assign(vi.fn(), {
    use: vi.fn(),
    createRootURLMiddleware: vi.fn((url: string) => url),
  }),
}));

const createWrapper =
  (api: string, namespace?: string) =>
  ({ children }: { children: ReactNode }) => (
    <WPProvider api={api} namespace={namespace}>
      {children}
    </WPProvider>
  );

describe('WPProvider', () => {
  it('should render children', () => {
    render(
      <WPProvider api="https://example.com/wp-json">
        <div data-testid="child">Hello WP</div>
      </WPProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide api value through context', () => {
    const wrapper = createWrapper('https://example.com/wp-json');

    const { result } = renderHook(() => useWPContext(), { wrapper });

    expect(result.current.api).toBe('https://example.com/wp-json');
  });

  it('should default namespace to /wp/v2', () => {
    const wrapper = createWrapper('https://example.com/wp-json');

    const { result } = renderHook(() => useWPContext(), { wrapper });

    expect(result.current.namespace).toBe('/wp/v2');
  });

  it('should accept custom namespace', () => {
    const wrapper = createWrapper('https://example.com/wp-json', '/wp/v3');

    const { result } = renderHook(() => useWPContext(), { wrapper });

    expect(result.current.namespace).toBe('/wp/v3');
  });

  it('should provide clickEvent through context', () => {
    const clickEvent = vi.fn();

    const wrapper = ({ children }: { children: ReactNode }) => (
      <WPProvider api="https://example.com/wp-json" clickEvent={clickEvent}>
        {children}
      </WPProvider>
    );

    const { result } = renderHook(() => useWPContext(), { wrapper });

    expect(result.current.clickEvent).toBe(clickEvent);
  });

  it('should provide formatDate through context', () => {
    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    const wrapper = ({ children }: { children: ReactNode }) => (
      <WPProvider api="https://example.com/wp-json" formatDate={formatDate}>
        {children}
      </WPProvider>
    );

    const { result } = renderHook(() => useWPContext(), { wrapper });

    expect(result.current.formatDate).toBe(formatDate);
  });
});
