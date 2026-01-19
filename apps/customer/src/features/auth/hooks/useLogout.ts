import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: clearStore } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setAccessToken(null);
      // Clear refresh token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("refresh_token");
      }
      clearStore();
      queryClient.clear();
      router.push("/login");
    },
  });
};
