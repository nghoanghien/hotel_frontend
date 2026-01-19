import type { BookingDetailDto } from '@repo/types';
import { mockHotels } from './hotels';

// Mock user info
export const mockUser = {
  id: 'user-001',
  name: 'Nguyễn Văn An',
  email: 'nguyen.vanan@example.com',
  phone: '+84 901 234 567'
};

// Generate booking history referencing real hotels
export const mockBookingHistory: BookingDetailDto[] = [
  {
    id: 'booking-001',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1000 * 60 * 30).toISOString(),
    hotelId: 'hotel-kh-001',
    hotelName: 'Vinpearl Resort & Spa Nha Trang Bay',
    hotelImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    hotelAddress: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
    hotelCity: 'Nha Trang',
    hotelPhoneNumber: '+84 258 359 8888',
    guestId: mockUser.id,
    guestName: mockUser.name,
    guestEmail: mockUser.email,
    confirmationNumber: 'VNP-2024-001',
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 10500000,
    currency: 'VND',
    status: 'Confirmed',
    isPaid: true,
    subtotal: 9500000,
    taxAmount: 950000,
    serviceFee: 50000,
    discountAmount: 0,
    cancellationPolicy: 'Miễn phí hủy trước 48 giờ check-in.',
    specialRequests: 'Phòng view biển, giường King size.',
    rooms: [
      {
        id: 'detail-room-1',
        roomId: 'hotel-kh-001-room-301',
        roomType: 'Deluxe',
        roomNumber: '301',
        price: 3500000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0,
        guestName: mockUser.name,
        specialRequests: 'Extra pillows'
      }
    ],
    payments: [
      {
        id: 'payment-1',
        amount: 10500000,
        method: 'CreditCard',
        status: 'Completed',
        transactionId: 'TXN_VNP001',
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'booking-002',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    hotelId: 'hotel-ld-001',
    hotelName: 'Ana Mandara Villas Dalat Resort & Spa',
    hotelImageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
    hotelAddress: 'Lê Lai, Phường 5, TP. Đà Lạt, Lâm Đồng',
    hotelCity: 'Đà Lạt',
    hotelPhoneNumber: '+84 263 355 5888',
    guestId: mockUser.id,
    guestName: mockUser.name,
    guestEmail: mockUser.email,
    confirmationNumber: 'ANA-2024-002',
    checkInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 4,
    numberOfRooms: 1,
    totalAmount: 9240000,
    currency: 'VND',
    status: 'Confirmed',
    isPaid: true,
    subtotal: 8400000,
    taxAmount: 840000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: 'Không hoàn tiền.',
    specialRequests: 'Romantic dinner setup cho ngày đầu tiên.',
    rooms: [
      {
        id: 'detail-room-2',
        roomId: 'hotel-ld-001-room-401',
        roomType: 'Suite',
        roomNumber: '401',
        price: 2800000,
        numberOfAdults: 2,
        numberOfChildren: 2,
        numberOfInfants: 0,
        guestName: mockUser.name + ' & Gia đình'
      }
    ],
    payments: [
      {
        id: 'payment-2',
        amount: 9240000,
        method: 'BankTransfer',
        status: 'Completed',
        transactionId: 'IB_ANA002',
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'booking-003',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    checkedInAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 1000 * 60 * 60 * 14).toISOString(),
    checkedOutAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000 + 1000 * 60 * 60 * 11).toISOString(),
    hotelId: 'hotel-dn-001',
    hotelName: 'Melia Danang Beach Resort',
    hotelImageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    hotelAddress: '19 Trường Sa, Phường Hòa Hải, Quận Ngũ Hành Sơn, Đà Nẵng',
    hotelCity: 'Đà Nẵng',
    hotelPhoneNumber: '+84 236 392 9888',
    guestId: mockUser.id,
    guestName: mockUser.name,
    guestEmail: mockUser.email,
    confirmationNumber: 'MEL-2024-003',
    checkInDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 10560000,
    status: 'CheckedOut',
    isPaid: true,
    subtotal: 9600000,
    taxAmount: 960000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: 'Miễn phí hủy trước 24 giờ.',
    specialRequests: 'Honeymoon setup.',
    rooms: [
      {
        id: 'detail-room-3',
        roomId: 'hotel-dn-001-room-301',
        roomType: 'Deluxe',
        roomNumber: '305',
        price: 3200000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0,
        guestName: mockUser.name,
        specialRequests: 'Rose petals on bed'
      }
    ],
    review: {
      id: 'review-003',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      hotelId: 'hotel-dn-001',
      guestId: mockUser.id,
      guestName: mockUser.name,
      rating: 5,
      title: 'Kỳ nghỉ tuyệt vời!',
      comment: 'Resort rất đẹp, nhân viên chuyên nghiệp và thân thiện. Bãi biển sạch, hồ bơi rộng. Sẽ quay lại!',
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      valueRating: 4,
      isVerified: true,
      stayDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      images: []
    },
    payments: [
      {
        id: 'payment-3',
        amount: 10560000,
        method: 'Cash',
        status: 'Completed',
        paidAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'booking-004',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: 'hotel-dn-003',
    hotelName: 'Mường Thanh Luxury Da Nang',
    hotelImageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    hotelAddress: '270 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng',
    hotelCity: 'Đà Nẵng',
    hotelPhoneNumber: '+84 236 392 7777',
    guestId: mockUser.id,
    guestName: mockUser.name,
    guestEmail: mockUser.email,
    confirmationNumber: 'MTH-2024-004',
    checkInDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date().toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 3520000,
    status: 'Cancelled',
    isPaid: false,
    subtotal: 3200000,
    taxAmount: 320000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: 'Miễn phí hủy trước 48 giờ.',
    rooms: [
      {
        id: 'detail-room-4',
        roomId: 'hotel-dn-003-room-301',
        roomType: 'Deluxe',
        price: 1600000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: [
      {
        id: 'payment-4',
        amount: 3520000,
        method: 'EWallet',
        status: 'Refunded',
        transactionId: 'MOMO_MTH004',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        refundedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        refundAmount: 3520000,
        refundReason: 'Khách hàng yêu cầu hủy'
      }
    ]
  },
  {
    id: 'booking-005',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: 'hotel-kh-002',
    hotelName: 'Melia Vinpearl Cam Ranh',
    hotelImageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    hotelAddress: 'Bãi Dài, Xã Cam Hải Đông, Huyện Cam Lâm, Khánh Hòa',
    hotelCity: 'Cam Ranh',
    hotelPhoneNumber: '+84 258 399 8888',
    guestId: mockUser.id,
    guestName: mockUser.name,
    guestEmail: mockUser.email,
    confirmationNumber: 'MVC-2024-005',
    checkInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 15400000,
    status: 'Pending',
    isPaid: false,
    subtotal: 14000000,
    taxAmount: 1400000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: 'Miễn phí hủy trước khi xác nhận.',
    specialRequests: 'View biển, bồn tắm.',
    rooms: [
      {
        id: 'detail-room-5',
        roomId: 'hotel-kh-002-room-401',
        roomType: 'Suite',
        roomNumber: 'Pending',
        price: 2800000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: []
  }
];

// Get all bookings
export function getBookingHistory(): BookingDetailDto[] {
  return mockBookingHistory;
}

// Get upcoming bookings
export function getUpcomingBookings(): BookingDetailDto[] {
  return mockBookingHistory.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
}

// Get past bookings
export function getPastBookings(): BookingDetailDto[] {
  return mockBookingHistory.filter(b =>
    b.status === 'CheckedOut' || b.status === 'Cancelled' || b.status === 'Refunded' || b.status === 'NoShow'
  );
}

// Get booking by ID
export function getBookingById(id: string): BookingDetailDto | undefined {
  return mockBookingHistory.find(b => b.id === id);
}
