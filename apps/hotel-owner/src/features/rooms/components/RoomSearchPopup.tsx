import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { Search, X, Hash, Type, BedDouble } from '@repo/ui/icons';

interface SearchFieldConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  placeholder: string;
}

interface RoomSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchFields: { query: string };
  handleSearchChange: (key: string, value: string) => void;
  clearSearchFields: () => void;
  placeholders?: { query?: string };
}

const RoomSearchPopup: React.FC<RoomSearchPopupProps> = ({
  isOpen,
  onClose,
  searchFields,
  handleSearchChange,
  clearSearchFields,
  placeholders
}) => {
  const [localSearchFields, setLocalSearchFields] = useState(searchFields);

  useEffect(() => {
    if (isOpen) {
      setLocalSearchFields(searchFields);
    }
  }, [isOpen, searchFields]);

  const handleLocalSearchChange = (key: string, value: string) => {
    setLocalSearchFields((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchSubmit = () => {
    Object.keys(localSearchFields).forEach(key => {
      // @ts-ignore
      handleSearchChange(key, localSearchFields[key]);
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleClear = () => {
    setLocalSearchFields({ query: '' });
    if (searchFields.query) {
      clearSearchFields();
    }
  };

  const searchFieldsConfig: SearchFieldConfig[] = [
    { key: 'query', label: 'Search', icon: Search, placeholder: placeholders?.query || 'Search Room Number or Type...' },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -150, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: -150, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-6 left-1/2 z-[80] w-[90%] md:w-[600px]"
        >
          <div className="absolute -inset-10 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-black/20 blur-[60px] rounded-[60px]" />
          </div>

          {/* Modal Content */}
          <div className="relative bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] 
                            rounded-[32px] p-6
                            flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100">
                  <Search className="w-5 h-5" />
                </div>
                SEARCH ROOMS
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { handleSearchSubmit(); }}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-lime-500 hover:text-white transition-all shadow-sm hover:shadow-lime-200 hover:-translate-y-0.5 active:translate-y-0"
                  title="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => { handleClear(); handleClose(); }}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Inputs Container */}
            <div className="flex flex-col gap-4">
              {searchFieldsConfig.map((field) => (
                <div key={field.key} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-600 transition-colors pointer-events-none">
                    <field.icon size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    // @ts-ignore
                    value={localSearchFields[field.key] || ''}
                    onChange={(e) => handleLocalSearchChange(field.key, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/30 transition-all shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RoomSearchPopup;
