export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export interface GuestDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  idCardNumber?: string;
}

export interface BookingDto {
  id: string;
  bookingCode: string;
  guestId: string;
  guest: GuestDto;
  roomId: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string; // ISO String
  checkOutDate: string; // ISO String
  actualCheckInDate?: string;
  actualCheckOutDate?: string;
  status: BookingStatus;
  totalAmount: number;
  depositAmount: number;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  specialRequests?: string;
  createdAt: string;
}

export interface AdditionalChargeDto {
  id: string;
  bookingId: string;
  name: string; // e.g. "Coca Cola", "Laundry"
  amount: number;
  quantity: number;
  createdAt: string;
}

export interface LateCheckoutCalculation {
  hoursLate: number;
  penaltyAmount: number;
  penaltyPercentage: number;
}
