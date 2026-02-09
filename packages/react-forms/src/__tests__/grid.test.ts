import { describe, it, expect } from 'vitest';
import { gridTemplate, gridColumn } from '../helpers/grid';

describe('gridTemplate', () => {
  it('should return empty string when columns is undefined', () => {
    expect(gridTemplate(undefined)).toBe('');
  });

  it('should return grid template for numeric columns', () => {
    const result = gridTemplate(3);
    expect(result).toBe('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr))');
  });

  it('should return grid template for 1 column', () => {
    const result = gridTemplate(1);
    expect(result).toBe('display: grid; grid-template-columns: repeat(1, minmax(0, 1fr))');
  });

  it('should return empty string for 0 columns', () => {
    const result = gridTemplate(0);
    expect(result).toBe('');
  });

  it('should generate media queries for object columns', () => {
    const result = gridTemplate({ xs: 1, md: 2, lg: 3 });

    expect(result).toContain('display: grid;');
    expect(result).toContain('@media (max-width: 576px)');
    expect(result).toContain('repeat(1, minmax(0, 1fr))');
    expect(result).toContain('@media (min-width: 768px)');
    expect(result).toContain('repeat(2, minmax(0, 1fr))');
    expect(result).toContain('@media (min-width: 992px)');
    expect(result).toContain('repeat(3, minmax(0, 1fr))');
  });

  it('should only generate media queries for defined breakpoints', () => {
    const result = gridTemplate({ md: 2 });

    expect(result).toContain('display: grid;');
    expect(result).toContain('@media (min-width: 768px)');
    expect(result).not.toContain('@media (max-width: 576px)');
    expect(result).not.toContain('@media (min-width: 1200px)');
  });
});

describe('gridColumn', () => {
  it('should return empty string when colSpan is undefined', () => {
    expect(gridColumn(undefined)).toBe('');
  });

  it('should return grid column span for numeric value', () => {
    const result = gridColumn(2);
    expect(result).toBe('grid-column: span 2 / span 2;');
  });

  it('should return empty string for 0', () => {
    expect(gridColumn(0)).toBe('');
  });

  it('should generate media queries for object colSpan', () => {
    const result = gridColumn({ xs: 1, lg: 2 });

    expect(result).toContain('@media (max-width: 576px)');
    expect(result).toContain('grid-column: span 1 / span 1');
    expect(result).toContain('@media (min-width: 992px)');
    expect(result).toContain('grid-column: span 2 / span 2');
  });

  it('should only generate media queries for defined breakpoints', () => {
    const result = gridColumn({ xl: 3 });

    expect(result).toContain('@media (min-width: 1200px)');
    expect(result).toContain('grid-column: span 3 / span 3');
    expect(result).not.toContain('@media (max-width: 576px)');
  });

  it('should handle full column span (all breakpoints)', () => {
    const result = gridColumn({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 });

    expect(result).toContain('span 1');
    expect(result).toContain('span 2');
    expect(result).toContain('span 3');
    expect(result).toContain('span 4');
    expect(result).toContain('span 5');
    expect(result).toContain('span 6');
  });
});
