/*
 * Favorites Page Tests:
 * - Renders empty state with explore button when no favorites exist
 * - Displays favorite artworks in grid layout when favorites are available
 * - Shows correct favorites count and plural handling
 * - Handles navigation to artwork details and explore gallery
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FavoritesPage from './FavoritesPage';
import { useStore } from '../store/useStore';
import type { Artwork } from '../types/artwork';

interface MockStoreState {
  favorites: Artwork[];
  toggleFavorite: jest.MockedFunction<(artwork: Artwork) => void>;
}

interface MockArtworkCardProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  onToggleFavorite: (artwork: Artwork) => void;
  isFavorite: boolean;
}

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../store/useStore');
const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock('../components/ArtworkCard', () => {
  return function MockArtworkCard({ artwork, onSelect, onToggleFavorite }: MockArtworkCardProps) {
    return (
      <div data-testid={`artwork-card-${artwork.objectID}`}>
        <button onClick={() => onSelect(artwork)}>View Details</button>
        <button onClick={() => onToggleFavorite(artwork)}>Toggle Favorite</button>
      </div>
    );
  };
});

const mockArtwork: Artwork = {
  objectID: 123,
  title: 'Test Artwork',
  artistDisplayName: 'Test Artist',
  objectDate: '1889',
  primaryImage: 'https://example.com/image.jpg',
  primaryImageSmall: 'https://example.com/image-small.jpg',
};

const renderComponent = () =>
  render(
    <BrowserRouter>
      <FavoritesPage />
    </BrowserRouter>,
  );

describe('FavoritesPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders empty state when no favorites exist', async () => {
    mockUseStore.mockReturnValue({ favorites: [], toggleFavorite: jest.fn() } as MockStoreState);
    renderComponent();

    expect(screen.getByRole('heading', { name: 'No favorites yet' })).toBeInTheDocument();

    const exploreButton = screen.getByRole('button', { name: 'Explore Gallery' });
    await userEvent.click(exploreButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays favorites count correctly with proper plural handling', () => {
    mockUseStore.mockReturnValue({
      favorites: [mockArtwork],
      toggleFavorite: jest.fn(),
    } as MockStoreState);
    renderComponent();

    expect(screen.getByText('1 favorite')).toBeInTheDocument();
    expect(screen.getByText('1 artwork')).toBeInTheDocument();
  });

  it('renders favorites grid when artworks are available', async () => {
    const mockToggleFavorite = jest.fn();
    mockUseStore.mockReturnValue({
      favorites: [mockArtwork, { ...mockArtwork, objectID: 456 }],
      toggleFavorite: mockToggleFavorite,
    } as MockStoreState);

    renderComponent();

    expect(screen.getByText('2 favorites')).toBeInTheDocument();
    expect(screen.getByTestId('artwork-card-123')).toBeInTheDocument();

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    await userEvent.click(viewDetailsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/artwork/123');

    const toggleFavoriteButton = screen.getAllByText('Toggle Favorite')[0];
    await userEvent.click(toggleFavoriteButton);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockArtwork);
  });
});
