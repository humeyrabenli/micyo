import { describe, it, expect } from 'vitest';
import { isFetchResponse } from '../helpers/isFetchResponse';

describe('isFetchResponse', () => {
  it('should return true for a Fetch Response object', () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }));
    expect(isFetchResponse(mockResponse)).toBe(true);
  });

  it('should return true for an object with json method', () => {
    const mockObj = {
      json: () => Promise.resolve({}),
      headers: new Headers(),
    };
    expect(isFetchResponse(mockObj)).toBe(true);
  });

  it('should return false for an object without json method', () => {
    const mockObj = {
      data: {},
      headers: {},
    };
    expect(isFetchResponse(mockObj)).toBe(false);
  });

  it('should return false for null json property', () => {
    const mockObj = {
      json: undefined,
      data: 'test',
    };
    expect(isFetchResponse(mockObj)).toBe(false);
  });

  it('should return true when json is a function', () => {
    const mockObj = {
      json: vi.fn().mockResolvedValue({}),
    };
    expect(isFetchResponse(mockObj)).toBe(true);
  });

  it('should return true even if json is not a function but defined', () => {
    // The implementation checks `response.json !== undefined`
    const mockObj = {
      json: 'not-a-function',
    };
    expect(isFetchResponse(mockObj)).toBe(true);
  });
});
