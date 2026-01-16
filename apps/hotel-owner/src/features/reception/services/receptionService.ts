import { BookingDto, AdditionalChargeDto, LateCheckoutCalculation } from '@repo/types';

export const mockBookings: BookingDto[] = [
  {
    id: 'bk-1',
    hotelId: 'hotel-1',
    confirmationNumber: 'BK001',
    bookingCode: 'BK001',
    guestId: 'g-1',
    guest: { id: 'g-1', fullName: 'Nguyen Van A', email: 'a@test.com', phoneNumber: '0901234567' },
    guestName: 'Nguyen Van A',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: undefined, // Not assigned yet
    roomNumber: undefined, // Not assigned yet
    roomType: 'Deluxe', // Room type from booking request
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'Pending',
    totalAmount: 2500000,
    depositAmount: 500000,
    paymentStatus: 'Partial',
    isPaid: false,
    bookedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    hotelId: 'hotel-1',
    confirmationNumber: 'BK002',
    bookingCode: 'BK002',
    guestId: 'g-2',
    guest: { id: 'g-2', fullName: 'Tran Thi B', email: 'b@test.com', phoneNumber: '0909876543' },
    guestName: 'Tran Thi B',
    numberOfGuests: 1,
    numberOfRooms: 1,
    roomId: 'room-2',
    roomNumber: '205', // Already checked in - has room
    roomType: 'Standard',
    checkInDate: new Date(Date.now() - 86400000).toISOString(),
    checkOutDate: new Date().toISOString(),
    status: 'CheckedIn',
    actualCheckInDate: new Date(Date.now() - 86400000).toISOString(),
    totalAmount: 1200000,
    depositAmount: 1200000,
    paymentStatus: 'Paid',
    isPaid: true,
    bookedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'bk-3',
    hotelId: 'hotel-1',
    confirmationNumber: 'BK003',
    bookingCode: 'BK003',
    guestId: 'g-3',
    guest: { id: 'g-3', fullName: 'John Doe', email: 'john@test.com', phoneNumber: '+123456789' },
    guestName: 'John Doe',
    numberOfGuests: 4,
    numberOfRooms: 1,
    roomId: undefined, // Confirmed but not checked in yet
    roomNumber: undefined,
    roomType: 'Suite',
    checkInDate: new Date(Date.now() + 86400000).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'Confirmed',
    totalAmount: 5000000,
    depositAmount: 0,
    paymentStatus: 'Unpaid',
    isPaid: false,
    specialRequests: 'Late check-in expected',
    bookedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-4',
    hotelId: 'hotel-1',
    confirmationNumber: 'BK004',
    bookingCode: 'BK004',
    guestId: 'g-4',
    guest: { id: 'g-4', fullName: 'Le Thi C', email: 'c@test.com', phoneNumber: '0912345678' },
    guestName: 'Le Thi C',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: 'room-3',
    roomNumber: '301', // Checked in
    roomType: 'Deluxe',
    checkInDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'CheckedIn',
    actualCheckInDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    totalAmount: 3000000,
    depositAmount: 1500000,
    paymentStatus: 'Partial',
    isPaid: false,
    bookedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
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
