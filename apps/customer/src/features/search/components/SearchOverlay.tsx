"use client";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { Search, X, MapPin, Calendar, Users, SlidersHorizontal } from "@repo/ui/icons";
import { useState, useEffect, KeyboardEvent } from "react";
import DateRangePicker from "./DateRangePicker";
import GuestRoomSelector from "./GuestRoomSelector";
import FilterModal from "./FilterModal";
import CompactDateSelector from "./CompactDateSelector";
import CompactGuestSelector from "./CompactGuestSelector";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (filters: SearchFilters) => void;
  isSearchMode?: boolean;
  isSearchBarCompact?: boolean;
  isSearching?: boolean;
}

export interface SearchFilters {
  query: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  rooms: number;
}

export default function SearchOverlay({
  open,
  onClose,
  onSearch,
  isSearchMode = false,
  isSearchBarCompact = false,
  isSearching = false,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ checkIn: Date | null; checkOut: Date | null }>({
    checkIn: null,
    checkOut: null
  });
  const [guestRoom, setGuestRoom] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [activeSelector, setActiveSelector] = useState<'date' | 'guest' | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch({
        query: query.trim(),
        checkIn: dateRange.checkIn,
        checkOut: dateRange.checkOut,
        ...guestRoom
      });
      // Close overlay after 1.5s loading
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const formatDateRange = () => {
    if (!dateRange.checkIn || !dateRange.checkOut) return "Chọn ngày";
    const checkIn = dateRange.checkIn.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const checkOut = dateRange.checkOut.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return `${checkIn} - ${checkOut}`;
  };

  const formatGuestRoom = () => {
    const parts = [];
    if (guestRoom.adults) parts.push(`${guestRoom.adults} người lớn`);
    if (guestRoom.children) parts.push(`${guestRoom.children} trẻ em`);
    parts.push(`${guestRoom.rooms} phòng`);
    return parts.join(', ');
  };

  return (
    <>
      <AnimatePresence>
        {open && !isSearchMode && (
          <>
            {/* Dark backdrop matching home page */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xl"
              onClick={onClose}
            />

            {/* Search overlay with home page styling */}
            <motion.div
              layoutId="search-bar"
              transition={{
                layout: {
                  type: "spring",
                  damping: 16,
                  stiffness: 100,
                },
              }}
              className="fixed z-[70] inset-x-0 top-[8vh] flex justify-center px-4"
            >
              <div className="relative rounded-3xl p-8 w-full max-w-[900px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-anton text-[clamp(24px,3vw,28px)] font-bold text-white uppercase tracking-tight" style={{ fontStretch: "condensed", letterSpacing: "-0.01em" }}>
                    TÌM KIẾM KHÁCH SẠN
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Location Input */}
                  <div className="relative overflow-hidden rounded-3xl">
                    {/* Loading shimmer */}
                    {isSearching && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                    <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tìm theo địa chỉ hoặc tên khách sạn..."
                      className="w-full pl-16 pr-4 py-6 text-lg bg-white/10 rounded-3xl border-white/30 focus:border-white/50 focus:outline-none transition-all text-white placeholder:text-white/50"
                    />
                  </div>

                  {/* Date Range & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <motion.button
                        layoutId="date-picker"
                        transition={{
                          layout: {
                            type: "spring",
                            damping: 18,
                            stiffness: 100,
                          },
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDatePicker(true)}
                        className="w-full flex items-center gap-3 px-6 py-6 bg-white/12 backdrop-blur-sm rounded-3xl border-2 border-white/30 hover:bg-white/20 transition-colors text-left group"
                      >
                        <Calendar className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                        <div className="flex-1">
                          <div className="text-xs text-white/60 mb-0.5 font-medium">Ngày nhận & trả phòng</div>
                          <div className="font-semibold text-white">{formatDateRange()}</div>
                        </div>
                      </motion.button>

                      <DateRangePicker
                        open={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </div>

                    <div className="relative">
                      <motion.button
                        layoutId="guest-selector"
                        transition={{
                          layout: {
                            type: "spring",
                            damping: 18,
                            stiffness: 100,
                          },
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowGuestSelector(true)}
                        className="w-full flex items-center gap-3 px-6 py-6 bg-white/12 backdrop-blur-sm rounded-3xl border-2 border-white/30 hover:bg-white/20 transition-colors text-left group"
                      >
                        <Users className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                        <div className="flex-1">
                          <div className="text-xs text-white/60 mb-0.5 font-medium">Khách và phòng</div>
                          <div className="font-semibold text-white">{formatGuestRoom()}</div>
                        </div>
                      </motion.button>

                      <GuestRoomSelector
                        open={showGuestSelector}
                        onClose={() => setShowGuestSelector(false)}
                        value={guestRoom}
                        onChange={setGuestRoom}
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.24)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="w-full py-6 px-6 bg-white/12 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-[13px] rounded-3xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-[0.12em]"
                  >
                    <Search className="w-5 h-5" />
                    TÌM KIẾM
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compact search bar for search mode */}
      <AnimatePresence>
        {isSearchMode && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: isSearchBarCompact ? -100 : 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed z-[50] inset-x-56 top-4 flex justify-center items-stretch gap-4 px-4"
          >
            <div className={`relative bg-white rounded-3xl border border-gray-200 w-full max-w-[800px] overflow-hidden ${activeSelector ? '' : 'shadow-2xl'}`}>
              {isSearching && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                />
              )}

              <div className="flex items-center gap-3 p-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Địa chỉ hoặc tên khách sạn..."
                    className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <div className="h-8 w-px bg-gray-200" />

                <button
                  onClick={() => {
                    setActiveSelector('date');
                    setFilterOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors ${activeSelector === 'date' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formatDateRange()}</span>
                </button>

                <div className="h-8 w-px bg-gray-200" />

                <button
                  onClick={() => {
                    setActiveSelector('guest');
                    setFilterOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors ${activeSelector === 'guest' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formatGuestRoom()}</span>
                </button>

                <button
                  onClick={handleSearch}
                  className="ml-2 w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary)]/90 transition-colors flex-shrink-0"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>


            <AnimatePresence>
              {!filterOpen && (
                <motion.button
                  layoutId="filter-modal"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 100,
                  }}
                  onClick={() => setFilterOpen(true)}
                  className="relative h-auto self-stretch flex items-center gap-2 px-6 bg-white rounded-3xl shadow-2xl border border-gray-100 text-[var(--primary)] font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-5 h-5 text-[var(--primary)]" />
                  Filter
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {filterOpen && (
          <FilterModal
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            layoutId="filter-modal"
          />
        )}
      </AnimatePresence>

      {/* Shared Backdrop for Compact Selectors */}
      <AnimatePresence>
        {activeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[40] bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setActiveSelector(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Compact Selectors - Same layoutId for morphing between them */}
      <AnimatePresence>
        {activeSelector === 'date' && (
          <CompactDateSelector
            key="date"
            open={true}
            onClose={() => setActiveSelector(null)}
            value={dateRange}
            onChange={setDateRange}
            layoutId="compact-selector-shared"
          />
        )}
        {activeSelector === 'guest' && (
          <CompactGuestSelector
            key="guest"
            open={true}
            onClose={() => setActiveSelector(null)}
            value={guestRoom}
            onChange={setGuestRoom}
            layoutId="compact-selector-shared"
          />
        )}
      </AnimatePresence>
    </>
  );
}