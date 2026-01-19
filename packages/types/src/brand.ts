export type Brand = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  hotelCount: number;
  commissionRate?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
};

export type CreateBrandDto = Omit<Brand, 'id' | 'isActive' | 'hotelCount'>;

export type UpdateBrandDto = Partial<CreateBrandDto> & { isActive?: boolean };
