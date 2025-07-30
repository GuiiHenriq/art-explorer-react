/*
 * LoadingSpinner Component Tests
 * • Component renders successfully with loading message
 * • Loading text is properly displayed and accessible
 * • Component structure is correctly mounted in DOM
 */

import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading message correctly', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays component structure in DOM', () => {
    render(<LoadingSpinner />);

    const loadingText = screen.getByText('Loading...');
    const container = loadingText.parentElement;

    expect(container).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
