/*
 * Home Page Tests:
 * • Component renders correctly with artwork cards and search functionality
 * • User can click on artwork cards to navigate to details page
 * • User can toggle favorites and favorite state is displayed correctly
 * • Load more button functionality works when more artworks are available
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';
import type { Artwork } from '../types/artwork';

const mockNavigate = jest.fn();
const mockToggleFavorite = jest.fn();
const mockSearch = jest.fn();
const mockLoadMore = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../store/useStore', () => ({
  useStore: () => ({
    favorites: [{ objectID: 1, title: 'Mona Lisa' }],
    toggleFavorite: mockToggleFavorite,
  }),
}));

jest.mock('../hooks/useArtworks', () => ({
  useArtworks: () => ({
    artworks: [
      {
        objectID: 1,
        title: 'Mona Lisa',
        artistDisplayName: 'Leonardo da Vinci',
        primaryImage: 'mona-lisa.jpg',
        primaryImageSmall: 'mona-lisa-small.jpg',
        objectDate: '1503-1519',
        medium: 'Oil on canvas',
        department: 'European Paintings',
        objectURL: 'https://example.com/artwork/1',
        culture: 'Italian',
        period: 'Renaissance',
        classification: 'Paintings',
        creditLine: 'Gift of John Doe',
      },
    ],
    loading: false,
    error: null,
    hasMore: true,
    search: mockSearch,
    loadMore: mockLoadMore,
    rateLimitWarning: null,
  }),
}));

jest.mock('../components/ArtworkCard', () => {
  return function MockArtworkCard({
    artwork,
    onSelect,
    onToggleFavorite,
    isFavorite,
  }: {
    artwork: Artwork;
    onSelect: (artwork: Artwork) => void;
    onToggleFavorite: (artwork: Artwork) => void;
    isFavorite: boolean;
  }) {
    return (
      <div>
        <button onClick={() => onSelect(artwork)}>{artwork.title}</button>
        <button onClick={() => onToggleFavorite(artwork)}>
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </button>
      </div>
    );
  };
});

jest.mock('../components/SearchBar', () => {
  return function MockSearchBar() {
    return <div>Search Bar</div>;
  };
});

jest.mock('../components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div>Loading...</div>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders artwork cards with correct content', () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText('Mona Lisa')).toBeInTheDocument();
    expect(screen.getByText('1 artwork currently on display')).toBeInTheDocument();
  });

  it('navigates to artwork details when artwork is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    await user.click(screen.getByText('Mona Lisa'));

    expect(mockNavigate).toHaveBeenCalledWith('/artwork/1');
  });

  it('toggles favorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    await user.click(screen.getByText('Remove from favorites'));

    expect(mockToggleFavorite).toHaveBeenCalledWith({
      objectID: 1,
      title: 'Mona Lisa',
      artistDisplayName: 'Leonardo da Vinci',
      primaryImage: 'mona-lisa.jpg',
      primaryImageSmall: 'mona-lisa-small.jpg',
      objectDate: '1503-1519',
      medium: 'Oil on canvas',
      department: 'European Paintings',
      objectURL: 'https://example.com/artwork/1',
      culture: 'Italian',
      period: 'Renaissance',
      classification: 'Paintings',
      creditLine: 'Gift of John Doe',
    });
  });

  it('calls loadMore when load more button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);

    await user.click(screen.getByText('View More Artworks'));

    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });
});
