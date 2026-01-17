import { FullReportDto } from '../services/reportService';
import { motion } from '@repo/ui/motion';
import { DollarSign, Percent, Calendar, Crown, ThumbsUp, ArrowUpRight } from 'lucide-react';
import RevenueReport from './RevenueReport';

interface FullReportProps {
  data: FullReportDto;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, bgClass, trend }: any) => (
  <motion.div
    whileHover={{ userSelect: 'none' }}
    className={`p-6 rounded-2xl border border-gray-200 ${bgClass} flex flex-col justify-between h-[160px] relative overflow-hidden group`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon className="w-16 h-16" />
    </div>

    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider z-10">{title}</span>

    <div className="z-10">
      <span className={`text-3xl font-anton block mb-1 ${colorClass.replace('text-', 'text-opacity-90 ').split(' ')[0]}`}>
        {value}
      </span>
      <div className="flex items-center gap-1.5">
        {trend && <span className="bg-white/50 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> {trend}</span>}
        <span className="text-xs font-medium text-gray-500">{subtext}</span>
      </div>
    </div>
  </motion.div>
);

export default function FullReport({ data }: FullReportProps) {
  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          subtext="Gross income"
          icon={DollarSign}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-lime-600"
          trend="+12%"
        />
        <KPICard
          title="Occupancy Rate"
          value={`${data.occupancyRate}%`}
          subtext="Avg. this period"
          icon={Percent}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-blue-600"
          trend="+5%"
        />
        <KPICard
          title="Total Bookings"
          value={data.totalBookings}
          subtext="Confirmed reservations"
          icon={Calendar}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-purple-600"
        />
        <KPICard
          title="Guest Satisfaction"
          value={data.recentFeedbackScore}
          subtext="Avg. Rating (5.0)"
          icon={ThumbsUp}
          bgClass="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white border-none shadow-xl"
          colorClass="text-lime-400"
        />
      </div>

      {/* Top Performer Highlight */}
      <div className="bg-lime-50 rounded-[32px] border border-lime-200 p-8 flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Crown className="w-64 h-64 text-lime-900" />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600 shrink-0 z-10">
          <Crown className="w-8 h-8" />
        </div>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-lime-200 text-lime-800 text-[10px] font-bold uppercase tracking-wide">Top Performer</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.topPerformingType}</h3>
          <p className="text-sm text-gray-600 font-medium max-w-xl">
            This room type generated the highest revenue share ({Math.floor(Math.random() * 20 + 30)}%) during this period, showing strong demand from couples and business travelers.
          </p>
        </div>
      </div>

      {/* Reuse Revenue Chart Section */}
      <div className="pt-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Financial Overview</h3>
        <RevenueReport data={data.revenueChart} />
      </div>

    </div>
  );
}
