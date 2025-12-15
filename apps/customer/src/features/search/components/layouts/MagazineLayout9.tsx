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

export default function MagazineLayout9({ hotel }: Props) {
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-16 px-4">
      <div className="max-w-[1300px] mx-auto">
        <div ref={setRefs} onMouseLeave={clearHover} onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}`); }, 300); }} className="relative cursor-pointer">
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          <div className="flex gap-8 items-center">
            <div className="flex-shrink-0 w-80"><div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4" onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: '#fef3c7', opacity: 0.5, scaleEnabled: true, scale: 1.05 })}><ImageWithFallback src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" /></div></div>
            <div className="flex-1">
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-2">{hotel.categories[0]?.name}</div>
                <h2 className="text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'serif' }}>{hotel.name}</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />))}</div>
                  <span className="text-gray-600">({hotel.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-6"><MapPin className="w-4 h-4" /><span>{hotel.address.city}</span></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {hotel.roomTypes.slice(0, 3).map(room => (<div key={room.id} className="bg-gray-50 rounded-xl p-4"><div className="font-semibold text-gray-900 mb-1 line-clamp-1">{room.name}</div><div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Users className="w-3 h-3" />{room.maxGuests} khách</div><div className="font-bold text-amber-600">{(room.price / 1000).toFixed(0)}K/đêm</div></div>))}
                </div>
                <div className="flex flex-wrap gap-2">{hotel.amenities.slice(0, 6).map(a => (<span key={a.id} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">{a.name}</span>))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}