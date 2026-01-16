import { http } from "./http";

export const login = async (data: any) => {
  return http.post("/auth/login", data);
};

export const register = async (data: any) => {
  return http.post("/auth/register", data);
};

export const logout = async () => {
  return http.post("/auth/logout");
};

export const getMe = async () => {
  return http.get("/auth/me");
};
