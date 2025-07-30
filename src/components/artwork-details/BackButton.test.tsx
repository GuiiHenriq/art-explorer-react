/*
 * BackButton Component Tests:
 * • Renders button with correct text and accessibility label
 * • Executes onClick callback when button is clicked
 * • Supports keyboard navigation and activation
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from './BackButton';

describe('BackButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text and accessibility', () => {
    render(<BackButton onClick={mockOnClick} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    render(<BackButton onClick={mockOnClick} />);

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation and activation', async () => {
    const user = userEvent.setup();
    render(<BackButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
