import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { Star, Users, MapPin } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

// Layout 5: Full-bleed spread with overlapping elements
export default function MagazineLayout5({ hotel }: Props) {
  const mainRoom = hotel.roomTypes[0];
  const sideRooms = hotel.roomTypes.slice(1, Math.min(3, hotel.roomTypes.length));
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
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }}
        className="relative max-w-[1200px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        {/* Page title block */}
        <div className="bg-gray-900 text-white px-12 py-8 mb-12">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                P.{Math.floor(Math.random() * 50) + 10}
              </div>
              <h2 className="text-6xl font-black leading-none" style={{ fontFamily: 'serif' }}>
                {hotel.name}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-600'}`} />
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{hotel.address.city}</span>
            <span>·</span>
            <span>{hotel.reviewCount} đánh giá</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Featured room - spans 2 columns */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="col-span-2 relative z-10 cursor-pointer">
            <div className="relative">
              <div className="relative aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={mainRoom.images[0]}
                  alt={mainRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Overlapping label */}
              <div className="absolute -bottom-6 left-8 bg-white px-8 py-4 shadow-xl">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Featured</div>
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {mainRoom.name}
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{mainRoom.area}m²</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{mainRoom.maxGuests} khách</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">
                    {(mainRoom.price / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-10 bg-amber-50 px-8 py-6 border-l-4 border-amber-400">
              <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-2">Tiện nghi nổi bật</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {mainRoom.amenities.slice(0, 5).map(a => a.name).join(' · ')}
              </p>
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-8">
            <div className="bg-amber-50 p-6">
              <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-3">
                Loại phòng khác
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {hotel.roomTypes.length} loại phòng với đầy đủ tiện nghi
              </p>
            </div>

            {sideRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f3ede4', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden mb-2 rounded-lg">
                  <ImageWithFallback
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold mb-1">{room.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 text-xs flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    {room.maxGuests} khách · {room.area}m²
                  </span>
                  <span className="font-bold text-amber-600 ml-2">
                    {(room.price / 1000).toFixed(0)}K
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-8">
          {hotel.imageUrls.slice(1, 5).map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
              className="group cursor-pointer relative z-10"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-3 rounded-lg">
                <ImageWithFallback
                  src={img}
                  alt={`${hotel.name} - ${idx + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
