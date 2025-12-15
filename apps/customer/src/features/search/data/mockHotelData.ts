import type { Hotel, Amenity, RoomType, HotelSearchFilters } from '@repo/types';

const commonAmenities: Record<string, Amenity> = {
  wifi: { id: 'wifi', name: 'WiFi miễn phí' },
  pool: { id: 'pool', name: 'Hồ bơi' },
  restaurant: { id: 'restaurant', name: 'Nhà hàng' },
  bar: { id: 'bar', name: 'Quầy bar' },
  spa: { id: 'spa', name: 'Spa & Massage' },
  gym: { id: 'gym', name: 'Phòng gym' },
  parking: { id: 'parking', name: 'Bãi đỗ xe' },
  airport: { id: 'airport', name: 'Đưa đón sân bay' },
  breakfast: { id: 'breakfast', name: 'Ăn sáng' },
  beachVolley: { id: 'beachVolley', name: 'Bóng chuyền bãi biển' },
  bikeRent: { id: 'bikeRent', name: 'Cho thuê xe đạp' },
  motoRent: { id: 'motoRent', name: 'Cho thuê xe máy' },
  rooftop: { id: 'rooftop', name: 'Sân thượng' },
  laundry: { id: 'laundry', name: 'Giặt ủi' },
  concierge: { id: 'concierge', name: 'Lễ tân 24/7' }
};

export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Sunset Paradise Resort',
    slug: 'sunset-paradise-resort-1',
    categories: [{ id: 'resort', name: 'Resort', slug: 'resort' }],
    status: 'ACTIVE',
    rating: 5,
    reviewCount: 2847,
    address: {
      streetNumber: '123',
      streetName: 'Đường Trần Phú',
      ward: 'Phường Lộc Thọ',
      district: 'Thành phố Nha Trang',
      city: 'Khánh Hòa',
      fullAddress: '123 Đường Trần Phú, Phường Lộc Thọ, Tp. Nha Trang, Khánh Hòa'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.spa, commonAmenities.gym, commonAmenities.airport,
      commonAmenities.breakfast, commonAmenities.beachVolley, commonAmenities.bikeRent
    ],
    roomTypes: [
      {
        id: 'room-1-1',
        name: 'Deluxe Ocean View',
        hotelId: 'hotel-1',
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
        ],
        area: 35,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV LCD' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'shower', name: 'Vòi sen' },
          { id: 'balcony', name: 'Ban công' }
        ],
        maxGuests: 2,
        price: 1500000,
        availableRooms: 5
      },
      {
        id: 'room-1-2',
        name: 'Premium Suite',
        hotelId: 'hotel-1',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
        ],
        area: 55,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'livingroom', name: 'Phòng khách' }
        ],
        maxGuests: 3,
        price: 2800000,
        availableRooms: 3
      },
      {
        id: 'room-1-3',
        name: 'Superior Double',
        hotelId: 'hotel-1',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
        ],
        area: 30,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV LCD' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'shower', name: 'Vòi sen' }
        ],
        maxGuests: 2,
        price: 1200000,
        availableRooms: 8
      },
      {
        id: 'room-1-4',
        name: 'Family Ocean View',
        hotelId: 'hotel-1',
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        area: 50,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'balcony', name: 'Ban công view biển' }
        ],
        maxGuests: 4,
        price: 2200000,
        availableRooms: 4
      },
      {
        id: 'room-1-5',
        name: 'Presidential Suite',
        hotelId: 'hotel-1',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
        ],
        area: 85,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV 65"' },
          { id: 'minibar', name: 'Minibar cao cấp' },
          { id: 'bathtub', name: 'Bồn tắm Jacuzzi' },
          { id: 'livingroom', name: 'Phòng khách riêng' },
          { id: 'balcony', name: 'Ban công lớn view biển' }
        ],
        maxGuests: 4,
        price: 4500000,
        availableRooms: 2
      }
    ],
    description: 'Resort sang trọng với view biển tuyệt đẹp, đầy đủ tiện nghi hiện đại'
  },
  {
    id: 'hotel-2',
    name: 'Golden Bay Hotel',
    slug: 'golden-bay-hotel-2',
    categories: [{ id: 'hotel', name: 'Khách sạn', slug: 'hotel' }],
    status: 'ACTIVE',
    rating: 4,
    reviewCount: 1523,
    address: {
      streetNumber: '45',
      streetName: 'Võ Nguyên Giáp',
      ward: 'Phường Mỹ An',
      district: 'Quận Ngũ Hành Sơn',
      city: 'Đà Nẵng',
      fullAddress: '45 Võ Nguyên Giáp, P. Mỹ An, Q. Ngũ Hành Sơn, Đà Nẵng'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.bar, commonAmenities.gym, commonAmenities.parking,
      commonAmenities.breakfast, commonAmenities.laundry
    ],
    roomTypes: [
      {
        id: 'room-2-1',
        name: 'Superior Double',
        hotelId: 'hotel-2',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        area: 28,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV' },
          { id: 'fridge', name: 'Tủ lạnh' },
          { id: 'shower', name: 'Vòi sen nước nóng' }
        ],
        maxGuests: 2,
        price: 900000,
        availableRooms: 8
      },
      {
        id: 'room-2-2',
        name: 'Family Room',
        hotelId: 'hotel-2',
        images: [
          'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800'
        ],
        area: 42,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV' },
          { id: 'fridge', name: 'Tủ lạnh' },
          { id: 'shower', name: 'Vòi sen' },
          { id: 'sofa', name: 'Sofa' }
        ],
        maxGuests: 4,
        price: 1600000,
        availableRooms: 4
      },
      {
        id: 'room-2-3',
        name: 'Deluxe Twin',
        hotelId: 'hotel-2',
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
        area: 32,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'fridge', name: 'Tủ lạnh' },
          { id: 'shower', name: 'Vòi sen' }
        ],
        maxGuests: 2,
        price: 1100000,
        availableRooms: 6
      },
      {
        id: 'room-2-4',
        name: 'Executive Suite',
        hotelId: 'hotel-2',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        area: 55,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'desk', name: 'Bàn làm việc' }
        ],
        maxGuests: 3,
        price: 2000000,
        availableRooms: 3
      },
      {
        id: 'room-2-5',
        name: 'Premium Ocean View',
        hotelId: 'hotel-2',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
        area: 45,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'balcony', name: 'Ban công view biển' }
        ],
        maxGuests: 3,
        price: 1800000,
        availableRooms: 5
      }
    ],
    description: 'Khách sạn 4 sao tiện nghi, gần biển Mỹ Khê'
  },
  {
    id: 'hotel-3',
    name: 'Mountain View Lodge',
    slug: 'mountain-view-lodge-3',
    categories: [{ id: 'lodge', name: 'Lodge', slug: 'lodge' }],
    status: 'ACTIVE',
    rating: 5,
    reviewCount: 892,
    address: {
      streetNumber: '78',
      streetName: 'Đường Trần Hưng Đạo',
      ward: 'Phường 4',
      district: 'Thành phố Đà Lạt',
      city: 'Lâm Đồng',
      fullAddress: '78 Đường Trần Hưng Đạo, P. 4, Tp. Đà Lạt, Lâm Đồng'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.bar,
      commonAmenities.parking, commonAmenities.breakfast, commonAmenities.bikeRent,
      commonAmenities.rooftop, commonAmenities.concierge
    ],
    roomTypes: [
      {
        id: 'room-3-1',
        name: 'Cozy Mountain Room',
        hotelId: 'hotel-3',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        area: 25,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'TV' },
          { id: 'shower', name: 'Vòi sen nước nóng' }
        ],
        maxGuests: 2,
        price: 1200000,
        availableRooms: 6
      },
      {
        id: 'room-3-2',
        name: 'Deluxe Mountain View',
        hotelId: 'hotel-3',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'],
        area: 32,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' }
        ],
        maxGuests: 2,
        price: 1600000,
        availableRooms: 4
      },
      {
        id: 'room-3-3',
        name: 'Family Suite',
        hotelId: 'hotel-3',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        area: 48,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'fireplace', name: 'Lò sưởi' }
        ],
        maxGuests: 4,
        price: 2200000,
        availableRooms: 3
      },
      {
        id: 'room-3-4',
        name: 'Superior Twin',
        hotelId: 'hotel-3',
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
        area: 28,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'TV' },
          { id: 'shower', name: 'Vòi sen' }
        ],
        maxGuests: 2,
        price: 1300000,
        availableRooms: 5
      },
      {
        id: 'room-3-5',
        name: 'Romantic Honeymoon Suite',
        hotelId: 'hotel-3',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
        area: 40,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'bathtub', name: 'Bồn tắm đôi' },
          { id: 'fireplace', name: 'Lò sưổi' },
          { id: 'balcony', name: 'Ban công view núi' }
        ],
        maxGuests: 2,
        price: 1900000,
        availableRooms: 2
      }
    ],
    description: 'Lodge ấm cúng giữa núi rừng Đà Lạt, view tuyệt đẹp'
  },
  {
    id: 'hotel-4',
    name: 'City Center Grand',
    slug: 'city-center-grand-4',
    categories: [{ id: 'hotel', name: 'Khách sạn', slug: 'hotel' }],
    status: 'ACTIVE',
    rating: 4,
    reviewCount: 2156,
    address: {
      streetNumber: '156',
      streetName: 'Đường Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      fullAddress: '156 Đường Nguyễn Huệ, P. Bến Nghé, Q. 1, TP.HCM'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.bar,
      commonAmenities.gym, commonAmenities.parking, commonAmenities.breakfast,
      commonAmenities.laundry, commonAmenities.concierge
    ],
    roomTypes: [
      {
        id: 'room-4-1',
        name: 'Business Room',
        hotelId: 'hotel-4',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
        ],
        area: 30,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'desk', name: 'Bàn làm việc' },
          { id: 'shower', name: 'Vòi sen' }
        ],
        maxGuests: 2,
        price: 1100000,
        availableRooms: 10
      },
      {
        id: 'room-4-2',
        name: 'Deluxe City View',
        hotelId: 'hotel-4',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        area: 35,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'desk', name: 'Bàn làm việc rộng' },
          { id: 'minibar', name: 'Minibar' }
        ],
        maxGuests: 2,
        price: 1400000,
        availableRooms: 8
      },
      {
        id: 'room-4-3',
        name: 'Executive Twin',
        hotelId: 'hotel-4',
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
        area: 38,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'desk', name: 'Bàn làm việc' },
          { id: 'bathtub', name: 'Bồn tắm' }
        ],
        maxGuests: 2,
        price: 1600000,
        availableRooms: 6
      },
      {
        id: 'room-4-4',
        name: 'Junior Suite',
        hotelId: 'hotel-4',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        area: 50,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV 55"' },
          { id: 'sofa', name: 'Sofa' },
          { id: 'bathtub', name: 'Bồn tắm' }
        ],
        maxGuests: 3,
        price: 2500000,
        availableRooms: 4
      },
      {
        id: 'room-4-5',
        name: 'Presidential Suite',
        hotelId: 'hotel-4',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
        area: 80,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV 65"' },
          { id: 'livingroom', name: 'Phòng khách riêng' },
          { id: 'kitchen', name: 'Bếp nhỏ' },
          { id: 'pano', name: 'View toàn cảnh' }
        ],
        maxGuests: 4,
        price: 5200000,
        availableRooms: 1
      }
    ],
    description: 'Khách sạn trung tâm thành phố, thuận tiện di chuyển'
  },
  {
    id: 'hotel-5',
    name: 'Seaside Boutique',
    slug: 'seaside-boutique-5',
    categories: [{ id: 'boutique', name: 'Boutique', slug: 'boutique' }],
    status: 'ACTIVE',
    rating: 5,
    reviewCount: 734,
    address: {
      streetNumber: '22',
      streetName: 'Phạm Văn Đồng',
      ward: 'Phường Thủy Dương',
      district: 'Thành phố Huế',
      city: 'Thừa Thiên Huế',
      fullAddress: '22 Phạm Văn Đồng, P. Thủy Dương, Tp. Huế, Thừa Thiên Huế'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.spa,
      commonAmenities.breakfast, commonAmenities.bikeRent, commonAmenities.concierge
    ],
    roomTypes: [
      {
        id: 'room-5-1',
        name: 'Boutique Suite',
        hotelId: 'hotel-5',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
        ],
        area: 40,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'bathtub', name: 'Bồn tắm' }
        ],
        maxGuests: 2,
        price: 1800000,
        availableRooms: 4
      },
      {
        id: 'room-5-2',
        name: 'Poolside Room',
        hotelId: 'hotel-5',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        area: 35,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV' },
          { id: 'pool', name: 'Lối ra hồ bơi' }
        ],
        maxGuests: 2,
        price: 2100000,
        availableRooms: 3
      },
      {
        id: 'room-5-3',
        name: 'Balcony Deluxe',
        hotelId: 'hotel-5',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        area: 38,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'balcony', name: 'Ban công' }
        ],
        maxGuests: 2,
        price: 1950000,
        availableRooms: 5
      },
      {
        id: 'room-5-4',
        name: 'Heritage Family',
        hotelId: 'hotel-5',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        area: 60,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV' },
          { id: 'sofa', name: 'Sofa bed' }
        ],
        maxGuests: 4,
        price: 3200000,
        availableRooms: 2
      },
      {
        id: 'room-5-5',
        name: 'Royal King Suite',
        hotelId: 'hotel-5',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        area: 75,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV 65"' },
          { id: 'bathtub', name: 'Bồn tắm lớn' },
          { id: 'terrace', name: 'Sân thượng riêng' }
        ],
        maxGuests: 2,
        price: 4500000,
        availableRooms: 1
      }
    ],
    description: 'Khách sạn boutique phong cách độc đáo, gần sông Hương'
  },
  {
    id: 'hotel-6',
    name: 'Highland Retreat',
    slug: 'highland-retreat-6',
    categories: [{ id: 'resort', name: 'Resort', slug: 'resort' }],
    status: 'ACTIVE',
    rating: 4,
    reviewCount: 1045,
    address: {
      streetNumber: '99',
      streetName: 'Đường Yersin',
      ward: 'Phường 10',
      district: 'Thành phố Đà Lạt',
      city: 'Lâm Đồng',
      fullAddress: '99 Đường Yersin, P. 10, Tp. Đà Lạt, Lâm Đồng'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.bar,
      commonAmenities.parking, commonAmenities.breakfast, commonAmenities.rooftop
    ],
    roomTypes: [
      {
        id: 'room-6-1',
        name: 'Garden View',
        hotelId: 'hotel-6',
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
        ],
        area: 32,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'tv', name: 'TV' }
        ],
        maxGuests: 2,
        price: 1400000,
        availableRooms: 7
      },
      {
        id: 'room-6-2',
        name: 'Pine Hill Bungalow',
        hotelId: 'hotel-6',
        images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'],
        area: 40,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'terrace', name: 'Hiên nhà' },
          { id: 'coffee', name: 'Máy pha cà phê' }
        ],
        maxGuests: 2,
        price: 1800000,
        availableRooms: 5
      },
      {
        id: 'room-6-3',
        name: 'Foggy Valley Suite',
        hotelId: 'hotel-6',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
        area: 55,
        amenities: [
          { id: 'fireplace', name: 'Lò sưởi' },
          { id: 'bathtub', name: 'Bồn tắm gỗ' },
          { id: 'balcony', name: 'Ban công thung lũng' }
        ],
        maxGuests: 2,
        price: 2500000,
        availableRooms: 3
      },
      {
        id: 'room-6-4',
        name: 'Family Villa',
        hotelId: 'hotel-6',
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        area: 80,
        amenities: [
          { id: 'kitchen', name: 'Bếp đầy đủ' },
          { id: 'livingroom', name: 'Phòng khách' },
          { id: 'bbq', name: 'Khu nướng BBQ' }
        ],
        maxGuests: 6,
        price: 4200000,
        availableRooms: 2
      },
      {
        id: 'room-6-5',
        name: 'Glamping Tent',
        hotelId: 'hotel-6',
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
        area: 25,
        amenities: [
          { id: 'heater', name: 'Máy sưởi' },
          { id: 'campfire', name: 'Lửa trại riêng' }
        ],
        maxGuests: 2,
        price: 1200000,
        availableRooms: 10
      }
    ],
    description: 'Resort nghỉ dưỡng cao nguyên, không khí trong lành'
  },
  {
    id: 'hotel-7',
    name: 'Pearl Island Resort',
    slug: 'pearl-island-resort-7',
    categories: [{ id: 'resort', name: 'Resort', slug: 'resort' }],
    status: 'ACTIVE',
    rating: 5,
    reviewCount: 3241,
    address: {
      streetNumber: '1',
      streetName: 'Bãi Trường',
      ward: 'Xã Dương Tơ',
      district: 'Thành phố Phú Quốc',
      city: 'Kiên Giang',
      fullAddress: '1 Bãi Trường, Xã Dương Tơ, Tp. Phú Quốc, Kiên Giang'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.bar, commonAmenities.spa, commonAmenities.gym,
      commonAmenities.airport, commonAmenities.breakfast, commonAmenities.beachVolley,
      commonAmenities.bikeRent, commonAmenities.motoRent
    ],
    roomTypes: [
      {
        id: 'room-7-1',
        name: 'Bungalow Beach',
        hotelId: 'hotel-7',
        images: [
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
        ],
        area: 45,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'terrace', name: 'Sân riêng' }
        ],
        maxGuests: 3,
        price: 3200000,
        availableRooms: 6
      },
      {
        id: 'room-7-2',
        name: 'Ocean Front Villa',
        hotelId: 'hotel-7',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
        area: 90,
        amenities: [
          { id: 'pool', name: 'Hồ bơi riêng' },
          { id: 'kitchen', name: 'Bếp' },
          { id: 'beach', name: 'Lối ra biển trực tiếp' }
        ],
        maxGuests: 4,
        price: 5800000,
        availableRooms: 3
      },
      {
        id: 'room-7-3',
        name: 'Garden Deluxe',
        hotelId: 'hotel-7',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        area: 40,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'shower', name: 'Vòi sen ngoài trời' },
          { id: 'garden', name: 'Vườn riêng' }
        ],
        maxGuests: 2,
        price: 2500000,
        availableRooms: 8
      },
      {
        id: 'room-7-4',
        name: 'Sunset Suite',
        hotelId: 'hotel-7',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        area: 55,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'jacuzzi', name: 'Bồn Jacuzzi ban công' },
          { id: 'view', name: 'View hoàng hôn' }
        ],
        maxGuests: 2,
        price: 3900000,
        availableRooms: 4
      },
      {
        id: 'room-7-5',
        name: 'Family Beach House',
        hotelId: 'hotel-7',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        area: 120,
        amenities: [
          { id: 'kitchen', name: 'Bếp đầy đủ' },
          { id: 'living', name: 'Phòng khách lớn' },
          { id: '3bed', name: '3 phòng ngủ' }
        ],
        maxGuests: 8,
        price: 8500000,
        availableRooms: 2
      }
    ],
    description: 'Resort đẳng cấp trên đảo ngọc Phú Quốc'
  },
  {
    id: 'hotel-8',
    name: 'Urban Loft Hotel',
    slug: 'urban-loft-hotel-8',
    categories: [{ id: 'hotel', name: 'Khách sạn', slug: 'hotel' }],
    status: 'ACTIVE',
    rating: 4,
    reviewCount: 987,
    address: {
      streetNumber: '234',
      streetName: 'Đường Lê Lợi',
      ward: 'Phường Bến Thành',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      fullAddress: '234 Đường Lê Lợi, P. Bến Thành, Q. 1, TP.HCM'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.gym,
      commonAmenities.parking, commonAmenities.breakfast, commonAmenities.laundry
    ],
    roomTypes: [
      {
        id: 'room-8-1',
        name: 'Modern Loft',
        hotelId: 'hotel-8',
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        area: 35,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'kitchenette', name: 'Bếp nhỏ' }
        ],
        maxGuests: 2,
        price: 1300000,
        availableRooms: 5
      },
      {
        id: 'room-8-2',
        name: 'City Studio',
        hotelId: 'hotel-8',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        area: 30,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'wifi', name: 'High-speed WiFi' },
          { id: 'desk', name: 'Bàn làm việc' }
        ],
        maxGuests: 2,
        price: 1100000,
        availableRooms: 10
      },
      {
        id: 'room-8-3',
        name: 'Artistic Suite',
        hotelId: 'hotel-8',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        area: 45,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'art', name: 'Decor nghệ thuật' },
          { id: 'sofa', name: 'Ghế thư giãn' }
        ],
        maxGuests: 2,
        price: 1600000,
        availableRooms: 4
      },
      {
        id: 'room-8-4',
        name: 'Minimalist Room',
        hotelId: 'hotel-8',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        area: 28,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'simple', name: 'Thiết kế tối giản' }
        ],
        maxGuests: 2,
        price: 950000,
        availableRooms: 8
      },
      {
        id: 'room-8-5',
        name: 'Sky Terrace Loft',
        hotelId: 'hotel-8',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'],
        area: 60,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'terrace', name: 'Sân thượng riêng' },
          { id: 'kitchen', name: 'Bếp đầy đủ' }
        ],
        maxGuests: 4,
        price: 2800000,
        availableRooms: 2
      }
    ],
    description: 'Khách sạn phong cách hiện đại, gần chợ Bến Thành'
  },
  {
    id: 'hotel-9',
    name: 'Heritage Inn',
    slug: 'heritage-inn-9',
    categories: [{ id: 'inn', name: 'Inn', slug: 'inn' }],
    status: 'ACTIVE',
    rating: 3,
    reviewCount: 456,
    address: {
      streetNumber: '67',
      streetName: 'Phạm Ngũ Lão',
      ward: 'Phường Minh An',
      district: 'Thành phố Hội An',
      city: 'Quảng Nam',
      fullAddress: '67 Phạm Ngũ Lão, P. Minh An, Tp. Hội An, Quảng Nam'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.breakfast, commonAmenities.bikeRent,
      commonAmenities.concierge
    ],
    roomTypes: [
      {
        id: 'room-9-1',
        name: 'Classic Room',
        hotelId: 'hotel-9',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
        ],
        area: 22,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'TV' },
          { id: 'shower', name: 'Vòi sen' }
        ],
        maxGuests: 2,
        price: 650000,
        availableRooms: 8
      },
      {
        id: 'room-9-2',
        name: 'Lantern Room',
        hotelId: 'hotel-9',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        area: 28,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'lantern', name: 'Decor đèn lồng' },
          { id: 'balcony', name: 'Ban công nhỏ' }
        ],
        maxGuests: 2,
        price: 850000,
        availableRooms: 6
      },
      {
        id: 'room-9-3',
        name: 'Ancient Town Suite',
        hotelId: 'hotel-9',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        area: 40,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tub', name: 'Bồn tắm gỗ' },
          { id: 'view', name: 'View phố cổ' }
        ],
        maxGuests: 2,
        price: 1500000,
        availableRooms: 3
      },
      {
        id: 'room-9-4',
        name: 'Garden Courtyard',
        hotelId: 'hotel-9',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        area: 35,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'garden', name: 'Sân vườn riêng' }
        ],
        maxGuests: 2,
        price: 1200000,
        availableRooms: 4
      },
      {
        id: 'room-9-5',
        name: 'Family Heritage',
        hotelId: 'hotel-9',
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        area: 50,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: '2bed', name: '2 giường lớn' },
          { id: 'living', name: 'Không gian sinh hoạt' }
        ],
        maxGuests: 4,
        price: 1800000,
        availableRooms: 2
      }
    ],
    description: 'Nhà nghỉ phong cách cổ điển, gần phố cổ Hội An'
  },
  {
    id: 'hotel-10',
    name: 'Riverside Luxury',
    slug: 'riverside-luxury-10',
    categories: [{ id: 'hotel', name: 'Khách sạn', slug: 'hotel' }],
    status: 'ACTIVE',
    rating: 5,
    reviewCount: 1876,
    address: {
      streetNumber: '88',
      streetName: 'Bạch Đằng',
      ward: 'Phường Vĩnh Ninh',
      district: 'Thành phố Huế',
      city: 'Thừa Thiên Huế',
      fullAddress: '88 Bạch Đằng, P. Vĩnh Ninh, Tp. Huế, Thừa Thiên Huế'
    },
    imageUrls: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'
    ],
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.bar, commonAmenities.spa, commonAmenities.gym,
      commonAmenities.breakfast, commonAmenities.laundry, commonAmenities.concierge
    ],
    roomTypes: [
      {
        id: 'room-10-1',
        name: 'River View Suite',
        hotelId: 'hotel-10',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
        ],
        area: 50,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'tv', name: 'Smart TV' },
          { id: 'minibar', name: 'Minibar' },
          { id: 'bathtub', name: 'Bồn tắm' },
          { id: 'balcony', name: 'Ban công view sông' }
        ],
        maxGuests: 3,
        price: 2500000,
        availableRooms: 4
      },
      {
        id: 'room-10-2',
        name: 'Imperial Room',
        hotelId: 'hotel-10',
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        area: 45,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'decor', name: 'Nội thất cung đình' },
          { id: 'tub', name: 'Bồn tắm' }
        ],
        maxGuests: 2,
        price: 2100000,
        availableRooms: 5
      },
      {
        id: 'room-10-3',
        name: 'Royal Suite',
        hotelId: 'hotel-10',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        area: 65,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'living', name: 'Phòng khách rộng' },
          { id: 'view', name: 'View toàn cảnh' },
          { id: 'service', name: 'Quản gia riêng' }
        ],
        maxGuests: 2,
        price: 3500000,
        availableRooms: 3
      },
      {
        id: 'room-10-4',
        name: 'Emperor Suite',
        hotelId: 'hotel-10',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        area: 100,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'jacuzzi', name: 'Jacuzzi riêng' },
          { id: 'dining', name: 'Phòng ăn riêng' },
          { id: 'balcony', name: 'Ban công lớn' }
        ],
        maxGuests: 4,
        price: 8000000,
        availableRooms: 1
      },
      {
        id: 'room-10-5',
        name: 'Grand River View',
        hotelId: 'hotel-10',
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
        area: 40,
        amenities: [
          { id: 'ac', name: 'Máy lạnh' },
          { id: 'balcony', name: 'Ban công sông Hương' }
        ],
        maxGuests: 2,
        price: 1800000,
        availableRooms: 8
      }
    ],
    description: 'Khách sạn sang trọng bên bờ sông Hương thơ mộng'
  }
];

export function searchHotels(filters: HotelSearchFilters): Hotel[] {
  let results = mockHotels;

  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase().trim();
    results = results.filter(hotel => {
      return hotel.name.toLowerCase().includes(query) ||
        hotel.address.city.toLowerCase().includes(query) ||
        hotel.address.district.toLowerCase().includes(query) ||
        hotel.address.fullAddress?.toLowerCase().includes(query);
    });
  }

  return results;
}

export function getHotelById(id: string): Hotel | undefined {
  return mockHotels.find(h => h.id === id);
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  return mockHotels.find(h => h.slug === slug);
}
