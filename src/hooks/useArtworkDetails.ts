import { useEffect, useState, useRef } from 'react';
import { MetAPI } from '../services/metAPI';
import type { Artwork } from '../types/artwork';

export const useArtworkDetails = (objectID: string | undefined) => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!objectID) {
      setArtwork(null);
      setError('ID not provided');
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const artworkData = await MetAPI.getArtworkDetails(parseInt(objectID));

        if (!abortController.signal.aborted) {
          setArtwork(artworkData);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error loading artwork details');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArtworkDetails();

    return () => {
      abortController.abort();
    };
  }, [objectID]);

  return { artwork, loading, error };
};
