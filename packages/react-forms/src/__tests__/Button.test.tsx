import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Button from '../button/Button';
import Submit from '../button/Submit';

describe('Button Component', () => {
  it('should render with label', () => {
    render(<Button label="Click Me" type="button" />);

    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('should have correct button type', () => {
    render(<Button label="Submit" type="submit" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should default to button type', () => {
    render(<Button label="Default" type="button" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should handle click event', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" type="button" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have micyo-btn class', () => {
    render(<Button label="Styled" type="button" />);

    expect(screen.getByRole('button')).toHaveClass('micyo-btn');
  });

  it('should merge custom className', () => {
    render(<Button label="Custom" type="button" className="my-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('micyo-btn');
    expect(button).toHaveClass('my-class');
  });

  it('should render without label', () => {
    render(<Button type="button" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('Submit Component', () => {
  it('should render as submit type', () => {
    render(<Submit label="Send" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should display label text', () => {
    render(<Submit label="Submit Form" />);

    expect(screen.getByRole('button')).toHaveTextContent('Submit Form');
  });

  it('should have micyo-btn class', () => {
    render(<Submit label="Go" />);

    expect(screen.getByRole('button')).toHaveClass('micyo-btn');
  });
});
