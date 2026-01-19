import { http, ApiResponse } from "@repo/api";

export interface BookingListItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  hotelId: string;
  hotelName: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalAmount: number;
  currency: string;
  status: number;
  isPaid: boolean;
  bookedAt: string;
}

export interface BookingRoom {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: number;
  price: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  guestName: string;
  specialRequests: string;
}

export interface BookingPayment {
  id: string;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: number;
  status: number;
  processedAt: string;
  gateway: string;
  cardLast4Digits: string;
  receiptUrl: string;
}

export interface BookingDetail extends BookingListItem {
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  specialRequests: string;
  cancellationPolicy: string;
  confirmedAt: string;
  checkedInAt: string;
  checkedOutAt: string;
  rooms: BookingRoom[];
  payments: BookingPayment[];
  hotelImageUrl: string;
  hotelAddress: string;
  hotelCity: string;
  hotelPhoneNumber: string;
  appliedCouponCode: string;
}

export const getMyBookings = async () => {
  return http.get<ApiResponse<BookingListItem[]>>("/Bookings/my-bookings") as unknown as Promise<ApiResponse<BookingListItem[]>>;
};

export const getBookingDetail = async (id: string) => {
  return http.get<ApiResponse<BookingDetail>>(`/Bookings/${id}`) as unknown as Promise<ApiResponse<BookingDetail>>;
};
