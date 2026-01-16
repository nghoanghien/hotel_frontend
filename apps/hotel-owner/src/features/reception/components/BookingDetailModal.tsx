import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, AlertCircle } from '@repo/ui/icons';
import { BookingDto } from '@repo/types';
import { receptionService } from '../services/receptionService';
import { LoadingSpinner } from '@repo/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function BookingDetailModal({ isOpen, onClose, bookingId }: Props) {
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBooking();
    }
  }, [isOpen, bookingId]);

  const loadBooking = async () => {
    if (!bookingId) return;
    setIsLoading(true);
    try {
      const data = await receptionService.getBookingDetail(bookingId);
      setBooking(data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <Dialog.Title className="text-2xl font-anton font-bold text-gray-900 uppercase">
                Booking Details
              </Dialog.Title>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : booking ? (
                <div className="space-y-6">
                  {/* Booking Code */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Booking Code</div>
                    <div className="font-mono text-2xl font-bold text-gray-900">{booking.bookingCode}</div>
                  </div>

                  {/* Guest Information */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Guest Information</h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Full Name</div>
                          <div className="font-bold text-gray-900">{booking.guest?.fullName || booking.guestName || 'Unknown'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-medium text-gray-900">{booking.guest?.phoneNumber || booking.guestPhoneNumber || 'N/A'}</div>
                        </div>
                      </div>
                      {(booking.guest?.email || booking.guestEmail) && (
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Email</div>
                            <div className="font-medium text-gray-900">{booking.guest?.email || booking.guestEmail || ''}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room & Stay Info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Stay Information</h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Room</div>
                          {booking.roomNumber ? (
                            <div className="font-bold text-gray-900">{booking.roomNumber} - {booking.roomType}</div>
                          ) : (
                            <div>
                              <div className="text-sm font-bold text-orange-600">Not Assigned Yet</div>
                              <div className="text-xs text-gray-500">Type: {booking.roomType} • Will be assigned at check-in</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-gray-400" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Schedule</div>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">Check-in: {formatDate(booking.checkInDate)}</div>
                            <div className="font-medium text-gray-600">Check-out: {formatDate(booking.checkOutDate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Payment</h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="font-bold text-xl text-gray-900">{booking.totalAmount.toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Deposit</span>
                        <span className="font-medium text-gray-900">{(booking.depositAmount || 0).toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-bold ${booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Special Requests</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">No booking data</div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
