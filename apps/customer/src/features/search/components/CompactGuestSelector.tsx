"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Users, X } from "@repo/ui/icons";

interface CompactGuestSelectorProps {
  open: boolean;
  onClose: () => void;
  value: {
    adults: number;
    children: number;
    rooms: number;
  };
  onChange: (value: { adults: number; children: number; rooms: number }) => void;
  layoutId: string;
}

export default function CompactGuestSelector({ open, onClose, value, onChange, layoutId }: CompactGuestSelectorProps) {
  const updateValue = (field: keyof typeof value, delta: number) => {
    const newValue = Math.max(field === 'children' ? 0 : 1, value[field] + delta);
    onChange({ ...value, [field]: newValue });
  };

  if (!open) return null;

  return (
    <motion.div
      layoutId={layoutId}
      className="fixed z-[45] inset-x-0 top-[calc(4rem+24px)] flex justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
        className="bg-white rounded-[32px] shadow-2xl p-8 w-[600px] border border-gray-100 overflow-hidden"
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold font-anton text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></span>
            Khách và phòng
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4">
          {/* Adults */}
          <div className="flex items-center justify-between py-6 border-b border-gray-100">
            <div className="flex flex-col">
              <span className="font-bold text-[#1A1A1A] text-lg">Người lớn</span>
              <span className="text-sm text-gray-500">Từ 13 tuổi trở lên</span>
            </div>
            <div className="flex items-center justify-center gap-16 bg-gray-200 rounded-3xl px-6 py-4 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('adults', -1)}
                disabled={value.adults <= 1}
                className="text-4xl font-semibold text-gray-600 w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </motion.button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-md text-gray-800 font-semibold">
                  Người lớn
                </span>
                <div className="flex items-center gap-0">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div className="relative h-9 w-12">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={value.adults}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#1A1A1A]"
                      >
                        {value.adults}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {value.adults} {value.adults === 1 ? "người" : "người"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('adults', 1)}
                className="text-3xl font-bold text-gray-600 w-8 h-8 flex items-center justify-center"
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-6 border-b border-gray-100">
            <div className="flex flex-col">
              <span className="font-bold text-[#1A1A1A] text-lg">Trẻ em</span>
              <span className="text-sm text-gray-500">Từ 0-12 tuổi</span>
            </div>
            <div className="flex items-center justify-center gap-16 bg-gray-200 rounded-3xl px-6 py-4 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('children', -1)}
                disabled={value.children <= 0}
                className="text-4xl font-semibold text-gray-600 w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </motion.button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-md text-gray-800 font-semibold">
                  Trẻ em
                </span>
                <div className="flex items-center gap-0">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div className="relative h-9 w-12">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={value.children}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#1A1A1A]"
                      >
                        {value.children}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {value.children} {value.children === 1 ? "trẻ" : "trẻ"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('children', 1)}
                className="text-3xl font-bold text-gray-600 w-8 h-8 flex items-center justify-center"
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-center justify-between py-6">
            <div className="flex flex-col">
              <span className="font-bold text-[#1A1A1A] text-lg">Phòng</span>
              <span className="text-sm text-gray-500">Số lượng phòng</span>
            </div>
            <div className="flex items-center justify-center gap-16 bg-gray-200 rounded-3xl px-6 py-4 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('rooms', -1)}
                disabled={value.rooms <= 1}
                className="text-4xl font-semibold text-gray-600 w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </motion.button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-md text-gray-800 font-semibold">
                  Phòng
                </span>
                <div className="flex items-center gap-0">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <div className="relative h-9 w-12">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={value.rooms}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#1A1A1A]"
                      >
                        {value.rooms}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {value.rooms} {value.rooms === 1 ? "phòng" : "phòng"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateValue('rooms', 1)}
                className="text-3xl font-bold text-gray-600 w-8 h-8 flex items-center justify-center"
              >
                +
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
