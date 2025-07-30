/*
 * ErrorDisplay Component Tests:
 * • Renders error message and title correctly
 * • Displays Back button and executes onBack callback when clicked
 * • Shows proper error content based on error prop
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  const mockOnBack = jest.fn();
  const mockError = 'Something went wrong. Please try again.';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error title and message correctly', () => {
    render(<ErrorDisplay error={mockError} onBack={mockOnBack} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('displays Back button and calls onBack when clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorDisplay error={mockError} onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays different error messages based on error prop', () => {
    const customError = 'Network connection failed';
    render(<ErrorDisplay error={customError} onBack={mockOnBack} />);

    expect(screen.getByText(customError)).toBeInTheDocument();
    expect(screen.queryByText(mockError)).not.toBeInTheDocument();
  });
});
