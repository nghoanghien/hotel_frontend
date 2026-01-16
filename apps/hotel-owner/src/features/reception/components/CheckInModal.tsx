import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { BookingDto } from '@repo/types';
import { LoadingSpinner, useNotification } from '@repo/ui';
import { receptionService } from '../services/receptionService';
import { X, Key, CheckCircle, AlertCircle } from '@repo/ui/icons';

interface RoomOption {
  id: string;
  roomNumber: string;
  floor: number;
  status: 'Available';
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function CheckInModal({ isOpen, onClose, booking, onSuccess }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const { showNotification } = useNotification();

  // Debug log
  useEffect(() => {
    console.log('🚪 CheckInModal state changed:', { isOpen, hasBooking: !!booking });
  }, [isOpen, booking]);

  // Fetch available rooms based on booking's room type
  useEffect(() => {
    if (isOpen && booking) {
      fetchAvailableRooms();
    }
  }, [isOpen, booking]);

  const fetchAvailableRooms = async () => {
    console.log('📋 Fetching available rooms for room type:', booking?.roomType);
    if (!booking?.roomType) return;
    setLoadingRooms(true);
    try {
      // TODO: Replace with actual API call: GET /rooms/available?roomType={roomType}
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockRooms: RoomOption[] = [
        { id: 'r-101', roomNumber: '101', floor: 1, status: 'Available' },
        { id: 'r-102', roomNumber: '102', floor: 1, status: 'Available' },
        { id: 'r-201', roomNumber: '201', floor: 2, status: 'Available' },
        { id: 'r-202', roomNumber: '202', floor: 2, status: 'Available' },
      ];
      console.log('✅ Loaded rooms:', mockRooms);
      setAvailableRooms(mockRooms);
    } catch (e) {
      console.error('❌ Failed to load rooms:', e);
      showNotification({ message: 'Failed to load available rooms', type: 'error' });
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking || !selectedRoom) return;
    setIsLoading(true);
    try {
      // TODO: Update API call to include roomId: POST /{id}/checkin with body { roomId: selectedRoom }
      await receptionService.checkIn(booking.id);
      showNotification({
        message: `Successfully checked in ${booking.guest?.fullName || booking.guestName || 'Guest'} to Room ${availableRooms.find(r => r.id === selectedRoom)?.roomNumber}`,
        type: 'success'
      });
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
          <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title className="text-xl font-bold text-gray-900 flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Key className="text-lime-600" size={24} />
                Guest Check-in
              </div>
              <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </Dialog.Title>

            <div className="space-y-4">
              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Booking Code</span>
                  <span className="font-mono font-bold">{booking.bookingCode || booking.confirmationNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guest</span>
                  <span className="font-bold">{booking.guest?.fullName || booking.guestName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Room Type</span>
                  <span className="font-bold text-blue-600">{booking.roomType}</span>
                </div>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-lime-600" />
                  Select Available Room
                </label>

                {loadingRooms ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : availableRooms.length === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 text-red-700">
                    <AlertCircle size={20} className="shrink-0" />
                    <div className="text-sm">
                      No available rooms of type <strong>{booking.roomType}</strong>. Please check room inventory.
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {availableRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${selectedRoom === room.id
                          ? 'border-lime-500 bg-lime-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <div className="font-mono font-bold text-lg text-gray-900">
                          {room.roomNumber}
                        </div>
                        <div className="text-xs text-gray-500">Floor {room.floor}</div>
                        {selectedRoom === room.id && (
                          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-lime-600">
                            <CheckCircle size={14} /> Selected
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  Proceeding will update room status to <strong>Occupied</strong> and start the stay timer.
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCheckIn}
                disabled={isLoading || !selectedRoom || availableRooms.length === 0}
                className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size={18} color="white" />
                ) : (
                  <>
                    <Key size={18} /> Confirm Check-in
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
