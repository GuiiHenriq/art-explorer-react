/**
 * SearchBar Component Tests:
 * • Basic rendering of search inputs and buttons
 * • Form submission with search parameters
 * • Advanced search toggle functionality
 * • Clear functionality to reset form
 */

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

    expect(screen.getByLabelText(/search by title or description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/artist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show advanced search/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedMetAPI.getDepartments).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onSearch with correct parameters when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText(/search by title or description/i);
    const artistInput = screen.getByLabelText(/artist/i);
    const searchButton = screen.getByRole('button', { name: /^search$/i });

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

    expect(screen.queryByLabelText(/initial date/i)).not.toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.getByLabelText(/initial date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/final date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/technique/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide advanced search/i })).toBeInTheDocument();
  });

  it('clears form and calls appropriate callback', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);

    const searchInput = screen.getByLabelText(/search by title or description/i);
    const clearButton = screen.getByRole('button', { name: /clear/i });

    await user.type(searchInput, 'test search');
    expect(searchInput).toHaveValue('test search');

    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
