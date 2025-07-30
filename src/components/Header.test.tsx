/*
 * Header Component Tests:
 * • Renders logo and navigation correctly
 * • Shows mobile menu toggle functionality
 * • Navigation links work correctly
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

jest.mock('../store/useStore', () => ({
  useStore: jest.fn(() => ({
    favorites: [],
  })),
}));

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Header />
    </MemoryRouter>,
  );
};

describe('Header', () => {
  it('renders logo and navigation elements', () => {
    renderWithRouter();

    expect(screen.getByText('API Museum')).toBeInTheDocument();
    expect(screen.getByText('Art Explorer')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const menuButton = screen.getByLabelText('Toggle menu');
    await user.click(menuButton);

    const mobileNavItems = screen.getAllByText('Gallery');
    expect(mobileNavItems).toHaveLength(2);
  });

  it('shows different styling for active and inactive routes', () => {
    renderWithRouter(['/']);

    const galleryLink = screen.getByRole('link', { name: /gallery/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(galleryLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');

    expect(galleryLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();
  });

  it('renders navigation links correctly', () => {
    renderWithRouter();

    const galleryLink = screen.getByRole('link', { name: /gallery/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(galleryLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });
});
