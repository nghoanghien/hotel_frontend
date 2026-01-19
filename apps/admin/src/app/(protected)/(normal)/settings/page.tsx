"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Plus, Zap, Heart } from '@repo/ui/icons';
import { useNotification } from '@repo/ui';
import AmenityList from '../../../../features/settings/components/AmenityList';
import CreateAmenityModal from '../../../../features/settings/components/CreateAmenityModal';
import SubscriptionPlanList from '../../../../features/settings/components/SubscriptionPlanList';
import CreatePlanModal from '../../../../features/settings/components/CreatePlanModal';
import SettingsTabs from '../../../../features/settings/components/SettingsTabs';
import { amenityService } from '../../../../features/settings/services/amenityService';

type SettingsTab = 'amenities' | 'plans';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('amenities');
  const [isCreateAmenityOpen, setIsCreateAmenityOpen] = useState(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [amenityStats, setAmenityStats] = useState({ total: 0, active: 0, inactive: 0 });

  const { showNotification } = useNotification();

  useEffect(() => {
    if (activeTab === 'amenities') {
      fetchAmenityStats();
    }
  }, [refreshTrigger, activeTab]);

  const fetchAmenityStats = async () => {
    try {
      const data = await amenityService.getStats();
      setAmenityStats(data);
    } catch (e) {
      // Silent fail
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'amenities', label: 'Amenities', icon: <Heart size={16} /> },
    { id: 'plans', label: 'Subscription Plans', icon: <Zap size={16} /> },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            System Settings
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage global platform data and service offerings.</p>
        </div>

        {/* Action Buttons + Stats */}
        <div className="flex items-center gap-3">
          {/* Contextual Stats for Amenities */}
          <AnimatePresence mode="wait">
            {activeTab === 'amenities' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-3"
              >
                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</div>
                  <div className="text-2xl font-anton text-gray-900">{amenityStats.total}</div>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</div>
                  <div className="text-2xl font-anton text-green-600">{amenityStats.active}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contextual Create Button */}
          <button
            onClick={() => activeTab === 'amenities' ? setIsCreateAmenityOpen(true) : setIsCreatePlanOpen(true)}
            className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm font-bold uppercase tracking-wide">
              {activeTab === 'amenities' ? 'New Amenity' : 'New Plan'}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <SettingsTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as SettingsTab)}
      />

      {/* Content Area */}
      <div className="min-h-[600px]">
        {activeTab === 'amenities' ? (
          <AmenityList refreshTrigger={refreshTrigger} />
        ) : (
          <SubscriptionPlanList refreshTrigger={refreshTrigger} />
        )}
      </div>

      {/* Modals */}
      <CreateAmenityModal
        isOpen={isCreateAmenityOpen}
        onClose={() => setIsCreateAmenityOpen(false)}
        onSuccess={() => {
          showNotification({ message: 'Amenity created successfully', type: 'success' });
          handleRefresh();
        }}
      />

      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onSuccess={() => {
          handleRefresh();
        }}
      />

    </div>
  );
}
