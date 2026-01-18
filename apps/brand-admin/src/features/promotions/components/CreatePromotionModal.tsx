
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { X, Tag, FileText, Percent, DollarSign, Calendar, Building2, CheckCircle, Globe, Ticket } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, Select, useSwipeConfirmation } from '@repo/ui';
import { CreatePromotionDto, DiscountType, promotionService } from '../services/promotionService';
import { hotelService, HotelWithLocation } from '../../hotels/services/hotelService';
import DateTimePicker from './DateTimePicker';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePromotionModal({ isOpen, onClose, onSuccess }: CreatePromotionModalProps) {
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelWithLocation[]>([]);

  // Form State
  const [formData, setFormData] = useState<CreatePromotionDto>({
    brandId: 'brand-1',
    name: '',
    code: '',
    description: '',
    discountType: DiscountType.Percentage,
    discountValue: 0,
    maxDiscountAmount: 0,
    minBookingAmount: 0,
    applyToAllHotels: true,
    applyToHotelIds: [],
    startDate: '',
    endDate: '',
    maxUsage: 100,
    maxUsagePerUser: 1
  });

  useEffect(() => {
    if (isOpen) {
      hotelService.getBrandHotels('brand-1').then(setHotels);
      // Reset form logic if needed
    }
  }, [isOpen]);


  // Validation Logic
  const isValid =
    formData.name.trim().length > 0 &&
    formData.code.trim().length > 0 &&
    formData.startDate.length > 0 &&
    formData.endDate.length > 0 &&
    formData.discountValue > 0;

  const handleSubmit = () => {
    confirm({
      title: "Launch Campaign?",
      description: "Are you sure you want to launch this marketing campaign? This will make the promotion active immediately.",
      confirmText: "Slide to Launch",
      type: "success",
      confirmDetails: {
        "Campaign Name": formData.name || 'Untitled',
        "Code": formData.code || 'N/A',
        "Discount": formData.discountType === DiscountType.Percentage ? `${formData.discountValue}%` : `$${formData.discountValue}`,
        "Start Date": formData.startDate || 'N/A'
      },
      onConfirm: async () => {
        try {
          await promotionService.createPromotion(formData);
          showNotification({ message: 'Campaign launch successfully!', type: 'success', format: "Chiến dịch đã được tạo thành công!" });
          onSuccess();
          onClose(); // Close Create Modal fully after success
        } catch (error) {
          showNotification({ message: 'Failed to create campaign', type: 'error' });
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

  if (typeof document === 'undefined') return null;

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
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-2">NEW CAMPAIGN</h3>
                    <p className="text-gray-500 text-sm">Design your marketing promotion strategy.</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 pb-32">

                  {/* 1. Identity */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Tag size={14} /> Campaign Identity
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Campaign Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Summer Flash Sale"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all border border-transparent focus:border-lime-200"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Coupon Code</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="SUMMER2024"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-mono font-bold text-lime-600 outline-none focus:ring-2 focus:ring-lime-100 transition-all uppercase placeholder:text-gray-300 border border-transparent focus:border-lime-200"
                          />
                          <Tag size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description</label>
                        <textarea
                          placeholder="Terms and conditions..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 transition-all min-h-[80px] border border-transparent focus:border-lime-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Value */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <DollarSign size={14} /> Value & Constraints
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Discount Type</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setFormData({ ...formData, discountType: DiscountType.Percentage })}
                              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border-2
                                                    ${formData.discountType === DiscountType.Percentage
                                  ? 'bg-lime-50 text-lime-700 border-lime-200'
                                  : 'bg-white text-gray-500 border-transparent'}`}
                            >
                              <Percent size={14} /> Percent
                            </button>
                            <button
                              onClick={() => setFormData({ ...formData, discountType: DiscountType.FixedAmount })}
                              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border-2
                                                    ${formData.discountType === DiscountType.FixedAmount
                                  ? 'bg-lime-50 text-lime-700 border-lime-200'
                                  : 'bg-white text-gray-500 border-transparent'}`}
                            >
                              <DollarSign size={14} /> Fixed
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Value ({formData.discountType === DiscountType.Percentage ? '%' : '$'})</label>
                          <input
                            type="number"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                            className="w-full bg-white rounded-xl px-4 py-3 text-lg font-anton text-gray-900 outline-none border border-gray-200 focus:border-lime-500 transition-all text-center"
                          />
                        </div>
                      </div>
                      {formData.discountType === DiscountType.Percentage && (
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max Discount Amount (Limit)</label>
                          <input
                            type="number"
                            placeholder="Unlimited"
                            value={formData.maxDiscountAmount || ''}
                            onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none border border-gray-200 focus:border-lime-500 transition-all"
                          />
                        </div>
                      )}
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
                        <div className="text-xs text-gray-400 mt-1">Apply to entire hotel chain</div>
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
                        <div className="text-xs text-gray-400 mt-1">Select specific branches</div>
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
                      <Calendar size={14} /> Timeline & Limits
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <DateTimePicker
                          label="Start Date & Time"
                          value={formData.startDate}
                          onChange={(val) => setFormData({ ...formData, startDate: val })}
                        />
                      </div>
                      <div>
                        <DateTimePicker
                          label="End Date & Time"
                          value={formData.endDate}
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
                    onClick={handleSubmit}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <span>Launch Campaign</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: Preview (40%) */}
              <div className="w-[40%] bg-[#F8F9FA] flex flex-col items-center justify-start p-8 relative overflow-hidden hidden md:flex border-l border-white/20">
                {/* Close Button in Right Panel */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all shadow-sm z-50"
                >
                  <X size={20} />
                </button>

                <div className="relative z-10 w-full max-w-[340px]">
                  <h4 className="text-gray-400 font-bold text-center uppercase tracking-widest text-xs mb-6">Live Preview</h4>

                  {/* Ticket Card - Minimalist Style */}
                  <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 relative translate-y-0">
                    {/* Top Part */}
                    <div className="p-8 text-center relative overflow-hidden">

                      {/* Start Date Badge */}
                      <div className="absolute top-4 right-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{formData.startDate || 'Start Date'}</span>
                      </div>

                      <div className="relative z-10 pt-4">
                        <div className="w-14 h-14 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                          <Ticket size={24} className="text-lime-600" />
                        </div>
                        <h3 className="text-3xl font-anton uppercase tracking-tight text-[#1A1A1A] mb-2 leading-none">
                          {formData.name || 'CAMPAIGN'}
                        </h3>
                        <div className="text-gray-500 font-bold text-sm bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                          {formData.discountType === DiscountType.Percentage ? `Get ${formData.discountValue}% Off` : `Save $${formData.discountValue} Instantly`}
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
                          {formData.code || 'CODE'}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">Expires</span>
                        <span className="font-bold text-gray-900">{formData.endDate || 'No expiration'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full p-8 absolute bottom-0 left-0 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className="w-full py-4 bg-lime-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lime-600 transition-all shadow-lg shadow-lime-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <span>Launch Campaign</span>
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
