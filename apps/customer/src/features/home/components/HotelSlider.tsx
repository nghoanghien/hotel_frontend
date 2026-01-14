'use client';

import { motion, AnimatePresence, PanInfo } from '@repo/ui/motion';
import type { HotelDetailDto as Hotel } from '@repo/types';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';

interface HotelSliderProps {
  hotels: Hotel[];
  activeIndex: number;
  onHotelChange: (index: number) => void;
}

export default function HotelSlider({
  hotels,
  activeIndex,
  onHotelChange,
}: HotelSliderProps) {
  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? hotels.length - 1 : activeIndex - 1;
    onHotelChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === hotels.length - 1 ? 0 : activeIndex + 1;
    onHotelChange(newIndex);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const momentumDistance = velocity * 0.08;
    const totalDistance = dragDistance + momentumDistance;

    if (Math.abs(totalDistance) > 40) {
      if (totalDistance > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
  };

  // Get 3 visible items with circular indexing
  const getVisibleHotels = () => {
    const visible = [];
    const total = hotels.length;

    for (let i = -1; i <= 1; i++) {
      let index = activeIndex + i;

      if (index < 0) index = total + index;
      if (index >= total) index = index - total;

      visible.push({
        hotel: hotels[index],
        position: i === -1 ? 'left' : i === 0 ? 'center' : 'right',
        actualIndex: index,
      });
    }

    return visible;
  };

  const visibleHotels = getVisibleHotels();

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="relative flex items-center justify-center gap-12">
        <motion.button
          whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors z-30"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </motion.button>

        <div className="relative w-full max-w-5xl h-[380px] flex items-start justify-center overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            className="relative w-full h-full flex items-start justify-center cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="popLayout">
              <div className="flex items-start justify-center gap-4 w-full">
                {visibleHotels.map(({ hotel, position, actualIndex }) => {
                  const isCenter = position === 'center';
                  const centerWidth = 340;
                  const sideWidth = 290;
                  const baseWidth = isCenter ? centerWidth : sideWidth;
                  const imageHeight = Math.round(baseWidth / 1.85);

                  return (
                    <motion.div
                      key={`${hotel.id}-${actualIndex}`}
                      layoutId={`hotel-card-${hotel.id}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{
                        scale: isCenter ? 1.0 : 0.92,
                        opacity: isCenter ? 1.0 : 1.0,
                        zIndex: isCenter ? 20 : 10,
                      }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                      onClick={() =>
                        !isCenter && onHotelChange(actualIndex)
                      }
                      className={`${isCenter ? "" : "cursor-pointer"} flex-shrink-0 origin-top`}
                      style={{
                        width: isCenter ? `${centerWidth}px` : `${sideWidth}px`,
                        transformOrigin: "top center",
                      }}
                    >
                      <div className="flex flex-col">
                        <div
                          className="relative w-full rounded-xl overflow-hidden shadow-2xl"
                          style={{ height: `${imageHeight}px` }}
                        >
                          <ImageWithFallback
                            src={hotel.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <AnimatePresence mode="wait">
                          {isCenter && (
                            <motion.div
                              key={`info-${hotel.id}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.33, 1, 0.68, 1],
                              }}
                              className="mt-5 text-left"
                            >
                              <h3
                                className="font-anton text-[clamp(20px,2.8vw,26px)] font-semibold text-white uppercase tracking-[0.05em] leading-none mb-3"
                                style={{
                                  fontStretch: "condensed",
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {hotel.name}
                              </h3>
                              <p className="text-[12px] text-gray-300 leading-relaxed mb-4 line-clamp-3">
                                {hotel.description}
                              </p>
                              <p className="text-[11px] text-[var(--primary)] mb-4 font-semibold uppercase tracking-wider">
                                {hotel.city}, {hotel.country}
                              </p>
                              <motion.button
                                whileHover={{
                                  scale: 1.06,
                                  backgroundColor: "rgba(255, 255, 255, 0.24)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2.5 rounded-full text-[13px] font-bold text-white transition-colors uppercase tracking-[0.12em]"
                              >
                                KHÁM PHÁ
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors z-30"
        >
          <ChevronRight className="w-7 h-7 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
