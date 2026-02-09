import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Legend from '../legend/Legend';
import Fieldset from '../fieldset/Fieldset';

// Mock styled-components
vi.mock('styled-components', () => ({
  __esModule: true,
  default: {
    fieldset: (strings: any) => {
      const Component = ({ children, className, ...props }: any) => (
        <fieldset className={className} {...props}>{children}</fieldset>
      );
      Component.displayName = 'StyledFieldset';
      return Component;
    },
  },
}));

describe('Legend Component', () => {
  it('should render legend text', () => {
    render(
      <fieldset>
        <Legend>My Legend</Legend>
      </fieldset>
    );

    expect(screen.getByText('My Legend')).toBeInTheDocument();
  });

  it('should have micyo-legend class', () => {
    render(
      <fieldset>
        <Legend>Text</Legend>
      </fieldset>
    );

    const legend = screen.getByText('Text');
    expect(legend).toHaveClass('micyo-legend');
  });

  it('should accept custom className', () => {
    render(
      <fieldset>
        <Legend className="custom">Text</Legend>
      </fieldset>
    );

    const legend = screen.getByText('Text');
    expect(legend).toHaveClass('micyo-legend');
    expect(legend).toHaveClass('custom');
  });
});

describe('Fieldset Component', () => {
  it('should render children', () => {
    render(
      <Fieldset>
        <div data-testid="child">Content</div>
      </Fieldset>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render legend when provided', () => {
    render(
      <Fieldset legend="Personal Info">
        <div>Fields here</div>
      </Fieldset>
    );

    expect(screen.getByText('Personal Info')).toBeInTheDocument();
  });

  it('should not render legend when not provided', () => {
    render(
      <Fieldset>
        <div>Fields here</div>
      </Fieldset>
    );

    expect(screen.queryByRole('legend')).toBeNull();
  });

  it('should have micyo-fieldset class', () => {
    render(
      <Fieldset>
        <div>Content</div>
      </Fieldset>
    );

    const fieldset = screen.getByRole('group');
    expect(fieldset).toHaveClass('micyo-fieldset');
  });
});
