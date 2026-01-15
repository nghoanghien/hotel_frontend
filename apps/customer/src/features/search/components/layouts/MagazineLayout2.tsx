import { motion } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { MapPin, Star, Heart } from '@repo/ui/icons';
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, getAmenityIcon, useNotification } from '@repo/ui';
import { useCallback, useState } from 'react';
import { formatVnd } from '@repo/lib';

interface Props {
  hotel: Hotel;
  onClick: () => void;
}

export default function MagazineLayout2({ hotel, onClick }: Props) {
  // Ensure 4 images for the grid
  const gridImages = [...hotel.images];
  // Helper to ensure we have 4 items for the grid layout
  while (gridImages.length < 4) {
    gridImages.push({
      id: `fallback-${gridImages.length}`,
      imageUrl: '', // Will trigger ImageWithFallback
      caption: '',
      displayOrder: 999
    } as any);
  }
  const displayImages = gridImages.slice(0, 4);

  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { showNotification } = useNotification();
  const [isFavorite, setIsFavorite] = useState(false);
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="overflow-hidden shadow-sm mb-20 p-6 md:p-12 rounded-[40px]"
      style={{ backgroundColor: '#F5E6D3' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Title */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="relative flex flex-col items-center md:block">
            <h2 className="text-[32px] md:text-[56px] font-bold text-[#2C2416] tracking-tight leading-none text-center" style={{ fontFamily: 'Georgia, serif' }}>
              {hotel.name}
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newState = !isFavorite;
                setIsFavorite(newState);
                showNotification({
                  message: newState ? 'Đã lưu khách sạn vào danh sách yêu thích!' : 'Đã xóa khách sạn khỏi danh sách yêu thích.',
                  type: 'success',
                  autoHideDuration: 3000,
                });
              }}
              className="mt-3 md:mt-0 md:absolute md:left-full md:top-1/2 md:-translate-y-1/2 md:ml-5 w-12 h-12 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-all shadow-sm group/fav hover:scale-110 active:scale-95 border border-[#D4A574]/30"
            >
              <Heart
                className={`w-6 h-6 transition-all ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#8B7355] group-hover/fav:text-rose-500'}`}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center text-[#8B7355] mb-3 text-[11px] uppercase tracking-widest font-medium">
          <span>Travel & Stays</span>
          <span>Featured Collection</span>
        </div>

        {/* Rating */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < (hotel.averageRating || 0) ? 'fill-amber-500 text-amber-500' : 'text-gray-300 fill-gray-300'}`} />
            ))}
          </div>
          <span className="text-[#8B7355] font-semibold">{hotel.averageRating?.toFixed(1) || '0.0'}</span>
          <span className="text-[#8B7355]/60">•</span>
          <span className="text-[#8B7355] text-sm">{hotel.reviewCount} reviews</span>
        </div>

        <div className="flex justify-center items-center gap-2 text-[#8B7355] text-sm mb-4">
          <MapPin className="w-4 h-4" /> {hotel.city}, {hotel.country}
        </div>
        {/* Amenities */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {hotel.amenities?.filter(a => a).slice(0, 6).map(a => {
            const Icon = getAmenityIcon(a.name);
            return (
              <span key={a.id} className="px-3 py-1.5 bg-white/60 backdrop-blur-sm text-[#2C2416] text-xs font-semibold rounded-full border border-[#D4A574]/30 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {a.name}
              </span>
            );
          })}
        </div>
      </div>

      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => {
          triggerTap(e);
          setTimeout(onClick, 300);
        }}
        className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-12 cursor-pointer max-w-[1240px] mx-auto"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {displayImages.map((img, index) => (
          <motion.div
            key={index}
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 48, backgroundColor: '#ffffff', opacity: 1, scaleEnabled: true, scale: 1.08 })}
            className="group relative z-10 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Caption/Title */}
            <h3 className="text-sm md:text-2xl font-semibold text-[#2C2416] mb-2 md:mb-4 tracking-wide text-center" style={{ fontFamily: 'Georgia, serif' }}>
              {img.caption || `Gallery View`}
            </h3>

            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-tr-[32px] rounded-bl-[32px] md:rounded-tr-[64px] md:rounded-bl-[64px] mb-2 md:mb-4 bg-white shadow-md">
              <ImageWithFallback
                src={img.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-12 pt-8 border-t border-[#D4A574]/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#8B7355] uppercase tracking-widest font-bold">
            {hotel.brand?.name || hotel.brandName || "Luxury Stays"}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#8B7355] uppercase tracking-wider">Starting from</span>
            <span className="text-3xl md:text-4xl font-bold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
              {formatVnd(hotel.minPrice || 0)}
            </span>
            <span className="text-xs text-[#8B7355]">/night</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
