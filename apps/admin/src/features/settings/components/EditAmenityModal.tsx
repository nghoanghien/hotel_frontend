import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, Edit } from '@repo/ui/icons';
import { Amenity, UpdateAmenityDto, AmenityType } from '@repo/types';
import { amenityService } from '../services/amenityService';
import { useNotification, LoadingSpinner } from '@repo/ui';
import CustomSelect from './CustomSelect';

interface EditAmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: Amenity | null;
  onSuccess: () => void;
}

export default function EditAmenityModal({ isOpen, onClose, amenity, onSuccess }: EditAmenityModalProps) {
  const [formData, setFormData] = useState<UpdateAmenityDto>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen && amenity) {
      setFormData({
        name: amenity.name,
        description: amenity.description,
        isActive: amenity.isActive
      });
    } else {
      setFormData({});
    }
  }, [isOpen, amenity]);

  const handleChange = (key: keyof UpdateAmenityDto, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !amenity) return;

    setIsSubmitting(true);
    try {
      await amenityService.updateAmenity(amenity.id, formData);
      showNotification({ message: 'Amenity updated successfully', type: 'success', format: 'Updated!' });
      onSuccess();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to update amenity', type: 'error', format: 'Error!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChanged = amenity && JSON.stringify({
    name: amenity.name,
    description: amenity.description,
    isActive: amenity.isActive
  }) !== JSON.stringify(formData);

  const isValid = !!formData.name && formData.name.trim().length > 0;
  const canSave = isChanged && isValid;

  if (typeof document === 'undefined') return null;

  return (
    <AnimatePresence>
      {isOpen && amenity && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Edit size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                      Edit Amenity
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Update amenity details</p>
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
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Amenity Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all placeholder:text-gray-300"
                        placeholder="e.g. Free WiFi, Swimming Pool"
                      />
                      <p className="text-xs text-gray-400 mt-1.5">Icon is automatically assigned based on the name</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                        placeholder="Brief description of the amenity..."
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Status
                      </label>
                      <CustomSelect
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(value) => handleChange('isActive', value === 'active')}
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                      />
                    </div>

                    {/* Type (read-only) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Type (Read-only)
                      </label>
                      <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500">
                        {AmenityType[amenity.type]}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Type cannot be changed after creation</p>
                    </div>
                  </div>
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
