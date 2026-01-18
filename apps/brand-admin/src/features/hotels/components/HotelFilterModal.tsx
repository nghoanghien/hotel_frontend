
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Filter, Check, RotateCcw, Building2, Star, Ban } from '@repo/ui/icons';
import { HotelUiStatus } from '../services/hotelService';

export interface HotelFilterFields {
  uiStatus: HotelUiStatus | '';
  starRating: number[];
}

interface HotelFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: HotelFilterFields;
  onApply: (filters: HotelFilterFields) => void;
}

const UI_STATUSES: HotelUiStatus[] = ['Active', 'Maintenance', 'Suspended'];
const STAR_RATINGS = [5, 4, 3, 2, 1];

export default function HotelFilterModal({ isOpen, onClose, filterFields, onApply }: HotelFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const setStatus = (status: HotelUiStatus | '') => {
    setLocalFilters(prev => ({ ...prev, uiStatus: status === prev.uiStatus ? '' : status }));
  };

  const toggleStarRating = (rating: number) => {
    setLocalFilters(prev => {
      const current = prev.starRating;
      const newRatings = current.includes(rating)
        ? current.filter(r => r !== rating)
        : [...current, rating];
      return { ...prev, starRating: newRatings };
    });
  };

  const handleReset = () => {
    setLocalFilters({
      uiStatus: '',
      starRating: []
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.uiStatus !== '',
    localFilters.starRating.length > 0
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
                  FILTER HOTELS
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

                  {/* Operational Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Building2 size={18} className="text-lime-600" />
                      Operational Status
                    </label>
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {UI_STATUSES.map(status => {
                        const config = {
                          Active: { activeBg: 'bg-green-50', activeText: 'text-green-700', activeBorder: 'border-green-500', icon: CheckCircle },
                          Maintenance: { activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeBorder: 'border-orange-500', icon: AlertCircle },
                          Suspended: { activeBg: 'bg-red-50', activeText: 'text-red-700', activeBorder: 'border-red-500', icon: Ban },
                        }[status];

                        const Icon = config.icon;
                        const isSelected = localFilters.uiStatus === status;

                        return (
                          <button
                            key={status}
                            onClick={() => setStatus(isSelected ? '' : status)}
                            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center gap-3 group
                                        ${isSelected
                                ? `${config.activeBg} ${config.activeText} ${config.activeBorder} shadow-md`
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={16} className={isSelected ? 'scale-110 transition-transform' : ''} />
                            </div>
                            <span className="flex-1">{status}</span>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Star size={18} className="text-lime-600" />
                      Star Rating
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-3">
                      {STAR_RATINGS.map((rating) => {
                        const active = localFilters.starRating.includes(rating);
                        return (
                          <button
                            key={rating}
                            onClick={() => toggleStarRating(rating)}
                            className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all border-2 flex items-center gap-2
                                ${active
                                ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-md'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <span>{rating} Stars</span>
                            <Star size={14} className={active ? 'fill-amber-500 text-amber-500' : 'text-gray-400'} />
                          </button>
                        );
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
