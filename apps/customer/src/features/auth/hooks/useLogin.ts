import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { LoginDto, UserDto } from "@repo/types";

// Mock user - Nguyễn Văn An
const mockUser: UserDto = {
  id: "user-001",
  email: "nguyenvanan@gmail.com",
  firstName: "An",
  lastName: "Nguyễn Văn",
  phoneNumber: "+84 912 345 678",
  role: "Guest"
};

// Mock access token
const mockAccessToken = "mock-access-token-hotelzy-demo-12345";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginDto): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple validation (any non-empty email/password works for demo)
      if (!data.email || !data.password) {
        setError("Vui lòng nhập email và mật khẩu");
        setIsPending(false);
        return false;
      }

      // Set mock access token
      setAccessToken(mockAccessToken);

      // Always use Nguyễn Văn An for demo
      setUser({
        ...mockUser,
        email: data.email // Use provided email but keep mock name
      });

      // Invalidate auth query
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setIsPending(false);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Đăng nhập thất bại");
      setIsPending(false);
      return false;
    }
  };

  const reset = () => {
    setError(null);
    setIsPending(false);
  };

  return {
    handleLogin,
    mutate: (data: LoginDto) => { handleLogin(data); },
    mutateAsync: handleLogin,
    isPending,
    isLoading: isPending,
    error,
    reset,
  };
};
