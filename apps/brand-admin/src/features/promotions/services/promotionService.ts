// Removed external 'uuid' dependency to fix build error
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export enum DiscountType {
  Percentage = 'Percentage',
  FixedAmount = 'FixedAmount'
}

export enum PromotionStatus {
  Active = 'Active',
  Paused = 'Paused',
  Expired = 'Expired',
  Draft = 'Draft'
}

export interface Promotion {
  id: string;
  brandId: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  applyToAllHotels: boolean;
  appliedHotelIds: string[];
  startDate: string;
  endDate: string;
  maxUsage: number;
  maxUsagePerUser: number;
  usageCount: number;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionDto {
  brandId: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  applyToAllHotels: boolean;
  applyToHotelIds?: string[];
  startDate: string;
  endDate: string;
  maxUsage: number;
  maxUsagePerUser: number;
}

export interface UpdatePromotionDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxUsage?: number;
  maxUsagePerUser?: number;
  applyToAllHotels?: boolean;
  applyToHotelIds?: string[];
  status?: PromotionStatus;
}

// ==================== MOCK PROMOTIONS DATA - VINPEARL ====================
// References Vinpearl hotels:
// Khánh Hòa: hotel-kh-001, hotel-kh-004, hotel-kh-007
// Đà Nẵng: hotel-dn-002, hotel-dn-005
// Lâm Đồng: hotel-ld-001, hotel-ld-005

const MOCK_PROMOTIONS: Promotion[] = [
  // ============ ACTIVE PROMOTIONS ============
  {
    id: 'promo-vp-001',
    brandId: 'brand-vinpearl',
    name: 'Vinpearl Summer Escape 2026',
    code: 'VPSUMMER26',
    description: 'Enjoy up to 25% off on all Vinpearl resorts. Experience luxury beachfront stays with exclusive perks including complimentary breakfast and spa credits.',
    discountType: DiscountType.Percentage,
    discountValue: 25,
    maxDiscountAmount: 2000000,
    minBookingAmount: 3000000,
    applyToAllHotels: true,
    appliedHotelIds: [],
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-03-31T23:59:59Z',
    maxUsage: 2000,
    maxUsagePerUser: 2,
    usageCount: 847,
    status: PromotionStatus.Active,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-15T14:30:00Z'
  },
  {
    id: 'promo-vp-002',
    brandId: 'brand-vinpearl',
    name: 'Nha Trang Beach Getaway',
    code: 'NHATRANG500K',
    description: 'Save 500,000 VND on bookings at our premium Nha Trang properties. Valid for stays of 2 nights or more.',
    discountType: DiscountType.FixedAmount,
    discountValue: 500000,
    minBookingAmount: 2000000,
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-kh-001', 'hotel-kh-004', 'hotel-kh-007'],
    startDate: '2026-01-10T00:00:00Z',
    endDate: '2026-02-28T23:59:59Z',
    maxUsage: 500,
    maxUsagePerUser: 1,
    usageCount: 234,
    status: PromotionStatus.Active,
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'promo-vp-003',
    brandId: 'brand-vinpearl',
    name: 'Da Nang Resort Special',
    code: 'DANANG15',
    description: '15% off for Da Nang resort bookings. Perfect for beach lovers and golfers alike.',
    discountType: DiscountType.Percentage,
    discountValue: 15,
    maxDiscountAmount: 1500000,
    minBookingAmount: 2500000,
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-dn-002', 'hotel-dn-005'],
    startDate: '2026-01-15T00:00:00Z',
    endDate: '2026-04-15T23:59:59Z',
    maxUsage: 300,
    maxUsagePerUser: 1,
    usageCount: 89,
    status: PromotionStatus.Active,
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z'
  },

  // ============ DRAFT PROMOTIONS ============
  {
    id: 'promo-vp-004',
    brandId: 'brand-vinpearl',
    name: 'Dalat Highland Retreat',
    code: 'DALAT2026',
    description: 'Escape to the cool mountains of Dalat. Special rates for Ana Mandara Villas and Dalat Palace.',
    discountType: DiscountType.Percentage,
    discountValue: 20,
    maxDiscountAmount: 1800000,
    minBookingAmount: 4000000,
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-ld-001', 'hotel-ld-005'],
    startDate: '2026-02-01T00:00:00Z',
    endDate: '2026-05-31T23:59:59Z',
    maxUsage: 200,
    maxUsagePerUser: 1,
    usageCount: 0,
    status: PromotionStatus.Draft,
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-18T14:00:00Z'
  },
  {
    id: 'promo-vp-005',
    brandId: 'brand-vinpearl',
    name: 'Tet Holiday Special 2026',
    code: 'TET2026VIP',
    description: 'Celebrate Vietnamese New Year at Vinpearl. Exclusive package with festive dinner and entertainment.',
    discountType: DiscountType.FixedAmount,
    discountValue: 1000000,
    minBookingAmount: 8000000,
    applyToAllHotels: true,
    appliedHotelIds: [],
    startDate: '2026-01-25T00:00:00Z',
    endDate: '2026-02-10T23:59:59Z',
    maxUsage: 100,
    maxUsagePerUser: 1,
    usageCount: 0,
    status: PromotionStatus.Draft,
    createdAt: '2026-01-19T10:00:00Z',
    updatedAt: '2026-01-19T10:00:00Z'
  },

  // ============ PAUSED PROMOTIONS ============
  {
    id: 'promo-vp-006',
    brandId: 'brand-vinpearl',
    name: 'VinWonders Family Fun',
    code: 'FUNFAMILY',
    description: 'Family package including VinWonders theme park tickets at Vinpearl Discovery Wonderworld.',
    discountType: DiscountType.Percentage,
    discountValue: 10,
    maxDiscountAmount: 800000,
    minBookingAmount: 3500000,
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-kh-004'],
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2026-01-31T23:59:59Z',
    maxUsage: 150,
    maxUsagePerUser: 1,
    usageCount: 67,
    status: PromotionStatus.Paused,
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2026-01-10T16:00:00Z'
  },

  // ============ EXPIRED PROMOTIONS ============
  {
    id: 'promo-vp-007',
    brandId: 'brand-vinpearl',
    name: 'New Year Countdown 2026',
    code: 'NEWYEAR26',
    description: 'Special rates for New Year Eve celebration at all Vinpearl properties.',
    discountType: DiscountType.Percentage,
    discountValue: 30,
    maxDiscountAmount: 3000000,
    minBookingAmount: 5000000,
    applyToAllHotels: true,
    appliedHotelIds: [],
    startDate: '2025-12-28T00:00:00Z',
    endDate: '2026-01-02T23:59:59Z',
    maxUsage: 500,
    maxUsagePerUser: 1,
    usageCount: 412,
    status: PromotionStatus.Expired,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'promo-vp-008',
    brandId: 'brand-vinpearl',
    name: 'Christmas Magic 2025',
    code: 'XMAS2025',
    description: 'Magical Christmas experience at Vinpearl resorts with festive decorations and special dinner.',
    discountType: DiscountType.FixedAmount,
    discountValue: 800000,
    minBookingAmount: 4000000,
    applyToAllHotels: true,
    appliedHotelIds: [],
    startDate: '2025-12-20T00:00:00Z',
    endDate: '2025-12-27T23:59:59Z',
    maxUsage: 300,
    maxUsagePerUser: 1,
    usageCount: 278,
    status: PromotionStatus.Expired,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-12-28T00:00:00Z'
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const promotionService = {
  getPromotions: async (brandId: string): Promise<Promotion[]> => {
    await delay(600);
    return MOCK_PROMOTIONS.filter(p => p.brandId === 'brand-vinpearl');
  },

  getPromotionById: async (id: string): Promise<Promotion | undefined> => {
    await delay(300);
    return MOCK_PROMOTIONS.find(p => p.id === id);
  },

  createPromotion: async (dto: CreatePromotionDto): Promise<Promotion> => {
    await delay(1000);
    const newPromo: Promotion = {
      id: `promo-vp-${uuidv4().slice(0, 8)}`,
      brandId: 'brand-vinpearl',
      name: dto.name,
      code: dto.code.toUpperCase(),
      description: dto.description,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxDiscountAmount: dto.maxDiscountAmount,
      minBookingAmount: dto.minBookingAmount,
      applyToAllHotels: dto.applyToAllHotels,
      appliedHotelIds: dto.applyToHotelIds || [],
      startDate: dto.startDate,
      endDate: dto.endDate,
      maxUsage: dto.maxUsage,
      maxUsagePerUser: dto.maxUsagePerUser,
      usageCount: 0,
      status: PromotionStatus.Draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_PROMOTIONS.unshift(newPromo);
    return newPromo;
  },

  updatePromotion: async (id: string, dto: UpdatePromotionDto): Promise<Promotion> => {
    await delay(800);
    const index = MOCK_PROMOTIONS.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Promotion not found');

    const updated = {
      ...MOCK_PROMOTIONS[index],
      ...dto,
      updatedAt: new Date().toISOString()
    };
    MOCK_PROMOTIONS[index] = updated;
    return updated;
  },

  deletePromotion: async (id: string): Promise<void> => {
    await delay(500);
    const index = MOCK_PROMOTIONS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PROMOTIONS.splice(index, 1);
    }
  },

  activatePromotion: async (id: string): Promise<void> => {
    await delay(300);
    const promo = MOCK_PROMOTIONS.find(p => p.id === id);
    if (promo) {
      promo.status = PromotionStatus.Active;
      promo.updatedAt = new Date().toISOString();
    }
  },

  pausePromotion: async (id: string): Promise<void> => {
    await delay(300);
    const promo = MOCK_PROMOTIONS.find(p => p.id === id);
    if (promo) {
      promo.status = PromotionStatus.Paused;
      promo.updatedAt = new Date().toISOString();
    }
  },

  // Get promotion statistics
  getPromotionStats: async (): Promise<{ total: number; active: number; paused: number; expired: number; draft: number }> => {
    await delay(200);
    const promos = MOCK_PROMOTIONS.filter(p => p.brandId === 'brand-vinpearl');
    return {
      total: promos.length,
      active: promos.filter(p => p.status === PromotionStatus.Active).length,
      paused: promos.filter(p => p.status === PromotionStatus.Paused).length,
      expired: promos.filter(p => p.status === PromotionStatus.Expired).length,
      draft: promos.filter(p => p.status === PromotionStatus.Draft).length
    };
  }
};
