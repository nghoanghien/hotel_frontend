import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChevronDown, Check } from '@repo/ui/icons';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ label, value, onChange, options, placeholder = 'Select an option', className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 bg-gray-50 border rounded-xl font-medium flex items-center justify-between transition-all outline-none
          ${isOpen
            ? 'border-gray-900 ring-2 ring-gray-900/10 bg-white'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center justify-between hover:bg-gray-50 transition-colors
                      ${isSelected ? 'text-gray-900 bg-gray-50' : 'text-gray-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-gray-900" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
