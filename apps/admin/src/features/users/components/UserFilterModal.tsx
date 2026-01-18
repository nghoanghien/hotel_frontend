import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Filter, Check, RotateCcw, Clock, Lock, Building2, Hotel, User as UserIcon, Briefcase, XCircle } from '@repo/ui/icons';
import { SystemUserRole, SystemUserStatus } from '@repo/types';

export interface UserFilterFields {
  role: SystemUserRole | 'all';
  status: SystemUserStatus | 'all';
  brandId: string;
  hotelId: string;
}

interface UserFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: UserFilterFields;
  onApply: (fields: UserFilterFields) => void;
}

const ROLES = [
  { value: SystemUserRole.SuperAdmin, label: 'Super Admin', icon: Lock, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-500' },
  { value: SystemUserRole.BrandAdmin, label: 'Brand Admin', icon: Building2, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' },
  { value: SystemUserRole.HotelManager, label: 'Hotel Manager', icon: Hotel, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
  { value: SystemUserRole.Receptionist, label: 'Receptionist', icon: UserIcon, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-500' },
  { value: SystemUserRole.Staff, label: 'Staff', icon: Briefcase, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-500' },
  { value: SystemUserRole.Guest, label: 'Guest', icon: UserIcon, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500' },
];

const STATUSES = [
  { value: SystemUserStatus.Active, label: 'Active', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-500' },
  { value: SystemUserStatus.Inactive, label: 'Inactive', icon: XCircle, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-500' },
  { value: SystemUserStatus.Suspended, label: 'Suspended', icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500' },
  { value: SystemUserStatus.PendingVerification, label: 'Pending', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' },
];

export default function UserFilterModal({ isOpen, onClose, filterFields, onApply }: UserFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const toggleRole = (role: SystemUserRole) => {
    setLocalFilters(prev => ({
      ...prev,
      role: prev.role === role ? 'all' : role
    }));
  };

  const toggleStatus = (status: SystemUserStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status === status ? 'all' : status
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      role: 'all',
      status: 'all',
      brandId: '', // Reset context
      hotelId: ''
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.role !== 'all',
    localFilters.status !== 'all',
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
              className="bg-white w-[800px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER USERS
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

                  {/* Role Filter */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <UserIcon size={18} className="text-lime-600" />
                      User Role
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
                      {ROLES.map(role => {
                        const isSelected = localFilters.role === role.value;
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            onClick={() => toggleRole(role.value)}
                            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center gap-3 group
                                    ${isSelected
                                ? `${role.bg} ${role.text} ${role.border} shadow-md`
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={16} className={isSelected ? 'scale-110 transition-transform' : ''} />
                            </div>
                            <span className="flex-1">{role.label}</span>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle size={18} className="text-lime-600" />
                      User Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-3">
                      {STATUSES.map(status => {
                        const isSelected = localFilters.status === status.value;
                        const Icon = status.icon;
                        return (
                          <button
                            key={status.value}
                            onClick={() => toggleStatus(status.value)}
                            className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all border-2 flex items-center gap-2
                                       ${isSelected
                                ? `${status.bg} ${status.text} ${status.border} shadow-md`
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <Icon size={14} className={isSelected ? 'scale-110' : 'text-gray-400'} strokeWidth={3} />
                            <span>{status.label}</span>
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
