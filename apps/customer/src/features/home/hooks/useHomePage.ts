import { useState, useEffect, useCallback } from 'react';
import {
  getUniqueCategories,
  getHotelsByCategory,
  getCategoryBackgroundImage,
} from '../data/mockRestaurants';

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
