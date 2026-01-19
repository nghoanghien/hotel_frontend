import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../api";

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["bookings", "my-bookings"],
    queryFn: async () => {
      const response = await getMyBookings();
      console.log("My Bookings Response:", response);
      // Interceptor already unwrapped response.data, so response IS the ApiResponse
      // response = { success: true, data: [...], message: "..." }
      return response.data || [];
    },
  });
};
