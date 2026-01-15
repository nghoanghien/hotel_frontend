import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { BookingDto } from '../types';
import { LoadingSpinner, useNotification } from '@repo/ui';
import { receptionService } from '../services/receptionService';
import { X, Key } from '@repo/ui/icons';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function CheckInModal({ isOpen, onClose, booking, onSuccess }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleCheckIn = async () => {
    if (!booking) return;
    setIsLoading(true);
    try {
      await receptionService.checkIn(booking.id);
      showNotification({ message: `Successfully checked in guest ${booking.guest.fullName}`, type: 'success' });
      onSuccess();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to check in.', type: 'error' });
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
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title className="text-xl font-bold text-gray-900 flex justify-between items-center mb-4">
              Guest Check-in
              <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </Dialog.Title>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Booking Code</span>
                  <span className="font-mono font-bold">{booking.bookingCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guest</span>
                  <span className="font-bold">{booking.guest.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Room</span>
                  <span className="font-bold">{booking.roomNumber} ({booking.roomType})</span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Proceeding will update room status to <strong>Occupied</strong> and start the stay timer.
              </div>

              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? <LoadingSpinner size={18} color="white" /> : <><Key size={18} /> Confirm Check-in</>}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
