import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { staffService, UpdateStaffDto } from '../services/staffService';
import { useNotification } from '@repo/ui';
import { UserDto, UserRole } from '@repo/types';
import { X, User, Phone, Shield, UserCog, Save, Loader2, CheckCircle, Mail, Lock } from 'lucide-react';

interface UpdateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: UserDto | null;
  onSuccess: () => void;
}

const ROLES: UserRole[] = ['Receptionist', 'Housekeeping'];
const STATUSES = ['Active', 'Inactive', 'Suspended'];

export default function UpdateStaffModal({ isOpen, onClose, staff, onSuccess }: UpdateStaffModalProps) {
  const [formData, setFormData] = useState<UpdateStaffDto>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: undefined,
    status: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (staff && isOpen) {
      setFormData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        phoneNumber: staff.phoneNumber,
        role: staff.role as UserRole,
        status: staff.status
      });
    }
  }, [staff, isOpen]);

  const handleUpdate = async () => {
    if (!staff) return;
    setIsLoading(true);
    try {
      await staffService.updateStaff(staff.id, formData);
      showNotification({ message: 'Staff profile updated successfully', type: 'success', format: "Cập nhật thông tin nhân viên thành công" });
      onSuccess();
      onClose();
    } catch (err) {
      showNotification({ message: 'Failed to update staff profile', type: 'error', format: "Cập nhật thông tin nhân viên thất bại" });
    } finally {
      setIsLoading(false);
    }
  };

  const isChanged = staff && (
    formData.firstName !== staff.firstName ||
    formData.lastName !== staff.lastName ||
    formData.phoneNumber !== staff.phoneNumber ||
    formData.role !== staff.role ||
    formData.status !== staff.status
  );

  const isValid = formData.firstName && formData.lastName && formData.phoneNumber;

  return (
    <AnimatePresence>
      {isOpen && staff && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-[500px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">UPDATE PROFILE</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                    Editing: <span className="text-lime-600">{staff.email}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-600 transition-colors" />
                      <input
                        title="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white border-2 border-gray-100 hover:border-lime-200 focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all shadow-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-600 transition-colors" />
                      <input
                        title="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white border-2 border-gray-100 hover:border-lime-200 focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all shadow-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Read-only Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                    Email Address <Lock className="w-3 h-3" />
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      disabled
                      value={staff.email}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-gray-500 cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-600 transition-colors" />
                    <input
                      title="Phone"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-white border-2 border-gray-100 hover:border-lime-200 focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all shadow-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Re-assign Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((role) => {
                      const Icon = role === 'Receptionist' ? Shield : UserCog;
                      const isSelected = formData.role === role;
                      return (
                        <button
                          key={role}
                          onClick={() => setFormData({ ...formData, role: role })}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden ${isSelected
                              ? 'bg-lime-50 border-lime-500 text-lime-800 shadow-sm'
                              : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-lime-600' : 'text-gray-400'}`} />
                          {role}
                          {isSelected && (
                            <div className="absolute top-1 right-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Account Status</label>
                  <div className="flex gap-2">
                    {STATUSES.map((status) => {
                      const isSelected = formData.status === status;

                      const config = {
                        Active: { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-500' },
                        Inactive: { color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-500' },
                        Suspended: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-500' }
                      }[status] || { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };

                      return (
                        <button
                          key={status}
                          onClick={() => setFormData({ ...formData, status })}
                          className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5
                            ${isSelected
                              ? `${config.bg} ${config.border} ${config.color} shadow-sm`
                              : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                        >
                          {isSelected && <CheckCircle className="w-3 h-3" />}
                          {status}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading || !isChanged || !isValid}
                    className="w-full py-4 rounded-xl bg-lime-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-lime-600 active:scale-95 transition-all shadow-lg shadow-lime-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : (
                      <>
                        <Save className="w-5 h-5" />
                        {isChanged ? 'Save Changes' : 'No Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
