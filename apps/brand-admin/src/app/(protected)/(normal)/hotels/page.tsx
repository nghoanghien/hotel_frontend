
'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Plus, Map, Building2 } from '@repo/ui/icons';
import { useNotification } from '@repo/ui';
import HotelsTable from '../../../../features/hotels/components/HotelsTable';
import CreateHotelModal from '../../../../features/hotels/components/CreateHotelModal';
import HotelMapModal from '../../../../features/hotels/components/HotelMapModal';
import { hotelService, HotelWithLocation } from '../../../../features/hotels/services/hotelService';

export default function HotelsPage() {
  const [data, setData] = useState<HotelWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapFocusedHotel, setMapFocusedHotel] = useState<HotelWithLocation | undefined>(undefined);

  const { showNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await hotelService.getBrandHotels('brand-1');
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load hotels', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateSuccess = () => {
    handleRefresh();
  };

  const handleOpenMap = (hotel?: HotelWithLocation) => {
    setMapFocusedHotel(hotel);
    setIsMapModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1800px] mx-auto">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Building2 size={12} />
              Management Console
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Hotel Operations
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage your hotel locations, view analytics and status.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenMap(undefined)}
            className="relative h-12 px-5 rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-500 hover:text-blue-700 font-bold text-sm transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
          >
            <Map size={18} />
            <span>Map View</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm font-bold uppercase tracking-wide">Add New Hotel</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <HotelsTable
          data={data}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewMap={handleOpenMap}
        />
      </div>

      {/* Modals */}
      <CreateHotelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brandId="brand-1"
        onSuccess={handleCreateSuccess}
      />

      <HotelMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        hotels={data}
      />

    </div>
  );
}
