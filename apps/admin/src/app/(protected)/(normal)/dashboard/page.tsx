'use client';
import { useEffect, useState } from 'react';
import { motion } from '@repo/ui/motion';
import { adminDashboardService, type AdminDashboardStats } from '../../../../data/dashboardService';
import { LoadingSpinner, useLoading } from '@repo/ui';
import { Building2, CheckCircle, Clock, XCircle, ArrowRight, Hotel, Users, Bed } from '@repo/ui/icons';
import Link from 'next/link';

export default function DashboardPage() {
  const { hide } = useLoading();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Tắt loading overlay
  useEffect(() => {
    hide();
  }, [hide]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminDashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;
  if (error) return <div className="h-full flex items-center justify-center min-h-[60vh] text-red-500 font-bold">Failed to load dashboard data.</div>;

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-anton uppercase text-gray-900 mb-2"
        >
          Platform Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-medium"
        >
          Welcome back, Super Admin. Here's what's happening with Hotel Onboarding.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Brands"
          value={stats?.totalBrands || 0}
          subtitle={`${stats?.activeBrands || 0} active`}
          icon={Building2}
          color="bg-indigo-50 text-indigo-600"
          delay={0.2}
        />
        <StatCard
          label="Platform Hotels"
          value={stats?.totalHotels || 0}
          subtitle={`${stats?.totalRooms || 0} rooms`}
          icon={Hotel}
          color="bg-blue-50 text-blue-600"
          delay={0.3}
        />
        <StatCard
          label="Pending Review"
          value={stats?.pendingApplications || 0}
          subtitle="applications"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          delay={0.4}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.activeUsers || 0} active`}
          icon={Users}
          color="bg-lime-50 text-lime-600"
          delay={0.5}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-green-50 p-6 rounded-[24px] border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Approved</span>
          </div>
          <div className="text-2xl font-anton text-green-700">{stats?.approvedApplications || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-red-50 p-6 rounded-[24px] border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Rejected</span>
          </div>
          <div className="text-2xl font-anton text-red-700">{stats?.rejectedApplications || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-50 p-6 rounded-[24px] border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Bed className="text-gray-600" size={20} />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Rooms</span>
          </div>
          <div className="text-2xl font-anton text-gray-700">{stats?.totalRooms || 0}</div>
        </motion.div>
      </div>

      {/* Quick Actions / Feature Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ActionMethod
          title="Manage Brand Partners"
          description="Review onboarding applications, approve new hotels, and manage brand relationships."
          href="/brand-partners"
          icon={Building2}
          delay={0.6}
        />
        {/* Placeholder for future features */}
        <div className="p-8 rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
          <span className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Coming Soon</span>
          <h3 className="text-lg font-bold text-gray-500">More Analytics</h3>
          <p className="text-sm text-gray-400 mt-1">Further global platform metrics will appear here.</p>
        </div>
      </div>

    </div>
  );
}

const StatCard = ({ label, value, subtitle, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring" }}
    className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="text-3xl font-anton text-gray-900 mb-1">{value}</div>
    <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</div>
    {subtitle && <div className="text-xs text-gray-500 font-medium mt-1">{subtitle}</div>}
  </motion.div>
);

const ActionMethod = ({ title, description, href, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-lime-200 transition-all duration-300 h-full"
  >
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
      <Icon size={120} className="text-lime-500" />
    </div>

    <div className="relative z-10 flex flex-col h-full items-start">
      <div className="w-14 h-14 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-anton text-gray-900 mb-2 group-hover:text-lime-700 transition-colors uppercase">{title}</h3>
      <p className="text-gray-500 font-medium mb-8 max-w-md flex-1">{description}</p>

      <Link href={href} className="w-full sm:w-auto">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm group-hover:bg-lime-500 transition-all shadow-lg shadow-gray-200 group-hover:shadow-lime-200 active:scale-95">
          Access Module <ArrowRight size={16} />
        </button>
      </Link>
    </div>
  </motion.div>
)
