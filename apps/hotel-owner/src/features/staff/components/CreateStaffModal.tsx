import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { staffService, CreateStaffDto } from '../services/staffService';
import { useNotification } from '@repo/ui';
import { UserRole } from '@repo/types';
import { X, User, Mail, Phone, Shield, UserCog, CheckCircle, Loader2 } from 'lucide-react';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES: UserRole[] = ['Receptionist', 'Housekeeping'];

export default function CreateStaffModal({ isOpen, onClose, onSuccess }: CreateStaffModalProps) {
  const [formData, setFormData] = useState<CreateStaffDto>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'Receptionist',
    hotelId: 'hotel-1'
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await staffService.createStaff(formData);
      showNotification({ message: 'Staff member added successfully', type: 'success', format: 'Thêm nhân viên mới thành công' });
      onSuccess();
      onClose();
    } catch (err) {
      showNotification({ message: 'Failed to create staff member', type: 'error', format: 'Thêm nhân viên thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.role;

  return (
    <AnimatePresence>
      {isOpen && (
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
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">RECRUIT STAFF</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
                      <input
                        title="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
                      <input
                        title="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
                    <input
                      title="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all"
                      placeholder="john.doe@hotel.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
                    <input
                      title="Phone"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-lime-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assign Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((role) => {
                      const Icon = role === 'Receptionist' ? Shield : UserCog;
                      const isSelected = formData.role === role;
                      return (
                        <button
                          key={role}
                          onClick={() => setFormData({ ...formData, role: role })}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden ${isSelected
                              ? 'bg-lime-50 border-lime-500 text-lime-800'
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

                <div className="pt-4">
                  <button
                    onClick={handleCreate}
                    disabled={isLoading || !isFormValid}
                    className="w-full py-4 rounded-xl bg-lime-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-lime-600 active:scale-95 transition-all shadow-lg shadow-lime-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Recruit Staff Member</>}
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
