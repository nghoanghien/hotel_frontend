"use client";
import { useEffect, useMemo, useState } from "react";
import { useLoading } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Heart, Grid3x3, List, SlidersHorizontal, Sparkles } from "@repo/ui/icons";
import { useFavoritesStore } from "@/features/favorites/store/favoritesStore";
import { getAllHotels } from "@/features/search/data/mockHotelData";
import { getInitialFavorites } from "@/features/favorites/data/mockFavorites";
import FavoriteHotelCard from "@/features/favorites/components/FavoriteHotelCard";
import type { Hotel } from "@repo/types";

type ViewMode = "grid" | "list";
type SortOption = "name" | "rating" | "price";

export default function FavoritesPage() {
  const { hide } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const favoriteHotelIds = useFavoritesStore((s) => s.favoriteHotelIds);
  const addFavorite = useFavoritesStore((s) => s.addFavorite);

  // Initialize favorites from mock data on mount
  useEffect(() => {
    const initialFavorites = getInitialFavorites();
    initialFavorites.forEach((id) => addFavorite(id));
  }, [addFavorite]);

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allHotels = useMemo(() => getAllHotels(), []);

  const favoriteHotels = useMemo(() => {
    const hotels = allHotels.filter((hotel) => favoriteHotelIds.includes(hotel.id));

    // Sort hotels
    const sorted = [...hotels].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "price":
          const minPriceA = Math.min(...a.roomTypes.map((r) => r.price));
          const minPriceB = Math.min(...b.roomTypes.map((r) => r.price));
          return minPriceA - minPriceB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [allHotels, favoriteHotelIds, sortBy]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-[72px] font-bold leading-none text-[#1A1A1A] mb-3"
                style={{
                  fontStretch: "condensed",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-anton), var(--font-sans)",
                }}
              >
                MY FAVORITES
              </h1>
              <p className="text-gray-600 text-lg">
                {favoriteHotels.length} {favoriteHotels.length === 1 ? "hotel" : "hotels"} saved
              </p>
            </div>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-2.5 pr-10 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-xl border-2 border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list"
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 border border-red-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{favoriteHotels.length}</div>
              </div>
              <div className="text-sm text-gray-600">Total Favorites</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {favoriteHotels.length > 0
                    ? (favoriteHotels.reduce((sum, h) => sum + h.rating, 0) / favoriteHotels.length).toFixed(1)
                    : "0.0"}
                </div>
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                  {new Set(favoriteHotels.flatMap((h) => h.categories.map((c) => c.id))).size}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {new Set(favoriteHotels.flatMap((h) => h.categories.map((c) => c.id))).size}
                </div>
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </motion.div>
          </div> */}
        </div>

        {/* Hotels Grid/List */}
        {favoriteHotels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start exploring and add hotels to your favorites to see them here
            </p>
            <button
              onClick={() => window.location.href = "/home"}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors"
            >
              Explore Hotels
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {favoriteHotels.map((hotel) => (
                <FavoriteHotelCard key={hotel.id} hotel={hotel} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
