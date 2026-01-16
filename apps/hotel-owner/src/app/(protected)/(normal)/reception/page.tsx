'use client';
import { useState, useEffect } from 'react';
import ReceptionOperationsTable from '../../../../features/reception/components/ReceptionOperationsTable';
import CreateBookingModal from '../../../../features/reception/components/CreateBookingModal';
import { useLoading, useNotification } from '@repo/ui';
import { Plus } from '@repo/ui/icons';
import { motion } from '@repo/ui/motion';

export default function ReceptionPage() {
  const { hide } = useLoading();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    hide();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  if (isLoading) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-anton font-bold text-[#1A1A1A] mb-2">Reception Desk</h1>
          <p className="text-gray-500 font-medium text-lg">Manage bookings, check-ins, check-outs and guest requests.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#000000' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-[#1A1A1A] text-white transition-all flex items-center gap-3 shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.18)]"
        >
          <div className="bg-lime-400 p-1 rounded-lg text-[#1A1A1A]">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wide pr-1">New Walk-in Booking</span>
        </motion.button>
      </div>

      {/* Main Table Content - Full Width */}
      <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <ReceptionOperationsTable key={refreshKey} />
      </div>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
          showNotification({ message: 'New booking created successfully', type: 'success', format: 'Tạo đặt phòng thành công' });
        }}
      />
    </div>
  );
}
