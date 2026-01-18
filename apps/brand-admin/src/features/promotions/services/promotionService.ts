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
  appliedHotelIds: string[]; // List of Hotel IDs
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  maxUsage: number;
  maxUsagePerUser: number;
  usageCount: number; // Analyitcs
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

// MOCK DATA
const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    brandId: 'brand-1',
    name: 'Summer Sale 2024',
    code: 'SUMMER2024',
    description: 'Giảm giá cực sốc mùa hè cho tất cả các khách sạn.',
    discountType: DiscountType.Percentage,
    discountValue: 20, // 20%
    maxDiscountAmount: 1000000, // Max 1M
    minBookingAmount: 2000000,
    applyToAllHotels: true,
    appliedHotelIds: [],
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    maxUsage: 1000,
    maxUsagePerUser: 1,
    usageCount: 800,
    status: PromotionStatus.Active,
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z'
  },
  {
    id: 'promo-2',
    brandId: 'brand-1',
    name: 'New Year Flash Sale',
    code: 'NEWYEAR25',
    description: 'Chào đón năm mới 2025.',
    discountType: DiscountType.FixedAmount,
    discountValue: 500000, // 500k
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-1', 'hotel-2'],
    startDate: '2024-12-30T00:00:00Z',
    endDate: '2025-01-05T23:59:59Z',
    maxUsage: 500,
    maxUsagePerUser: 1,
    usageCount: 0,
    status: PromotionStatus.Draft,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z'
  },
  {
    id: 'promo-3',
    brandId: 'brand-1',
    name: 'Resort Getaway',
    code: 'RESORT10',
    description: 'Ưu đãi đặc biệt cho khu nghỉ dưỡng.',
    discountType: DiscountType.Percentage,
    discountValue: 10,
    maxDiscountAmount: 5000000,
    minBookingAmount: 5000000,
    applyToAllHotels: false,
    appliedHotelIds: ['hotel-3'],
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    maxUsage: 100,
    maxUsagePerUser: 1,
    usageCount: 12,
    status: PromotionStatus.Paused,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const promotionService = {
  getPromotions: async (brandId: string): Promise<Promotion[]> => {
    await delay(800);
    // In real app: GET /api/promotions/all or similar
    return [...MOCK_PROMOTIONS];
  },

  getPromotionById: async (id: string): Promise<Promotion | undefined> => {
    await delay(300);
    return MOCK_PROMOTIONS.find(p => p.id === id);
  },

  createPromotion: async (dto: CreatePromotionDto): Promise<Promotion> => {
    await delay(1000);
    const newPromo: Promotion = {
      id: uuidv4(),
      brandId: dto.brandId,
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
      status: PromotionStatus.Active, // Default to Active on creation? Or Draft. Let's say Active.
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
    if (promo) promo.status = PromotionStatus.Active;
  },

  pausePromotion: async (id: string): Promise<void> => {
    await delay(300);
    const promo = MOCK_PROMOTIONS.find(p => p.id === id);
    if (promo) promo.status = PromotionStatus.Paused;
  }
};
