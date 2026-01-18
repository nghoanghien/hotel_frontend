import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChevronLeft, ChevronRight, Clock, Calendar } from '@repo/ui/icons';

interface DateTimePickerProps {
  label: string;
  value: string | Date | null;
  onChange: (date: string) => void; // Returns ISO string or formatted string
  minDate?: Date;
}

export default function DateTimePicker({ label, value, onChange, minDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize internal state from props
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

  // Time state
  const [hours, setHours] = useState(value ? new Date(value).getHours() : 9);
  const [minutes, setMinutes] = useState(value ? new Date(value).getMinutes() : 0);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setHours(d.getHours());
        setMinutes(d.getMinutes());
        // Only update current month if the menu is closed, to avoid jumping while browsing
        if (!isOpen) setCurrentMonth(d);
      }
    }
  }, [value, isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, hours, minutes);
    setSelectedDate(newDate);
    // Emit change immediately
    onChange(formatToISO(newDate));
  };

  const formatToISO = (date: Date) => {
    // Return local ISO format-ish (YYYY-MM-DDTHH:mm) or just ISO
    // The previous inputs used YYYY-MM-DD. If we want time, we need YYYY-MM-DDTHH:mm
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - (offset * 60 * 1000));
    return local.toISOString().slice(0, 16); // "2024-05-20T15:30"
  };

  const updateTime = (newH: number, newM: number) => {
    setHours(newH);
    setMinutes(newM);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(newH);
      newDate.setMinutes(newM);
      setSelectedDate(newDate);
      onChange(formatToISO(newDate));
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)); }}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-bold font-anton text-gray-800 uppercase tracking-wide">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)); }}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();

            const isToday = new Date().toDateString() === date.toDateString();
            const isDisabled = minDate && date < new Date(minDate.setHours(0, 0, 0, 0));

            return (
              <button
                key={day}
                disabled={!!isDisabled}
                onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                className={`
                  aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all
                  ${isSelected ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30' : 'hover:bg-gray-100 text-gray-600'}
                  ${isToday && !isSelected ? 'text-lime-600 border border-lime-200' : ''}
                  ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Time Picker Section */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Clock size={12} /> Time
          </div>
          <div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <div className="flex-1 flex items-center gap-2 justify-center">
              <input
                type="number"
                min={0} max={23}
                value={hours.toString().padStart(2, '0')}
                onChange={(e) => {
                  let h = parseInt(e.target.value);
                  if (h < 0) h = 0; if (h > 23) h = 23;
                  updateTime(h, minutes);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-12 text-center bg-white border border-gray-200 rounded-lg py-1 text-sm font-bold text-gray-900 focus:border-lime-500 outline-none"
              />
              <span className="font-bold text-gray-400">:</span>
              <input
                type="number"
                min={0} max={59}
                value={minutes.toString().padStart(2, '0')}
                onChange={(e) => {
                  let m = parseInt(e.target.value);
                  if (m < 0) m = 0; if (m > 59) m = 59;
                  updateTime(hours, m);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-12 text-center bg-white border border-gray-200 rounded-lg py-1 text-sm font-bold text-gray-900 focus:border-lime-500 outline-none"
              />
            </div>
            <div className="text-xs font-bold text-gray-400 px-2">{hours >= 12 ? 'PM' : 'AM'}</div>
          </div>
        </div>
      </div>
    );
  };

  const displayValue = value ? new Date(value).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div ref={containerRef} className="relative">
      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
           w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 cursor-pointer
           flex items-center justify-between border transition-all
           ${isOpen ? 'border-lime-500 ring-2 ring-lime-100 bg-white' : 'border-transparent hover:bg-gray-100'}
        `}
      >
        <span className={!value ? 'text-gray-400' : ''}>{displayValue || 'Select Date & Time'}</span>
        <Calendar size={16} className="text-gray-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 w-[300px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden"
          >
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
