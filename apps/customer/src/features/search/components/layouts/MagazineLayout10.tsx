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

export default function MagazineLayout10({ hotel }: Props) {
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-12 px-4">
      <div className="max-w-[900px] mx-auto">
        <div ref={setRefs} onMouseLeave={clearHover} onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }} className="relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-4 grid grid-cols-2 gap-1 p-1">
              {hotel.imageUrls.slice(0, 4).map((img, idx) => (<div key={idx} className="relative aspect-square rounded-lg overflow-hidden" onMouseEnter={(e) => moveHighlight(e, { borderRadius: 8, backgroundColor: '#fef3c7', opacity: 0.5, scaleEnabled: true, scale: 1.05 })}><ImageWithFallback src={img} alt={`${hotel.name} - ${idx + 1}`} fill className="object-cover" /></div>))}
            </div>
            <div className="col-span-5 p-6">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'serif' }}>{hotel.name}</h2>
              <div className="flex items-center gap-2 mb-3">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />))}<span className="text-sm text-gray-500">({hotel.reviewCount})</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4"><MapPin className="w-4 h-4" /><span className="line-clamp-1">{hotel.address.city}</span></div>
              <div className="space-y-2">
                {hotel.roomTypes.slice(0, 2).map(room => (<div key={room.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"><div><div className="font-semibold text-gray-900 text-xs">{room.name}</div><div className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{room.maxGuests} · {room.area}m²</div></div><div className="font-bold text-amber-600">{(room.price / 1000).toFixed(0)}K</div></div>))}
              </div>
            </div>
            <div className="col-span-3 bg-amber-50 p-6 flex flex-col justify-center">
              <div className="text-xs text-amber-700 mb-2">Từ</div>
              <div className="text-4xl font-bold text-amber-900 mb-1">{(Math.min(...hotel.roomTypes.map(r => r.price)) / 1000).toFixed(0)}K</div>
              <div className="text-xs text-amber-700 mb-4">/đêm</div>
              <div className="flex flex-wrap gap-1">{hotel.amenities.slice(0, 3).map(a => (<span key={a.id} className="text-xs text-amber-800">{a.name}</span>)).reduce((prev, curr, idx) => [prev, <span key={`sep-${idx}`} className="text-amber-400">·</span>, curr] as any)}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}