
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Building2, MapPin, Globe, Star, FileText, Image as ImageIcon, ArrowRight, CheckCircle, AlertCircle, Trash2 } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, ImageWithFallback } from '@repo/ui';
import { hotelService, HotelWithLocation } from '../services/hotelService';
import { UpdateHotelDto } from '@repo/types';

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelWithLocation | null;
  onSuccess: () => void;
}

export default function EditHotelModal({ isOpen, onClose, hotel, onSuccess }: EditHotelModalProps) {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<UpdateHotelDto>({});

  // Initial Load
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        city: hotel.city,
        country: hotel.country,
        address: hotel.address,
        starRating: hotel.starRating,
        imageUrl: hotel.imageUrl,
        description: hotel.description,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        isActive: hotel.uiStatus === 'Active'
      });
    }
  }, [hotel]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dirty Check Logic
  const isDirty = hotel ? (
    formData.name !== hotel.name ||
    formData.city !== hotel.city ||
    formData.country !== hotel.country ||
    formData.address !== hotel.address ||
    formData.starRating !== hotel.starRating ||
    formData.imageUrl !== hotel.imageUrl ||
    formData.description !== hotel.description ||
    formData.isActive !== (hotel.uiStatus === 'Active')
  ) : false;

  const isValid = formData.name && formData.city && formData.address && formData.imageUrl;
  const canSave = isDirty && isValid;

  const handleUpdate = async () => {
    if (!hotel || !canSave) return; // Guard clause
    setIsLoading(true);
    try {
      await hotelService.updateHotel(hotel.id, formData);
      showNotification({ message: 'Hotel updated successfully!', type: 'success', format: "Cập nhật khách sạn thành công!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      showNotification({ message: 'Failed to update hotel', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  if (!hotel) return null;

  return (
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
              <div className="w-full md:w-[60%] bg-white border-r border-gray-200 flex flex-col relative z-10">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-2">EDIT HOTEL</h3>
                    <p className="text-gray-500 text-sm">Update information for {hotel.name}</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono text-gray-500">
                    ID: {hotel.id}
                  </div>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-sm font-bold text-gray-700">Operating Status</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isActive: true }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400'}`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isActive: false }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!formData.isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-400'}`}
                      >
                        Maintenance
                      </button>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={14} /> Identity & Location
                    </label>

                    <div className="bg-white p-1 rounded-2xl border border-gray-100 space-y-4">
                      <div className="p-3 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-lime-100 transition-all">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Hotel Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-transparent font-bold text-gray-900 outline-none placeholder:text-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 px-3 pb-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">City</label>
                          <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                            <MapPin size={14} className="text-gray-400" />
                            <input
                              type="text"
                              value={formData.city}
                              onChange={e => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-transparent font-medium text-gray-900 outline-none placeholder:text-gray-300 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Country</label>
                          <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                            <Globe size={14} className="text-gray-400" />
                            <input
                              type="text"
                              value={formData.country}
                              onChange={e => setFormData({ ...formData, country: e.target.value })}
                              className="w-full bg-transparent font-medium text-gray-900 outline-none placeholder:text-gray-300 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-3 pb-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-lime-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} /> Star Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setFormData({ ...formData, starRating: star })}
                          className={`px-4 py-2 rounded-xl flex items-center gap-1 font-bold transition-all border
                                        ${formData.starRating === star
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg scale-105'
                              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                            }
                                    `}
                        >
                          <span>{star}</span> <Star size={12} className={formData.starRating === star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Media & Desc */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Media & Description
                    </label>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Hotel Cover Image</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-lime-500 hover:bg-lime-50/50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                          {formData.imageUrl ? (
                            <>
                              <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-xs bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">Change Image</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                <ImageIcon size={20} />
                              </div>
                              <span className="text-xs font-bold">Click to upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-sky-200 placeholder:text-gray-300 min-h-[80px] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Preview & Action (40%) */}
              <div className="w-[40%] bg-[#F8F9FA] flex flex-col h-full relative z-20 border-l border-white/50 hidden md:flex">
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-gray-900 text-lg">Live Preview</h4>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Preview Card */}
                  <div className="w-full flex h-[130px] rounded-[24px] bg-white shadow-xl relative overflow-hidden mb-8">
                    <div className="w-[130px] h-full relative flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={formData.imageUrl || ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        fill={true}
                      />
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm text-white ${formData.isActive ? 'bg-emerald-500/80' : 'bg-orange-500/80'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse"></div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{formData.isActive ? 'Active' : 'Maint.'}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0 bg-white">
                      <div>
                        <h3 className="font-bold text-base leading-tight line-clamp-2 mb-1 text-[#1A1A1A]">
                          {formData.name || 'New Hotel Name'}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                          <span className="truncate">{formData.city || 'City'}, {formData.country}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/50 w-fit">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{formData.starRating} Stars</span>
                      </div>
                    </div>
                  </div>

                  {/* Change Log Warning */}
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Update Warning</div>
                        <div className="text-[10px] text-gray-500">Changes reflect immediately</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 leading-relaxed">
                      Updating hotel details (especially Name or Location) may affect existing bookings or SEO. Please ensure accuracy.
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading || !canSave}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isLoading ? <LoadingSpinner size={20} color="white" /> : (
                      <>
                        <span>Save Changes</span>
                        <CheckCircle size={18} className="stroke-[3]" />
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
