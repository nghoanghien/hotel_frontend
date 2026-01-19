export enum SystemUserRole {
  SuperAdmin = 0,
  BrandAdmin = 1,
  HotelManager = 2,
  Receptionist = 3,
  Staff = 4,
  Guest = 5
}

export enum SystemUserStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  PendingVerification = 3
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: SystemUserRole;
  status: SystemUserStatus;
  nationality?: string;
  brandId?: string;
  hotelId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Additional guest profile fields
  preferredLanguage?: string;
  preferredCurrency?: string;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  totalBookings?: number;
  completedStays?: number;
  totalReviews?: number;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: SystemUserRole;
  brandId?: string;  // Required for BrandAdmin, HotelManager
  hotelId?: string;  // Required for HotelManager, Receptionist, Staff
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: SystemUserRole;
  status?: SystemUserStatus;
  brandId?: string;
  hotelId?: string;
}
