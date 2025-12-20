"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ChevronLeft, ChevronRight, X } from "@repo/ui/icons";
import { useState } from "react";

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

  const formatDateRange = () => {
    if (!value.checkIn) return '';
    const checkInStr = `${value.checkIn.getDate()} thg ${value.checkIn.getMonth() + 1}`;
    if (!value.checkOut) return checkInStr;
    const checkOutStr = `${value.checkOut.getDate()} thg ${value.checkOut.getMonth() + 1}`;
    return `${checkInStr} - ${checkOutStr}`;
  };

  const renderMonth = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="flex-1">
        <div className="font-semibold text-white text-center mb-4">
          {monthNames[month.getMonth()]} năm {month.getFullYear()}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid with row gaps */}
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

            return (
              <div key={day} className="relative">
                {/* Background connecting line for in-range dates with rounded corners at row ends */}
                {inRange && (
                  <div className={`absolute inset-y-0 left-0 right-0 bg-white/10 ${isRowStart ? 'rounded-l-full' : ''
                    } ${isRowEnd ? 'rounded-r-full' : ''}`} />
                )}
                {/* Background for start date - fills right half */}
                {isStart && value.checkOut && (
                  <div className="absolute inset-0 left-[49%] bg-white/10" />
                )}
                {/* Background for end date - fills left half */}
                {isEnd && value.checkIn && (
                  <div className="absolute inset-0 right-[51%] bg-white/10" />
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day, monthOffset)}
                  style={
                    isStart && value.checkOut
                      ? { background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 50%, transparent 50%)' }
                      : isEnd && value.checkIn
                        ? { background: 'linear-gradient(to right, transparent 50%, rgba(255, 255, 255, 0.1) 50%)' }
                        : undefined
                  }
                  className={`relative aspect-square w-full flex items-center justify-center text-sm font-medium transition-all ${isStart || isEnd
                    ? 'bg-white/20 border-2 border-white/30 text-white rounded-full z-10'
                    : inRange
                      ? 'text-white/90'
                      : 'hover:bg-white/10 text-white/70 hover:text-white rounded-full'
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

          {/* Date picker with home page styling - centered like SearchOverlay */}
          <motion.div
            layoutId="date-picker"
            transition={{
              layout: {
                type: "spring",
                damping: 16,
                stiffness: 100,
              },
            }}
            className="fixed z-[101] inset-x-0 top-[15vh] flex justify-center px-4"
          >
            <div className="bg-white/0 backdrop-blur-sm border-2 border-white/30 rounded-[30px] shadow-2xl p-10 w-[1000px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-anton text-[24px] font-bold text-white uppercase tracking-tight" style={{ fontStretch: "condensed", letterSpacing: "-0.01em" }}>
                  Chọn ngày {formatDateRange() && `(${formatDateRange()})`}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center transition-colors text-white text-xl"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              <div className="flex items-start justify-between mb-6">
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevMonth}
                  className="w-12 h-12 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors mt-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>

                <div className="flex gap-12 flex-1 px-6">
                  {renderMonth(0)}
                  {renderMonth(1)}
                </div>

                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextMonth}
                  className="w-12 h-12 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors mt-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
