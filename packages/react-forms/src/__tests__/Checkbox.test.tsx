import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Checkbox from '../checkbox/Checkbox';

// Mock styled-components
vi.mock('styled-components', () => ({
  __esModule: true,
  default: {
    div: (strings: any) => {
      const Component = ({ children, className, ...props }: any) => (
        <div className={className} {...props}>{children}</div>
      );
      Component.displayName = 'StyledDiv';
      return Component;
    },
  },
}));

// Mock useFormContext
vi.mock('../form/hooks/useFormContext', () => ({
  __esModule: true,
  default: () => ({}),
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  get: () => undefined,
}));

describe('Checkbox Component', () => {
  it('should render a single checkbox', () => {
    render(<Checkbox name="agree" label="I agree" />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('I agree')).toBeInTheDocument();
  });

  it('should toggle checkbox on click', () => {
    render(<Checkbox name="agree" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should have correct name attribute', () => {
    render(<Checkbox name="terms" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'terms');
  });

  it('should render checkbox group from list prop', () => {
    const list = [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ];

    render(<Checkbox name="options" label="Choose options" list={list} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('should render group label', () => {
    const list = [{ label: 'A', value: 'a' }];

    render(<Checkbox name="group" label="My Group" list={list} />);

    expect(screen.getByText('My Group')).toBeInTheDocument();
  });
});
