import React from 'react';
import { motion } from 'framer-motion';

const HotelCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
  // Shimmer animation variants
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  // Shimmer card component - FOR FAVORITES
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="relative bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.1,
          duration: 0.6,
          type: "spring",
          damping: 15,
          stiffness: 100,
        }}
      >
        {/* Image */}
        <motion.div
          className="relative aspect-[16/9] bg-gray-200"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        >
          {/* Heart Badge (Top Right) */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <motion.div
              className="w-8 h-8 md:w-10 md:h-10 bg-white/80 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Rating Badge (Top Left) */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4">
            <motion.div
              className="h-5 w-12 md:h-7 md:w-16 bg-white/80 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Info Overlay (Bottom) */}
          <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 space-y-1 md:space-y-2">
            <motion.div
              className="h-4 md:h-6 w-3/4 bg-white/60 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="h-3 md:h-4 w-1/2 bg-white/60 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>

        </motion.div>

        {/* Content */}
        <div className="p-3 md:p-5 flex flex-col flex-1">

          {/* Brand Tag */}
          <div className="mb-2 md:mb-3">
            <motion.div
              className="h-4 w-16 md:h-5 md:w-20 bg-gray-100 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-x-2 md:gap-x-4 gap-y-1.5 md:gap-y-2 mb-3 md:mb-4 flex-wrap">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-3 w-12 md:h-4 md:w-16 bg-gray-100 rounded-full"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>

          {/* Footer: Price & Button */}
          <div className="flex items-end justify-between pt-3 md:pt-4 border-t border-gray-100 mt-auto gap-2 md:gap-3">
            <div className="space-y-1">
              <motion.div className="h-2 w-12 md:h-3 md:w-16 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" />
              <motion.div className="h-5 w-24 md:h-6 md:w-32 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" />
            </div>
            <motion.div className="h-8 w-12 md:h-9 md:w-24 bg-gray-200 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`hotel-shimmer-${index}`} index={index} />
      ))}
    </>
  );
};

export default HotelCardShimmer;
