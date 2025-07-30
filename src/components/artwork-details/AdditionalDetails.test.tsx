/*
 * AdditionalDetails Component Tests:
 * • Renders component with artwork details when data is available
 * • Filters out empty/undefined fields and displays only valid data
 * • Returns null when no valid details are present
 * • Applies correct animations and styling classes
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AdditionalDetails } from './AdditionalDetails';
import type { Artwork } from '../../types/artwork';

const mockArtworkWithAllDetails: Artwork = {
  objectID: 1,
  title: 'Test Artwork',
  primaryImage: 'image.jpg',
  primaryImageSmall: 'small.jpg',
  culture: 'Ancient Greek',
  period: 'Classical Period',
  classification: 'Sculpture',
  creditLine: 'Gift of Anonymous Donor',
  objectURL: 'https://example.com/artwork',
};

const mockArtworkWithPartialDetails: Artwork = {
  objectID: 2,
  title: 'Test Artwork 2',
  primaryImage: 'image2.jpg',
  primaryImageSmall: 'small2.jpg',
  culture: 'Roman',
  period: undefined,
  classification: '',
  creditLine: 'Museum Purchase',
};

const mockArtworkWithNoDetails: Artwork = {
  objectID: 3,
  title: 'Test Artwork 3',
  primaryImage: 'image3.jpg',
  primaryImageSmall: 'small3.jpg',
  culture: undefined,
  period: '',
  classification: undefined,
  creditLine: '',
};

describe('AdditionalDetails', () => {
  it('renders all details when artwork has complete information', () => {
    render(<AdditionalDetails artwork={mockArtworkWithAllDetails} />);

    expect(screen.getByText('Cultural Origin')).toBeInTheDocument();
    expect(screen.getByText('Ancient Greek')).toBeInTheDocument();
    expect(screen.getByText('Historical Period')).toBeInTheDocument();
    expect(screen.getByText('Classical Period')).toBeInTheDocument();
    expect(screen.getAllByText('Classification')).toHaveLength(2); // Title and label
    expect(screen.getByText('Sculpture')).toBeInTheDocument();
    expect(screen.getByText('Museum Credit')).toBeInTheDocument();
    expect(screen.getByText('Gift of Anonymous Donor')).toBeInTheDocument();
    expect(screen.getByText('View in Museum')).toBeInTheDocument();
  });

  it('filters out empty fields and renders only valid details', () => {
    render(<AdditionalDetails artwork={mockArtworkWithPartialDetails} />);

    expect(screen.getByText('Roman')).toBeInTheDocument();
    expect(screen.getByText('Museum Purchase')).toBeInTheDocument();
    expect(screen.queryByText('Historical Period')).not.toBeInTheDocument();
    expect(screen.queryByText('Sculpture')).not.toBeInTheDocument();
  });

  it('returns null when no valid details are available', () => {
    const { container } = render(<AdditionalDetails artwork={mockArtworkWithNoDetails} />);

    expect(container.firstChild).toBeNull();
  });

  it('applies correct styling and structure', () => {
    render(<AdditionalDetails artwork={mockArtworkWithAllDetails} />);

    const container = screen.getByText('Ancient Greek').closest('.grid');
    expect(container).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'xl:grid-cols-4',
      'gap-8',
      'mb-10',
    );
  });
});
