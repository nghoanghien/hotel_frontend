import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, AlertCircle, Clock, CheckCircle, RotateCcw, Ban, Key, LogOut, Plus, Trash2, DollarSign, Receipt, Save, Edit2 } from '@repo/ui/icons';
import { BookingDto, AdditionalChargeDto } from '@repo/types';
import { useState, useEffect } from 'react';
import { InputField, useNotification, LoadingSpinner } from '@repo/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function BookingDetailModal({ isOpen, onClose, booking }: Props) {
  const { showNotification } = useNotification();

  // Charge Management State
  const [charges, setCharges] = useState<AdditionalChargeDto[]>([]);
  const [isAddingCharge, setIsAddingCharge] = useState(false);
  const [newCharge, setNewCharge] = useState({ name: '', amount: 0, quantity: 1 });
  const [isSavingCharges, setIsSavingCharges] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize charges (Mock)
  useEffect(() => {
    if (isOpen && booking) {
      // Mock loading charges
      setCharges([]);
      setIsAddingCharge(false);
      setNewCharge({ name: '', amount: 0, quantity: 1 });
      setHasChanges(false);
    }
  }, [isOpen, booking]);

  const handleCreateCharge = () => {
    if (!newCharge.name || newCharge.amount <= 0) {
      showNotification({ message: 'Enter valid charge details', type: 'error', format: "Nhập thông tin chi tiết hợp lệ" });
      return;
    }
    const charge: AdditionalChargeDto = {
      id: `temp-${Date.now()}`,
      name: newCharge.name,
      amount: newCharge.amount,
      quantity: newCharge.quantity,
      bookingId: booking?.id || '',
      createdAt: new Date().toISOString()
    };
    setCharges(prev => [...prev, charge]);
    setIsAddingCharge(false);
    setNewCharge({ name: '', amount: 0, quantity: 1 });
    setHasChanges(true); // Mark as changed
  };

  const handleRemoveCharge = (id: string) => {
    setCharges(prev => prev.filter(c => c.id !== id));
    setHasChanges(true);
  };

  const handleSaveCharges = async () => {
    setIsSavingCharges(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setIsSavingCharges(false);
    setHasChanges(false);
    showNotification({ message: 'Charges updated successfully', type: 'success', format: "Cập nhật chi phí thành công" });
  };

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-[#F8F9FA] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50 shrink-0">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A]">BOOKING DETAILS</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-400">Code:</span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">{booking.bookingCode || booking.confirmationNumber}</span>
                    <span className="text-gray-300 mx-1">|</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      Created: {formatDate(booking.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  {(() => {
                    const config = {
                      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'Pending' },
                      Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle, label: 'Confirmed' },
                      CheckedIn: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: Key, label: 'Occupied' },
                      CheckedOut: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: LogOut, label: 'Checked Out' },
                      Cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: Ban, label: 'Cancelled' },
                    }[booking.status as string] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: booking.status };

                    const Icon = config.icon;
                    return (
                      <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${config.bg} ${config.text} ${config.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    );
                  })()}

                  <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar pb-10">

                {/* Guest & Room Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Guest Card */}
                  <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</h4>
                        <div className="font-bold text-[#1A1A1A] line-clamp-1">{booking.guest?.fullName || booking.guestName || 'Unknown Guest'}</div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full mb-3" />
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">{booking.guest?.phoneNumber || booking.guestPhoneNumber || 'No phone'}</span>
                      </div>
                      {booking.guest?.email || booking.guestEmail ? (
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium text-gray-900 truncate">{booking.guest?.email || booking.guestEmail}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Room Card */}
                  <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Room Info</h4>
                        {booking.roomNumber ? (
                          <div className="font-bold text-[#1A1A1A] line-clamp-1">{booking.roomNumber} - {booking.roomType}</div>
                        ) : (
                          <div className="font-bold text-orange-600">Not Assigned</div>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full mb-3" />

                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-center bg-gray-50 rounded-lg p-2 flex-1 mr-2">
                        <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">Check In</div>
                        <div className="text-xs font-bold text-[#1A1A1A]">
                          {new Date(booking.checkInDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(booking.checkInDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-gray-300">➜</div>
                      <div className="text-center bg-gray-50 rounded-lg p-2 flex-1 ml-2">
                        <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">Check Out</div>
                        <div className="text-xs font-bold text-[#1A1A1A]">
                          {new Date(booking.checkOutDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(booking.checkOutDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Request */}
                {booking.specialRequests && (
                  <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-100/50 p-4 rounded-[24px] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Special Request</h4>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {booking.specialRequests}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Charges Block */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      <h4 className="font-bold text-[#1A1A1A]">Additional Charges</h4>
                    </div>
                    {hasChanges && (
                      <button
                        onClick={handleSaveCharges}
                        disabled={isSavingCharges}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-lime-200 disabled:opacity-50"
                      >
                        {isSavingCharges ? <LoadingSpinner size={14} color='white' /> : <Save size={14} />}
                        Save Changes
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {/* List */}
                    {charges.length > 0 ? (
                      <div className="space-y-3 mb-6">
                        {charges.map((charge) => (
                          <div key={charge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                                x{charge.quantity}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-[#1A1A1A]">{charge.name}</div>
                                <div className="text-[10px] text-gray-400">{charge.amount.toLocaleString()} đ/unit</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="font-bold text-[#1A1A1A]">{(charge.amount * charge.quantity).toLocaleString()} đ</div>
                              <div className="flex gap-1 transition-opacity">
                                <button onClick={() => {/* Edit logic */ }} className="p-1.5 bg-white text-gray-400 hover:text-blue-500 rounded-lg shadow-sm border border-gray-100">
                                  <Edit2 size={12} />
                                </button>
                                <button onClick={() => handleRemoveCharge(charge.id)} className="p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm border border-gray-100">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400 text-sm mb-4 border-2 border-dashed border-gray-100 rounded-2xl">
                        No additional charges added
                      </div>
                    )}

                    {/* Add Form */}
                    {!isAddingCharge ? (
                      <button
                        onClick={() => setIsAddingCharge(true)}
                        className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500 text-sm font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Charge Item
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end"
                      >
                        <div className="flex-1 w-full relative">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1.5 block ml-1">Item Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Laundry Service"
                            value={newCharge.name}
                            onChange={(e) => setNewCharge(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/5 focus:border-[#1A1A1A] transition-all placeholder:text-gray-300 font-sans"
                          />
                        </div>
                        <div className="w-32 relative">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1.5 block ml-1">Amount</label>
                          <input
                            type="text"
                            placeholder="0"
                            value={newCharge.amount > 0 ? newCharge.amount.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                              setNewCharge(prev => ({ ...prev, amount: Number(val) }));
                            }}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/5 focus:border-[#1A1A1A] transition-all text-right font-sans"
                          />
                        </div>
                        <div className="w-20 relative">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1.5 block ml-1">Qty</label>
                          <input
                            type="number"
                            placeholder="1"
                            value={newCharge.quantity}
                            onChange={(e) => setNewCharge(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/5 focus:border-[#1A1A1A] transition-all text-center font-sans"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateCharge}
                            className="h-[42px] w-[42px] bg-[#1A1A1A] text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center justify-center"
                            title="Add Item"
                          >
                            <Plus size={20} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => setIsAddingCharge(false)}
                            className="h-[42px] w-[42px] bg-white border border-gray-200 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                            title="Cancel"
                          >
                            <X size={20} strokeWidth={2.5} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-[#1A1A1A]">Payment Summary</h4>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Room Rate</span>
                      <span className="font-bold text-gray-900">{booking.totalAmount.toLocaleString()} đ</span>
                    </div>
                    {charges.length > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Extra Charges</span>
                        <span className="font-bold text-gray-900">
                          {charges.reduce((sum, c) => sum + (c.amount * c.quantity), 0).toLocaleString()} đ
                        </span>
                      </div>
                    )}
                    {(booking.depositAmount || 0) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Deposit Paid</span>
                        <span className="font-bold text-green-600">-{(booking.depositAmount || 0).toLocaleString()} đ</span>
                      </div>
                    )}

                    <div className="h-px bg-gray-100 my-2" />

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A1A1A] text-base">Payment Status</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                                    ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                                `}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <span className="font-anton text-2xl text-[#1A1A1A]">
                        {(booking.totalAmount + charges.reduce((sum, c) => sum + (c.amount * c.quantity), 0) - (booking.depositAmount || 0)).toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
