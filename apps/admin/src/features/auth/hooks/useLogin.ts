import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { login } from "../api";
import { LoginDto } from "@repo/types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      // BYPASS LOGIN - Accept any credentials (Development only)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      return {
        success: true,
        message: "Login successful",
        data: {
          accessToken: "mock-admin-access-token",
          refreshToken: "mock-admin-refresh-token",
          user: {
            id: "super-admin-001",
            email: data.email, // Use whatever they typed
            firstName: "Super",
            lastName: "Admin",
            role: "SuperAdmin",
            phoneNumber: "+84-123-456-789",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin"
          }
        }
      };
    },
    onSuccess: (response) => {
      if (response && response.success && response.data) {
        // 1. Set Access Token
        setAccessToken(response.data.accessToken);

        // 2. Update Store
        if (response.data.user) {
          setUser(response.data.user);
        }

        // 3. Invalidate queries
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
