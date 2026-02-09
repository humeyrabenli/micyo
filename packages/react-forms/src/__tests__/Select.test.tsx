import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Select from '../select/Select';
import Option from '../option/Option';
import OptionGroup from '../option/OptionGroup';

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

describe('Select Component', () => {
  it('should render a select element', () => {
    render(<Select name="country" />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select name="country" label="Country" />);

    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('should have correct name attribute', () => {
    render(<Select name="city" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'city');
  });

  it('should render children as options', () => {
    render(
      <Select name="color">
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </Select>
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Red');
    expect(options[1]).toHaveTextContent('Blue');
    expect(options[2]).toHaveTextContent('Green');
  });

  it('should render options from options prop', () => {
    const options = [
      { label: 'Turkey', value: 'tr' },
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
    ];

    render(<Select name="country" options={options} />);

    expect(screen.getByText('Turkey')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('should handle selection change', () => {
    render(
      <Select name="fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'banana' } });

    expect(select).toHaveValue('banana');
  });

  it('should use provided id', () => {
    render(<Select name="test" id="my-select" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-select');
  });
});

describe('Option Component', () => {
  it('should render an option element', () => {
    render(
      <select>
        <Option value="test">Test</Option>
      </select>
    );

    expect(screen.getByRole('option')).toHaveTextContent('Test');
    expect(screen.getByRole('option')).toHaveValue('test');
  });

  it('should render without value', () => {
    render(
      <select>
        <Option>Placeholder</Option>
      </select>
    );

    expect(screen.getByRole('option')).toHaveTextContent('Placeholder');
  });
});

describe('OptionGroup Component', () => {
  it('should render an optgroup element', () => {
    render(
      <select>
        <OptionGroup label="Fruits">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </OptionGroup>
      </select>
    );

    const optgroup = screen.getByRole('group');
    expect(optgroup).toHaveAttribute('label', 'Fruits');
  });

  it('should contain child options', () => {
    render(
      <select>
        <OptionGroup label="Colors">
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </OptionGroup>
      </select>
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
  });
});
