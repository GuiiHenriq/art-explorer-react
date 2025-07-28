import { useEffect, useState } from 'react';
import { MetAPI } from '../services/metAPI';
import type { Artwork } from '../types/artwork';

export const useArtworkDetails = (objectID: string | undefined) => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      if (!objectID) {
        setError('ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const artworkData = await MetAPI.getArtworkDetails(parseInt(objectID));
        setArtwork(artworkData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading artwork details');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [objectID]);

  return { artwork, loading, error };
}; 