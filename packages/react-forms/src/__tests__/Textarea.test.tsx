import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Textarea from '../textarea/Textarea';

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

describe('Textarea Component', () => {
  it('should render a textarea element', () => {
    render(<Textarea name="message" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Textarea name="comment" label="Your Comment" />);

    expect(screen.getByText('Your Comment')).toBeInTheDocument();
  });

  it('should have correct name attribute', () => {
    render(<Textarea name="bio" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'bio');
  });

  it('should accept user input', () => {
    render(<Textarea name="message" />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello World' } });

    expect(textarea).toHaveValue('Hello World');
  });

  it('should use provided id', () => {
    render(<Textarea name="test" id="my-textarea" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
  });

  it('should render description text', () => {
    render(<Textarea name="test" desc="Max 500 characters" />);

    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });
});
