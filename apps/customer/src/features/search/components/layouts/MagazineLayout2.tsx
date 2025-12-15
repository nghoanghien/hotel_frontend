import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { Star, MapPin, Users } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

// Layout 2: Multi-column editorial with asymmetric grid
export default function MagazineLayout2({ hotel }: Props) {
  // Tạo danh sách để hiển thị: kết hợp ảnh khách sạn và ảnh phòng
  const allImages = [...hotel.imageUrls, ...hotel.roomTypes.flatMap(r => r.images)];
  const leftItems = hotel.roomTypes.slice(0, 3);
  const rightItems = hotel.roomTypes.slice(3, 6);
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
        {/* Page header */}
        <div className="flex items-baseline gap-4 mb-8">
          <div className="text-8xl font-black text-gray-100" style={{ fontFamily: 'serif' }}>
            {Math.floor(Math.random() * 99) + 1}
          </div>
          <div className="flex-1">
            <div className="h-px bg-gray-200 mb-2" />
            <div className="text-xs text-gray-400 uppercase tracking-widest">Featured Hotel</div>
          </div>
        </div>

        {/* Hotel info bar */}
        <div className="bg-gray-50 px-8 py-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                {hotel.name}
              </h2>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.address.city}</span>
                </div>
                <span>·</span>
                <span>{hotel.reviewCount} đánh giá</span>
              </div>
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                {hotel.description}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}`); }, 300); }}
          className="relative grid grid-cols-2 gap-12 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Left column - Room types */}
          <div className="space-y-10">
            {leftItems.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden mb-4">
                  <ImageWithFallback
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <span>{room.area}m²</span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{room.maxGuests} khách</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {room.amenities.slice(0, 3).map(a => a.name).join(' · ')}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-amber-600 ml-4">
                    {(room.price / 1000).toFixed(0)}K
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right column - Room types */}
          <div className="space-y-10 pt-16">
            {rightItems.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 3) * 0.15 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f3ede4', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden mb-4">
                  <ImageWithFallback
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {String(idx + 4).padStart(2, '0')}
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <span>{room.area}m²</span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{room.maxGuests} khách</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {room.amenities.slice(0, 3).map(a => a.name).join(' · ')}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-amber-600 ml-4">
                    {(room.price / 1000).toFixed(0)}K
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
