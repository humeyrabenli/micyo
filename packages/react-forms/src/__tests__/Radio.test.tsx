import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Radio from '../radio/Radio';

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

describe('Radio Component', () => {
  it('should render a single radio button', () => {
    render(<Radio name="choice" label="Option 1" value="1" />);

    expect(screen.getByRole('radio')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should have correct type attribute', () => {
    render(<Radio name="choice" value="1" />);

    expect(screen.getByRole('radio')).toHaveAttribute('type', 'radio');
  });

  it('should have correct name attribute', () => {
    render(<Radio name="gender" value="male" />);

    expect(screen.getByRole('radio')).toHaveAttribute('name', 'gender');
  });

  it('should render radio group from list prop', () => {
    const list = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ];

    render(<Radio name="gender" label="Gender" list={list} />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('should share the same name in radio group', () => {
    const list = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];

    render(<Radio name="letter" list={list} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'letter');
    });
  });

  it('should render group label', () => {
    const list = [{ label: 'Option', value: 'opt' }];

    render(<Radio name="test" label="Pick One" list={list} />);

    expect(screen.getByText('Pick One')).toBeInTheDocument();
  });

  it('should allow selecting radio in group', () => {
    const list = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];

    render(<Radio name="letter" list={list} />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);

    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });
});
