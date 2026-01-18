import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Plus, Check, User, Mail, Phone, Building2, Hotel } from '@repo/ui/icons';
import { CreateUserDto, SystemUserRole } from '@repo/types';
import { userService } from '../services/userService';
import { useNotification, LoadingSpinner } from '@repo/ui';
import CustomSelect from '../../settings/components/CustomSelect';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Mock data for Brands (In real app, fetch from BrandService)
const mockBrands = [
  { value: 'brand-1', label: 'Hilton Hotels & Resorts' },
  { value: 'brand-2', label: 'Marriott International' },
  { value: 'brand-3', label: 'Hyatt Corporation' },
];

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: SystemUserRole.BrandAdmin,
    brandId: '',  // Default empty
    hotelId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: SystemUserRole.BrandAdmin,
        brandId: '',
        hotelId: ''
      });
    }
  }, [isOpen]);

  const handleChange = (key: keyof CreateUserDto, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName) return;

    // Validation logic based on Role
    if (formData.role === SystemUserRole.BrandAdmin && !formData.brandId) {
      showNotification({ message: 'Brand is required for Brand Admin', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createUser(formData);
      showNotification({ message: 'User created successfully', type: 'success', format: 'Created!' });
      onSuccess();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to create user', type: 'error', format: 'Error!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    !!formData.email &&
    !!formData.firstName &&
    !!formData.lastName &&
    (formData.role !== SystemUserRole.BrandAdmin || !!formData.brandId);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            onClick={onClose}
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
                  <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center shadow-sm">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                      Create User
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Add new system user</p>
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
                <form id="create-user-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">

                  {/* Basic Info Section */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            required
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            required
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100 my-6" />

                  {/* Role & Permissions Section */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      Role & Access
                    </h4>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          User Role <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                          value={formData.role}
                          onChange={(value) => handleChange('role', value as SystemUserRole)}
                          options={[
                            { value: SystemUserRole.BrandAdmin, label: 'Brand Admin (Manage a Brand)' },
                            { value: SystemUserRole.SuperAdmin, label: 'Super Admin (Full System Access)' },
                          ]}
                          className="w-full"
                        />
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">Super Admins typically create Brand Admins.</p>
                      </div>

                      {/* Brand Selection - Only if Role is BrandAdmin or lower */}
                      {formData.role === SystemUserRole.BrandAdmin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                            Assigned Brand <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="w-10 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200">
                              <Building2 size={20} className="text-gray-400" />
                            </div>
                            <CustomSelect
                              value={formData.brandId || ''}
                              onChange={(value) => handleChange('brandId', value as string)}
                              options={mockBrands}
                              placeholder="Select a Brand..."
                              className="w-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>


                </form>
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
                  form="create-user-form"
                  className="px-8 py-3 rounded-2xl bg-lime-500 text-white font-bold text-sm hover:bg-lime-600 transition-all shadow-lg shadow-lime-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-wide"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? <LoadingSpinner size={16} color="white" /> : <Check size={18} strokeWidth={3} />}
                  Create User
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
