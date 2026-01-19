import { useQuery } from "@tanstack/react-query";
import { getBookingDetail } from "../api";

export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      const response = await getBookingDetail(id);
      console.log("Booking Detail Response:", response);
      // Interceptor already unwrapped response.data
      return response.data;
    },
    enabled: !!id,
  });
};
