import { motion } from "framer-motion";

export default function RoomDetailModalShimmer() {
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

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
  };

  const lightShimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] w-full h-full overflow-hidden rounded-[40px] border border-white/20 bg-[#F7F7F7]">
      {/* Left Column: Info */}
      <div className="p-8 pt-12 border-r border-gray-100 flex flex-col h-full bg-[#F7F7F7] relative">
        <div className="mt-2 space-y-6">
          {/* Hotel Name */}
          <motion.div
            className="h-4 w-1/3 bg-gray-200 rounded"
            variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle}
          />

          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              {/* Room Number Title */}
              <motion.div
                className="h-12 w-1/2 bg-gray-200 rounded-lg"
                variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle}
              />
              {/* Status Badge */}
              <motion.div
                className="h-8 w-24 bg-gray-200 rounded-full"
                variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle}
              />
            </div>
            {/* Room Type */}
            <motion.div
              className="h-6 w-1/4 bg-gray-200 rounded"
              variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle}
            />
          </div>

          {/* Price */}
          <div className="pt-2">
            <motion.div
              className="h-10 w-1/3 bg-gray-200 rounded-lg"
              variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 h-24 flex flex-col justify-center gap-2">
                <motion.div className="w-6 h-6 rounded bg-gray-100" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
                <motion.div className="h-5 w-1/2 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
                <motion.div className="h-3 w-1/3 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
              </div>
            ))}
          </div>

          {/* Description Lines */}
          <div className="space-y-3 p-5 bg-white rounded-3xl border border-gray-100">
            <motion.div className="h-4 w-1/4 bg-gray-200 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-3 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
            <motion.div className="h-3 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
            <motion.div className="h-3 w-2/3 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={lightShimmerStyle} />
          </div>
        </div>
      </div>

      {/* Right Column: Gallery */}
      <div className="h-full bg-gray-200 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle}
        />

        {/* Thumbnails Placeholder */}
        <div className="absolute bottom-8 left-8 flex gap-3 z-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-20 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
