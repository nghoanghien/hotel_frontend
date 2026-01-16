import { motion, AnimatePresence } from '@repo/ui/motion';
import { useEffect, useState } from 'react';
import { BookingDto, AdditionalChargeDto, LateCheckoutCalculation } from '@repo/types';
import { receptionService } from '../services/receptionService';
import { X, CheckCircle, AlertTriangle, Plus, Trash2, CreditCard, DollarSign, Calendar, Clock, ArrowRight, Edit2 } from '@repo/ui/icons';
import { LoadingSpinner, useNotification, useSwipeConfirmation, InputField } from '@repo/ui';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function CheckOutModal({ isOpen, onClose, booking, onSuccess }: CheckOutModalProps) {
  const [step, setStep] = useState(1); // 1: Charges, 2: Checkout Confirmation
  const [charges, setCharges] = useState<AdditionalChargeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lateCheckout, setLateCheckout] = useState<LateCheckoutCalculation | null>(null);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  // Add Charge State
  const [isAddingCharge, setIsAddingCharge] = useState(false);
  const [newCharge, setNewCharge] = useState({ name: '', amount: 0, quantity: 1 });

  useEffect(() => {
    if (isOpen && booking) {
      setStep(1);
      fetchCharges();
      // Auto check late checkout on open
      handleCalculateLateCheckout();
    }
  }, [isOpen, booking]);

  const fetchCharges = async () => {
    if (!booking) return;
    try {
      const data = await receptionService.getCharges(booking.id);
      setCharges(data);
    } catch (e) { console.error(e); }
  };

  const handleCalculateLateCheckout = async () => {
    if (!booking) return;
    try {
      const res = await receptionService.calculateLateCheckout(booking.id, new Date().toISOString());
      setLateCheckout(res);
    } catch (e) { console.error("Error calc late checkout", e) }
  };

  const handleCreateCharge = () => {
    if (!booking) return;
    if (!newCharge.name || newCharge.amount <= 0) {
      showNotification({ message: 'Please enter valid charge details', type: 'error', format: "Vui lòng nhập chi tiết phí hợp lệ" });
      return;
    }
    const charge: AdditionalChargeDto = {
      id: `temp-${Date.now()}`,
      name: newCharge.name,
      amount: newCharge.amount,
      quantity: newCharge.quantity,
      bookingId: booking.id,
      createdAt: new Date().toISOString()
    };
    setCharges([...charges, charge]);
    setIsAddingCharge(false);
    setNewCharge({ name: '', amount: 0, quantity: 1 });
    showNotification({ message: 'Charge added successfully', type: 'success' });
  };

  const handleRemoveCharge = (id: string) => {
    setCharges(prev => prev.filter(c => c.id !== id));
  };

  const totalCharges = charges.reduce((acc, c) => acc + c.amount * c.quantity, 0);
  const penalty = lateCheckout?.penaltyAmount || 0;
  const deposit = booking?.depositAmount || 0;
  const roomTotal = booking?.totalAmount || 0;
  const grandTotal = roomTotal + totalCharges + penalty - deposit;

  const nights = booking ? Math.max(1, Math.round((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24))) : 1;

  const handleCheckout = () => {
    confirm({
      title: 'Confirm Checkout',
      description: `Final total to settle is ${grandTotal.toLocaleString()} VND. Ensure guest has paid.`,
      confirmText: 'Swipe to Checkout',
      type: 'info',
      onConfirm: async () => {
        if (!booking) return;
        setIsLoading(true);
        try {
          await receptionService.checkOut(booking.id);
          showNotification({ message: 'Guest checked out successfully!', type: 'success', format: 'Check-out thành công!' });
          onSuccess();
          onClose();
        } catch (e) {
          showNotification({ message: 'Failed to check out.', type: 'error', format: 'Lỗi check-out' });
        } finally {
          setIsLoading(false);
        }
      }
    });
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#F8F9FA] w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-white/20 max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Checkout</span>
                    <span className="text-gray-400 font-bold text-sm">Room {booking.roomNumber}</span>
                  </div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] line-clamp-1">
                    {booking.guest?.fullName || booking.guestName || 'Guest'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {step === 1 ? (
                  <div className="space-y-6">
                    {/* Room Fee */}
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Room Charges</h4>
                          <p className="text-xs text-gray-500 font-medium">{booking.roomType} • {nights} Nights</p>
                        </div>
                        <div className="ml-auto font-anton text-xl text-gray-900">
                          {roomTotal.toLocaleString()} đ
                        </div>
                      </div>

                      {lateCheckout && lateCheckout.hoursLate > 0 && (
                        <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm text-orange-500">
                              <Clock size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-orange-800">Late Checkout Penalty</div>
                              <div className="text-xs text-orange-600 font-medium">{lateCheckout.hoursLate} hours late (+{lateCheckout.penaltyPercentage}%)</div>
                            </div>
                          </div>
                          <span className="font-bold text-orange-700">+{penalty.toLocaleString()} đ</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Charges */}
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Additional Services</h4>
                            <p className="text-xs text-gray-500 font-medium">Minibar, Laundry, etc.</p>
                          </div>
                        </div>
                      </div>

                      {/* List */}
                      <div className="space-y-3 mb-6">
                        {charges.length === 0 ? (
                          <div className="text-center py-6 text-gray-400 text-sm mb-4 border-2 border-dashed border-gray-100 rounded-2xl">
                            No additional charges record.
                          </div>
                        ) : (
                          charges.map((charge) => (
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
                                  <button onClick={() => { }} className="p-1.5 bg-white text-gray-400 hover:text-blue-500 rounded-lg shadow-sm border border-gray-100">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => handleRemoveCharge(charge.id)} className="p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm border border-gray-100">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Charge Form */}
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
                            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1.5 block ml-1">Price</label>
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
                              className="h-[42px] w-[42px] bg-[#1A1A1A] text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center justify-center"
                              title="Add Item"
                            >
                              <Plus size={20} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => setIsAddingCharge(false)}
                              className="h-[42px] w-[42px] bg-white border border-gray-200 text-gray-400 rounded-xl hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                              title="Cancel"
                            >
                              <X size={20} strokeWidth={2.5} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {charges.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                          <span className="text-sm font-bold text-gray-500">Services Total</span>
                          <span className="font-bold text-gray-900">{totalCharges.toLocaleString()} đ</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center text-lime-600 shadow-inner mb-2">
                      <CheckCircle size={48} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase">Ready to Checkout</h2>
                      <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto font-medium">
                        Please confirm that the guest has returned the room key and completed the payment process.
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm w-full max-w-sm space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="font-bold text-gray-900">{(roomTotal + totalCharges + penalty).toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Deposit Paid</span>
                        <span className="font-bold text-green-600">-{deposit.toLocaleString()} đ</span>
                      </div>
                      <div className="h-px bg-gray-100 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#1A1A1A] text-lg">Balance Due</span>
                        <span className="font-anton text-3xl text-[#1A1A1A]">{grandTotal.toLocaleString()} đ</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-xl text-xs font-bold border border-yellow-100">
                      <AlertTriangle size={16} />
                      <span>Room status will be updated to Cleaning automatically</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2"
                  >
                    Continue Payment <ArrowRight size={18} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="px-8 py-3 bg-lime-500 text-white rounded-xl font-bold hover:bg-lime-600 transition-all shadow-lg flex items-center gap-2 shadow-lime-200 disabled:opacity-70"
                    >
                      {isLoading ? <LoadingSpinner size={20} color='white' /> : 'Confirm Payment & Checkout'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
