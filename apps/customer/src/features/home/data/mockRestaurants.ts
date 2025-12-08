import { Hotel, HotelStatus, HotelCategory } from '@repo/models';

// Mock hotel data with Vietnamese destinations as categories
export const MOCK_HOTELS: Hotel[] = [
  // Đà Lạt
  {
    id: 'hotel-dl-001',
    name: 'Hôtel Colline',
    address: {
      street: '10 Phan Bội Châu',
      ward: 'Phường 1',
      district: 'Thành phố Đà Lạt',
      province: 'Lâm Đồng'
    },
    latitude: 11.9429,
    longitude: 108.4372,
    contactPhone: '+84 263 366 5588',
    category: {
      id: 'cat-dalat',
      name: 'Đà Lạt',
      slug: 'da-lat',
      description: 'Thành phố ngàn hoa',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1544663363-22c6082dd9e6?q=80&w=1762&auto=format&fit=crop', // Hotel view (example)
    description: 'Nằm ngay trung tâm Đà Lạt, Hôtel Colline nổi bật như một biệt thự cổ điển Châu Âu pha lẫn nét hiện đại, mang đến trải nghiệm nghỉ dưỡng đẳng cấp.',
    rating: 4.8,
  },
  {
    id: 'hotel-dl-002',
    name: 'Dalat Palace Heritage Hotel',
    address: {
      street: '02 Trần Phú',
      ward: 'Phường 3',
      district: 'Thành phố Đà Lạt',
      province: 'Lâm Đồng'
    },
    latitude: 11.9355,
    longitude: 108.4332,
    contactPhone: '+84 263 3825 444',
    category: {
      id: 'cat-dalat',
      name: 'Đà Lạt',
      slug: 'da-lat',
      description: 'Thành phố ngàn hoa',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop', // Luxury hotel interior
    description: 'Khách sạn di sản 5 sao sang trọng nhìn ra Hồ Xuân Hương, kết hợp giữa phong cách thuộc địa Pháp và tiện nghi hiện đại.',
    rating: 4.9,
  },
  {
    id: 'hotel-dl-003',
    name: 'Swiss-Belresort Tuyen Lam',
    address: {
      street: 'Khu du lịch Hồ Tuyền Lâm',
      ward: 'Phường 3',
      district: 'Thành phố Đà Lạt',
      province: 'Lâm Đồng'
    },
    latitude: 11.8892,
    longitude: 108.4116,
    contactPhone: '+84 263 3799 799',
    category: {
      id: 'cat-dalat',
      name: 'Đà Lạt',
      slug: 'da-lat',
      description: 'Thành phố ngàn hoa',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-6e5a68735df6?q=80&w=1760&auto=format&fit=crop', // Resort with pool
    description: 'Khu nghỉ dưỡng được bao quanh bởi rừng thông và hồ nước, mang kiến trúc Anglo-Normand độc đáo như một lâu đài giữa rừng.',
    rating: 4.7,
  },

  // Vũng Tàu
  {
    id: 'hotel-vt-001',
    name: 'The Imperial Hotel Vung Tau',
    address: {
      street: '159 Thùy Vân',
      ward: 'Phường Thắng Tam',
      district: 'Thành phố Vũng Tàu',
      province: 'Bà Rịa - Vũng Tàu'
    },
    latitude: 10.3458,
    longitude: 107.0844,
    contactPhone: '+84 254 362 8888',
    category: {
      id: 'cat-vungtau',
      name: 'Vũng Tàu',
      slug: 'vung-tau',
      description: 'Thành phố biển năng động',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1770&auto=format&fit=crop', // Beach resort
    description: 'Khách sạn 5 sao duy nhất ở Bãi Sau lấy cảm hứng kiến trúc phục hưng Victoria, sở hữu bãi biển riêng và câu lạc bộ biển.',
    rating: 4.8,
  },
  {
    id: 'hotel-vt-002',
    name: 'Pullman Vung Tau',
    address: {
      street: '15 Thi Sách',
      ward: 'Phường Thắng Tam',
      district: 'Thành phố Vũng Tàu',
      province: 'Bà Rịa - Vũng Tàu'
    },
    latitude: 10.3499,
    longitude: 107.0862,
    contactPhone: '+84 254 355 1777',
    category: {
      id: 'cat-vungtau',
      name: 'Vũng Tàu',
      slug: 'vung-tau',
      description: 'Thành phố biển năng động',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?q=80&w=1769&auto=format&fit=crop', // Modern hotel with pool
    description: 'Địa điểm lý tưởng cho nghỉ dưỡng và công tác, với thiết kế hiện đại, tiện nghi sang trọng và gần các điểm vui chơi giải trí.',
    rating: 4.7,
  },
  {
    id: 'hotel-vt-003',
    name: 'Malibu Hotel',
    address: {
      street: '263 Lê Hồng Phong',
      ward: 'Phường Thắng Tam',
      district: 'Thành phố Vũng Tàu',
      province: 'Bà Rịa - Vũng Tàu'
    },
    latitude: 10.3521,
    longitude: 107.0815,
    contactPhone: '+84 254 357 7779',
    category: {
      id: 'cat-vungtau',
      name: 'Vũng Tàu',
      slug: 'vung-tau',
      description: 'Thành phố biển năng động',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1512918760513-95965df0562a?q=80&w=1766&auto=format&fit=crop', // Infinity Pool view
    description: 'Nổi bật với hồ bơi vô cực trên tầng cao, Malibu Hotel mang đến không gian nghỉ dưỡng sành điệu và tầm nhìn toàn cảnh thành phố.',
    rating: 4.6,
  },

  // Huế
  {
    id: 'hotel-hue-001',
    name: 'Azerai La Residence Hue',
    address: {
      street: '05 Lê Lợi',
      ward: 'Vĩnh Ninh',
      district: 'Thành phố Huế',
      province: 'Thừa Thiên Huế'
    },
    latitude: 16.4619,
    longitude: 107.5938,
    contactPhone: '+84 234 3837 475',
    category: {
      id: 'cat-hue',
      name: 'Huế',
      slug: 'hue',
      description: 'Cố đô mộng mơ',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1774&auto=format&fit=crop', // Colonial architecture
    description: 'Một biệt thự dòng Art Deco bên dòng sông Hương thơ mộng, mang đến vẻ đẹp hoài cổ và sự thanh bình tuyệt đối.',
    rating: 4.9,
  },
  {
    id: 'hotel-hue-002',
    name: 'Silk Path Grand Hue Hotel',
    address: {
      street: '02 Lê Lợi',
      ward: 'Vĩnh Ninh',
      district: 'Thành phố Huế',
      province: 'Thừa Thiên Huế'
    },
    latitude: 16.4625,
    longitude: 107.5950,
    contactPhone: '+84 234 3822 555',
    category: {
      id: 'cat-hue',
      name: 'Huế',
      slug: 'hue',
      description: 'Cố đô mộng mơ',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1770&auto=format&fit=crop', // Royal style hotel
    description: 'Kết hợp hài hòa giữa kiến trúc cung đình Huế và tiện nghi hiện đại, tạo nên không gian nghỉ dưỡng vương giả.',
    rating: 4.8,
  },
  {
    id: 'hotel-hue-003',
    name: 'Melia Vinpearl Hue',
    address: {
      street: '50A Hùng Vương',
      ward: 'Phú Nhuận',
      district: 'Thành phố Huế',
      province: 'Thừa Thiên Huế'
    },
    latitude: 16.4589,
    longitude: 107.5932,
    contactPhone: '+84 234 368 8888',
    category: {
      id: 'cat-hue',
      name: 'Huế',
      slug: 'hue',
      description: 'Cố đô mộng mơ',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1594951478799-19c277cb7e42?q=80&w=1770&auto=format&fit=crop', // Modern skyscraper hotel
    description: 'Tòa tháp khách sạn cao nhất thành phố Huế, mang đến tầm nhìn toàn cảnh sông Hương và núi Ngự tuyệt đẹp.',
    rating: 4.8,
  },

  // Nha Trang
  {
    id: 'hotel-nt-001',
    name: 'InterContinental Nha Trang',
    address: {
      street: '32 - 34 Trần Phú',
      ward: 'Lộc Thọ',
      district: 'Thành phố Nha Trang',
      province: 'Khánh Hòa'
    },
    latitude: 12.2388,
    longitude: 109.1967,
    contactPhone: '+84 258 3887 777',
    category: {
      id: 'cat-nhatrang',
      name: 'Nha Trang',
      slug: 'nha-trang',
      description: 'Vịnh biển đẹp nhất thế giới',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1920&auto=format&fit=crop', // Beachfront hotel
    description: 'Khách sạn sang trọng nằm ngay trên đường Trần Phú, hướng tầm nhìn bao quát toàn bộ vịnh Nha Trang xinh đẹp.',
    rating: 4.9,
  },
  {
    id: 'hotel-nt-002',
    name: 'Amiana Resort Nha Trang',
    address: {
      street: 'Phạm Văn Đồng',
      ward: 'Vĩnh Hòa',
      district: 'Thành phố Nha Trang',
      province: 'Khánh Hòa'
    },
    latitude: 12.2965,
    longitude: 109.2065,
    contactPhone: '+84 258 355 3333',
    category: {
      id: 'cat-nhatrang',
      name: 'Nha Trang',
      slug: 'nha-trang',
      description: 'Vịnh biển đẹp nhất thế giới',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?q=80&w=1770&auto=format&fit=crop', // Secluded resort
    description: 'Khu nghỉ dưỡng 5 sao yên tĩnh với bãi biển riêng và hồ bơi nước mặn tự nhiên lớn nhất Việt Nam.',
    rating: 4.8,
  },
  {
    id: 'hotel-nt-003',
    name: 'Sheraton Nha Trang',
    address: {
      street: '26-28 Trần Phú',
      ward: 'Lộc Thọ',
      district: 'Thành phố Nha Trang',
      province: 'Khánh Hòa'
    },
    latitude: 12.2415,
    longitude: 109.1972,
    contactPhone: '+84 258 388 0000',
    category: {
      id: 'cat-nhatrang',
      name: 'Nha Trang',
      slug: 'nha-trang',
      description: 'Vịnh biển đẹp nhất thế giới',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1563811771046-ba984ff30900?q=80&w=1770&auto=format&fit=crop', // Infinity pool
    description: 'Khách sạn 5 sao quốc tế đầu tiên tại Nha Trang, nổi tiếng với hồ bơi vô cực và trường dạy nấu ăn.',
    rating: 4.7,
  },

  // Quy Nhơn
  {
    id: 'hotel-qn-001',
    name: 'Anantara Quy Nhon Villas',
    address: {
      street: 'Cầu Bãi Dại',
      ward: 'Ghềnh Ráng',
      district: 'Thành phố Quy Nhơn',
      province: 'Bình Định'
    },
    latitude: 13.7225,
    longitude: 109.2195,
    contactPhone: '+84 256 3848 888',
    category: {
      id: 'cat-quynhon',
      name: 'Quy Nhơn',
      slug: 'quy-nhon',
      description: 'Nắng gió miền Trung',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop', // Tranquil villa
    description: 'Các biệt thự hướng biển sang trọng nép mình trong vịnh nhỏ riêng tư, mang đến sự thư giãn tuyệt đối.',
    rating: 4.9,
  },
  {
    id: 'hotel-qn-002',
    name: 'FLC Luxury Hotel Quy Nhon',
    address: {
      street: 'Khu 4, Nhơn Lý',
      ward: 'Nhơn Lý',
      district: 'Thành phố Quy Nhơn',
      province: 'Bình Định'
    },
    latitude: 13.9685,
    longitude: 109.2785,
    contactPhone: '+84 256 626 6666',
    category: {
      id: 'cat-quynhon',
      name: 'Quy Nhơn',
      slug: 'quy-nhon',
      description: 'Nắng gió miền Trung',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1964&auto=format&fit=crop',
    description: 'Khách sạn ven biển độc đáo với kiến trúc hình rồng uốn lượn, nằm trong quần thể FLC Quy Nhơn Beach & Golf Resort.',
    rating: 4.7,
  },
  {
    id: 'hotel-qn-003',
    name: 'Avani Quy Nhon Resort',
    address: {
      street: 'Ghenh Rang',
      ward: 'Ghềnh Ráng',
      district: 'Thành phố Quy Nhơn',
      province: 'Bình Định'
    },
    latitude: 13.7312,
    longitude: 109.2188,
    contactPhone: '+84 256 3840 132',
    category: {
      id: 'cat-quynhon',
      name: 'Quy Nhơn',
      slug: 'quy-nhon',
      description: 'Nắng gió miền Trung',
    },
    status: HotelStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop', // Seaside resort
    description: 'Khu nghỉ dưỡng từng đoạt giải thưởng với spa trên vách đá và bãi biển cát vàng riêng biệt.',
    rating: 4.6,
  },
];

// Helper function to get unique categories from hotels
export const getUniqueCategories = (): HotelCategory[] => {
  const categoryMap = new Map<string, HotelCategory>();

  MOCK_HOTELS.forEach(hotel => {
    if (!categoryMap.has(hotel.category.id)) {
      categoryMap.set(hotel.category.id, hotel.category);
    }
  });

  return Array.from(categoryMap.values());
};

// Helper function to get hotels by category
export const getHotelsByCategory = (categoryId: string): Hotel[] => {
  return MOCK_HOTELS.filter(hotel => hotel.category.id === categoryId);
};

// Helper function to get category background images
export const getCategoryBackgroundImage = (categorySlug: string): string => {
  const backgrounds: Record<string, string> = {
    'da-lat': 'https://images.unsplash.com/photo-1508233620467-f79f1e317a05?q=80&w=1974&auto=format&fit=crop', // Da Lat landscape
    'vung-tau': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1770&auto=format&fit=crop', // Vung Tau beach
    'hue': 'https://images.unsplash.com/photo-1585066928795-46654212a9d8?q=80&w=1920&auto=format&fit=crop', // Hue Imperial City Gate
    'nha-trang': 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1974&auto=format&fit=crop', // Nha Trang bay
    'quy-nhon': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop', // Quy Nhon Ky Co Beach
  };

  return backgrounds[categorySlug] || backgrounds['da-lat'];
};
