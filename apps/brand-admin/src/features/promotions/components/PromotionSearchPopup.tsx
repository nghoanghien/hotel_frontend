
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { Search, X, Tag, FileText } from '@repo/ui/icons';

interface SearchFieldConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  placeholder: string;
}

interface PromotionSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchFields: { query: string };
  handleSearchChange: (key: string, value: string) => void;
  clearSearchFields: () => void;
  placeholders?: { query?: string };
}

const PromotionSearchPopup: React.FC<PromotionSearchPopupProps> = ({
  isOpen,
  onClose,
  searchFields,
  handleSearchChange,
  clearSearchFields,
  placeholders
}) => {
  const [localSearchFields, setLocalSearchFields] = useState(searchFields);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
    handleSearchChange(key, value);
  };

  const handleSearchSubmit = () => {
    onClose();
  };

  const handleClear = () => {
    setLocalSearchFields({ query: '' });
    clearSearchFields();
  };

  const searchFieldsConfig: SearchFieldConfig[] = [
    { key: 'query', label: 'Search', icon: Search, placeholder: placeholders?.query || 'Search Campaign Name or Code...' },
  ];

  if (!mounted) return null;

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

          <div className="relative bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] p-6 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100">
                  <Search className="w-5 h-5" />
                </div>
                SEARCH CAMPAIGNS
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSearchSubmit}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-lime-600 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                  title="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => { handleClear(); onClose(); }}
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
                    value={localSearchFields[field.key as keyof typeof localSearchFields] || ''}
                    onChange={(e) => handleLocalSearchChange(field.key, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/30 transition-all shadow-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center mt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                <Tag size={12} /> Code
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                <FileText size={12} /> Name
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PromotionSearchPopup;
