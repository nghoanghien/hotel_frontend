import React from 'react';
import { motion } from 'framer-motion';

const CurrentBookingsDrawerShimmer = () => {
  const shimmerVariants = {
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

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-[25%_40%_35%] flex-1 overflow-hidden h-full bg-white">
      {/* List Column Shimmer */}
      <div className="order-1 md:order-none w-full md:w-auto overflow-hidden flex md:block border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0 bg-white md:h-full p-4 md:p-0">
        <div className="flex md:flex-col gap-4 md:gap-0 md:divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-[300px] md:w-full md:p-4 flex gap-3 items-start">
              <motion.div
                className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={shimmerStyle}
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <motion.div className="h-4 w-24 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                  <motion.div className="h-4 w-12 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                </div>
                <motion.div className="h-3 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                <motion.div className="h-3 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Column Shimmer - Detailed Abstract Map */}
      <div className="order-2 md:order-none relative h-[25vh] md:h-full w-full flex-shrink-0 bg-[#f8fafc] border-r border-gray-100 flex items-center justify-center overflow-hidden">
        {/* Abstract Map Background Elements */}
        <div className="absolute inset-0">
          {/* Parks */}
          <div className="absolute top-[15%] left-[10%] w-32 h-24 bg-green-50/80 rounded-xl transform -rotate-6" />
          <div className="absolute bottom-[20%] right-[15%] w-40 h-32 bg-green-50/80 rounded-2xl transform rotate-12" />

          {/* Water */}
          <div className="absolute top-[40%] right-[-10%] w-64 h-64 bg-blue-50/60 rounded-full blur-3xl" />

          {/* Roads Grid */}
          <div className="absolute inset-0 opacity-40">
            {/* Horizontal Roads */}
            <div className="absolute top-[30%] left-0 right-0 h-3 bg-white border-y border-gray-200" />
            <div className="absolute top-[60%] left-0 right-0 h-4 bg-white border-y border-gray-200" />

            {/* Vertical Roads */}
            <div className="absolute top-0 bottom-0 left-[40%] w-3 bg-white border-x border-gray-200" />
            <div className="absolute top-0 bottom-0 right-[35%] w-4 bg-white border-x border-gray-200" />

            {/* Diagonal Highway */}
            <div className="absolute top-[20%] left-[-20%] w-[150%] h-6 bg-white border-y border-gray-200 transform rotate-[25deg] origin-left" />
          </div>
        </div>

        {/* Animated Markers */}
        <div className="absolute inset-0 z-10">
          {/* Hotel Marker (Primary Color) */}
          <div className="absolute top-[45%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative w-14 h-14 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center z-20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[var(--primary)]" />
              </div>
            </motion.div>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/5 rounded-full blur-[2px]" />
          </div>
        </div>

        {/* Overlay Shimmer for dynamic feel */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Detail Column Shimmer */}
      <div className="order-3 md:order-none relative flex-1 overflow-hidden px-6 py-6 bg-white border-l border-gray-100">
        <div className="space-y-6">
          <div className="space-y-2">
            <motion.div className="h-6 w-32 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-8 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-4 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>

          <div className="py-4">
            <motion.div className="h-2 w-full bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <div className="flex justify-between mt-2">
              <motion.div className="h-3 w-12 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-3 w-12 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-3 w-12 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>

          <div className="p-5 border border-gray-100 rounded-[24px]">
            <motion.div className="h-6 w-40 bg-gray-100 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <div className="space-y-4">
              <div className="flex gap-4">
                <motion.div className="h-12 w-12 rounded-xl bg-gray-100" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                <div className="flex-1 space-y-2">
                  <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                  <motion.div className="h-3 w-2/3 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                </div>
              </div>
              <motion.div className="h-16 w-full bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div className="h-12 w-full bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-12 w-full bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentBookingsDrawerShimmer;
