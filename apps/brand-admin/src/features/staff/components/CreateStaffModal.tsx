
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, User, Phone, Building2, ArrowRight, Mail, Key } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, Select } from '@repo/ui';
import { staffService, CreateUserDto, UserRole } from '../services/staffService';
import { hotelService, HotelWithLocation } from '../../hotels/services/hotelService';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  onSuccess: () => void;
}

export default function CreateStaffModal({ isOpen, onClose, brandId, onSuccess }: CreateStaffModalProps) {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelWithLocation[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateUserDto>({
    brandId: brandId,
    hotelId: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: UserRole.HotelManager
  });

  useEffect(() => {
    setMounted(true);
    hotelService.getBrandHotels(brandId).then(res => {
      setHotels(res);
      if (res.length > 0) {
        setFormData(prev => ({ ...prev, hotelId: res[0].id }));
      }
    });
  }, [brandId]);

  const isValid = formData.email && formData.firstName && formData.lastName && formData.hotelId;

  const handleCreate = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      await staffService.createStaff(formData);
      showNotification({ message: 'Personnel appointed successfully!', type: 'success', format: "Dữ liệu đã được cập nhật thành công!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create user';
      showNotification({ message: errorMsg, type: 'error', format: "Cập nhật thất bại!" });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: UserRole.HotelManager, label: 'Branch Manager', icon: <Key size={14} className="text-lime-600" /> },
    { value: UserRole.Receptionist, label: 'Head Receptionist', icon: <User size={14} className="text-blue-600" /> }
  ];

  const hotelOptions = hotels.map(h => ({
    value: h.id,
    label: h.name,
    icon: <Building2 size={14} className="text-blue-500" />
  }));

  if (!mounted) return null;

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
              className="bg-[#F8F9FA] w-full max-w-5xl h-[85vh] rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex border border-white/20"
            >
              {/* LEFT PANEL: Form Input (60%) */}
              <div className="w-full md:w-[60%] bg-white border-r border-gray-200 flex flex-col relative z-20">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-2">APPOINT MANAGER</h3>
                    <p className="text-gray-500 text-sm">Create a new account and assign a key leadership role.</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                  {/* Role & Location */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Key size={14} /> Role & Assignment
                    </label>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Select
                            label="Role"
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                            options={roleOptions}
                          />
                        </div>
                        <div className="relative"> {/* Select usually handles z-index, but needs check context */}
                          {hotelOptions.length > 0 ? (
                            <Select
                              label="Assigned Hotel"
                              value={formData.hotelId}
                              onChange={(val) => setFormData({ ...formData, hotelId: val })}
                              options={hotelOptions}
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-sm text-gray-400">Loading Hotels...</div>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                        <ArrowRight size={12} className="text-lime-500" />
                        The selected user will have full administrative access to the assigned hotel dashboard immediately.
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> Identity
                    </label>

                    <div className="bg-white p-1 space-y-4 z-0 relative">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Email Address (Login ID)</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-lime-200 focus-within:ring-4 focus-within:ring-lime-50 transition-all">
                          <Mail size={16} className="text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-transparent font-bold text-gray-900 outline-none placeholder:text-gray-300"
                            placeholder="manager@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">First Name</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-gray-200"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Last Name</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-gray-200"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Phone Number</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Phone size={16} className="text-gray-400" />
                          <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full bg-transparent font-bold text-gray-900 outline-none text-sm placeholder:text-gray-300"
                            placeholder="+84 90..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Preview (40%) */}
              <div className="w-[40%] bg-[#F0F2F5] flex flex-col h-full relative z-10 border-l border-white/50 hidden md:flex items-center justify-center p-12 text-center">
                <div className="mb-8 relative">
                  <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-5xl mb-4 mx-auto relative z-10 overflow-hidden">
                    {formData.firstName ? (
                      <div className="font-anton text-[#1A1A1A]">{formData.firstName.charAt(0)}</div>
                    ) : (
                      <User size={48} className="text-gray-200" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                    Manager
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'New User'}
                </h3>
                <p className="text-gray-500 font-medium text-sm mb-8">
                  {formData.email || 'email@example.com'}
                </p>

                <div className="bg-white p-6 rounded-2xl shadow-sm w-full text-left border border-gray-200/50">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Initial Assignment</div>
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50">
                    <Building2 size={16} className="text-blue-500" />
                    <span className="font-bold text-gray-900 text-sm">
                      {hotels.find(h => h.id === formData.hotelId)?.name || 'Select Hotel'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Key size={16} className="text-lime-600" />
                    <span className="font-bold text-gray-900 text-sm">
                      {roleOptions.find(r => r.value === formData.role)?.label || 'Select Role'}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto w-full pt-8">
                  <button
                    onClick={handleCreate}
                    disabled={isLoading || !isValid}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    {isLoading ? <LoadingSpinner size={20} color="white" /> : (
                      <>
                        <span>Appoint Personnel</span>
                        <ArrowRight size={18} className="stroke-[3]" />
                      </>
                    )}
                  </button>
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
