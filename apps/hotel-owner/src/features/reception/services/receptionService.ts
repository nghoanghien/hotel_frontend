import { BookingDto, AdditionalChargeDto, LateCheckoutCalculation, CreateBookingDto, GuestDto, RoomDto } from '@repo/types';
import { getRoomsByHotelId } from '@repo/mock-data';

// Hotel info - consistent with hotel-owner login
const HOTEL_INFO = {
  id: 'hotel-kh-001',
  name: 'Vinpearl Resort & Spa Nha Trang Bay'
};

// Get rooms for this hotel
const hotelRooms: RoomDto[] = getRoomsByHotelId(HOTEL_INFO.id);

// Date helpers
const today = new Date();
const tomorrow = new Date(today.getTime() + 86400000);
const dayAfterTomorrow = new Date(today.getTime() + 86400000 * 2);
const threeDaysFromNow = new Date(today.getTime() + 86400000 * 3);
const fiveDaysFromNow = new Date(today.getTime() + 86400000 * 5);
const yesterday = new Date(today.getTime() - 86400000);
const twoDaysAgo = new Date(today.getTime() - 86400000 * 2);
const threeDaysAgo = new Date(today.getTime() - 86400000 * 3);
const fourDaysAgo = new Date(today.getTime() - 86400000 * 4);
const fiveDaysAgo = new Date(today.getTime() - 86400000 * 5);
const oneWeekAgo = new Date(today.getTime() - 86400000 * 7);
const twoWeeksAgo = new Date(today.getTime() - 86400000 * 14);

const getRoom = (index: number): RoomDto | undefined => hotelRooms[index];

// ==================== MOCK GUESTS ====================
export const mockGuests: Record<string, GuestDto> = {
  // Nguyễn Văn An - Customer app mock user (CONSISTENT with customer app)
  'guest-nguyen-van-an': {
    id: 'guest-nguyen-van-an',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phoneNumber: '+84 912 345 678',
    idCardNumber: '079123456789',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  },
  // Other guests
  'guest-001': { id: 'guest-001', fullName: 'Nguyễn Văn Minh', email: 'minhnv@gmail.com', phoneNumber: '+84 901 234 567' },
  'guest-002': { id: 'guest-002', fullName: 'Trần Thị Hương', email: 'huongtt@gmail.com', phoneNumber: '+84 909 876 543' },
  'guest-003': { id: 'guest-003', fullName: 'John Smith', email: 'john.smith@gmail.com', phoneNumber: '+1 555 123 4567' },
  'guest-004': { id: 'guest-004', fullName: 'Lê Văn Bảo', email: 'baolv@gmail.com', phoneNumber: '+84 912 345 678' },
  'guest-005': { id: 'guest-005', fullName: 'Phạm Thị Mai', email: 'maipham@gmail.com', phoneNumber: '+84 908 765 432' },
  'guest-006': { id: 'guest-006', fullName: 'Hoàng Gia Bảo', email: 'baohoang@gmail.com', phoneNumber: '+84 903 456 789' },
  'guest-007': { id: 'guest-007', fullName: 'Võ Minh Tuấn', email: 'tuanvm@gmail.com', phoneNumber: '+84 905 111 222' },
  'guest-008': { id: 'guest-008', fullName: 'David Johnson', email: 'david.j@gmail.com', phoneNumber: '+44 7911 123456' },
  'guest-009': { id: 'guest-009', fullName: 'Ngô Thanh Tùng', email: 'tungngo@gmail.com', phoneNumber: '+84 906 789 012' },
  'guest-010': { id: 'guest-010', fullName: 'Maria Garcia', email: 'maria.g@gmail.com', phoneNumber: '+34 612 345 678' },
  'guest-011': { id: 'guest-011', fullName: 'Đỗ Văn Hải', email: 'haido@gmail.com', phoneNumber: '+84 907 654 321' },
  'guest-012': { id: 'guest-012', fullName: 'Kim Soo-Jin', email: 'soojin.kim@naver.com', phoneNumber: '+82 10 1234 5678' },
  'guest-013': { id: 'guest-013', fullName: 'Bùi Thị Lan', email: 'lanbui@gmail.com', phoneNumber: '+84 908 111 333' },
  'guest-014': { id: 'guest-014', fullName: 'Michael Brown', email: 'mike.brown@gmail.com', phoneNumber: '+1 415 555 1234' },
  'guest-015': { id: 'guest-015', fullName: 'Vũ Hoàng Nam', email: 'namvu@gmail.com', phoneNumber: '+84 909 222 444' },
  'guest-016': { id: 'guest-016', fullName: 'Sophie Chen', email: 'sophie.chen@gmail.com', phoneNumber: '+65 9123 4567' },
  'guest-017': { id: 'guest-017', fullName: 'Đinh Văn Long', email: 'longdinh@gmail.com', phoneNumber: '+84 910 333 555' },
  'guest-018': { id: 'guest-018', fullName: 'Yamamoto Kenji', email: 'kenji.y@gmail.com', phoneNumber: '+81 90 1234 5678' },
  'guest-019': { id: 'guest-019', fullName: 'Phan Thị Ngọc', email: 'ngocphan@gmail.com', phoneNumber: '+84 911 444 666' },
  'guest-020': { id: 'guest-020', fullName: 'Thomas Anderson', email: 'thomas.a@gmail.com', phoneNumber: '+49 170 1234567' },
};

// ==================== MOCK BOOKINGS ====================
// Consistent with customer app bookings for Nguyễn Văn An (booking-001 to booking-005)
export const mockBookings: BookingDto[] = [
  // ============ NGUYỄN VĂN AN BOOKINGS (5 bookings - matches customer app) ============

  // Booking 1: VNP-2024-001 - Confirmed (upcoming - 5 days from now)
  {
    id: 'booking-001',
    hotelId: HOTEL_INFO.id,
    hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VNP-2024-001',
    bookingCode: 'VNP-2024-001',
    guestId: 'guest-nguyen-van-an',
    guest: mockGuests['guest-nguyen-van-an'],
    guestName: 'Nguyễn Văn An',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: undefined,
    roomNumber: undefined,
    roomType: 'Deluxe',
    checkInDate: fiveDaysFromNow.toISOString(),
    checkOutDate: new Date(fiveDaysFromNow.getTime() + 86400000 * 3).toISOString(),
    status: 'Confirmed',
    totalAmount: 10500000,
    depositAmount: 10500000,
    paymentStatus: 'Paid',
    isPaid: true,
    specialRequests: 'Phòng view biển, giường King size.',
    bookedAt: twoDaysAgo.toISOString(),
    createdAt: twoDaysAgo.toISOString()
  },

  // Booking 2: Pending - Future booking (30+ days)
  {
    id: 'booking-005',
    hotelId: HOTEL_INFO.id,
    hotelName: HOTEL_INFO.name,
    confirmationNumber: 'MVC-2024-005',
    bookingCode: 'MVC-2024-005',
    guestId: 'guest-nguyen-van-an',
    guest: mockGuests['guest-nguyen-van-an'],
    guestName: 'Nguyễn Văn An',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: undefined,
    roomNumber: undefined,
    roomType: 'Suite',
    checkInDate: new Date(today.getTime() + 86400000 * 30).toISOString(),
    checkOutDate: new Date(today.getTime() + 86400000 * 35).toISOString(),
    status: 'Pending',
    totalAmount: 15400000,
    depositAmount: 0,
    paymentStatus: 'Unpaid',
    isPaid: false,
    specialRequests: 'View biển, bồn tắm.',
    bookedAt: today.toISOString(),
    createdAt: today.toISOString()
  },

  // Booking 3: CheckedIn - Currently staying (yesterday to +2 days)
  {
    id: 'bk-vp-an-current',
    hotelId: HOTEL_INFO.id,
    hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VPAN2601',
    bookingCode: 'VPAN2601',
    guestId: 'guest-nguyen-van-an',
    guest: mockGuests['guest-nguyen-van-an'],
    guestName: 'Nguyễn Văn An',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: getRoom(2)?.id,
    roomNumber: getRoom(2)?.roomNumber,
    roomType: 'Deluxe',
    checkInDate: yesterday.toISOString(),
    checkOutDate: dayAfterTomorrow.toISOString(),
    status: 'CheckedIn',
    actualCheckInDate: yesterday.toISOString(),
    totalAmount: 6750000,
    depositAmount: 6750000,
    paymentStatus: 'Paid',
    isPaid: true,
    specialRequests: 'Anniversary trip.',
    bookedAt: fiveDaysAgo.toISOString(),
    createdAt: fiveDaysAgo.toISOString()
  },

  // Booking 4: CheckedOut - Past stay (2 weeks ago)
  {
    id: 'booking-003',
    hotelId: HOTEL_INFO.id,
    hotelName: HOTEL_INFO.name,
    confirmationNumber: 'MEL-2024-003',
    bookingCode: 'MEL-2024-003',
    guestId: 'guest-nguyen-van-an',
    guest: mockGuests['guest-nguyen-van-an'],
    guestName: 'Nguyễn Văn An',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: getRoom(0)?.id,
    roomNumber: getRoom(0)?.roomNumber,
    roomType: 'Deluxe',
    checkInDate: new Date(today.getTime() - 86400000 * 20).toISOString(),
    checkOutDate: new Date(today.getTime() - 86400000 * 17).toISOString(),
    status: 'CheckedOut',
    actualCheckInDate: new Date(today.getTime() - 86400000 * 20).toISOString(),
    actualCheckOutDate: new Date(today.getTime() - 86400000 * 17).toISOString(),
    totalAmount: 10560000,
    depositAmount: 10560000,
    paymentStatus: 'Paid',
    isPaid: true,
    specialRequests: 'Honeymoon setup.',
    bookedAt: new Date(today.getTime() - 86400000 * 30).toISOString(),
    createdAt: new Date(today.getTime() - 86400000 * 30).toISOString()
  },

  // Booking 5: Cancelled
  {
    id: 'booking-004',
    hotelId: HOTEL_INFO.id,
    hotelName: HOTEL_INFO.name,
    confirmationNumber: 'MTH-2024-004',
    bookingCode: 'MTH-2024-004',
    guestId: 'guest-nguyen-van-an',
    guest: mockGuests['guest-nguyen-van-an'],
    guestName: 'Nguyễn Văn An',
    numberOfGuests: 2,
    numberOfRooms: 1,
    roomId: undefined,
    roomNumber: undefined,
    roomType: 'Deluxe',
    checkInDate: twoDaysAgo.toISOString(),
    checkOutDate: today.toISOString(),
    status: 'Cancelled',
    totalAmount: 3520000,
    depositAmount: 3520000,
    paymentStatus: 'Paid',
    isPaid: true,
    bookedAt: fiveDaysAgo.toISOString(),
    createdAt: fiveDaysAgo.toISOString()
  },

  // ============ PENDING BOOKINGS (5 bookings) ============
  {
    id: 'bk-vp-p01',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601P01', bookingCode: 'VP2601P01',
    guestId: 'guest-001', guest: mockGuests['guest-001'], guestName: 'Nguyễn Văn Minh',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Deluxe',
    checkInDate: today.toISOString(),
    checkOutDate: dayAfterTomorrow.toISOString(),
    status: 'Pending',
    totalAmount: 4500000, depositAmount: 1000000, paymentStatus: 'Partial', isPaid: false,
    specialRequests: 'Phòng view biển, tầng cao',
    bookedAt: yesterday.toISOString(), createdAt: yesterday.toISOString()
  },
  {
    id: 'bk-vp-p02',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601P02', bookingCode: 'VP2601P02',
    guestId: 'guest-002', guest: mockGuests['guest-002'], guestName: 'Trần Thị Hương',
    numberOfGuests: 4, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Family',
    checkInDate: tomorrow.toISOString(),
    checkOutDate: new Date(tomorrow.getTime() + 86400000 * 3).toISOString(),
    status: 'Pending',
    totalAmount: 9000000, depositAmount: 0, paymentStatus: 'Unpaid', isPaid: false,
    bookedAt: today.toISOString(), createdAt: today.toISOString()
  },
  {
    id: 'bk-vp-p03',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601P03', bookingCode: 'VP2601P03',
    guestId: 'guest-008', guest: mockGuests['guest-008'], guestName: 'David Johnson',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Suite',
    checkInDate: dayAfterTomorrow.toISOString(),
    checkOutDate: fiveDaysFromNow.toISOString(),
    status: 'Pending',
    totalAmount: 13500000, depositAmount: 5000000, paymentStatus: 'Partial', isPaid: false,
    specialRequests: 'Airport pickup needed',
    bookedAt: today.toISOString(), createdAt: today.toISOString()
  },
  {
    id: 'bk-vp-p04',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601P04', bookingCode: 'VP2601P04',
    guestId: 'guest-012', guest: mockGuests['guest-012'], guestName: 'Kim Soo-Jin',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Deluxe',
    checkInDate: threeDaysFromNow.toISOString(),
    checkOutDate: new Date(threeDaysFromNow.getTime() + 86400000 * 4).toISOString(),
    status: 'Pending',
    totalAmount: 9000000, depositAmount: 0, paymentStatus: 'Unpaid', isPaid: false,
    bookedAt: yesterday.toISOString(), createdAt: yesterday.toISOString()
  },
  {
    id: 'bk-vp-p05',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601P05', bookingCode: 'VP2601P05',
    guestId: 'guest-018', guest: mockGuests['guest-018'], guestName: 'Yamamoto Kenji',
    numberOfGuests: 1, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Standard',
    checkInDate: fiveDaysFromNow.toISOString(),
    checkOutDate: new Date(fiveDaysFromNow.getTime() + 86400000 * 2).toISOString(),
    status: 'Pending',
    totalAmount: 2400000, depositAmount: 0, paymentStatus: 'Unpaid', isPaid: false,
    bookedAt: today.toISOString(), createdAt: today.toISOString()
  },

  // ============ CONFIRMED BOOKINGS (5 bookings) ============
  {
    id: 'bk-vp-c01',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601C01', bookingCode: 'VP2601C01',
    guestId: 'guest-003', guest: mockGuests['guest-003'], guestName: 'John Smith',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Suite',
    checkInDate: today.toISOString(),
    checkOutDate: new Date(today.getTime() + 86400000 * 4).toISOString(),
    status: 'Confirmed',
    totalAmount: 18000000, depositAmount: 9000000, paymentStatus: 'Partial', isPaid: false,
    specialRequests: 'Honeymoon package, champagne on arrival',
    bookedAt: twoDaysAgo.toISOString(), createdAt: twoDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-c02',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601C02', bookingCode: 'VP2601C02',
    guestId: 'guest-010', guest: mockGuests['guest-010'], guestName: 'Maria Garcia',
    numberOfGuests: 3, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Family',
    checkInDate: tomorrow.toISOString(),
    checkOutDate: new Date(tomorrow.getTime() + 86400000 * 5).toISOString(),
    status: 'Confirmed',
    totalAmount: 15000000, depositAmount: 15000000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-c03',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601C03', bookingCode: 'VP2601C03',
    guestId: 'guest-014', guest: mockGuests['guest-014'], guestName: 'Michael Brown',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Deluxe',
    checkInDate: today.toISOString(),
    checkOutDate: threeDaysFromNow.toISOString(),
    status: 'Confirmed',
    totalAmount: 6750000, depositAmount: 6750000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: fourDaysAgo.toISOString(), createdAt: fourDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-c04',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601C04', bookingCode: 'VP2601C04',
    guestId: 'guest-016', guest: mockGuests['guest-016'], guestName: 'Sophie Chen',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Suite',
    checkInDate: dayAfterTomorrow.toISOString(),
    checkOutDate: fiveDaysFromNow.toISOString(),
    status: 'Confirmed',
    totalAmount: 13500000, depositAmount: 13500000, paymentStatus: 'Paid', isPaid: true,
    specialRequests: 'Late check-in around 10pm',
    bookedAt: twoDaysAgo.toISOString(), createdAt: twoDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-c05',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601C05', bookingCode: 'VP2601C05',
    guestId: 'guest-020', guest: mockGuests['guest-020'], guestName: 'Thomas Anderson',
    numberOfGuests: 1, numberOfRooms: 1,
    roomId: undefined, roomNumber: undefined, roomType: 'Standard',
    checkInDate: threeDaysFromNow.toISOString(),
    checkOutDate: new Date(threeDaysFromNow.getTime() + 86400000 * 7).toISOString(),
    status: 'Confirmed',
    totalAmount: 8400000, depositAmount: 4000000, paymentStatus: 'Partial', isPaid: false,
    bookedAt: oneWeekAgo.toISOString(), createdAt: oneWeekAgo.toISOString()
  },

  // ============ CHECKED IN BOOKINGS (8 bookings) ============
  {
    id: 'bk-vp-ci01',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI01', bookingCode: 'VP2601CI01',
    guestId: 'guest-004', guest: mockGuests['guest-004'], guestName: 'Lê Văn Bảo',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(3)?.id, roomNumber: getRoom(3)?.roomNumber, roomType: 'Deluxe',
    checkInDate: yesterday.toISOString(), checkOutDate: tomorrow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: yesterday.toISOString(),
    totalAmount: 4500000, depositAmount: 4500000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-ci02',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI02', bookingCode: 'VP2601CI02',
    guestId: 'guest-005', guest: mockGuests['guest-005'], guestName: 'Phạm Thị Mai',
    numberOfGuests: 3, numberOfRooms: 1,
    roomId: getRoom(5)?.id, roomNumber: getRoom(5)?.roomNumber, roomType: 'Standard',
    checkInDate: twoDaysAgo.toISOString(), checkOutDate: today.toISOString(), // Checkout TODAY
    status: 'CheckedIn', actualCheckInDate: twoDaysAgo.toISOString(),
    totalAmount: 2400000, depositAmount: 1200000, paymentStatus: 'Partial', isPaid: false,
    bookedAt: fiveDaysAgo.toISOString(), createdAt: fiveDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-ci03',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI03', bookingCode: 'VP2601CI03',
    guestId: 'guest-006', guest: mockGuests['guest-006'], guestName: 'Hoàng Gia Bảo',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(7)?.id, roomNumber: getRoom(7)?.roomNumber, roomType: 'Deluxe',
    checkInDate: threeDaysAgo.toISOString(), checkOutDate: dayAfterTomorrow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: threeDaysAgo.toISOString(),
    totalAmount: 11250000, depositAmount: 11250000, paymentStatus: 'Paid', isPaid: true,
    specialRequests: 'Extra pillows, daily spa service',
    bookedAt: oneWeekAgo.toISOString(), createdAt: oneWeekAgo.toISOString()
  },
  {
    id: 'bk-vp-ci04',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI04', bookingCode: 'VP2601CI04',
    guestId: 'guest-009', guest: mockGuests['guest-009'], guestName: 'Ngô Thanh Tùng',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(8)?.id, roomNumber: getRoom(8)?.roomNumber, roomType: 'Suite',
    checkInDate: fourDaysAgo.toISOString(), checkOutDate: tomorrow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: fourDaysAgo.toISOString(),
    totalAmount: 22500000, depositAmount: 22500000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: oneWeekAgo.toISOString(), createdAt: oneWeekAgo.toISOString()
  },
  {
    id: 'bk-vp-ci05',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI05', bookingCode: 'VP2601CI05',
    guestId: 'guest-011', guest: mockGuests['guest-011'], guestName: 'Đỗ Văn Hải',
    numberOfGuests: 4, numberOfRooms: 1,
    roomId: getRoom(10)?.id, roomNumber: getRoom(10)?.roomNumber, roomType: 'Family',
    checkInDate: twoDaysAgo.toISOString(), checkOutDate: threeDaysFromNow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: twoDaysAgo.toISOString(),
    totalAmount: 15000000, depositAmount: 15000000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: fiveDaysAgo.toISOString(), createdAt: fiveDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-ci06',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI06', bookingCode: 'VP2601CI06',
    guestId: 'guest-013', guest: mockGuests['guest-013'], guestName: 'Bùi Thị Lan',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(1)?.id, roomNumber: getRoom(1)?.roomNumber, roomType: 'Standard',
    checkInDate: yesterday.toISOString(), checkOutDate: today.toISOString(), // Checkout TODAY
    status: 'CheckedIn', actualCheckInDate: yesterday.toISOString(),
    totalAmount: 1200000, depositAmount: 800000, paymentStatus: 'Partial', isPaid: false,
    bookedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString()
  },
  {
    id: 'bk-vp-ci07',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI07', bookingCode: 'VP2601CI07',
    guestId: 'guest-015', guest: mockGuests['guest-015'], guestName: 'Vũ Hoàng Nam',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(9)?.id, roomNumber: getRoom(9)?.roomNumber, roomType: 'Deluxe',
    checkInDate: threeDaysAgo.toISOString(), checkOutDate: dayAfterTomorrow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: threeDaysAgo.toISOString(),
    totalAmount: 11250000, depositAmount: 11250000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: oneWeekAgo.toISOString(), createdAt: oneWeekAgo.toISOString()
  },
  {
    id: 'bk-vp-ci08',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2601CI08', bookingCode: 'VP2601CI08',
    guestId: 'guest-017', guest: mockGuests['guest-017'], guestName: 'Đinh Văn Long',
    numberOfGuests: 1, numberOfRooms: 1,
    roomId: getRoom(4)?.id, roomNumber: getRoom(4)?.roomNumber, roomType: 'Standard',
    checkInDate: yesterday.toISOString(), checkOutDate: tomorrow.toISOString(),
    status: 'CheckedIn', actualCheckInDate: yesterday.toISOString(),
    totalAmount: 2400000, depositAmount: 2400000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: fourDaysAgo.toISOString(), createdAt: fourDaysAgo.toISOString()
  },

  // ============ CHECKED OUT BOOKINGS (5 bookings) ============
  {
    id: 'bk-vp-co01',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2501CO01', bookingCode: 'VP2501CO01',
    guestId: 'guest-007', guest: mockGuests['guest-007'], guestName: 'Võ Minh Tuấn',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(0)?.id, roomNumber: getRoom(0)?.roomNumber, roomType: 'Standard',
    checkInDate: fourDaysAgo.toISOString(), checkOutDate: yesterday.toISOString(),
    status: 'CheckedOut', actualCheckInDate: fourDaysAgo.toISOString(), actualCheckOutDate: yesterday.toISOString(),
    totalAmount: 4800000, depositAmount: 4800000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: twoWeeksAgo.toISOString(), createdAt: twoWeeksAgo.toISOString()
  },
  {
    id: 'bk-vp-co02',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2501CO02', bookingCode: 'VP2501CO02',
    guestId: 'guest-019', guest: mockGuests['guest-019'], guestName: 'Phan Thị Ngọc',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(6)?.id, roomNumber: getRoom(6)?.roomNumber, roomType: 'Deluxe',
    checkInDate: fiveDaysAgo.toISOString(), checkOutDate: twoDaysAgo.toISOString(),
    status: 'CheckedOut', actualCheckInDate: fiveDaysAgo.toISOString(), actualCheckOutDate: twoDaysAgo.toISOString(),
    totalAmount: 6750000, depositAmount: 6750000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: oneWeekAgo.toISOString(), createdAt: oneWeekAgo.toISOString()
  },
  {
    id: 'bk-vp-co03',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2501CO03', bookingCode: 'VP2501CO03',
    guestId: 'guest-008', guest: mockGuests['guest-008'], guestName: 'David Johnson',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(11)?.id, roomNumber: getRoom(11)?.roomNumber, roomType: 'Suite',
    checkInDate: oneWeekAgo.toISOString(), checkOutDate: fourDaysAgo.toISOString(),
    status: 'CheckedOut', actualCheckInDate: oneWeekAgo.toISOString(), actualCheckOutDate: fourDaysAgo.toISOString(),
    totalAmount: 13500000, depositAmount: 13500000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: twoWeeksAgo.toISOString(), createdAt: twoWeeksAgo.toISOString()
  },
  {
    id: 'bk-vp-co04',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2501CO04', bookingCode: 'VP2501CO04',
    guestId: 'guest-010', guest: mockGuests['guest-010'], guestName: 'Maria Garcia',
    numberOfGuests: 3, numberOfRooms: 1,
    roomId: getRoom(12)?.id, roomNumber: getRoom(12)?.roomNumber, roomType: 'Family',
    checkInDate: twoWeeksAgo.toISOString(), checkOutDate: oneWeekAgo.toISOString(),
    status: 'CheckedOut', actualCheckInDate: twoWeeksAgo.toISOString(), actualCheckOutDate: oneWeekAgo.toISOString(),
    totalAmount: 21000000, depositAmount: 21000000, paymentStatus: 'Paid', isPaid: true,
    bookedAt: new Date(today.getTime() - 86400000 * 21).toISOString(), createdAt: new Date(today.getTime() - 86400000 * 21).toISOString()
  },
  {
    id: 'bk-vp-co05',
    hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
    confirmationNumber: 'VP2501CO05', bookingCode: 'VP2501CO05',
    guestId: 'guest-003', guest: mockGuests['guest-003'], guestName: 'John Smith',
    numberOfGuests: 2, numberOfRooms: 1,
    roomId: getRoom(8)?.id, roomNumber: getRoom(8)?.roomNumber, roomType: 'Suite',
    checkInDate: new Date(today.getTime() - 86400000 * 10).toISOString(), checkOutDate: fiveDaysAgo.toISOString(),
    status: 'CheckedOut', actualCheckInDate: new Date(today.getTime() - 86400000 * 10).toISOString(), actualCheckOutDate: fiveDaysAgo.toISOString(),
    totalAmount: 22500000, depositAmount: 22500000, paymentStatus: 'Paid', isPaid: true,
    specialRequests: 'First visit to Vietnam',
    bookedAt: new Date(today.getTime() - 86400000 * 15).toISOString(), createdAt: new Date(today.getTime() - 86400000 * 15).toISOString()
  },
];

// Available rooms helper
const getAvailableRoomsFromMock = (): { id: string; number: string; type: string; price: number; capacity: number; image: string }[] => {
  return hotelRooms
    .filter((r: RoomDto) => r.status === 'Available')
    .map((r: RoomDto) => ({
      id: r.id,
      number: r.roomNumber,
      type: r.type,
      price: r.basePrice,
      capacity: r.maxOccupancy,
      image: r.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300'
    }));
};

let _bookingsData = [...mockBookings];

export const receptionService = {
  getBookings: async (hotelId: string): Promise<BookingDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [..._bookingsData];
  },

  getBookingDetail: async (id: string): Promise<BookingDto | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return _bookingsData.find(b => b.id === id);
  },

  confirmBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = _bookingsData.findIndex(b => b.id === id);
    if (index !== -1) _bookingsData[index] = { ..._bookingsData[index], status: 'Confirmed' };
  },

  checkIn: async (id: string, roomId?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = _bookingsData.findIndex(b => b.id === id);
    if (index !== -1) {
      const room = roomId ? hotelRooms.find((r: RoomDto) => r.id === roomId) : undefined;
      _bookingsData[index] = {
        ..._bookingsData[index],
        status: 'CheckedIn',
        actualCheckInDate: new Date().toISOString(),
        roomId: roomId || _bookingsData[index].roomId,
        roomNumber: room?.roomNumber || _bookingsData[index].roomNumber
      };
    }
  },

  calculateLateCheckout: async (id: string, checkoutTime: string): Promise<LateCheckoutCalculation> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const booking = _bookingsData.find(b => b.id === id);
    const hoursLate = Math.ceil((new Date(checkoutTime).getTime() - new Date(booking?.checkOutDate || '').getTime()) / 3600000);
    return { hoursLate: Math.max(0, hoursLate), penaltyPercentage: hoursLate > 2 ? 50 : 30, penaltyAmount: hoursLate > 2 ? 750000 : 450000 };
  },

  checkOut: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const index = _bookingsData.findIndex(b => b.id === id);
    if (index !== -1) {
      _bookingsData[index] = { ..._bookingsData[index], status: 'CheckedOut', actualCheckOutDate: new Date().toISOString(), paymentStatus: 'Paid', isPaid: true };
    }
  },

  getCharges: async (bookingId: string): Promise<AdditionalChargeDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = _bookingsData.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'CheckedIn') return [];

    if (booking.guestId === 'guest-nguyen-van-an') {
      return [
        { id: 'c-an-1', bookingId, name: 'Minibar - Coca Cola', amount: 35000, quantity: 2, createdAt: new Date().toISOString() },
        { id: 'c-an-2', bookingId, name: 'Room Service - Anniversary Cake', amount: 450000, quantity: 1, createdAt: new Date().toISOString() },
        { id: 'c-an-3', bookingId, name: 'Spa - Couples Massage 90min', amount: 1500000, quantity: 1, createdAt: new Date().toISOString() },
        { id: 'c-an-4', bookingId, name: 'Champagne - Moet & Chandon', amount: 2500000, quantity: 1, createdAt: new Date().toISOString() }
      ];
    }
    return [
      { id: `c-${bookingId}-1`, bookingId, name: 'Minibar - Coca Cola', amount: 35000, quantity: 2, createdAt: new Date().toISOString() },
      { id: `c-${bookingId}-2`, bookingId, name: 'Room Service - Breakfast', amount: 250000, quantity: 1, createdAt: new Date().toISOString() }
    ];
  },

  addCharge: async (charge: Partial<AdditionalChargeDto>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = _bookingsData.findIndex(b => b.id === id);
    if (index !== -1) _bookingsData[index] = { ..._bookingsData[index], status: 'Cancelled' };
  },

  getAvailableRooms: async (hotelId: string, filter: { checkIn: string; checkOut: string; type?: string }): Promise<{ id: string; number: string; type: string; price: number; capacity: number; image: string }[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    let rooms = getAvailableRoomsFromMock();
    if (filter.type) rooms = rooms.filter((r: { type: string }) => r.type === filter.type);
    return rooms;
  },

  createBooking: async (data: CreateBookingDto): Promise<BookingDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const roomInfo = data.rooms?.[0];
    const room = roomInfo?.roomId ? hotelRooms.find((r: RoomDto) => r.id === roomInfo.roomId) : undefined;
    const newBooking: BookingDto = {
      id: `bk-vp-${Date.now()}`,
      hotelId: HOTEL_INFO.id, hotelName: HOTEL_INFO.name,
      confirmationNumber: `VP${new Date().getFullYear().toString().slice(-2)}${String(_bookingsData.length + 1).padStart(4, '0')}`,
      bookingCode: `VP${Date.now().toString().slice(-6)}`,
      guestId: `guest-${Date.now()}`,
      guest: { id: `guest-${Date.now()}`, fullName: data.guestName || 'Walk-in Guest', email: data.guestEmail || '', phoneNumber: data.guestPhoneNumber || '' },
      guestName: data.guestName || 'Walk-in Guest',
      numberOfGuests: (roomInfo?.numberOfAdults || 1) + (roomInfo?.numberOfChildren || 0),
      numberOfRooms: data.rooms?.length || 1,
      roomId: roomInfo?.roomId, roomNumber: room?.roomNumber, roomType: room?.type || 'Standard',
      checkInDate: data.checkInDate, checkOutDate: data.checkOutDate,
      status: 'CheckedIn', actualCheckInDate: new Date().toISOString(),
      totalAmount: room ? room.basePrice : 0, depositAmount: room ? room.basePrice : 0,
      paymentStatus: 'Paid', isPaid: true, specialRequests: data.specialRequests,
      bookedAt: new Date().toISOString(), createdAt: new Date().toISOString()
    };
    _bookingsData.unshift(newBooking);
    return newBooking;
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      total: _bookingsData.length,
      pending: _bookingsData.filter(b => b.status === 'Pending').length,
      confirmed: _bookingsData.filter(b => b.status === 'Confirmed').length,
      checkedIn: _bookingsData.filter(b => b.status === 'CheckedIn').length,
      checkedOut: _bookingsData.filter(b => b.status === 'CheckedOut').length,
      cancelled: _bookingsData.filter(b => b.status === 'Cancelled').length,
      todayCheckIns: _bookingsData.filter(b => new Date(b.checkInDate).toDateString() === new Date().toDateString() && (b.status === 'Pending' || b.status === 'Confirmed')).length,
      todayCheckOuts: _bookingsData.filter(b => new Date(b.checkOutDate).toDateString() === new Date().toDateString() && b.status === 'CheckedIn').length
    };
  },

  getGuest: async (guestId: string): Promise<GuestDto | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockGuests[guestId];
  }
};
