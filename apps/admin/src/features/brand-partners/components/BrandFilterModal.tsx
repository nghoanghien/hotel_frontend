import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, Filter, Check, RotateCcw, XCircle } from '@repo/ui/icons';

export interface BrandFilterFields {
  status: 'Active' | 'Suspended' | '';
}

interface BrandFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: BrandFilterFields;
  onApply: (filters: BrandFilterFields) => void;
}

export default function BrandFilterModal({ isOpen, onClose, filterFields, onApply }: BrandFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const setStatus = (status: 'Active' | 'Suspended' | '') => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const handleReset = () => {
    setLocalFilters({
      status: '',
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.status !== '',
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-[600px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER BRANDS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-lime-700 bg-lime-100 px-3 py-1 rounded-full ml-1">
                      {activeCount} Active
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleApply}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-lime-500 hover:text-white transition-all shadow-sm hover:shadow-lime-200 hover:-translate-y-0.5"
                    title="Apply Filters"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </button>

                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
                <div className="space-y-8">

                  {/* Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle size={18} className="text-lime-600" />
                      Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
                      {['Active', 'Suspended'].map(status => {
                        const isSelected = localFilters.status === status;
                        const Icon = status === 'Active' ? CheckCircle : XCircle;
                        return (
                          <button
                            key={status}
                            onClick={() => setStatus(isSelected ? '' : status as any)}
                            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center gap-3 group
                                        ${isSelected
                                ? 'bg-lime-50 text-lime-700 border-lime-500 shadow-md'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={16} className={isSelected ? 'scale-110 transition-transform' : ''} />
                            </div>
                            <span className="flex-1">{status}</span>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
