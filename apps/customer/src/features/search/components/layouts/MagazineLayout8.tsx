import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { Star, MapPin } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

export default function MagazineLayout8({ hotel }: Props) {
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div ref={setRefs} onMouseLeave={clearHover} onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }} className="relative cursor-pointer">
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 row-span-2 relative aspect-[4/5] rounded-3xl overflow-hidden" onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: '#fef3c7', opacity: 0.4, scaleEnabled: true, scale: 1.03 })}>
              <ImageWithFallback src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" />
            </div>
            <div className="col-span-5 bg-gray-50 rounded-3xl p-6">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">{hotel.categories[0]?.name}</div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'serif' }}>{hotel.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />))}
                <span className="text-sm text-gray-500">({hotel.reviewCount})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4"><MapPin className="w-4 h-4" /><span className="line-clamp-1">{hotel.address.city}</span></div>
              <div className="bg-white rounded-2xl p-4"><div className="text-xs text-gray-500 mb-1">Giá từ</div><div className="text-3xl font-bold text-amber-600">{(Math.min(...hotel.roomTypes.map(r => r.price)) / 1000).toFixed(0)}K<span className="text-lg text-gray-500">/đêm</span></div></div>
            </div>
            <div className="col-span-5 grid grid-cols-2 gap-4">
              {hotel.imageUrls.slice(1, 3).map((img, idx) => (<div key={idx} className="relative aspect-square rounded-2xl overflow-hidden" onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: '#fef3c7', opacity: 0.4, scaleEnabled: true, scale: 1.05 })}><ImageWithFallback src={img} alt={`${hotel.name} - ${idx + 2}`} fill className="object-cover" /></div>))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}