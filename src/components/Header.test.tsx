/*
 * Header Component Tests:
 * • Renders logo and navigation correctly
 * • Shows mobile menu toggle functionality
 * • Navigation links work correctly
 */

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

    expect(screen.getByText('Art Explorer')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const menuButton = screen.getByLabelText('Toggle menu');
    await user.click(menuButton);

    const mobileNavItems = screen.getAllByText('Home');
    expect(mobileNavItems).toHaveLength(2);
  });

  it('shows active state for favorites route', () => {
    renderWithRouter(['/favorites']);

    const favoritesLink = screen.getByRole('link', { name: /favorites/i });
    expect(favoritesLink.className).toContain('text-blue-600');
  });

  it('renders navigation links correctly', () => {
    renderWithRouter();

    const homeLink = screen.getByRole('link', { name: /home/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });
});
