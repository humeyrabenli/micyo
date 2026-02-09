import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AbilityProvider } from '../context/AbilityProvider';
import { Can } from '../components/Can';

describe('Can Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should render children when user has the ability', () => {
    render(
      <AbilityProvider list={['read', 'write']} persistent={false}>
        <Can i="read">
          <div data-testid="protected">Protected Content</div>
        </Can>
      </AbilityProvider>
    );

    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(screen.getByTestId('protected')).toHaveTextContent('Protected Content');
  });

  it('should not render children when user does not have the ability', () => {
    render(
      <AbilityProvider list={['read']} persistent={false}>
        <Can i="delete">
          <div data-testid="protected">Protected Content</div>
        </Can>
      </AbilityProvider>
    );

    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('should render nothing when abilities list is empty', () => {
    render(
      <AbilityProvider list={[]} persistent={false}>
        <Can i="read">
          <div data-testid="protected">Protected Content</div>
        </Can>
      </AbilityProvider>
    );

    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('should render multiple children when ability exists', () => {
    render(
      <AbilityProvider list={['admin']} persistent={false}>
        <Can i="admin">
          <div data-testid="item1">Item 1</div>
          <div data-testid="item2">Item 2</div>
        </Can>
      </AbilityProvider>
    );

    expect(screen.getByTestId('item1')).toBeInTheDocument();
    expect(screen.getByTestId('item2')).toBeInTheDocument();
  });

  it('should work with multiple Can components', () => {
    render(
      <AbilityProvider list={['read', 'write']} persistent={false}>
        <Can i="read">
          <div data-testid="read-content">Read</div>
        </Can>
        <Can i="write">
          <div data-testid="write-content">Write</div>
        </Can>
        <Can i="delete">
          <div data-testid="delete-content">Delete</div>
        </Can>
      </AbilityProvider>
    );

    expect(screen.getByTestId('read-content')).toBeInTheDocument();
    expect(screen.getByTestId('write-content')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-content')).not.toBeInTheDocument();
  });
});
