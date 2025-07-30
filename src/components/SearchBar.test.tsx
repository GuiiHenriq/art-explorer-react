/**
 * SearchBar Component Tests:
 * • Basic rendering of search inputs and buttons
 * • Form submission with search parameters
 * • Advanced search toggle functionality
 * • Clear functionality to reset form
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { MetAPI } from '../services/metAPI';

jest.mock('../services/metAPI');
const mockedMetAPI = MetAPI as jest.Mocked<typeof MetAPI>;

const mockDepartments = {
  departments: [
    { departmentId: 1, displayName: 'American Art' },
    { departmentId: 2, displayName: 'European Art' },
  ],
};

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedMetAPI.getDepartments.mockResolvedValue(mockDepartments);
  });

  it('renders search inputs and buttons correctly', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByLabelText(/search collection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/artist name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show advanced search/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedMetAPI.getDepartments).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onSearch with correct parameters when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText(/search collection/i);
    const artistInput = screen.getByLabelText(/artist name/i);
    const searchButton = screen.getByRole('button', { name: /search gallery/i });

    await user.type(searchInput, 'Mona Lisa');
    await user.type(artistInput, 'Leonardo');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      hasImages: true,
      artistOrCulture: true,
      q: 'Leonardo',
    });
  });

  it('toggles advanced search options', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const toggleButton = screen.getByRole('button', { name: /show advanced search/i });

    expect(screen.queryByLabelText(/period start/i)).not.toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.getByLabelText(/period start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/period end/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/technique/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide advanced search/i })).toBeInTheDocument();
  });

  it('clears form and calls appropriate callback', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);

    const searchInput = screen.getByLabelText(/search collection/i);
    const clearButton = screen.getByRole('button', { name: /clear search/i });

    await user.type(searchInput, 'test search');
    expect(searchInput).toHaveValue('test search');

    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
