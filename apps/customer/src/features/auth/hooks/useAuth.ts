import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api";
import { useAuthStore } from "@repo/store";
import { useEffect, useState } from "react";
import { getAccessToken, restoreAccessToken } from "@repo/api";

export const useAuth = () => {
  const { setUser, clearAuth } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore access token on mount (for page refresh)
  useEffect(() => {
    const restore = async () => {
      // Only restore if we don't have an access token in memory
      if (!getAccessToken()) {
        console.log("[useAuth] No access token in memory, attempting restore...");
        console.log("[useAuth] refresh_token in localStorage:", localStorage.getItem("refresh_token") ? "exists" : "not found");
        const restored = await restoreAccessToken();
        console.log("[useAuth] Restore result:", restored);
        console.log("[useAuth] Access token after restore:", getAccessToken() ? "exists" : "not found");
      } else {
        console.log("[useAuth] Access token already in memory");
      }
      setIsRestoring(false);
    };
    restore();
  }, []);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getProfile();
      return res;
    },
    // Don't run until restore is complete
    enabled: !isRestoring,
    // Don't retry if it's an auth error (handled by interceptor)
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 1;
    },
    // Stale time: User profile doesn't change often, keep for 5 mins
    staleTime: 5 * 60 * 1000,
    // Refetch on window focus to ensure checking session
    refetchOnWindowFocus: true,
  });

  // Sync with global store
  useEffect(() => {
    if (data && data.success && data.data) {
      setUser(data.data);
    } else if (isError) {
      // If error (after retries/interceptor), we are likely not logged in
      clearAuth();
    }
  }, [data, isError, setUser, clearAuth]);

  return {
    user: data?.data ?? null,
    isAuthenticated: !!data?.data,
    isLoading: isRestoring || isLoading,
    error,
    isError,
    refetch,
  };
};
