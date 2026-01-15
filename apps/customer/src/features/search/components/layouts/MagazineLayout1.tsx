import { motion } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { Star, MapPin, ArrowRight, Heart } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading, ImageWithFallback, getAmenityIcon, useNotification } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { formatVnd } from '@repo/lib';

interface Props {
  hotel: Hotel;
}

export default function MagazineLayout1({ hotel }: Props) {
  const featured = hotel.images[0]?.imageUrl || '';
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mb-24 px-2 md:px-0"
    >
      <div
        ref={setRefs}
        className="max-w-[1240px] mx-auto group cursor-pointer"
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Loading...'); router.push(`/hotels/${hotel.id}`); }, 300); }}
      >
        {/* Title Section */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <h2 className="text-5xl md:text-7xl font-bold text-[#1A1A1A] tracking-tight leading-none" style={{ fontFamily: 'var(--font-anton), serif' }}>
              {hotel.name}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 pb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < hotel.starRating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="w-px h-4 bg-gray-300" />
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hotel.city}, {hotel.country}
              </span>
              {(hotel.brand?.name || hotel.brandName) && (
                <>
                  <span className="w-px h-4 bg-gray-300" />
                  <span className="uppercase text-xs tracking-wider font-bold">
                    {hotel.brand?.name || hotel.brandName}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="h-px w-full bg-gray-200" />
        </div>

        <div className="relative grid grid-cols-12 gap-8">
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Main Image */}
          <div
            className="col-span-12 md:col-span-8 relative z-10"
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.02)', opacity: 1, scale: 1.02 })}
          >
            <div className="aspect-[16/10] relative overflow-hidden rounded-[32px] shadow-sm bg-gray-100">
              <ImageWithFallback src={featured} alt={hotel.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

              {/* Favorite Button */}
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
                className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center gap-2 transition-all shadow-sm group/fav hover:scale-105 active:scale-95 border border-white/20"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700 group-hover/fav:text-rose-500'}`}
                  strokeWidth={2}
                />
                <span className={`text-xs font-semibold transition-colors ${isFavorite ? 'text-rose-500' : 'text-gray-700 group-hover/fav:text-gray-900'}`}>
                  {isFavorite ? 'Saved' : 'Save'}
                </span>
              </button>

              {/* Floating Price Badge */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Starting from</div>
                <div className="text-3xl font-bold text-[#1A1A1A] font-anton">
                  {formatVnd(hotel.minPrice || 0)}
                  <span className="text-sm text-gray-400 font-sans font-normal ml-1">/night</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between py-2 relative z-10 space-y-6">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4 border-b border-gray-100 pb-2">Highlights</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {hotel.amenities?.filter(a => a).slice(0, 6).map(a => {
                  const Icon = getAmenityIcon(a.name);
                  return (
                    <span key={a.id} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg border border-gray-100 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {a.name}
                    </span>
                  );
                })}
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-6">
                {hotel.description}
              </p>
            </div>

            <div className="bg-[#F7F7F7] p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase">Rating</span>
                <span className="text-2xl font-bold text-[#1A1A1A]">{hotel.averageRating} <span className="text-sm text-gray-400 font-normal">/ 5</span></span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#1A1A1A]" style={{ width: `${(hotel.averageRating || 0) * 20}%` }} />
              </div>
              <div className="text-xs text-gray-500 text-right">{hotel.reviewCount} verified reviews</div>

              <button className="w-full mt-6 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-[#000] transition-colors">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
