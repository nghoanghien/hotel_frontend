import { motion } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { formatVnd } from '@repo/lib';
import { ChevronRight, Heart } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading, getAmenityIcon, useNotification, ImageWithFallback } from '@repo/ui';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

export default function MagazineLayout4({ hotel }: Props) {
  // Combine Images and Amenities for the grid
  const mainImage = hotel.images[0];
  const gallery = [...hotel.images.slice(1)];
  while (gallery.length < 3) gallery.push({ imageUrl: '', caption: '', id: `fallback-${gallery.length}` } as any);
  const displayGallery = gallery.slice(0, 3);
  const amenities = hotel.amenities?.filter(a => a).slice(0, 4) || []; // Take 4 amenities, filter nulls

  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="bg-white rounded-3xl overflow-hidden shadow-xl mb-24 border border-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Loading...'); router.push(`/hotels/${hotel.id}`); }, 300); }}
        className="relative flex flex-col md:flex-row min-h-auto md:min-h-[700px] cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {/* Mobile Header (Horizontal) */}
        <div className="md:hidden w-full bg-white border-b border-gray-200 p-6 flex flex-col items-center justify-center relative z-10 cursor-pointer">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{hotel.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{hotel.city}</p>
          {(hotel.brand?.name || hotel.brandName) && (
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mt-2">
              {hotel.brand?.name || hotel.brandName}
            </p>
          )}
        </div>

        {/* Desktop Header (Vertical) */}
        <div
          onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: '#f9fafb', opacity: 1 })}
          className="hidden md:flex w-[120px] bg-white border-r border-gray-100 items-start justify-center pt-8 relative z-10 cursor-pointer group"
        >
          <div className="h-full flex flex-col justify-between pb-8 items-center">
            <div className="text-2xl font-bold text-gray-200">04</div>
            <h1
              className="text-[52px] font-bold text-[#1A1A1A] leading-none whitespace-nowrap mt-8"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                fontFamily: 'var(--font-anton), sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              {hotel.name}
            </h1>
            {(hotel.brand?.name || hotel.brandName) && (
              <p
                className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)'
                }}
              >
                {hotel.brand?.name || hotel.brandName}
              </p>
            )}
            <div className="w-px h-24 bg-gray-200" />
          </div>
        </div>

        <div className="relative flex-1 flex flex-col">
          {/* Row 1 - Main Feature */}
          <div className="border-b border-gray-100 p-0 flex-shrink-0 relative z-10 cursor-pointer" style={{ height: 'auto' }}>
            <div className="flex flex-col md:flex-row h-full min-h-[400px]">

              {/* Text Content */}
              <div
                className="flex-1 p-8 md:p-12 flex flex-col justify-center order-2 md:order-1"
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: 'rgba(0,0,0,0.01)', opacity: 1 })}
              >
                <span className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-4 block">Most Popular Choice</span>
                <h3 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4 font-anton">{formatVnd(hotel.minPrice || 0)} <span className="text-lg text-gray-400 font-sans font-normal">/night</span></h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6 max-w-md">{hotel.description}</p>

                <div className="flex gap-2 flex-wrap">
                  {amenities.map(a => {
                    const Icon = getAmenityIcon(a.name);
                    return (
                      <span key={a.id} className="text-xs font-bold px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        {a.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Main Image */}
              <div
                className="relative w-full md:w-[55%] h-[300px] md:h-auto order-1 md:order-2 overflow-hidden group"
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: 'rgba(0,0,0,0.03)', opacity: 1 })}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 pointer-events-none">
                  <p className="text-white font-bold text-lg drop-shadow-md translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    View detail <ChevronRight className="w-5 h-5" />
                  </p>
                </div>
                <ImageWithFallback src={mainImage?.imageUrl || ''} alt={hotel.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

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
              </div>
            </div>
          </div>

          {/* Row 2 - Gallery Grid */}
          <div className="grid grid-cols-3 flex-1 min-h-[250px] border-b border-gray-100">
            {displayGallery.map((img, idx) => (
              <div
                key={idx}
                className={`relative border-r border-gray-100 last:border-r-0 group overflow-hidden`}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: 'rgba(0,0,0,0.03)', opacity: 1 })}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 pointer-events-none">
                  <p className="text-white font-bold text-lg drop-shadow-md translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    {img.caption || "View detail"} <ChevronRight className="w-5 h-5" />
                  </p>
                </div>
                <ImageWithFallback src={img.imageUrl} alt="Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section >
  );
}
