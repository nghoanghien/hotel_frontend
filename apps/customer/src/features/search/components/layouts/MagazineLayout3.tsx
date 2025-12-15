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

// Layout 3: "Look At This" feature style
export default function MagazineLayout3({ hotel }: Props) {
  const heroRoom = hotel.roomTypes[0];
  const secondaryRooms = hotel.roomTypes.slice(1, 4);
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
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}`); }, 300); }}
        className="relative max-w-[1200px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        <div className="grid grid-cols-12 gap-12">
          {/* Left: Editorial text */}
          <div className="col-span-5 flex flex-col justify-center">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-6">
              <span className="inline-block w-12 h-px bg-gray-300 mr-3 align-middle" />
              Featured
            </div>

            <h2 className="text-8xl font-black leading-none mb-6" style={{ fontFamily: 'serif' }}>
              Look<br />
              At This<br />
              <span className="italic">Hotel</span>
            </h2>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">{hotel.name}</h3>
              <div className="flex items-center gap-3 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500">({hotel.reviewCount})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{hotel.address.city}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Quote callout */}
            <div className="border-l-4 border-amber-500 pl-6 py-4 bg-amber-50/50">
              <p className="text-sm italic text-gray-700">
                &quot;{hotel.categories[0]?.name || 'Luxury accommodation'} với {hotel.amenities.length}+ tiện nghi cao cấp&quot;
              </p>
            </div>
          </div>

          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="col-span-7 relative z-10 cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden mb-6">
              <ImageWithFallback
                src={heroRoom.images[0]}
                alt={heroRoom.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-4 mb-3">
                <h3 className="text-4xl font-bold flex-1" style={{ fontFamily: 'serif' }}>
                  {heroRoom.name}
                </h3>
                <span className="text-3xl font-bold text-amber-600">
                  {(heroRoom.price / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span>{heroRoom.area}m²</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{heroRoom.maxGuests} khách</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {heroRoom.amenities.slice(0, 4).map(a => a.name).join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row - secondary rooms */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
          {secondaryRooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f3ede4', opacity: 1, scaleEnabled: true, scale: 1.12 })}
              className="relative z-10 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden mb-3">
                <ImageWithFallback
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-lg mb-1">{room.name}</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 flex-1">
                  {room.area}m² · {room.maxGuests} khách
                </p>
                <span className="text-lg font-bold text-amber-600 ml-3">
                  {(room.price / 1000).toFixed(0)}K
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
