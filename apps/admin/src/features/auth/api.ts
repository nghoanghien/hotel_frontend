import { http, ApiResponse } from "@repo/api";
import { LoginDto, AuthResponseDto, UserDto } from "@repo/types";

export const login = async (data: LoginDto) => {
  return http.post<ApiResponse<AuthResponseDto>>("/auth/login", data) as unknown as Promise<ApiResponse<AuthResponseDto>>;
};

export const getProfile = async () => {
  return http.get<ApiResponse<UserDto>>("/users/profile") as unknown as Promise<ApiResponse<UserDto>>;
};

export const logout = async () => {
  return http.post<ApiResponse<boolean>>("/auth/logout", {}) as unknown as Promise<ApiResponse<boolean>>;
};
