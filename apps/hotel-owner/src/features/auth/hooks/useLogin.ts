import { useState } from "react";
import { authApi } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { LoginFormData } from "@repo/lib";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLogin } = useAuthStore();

  const handleLogin = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    localStorage.removeItem("access_token");

    // Mock success response
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create mock user matching UserRole type
    const mockUser: any = {
      id: "mock-owner-id-123",
      email: data.email,
      firstName: "Hotel",
      lastName: "Owner",
      role: "HotelOwner", // Updated to match UserRole type
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    };
    const mockToken = "mock_access_token_" + Date.now();

    setLogin(mockToken, mockUser);
    localStorage.setItem("access_token", mockToken);

    setIsLoading(false);
    return true;
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
