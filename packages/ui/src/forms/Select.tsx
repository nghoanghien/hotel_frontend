
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '../motion';
import { ChevronDown, Check } from '../icons';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select({ label, value, onChange, options, placeholder = 'Select on option', className = '', disabled = false }: SelectProps) {
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

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className} ${disabled ? 'opacity-60 pointer-events-none' : ''}`} ref={containerRef}>
      {label && <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</label>}

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold flex items-center justify-between transition-all outline-none text-left
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
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[65] w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
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
                    className={`w-full px-4 py-2.5 text-left text-sm font-bold flex items-center justify-between hover:bg-gray-50 transition-colors
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
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">No options available</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
