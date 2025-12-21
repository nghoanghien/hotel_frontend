import { motion } from '@repo/ui/motion';
import type { Hotel } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Users } from '@repo/ui/icons';

interface Props {
  hotel: Hotel;
}

export default function MagazineLayout6({ hotel }: Props) {
  // Tạo items từ rooms + amenities
  const rooms = hotel.roomTypes.slice(0, 10);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="bg-white rounded-sm overflow-hidden shadow-lg mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết khách sạn'); router.push(`/hotels/${hotel.slug}?${searchParams.toString()}`); }, 300); }}
        className="relative flex min-h-[800px] cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1 })} className="w-[140px] bg-white border-r border-gray-300 flex items-start justify-center pt-8 relative z-10 cursor-pointer">
          <h1
            className="text-[68px] font-bold text-[#3C3C3C] leading-none"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            {hotel.name}
          </h1>
        </div>

        <div className="relative flex-1 flex flex-col">
          {/* Row 1 - Single large item */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f5efe6', opacity: 1 })} className="border-b border-gray-300 p-8 flex-shrink-0  relative z-10 cursor-pointer" style={{ height: '550px' }}>
            <div className="flex gap-8 h-full">
              <div className="flex-1 flex items-center">
                <div className="flex items-start gap-4">
                  <span className="text-[64px] font-bold text-[#C9A574] leading-none">1</span>
                  <div className="pt-2">
                    <h3 className="text-[24px] font-bold text-[#2C2C2C] mb-2">{rooms[0]?.name}</h3>
                    <p className="text-[14px] text-[#666] leading-relaxed mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      {rooms[0]?.maxGuests} khách · {rooms[0]?.area}m²
                    </p>
                    <p className="text-[16px] font-bold text-amber-600">{(rooms[0]?.price / 1000).toFixed(0)}K/đêm</p>
                  </div>
                </div>
              </div>
              <div className="relative flex-shrink-0" style={{ width: '80%', height: '100%' }}>
                <ImageWithFallback
                  src={rooms[0]?.images[0] || ''}
                  alt={rooms[0]?.name || ''}
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Row 2 - 4 columns */}
          <div className="grid grid-cols-4 border-b border-gray-300 flex-shrink-0" style={{ height: '240px' }}>
            {rooms.slice(1, 5).map((room, idx) => (
              <div
                key={room?.id}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f6f1e7', opacity: 1 })}
                className={`relative z-10 cursor-pointer p-5 ${idx < 3 ? 'border-r border-gray-300' : ''} flex flex-col`}
              >
                <div className="text-[42px] font-bold text-[#C9A574] leading-none mb-3">{idx + 2}</div>
                <div className="relative mb-3 flex-shrink-0" style={{ height: '110px' }}>
                  <ImageWithFallback
                    src={room?.images[0]}
                    alt={room?.name}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <h3 className="text-[14px] font-bold text-[#2C2C2C] leading-tight mb-1">{room?.name}</h3>
                <p className="text-[11px] text-[#666] leading-snug">{(room?.price / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>

          {/* Row 3 & 4 */}
          {[{ start: 5, end: 7, nums: [6, 7] }, { start: 7, end: 9, nums: [8, 9] }].map((row, rowIdx) => (
            <div key={rowIdx} className={`grid grid-cols-2 ${rowIdx === 0 ? 'border-b border-gray-300' : ''} flex-shrink-0`} style={{ height: '190px' }}>
              {rooms.slice(row.start, row.end).map((room, idx) => (
                <div
                  key={room?.id}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 14, backgroundColor: rowIdx === 0 ? '#f3ede4' : '#f6efe6', opacity: 1 })}
                  className={`relative z-10 cursor-pointer p-6 ${idx === 0 ? 'border-r border-gray-300' : ''}`}
                >
                  <div className="flex gap-5 h-full">
                    <div className="relative flex-shrink-0" style={{ width: '140px', height: '140px' }}>
                      <ImageWithFallback
                        src={room?.images[0]}
                        alt={room?.name}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-[42px] font-bold text-[#C9A574] leading-none mb-2">{row.nums[idx]}</div>
                      <h3 className="text-[16px] font-bold text-[#2C2C2C] leading-tight mb-2">{room?.name}</h3>
                      <p className="text-[12px] text-[#666]">{(room?.price / 1000).toFixed(0)}K/đêm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}