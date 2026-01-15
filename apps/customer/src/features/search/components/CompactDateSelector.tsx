"use client";
import { motion } from "@repo/ui/motion";
import { ChevronLeft, ChevronRight, X } from "@repo/ui/icons";
import { useState } from "react";

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface CompactDateSelectorProps {
  open: boolean;
  onClose: () => void;
  value: DateRange;
  onChange: (range: DateRange) => void;
  layoutId: string;
}

export default function CompactDateSelector({ open, onClose, value, onChange, layoutId }: CompactDateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number, monthOffset: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);

    if (!value.checkIn || (value.checkIn && value.checkOut)) {
      onChange({ checkIn: selectedDate, checkOut: null });
    } else {
      if (selectedDate < value.checkIn) {
        onChange({ checkIn: selectedDate, checkOut: value.checkIn });
      } else {
        onChange({ checkIn: value.checkIn, checkOut: selectedDate });
      }
    }
  };

  const isStartDate = (day: number, monthOffset: number) => {
    if (!value.checkIn) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    return date.toDateString() === value.checkIn.toDateString();
  };

  const isEndDate = (day: number, monthOffset: number) => {
    if (!value.checkOut) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    return date.toDateString() === value.checkOut.toDateString();
  };

  const isInRange = (day: number, monthOffset: number) => {
    if (!value.checkIn || !value.checkOut) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    return date > value.checkIn && date < value.checkOut;
  };

  const renderMonth = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="flex-1">
        <div className="font-semibold text-gray-900 text-center mb-4">
          {monthNames[month.getMonth()]} năm {month.getFullYear()}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}
          {days.map(day => {
            const isStart = isStartDate(day, monthOffset);
            const isEnd = isEndDate(day, monthOffset);
            const inRange = isInRange(day, monthOffset);
            const dayOfWeek = (firstDay + day - 1) % 7;
            const isRowStart = dayOfWeek === 0;
            const isRowEnd = dayOfWeek === 6;

            // Check if date is in the past
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPastDate = currentDate < today;

            return (
              <div key={day} className="relative">
                {inRange && (
                  <div className={`absolute inset-y-0 left-0 right-0 bg-[var(--primary)]/10 ${isRowStart ? 'rounded-l-full' : ''
                    } ${isRowEnd ? 'rounded-r-full' : ''}`} />
                )}
                {isStart && value.checkOut && (
                  <div className="absolute inset-0 left-[49%] bg-[var(--primary)]/10" />
                )}
                {isEnd && value.checkIn && (
                  <div className="absolute inset-0 right-[51%] bg-[var(--primary)]/10" />
                )}

                <motion.button
                  whileHover={!isPastDate ? { scale: 1.05 } : {}}
                  whileTap={!isPastDate ? { scale: 0.95 } : {}}
                  onClick={() => !isPastDate && handleDateClick(day, monthOffset)}
                  disabled={isPastDate}
                  className={`relative aspect-square w-full flex items-center justify-center text-sm font-medium transition-all ${isPastDate
                      ? 'text-gray-300 cursor-not-allowed'
                      : isStart || isEnd
                        ? 'bg-[var(--primary)] text-white rounded-full z-10 shadow-md shadow-[var(--primary)]/30'
                        : inRange
                          ? 'text-[var(--primary)]'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-full'
                    }`}
                >
                  {day}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    );
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
        className="bg-white rounded-[32px] shadow-2xl p-8 w-[1000px] border border-gray-100 overflow-hidden"
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold font-anton text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></span>
            Chọn ngày nhận & trả phòng
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-start justify-between">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all mt-10 text-gray-600 hover:text-[var(--primary)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-12 flex-1 px-8">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>

          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all mt-10 text-gray-600 hover:text-[var(--primary)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase tracking-wide hover:bg-[var(--primary)]/90 transition-all shadow-lg shadow-[var(--primary)]/20">
            Áp dụng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
