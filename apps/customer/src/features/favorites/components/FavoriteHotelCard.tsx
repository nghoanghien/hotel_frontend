"use client";
import type { HotelDetailDto as Hotel } from "@repo/types";
import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { Star, MapPin, Heart, ExternalLink } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
import { formatVnd } from "@repo/lib";
import { useFavoritesStore } from "@/features/favorites/store/favoritesStore";

interface FavoriteHotelCardProps {
  hotel: Hotel;
}

export default function FavoriteHotelCard({ hotel }: FavoriteHotelCardProps) {
  const router = useRouter();
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const { show } = useLoading();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(hotel.id);
  };

  const handleViewDetails = () => {
    show();
    router.push(`/hotels/${hotel.id}`);
  };

  const minPrice = hotel.minPrice || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={hotel.imageUrl || ''}
          alt={hotel.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors group/btn"
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </motion.button>
        </div>

        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-bold text-sm text-gray-900">{hotel.starRating}</span>
            <span className="text-xs text-gray-600">({hotel.reviewCount})</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{hotel.address}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium"
          >
            {hotel.brandName}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities?.slice(0, 4).map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-1 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span>{amenity.name}</span>
            </div>
          ))}
          {hotel.amenities && hotel.amenities.length > 4 && (
            <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">Starting from</div>
            <div className="text-2xl font-bold text-[var(--primary)]">
              {formatVnd(minPrice)}
              <span className="text-sm font-normal text-gray-500">/night</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors"
          >
            <span>View</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
