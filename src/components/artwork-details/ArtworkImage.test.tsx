/*
 * ArtworkImage Component Tests:
 * • Renders artwork image with correct attributes and alt text
 * • Toggles favorite status when heart button is clicked
 * • Shows fallback UI when image fails to load
 * • Calls onImageError callback when image error occurs
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArtworkImage } from './ArtworkImage';
import type { Artwork } from '../../types/artwork';

const mockArtwork: Artwork = {
  objectID: 1,
  title: 'Test Artwork',
  primaryImage: 'https://example.com/image.jpg',
  primaryImageSmall: 'https://example.com/small.jpg',
};

const mockProps = {
  artwork: mockArtwork,
  isFavorite: false,
  onToggleFavorite: jest.fn(),
  onImageError: jest.fn(),
};

describe('ArtworkImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders artwork image with correct attributes', () => {
    render(<ArtworkImage {...mockProps} />);

    const image = screen.getByAltText('Test Artwork');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('toggles favorite status when heart button is clicked', async () => {
    const user = userEvent.setup();
    render(<ArtworkImage {...mockProps} />);

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButton);

    expect(mockProps.onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('shows favorite button as active when isFavorite is true', () => {
    render(<ArtworkImage {...mockProps} isFavorite={true} />);

    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('bg-red-500', 'text-white');
  });

  it('displays fallback UI and calls onImageError when image fails to load', () => {
    render(<ArtworkImage {...mockProps} />);

    const image = screen.getByAltText('Test Artwork');
    fireEvent.error(image);

    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    expect(mockProps.onImageError).toHaveBeenCalledTimes(1);
  });
});
