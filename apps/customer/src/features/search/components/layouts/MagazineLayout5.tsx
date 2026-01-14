import { motion } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { Star, MapPin, Users } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  hotel: Hotel;
}

// Layout 1: Editorial Hero - Large featured hotel with editorial typography
export default function MagazineLayout1({ hotel }: Props) {
  const featured = hotel.images[0]?.imageUrl || '';
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-16 px-4"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Magazine page indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-gray-400 font-mono">P.{Math.floor(Math.random() * 50) + 1}</div>
          <div className="h-px flex-1 mx-8 bg-gray-200" />
          <div className="text-xs text-gray-400 uppercase tracking-wider">{hotel.brandName || 'Hotel'}</div>
        </div>

        {/* Hotel title - editorial style */}
        <div className="mb-12">
          <h2 className="text-7xl font-bold leading-none mb-4" style={{ fontFamily: 'serif' }}>
            {hotel.name}
          </h2>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (hotel.starRating || 0) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="font-semibold ml-1">({hotel.reviewCount} đánh giá)</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{hotel.city}</span>
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.id}?${searchParams.toString()}`); }, 300); }}
          className="relative grid grid-cols-12 gap-8 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Large featured image */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f5efe6', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="col-span-8 relative z-10 cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
              <ImageWithFallback
                src={featured}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.amenities?.slice(0, 5).map(amenity => (
                    <span key={amenity.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {amenity.name}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                  {hotel.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Từ</div>
                <div className="text-3xl font-bold text-amber-600">
                  {((hotel.minPrice || 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500 mt-1">/đêm</div>
              </div>
            </div>
          </div>

          {/* Side info instead of room types */}
          <div className="col-span-4 space-y-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-200 pb-2">
              Thông tin
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="mb-2 font-medium">Tiện nghi nổi bật:</p>
              <ul className="space-y-2">
                {hotel.amenities?.slice(0, 5).map(a => (
                  <li key={a.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>• {a.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="mb-2 font-medium">Chính sách:</p>
              <p className="text-sm text-gray-600">Check-in: {hotel.settings?.checkInTime}</p>
              <p className="text-sm text-gray-600">Check-out: {hotel.settings?.checkOutTime}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
