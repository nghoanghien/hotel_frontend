import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { Star, MapPin, Users } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

// Layout 4: Table of Contents style with room listings
export default function MagazineLayout4({ hotel }: Props) {
  // Chia rooms thành 2 nhóm
  const leftRooms = hotel.roomTypes.slice(0, Math.ceil(hotel.roomTypes.length / 2));
  const rightRooms = hotel.roomTypes.slice(Math.ceil(hotel.roomTypes.length / 2));
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
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b-2 border-gray-900">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Room Selection</div>
          <h2 className="text-6xl font-black mb-4" style={{ fontFamily: 'serif' }}>
            {hotel.name}
          </h2>
          <div className="flex items-center justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
            ))}
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{hotel.address.city}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          {hotel.description}
        </p>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }}
          className="relative grid grid-cols-2 gap-16 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Left column */}
          {leftRooms.length > 0 && (
            <div>
              <div className="mb-8">
                <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  Loại Phòng
                </h3>
                <div className="w-16 h-1 bg-amber-500" />
              </div>

              <div className="space-y-6">
                {leftRooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                    className="flex gap-4 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={room.images[0]}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{room.name}</h4>
                        <span className="text-amber-600 font-bold ml-3">
                          {(room.price / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <span>{room.area}m²</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{room.maxGuests} khách</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {room.amenities.slice(0, 3).map(a => a.name).join(' · ')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Right column */}
          {rightRooms.length > 0 && (
            <div>
              <div className="mb-8">
                <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  Tiện Nghi
                </h3>
                <div className="w-16 h-1 bg-amber-500" />
              </div>

              <div className="space-y-6">
                {rightRooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                    className="flex gap-4 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={room.images[0]}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{room.name}</h4>
                        <span className="text-amber-600 font-bold ml-3">
                          {(room.price / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <span>{room.area}m²</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{room.maxGuests} khách</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {room.amenities.slice(0, 3).map(a => a.name).join(' · ')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
