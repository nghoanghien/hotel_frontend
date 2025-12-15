"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Users, Minus, Plus } from "@repo/ui/icons";

interface GuestRoomSelectorProps {
  open: boolean;
  onClose: () => void;
  value: {
    adults: number;
    children: number;
    rooms: number;
  };
  onChange: (value: { adults: number; children: number; rooms: number }) => void;
}

export default function GuestRoomSelector({ open, onClose, value, onChange }: GuestRoomSelectorProps) {
  const updateValue = (field: keyof typeof value, delta: number) => {
    const newValue = Math.max(field === 'children' ? 0 : 1, value[field] + delta);
    onChange({ ...value, [field]: newValue });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 right-0 top-full mt-2 z-[101] bg-white rounded-3xl shadow-2xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Khách và phòng</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Người lớn</div>
                  <div className="text-sm text-gray-500">Từ 13 tuổi trở lên</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('adults', -1)}
                    disabled={value.adults <= 1}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg">{value.adults}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('adults', 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Trẻ em</div>
                  <div className="text-sm text-gray-500">Từ 0-12 tuổi</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('children', -1)}
                    disabled={value.children <= 0}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg">{value.children}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('children', 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Phòng</div>
                  <div className="text-sm text-gray-500">Số lượng phòng</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('rooms', -1)}
                    disabled={value.rooms <= 1}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg">{value.rooms}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('rooms', 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors"
            >
              Xong
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
