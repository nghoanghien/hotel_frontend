"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Calendar, ChevronLeft, ChevronRight } from "@repo/ui/icons";
import { useState, useEffect } from "react";

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ open, onClose, value, onChange }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (selecting === 'checkIn') {
      onChange({ checkIn: selectedDate, checkOut: value.checkOut });
      setSelecting('checkOut');
    } else {
      if (value.checkIn && selectedDate <= value.checkIn) {
        onChange({ checkIn: selectedDate, checkOut: null });
        setSelecting('checkOut');
      } else {
        onChange({ ...value, checkOut: selectedDate });
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isInRange = (day: number) => {
    if (!value.checkIn || !value.checkOut) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > value.checkIn && date < value.checkOut;
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (value.checkIn && date.toDateString() === value.checkIn.toDateString()) ||
      (value.checkOut && date.toDateString() === value.checkOut.toDateString());
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
              <h3 className="text-xl font-bold text-gray-900">Chọn ngày</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setSelecting('checkIn')}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${selecting === 'checkIn'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-xs text-gray-500 mb-1">Nhận phòng</div>
                <div className="font-semibold text-gray-900">
                  {value.checkIn ? value.checkIn.toLocaleDateString('vi-VN') : 'Chọn ngày'}
                </div>
              </button>
              <button
                onClick={() => setSelecting('checkOut')}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${selecting === 'checkOut'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-xs text-gray-500 mb-1">Trả phòng</div>
                <div className="font-semibold text-gray-900">
                  {value.checkOut ? value.checkOut.toLocaleDateString('vi-VN') : 'Chọn ngày'}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square" />
              ))}
              {days.map(day => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${isSelected(day)
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : isInRange(day)
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'hover:bg-gray-100 text-gray-900'
                    }`}
                >
                  {day}
                </motion.button>
              ))}
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
