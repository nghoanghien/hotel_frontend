import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { Star, MapPin, Wifi, Users } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  hotel: Hotel;
}

// Layout 1: Editorial Hero - Large featured hotel with editorial typography
export default function MagazineLayout1({ hotel }: Props) {
  const featured = hotel.imageUrls[0];
  const roomTypes = hotel.roomTypes.slice(0, 3);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
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
          <div className="text-xs text-gray-400 uppercase tracking-wider">{hotel.categories[0]?.name}</div>
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
                  className={`w-4 h-4 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="font-semibold ml-1">({hotel.reviewCount} đánh giá)</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{hotel.address.city}</span>
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}`); }, 300); }}
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
                  {hotel.amenities.slice(0, 5).map(amenity => (
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
                  <span>{hotel.address.fullAddress}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Từ</div>
                <div className="text-3xl font-bold text-amber-600">
                  {(Math.min(...hotel.roomTypes.map(r => r.price)) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500 mt-1">/đêm</div>
              </div>
            </div>
          </div>

          {/* Room types sidebar */}
          <div className="col-span-4 space-y-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-200 pb-2">
              Loại phòng
            </div>
            {roomTypes.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="group cursor-pointer relative z-10"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 leading-tight">
                      {room.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{room.area}m²</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{room.maxGuests} khách</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {room.amenities.slice(0, 2).map(amenity => (
                        <span key={amenity.id} className="text-xs text-gray-600">
                          {amenity.name}
                        </span>
                      )).reduce((prev, curr, idx) => [prev, <span key={`sep-${idx}`} className="text-gray-300">•</span>, curr] as any)}
                    </div>
                    <div className="text-sm font-bold text-amber-600">
                      {(room.price / 1000).toFixed(0)}K/đêm
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
