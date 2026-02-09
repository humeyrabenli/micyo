import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Input from '../input/Input';

// Mock styled-components to avoid issues in test env
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

// Mock useFormContext to return empty context
vi.mock('../form/hooks/useFormContext', () => ({
  __esModule: true,
  default: () => ({}),
}));

// Mock react-hook-form get
vi.mock('react-hook-form', () => ({
  get: () => undefined,
}));

describe('Input Component', () => {
  it('should render an input element', () => {
    render(<Input name="email" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input name="username" label="Username" />);

    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should default to text type', () => {
    render(<Input name="name" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('should accept custom type', () => {
    render(<Input name="email" type="email" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('should have correct name attribute', () => {
    render(<Input name="firstName" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'firstName');
  });

  it('should accept user input', () => {
    render(<Input name="test" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello World' } });

    expect(input).toHaveValue('Hello World');
  });

  it('should use provided id', () => {
    render(<Input name="test" id="custom-id" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
  });

  it('should render description text', () => {
    render(<Input name="test" desc="Enter your name" />);

    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });
});
