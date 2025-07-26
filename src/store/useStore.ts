import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Artwork } from '../types/artwork';

export type ViewType = 'gallery' | 'favorites' | 'details';

interface StoreState {
  artworks: Artwork[];
  favorites: Artwork[];
  loading: boolean;
  currentPage: number;
  hasMore: boolean;
  searchResults: number[];
  currentView: ViewType;
  selectedArtwork: Artwork | null;
  error: string | null;
  setArtworks: (artworks: Artwork[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSearchResults: (results: number[]) => void;
  setCurrentView: (view: ViewType) => void;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  toggleFavorite: (artwork: Artwork) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      artworks: [],
      favorites: [],
      loading: false,
      currentPage: 0,
      hasMore: true,
      searchResults: [],
      currentView: 'gallery',
      selectedArtwork: null,
      error: null,
      setArtworks: (artworks: Artwork[]) => set({ artworks }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setHasMore: (hasMore: boolean) => set({ hasMore }),
      setSearchResults: (results: number[]) => set({ searchResults: results }),
      setCurrentView: (view: ViewType) => set({ currentView: view }),
      setSelectedArtwork: (artwork: Artwork | null) => set({ selectedArtwork: artwork }),
      toggleFavorite: (artwork: Artwork) => {
        const favorites = get().favorites;
        const isFavorite = favorites.some((fav: Artwork) => fav.objectID === artwork.objectID);
        let newFavorites;
        if (isFavorite) {
          newFavorites = favorites.filter((fav: Artwork) => fav.objectID !== artwork.objectID);
        } else {
          newFavorites = [...favorites, artwork];
        }
        set({ favorites: newFavorites });
      },
    }),
    {
      name: 'met-favorites',
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
