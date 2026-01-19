'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Plus, Users, ShieldCheck, UserCheck } from '@repo/ui/icons';
import { useNotification } from '@repo/ui';
import UserList from '../../../../features/users/components/UserList';
import CreateUserModal from '../../../../features/users/components/CreateUserModal';
import { userService } from '../../../../features/users/services/userService';

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, pending: 0, byRole: {} as any });

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (e) {
      // Silent fail allowed for stats
    }
  };

  const handleCreateSuccess = () => {
    // Notification handled in modal
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Super Admin Access
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Control system access and user roles.</p>
        </div>

        {/* Action Buttons + Stats */}
        <div className="flex items-center gap-3">
          {/* Stats Cards */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-w-[100px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</div>
            <div className="text-2xl font-anton text-gray-900 leading-none">{stats.total}</div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-w-[100px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active</div>
            <div className="text-2xl font-anton text-green-600 leading-none">{stats.active}</div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-w-[100px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suspended</div>
            <div className="text-2xl font-anton text-red-600 leading-none">{stats.suspended}</div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-w-[100px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</div>
            <div className="text-2xl font-anton text-yellow-600 leading-none">{stats.pending}</div>
          </div>

          {/* Spacer */}
          <div className="w-4" />

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-14 px-8 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-gray-200 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus size={18} strokeWidth={3} className="text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide">Create User</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <UserList
          refreshTrigger={refreshTrigger}
          onUserUpdated={() => setRefreshTrigger(prev => prev + 1)}
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

    </div>
  );
}
