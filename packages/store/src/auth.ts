import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  setLogin: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (t) => set({ token: t }),
  setUser: (u) => set({ user: u }),
  setLogin: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));