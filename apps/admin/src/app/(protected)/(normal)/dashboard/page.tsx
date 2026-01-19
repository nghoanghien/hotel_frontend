'use client';
import { useEffect, useState } from 'react';
import { motion } from '@repo/ui/motion';
import { onboardingService } from '../../../../features/onboarding/services/onboardingService';
import { LoadingSpinner } from '@repo/ui';
import { Building2, CheckCircle, Clock, XCircle, ArrowRight } from '@repo/ui/icons';
import Link from 'next/link';

interface DashboardStats {
  totalApplications: number;
  pending: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  rejected: number;
  draft?: number;
  requiresChanges?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await onboardingService.getStats();
      setStats({
        totalApplications: data.totalApplications || 0,
        pending: data.pendingReview || 0,
        pendingReview: data.pendingReview || 0,
        underReview: data.underReview || 0,
        approved: data.approved || 0,
        rejected: data.rejected || 0,
        draft: data.draft || 0,
        requiresChanges: data.requiresChanges || 0
      });
    } catch (err: any) {
      console.error('Failed to fetch stats', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="font-bold mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const total = (stats?.pending || 0) + (stats?.approved || 0) + (stats?.rejected || 0);

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
          Welcome back, Super Admin. Here&apos;s what&apos;s happening with Hotel Onboarding.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Requests"
          value={stats?.totalApplications || total}
          icon={Building2}
          color="bg-indigo-50 text-indigo-600"
          delay={0.2}
        />
        <StatCard
          label="Pending Review"
          value={stats?.pending || 0}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          delay={0.3}
        />
        <StatCard
          label="Approved"
          value={stats?.approved || 0}
          icon={CheckCircle}
          color="bg-lime-50 text-lime-600"
          delay={0.4}
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected || 0}
          icon={XCircle}
          color="bg-red-50 text-red-600"
          delay={0.5}
        />
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
        <ActionMethod
          title="Onboarding Applications"
          description="Review and process new partner registration applications."
          href="/onboarding"
          icon={Clock}
          delay={0.7}
        />
      </div>

    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color, delay }: { label: string; value: number | string; icon: any; color: string; delay: number }) => (
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
  </motion.div>
);

const ActionMethod = ({ title, description, href, icon: Icon, delay }: { title: string; description: string; href: string; icon: any; delay: number }) => (
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
);
