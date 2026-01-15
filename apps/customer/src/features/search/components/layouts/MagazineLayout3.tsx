import { motion } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { Star, MapPin, Heart } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading, ImageWithFallback, getAmenityIcon, useNotification } from '@repo/ui';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatVnd } from '@repo/lib';

interface Props {
  hotel: Hotel;
}

export default function MagazineLayout3({ hotel }: Props) {
  const hero = hotel.images[0];
  // Fill secondary images to always have 3
  const secondarySrc = [...hotel.images.slice(1)];
  while (secondarySrc.length < 3) {
    secondarySrc.push({
      id: `fallback-sec-${secondarySrc.length}`,
      imageUrl: '',
      caption: '',
      displayOrder: 999
    } as any);
  }
  const displaySecondary = secondarySrc.slice(0, 3);

  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  if (!hero) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="mb-24 px-2"
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Loading...'); router.push(`/hotels/${hotel.id}`); }, 300); }}
        className="relative max-w-[1240px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Left: Editorial text */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-center py-8">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-6">
              <span className="inline-block w-12 h-px bg-gray-300 mr-3 align-middle" />
              Featured Hotel
            </div>

            <h2 className="text-6xl md:text-8xl font-black leading-none mb-6 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-anton), serif' }}>
              Experience<br />
              True<br />
              <span className="italic text-gray-400 font-serif">Luxury</span>
            </h2>

            <div className="mb-8 pl-4 border-l-4 border-[#1A1A1A]">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[#1A1A1A]">{hotel.name}</h3>
              {(hotel.brand?.name || hotel.brandName) && (
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">
                  {hotel.brand?.name || hotel.brandName}
                </p>
              )}
              <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < hotel.starRating ? 'fill-current' : 'text-gray-300 fill-gray-300'}`} />)}
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{hotel.reviewCount} Reviews</span>
              </div>
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {hotel.description}
              </p>
            </div>

            {/* Price Tag */}
            <div className="mt-4">
              <span className="text-sm text-gray-400 uppercase tracking-wider block mb-1">Starting from</span>
              <div className="text-4xl font-bold text-[#1A1A1A] font-anton">
                {formatVnd(hotel.minPrice || 0)}
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.filter(a => a).slice(0, 6).map(a => {
                  const Icon = getAmenityIcon(a.name);
                  return (
                    <span key={a.id} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-100 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {a.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.15)', opacity: 1, scale: 1.06 })}
            className="col-span-1 md:col-span-7 relative z-10"
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl">
              <ImageWithFallback
                src={hero.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover"
              />
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
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-gray-400 mb-1">Located in</div>
                  <div className="font-bold text-lg text-[#1A1A1A] leading-tight">{hotel.city}, {hotel.country}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row - secondary images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-16 pt-12 border-t border-gray-100">
          {displaySecondary.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.08)', opacity: 1, scale: 1.06 })}
              className="relative z-10 group"
            >
              <div className="relative aspect-square overflow-hidden mb-3 rounded-2xl bg-gray-100">
                <ImageWithFallback
                  src={img.imageUrl}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h4 className="font-bold text-sm md:text-base text-[#1A1A1A] mt-2">{img.caption || "Gallery View"}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
