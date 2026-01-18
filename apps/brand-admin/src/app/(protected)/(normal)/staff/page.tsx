
'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Plus, Users, UserPlus } from '@repo/ui/icons';
import { useNotification } from '@repo/ui';
import StaffTable from '../../../../features/staff/components/StaffTable';
import CreateStaffModal from '../../../../features/staff/components/CreateStaffModal';
import { staffService, UserDto } from '../../../../features/staff/services/staffService';

export default function StaffPage() {
  const [data, setData] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { showNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await staffService.getBrandStaff('brand-1');
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load staff list', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1800px] mx-auto">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Users size={12} />
              Human Resources
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Branch Manager Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Oversee leadership across all hotel branches. Appoint & Transfer managers.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <UserPlus size={18} strokeWidth={2.5} />
            <span className="text-sm font-bold uppercase tracking-wide">Appoint Manager</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <StaffTable
          data={data}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Modals */}
      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brandId="brand-1"
        onSuccess={handleRefresh}
      />

    </div>
  );
}
