import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Calendar, Filter, Check, RotateCcw, Clock, Key, LogOut, Ban, CreditCard } from '@repo/ui/icons';
import { BookingStatus } from '@repo/types';
import DateRangePicker from './DateRangePicker';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface BookingFilterFields {
  status: BookingStatus | '';
  paymentStatus: string[];
  dateRange: DateRange;
}

interface BookingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: BookingFilterFields;
  onApply: (filters: BookingFilterFields) => void;
}

const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'];
const PAYMENT_STATUSES = ['Unpaid', 'Partial', 'Paid'];

export default function BookingFilterModal({ isOpen, onClose, filterFields, onApply }: BookingFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const setStatus = (status: BookingStatus | '') => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const togglePaymentStatus = (status: string) => {
    setLocalFilters(prev => {
      const current = prev.paymentStatus;
      const newPaymentStatus = current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status];
      return { ...prev, paymentStatus: newPaymentStatus };
    });
  };

  const isPaymentSelected = (status: string) => localFilters.paymentStatus.includes(status);

  const setDateRange = (range: DateRange) => {
    setLocalFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleReset = () => {
    setLocalFilters({
      status: '',
      paymentStatus: [],
      dateRange: { from: null, to: null }
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.status !== '',
    localFilters.paymentStatus.length > 0,
    localFilters.dateRange.from !== null
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
              className="bg-white w-[1000px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER BOOKINGS
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

                  {/* Date Range */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Calendar size={18} className="text-lime-600" />
                      Date Range (Check-in/Check-out)
                    </label>
                    <div className="max-w-3xl mx-auto">
                      <DateRangePicker
                        dateRange={localFilters.dateRange}
                        onChange={setDateRange}
                      />
                    </div>
                  </div>

                  {/* Booking Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle size={18} className="text-lime-600" />
                      Booking Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
                      {BOOKING_STATUSES.map(status => {
                        const config = {
                          Pending: { activeBg: 'bg-yellow-50', activeText: 'text-yellow-700', activeBorder: 'border-yellow-500', icon: Clock },
                          Confirmed: { activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeBorder: 'border-blue-500', icon: CheckCircle },
                          CheckedIn: { activeBg: 'bg-lime-50', activeText: 'text-lime-700', activeBorder: 'border-lime-500', icon: Key },
                          CheckedOut: { activeBg: 'bg-gray-50', activeText: 'text-gray-700', activeBorder: 'border-gray-500', icon: LogOut },
                          Cancelled: { activeBg: 'bg-red-50', activeText: 'text-red-700', activeBorder: 'border-red-500', icon: Ban },
                          NoShow: { activeBg: 'bg-purple-50', activeText: 'text-purple-700', activeBorder: 'border-purple-500', icon: AlertCircle },
                          Refunded: { activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeBorder: 'border-orange-500', icon: RotateCcw },
                        }[status];

                        if (!config) return null;

                        const Icon = config.icon;
                        const isSelected = localFilters.status === status;

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

                  {/* Payment Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <CreditCard size={18} className="text-lime-600" />
                      Payment Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-3">
                      {PAYMENT_STATUSES.map((status) => {
                        const active = isPaymentSelected(status);
                        return (
                          <button
                            key={status}
                            onClick={() => togglePaymentStatus(status)}
                            className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all border-2 flex items-center gap-2
                                ${active
                                ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-md'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <span>{status}</span>
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
