import type { BrandDto } from '@repo/types';

/**
 * Mock hotel brands/chains
 */
export const mockBrands: Record<string, BrandDto> = {
  'brand-vinpearl': {
    id: 'brand-vinpearl',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Vinpearl',
    description: 'Chuỗi khách sạn và resort cao cấp hàng đầu Việt Nam, mang đến trải nghiệm nghỉ dưỡng đẳng cấp 5 sao quốc tế.',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    website: 'https://vinpearl.com',
    email: 'contact@vinpearl.com',
    phoneNumber: '+84 28 3827 8888',
    city: 'Hồ Chí Minh',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 8
  },
  'brand-melia': {
    id: 'brand-melia',
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Melia Hotels',
    description: 'Tập đoàn khách sạn quốc tế với hơn 400 khách sạn trên toàn cầu, mang phong cách Địa Trung Hải sang trọng.',
    logoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200',
    website: 'https://melia.com',
    email: 'vietnam@melia.com',
    phoneNumber: '+84 236 392 9888',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 5
  },
  'brand-muongthanh': {
    id: 'brand-muongthanh',
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Mường Thanh',
    description: 'Chuỗi khách sạn thuần Việt lớn nhất Đông Nam Á với hơn 60 khách sạn trải dài khắp Việt Nam.',
    logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
    website: 'https://muongthanh.com',
    email: 'info@muongthanh.com',
    phoneNumber: '+84 24 3333 8888',
    city: 'Hà Nội',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 7
  }
};

// Get all brands as array
export function getAllBrands(): BrandDto[] {
  return Object.values(mockBrands);
}

// Get brand by ID
export function getBrandById(id: string): BrandDto | undefined {
  return mockBrands[id];
}
