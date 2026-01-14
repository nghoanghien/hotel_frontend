import { useState, useEffect, useCallback } from 'react';
import { mockHotels } from '@/features/search/data/mockHotelData';
import type { HotelDetailDto } from '@repo/types';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

const getUniqueCategories = (): Category[] => {
  // Synthesize categories from Cities in mockHotels
  const cities = Array.from(new Set(mockHotels.map(h => h.city || 'Other')));
  return cities.map((city, index) => ({
    id: `cat-${index}`,
    name: city,
    slug: city.toLowerCase().replace(/ /g, '-')
  }));
};

const getHotelsByCategory = (categoryId: string): HotelDetailDto[] => {
  const categories = getUniqueCategories();
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];
  return mockHotels.filter(h => h.city === cat.name);
};

export const getCategoryBackgroundImage = (slug: string): string => {
  // Return a generic background or based on city
  if (slug.includes('nha-trang')) return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200';
  if (slug.includes('da-nang')) return 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200';
  if (slug.includes('da-lat')) return 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200';
  return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';
};

export function useHomePage() {
  const categories = getUniqueCategories();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeHotelIndex, setActiveHotelIndex] = useState(0);
  const [filter, setFilter] = useState('All categories');

  const activeCategory = categories[activeCategoryIndex];
  const hotelsInCategory = getHotelsByCategory(activeCategory?.id || '');
  const backgroundImage = getCategoryBackgroundImage(activeCategory?.slug || '');

  // Reset hotel index when category changes
  useEffect(() => {
    setActiveHotelIndex(0);
  }, [activeCategoryIndex]);

  const handleCategoryChange = useCallback((index: number) => {
    if (index >= 0 && index < categories.length) {
      setActiveCategoryIndex(index);
    }
  }, [categories.length]);

  const handleHotelChange = useCallback((index: number) => {
    if (index >= 0 && index < hotelsInCategory.length) {
      setActiveHotelIndex(index);
    }
  }, [hotelsInCategory.length]);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  // Navigation methods
  const goToNextCategory = useCallback(() => {
    if (activeCategoryIndex < categories.length - 1) {
      handleCategoryChange(activeCategoryIndex + 1);
    }
  }, [activeCategoryIndex, categories.length, handleCategoryChange]);

  const goToPreviousCategory = useCallback(() => {
    if (activeCategoryIndex > 0) {
      handleCategoryChange(activeCategoryIndex - 1);
    }
  }, [activeCategoryIndex, handleCategoryChange]);

  const goToNextHotel = useCallback(() => {
    if (activeHotelIndex < hotelsInCategory.length - 1) {
      handleHotelChange(activeHotelIndex + 1);
    }
  }, [activeHotelIndex, hotelsInCategory.length, handleHotelChange]);

  const goToPreviousHotel = useCallback(() => {
    if (activeHotelIndex > 0) {
      handleHotelChange(activeHotelIndex - 1);
    }
  }, [activeHotelIndex, handleHotelChange]);

  return {
    // State
    categories,
    activeCategoryIndex,
    activeCategory,
    hotelsInCategory,
    activeHotelIndex,
    activeHotel: hotelsInCategory[activeHotelIndex],
    backgroundImage,
    filter,

    // Handlers
    handleCategoryChange,
    handleHotelChange,
    handleFilterChange,

    // Navigation
    goToNextCategory,
    goToPreviousCategory,
    goToNextHotel,
    goToPreviousHotel,

    // Status
    canGoToNextCategory: activeCategoryIndex < categories.length - 1,
    canGoToPreviousCategory: activeCategoryIndex > 0,
    canGoToNextHotel: activeHotelIndex < hotelsInCategory.length - 1,
    canGoToPreviousHotel: activeHotelIndex > 0,
  };
}
