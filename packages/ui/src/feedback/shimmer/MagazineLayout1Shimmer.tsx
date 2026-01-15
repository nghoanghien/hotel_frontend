import React from 'react';
import { motion } from 'framer-motion';

// Shimmer Styles Constants
const SHIMMER_GRADIENT = 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)';
const SHIMMER_ANIMATION = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

const ShimmerBlock = ({ className, rounded = "rounded-lg" }: { className?: string, rounded?: string }) => (
  <motion.div
    className={`bg-gray-100 ${className} ${rounded}`}
    variants={SHIMMER_ANIMATION}
    initial="initial"
    animate="animate"
    style={{
      background: SHIMMER_GRADIENT,
      backgroundSize: '200% 100%',
    }}
  />
);

export const MagazineLayout1Shimmer = () => {
  return (
    <div className="mb-24 px-2 md:px-0">
      <div className="max-w-[1240px] mx-auto">
        {/* Title Section Shimmer */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            {/* Title - Large Text */}
            <ShimmerBlock className="h-14 md:h-16 w-3/4 md:w-1/2" rounded="rounded-2xl" />

            {/* Meta info right side */}
            <div className="flex items-center gap-4 pb-2 justify-center md:justify-start">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <ShimmerBlock key={i} className="w-4 h-4" rounded="rounded-sm" />
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-gray-200" />

              {/* Location */}
              <ShimmerBlock className="w-32 h-4" />

              {/* Divider */}
              <div className="w-px h-4 bg-gray-200" />

              {/* Brand */}
              <ShimmerBlock className="w-24 h-4" />
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="h-px w-full bg-gray-100" />
        </div>

        <div className="relative grid grid-cols-12 gap-8">
          {/* Main Image Shimmer (Col 8) */}
          <div className="col-span-12 md:col-span-8">
            <div className="aspect-[16/10] relative overflow-hidden rounded-[32px] bg-gray-50 border border-gray-100 p-1">
              <ShimmerBlock className="w-full h-full" rounded="rounded-[28px]" />

              {/* Floating Badge Shimmer */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/50 shadow-lg z-10 w-48 space-y-2">
                <ShimmerBlock className="w-20 h-3" />
                <ShimmerBlock className="w-32 h-8" />
              </div>
            </div>
          </div>

          {/* Side Info Shimmer (Col 4) */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between py-2 space-y-8">
            <div>
              {/* Highlights Header */}
              <ShimmerBlock className="w-24 h-5 mb-4" />

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <ShimmerBlock className="w-24 h-8" rounded="rounded-lg" />
                <ShimmerBlock className="w-20 h-8" rounded="rounded-lg" />
                <ShimmerBlock className="w-28 h-8" rounded="rounded-lg" />
                <ShimmerBlock className="w-16 h-8" rounded="rounded-lg" />
                <ShimmerBlock className="w-24 h-8" rounded="rounded-lg" />
                <ShimmerBlock className="w-20 h-8" rounded="rounded-lg" />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <ShimmerBlock className="w-full h-4" />
                <ShimmerBlock className="w-full h-4" />
                <ShimmerBlock className="w-[90%] h-4" />
                <ShimmerBlock className="w-[95%] h-4" />
                <ShimmerBlock className="w-[85%] h-4" />
              </div>
            </div>

            {/* Rating Box Shimmer */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <ShimmerBlock className="w-16 h-4" />
                <ShimmerBlock className="w-24 h-8" />
              </div>

              {/* Progress Bar */}
              <ShimmerBlock className="w-full h-2" rounded="rounded-full mb-3" />

              <div className="flex justify-end mb-6">
                <ShimmerBlock className="w-32 h-3" />
              </div>

              {/* Button */}
              <ShimmerBlock className="w-full h-14" rounded="rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
