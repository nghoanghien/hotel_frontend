import { HotelDetailDto, AmenityDto } from '@repo/types';
import { motion } from '@repo/ui/motion';
import { AmenityIcon } from '@repo/ui';

interface Props {
  amenities: AmenityDto[];
}

export default function HotelAmenities({ amenities }: Props) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-6 uppercase">Amenities & Services</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-3 text-center group hover:bg-[#1A1A1A] hover:border-[#1A1A1A] transition-colors duration-300 cursor-default"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#1A1A1A] group-hover:text-[#1A1A1A]">
              <AmenityIcon amenityName={item.name} className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-600 group-hover:text-white transition-colors">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
