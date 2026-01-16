import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Key, LogOut, Ban, CheckCircle } from '@repo/ui/icons';
import { BookingDto } from '@repo/types';
import { receptionService } from '../services/receptionService';
import { useNotification } from '@repo/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onRefresh: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
}

export default function BookingActionModal({ isOpen, onClose, booking, onRefresh, onCheckIn, onCheckOut }: Props) {
  const { showNotification } = useNotification();

  if (!booking) return null;

  const handleCheckInClick = () => {
    console.log('🔑 Check In clicked! Opening CheckInModal...');
    console.log('📍 onCheckIn callback exists?', !!onCheckIn);
    console.log('📍 Current booking:', booking);
    onClose(); // Close this modal first
    if (onCheckIn) {
      console.log('✅ Calling onCheckIn callback NOW');
      onCheckIn(); // Then open CheckInModal from parent
    } else {
      console.error('❌ onCheckIn callback is undefined!');
    }
  };

  const handleCheckOutClick = () => {
    onClose(); // Close this modal first
    if (onCheckOut) onCheckOut(); // Then open CheckOutModal from parent
  };

  const handleConfirm = async () => {
    try {
      await receptionService.confirmBooking(booking.id);
      showNotification({ message: 'Booking confirmed!', type: 'success' });
      onRefresh();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to confirm', type: 'error' });
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await receptionService.cancelBooking(booking.id);
      showNotification({ message: 'Booking cancelled', type: 'success' });
      onRefresh();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to cancel', type: 'error' });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-anton font-bold text-gray-900 uppercase">
                Booking Actions
              </Dialog.Title>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <div className="font-mono font-bold text-lg">{booking.bookingCode || booking.confirmationNumber}</div>
                <div className="text-sm text-gray-600">
                  {booking.guest?.fullName || booking.guestName || 'Unknown'}
                  {booking.roomNumber && ` - Room ${booking.roomNumber}`}
                  {!booking.roomNumber && <span className="text-orange-600 font-semibold"> (Room pending)</span>}
                </div>
              </div>

              {booking.status === 'Pending' && (
                <button onClick={handleConfirm} className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Confirm Booking
                </button>
              )}

              {booking.status === 'Confirmed' && (
                <button onClick={handleCheckInClick} className="w-full py-3 bg-lime-500 text-white rounded-xl font-bold hover:bg-lime-600 transition-all flex items-center justify-center gap-2">
                  <Key size={18} /> Check In
                </button>
              )}

              {booking.status === 'CheckedIn' && (
                <button onClick={handleCheckOutClick} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <LogOut size={18} /> Check Out
                </button>
              )}

              {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                <button onClick={handleCancel} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                  <Ban size={18} /> Cancel Booking
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
