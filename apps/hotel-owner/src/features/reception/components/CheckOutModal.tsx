import { motion, AnimatePresence } from '@repo/ui/motion';
import { Fragment, useEffect, useState } from 'react';
import { BookingDto, AdditionalChargeDto, LateCheckoutCalculation } from '@repo/types';
import { receptionService } from '../services/receptionService';
import { Dialog, Transition } from '@headlessui/react';
import { X, CheckCircle, AlertTriangle, Plus, Trash2 } from '@repo/ui/icons';
import { LoadingSpinner, useNotification } from '@repo/ui';

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

  useEffect(() => {
    if (isOpen && booking) {
      setStep(1);
      fetchCharges();
      // Mock checking for late checkout if actual time is late
      // keeping simple for now
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
    setIsLoading(true);
    try {
      const res = await receptionService.calculateLateCheckout(booking.id, new Date().toISOString());
      setLateCheckout(res);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!booking) return;
    setIsLoading(true);
    try {
      await receptionService.checkOut(booking.id);
      showNotification({ message: 'Guest checked out successfully!', type: 'success' });
      onSuccess();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to check out.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
            <Dialog.Title className="text-2xl font-anton text-gray-900 mb-6 flex justify-between items-center">
              Check Out - {booking.roomNumber} ({booking.guest?.fullName || booking.guestName || 'Guest'})
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={24} /></button>
            </Dialog.Title>

            <div className="flex gap-2 mb-6 border-b border-gray-100">
              <button onClick={() => setStep(1)} className={`py-3 px-4 font-bold border-b-2 transition-colors ${step === 1 ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-400'}`}>Review Charges</button>
              <button onClick={() => setStep(2)} className={`py-3 px-4 font-bold border-b-2 transition-colors ${step === 2 ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-400'}`}>Payment & Confirm</button>
            </div>

            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-700 mb-2">Room Charges</h4>
                    <div className="flex justify-between text-sm">
                      <span>Room Rate ({booking.roomType})</span>
                      <span className="font-bold text-gray-900">{booking.totalAmount.toLocaleString()} VND</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-700">Additional Charges (Minibar, Laundry...)</h4>
                      <button className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add Charge</button>
                    </div>
                    <div className="border rounded-xl divide-y overflow-hidden">
                      {charges.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">No additional charges</div>}
                      {charges.map(c => (
                        <div key={c.id} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
                          <div>
                            <div className="font-medium text-gray-800">{c.name}</div>
                            <div className="text-xs text-gray-500">Qty: {c.quantity}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">{(c.amount * c.quantity).toLocaleString()} VND</span>
                            <button className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleCalculateLateCheckout} className="w-full py-3 bg-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors">
                    Check Late Checkout Status
                  </button>
                  {lateCheckout && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-orange-800 text-sm">
                      <strong>Late Checkout:</strong> Guest is {lateCheckout.hoursLate} hours late.
                      Penalty: {lateCheckout.penaltyAmount.toLocaleString()} VND ({lateCheckout.penaltyPercentage}%)
                    </motion.div>
                  )}

                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto text-lime-600 mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ready to Checkout?</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Confirm that the guest has returned the key and paid the total balance of
                    <strong className="text-gray-900 ml-1">
                      {((booking.totalAmount + charges.reduce((acc, c) => acc + c.amount * c.quantity, 0) + (lateCheckout?.penaltyAmount || 0)) - (booking.depositAmount || 0)).toLocaleString()} VND
                    </strong>
                  </p>

                  <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800 text-sm flex gap-3 text-left">
                    <AlertTriangle className="shrink-0" size={20} />
                    <div>
                      Room status will be automatically changed to <strong>Cleaning</strong> upon confirmation.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {step === 1 ? (
                <button onClick={() => setStep(2)} className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg">
                  Next: Payment
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2"
                >
                  {isLoading && <LoadingSpinner size={16} color="white" />}
                  Confirm Checkout
                </button>
              )}
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
