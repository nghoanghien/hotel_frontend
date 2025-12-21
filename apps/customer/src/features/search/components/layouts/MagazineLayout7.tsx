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

export default function MagazineLayout7({ hotel }: Props) {
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-16 px-4">
      <div className="max-w-[1100px] mx-auto">
        <div ref={setRefs} onMouseLeave={clearHover} onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }} className="relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden cursor-pointer">
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          <div className="relative aspect-[21/9] overflow-hidden" onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: '#fef3c7', opacity: 0.3, scaleEnabled: false })}>
            <ImageWithFallback src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" />
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'serif' }}>{hotel.name}</h2>
                <div className="flex items-center gap-3 mb-4">
                  {[...Array(5)].map((_, i) => (<Star key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />))}
                  <span className="text-gray-600">({hotel.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{hotel.address.fullAddress}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.amenities.slice(0, 8).map(a => (<div key={a.id} className="flex items-center gap-2 text-sm text-gray-700"><div className="w-2 h-2 rounded-full bg-amber-500" /><span>{a.name}</span></div>))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Loại phòng</div>
                <div className="space-y-4">
                  {hotel.roomTypes.map(room => (<div key={room.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0"><div><div className="font-semibold text-gray-900">{room.name}</div><div className="text-xs text-gray-500">{room.area}m² · {room.maxGuests} khách</div></div><div className="text-right"><div className="font-bold text-amber-600">{(room.price / 1000).toFixed(0)}K</div><div className="text-xs text-gray-500">/đêm</div></div></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}