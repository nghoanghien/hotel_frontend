import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlist } from "../api";

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotelId: string) => removeFromWishlist(hotelId),
    onSuccess: () => {
      // Invalidate wishlist query to refetch
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
