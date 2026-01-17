'use client';

import { useEffect, useState } from 'react';
import { hotelService } from '@/features/hotel/services/hotelService';
import { HotelDetailDto } from '@repo/types';
import HotelHero from '@/features/hotel/components/HotelHero';
import HotelOverview from '@/features/hotel/components/HotelOverview';
import HotelAmenities from '@/features/hotel/components/HotelAmenities';
import HotelPolicies from '@/features/hotel/components/HotelPolicies';
import { LoadingSpinner, ImageWithFallback } from '@repo/ui';
import { motion } from '@repo/ui/motion';

export default function HotelProfilePage() {
  const [hotel, setHotel] = useState<HotelDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await hotelService.getHotelDetails('hotel-1');
        setHotel(data);
      } catch (error) {
        console.error('Failed to fetch hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size={40} color="#1A1A1A" />
        <p className="text-gray-500 font-medium">Loading hotel profile...</p>
      </div>
    );
  }

  if (!hotel) {
    return <div className="p-8 text-center">Hotel not found</div>;
  }

  return (
    <div className="min-h-full p-8 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Hero Section */}
      <HotelHero hotel={hotel} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">

        {/* Row 1: Overview & Amenities */}
        <div className="xl:col-span-2 flex flex-col">
          <HotelOverview hotel={hotel} />
        </div>

        <div className="xl:col-span-1 flex flex-col">
          <HotelAmenities amenities={hotel.amenities} />
        </div>

        {/* Row 2: Gallery & Policies */}
        <div className="xl:col-span-2 flex flex-col">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase">Gallery</h3>
              <button className="text-sm font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors">View All Photos</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-h-[300px]">
              {hotel.images.filter(img => !img.isPrimary).slice(0, 5).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                >
                  <ImageWithFallback
                    src={img.imageUrl}
                    alt={img.caption || 'Hotel Image'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  {img.caption && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                      {img.caption}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col">
          <HotelPolicies hotel={hotel} />
        </div>
      </div>
    </div>
  );
}
