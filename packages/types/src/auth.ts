import { BaseDto } from './common';

export type UserRole = 'Admin' | 'HotelOwner' | 'Manager' | 'Receptionist' | 'Housekeeping' | 'Guest';

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
  brandId?: string;
  hotelId?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponseDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user?: UserDto;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  status?: string;
  brandId?: string;
  hotelId?: string;
}
