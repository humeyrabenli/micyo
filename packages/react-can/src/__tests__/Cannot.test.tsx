import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AbilityProvider } from '../context/AbilityProvider';
import { Can } from '../components/Can';
import { Cannot } from '../components/Cannot';

describe('Cannot Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should render children when user does NOT have the ability', () => {
    render(
      <AbilityProvider list={['read']} persistent={false}>
        <Cannot i="delete">
          <div data-testid="fallback">No Delete Permission</div>
        </Cannot>
      </AbilityProvider>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toHaveTextContent('No Delete Permission');
  });

  it('should NOT render children when user has the ability', () => {
    render(
      <AbilityProvider list={['read', 'write']} persistent={false}>
        <Cannot i="read">
          <div data-testid="fallback">No Read Permission</div>
        </Cannot>
      </AbilityProvider>
    );

    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should render when abilities list is empty', () => {
    render(
      <AbilityProvider list={[]} persistent={false}>
        <Cannot i="admin">
          <div data-testid="fallback">Not an Admin</div>
        </Cannot>
      </AbilityProvider>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('should work alongside Can component as inverse', () => {
    render(
      <AbilityProvider list={['read']} persistent={false}>
        <Can i="read">
          <div data-testid="can-read">Has Read</div>
        </Can>
        <Cannot i="read">
          <div data-testid="cannot-read">No Read</div>
        </Cannot>
        <Can i="write">
          <div data-testid="can-write">Has Write</div>
        </Can>
        <Cannot i="write">
          <div data-testid="cannot-write">No Write</div>
        </Cannot>
      </AbilityProvider>
    );

    expect(screen.getByTestId('can-read')).toBeInTheDocument();
    expect(screen.queryByTestId('cannot-read')).not.toBeInTheDocument();
    expect(screen.queryByTestId('can-write')).not.toBeInTheDocument();
    expect(screen.getByTestId('cannot-write')).toBeInTheDocument();
  });

  it('should render multiple children when ability is absent', () => {
    render(
      <AbilityProvider list={[]} persistent={false}>
        <Cannot i="admin">
          <p data-testid="msg1">You are not an admin.</p>
          <p data-testid="msg2">Please contact support.</p>
        </Cannot>
      </AbilityProvider>
    );

    expect(screen.getByTestId('msg1')).toBeInTheDocument();
    expect(screen.getByTestId('msg2')).toBeInTheDocument();
  });
});
