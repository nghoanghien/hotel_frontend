import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { useRouter } from "next/navigation";

/**
 * useLogout hook - logs out user without API call
 * For demo purposes, just clears local state
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: clearStore } = useAuthStore();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async () => {
    setIsPending(true);

    // Simulate brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear access token
    setAccessToken(null);

    // Clear auth store
    clearStore();

    // Clear all queries
    queryClient.clear();

    // Redirect to login
    router.push("/login");

    setIsPending(false);
  }, [clearStore, queryClient, router]);

  return {
    mutate,
    mutateAsync: mutate,
    isPending,
    isLoading: isPending
  };
};
