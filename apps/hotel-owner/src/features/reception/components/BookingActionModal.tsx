import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Key, LogOut, Ban, CheckCircle, UserCheck, Calendar, ArrowLeftRight } from '@repo/ui/icons';
import { BookingDto } from '@repo/types';
import { receptionService } from '../services/receptionService';
import { useNotification, useSwipeConfirmation } from '@repo/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onRefresh: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onChangeRoom?: () => void;
}

export default function BookingActionModal({ isOpen, onClose, booking, onRefresh, onCheckIn, onCheckOut, onChangeRoom }: Props) {
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  const handleCheckInClick = () => {
    onClose();
    if (onCheckIn) onCheckIn();
  };

  const handleCheckOutClick = () => {
    onClose();
    if (onCheckOut) onCheckOut();
  };

  const handleChangeRoomClick = () => {
    onClose();
    if (onChangeRoom) onChangeRoom();
  };

  const handleConfirm = async () => {
    if (!booking) return;
    try {
      await receptionService.confirmBooking(booking.id);
      showNotification({ message: 'Booking confirmed successfully!', type: 'success', format: 'Đã xác nhận đặt phòng thành công!' });
      onRefresh();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to confirm booking', type: 'error', format: 'Xác nhận thất bại' });
    }
  };

  const handleCancel = async () => {
    if (!booking) return;

    confirm({
      title: 'Cancel Booking?',
      description: `Caution: This will cancel booking #${booking.bookingCode} for ${booking.guest?.fullName || booking.guestName}. Verify cancellation policy first.`,
      confirmText: 'Swipe to Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await receptionService.cancelBooking(booking.id);
          showNotification({ message: 'Booking cancelled successfully', type: 'success', format: 'Đã hủy đặt phòng thành công' });
          onRefresh();
          onClose();
        } catch (e) {
          showNotification({ message: 'Failed to cancel booking', type: 'error', format: 'Hủy thất bại' });
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
              className="bg-white w-[500px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative pointer-events-auto border border-white/20"
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-bold text-sm text-gray-600">
                    {booking.bookingCode || 'NO-CODE'}
                  </span>
                  {booking.status === 'Pending' && <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Pending</span>}
                  {booking.status === 'Confirmed' && <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Confirmed</span>}
                  {booking.status === 'CheckedIn' && <span className="px-2.5 py-1 bg-lime-100 text-lime-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Checked In</span>}
                </div>
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">Booking Actions</h2>
                <div className="text-gray-500 text-sm mt-1 flex items-center gap-1.5 font-medium">
                  Guest: <span className="text-gray-900 font-bold">{booking.guest?.fullName || booking.guestName || 'Unknown'}</span>
                  {booking.roomNumber && <span className="text-gray-400 font-normal ml-1">• Room {booking.roomNumber}</span>}
                </div>
              </div>

              <div className="space-y-3">
                {/* Confirm Action */}
                {booking.status === 'Pending' && (
                  <button
                    onClick={handleConfirm}
                    className="w-full group relative overflow-hidden bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base">Confirm Booking</span>
                        <span className="text-[11px] font-medium text-blue-100 opacity-90 font-sans">Mark booking as confirmed</span>
                      </div>
                    </div>
                  </button>
                )}

                {/* Check In Action */}
                {booking.status === 'Confirmed' && (
                  <button
                    onClick={handleCheckInClick}
                    className="w-full group relative overflow-hidden bg-lime-500 hover:bg-lime-600 text-white p-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-lime-200 hover:-translate-y-0.5 active:translate-y-0 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Key size={20} className="text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base">Check In Guest</span>
                        <span className="text-[11px] font-medium text-lime-100 opacity-90 font-sans">Complete arrival process</span>
                      </div>
                    </div>
                  </button>
                )}

                {/* Check Out Action */}
                {booking.status === 'CheckedIn' && (
                  <>
                    <button
                      onClick={handleCheckOutClick}
                      className="w-full group relative overflow-hidden bg-[#1A1A1A] hover:bg-gray-900 text-white p-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-gray-200 hover:-translate-y-0.5 active:translate-y-0 text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <LogOut size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base">Check Out Guest</span>
                          <span className="text-[11px] font-medium text-gray-400 opacity-90 font-sans">Process payment & departure</span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleChangeRoomClick}
                      className="w-full group relative overflow-hidden bg-white border border-gray-100 hover:bg-gray-50 text-[#1A1A1A] p-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-left flex items-center justify-between mt-3"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-[#1A1A1A] transition-colors">
                          <ArrowLeftRight size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base">Change Room</span>
                          <span className="text-[11px] font-medium text-gray-400 font-sans">Move guest to another room</span>
                        </div>
                      </div>
                    </button>
                  </>
                )}

                {/* Cancel Action */}
                {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                  <button
                    onClick={handleCancel}
                    className="w-full group relative overflow-hidden bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-2xl font-bold transition-all border border-red-100 hover:border-red-200 text-left flex items-center justify-between mt-4"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-white flex items-center justify-center transition-colors">
                        <Ban size={20} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base group-hover:text-red-700 transition-colors">Cancel Booking</span>
                        <span className="text-[11px] font-medium text-red-400 group-hover:text-red-500 opacity-90 font-sans">This action requires confirmation</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
