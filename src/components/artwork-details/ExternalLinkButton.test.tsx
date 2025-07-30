/*
 * ExternalLinkButton Component Tests:
 * • Renders button with correct text content
 * • Opens external URL in new tab when clicked
 * • Supports keyboard navigation and activation
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExternalLinkButton } from './ExternalLinkButton';

const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

describe('ExternalLinkButton', () => {
  const mockUrl = 'https://example.com/artwork/123';
  const mockDelay = 1.6;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('View in Museum')).toBeInTheDocument();
  });

  it('opens external URL when clicked', async () => {
    const user = userEvent.setup();
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    await user.click(screen.getByRole('button'));

    expect(mockWindowOpen).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener,noreferrer');
  });

  it('supports keyboard navigation and activation', async () => {
    const user = userEvent.setup();
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(mockWindowOpen).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener,noreferrer');
  });
});
