import { HotelDetailDto } from '@repo/types';
import { Star, MapPin, Edit } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import { motion } from '@repo/ui/motion';

interface Props {
  hotel: HotelDetailDto;
}

export default function HotelHero({ hotel }: Props) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={hotel.imageUrl || ''}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-400 text-[#1A1A1A] rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-lime-400/20">
            {hotel.brandName}
          </div>

          <h1 className="text-4xl md:text-6xl font-anton text-white mb-4 leading-tight shadow-sm">
            {hotel.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90">
            {/* Stars */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-sm">{hotel.starRating} Stars</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-[#1A1A1A] border border-white/20 rounded-md text-sm font-bold text-white">
                {hotel.averageRating}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/70">{hotel.reviewCount} Reviews</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-white/70" />
              <span className="text-white/90">{hotel.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        {/* <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-white text-[#1A1A1A] rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-gray-50 transition-colors"
        >
          <Edit size={18} />
          <span>Edit Info</span>
        </motion.button> */}
      </div>
    </div>
  );
}
