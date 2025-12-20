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
          {/* Dark backdrop matching home page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Guest selector with home page styling */}
          <motion.div
            layoutId="guest-selector"
            transition={{
              layout: {
                type: "spring",
                damping: 16,
                stiffness: 100,
              },
            }}
            className="absolute left-0 right-0 top-full mt-2 z-[101] bg-white/12 backdrop-blur-sm border-2 border-white/30 rounded-3xl shadow-2xl p-8 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-anton text-[20px] font-bold text-white uppercase tracking-tight" style={{ fontStretch: "condensed", letterSpacing: "-0.01em" }}>Khách và phòng</h3>
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors text-white text-xl"
              >
                ×
              </motion.button>
            </div>

            <div className="space-y-5">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Người lớn</div>
                  <div className="text-sm text-white/60">Từ 13 tuổi trở lên</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('adults', -1)}
                    disabled={value.adults <= 1}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg text-white">{value.adults}</div>
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('adults', 1)}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Trẻ em</div>
                  <div className="text-sm text-white/60">Từ 0-12 tuổi</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('children', -1)}
                    disabled={value.children <= 0}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg text-white">{value.children}</div>
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('children', 1)}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Phòng</div>
                  <div className="text-sm text-white/60">Số lượng phòng</div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('rooms', -1)}
                    disabled={value.rooms <= 1}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </motion.button>
                  <div className="w-12 text-center font-semibold text-lg text-white">{value.rooms}</div>
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateValue('rooms', 1)}
                    className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.24)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-6 py-4 bg-white/12 backdrop-blur-sm border-2 border-white/30 text-white rounded-3xl font-bold uppercase tracking-[0.12em] text-[13px] transition-all"
            >
              Xong
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
