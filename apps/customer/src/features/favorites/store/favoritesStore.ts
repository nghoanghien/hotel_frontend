"use client";
import { create } from "@repo/store";

interface FavoritesStore {
  favoriteHotelIds: string[];
  addFavorite: (hotelId: string) => void;
  removeFavorite: (hotelId: string) => void;
  toggleFavorite: (hotelId: string) => void;
  isFavorite: (hotelId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteHotelIds: [],

  addFavorite: (hotelId: string) =>
    set((state) => ({
      favoriteHotelIds: state.favoriteHotelIds.includes(hotelId)
        ? state.favoriteHotelIds
        : [...state.favoriteHotelIds, hotelId],
    })),

  removeFavorite: (hotelId: string) =>
    set((state) => ({
      favoriteHotelIds: state.favoriteHotelIds.filter((id) => id !== hotelId),
    })),

  toggleFavorite: (hotelId: string) => {
    const { favoriteHotelIds } = get();
    if (favoriteHotelIds.includes(hotelId)) {
      get().removeFavorite(hotelId);
    } else {
      get().addFavorite(hotelId);
    }
  },

  isFavorite: (hotelId: string) => get().favoriteHotelIds.includes(hotelId),
}));
