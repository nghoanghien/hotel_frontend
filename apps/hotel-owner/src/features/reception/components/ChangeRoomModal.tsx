import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { BookingDto } from '@repo/types';
import { LoadingSpinner, useNotification } from '@repo/ui';
import { X, RefreshCw, AlertCircle, CheckCircle } from '@repo/ui/icons';

interface RoomOption {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  status: 'Available';
  priceDifference?: number; // If upgrading/downgrading
}

interface ChangeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function ChangeRoomModal({ isOpen, onClose, booking, onSuccess }: ChangeRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [reason, setReason] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen && booking) {
      fetchAvailableRooms();
      setReason('');
      setSelectedRoom(null);
    }
  }, [isOpen, booking]);

  const fetchAvailableRooms = async () => {
    setLoadingRooms(true);
    try {
      // TODO: API call: GET /rooms/available (excluding current room)
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockRooms: RoomOption[] = [
        { id: 'r-103', roomNumber: '103', roomType: 'Deluxe', floor: 1, status: 'Available', priceDifference: 0 },
        { id: 'r-104', roomNumber: '104', roomType: 'Deluxe', floor: 1, status: 'Available', priceDifference: 0 },
        { id: 'r-301', roomNumber: '301', roomType: 'Suite', floor: 3, status: 'Available', priceDifference: 500000 },
        { id: 'r-105', roomNumber: '105', roomType: 'Standard', floor: 1, status: 'Available', priceDifference: -200000 },
      ];
      setAvailableRooms(mockRooms);
    } catch (e) {
      showNotification({ message: 'Failed to load available rooms', type: 'error' });
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleChangeRoom = async () => {
    if (!booking || !selectedRoom) return;
    setIsLoading(true);
    try {
      // TODO: API call: POST /{id}/change-room with body { newRoomId: selectedRoom, reason }
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRoom = availableRooms.find(r => r.id === selectedRoom);
      showNotification({
        message: `Successfully changed room to ${newRoom?.roomNumber}. Old room marked for cleaning.`,
        type: 'success'
      });
      onSuccess();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to change room.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return null;

  const selectedRoomDetails = availableRooms.find(r => r.id === selectedRoom);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <Dialog.Title className="text-2xl font-anton text-gray-900 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <RefreshCw className="text-blue-600" size={28} />
                Change Room
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </Dialog.Title>

            <div className="space-y-6">
              {/* Current Booking Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Current Booking</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Guest</div>
                    <div className="font-bold text-gray-900">{booking.guest?.fullName || booking.guestName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Room</div>
                    <div className="font-mono font-bold text-lg text-red-600">{booking.roomNumber || 'Not Assigned'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Room Type</div>
                    <div className="font-bold text-gray-900">{booking.roomType}</div>
                  </div>
                </div>
              </div>

              {/* Reason for Change */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason for Room Change <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., AC malfunction, guest complaint, upgrade request..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Select New Room
                </label>

                {loadingRooms ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                    {availableRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative ${selectedRoom === room.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-mono font-bold text-2xl text-gray-900">
                            {room.roomNumber}
                          </div>
                          {selectedRoom === room.id && (
                            <CheckCircle size={20} className="text-blue-600" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">{room.roomType}</div>
                          <div className="text-xs text-gray-500">Floor {room.floor}</div>
                          {room.priceDifference !== undefined && room.priceDifference !== 0 && (
                            <div className={`text-xs font-bold ${room.priceDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {room.priceDifference > 0 ? '+' : ''}{room.priceDifference.toLocaleString()} VND
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Difference Warning */}
              {selectedRoomDetails?.priceDifference !== undefined && selectedRoomDetails.priceDifference !== 0 && (
                <div className={`rounded-xl p-4 flex gap-2 ${selectedRoomDetails.priceDifference > 0
                    ? 'bg-orange-50 border border-orange-200 text-orange-800'
                    : 'bg-green-50 border border-green-200 text-green-800'
                  }`}>
                  <AlertCircle size={20} className="shrink-0" />
                  <div className="text-sm">
                    {selectedRoomDetails.priceDifference > 0
                      ? `Guest will be charged additional ${selectedRoomDetails.priceDifference.toLocaleString()} VND for room upgrade.`
                      : `Guest will receive a refund of ${Math.abs(selectedRoomDetails.priceDifference).toLocaleString()} VND for room downgrade.`
                    }
                  </div>
                </div>
              )}

              {/* Process Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Important:</strong> Old room will be automatically marked as <strong>Cleaning</strong>.
                  Guest will be moved to the new room immediately.
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeRoom}
                  disabled={isLoading || !selectedRoom || !reason.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoadingSpinner size={18} color="white" />
                  ) : (
                    <>
                      <RefreshCw size={18} /> Confirm Room Change
                    </>
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
