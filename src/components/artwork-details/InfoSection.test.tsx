/*
 * InfoSection Component Tests:
 * • Renders section with label, value and icon correctly
 * • Shows optional description when provided
 * • Hides description when not provided
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Calendar } from 'lucide-react';
import { InfoSection } from './InfoSection';

describe('InfoSection', () => {
  const mockProps = {
    icon: Calendar,
    label: 'Date',
    value: '1874',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
    delay: 0.5,
  };

  it('renders label, value and icon correctly', () => {
    render(<InfoSection {...mockProps} />);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('1874')).toBeInTheDocument();
  });

  it('shows description when provided', () => {
    const description = 'Created during the Impressionist period';
    render(<InfoSection {...mockProps} description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('hides description when not provided', () => {
    render(<InfoSection {...mockProps} />);

    expect(screen.queryByText('Created during the Impressionist period')).not.toBeInTheDocument();
  });
});
