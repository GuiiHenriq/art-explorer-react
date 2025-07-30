/*
 * ArtworkCard Component Tests
 * - Renders artwork information correctly (title, artist, date)
 * - Displays artwork image with proper alt text
 * - Handles favorite toggle button clicks and visual states
 * - Triggers artwork selection when card is clicked
 * - Prevents event propagation on favorite button clicks
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtworkCard from './ArtworkCard';
import type { Artwork } from '../types/artwork';

const mockArtwork: Artwork = {
  objectID: 1,
  title: 'The Starry Night',
  artistDisplayName: 'Vincent van Gogh',
  objectDate: '1889',
  primaryImage: 'https://example.com/image.jpg',
  primaryImageSmall: 'https://example.com/image-small.jpg',
  department: 'European Paintings',
  culture: 'Dutch',
  period: '19th century',
  medium: 'Oil on canvas',
  repository: 'Museum of Modern Art',
  objectURL: 'https://example.com/artwork',
  tags: [
    {
      term: 'art',
      AAT_URL: 'https://example.com/aat',
      Wikidata_URL: 'https://example.com/wikidata',
    },
  ],
  creditLine: 'Gift of Example Foundation',
  classification: 'Painting',
  linkResource: 'https://example.com/resource',
  metadataDate: '2023-01-01T00:00:00.000Z',
};

const mockProps = {
  artwork: mockArtwork,
  onSelect: jest.fn(),
  onToggleFavorite: jest.fn(),
  isFavorite: false,
};

describe('ArtworkCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders artwork information correctly', () => {
    render(<ArtworkCard {...mockProps} />);

    expect(screen.getByText('The Starry Night')).toBeInTheDocument();
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();
    expect(screen.getByText('1889')).toBeInTheDocument();
    expect(screen.getByAltText('The Starry Night')).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    render(<ArtworkCard {...mockProps} />);

    const cardContent = screen.getByText('The Starry Night').closest('div');
    await user.click(cardContent!);

    expect(mockProps.onSelect).toHaveBeenCalledWith(mockArtwork);
  });

  it('toggles favorite state and prevents event propagation', async () => {
    const user = userEvent.setup();
    render(<ArtworkCard {...mockProps} />);

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButton);

    expect(mockProps.onToggleFavorite).toHaveBeenCalledWith(mockArtwork);
    expect(mockProps.onSelect).not.toHaveBeenCalled();
  });

  it('shows correct favorite button state when favorited', () => {
    render(<ArtworkCard {...mockProps} isFavorite={true} />);

    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteButton).toHaveClass('bg-red-500', 'text-white');
  });
});
