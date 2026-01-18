
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { X, Tag, FileText, Percent, DollarSign, Calendar, Building2, CheckCircle, Globe, Ticket, Trash2 } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, useSwipeConfirmation } from '@repo/ui';
import { UpdatePromotionDto, DiscountType, Promotion, promotionService } from '../services/promotionService';
import { hotelService, HotelWithLocation } from '../../hotels/services/hotelService';
import DateTimePicker from './DateTimePicker';

interface EditPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  onSuccess: () => void;
}

export default function EditPromotionModal({ isOpen, onClose, promotion, onSuccess }: EditPromotionModalProps) {
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelWithLocation[]>([]);

  // Form State
  const [formData, setFormData] = useState<UpdatePromotionDto>({});

  // Local state for UI that might not be in UpdateDto directly but needed for display/logic
  const [displayData, setDisplayData] = useState<Partial<Promotion>>({});

  useEffect(() => {
    if (isOpen && promotion) {
      hotelService.getBrandHotels('brand-1').then(setHotels);
      setFormData({
        name: promotion.name,
        description: promotion.description,
        startDate: promotion.startDate,
        endDate: promotion.endDate, // format for input
        maxUsage: promotion.maxUsage,
        maxUsagePerUser: promotion.maxUsagePerUser,
        applyToAllHotels: promotion.applyToAllHotels,
        applyToHotelIds: promotion.appliedHotelIds,
        status: promotion.status
      });
      setDisplayData(promotion);
    }
  }, [isOpen, promotion]);

  // Check for changes
  const hasChanges = useMemo(() => {
    if (!promotion) return false;

    // Adjust for date string comparison format if necessary. DateTimePicker returns format YYYY-MM-DDTHH:mm
    // promotion.startDate is ISO. Simple string compare matches? 
    // Usually yes if we don't change it. If we change it, it changes.

    // Sort hotel IDs for array comparison
    const formHotels = [...(formData.applyToHotelIds || [])].sort();
    const currentHotels = [...(promotion.appliedHotelIds || [])].sort();
    const hotelsChanged = JSON.stringify(formHotels) !== JSON.stringify(currentHotels);

    return (
      formData.name !== promotion.name ||
      ((formData.description || '') !== (promotion.description || '')) ||
      formData.startDate !== promotion.startDate || // Compare exact string or formatted.
      formData.endDate !== promotion.endDate ||
      formData.maxUsage !== promotion.maxUsage ||
      formData.maxUsagePerUser !== promotion.maxUsagePerUser ||
      formData.applyToAllHotels !== promotion.applyToAllHotels ||
      hotelsChanged
    );
  }, [formData, promotion]);

  const isValid = formData.name && formData.name.trim().length > 0 && formData.endDate;

  const handleUpdate = () => {
    if (!promotion) return;

    confirm({
      title: "Update Campaign?",
      description: "Are you sure you want to update this campaign? Changes will be reflected immediately.",
      confirmText: "Slide to Update",
      type: "success",
      confirmDetails: {
        "Campaign Name": formData.name || displayData.name || 'Untitled',
        "End Date": formData.endDate || 'N/A',
        "Usage Limit": formData.maxUsage || 'N/A'
      },
      onConfirm: async () => {
        try {
          await promotionService.updatePromotion(promotion.id, formData);
          showNotification({ message: 'Campaign updated successfully!', type: 'success', format: "Cập nhật thành công!" });
          onSuccess();
          onClose();
        } catch (error) {
          showNotification({ message: 'Failed to update campaign', type: 'error' });
          throw error;
        }
      }
    });
  };

  const toggleHotel = (id: string) => {
    setFormData(prev => {
      const current = prev.applyToHotelIds || [];
      if (current.includes(id)) {
        return { ...prev, applyToHotelIds: current.filter(x => x !== id) };
      }
      return { ...prev, applyToHotelIds: [...current, id] };
    });
  };

  if (typeof document === 'undefined' || !promotion) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#F8F9FA] w-full max-w-5xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex border border-white/20"
            >
              {/* LEFT: Form */}
              <div className="w-full md:w-[60%] bg-white border-r border-gray-200 flex flex-col relative z-20">
                <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start shrink-0">
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-2">EDIT CAMPAIGN</h3>
                    <p className="text-gray-500 text-sm">Update {displayData.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono text-gray-500 font-bold">
                      {displayData.code}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 pb-32">

                  {/* 1. Identity */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Tag size={14} /> Campaign Identity
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Campaign Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all border border-transparent focus:border-lime-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all min-h-[80px] border border-transparent focus:border-lime-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Value - READ ONLY */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <DollarSign size={14} /> Locked Value
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-gray-500">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="font-bold">{displayData.discountType === DiscountType.Percentage ? 'Percentage' : 'Fixed'}</span>
                        <span>•</span>
                        <span className="font-bold">{displayData.discountValue}{displayData.discountType === DiscountType.Percentage ? '%' : '$'}</span>
                      </div>
                      <div className="text-xs italic">Value cannot be changed after launch</div>
                    </div>
                  </div>

                  {/* 3. Scope */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Building2 size={14} /> Application Scope
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, applyToAllHotels: true })}
                        className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all group
                                        ${formData.applyToAllHotels
                            ? 'border-lime-500 bg-lime-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${formData.applyToAllHotels ? 'bg-lime-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Globe size={18} />
                        </div>
                        <div className={`font-bold text-sm ${formData.applyToAllHotels ? 'text-lime-900' : 'text-gray-900'}`}>Global Scope</div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, applyToAllHotels: false })}
                        className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all group
                                        ${!formData.applyToAllHotels
                            ? 'border-lime-500 bg-lime-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${!formData.applyToAllHotels ? 'bg-lime-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Building2 size={18} />
                        </div>
                        <div className={`font-bold text-sm ${!formData.applyToAllHotels ? 'text-lime-900' : 'text-gray-900'}`}>Specific Hotels</div>
                      </button>
                    </div>

                    {!formData.applyToAllHotels && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col gap-2">
                          {hotels.map(h => (
                            <label key={h.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-lime-200 transition-all">
                              <input
                                type="checkbox"
                                checked={(formData.applyToHotelIds || []).includes(h.id)}
                                onChange={() => toggleHotel(h.id)}
                                className="w-5 h-5 rounded-md text-lime-600 focus:ring-lime-500"
                              />
                              <span className="text-sm font-bold text-gray-700">{h.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar size={14} /> Extend & Limits
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <DateTimePicker
                          label="Start Date"
                          value={formData.startDate || ''}
                          onChange={(val) => setFormData({ ...formData, startDate: val })}
                        />
                      </div>
                      <div>
                        <DateTimePicker
                          label="End Date"
                          value={formData.endDate || ''}
                          onChange={(val) => setFormData({ ...formData, endDate: val })}
                          minDate={formData.startDate ? new Date(formData.startDate) : undefined}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Usage Limit</label>
                        <input
                          type="number"
                          value={formData.maxUsage}
                          onChange={(e) => setFormData({ ...formData, maxUsage: Number(e.target.value) })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Limit Per User</label>
                        <input
                          type="number"
                          value={formData.maxUsagePerUser}
                          onChange={(e) => setFormData({ ...formData, maxUsagePerUser: Number(e.target.value) })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action for Mobile */}
                <div className="md:hidden p-8 border-t border-gray-100 bg-white absolute bottom-0 w-full z-30">
                  <button
                    onClick={handleUpdate}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <span>Update Campaign</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: Preview (40%) */}
              <div className="w-[40%] bg-[#F8F9FA] flex flex-col items-center justify-start p-8 relative overflow-hidden hidden md:flex border-l border-white/20">
                {/* Close Button UI */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all shadow-sm z-50"
                >
                  <X size={20} />
                </button>

                <div className="relative z-10 w-full max-w-[340px]">
                  <h4 className="text-gray-400 font-bold text-center uppercase tracking-widest text-xs mb-6">Campaign Preview</h4>

                  {/* Ticket Card - Minimalist Style */}
                  <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 relative translate-y-0">
                    {/* Top Part */}
                    <div className="p-8 text-center relative overflow-hidden">
                      {/* Start Date Badge */}
                      <div className="absolute top-4 right-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {promotion?.startDate ? new Date(promotion.startDate).toLocaleDateString() : 'Start Date'}
                        </span>
                      </div>

                      <div className="relative z-10 pt-4">
                        <div className="w-14 h-14 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                          <Ticket size={24} className="text-lime-600" />
                        </div>
                        <h3 className="text-3xl font-anton uppercase tracking-tight text-[#1A1A1A] mb-2 leading-none">
                          {formData.name || 'CAMPAIGN'}
                        </h3>
                        <div className="text-gray-500 font-bold text-sm bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                          {displayData.discountType === DiscountType.Percentage ? `Get ${displayData.discountValue}% Off` : `Save $${displayData.discountValue} Instantly`}
                        </div>
                      </div>
                    </div>

                    {/* Tear Line Section */}
                    <div className="relative flex items-center justify-between px-0 bg-white">
                      <div className="w-5 h-10 bg-[#F8F9FA] rounded-r-full border-y border-r border-gray-100 -ml-[1px]"></div>
                      <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-3 h-px"></div>
                      <div className="w-5 h-10 bg-[#F8F9FA] rounded-l-full border-y border-l border-gray-100 -mr-[1px]"></div>
                    </div>

                    {/* Bottom Part */}
                    <div className="p-8 pt-4 space-y-4">
                      <div className="bg-lime-50/50 rounded-xl p-4 text-center border border-lime-100 flex flex-col items-center justify-center gap-1 border-dashed">
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Coupon Code</div>
                        <div className="text-2xl font-mono font-bold text-lime-600 tracking-wider">
                          {displayData.code}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">Expires</span>
                        <span className="font-bold text-gray-900">{formData.endDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">Used so far</span>
                        <span className="font-bold text-gray-900">{promotion.usageCount} times</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full p-8 absolute bottom-0 left-0 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
                  <button
                    onClick={handleUpdate}
                    disabled={!isValid || !hasChanges}
                    className="w-full py-4 bg-lime-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lime-600 transition-all shadow-lg shadow-lime-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <span>Update Campaign</span>
                    <CheckCircle size={18} className="stroke-[3]" />
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
