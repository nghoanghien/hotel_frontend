import type { BookingDetailDto } from "@repo/types";

export const mockBookingHistory: BookingDetailDto[] = [
  {
    id: "booking-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1000 * 60 * 30).toISOString(), // 30 mins after booking
    hotelId: "hotel-1",
    hotelName: "Sunset Paradise Resort",
    hotelImageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    hotelAddress: "123 Đường Trần Phú, Phường Lộc Thọ",
    hotelCity: "Nha Trang",
    hotelPhoneNumber: "+84 258 352 1001",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-001",
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 4500000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true,
    subtotal: 4000000,
    taxAmount: 400000,
    serviceFee: 100000,
    discountAmount: 0,
    cancellationPolicy: "Free cancellation until 48 hours before check-in.",
    specialRequests: "Large bed requested. Late check-in expected.",
    appliedCouponCode: "SUMMER10",
    rooms: [
      {
        id: "detail-room-1",
        roomId: "room-101",
        roomType: "Standard",
        roomNumber: "101",
        price: 1500000, // per night approx
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0,
        guestName: "Nguyen Van A",
        specialRequests: "Quiet room please"
      }
    ],
    payments: [
      {
        id: "payment-1",
        amount: 4500000,
        method: "CreditCard",
        status: "Completed",
        transactionId: "TXN_123456789",
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "booking-002",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 1000 * 60 * 15).toISOString(),
    hotelId: "hotel-3",
    hotelName: "Mountain View Lodge",
    hotelImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    hotelAddress: "78 Đường Trần Hưng Đạo, P. 4",
    hotelCity: "Đà Lạt",
    hotelPhoneNumber: "+84 263 382 2002",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-002",
    checkInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 4,
    numberOfRooms: 1,
    totalAmount: 5400000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true,
    subtotal: 5000000,
    taxAmount: 300000,
    serviceFee: 100000,
    discountAmount: 0,
    cancellationPolicy: "Non-refundable booking.",
    specialRequests: "Airport shuttle service needed.",
    rooms: [
      {
        id: "detail-room-2",
        roomId: "room-401",
        roomType: "Suite",
        roomNumber: "401",
        price: 1800000,
        numberOfAdults: 4,
        numberOfChildren: 0,
        numberOfInfants: 0,
        guestName: "Nguyen Van A & Family",
        specialRequests: "Extra towels"
      }
    ],
    payments: [
      {
        id: "payment-2",
        amount: 5400000,
        method: "BankTransfer",
        status: "Completed",
        transactionId: "IB_987654321",
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "booking-003",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    checkedInAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 1000 * 60 * 60 * 14).toISOString(), // 14:00
    checkedOutAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000 + 1000 * 60 * 60 * 11).toISOString(), // 11:00
    hotelId: "hotel-2",
    hotelName: "Golden Bay Hotel",
    hotelImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    hotelAddress: "45 Võ Nguyên Giáp, P. Mỹ An",
    hotelCity: "Đà Nẵng",
    hotelPhoneNumber: "+84 236 387 3003",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-003",
    checkInDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 6600000,
    status: "CheckedOut",
    isPaid: true,
    subtotal: 6000000,
    taxAmount: 400000,
    serviceFee: 200000,
    discountAmount: 0,
    cancellationPolicy: "Free cancellation until 24 hours before check-in.",
    specialRequests: "Honeymoon setup.",
    rooms: [
      {
        id: "detail-room-3",
        roomId: "room-301",
        roomType: "Deluxe",
        roomNumber: "305",
        price: 2200000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0,
        guestName: "Nguyen Van A",
        specialRequests: "Rose petals on bed"
      }
    ],
    review: {
      id: "review-003",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      hotelId: "hotel-2",
      guestId: "user-1",
      guestName: "Nguyen Van A",
      rating: 5,
      title: "Exceptional Stay!",
      comment: "The honeymoon setup was perfect. Staff was incredibly helpful. Highly recommended for couples.",
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 4,
      valueRating: 5,
      isVerified: true,
      stayDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      images: []
    },
    payments: [
      {
        id: "payment-3",
        amount: 6600000,
        method: "Cash",
        status: "Completed",
        paidAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() // Paid at check-in
      }
    ]
  },
  {
    id: "booking-004",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: "hotel-2",
    hotelName: "Golden Bay Hotel",
    hotelImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    hotelAddress: "45 Võ Nguyên Giáp, P. Mỹ An",
    hotelCity: "Đà Nẵng",
    hotelPhoneNumber: "+84 236 387 3003",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-004",
    checkInDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date().toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 2200000,
    status: "Cancelled",
    isPaid: false, // Originally paid, then refunded
    subtotal: 2000000,
    taxAmount: 200000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: "Free cancellation until 48 hours before check-in.",
    specialRequests: "Non-smoking room, high floor please.",
    rooms: [
      {
        id: "detail-room-4",
        roomId: "room-301",
        roomType: "Deluxe",
        price: 1100000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: [
      {
        id: "payment-4",
        amount: 2200000,
        method: "EWallet",
        status: "Refunded",
        transactionId: "MOMO_12345678",
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        refundedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Refunded 1 day later
        refundAmount: 2200000,
        refundReason: "User requested cancellation"
      }
    ]
  },
  {
    id: "booking-005",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    confirmedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    checkedInAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    checkedOutAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
    hotelId: "hotel-5",
    hotelName: "Urban Chic Boutique",
    hotelImageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    hotelAddress: "22 Nguyễn Huệ, Quận 1",
    hotelCity: "Hồ Chí Minh",
    hotelPhoneNumber: "+84 28 3822 0005",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-005",
    checkInDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 3800000,
    status: "CheckedOut",
    isPaid: true,
    subtotal: 3500000,
    taxAmount: 300000,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: "Free cancellation until 24 hours.",
    specialRequests: "",
    rooms: [
      {
        id: "detail-room-5",
        roomId: "room-501",
        roomType: "Deluxe",
        roomNumber: "505",
        price: 1200000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: [
      {
        id: "payment-5",
        amount: 3800000,
        method: "CreditCard",
        status: "Completed",
        transactionId: "TXN_999000111",
        paidAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    // No review property -> Should show "Write a Review"
  },
  {
    id: "booking-006",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: "hotel-6",
    hotelName: "Sapa Mist Retreat",
    hotelImageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    hotelAddress: "05 Mường Hoa, Sa Pa",
    hotelCity: "Lào Cai",
    hotelPhoneNumber: "+84 214 387 1111",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    guestEmail: "nguyen.vana@example.com",
    confirmationNumber: "HBZ-2024-006",
    checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 1500000,
    status: "Cancelled",
    isPaid: true,
    subtotal: 1500000,
    taxAmount: 0,
    serviceFee: 0,
    discountAmount: 0,
    cancellationPolicy: "Non-refundable.",
    specialRequests: "",
    rooms: [
      {
        id: "detail-room-6",
        roomId: "room-601",
        roomType: "Standard",
        price: 750000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: [
      {
        id: "payment-6",
        amount: 1500000,
        method: "EWallet",
        status: "Completed",
        transactionId: "MOMO_555444333",
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    // Cancelled, Paid, No Refund Payment -> Should show Completed payment, no refund info in payment card.
  }
];

export const getBookingHistory = () => mockBookingHistory;

export const getUpcomingBookings = () =>
  mockBookingHistory.filter(b => b.status === "Confirmed" || b.status === "Pending");

export const getPastBookings = () =>
  mockBookingHistory.filter(b => b.status === "CheckedOut" || b.status === "Cancelled" || b.status === "Refunded" || b.status === "NoShow");
