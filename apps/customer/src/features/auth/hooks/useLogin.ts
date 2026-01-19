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
      console.log("[useLogin] Full response:", response);
      console.log("[useLogin] response.data:", response?.data);

      if (response && response.success && response.data) {
        // 1. Set Access Token in Memory (Http Client)
        console.log("[useLogin] accessToken:", response.data.accessToken ? "exists" : "not found");
        setAccessToken(response.data.accessToken);

        // 2. Store Refresh Token in localStorage (for refresh mechanism)
        console.log("[useLogin] refreshToken:", response.data.refreshToken ? "exists" : "not found");
        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken);
          console.log("[useLogin] Saved refresh_token to localStorage");
        } else {
          console.warn("[useLogin] No refreshToken in response!");
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
