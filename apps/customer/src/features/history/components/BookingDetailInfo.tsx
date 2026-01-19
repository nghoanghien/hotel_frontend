import { ImageWithFallback, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { formatVnd, formatDate } from "@repo/lib";
import {
  MapPin, Building, ShieldCheck, BedDouble, User, Clock, Calendar,
  CreditCard, Banknote, Wallet, Phone, Mail, Star
} from "@repo/ui/icons";
import type { BookingDetailDto } from "@repo/types";
import { motion } from "@repo/ui/motion";

// Room type mapping
const roomTypeMap: Record<number, string> = {
  0: "Standard",
  1: "Deluxe",
  2: "Suite",
  3: "Executive",
  4: "Presidential",
};

// Payment status mapping
const paymentStatusMap: Record<number, string> = {
  0: "Pending",
  1: "Completed",
  2: "Failed",
  3: "Refunded",
  4: "Cancelled",
};

interface BookingDetailInfoProps {
  booking: BookingDetailDto;
}

export function BookingDetailInfo({ booking }: BookingDetailInfoProps) {
  const router = useRouter();
  const { show } = useLoading();

  const handleHotelClick = () => {
    show("Loading hotel details...");
    const target = (booking as any).hotelSlug || booking.hotelId;
    router.push(`/hotels/${target}`);
  };

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col md:flex-row h-full items-start overflow-y-auto md:overflow-hidden pt-4 md:pt-8 custom-scrollbar"
    >
      {/* Left Column - Hotel & Rooms */}
      <div
        className="w-full md:w-[65%] flex-shrink-0 space-y-6 h-auto md:h-full md:overflow-y-auto p-4 md:px-4 md:pl-16"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Hotel & Rooms Combined Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Side: Hotel Card + Safety */}
          <div className="flex flex-col gap-4 w-full md:w-[240px] flex-shrink-0">
            {/* Hotel Card */}
            <div
              onClick={handleHotelClick}
              className="bg-white rounded-[32px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden cursor-pointer hover:bg-gray-50 hover:shadow-xl hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Avatar/Image */}
              <div className="relative w-20 h-20 mb-3">
                <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border border-gray-100">
                  {booking.hotelImageUrl ? (
                    <ImageWithFallback
                      src={booking.hotelImageUrl}
                      alt={booking.hotelName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 z-20 bg-[var(--primary)] text-white p-1 rounded-full shadow-md border-2 border-white">
                  <ShieldCheck className="w-3 h-3 fill-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-tight">
                {booking.hotelName}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="line-clamp-2">{booking.hotelAddress ? `${booking.hotelAddress}, ${booking.hotelCity}` : booking.hotelCity || "Unknown City"}</span>
              </div>

              {/* Stats (Mocked or derived) */}
              <div className="w-full border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div>
                    <div className="text-lg font-bold text-[#1A1A1A] leading-none mb-1">4.8</div>
                    <div className="text-[8px] uppercase font-bold text-gray-500 tracking-wide">Rating</div>
                  </div>
                  <div className="pl-2 border-l border-gray-100">
                    <div className="flex items-center gap-0.5 text-lg font-bold text-[#1A1A1A] leading-none mb-1">
                      {booking.numberOfRooms}
                    </div>
                    <div className="text-[8px] uppercase font-bold text-gray-500 tracking-wide">Rooms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Disclaimer */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-tight">
                Always book via Hotelzy to ensure your reservation is secure and supported.
              </p>
            </div>
          </div>

          {/* Right Side: Room List */}
          <div className="w-full md:w-auto flex-1 rounded-[24px] p-8 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg font-bold text-[#1A1A1A]">Rooms</h3>
              <span className="ml-auto text-sm text-gray-600">
                {booking.rooms?.length || 0} room(s)
              </span>
            </div>

            <div className="space-y-4">
              {booking.rooms?.map((room, idx) => (
                <div key={room.id || idx} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full font-anton bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1x
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[#1A1A1A] font-medium line-clamp-1">
                          {room.roomNumber && <span className="font-bold text-[var(--primary)] mr-1">#{room.roomNumber}</span>}
                          {typeof room.roomType === 'number' ? roomTypeMap[room.roomType] || 'Standard' : room.roomType} Room
                        </div>
                        {room.guestName && room.guestName !== booking.guestName && (
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" /> {room.guestName}
                          </div>
                        )}
                      </div>
                      <div className="text-[#1A1A1A] font-anton text-lg font-semibold whitespace-nowrap">
                        {formatVnd(room.price)}
                      </div>
                    </div>
                    <div className="space-y-0.5 mt-0.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>
                          {room.numberOfAdults} Adult{room.numberOfAdults !== 1 ? 's' : ''}
                          {room.numberOfChildren > 0 && `, ${room.numberOfChildren} Child`}
                        </span>
                      </div>
                      {room.specialRequests && (
                        <div className="italic text-gray-400 mt-1">Note: {room.specialRequests}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Fallback if no rooms detail is available */}
              {(!booking.rooms || booking.rooms.length === 0) && (
                <div className="text-center py-4 text-gray-400 text-sm italic">
                  No detailed room information available.
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatVnd(booking.subtotal || booking.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax & Fees</span>
                <span className="font-semibold">{formatVnd((booking.taxAmount || 0) + (booking.serviceFee || 0))}</span>
              </div>
              {booking.appliedCouponCode && (
                <div className="flex items-center justify-between text-green-600">
                  <span className="text-xs">Coupon ({booking.appliedCouponCode})</span>
                </div>
              )}
              {booking.discountAmount >= 0 && ( // Changed to >= 0 or keep > 0 if only want to show if valid
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">
                    - {formatVnd(booking.discountAmount)}
                  </span>
                </div>
              )}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold text-[#1A1A1A]">Total</span>
                <span className="font-bold text-[var(--primary)] text-2xl font-anton">
                  {formatVnd(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-[1px] h-[90%] my-auto bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2 opacity-60" />

      {/* Right Column - Guest & Info */}
      <div
        className="w-full md:flex-1 space-y-6 h-auto md:h-full md:overflow-y-auto p-4 md:pl-4 md:pr-20"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Guest / Contact Info */}
        <div className="bg-white rounded-[32px] p-5 pr-6 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wide mb-2">Primary Guest</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="font-bold text-[#1A1A1A] text-lg leading-tight">{booking.guestName || "Guest"}</div>
                {booking.guestEmail && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {booking.guestEmail}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stay Timeline (Route equivalent) */}
        <div className="rounded-[24px] p-8 border-2 border-gray-200">
          <div className="space-y-3">
            {/* Check In */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                  Check In
                </div>
                <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton truncate">
                  {formatDate(booking.checkInDate)}
                </div>
                <div className="text-sm text-[#777]">
                  from 14:00 PM
                </div>
              </div>
            </div>

            {/* Connection Line */}
            <div className="ml-4 h-6 w-0.5 bg-gradient-to-b from-[var(--primary)] to-gray-400" />

            {/* Check Out */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center shadow-md">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Check Out
                </div>
                <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton">
                  {formatDate(booking.checkOutDate)}
                </div>
                <div className="text-sm text-[#777] leading-tight">
                  until 12:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Context */}
        <div className="rounded-[24px] p-8 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">Booking Info</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Booked On</span>
              <span className="font-semibold">
                {formatDate(booking.createdAt)}
              </span>
            </div>

            {booking.confirmedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confirmed At</span>
                <span className="font-semibold text-xs text-right">{formatDate(booking.confirmedAt)}</span>
              </div>
            )}

            {booking.checkedInAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Actual Check-in</span>
                <span className="font-semibold text-xs text-right">{formatDate(booking.checkedInAt)}</span>
              </div>
            )}

            {booking.checkedOutAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Actual Check-out</span>
                <span className="font-semibold text-xs text-right">{formatDate(booking.checkedOutAt)}</span>
              </div>
            )}

            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${booking.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {booking.isPaid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Booking Status</span>
              <span className="font-semibold capitalize">
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Policies & Requests */}
        {(booking.cancellationPolicy || booking.specialRequests || booking.hotelPhoneNumber) && (
          <div className="rounded-[24px] p-6 border-2 border-gray-200 mt-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg font-bold text-[#1A1A1A]">Policies & Help</h3>
            </div>

            {/* Cancellation */}
            {booking.cancellationPolicy && (
              <div className="group relative overflow-hidden bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cancellation Policy</div>
                    <p className="text-sm text-[#1A1A1A] font-medium leading-relaxed">
                      {booking.cancellationPolicy}
                    </p>
                  </div>
                </div>
                <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-200/50 -rotate-12 pointer-events-none" />
              </div>
            )}

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="relative bg-[var(--primary)]/5 p-4 rounded-2xl border border-[var(--primary)]/10 hover:border-[var(--primary)]/20 transition-colors">
                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
                    <Star className="w-5 h-5 fill-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-1 opacity-70">Special Requests</div>
                    <div className="text-sm text-[#1A1A1A] italic font-medium pl-3 border-l-2 border-[var(--primary)]/20">
                      "{booking.specialRequests}"
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Contact */}
            {booking.hotelPhoneNumber && (
              <a href={`tel:${booking.hotelPhoneNumber}`} className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[var(--primary)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[var(--primary)] group-hover:text-white flex items-center justify-center text-gray-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 group-hover:text-[var(--primary)] font-medium transition-colors">Contact Property</div>
                    <div className="text-base font-bold text-[#1A1A1A]">Call Front Desk</div>
                  </div>
                </div>
                <div className="font-anton text-base md:text-lg text-gray-300 group-hover:text-[var(--primary)] transition-colors">
                  {booking.hotelPhoneNumber}
                </div>
              </a>
            )}
          </div>
        )}

        {/* Payment Information */}
        {booking.payments && booking.payments.length > 0 && (
          <div className="rounded-[24px] p-6 border-2 border-gray-200 mt-6 md:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg font-bold text-[#1A1A1A]">Payment Details</h3>
            </div>
            <div className="space-y-4">
              {booking.payments.map((payment, idx) => {
                // Handle method as string or number (enum)
                const methodMap: Record<number, string> = {
                  0: 'Cash',
                  1: 'CreditCard',
                  2: 'BankTransfer',
                  3: 'EWallet',
                };
                const methodStr = typeof payment.method === 'number' 
                  ? (methodMap[payment.method] || 'Unknown') 
                  : (payment.method || 'Unknown');
                
                const isCash = methodStr === 'Cash';
                const PaymentIcon = isCash ? Banknote : (methodStr === 'BankTransfer' || methodStr === 'EWallet' ? Wallet : CreditCard);
                const methodName = methodStr.replace(/([A-Z])/g, ' $1').trim();
                
                // Handle payment status as string or number
                const statusStr = typeof payment.status === 'number' 
                  ? (paymentStatusMap[payment.status] || 'Unknown') 
                  : (payment.status || 'Unknown');

                return (
                  <div key={payment.id || idx} className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute -top-2 -right-2 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform rotate-12 scale-150 pointer-events-none">
                      <PaymentIcon className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <PaymentIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-sm">{methodName}</div>
                            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                              {payment.paidAt ? formatDate(payment.paidAt) : (payment.processedAt ? formatDate(payment.processedAt) : "Date N/A")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-anton text-lg text-[var(--primary)] leading-none">{formatVnd(payment.amount)}</div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
                          <div className="flex items-center justify-between">
                            <div className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${statusStr === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              statusStr === 'Refunded' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}>
                              {statusStr}
                            </div>
                            {payment.transactionId ? (
                              <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-1 rounded border border-gray-100">
                                <span className="opacity-60 font-sans font-semibold">REF:</span> {payment.transactionId}
                              </div>
                            ) : isCash ? (
                              <div className="text-[9px] font-medium text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-1 rounded border border-gray-100 italic">
                                Pay at Property
                              </div>
                            ) : null}
                          </div>

                          {/* Refund Details */}
                          {statusStr === 'Refunded' && (payment.refundAmount || payment.refundedAt) && (
                            <div className="text-[10px] bg-red-50/50 p-2 rounded-lg border border-red-100/50 mt-1">
                              <div className="flex justify-between font-bold text-red-700 mb-0.5">
                                <span>Refunded Amount</span>
                                <span>-{formatVnd(payment.refundAmount || 0)}</span>
                              </div>
                              <div className="flex justify-between text-red-400">
                                <span>{payment.refundedAt ? formatDate(payment.refundedAt) : ''}</span>
                                {payment.refundReason && <span className="italic opacity-80 max-w-[150px] truncate text-right">"{payment.refundReason}"</span>}
                              </div>
                            </div>
                          )}

                          {/* Unrefunded Cancelled Warning */}
                          {booking.status === 'Cancelled' && booking.isPaid && statusStr === 'Completed' && (
                            <div className="text-[10px] bg-orange-50 p-2.5 rounded-lg border border-orange-100 mt-2 flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <Clock className="w-2.5 h-2.5 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-orange-800 mb-0.5">Refund Pending / Policy Check</div>
                                <div className="text-orange-700 opacity-90 leading-tight">
                                  Booking is cancelled but payment is completed. Check cancellation policy for refund eligibility.
                                  {(booking.cancellationPolicy?.toLowerCase().includes('non-refundable')) && (
                                    <span className="block mt-1 font-bold text-red-500">
                                      • Policy: Non-refundable
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
