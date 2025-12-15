"use client";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { Search, X, MapPin, Calendar, Users } from "@repo/ui/icons";
import { useState, useEffect, KeyboardEvent } from "react";
import DateRangePicker from "./DateRangePicker";
import GuestRoomSelector from "./GuestRoomSelector";

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

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch({
        query: query.trim(),
        checkIn: dateRange.checkIn,
        checkOut: dateRange.checkOut,
        ...guestRoom
      });
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed z-[70] inset-x-0 top-[12vh] flex justify-center px-4"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[900px]">
                {isSearching && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent"
                  />
                )}

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm khách sạn</h2>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Location Input */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tìm theo địa chỉ hoặc tên khách sạn..."
                      className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Date Range & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowDatePicker(true)}
                        className="w-full flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-[var(--primary)] transition-colors text-left group"
                      >
                        <Calendar className="w-5 h-5 text-gray-400 group-hover:text-[var(--primary)]" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Ngày nhận & trả phòng</div>
                          <div className="font-semibold text-gray-900">{formatDateRange()}</div>
                        </div>
                      </button>

                      <DateRangePicker
                        open={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowGuestSelector(true)}
                        className="w-full flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-[var(--primary)] transition-colors text-left group"
                      >
                        <Users className="w-5 h-5 text-gray-400 group-hover:text-[var(--primary)]" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Khách và phòng</div>
                          <div className="font-semibold text-gray-900">{formatGuestRoom()}</div>
                        </div>
                      </button>

                      <GuestRoomSelector
                        open={showGuestSelector}
                        onClose={() => setShowGuestSelector(false)}
                        value={guestRoom}
                        onChange={setGuestRoom}
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="w-full py-4 px-6 bg-[var(--primary)] text-white font-semibold text-lg rounded-2xl hover:bg-[var(--primary)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Tìm kiếm
                  </button>
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
            className="fixed z-[50] inset-x-0 top-4 flex justify-center px-4"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-[900px]">
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
                  onClick={() => setShowDatePicker(true)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formatDateRange()}</span>
                </button>

                <div className="h-8 w-px bg-gray-200" />

                <button
                  onClick={() => setShowGuestSelector(true)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}