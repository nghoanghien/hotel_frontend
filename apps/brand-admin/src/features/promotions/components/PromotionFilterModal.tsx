
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Check, Building2, Tag, Filter, RotateCcw, Activity, Pause, Clock } from '@repo/ui/icons';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Select } from '@repo/ui';
import { PromotionStatus } from '../services/promotionService';
import { hotelService, HotelWithLocation } from '../../hotels/services/hotelService';

export interface PromotionFilterFields {
  status: PromotionStatus | 'All' | '';
  hotelId: string | 'All' | '';
}

interface PromotionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: PromotionFilterFields;
  onApply: (fields: PromotionFilterFields) => void;
}

export default function PromotionFilterModal({ isOpen, onClose, filterFields, onApply }: PromotionFilterModalProps) {
  const [localFields, setLocalFields] = useState<PromotionFilterFields>(filterFields);
  const [hotels, setHotels] = useState<HotelWithLocation[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setLocalFields(filterFields);
      hotelService.getBrandHotels('brand-1').then(setHotels);
    }
  }, [isOpen, filterFields]);

  const handleApply = () => {
    onApply(localFields);
    onClose();
  };

  const handleReset = () => {
    setLocalFields({
      status: '',
      hotelId: ''
    });
  };

  const activeCount = [
    localFields.status !== '',
    localFields.hotelId !== ''
  ].filter(Boolean).length;


  // Prepare Select Options
  const hotelOptions = [
    { value: '', label: 'All Hotels (Global)', icon: <Building2 size={14} className="text-gray-400" /> },
    ...hotels.map(h => ({
      value: h.id,
      label: h.name,
      icon: <Building2 size={14} className="text-lime-500" />
    }))
  ];

  if (!mounted) return null;

  return createPortal(
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
                  FILTER CAMPAIGNS
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
                    className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5"
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
              <div className="flex-1 overflow-y-auto pr-2 pb-32 custom-scrollbar space-y-8">

                {/* Status Filter */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Activity size={18} className="text-lime-600" />
                    Campaign Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[PromotionStatus.Active, PromotionStatus.Paused, PromotionStatus.Expired, PromotionStatus.Draft].map(status => {
                      const isSelected = localFields.status === status;
                      const config = {
                        [PromotionStatus.Active]: { bg: 'bg-lime-400', text: 'text-lime-50' },
                        [PromotionStatus.Paused]: { bg: 'bg-lime-400', text: 'text-lime-50' },
                        [PromotionStatus.Expired]: { bg: 'bg-lime-400', text: 'text-lime-50' },
                        [PromotionStatus.Draft]: { bg: 'bg-lime-400', text: 'text-lime-50' },
                      }[status];

                      return (
                        <button
                          key={status}
                          onClick={() => setLocalFields(prev => ({ ...prev, status: prev.status === status ? '' : status }))}
                          className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all border-2 flex items-center gap-2
                                ${isSelected
                              ? `${config.bg} ${config.text} border-transparent shadow-md`
                              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span>{status}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hotel Filter */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Building2 size={18} className="text-lime-600" />
                    Target Location
                  </label>
                  <Select
                    value={localFields.hotelId}
                    onChange={(val) => setLocalFields(prev => ({ ...prev, hotelId: val }))}
                    options={hotelOptions}
                    placeholder="Select Target Location"
                  />
                  <p className="text-xs text-gray-400 pl-1">Leave empty to see Global campaigns.</p>
                </div>

              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
