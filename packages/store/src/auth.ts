import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setLogin: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLogin: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "hotel-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // SECURITY: Only persist user info, NEVER persist access token
      partialize: (state) => ({ user: state.user }),
    }
  )
);