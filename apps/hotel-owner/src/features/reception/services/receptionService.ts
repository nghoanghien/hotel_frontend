import { BookingDto, AdditionalChargeDto, LateCheckoutCalculation } from '../types';

export const mockBookings: BookingDto[] = [
  {
    id: 'bk-1',
    bookingCode: 'BK001',
    guestId: 'g-1',
    guest: { id: 'g-1', fullName: 'Nguyen Van A', email: 'a@test.com', phoneNumber: '0901234567' },
    roomId: 'room-1',
    roomNumber: '101',
    roomType: 'Deluxe',
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'Pending',
    totalAmount: 2500000,
    depositAmount: 500000,
    paymentStatus: 'Partial',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    bookingCode: 'BK002',
    guestId: 'g-2',
    guest: { id: 'g-2', fullName: 'Tran Thi B', email: 'b@test.com', phoneNumber: '0909876543' },
    roomId: 'room-2',
    roomNumber: '205',
    roomType: 'Standard',
    checkInDate: new Date(Date.now() - 86400000).toISOString(),
    checkOutDate: new Date().toISOString(),
    status: 'CheckedIn',
    actualCheckInDate: new Date(Date.now() - 86400000).toISOString(),
    totalAmount: 1200000,
    depositAmount: 1200000,
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'bk-3',
    bookingCode: 'BK003',
    guestId: 'g-3',
    guest: { id: 'g-3', fullName: 'John Doe', email: 'john@test.com', phoneNumber: '+123456789' },
    roomId: 'room-3',
    roomNumber: '301',
    roomType: 'Suite',
    checkInDate: new Date(Date.now() + 86400000).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'Confirmed',
    totalAmount: 5000000,
    depositAmount: 0,
    paymentStatus: 'Unpaid',
    specialRequests: 'Late check-in expected',
    createdAt: new Date().toISOString()
  }
];

export const receptionService = {
  getBookings: async (hotelId: string): Promise<BookingDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockBookings];
  },

  getBookingDetail: async (id: string): Promise<BookingDto | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.find(b => b.id === id);
  },

  confirmBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Booking ${id} confirmed`);
  },

  checkIn: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Booking ${id} checked in`);
  },

  calculateLateCheckout: async (id: string, checkoutTime: string): Promise<LateCheckoutCalculation> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      hoursLate: 4,
      penaltyPercentage: 50,
      penaltyAmount: 500000 // Mock value
    };
  },

  checkOut: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Booking ${id} checked out`);
  },

  getCharges: async (bookingId: string): Promise<AdditionalChargeDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      { id: 'c-1', bookingId, name: 'Minibar - Coke', amount: 20000, quantity: 2, createdAt: new Date().toISOString() }
    ];
  },

  addCharge: async (charge: Partial<AdditionalChargeDto>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Charge added', charge);
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`Booking ${id} cancelled`);
  }
};
