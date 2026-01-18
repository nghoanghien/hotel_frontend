'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Users, Plus } from '@repo/ui/icons';
import { useNotification, LoadingSpinner } from '@repo/ui';
import BrandList from '../../../../features/brand-partners/components/BrandList';
import CreateBrandModal from '../../../../features/brand-partners/components/CreateBrandModal';
import OnboardingListModal from '../../../../features/brand-partners/components/OnboardingListModal';
import { brandPartnersService } from '../../../../features/brand-partners/services/brandPartnersService';

export default function BrandPartnersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]); // Re-fetch stats when data changes

  const fetchStats = async () => {
    try {
      const stats = await brandPartnersService.getStats();
      setPendingCount(stats.pending);
    } catch (e) { }
  }

  const handleCreateSuccess = () => {
    showNotification({ message: 'Brand created', type: 'success' });
    handleRefresh();
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider">
              Management Console
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Partner Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage hotel brands and review new partner applications.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="relative h-12 px-5 rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-lime-500 hover:bg-lime-50 text-gray-500 hover:text-lime-700 font-bold text-sm transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
          >
            <Users size={18} />
            <span>Requests</span>
            {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{pendingCount}</span>}
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm font-bold uppercase tracking-wide">Create Brand</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <BrandList refreshTrigger={refreshTrigger} />
      </div>

      {/* Modals */}
      <CreateBrandModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <OnboardingListModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

    </div>
  );
}
