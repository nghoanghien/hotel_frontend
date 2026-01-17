'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Plus } from '@repo/ui/icons';
import { useNotification } from '@repo/ui';
import AmenityList from '../../../../features/settings/components/AmenityList';
import CreateAmenityModal from '../../../../features/settings/components/CreateAmenityModal';
import { amenityService } from '../../../../features/settings/services/amenityService';

export default function SettingsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const data = await amenityService.getStats();
      setStats(data);
    } catch (e) {
      // Silent fail
    }
  };

  const handleCreateSuccess = () => {
    showNotification({ message: 'Amenity created successfully', type: 'success' });
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
              Master Data
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Settings Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Configure standard amenities and system data.</p>
        </div>

        {/* Action Buttons + Stats */}
        <div className="flex items-center gap-3">
          {/* Stats Cards */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</div>
            <div className="text-2xl font-anton text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</div>
            <div className="text-2xl font-anton text-green-600">{stats.active}</div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm font-bold uppercase tracking-wide">New Amenity</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AmenityList refreshTrigger={refreshTrigger} />
      </div>

      {/* Modals */}
      <CreateAmenityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

    </div>
  );
}
