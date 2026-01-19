import { http, ApiResponse } from "@repo/api";
import { LoginDto, AuthResponseDto, UserDto } from "@repo/types";

export const login = async (data: LoginDto) => {
  return http.post<ApiResponse<AuthResponseDto>>("/Auth/login", data) as unknown as Promise<ApiResponse<AuthResponseDto>>;
};

export const register = async (data: any) => {
  return http.post<ApiResponse<AuthResponseDto>>("/Auth/register", data) as unknown as Promise<ApiResponse<AuthResponseDto>>;
};

export const getProfile = async () => {
  return http.get<ApiResponse<UserDto>>("/guest/profile") as unknown as Promise<ApiResponse<UserDto>>;
};

export const logout = async () => {
  return http.post<ApiResponse<boolean>>("/Auth/logout", {}) as unknown as Promise<ApiResponse<boolean>>;
};

export const getHotels = async () => {
  return http.get<ApiResponse<any[]>>("/Hotels") as unknown as Promise<ApiResponse<any[]>>;
};
