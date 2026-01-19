import { useAuthStore } from "@repo/store";

/**
 * useAuth hook - returns user from store (no API call)
 * For demo purposes, authentication is managed entirely through the store
 */
export const useAuth = () => {
  const { user, clearAuth } = useAuthStore();

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading: false, // No API call, so never loading
    error: null,
    isError: false,
    refetch: () => Promise.resolve(), // No-op for compatibility
  };
};
