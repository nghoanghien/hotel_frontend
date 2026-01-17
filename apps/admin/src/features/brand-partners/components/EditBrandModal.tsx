import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, Edit } from '@repo/ui/icons';
import { Brand } from '@repo/types';
import BrandForm from '@/features/brand-partners/components/BrandForm';
import { brandPartnersService } from '@/features/brand-partners/services/brandPartnersService';
import { useNotification, LoadingSpinner } from '@repo/ui';

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onSuccess: () => void;
}

export default function EditBrandModal({ isOpen, onClose, brand, onSuccess }: EditBrandModalProps) {
  const [item, setItem] = useState<Partial<Brand>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen && brand) {
      setItem(brand);
    } else {
      setItem({});
    }
  }, [isOpen, brand]);

  const handleSubmit = async () => {
    if (!item.name || !brand) return;

    setIsSubmitting(true);
    try {
      await brandPartnersService.updateBrand(brand.id, item);
      showNotification({ message: 'Brand updated successfully', type: 'success', format: "Dữ liệu cập nhật thành công." });
      onSuccess();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to update brand', type: 'error', format: "Lỗi khi cập nhật dữ liệu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChanged = JSON.stringify(item) !== JSON.stringify(brand);
  const isValid = !!item.name && item.name.length > 0;
  const canSave = isChanged && isValid;

  if (typeof document === 'undefined') return null;

  return (
    <AnimatePresence>
      {isOpen && brand && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
            >
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Edit size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                      Edit Brand
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Update details for {brand.name}</p>
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
                  <BrandForm
                    data={item}
                    onChange={setItem}
                    errors={{}}
                  />
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
