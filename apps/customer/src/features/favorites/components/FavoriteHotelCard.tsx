"use client";
import type { HotelDto, HotelDetailDto } from "@repo/types";
import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { Star, MapPin, Heart, ArrowRight } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";

interface FavoriteHotelCardProps {
  hotel: HotelDto;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
}

export default function FavoriteHotelCard({ hotel, onClick, onRemove }: FavoriteHotelCardProps) {
  const {
    containerRef,
    rect,
    style: highlightStyle,
    moveHighlight,
    clearHover,
  } = useHoverHighlight<HTMLDivElement>();

  // Use type assertion to access optional rich details if available
  const fullHotel = hotel as HotelDetailDto;
  const minPrice = hotel.minPrice || 0;
  const address = fullHotel.address || hotel.city || "";
  const amenities = fullHotel.amenities || [];

  return (
    <motion.div
      layout
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      onMouseEnter={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.02)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.02,
        })
      }
      onMouseMove={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.02)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.02,
        })
      }
      onMouseLeave={clearHover}
      className="group relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Image Section with Overlay */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shrink-0">
        <ImageWithFallback
          src={hotel.imageUrl || ''}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between items-start z-10">
          {/* Rating Badge - White Pill Style */}
          <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 md:px-3 md:py-1.5 shadow-sm">
            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold text-[10px] md:text-xs text-gray-900">{hotel.starRating}</span>
            <span className="text-[9px] md:text-[10px] text-gray-500">({hotel.reviewCount})</span>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(e);
            }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500" />
          </motion.button>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 z-10">
          <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-1.5 line-clamp-1 drop-shadow-sm">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 md:gap-1.5 text-white/90 text-[10px] md:text-sm">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="line-clamp-1 opacity-90">{address}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 md:p-5 flex flex-col flex-1">
        {/* Brand Tag */}
        <div className="mb-2 md:mb-3">
          <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gray-100 text-[9px] md:text-[11px] font-semibold text-gray-700">
            {hotel.brandName}
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1.5 md:gap-y-2 mb-3 md:mb-4">
          {amenities.filter(Boolean).slice(0, 3).map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-gray-600">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500/80"></div>
              <span className="font-medium line-clamp-1">{amenity.name}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <span className="text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap">+{amenities.length - 3} more</span>
          )}
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between gap-2 md:gap-3">
          <div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-0.5">Starting from</div>
            <div className="flex items-baseline gap-0.5 md:gap-1">
              <span className="text-sm md:text-xl font-bold text-[#1A1A1A] whitespace-nowrap">
                {formatVnd(minPrice)}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-normal whitespace-nowrap">/night</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#000000" }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 flex items-center gap-0 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full bg-[#1A1A1A] text-white text-[10px] md:text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all group/btn whitespace-nowrap"
          >
            <span className="hidden md:inline">Details</span>
            <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </motion.button>
        </div>
      </div>

      {/* Subtle Hover Border */}
      <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-gray-200 rounded-[24px] transition-colors duration-300" />
    </motion.div>
  );
}
