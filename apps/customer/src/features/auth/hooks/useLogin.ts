import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { login } from "../api";
import { LoginDto } from "@repo/types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: (response) => {
      // response is already unwrapped by http interceptor
      // Structure: { success: true, message: "...", data: { accessToken, refreshToken, user } }

      if (response && response.success && response.data) {
        // 1. Set Access Token in Memory (Http Client)
        setAccessToken(response.data.accessToken);

        // 2. Store Refresh Token in localStorage (for refresh mechanism)
        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken);
        }

        // 3. Update Store (User info only)
        if (response.data.user) {
          setUser(response.data.user);
        }

        // 4. Invalidate auth query to ensure fresh state
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });

  return {
    handleLogin: (data: LoginDto) => mutation.mutateAsync(data).then(() => true).catch(() => false),
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as any).message || "Đăng nhập thất bại" : null,
    reset: mutation.reset,
  };
};
