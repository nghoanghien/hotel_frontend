// Hotel Status Enum
export enum HotelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

// Hotel Category Interface
export interface HotelCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

// Hotel Interface - Main model for hotel data
export interface Hotel {
  id: string;
  name: string;
  address: { // Tách địa chỉ chi tiết
    street: string;
    ward: string;
    district: string;
    province: string;
  };
  latitude: number;
  longitude: number;
  contactPhone: string;
  category: HotelCategory;
  status: HotelStatus;
  imageUrl?: string;
  description?: string;
  rating?: number;
}



