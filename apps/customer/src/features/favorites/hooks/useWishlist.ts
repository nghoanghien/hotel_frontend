import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../api";

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await getWishlist();
      console.log("Wishlist Response:", response);
      // Interceptor already unwrapped response.data
      return response.data;
    },
  });
};
