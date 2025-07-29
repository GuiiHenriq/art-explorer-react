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
  useStore: jest.fn(() => ({
    favorites: [
      { objectID: 1, title: 'Artwork 1' },
      { objectID: 2, title: 'Artwork 2' },
    ],
    toggleFavorite: mockToggleFavorite,
  })),
}));

const mockUseArtworkCache = jest.fn();
jest.mock('../hooks/useArtworkCache', () => ({
  useArtworkCache: () => mockUseArtworkCache(),
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
      <div data-testid={`artwork-card-${artwork.objectID}`}>
        <h3 onClick={() => onSelect(artwork)}>{artwork.title}</h3>
        <p>{artwork.artistDisplayName}</p>
        <button
          onClick={() => onToggleFavorite(artwork)}
          data-testid={`favorite-button-${artwork.objectID}`}
        >
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </button>
      </div>
    );
  };
});

jest.mock('../components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading artwork...</div>;
  };
});

const mockArtworks: Artwork[] = [
  {
    objectID: 1,
    title: 'Mona Lisa',
    primaryImage: 'https://example.com/mona-lisa.jpg',
    primaryImageSmall: 'https://example.com/mona-lisa-small.jpg',
    artistDisplayName: 'Leonardo da Vinci',
    objectDate: '1503-1519',
    medium: 'Oil on canvas',
    department: 'European Paintings',
    objectURL: 'https://example.com/artwork/1',
    culture: 'Italian',
    period: 'Renaissance',
    classification: 'Paintings',
    creditLine: 'Gift of John Doe',
  },
  {
    objectID: 2,
    title: 'The Starry Night',
    primaryImage: 'https://example.com/starry-night.jpg',
    primaryImageSmall: 'https://example.com/starry-night-small.jpg',
    artistDisplayName: 'Vincent van Gogh',
    objectDate: '1889',
    medium: 'Oil on canvas',
    department: 'European Paintings',
    objectURL: 'https://example.com/artwork/2',
    culture: 'Dutch',
    period: 'Post-Impressionism',
    classification: 'Paintings',
    creditLine: 'Gift of Jane Doe',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseArtworkCache.mockReturnValue({
      artworks: [],
      loading: false,
      error: null,
      hasMore: false,
      search: mockSearch,
      loadMore: mockLoadMore,
    });
  });

  describe('Component initialization', () => {
    it('should call search with correct parameters on mount', () => {
      renderWithRouter(<HomePage />);

      expect(mockSearch).toHaveBeenCalledWith({ hasImages: true, q: 'painting' });
      expect(mockSearch).toHaveBeenCalledTimes(1);
    });

    it('should render main element with correct semantic structure', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should render loading spinner when loading is true and no artworks are present', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: [],
        loading: true,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading artwork...')).toBeInTheDocument();

      expect(screen.queryByRole('main')).not.toBeInTheDocument();
    });

    it('should not render loading spinner when loading is true but artworks are present', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: true,
        error: null,
        hasMore: true,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    });
  });

  describe('Error state', () => {
    it('should render error message when there is an error', () => {
      const errorMessage = 'Failed to load artworks from API';
      mockUseArtworkCache.mockReturnValue({
        artworks: [],
        loading: false,
        error: errorMessage,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();

      expect(screen.queryByRole('main')).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should render no artworks message when artworks array is empty and not loading', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: [],
        loading: false,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('No artworks found')).toBeInTheDocument();
      expect(
        screen.getByText('It was not possible to load the artworks at the moment.'),
      ).toBeInTheDocument();

      expect(screen.queryByRole('main')).not.toBeInTheDocument();
    });
  });

  describe('Artworks display', () => {
    beforeEach(() => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });
    });

    it('should render artwork cards when artworks are available', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText('Mona Lisa')).toBeInTheDocument();
      expect(screen.getByText('The Starry Night')).toBeInTheDocument();
      expect(screen.getByText('Leonardo da Vinci')).toBeInTheDocument();
      expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();

      expect(screen.getByTestId('artwork-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('artwork-card-2')).toBeInTheDocument();
    });

    it('should correctly identify favorite artworks', () => {
      renderWithRouter(<HomePage />);

      const favoriteButton1 = screen.getByTestId('favorite-button-1');
      expect(favoriteButton1).toHaveTextContent('Remove from favorites');

      const favoriteButton2 = screen.getByTestId('favorite-button-2');
      expect(favoriteButton2).toHaveTextContent('Remove from favorites');
    });
  });

  describe('User interactions', () => {
    beforeEach(() => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });
    });

    it('should navigate to artwork details when artwork is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage />);

      const artworkTitle = screen.getByText('Mona Lisa');
      await user.click(artworkTitle);

      expect(mockNavigate).toHaveBeenCalledWith('/artwork/1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should call toggleFavorite when favorite button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage />);

      const favoriteButton = screen.getByTestId('favorite-button-1');
      await user.click(favoriteButton);

      expect(mockToggleFavorite).toHaveBeenCalledWith(mockArtworks[0]);
      expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  describe('Load more functionality', () => {
    it('should render load more button when hasMore is true', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: true,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toBeInTheDocument();
      expect(loadMoreButton).not.toBeDisabled();
    });

    it('should not render load more button when hasMore is false', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: false,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
    });

    it('should call loadMore when load more button is clicked', async () => {
      const user = userEvent.setup();
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: true,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      await user.click(loadMoreButton);

      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should disable load more button and show loading text when loading', () => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: true,
        error: null,
        hasMore: true,
        search: mockSearch,
        loadMore: mockLoadMore,
      });

      renderWithRouter(<HomePage />);

      const loadMoreButton = screen.getByRole('button', { name: /loading/i });
      expect(loadMoreButton).toBeDisabled();
      expect(loadMoreButton).toHaveTextContent('Loading...');
    });
  });

  describe('CSS classes and styling', () => {
    beforeEach(() => {
      mockUseArtworkCache.mockReturnValue({
        artworks: mockArtworks,
        loading: false,
        error: null,
        hasMore: true,
        search: mockSearch,
        loadMore: mockLoadMore,
      });
    });

    it('should apply correct CSS classes to main container', () => {
      renderWithRouter(<HomePage />);

      const container = screen.getByRole('main').parentElement;
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
    });

    it('should apply correct CSS classes to artworks grid', () => {
      renderWithRouter(<HomePage />);

      const grid = screen.getByTestId('artwork-card-1').parentElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('should apply correct CSS classes to load more button', () => {
      renderWithRouter(<HomePage />);

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      expect(loadMoreButton).toHaveClass(
        'bg-blue-600',
        'text-white',
        'px-6',
        'py-3',
        'rounded-lg',
        'hover:bg-blue-700',
        'transition-colors',
        'cursor-pointer',
        'disabled:opacity-50',
      );
    });
  });
});
