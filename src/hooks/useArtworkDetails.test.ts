/*
 * useArtworkDetails Hook Tests:
 * • Success case: Verifies hook loads API data correctly
 * • Error handling: Tests how hook handles API failures
 * • Input validation: Tests when objectID is missing
 * • Reactivity: Tests if hook refetches when ID changes
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useArtworkDetails } from './useArtworkDetails';
import { MetAPI } from '../services/metAPI';
import type { Artwork } from '../types/artwork';

jest.mock('../services/metAPI');
const mockedMetAPI = jest.mocked(MetAPI);

const mockArtwork: Artwork = {
  objectID: 123,
  title: 'Test Artwork',
  primaryImage: 'test-image.jpg',
  primaryImageSmall: 'test-image-small.jpg',
  artistDisplayName: 'Test Artist',
  objectDate: '1900',
};

describe('useArtworkDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially and fetch artwork details successfully', async () => {
    mockedMetAPI.getArtworkDetails.mockResolvedValue(mockArtwork);

    const { result } = renderHook(() => useArtworkDetails('123'));

    expect(result.current.loading).toBe(true);
    expect(result.current.artwork).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artwork).toEqual(mockArtwork);
    expect(result.current.error).toBe(null);
    expect(mockedMetAPI.getArtworkDetails).toHaveBeenCalledWith(123);
  });

  it('should handle error when API call fails', async () => {
    const errorMessage = 'Failed to fetch artwork';
    mockedMetAPI.getArtworkDetails.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useArtworkDetails('123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artwork).toBe(null);
    expect(result.current.error).toBe(errorMessage);
    expect(mockedMetAPI.getArtworkDetails).toHaveBeenCalledWith(123);
  });

  it('should handle missing objectID', async () => {
    const { result } = renderHook(() => useArtworkDetails(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artwork).toBe(null);
    expect(result.current.error).toBe('ID not provided');
    expect(mockedMetAPI.getArtworkDetails).not.toHaveBeenCalled();
  });

  it('should refetch when objectID changes', async () => {
    mockedMetAPI.getArtworkDetails.mockResolvedValue(mockArtwork);

    const { result, rerender } = renderHook(({ objectID }) => useArtworkDetails(objectID), {
      initialProps: { objectID: '123' },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedMetAPI.getArtworkDetails).toHaveBeenCalledWith(123);

    rerender({ objectID: '456' });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedMetAPI.getArtworkDetails).toHaveBeenCalledWith(456);
    expect(mockedMetAPI.getArtworkDetails).toHaveBeenCalledTimes(2);
  });
});
