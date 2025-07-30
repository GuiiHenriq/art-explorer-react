/*
 * Artwork Details Page Tests:
 * • Loading state displays spinner
 * • Success state shows artwork details
 * • Back button navigates correctly
 * • Error state displays error message
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ArtworkDetailsPage from './ArtworkDetailsPage';

const mockNavigate = jest.fn();
const mockUseArtworkDetails = jest.fn();

const mockArtwork = {
  objectID: 123,
  title: 'The Starry Night',
  artistDisplayName: 'Vincent van Gogh',
  primaryImage: 'test.jpg',
  primaryImageSmall: 'test-small.jpg',
  objectDate: '1889',
  medium: 'Oil on canvas',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ objectID: '123' }),
}));

jest.mock('../store/useStore', () => ({
  useStore: () => ({ favorites: [], toggleFavorite: jest.fn() }),
}));

jest.mock('../hooks/useArtworkDetails', () => ({
  useArtworkDetails: () => mockUseArtworkDetails(),
}));

describe('ArtworkDetailsPage', () => {
  const renderPage = () =>
    render(
      <BrowserRouter>
        <ArtworkDetailsPage />
      </BrowserRouter>,
    );

  beforeEach(() => jest.clearAllMocks());

  it('shows loading spinner', () => {
    mockUseArtworkDetails.mockReturnValue({ artwork: null, loading: true, error: null });
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays artwork details', () => {
    mockUseArtworkDetails.mockReturnValue({ artwork: mockArtwork, loading: false, error: null });
    renderPage();
    expect(screen.getByText('The Starry Night')).toBeInTheDocument();
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();
  });

  it('navigates back on button click', async () => {
    mockUseArtworkDetails.mockReturnValue({ artwork: mockArtwork, loading: false, error: null });
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('shows error when artwork fails to load', () => {
    mockUseArtworkDetails.mockReturnValue({
      artwork: null,
      loading: false,
      error: 'Failed to load artwork',
    });
    renderPage();
    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText('Failed to load artwork')).toBeInTheDocument();
  });
});
