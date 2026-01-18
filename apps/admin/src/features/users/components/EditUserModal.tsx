import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, Edit, User as UserIcon, Mail, Phone, Lock, Trash2, Building2 } from '@repo/ui/icons';
import { User, UpdateUserDto, SystemUserRole, SystemUserStatus } from '@repo/types';
import { userService } from '../services/userService';
import { useNotification, LoadingSpinner, useSwipeConfirmation } from '@repo/ui';
import CustomSelect from '../../settings/components/CustomSelect';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        brandId: user.brandId,
        hotelId: user.hotelId
      });
    } else {
      setFormData({});
    }
  }, [isOpen, user]);

  const handleChange = (key: keyof UpdateUserDto, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await userService.updateUser(user.id, formData);
      showNotification({ message: 'User updated successfully', type: 'success', format: 'Updated!' });
      onSuccess();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to update user', type: 'error', format: 'Error!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;
    confirm({
      title: 'Delete User Permanently?',
      description: 'This action cannot be undone. The user will lose all access immediately.',
      confirmText: 'SWIPE TO DELETE',
      type: 'danger',
      onConfirm: async () => {
        try {
          await userService.deleteUser(user.id);
          showNotification({ message: 'User deleted successfully', type: 'success' });
          onSuccess();
          onClose();
        } catch (e) {
          showNotification({ message: 'Failed to delete user', type: 'error' });
        }
      }
    });
  };

  const isChanged = user && JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    status: user.status,
    brandId: user.brandId,
    hotelId: user.hotelId
  }) !== JSON.stringify(formData);

  const canSave = isChanged;

  if (typeof document === 'undefined') return null;

  return (
    <AnimatePresence>
      {isOpen && user && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Edit size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                      Edit User
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      God Mode Access
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-8">

                  {/* Read-Only Identity */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                    </div>
                    <div className="px-3 py-1 bg-gray-200 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                      ID: {user.id.substring(0, 8)}
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName || ''}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:border-lime-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName || ''}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:border-lime-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:border-lime-500 outline-none transition-all"
                      />
                    </div>

                    <div className="hidden w-full h-px bg-gray-100 my-4 md:block" />

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role</label>
                        <CustomSelect
                          value={formData.role !== undefined ? formData.role : user.role}
                          onChange={(value) => handleChange('role', value as SystemUserRole)}
                          options={[
                            { value: SystemUserRole.SuperAdmin, label: 'Super Admin' },
                            { value: SystemUserRole.BrandAdmin, label: 'Brand Admin' },
                            { value: SystemUserRole.HotelManager, label: 'Hotel Manager' },
                            { value: SystemUserRole.Receptionist, label: 'Receptionist' },
                            { value: SystemUserRole.Staff, label: 'Staff' },
                            { value: SystemUserRole.Guest, label: 'Guest' },
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                        <CustomSelect
                          value={formData.status !== undefined ? formData.status : user.status}
                          onChange={(value) => handleChange('status', value as SystemUserStatus)}
                          options={[
                            { value: SystemUserStatus.Active, label: 'Active' },
                            { value: SystemUserStatus.Inactive, label: 'Inactive' },
                            { value: SystemUserStatus.Suspended, label: 'Suspended' },
                            { value: SystemUserStatus.PendingVerification, label: 'Pending Verification' },
                          ]}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-red-700">Danger Zone</h5>
                    <p className="text-xs text-red-500 mt-0.5">Permanently delete this user and all data.</p>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete User
                  </button>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all shadow-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-2xl bg-lime-500 text-white font-bold text-sm hover:bg-lime-600 transition-all shadow-lg shadow-lime-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-wide"
                  disabled={isSubmitting || !canSave}
                >
                  {isSubmitting ? <LoadingSpinner size={16} color="white" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
