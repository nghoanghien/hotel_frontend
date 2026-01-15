import { BaseDto } from './common';
import { RoomType } from './room';
import { ReviewDto } from './hotel';

export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow' | 'Refunded';

export interface BookingRoomDto {
  roomId: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  guestName?: string;
  specialRequests?: string;
}

export interface CreateBookingDto {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: BookingRoomDto[];
  guestName?: string;
  guestEmail?: string;
  guestPhoneNumber?: string;
  guestAddress?: string;
  guestNationality?: string;
  specialRequests?: string;
  paymentMethod?: string;
  currency?: string;
  couponCode?: string;
}

export interface BookingDto extends BaseDto {
  hotelId: string;
  hotelName: string;
  guestId: string;
  guestName?: string;
  guestEmail?: string;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalAmount: number;
  currency?: string;
  status: BookingStatus;
  isPaid: boolean;
  bookedAt?: string;
}

export interface BookingRoomDetailDto {
  id: string;
  roomId: string;
  roomNumber?: string;
  roomType: RoomType;
  price: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  guestName?: string;
  specialRequests?: string;
}

export interface PaymentDto {
  id: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface BookingDetailDto extends BookingDto {
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  specialRequests?: string;
  cancellationPolicy?: string;
  confirmedAt?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  rooms: BookingRoomDetailDto[];
  payments: PaymentDto[];
  hotelImageUrl?: string;
  hotelAddress?: string;
  hotelCity?: string;
  hotelPhoneNumber?: string;
  appliedCouponCode?: string;
  review?: ReviewDto;
}
