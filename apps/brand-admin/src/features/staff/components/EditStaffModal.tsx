
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, User, Phone, Building2, CheckCircle, AlertCircle } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, Select } from '@repo/ui';
import { createPortal } from 'react-dom';
import { staffService, UserDto, UserStatus, UpdateUserDto, UserRole } from '../services/staffService';
import { hotelService, HotelWithLocation } from '../../hotels/services/hotelService';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDto | null;
  onSuccess: () => void;
}

export default function EditStaffModal({ isOpen, onClose, user, onSuccess }: EditStaffModalProps) {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelWithLocation[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<UpdateUserDto>({});

  useEffect(() => {
    setMounted(true);
    hotelService.getBrandHotels('brand-1').then(setHotels);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        hotelId: user.hotelId,
        status: user.status
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await staffService.updateStaff(user.id, formData);
      showNotification({ message: 'Staff updated successfully!', type: 'success', format: "Dữ liệu đã được cập nhật thành công!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      showNotification({ message: 'Failed to update staff', type: 'error', format: "Cập nhật thất bại!" });
    } finally {
      setIsLoading(false);
    }
  };

  const hotelOptions = hotels.map(h => ({
    value: h.id,
    label: h.name,
    icon: <Building2 size={14} className="text-blue-500" />
  }));

  if (!mounted || !user) return null;

  const isHotelChanged = user.hotelId !== formData.hotelId;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[50]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-2xl rounded-[32px] overflow-visible shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-1">EDIT PERSONNEL</h3>
                  <p className="text-gray-500 text-sm">Update profile & assignment for {user.firstName} {user.lastName}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">

                {/* Status & Role */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold">
                      {user.role.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{user.role}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{user.id}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, status: UserStatus.Active }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.status === UserStatus.Active ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400'}`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, status: UserStatus.Suspended }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.status === UserStatus.Suspended ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400'}`}
                    >
                      Suspended
                    </button>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Personal Information
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Phone Number</label>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                        <Phone size={16} className="text-gray-400" />
                        <input
                          type="text"
                          value={formData.phoneNumber || ''}
                          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                          placeholder="+84..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment (Transfer) */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} /> Hotel Assignment (Transfer)
                  </label>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                    <Select
                      label="Assigned Hotel"
                      value={formData.hotelId || ''}
                      onChange={(val) => setFormData({ ...formData, hotelId: val })}
                      options={hotelOptions}
                      className="bg-white"
                    />

                    {isHotelChanged && (
                      <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-100/50 p-2 rounded-lg">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>Wait! Changing this will revoke access to the previous hotel immediately from {user.role}.</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 rounded-b-[32px]">
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? <LoadingSpinner size={20} color="white" /> : (
                    <>
                      <span>Save Changes</span>
                      <CheckCircle size={18} className="stroke-[3]" />
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
