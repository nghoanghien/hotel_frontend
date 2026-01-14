import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { searchHotels, HotelSearchFilters } from '../data/mockHotelData';
import type { SearchFilters } from '../components/SearchOverlay';

export interface HotelSearchResult {
  hotel: Hotel;
  layoutType: number; // 1-10 for different magazine layouts
}

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if we're in search mode (has search query param)
  const isSearchMode = searchParams.has('q');

  // Perform search
  const performSearch = useCallback(async (filters: SearchFilters) => {
    if (!filters.query.trim()) {
      return;
    }

    const alreadyInSearchMode = searchParams.has('q');
    setIsSearching(true);

    // If we're already in search mode (compact search bar), push URL first so other instances react immediately
    if (alreadyInSearchMode) {
      const paramsEarly = new URLSearchParams(searchParams.toString());
      paramsEarly.set('q', filters.query);
      if (filters.checkIn) paramsEarly.set('checkIn', filters.checkIn.toISOString());
      if (filters.checkOut) paramsEarly.set('checkOut', filters.checkOut.toISOString());
      paramsEarly.set('adults', filters.adults.toString());
      paramsEarly.set('children', filters.children.toString());
      paramsEarly.set('rooms', filters.rooms.toString());
      router.push(`?${paramsEarly.toString()}`, { scroll: false });
    }

    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get search results
    const hotelFilters: HotelSearchFilters = {
      query: filters.query,
      checkIn: filters.checkIn?.toISOString(),
      checkOut: filters.checkOut?.toISOString(),
      adults: filters.adults,
      children: filters.children,
      rooms: filters.rooms
    };
    const hotels = searchHotels(hotelFilters);

    // Prepare results with random layout types
    const resultsWithLayout: HotelSearchResult[] = hotels.map(hotel => ({
      hotel,
      layoutType: Math.floor(Math.random() * 10) + 1,
    }));

    setSearchResults(resultsWithLayout);
    setIsSearching(false);
    setHasSearched(true);
    setSearchFilters(filters);

    // If we were NOT in search mode (overlay search on home), only update URL after loading finishes
    if (!alreadyInSearchMode) {
      const paramsLate = new URLSearchParams(searchParams.toString());
      paramsLate.set('q', filters.query);
      if (filters.checkIn) paramsLate.set('checkIn', filters.checkIn.toISOString());
      if (filters.checkOut) paramsLate.set('checkOut', filters.checkOut.toISOString());
      paramsLate.set('adults', filters.adults.toString());
      paramsLate.set('children', filters.children.toString());
      paramsLate.set('rooms', filters.rooms.toString());
      router.push(`?${paramsLate.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Clear search and return to home
  const clearSearch = useCallback(() => {
    setSearchFilters({
      query: '',
      checkIn: null,
      checkOut: null,
      adults: 2,
      children: 0,
      rooms: 1
    });
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);

    const next = new URLSearchParams(searchParams.toString());
    next.delete('q');
    next.delete('checkIn');
    next.delete('checkOut');
    next.delete('adults');
    next.delete('children');
    next.delete('rooms');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Load search results on mount if query param exists
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (!query) return;
    if (isSearching) return;

    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');

    const filters: SearchFilters = {
      query,
      checkIn: checkInParam ? new Date(checkInParam) : null,
      checkOut: checkOutParam ? new Date(checkOutParam) : null,
      adults: parseInt(searchParams.get('adults') || '2'),
      children: parseInt(searchParams.get('children') || '0'),
      rooms: parseInt(searchParams.get('rooms') || '1')
    };

    // Trigger when URL param changes OR on reload when we haven't searched yet
    if (query !== searchFilters.query || !hasSearched) {
      performSearch(filters);
    }
  }, [searchParams, searchFilters.query, performSearch, isSearching, hasSearched]);

  return {
    searchFilters,
    setSearchFilters,
    searchResults,
    isSearching,
    hasSearched,
    isSearchMode,
    performSearch,
    clearSearch,
  };
}
