import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, RotateCcw, Filter, Check, Shield, UserCog, AlertCircle, UserCheck } from '@repo/ui/icons';

export interface StaffFilterFields {
  roles: string[];
  status: string;
}

interface StaffFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: StaffFilterFields;
  onApply: (filters: StaffFilterFields) => void;
}

const ROLES = ['Receptionist', 'Housekeeping'];
const STATUSES = ['Active', 'Inactive', 'Suspended'];

export default function StaffFilterModal({ isOpen, onClose, filterFields, onApply }: StaffFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const toggleRole = (role: string) => {
    setLocalFilters(prev => {
      const current = prev.roles;
      const newRoles = current.includes(role)
        ? current.filter(r => r !== role)
        : [...current, role];
      return { ...prev, roles: newRoles };
    });
  };

  const setStatus = (status: string) => {
    setLocalFilters(prev => ({ ...prev, status: prev.status === status ? '' : status }));
  };

  const handleReset = () => {
    setLocalFilters({
      roles: [],
      status: ''
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.roles.length > 0,
    localFilters.status !== ''
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
              className="bg-white w-[600px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER STAFF
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
              <div className="space-y-8">

                {/* Roles */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Shield size={18} className="text-lime-600" />
                    Staff Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(role => {
                      const isSelected = localFilters.roles.includes(role);
                      const Icon = role === 'Receptionist' ? Shield : UserCog;

                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className={`py-3 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center gap-3
                                      ${isSelected
                              ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-md'
                              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <Icon size={18} className={isSelected ? 'text-lime-700' : ''} />
                          <span className="flex-1">{role}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-lime-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <UserCheck size={18} className="text-lime-600" />
                    Account Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {STATUSES.map((status) => {
                      const isSelected = localFilters.status === status;

                      const config = {
                        Active: { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-500' },
                        Inactive: { color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-500' },
                        Suspended: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-500' }
                      }[status] || { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };

                      return (
                        <button
                          key={status}
                          onClick={() => setStatus(status)}
                          className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all border-2 flex items-center gap-2
                              ${isSelected
                              ? `${config.bg} ${config.color} ${config.border} shadow-sm`
                              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                            }`}
                        >
                          <span>{status}</span>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
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
