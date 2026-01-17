import { BookingReportItem } from '../services/reportService';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar, CheckCircle, XCircle, User, Globe, Users, ArrowUpRight, Clock, TrendingUp, Layers, Hash, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from '@repo/ui/motion';
import { BookingStatus } from '@repo/types';

interface BookingsReportProps {
  data: BookingReportItem[];
}

const COLORS = ['#84cc16', '#1A1A1A']; // Lime vs Black

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const BookingCard = ({ item }: { item: BookingReportItem }) => {
  // Comprehensive BookingStatus mapping
  // Assuming BookingStatus includes: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow' | 'Refunded'
  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    Pending: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
    Confirmed: { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
    CheckedIn: { color: 'text-green-600', bg: 'bg-green-50', icon: User },
    CheckedOut: { color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle },
    Cancelled: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
    NoShow: { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle },
    Refunded: { color: 'text-purple-600', bg: 'bg-purple-50', icon: RefreshCcw },
  };

  // Use fallback if status is not in the map to prevent crash
  const config = statusConfig[item.status] || statusConfig['Confirmed'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all group"
    >
      {/* Col 1: Guest Info */}
      <div className="col-span-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="min-w-0">
          <h5 className="font-bold text-gray-900 truncate" title={item.guestName}>{item.guestName}</h5>
          <div className="text-xs font-medium text-gray-400 mt-0.5 truncate">
            {new Date(item.checkInDate).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Col 2: Code (Hidden on small, show on md) */}
      <div className="col-span-3 hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          <Hash className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</span>
          <span className="text-xs font-mono font-bold text-gray-600">{item.bookingCode}</span>
        </div>
      </div>

      {/* Col 3: Source */}
      <div className="col-span-3 hidden sm:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          {item.source === 'Online Booking' ? <Globe className="w-4 h-4" /> : <Users className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source</span>
          <span className="text-xs font-bold text-gray-700">{item.source}</span>
        </div>
      </div>

      {/* Col 4: Amount & Status (Right aligned) */}
      <div className="col-span-8 sm:col-span-5 md:col-span-2 flex flex-col items-end">
        <span className="text-sm font-bold text-lime-600">{formatCurrency(item.totalAmount)}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 ${config.bg} ${config.color}`}>
          {item.status}
        </span>
      </div>
    </motion.div>
  );
};

export default function BookingsReport({ data = [] }: BookingsReportProps) {
  const safeData = Array.isArray(data) ? data : [];

  // Summary Calculations
  const totalBookings = safeData.length;
  const totalRevenue = safeData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const confirmedCount = safeData.filter(i => ['Confirmed', 'CheckedIn'].includes(i.status)).length;
  const cancelledCount = safeData.filter(i => ['Cancelled', 'NoShow'].includes(i.status)).length;

  // Source Stats for Pie Chart
  const onlineCount = safeData.filter(i => i.source === 'Online Booking').length;
  const walkInCount = safeData.filter(i => i.source === 'Walk-in').length;
  const sourceData = [
    { name: 'Online', value: onlineCount },
    { name: 'Walk-in', value: walkInCount }
  ];

  // Daily Stats for Bar Chart (Mock aggregation based on available dates or generate sequence)
  const dailyStatsMap = useMemo(() => {
    const map = new Map<string, number>();
    // Initialize aggregation map
    safeData.forEach(item => {
      const dateKey = new Date(item.checkInDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });
    // Convert to array and sort
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Simple sort
  }, [safeData]);


  if (!safeData.length) {
    return <div className="text-center py-10 text-gray-400">No booking records found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-2xl flex flex-col justify-between h-[140px] shadow-lg text-white">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
          <div>
            <span className="text-4xl font-anton text-lime-400">{totalBookings}</span>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-lime-500" /> +5 this week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between h-[140px] shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Guests</span>
          <div>
            <span className="text-4xl font-anton text-blue-600">{confirmedCount}</span>
            <p className="text-xs text-gray-400 mt-1">Arrivals Expecting</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between h-[140px] shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cancellations</span>
          <div>
            <span className="text-4xl font-anton text-red-500">{cancelledCount}</span>
            <p className="text-xs text-gray-400 mt-1">{(cancelledCount / totalBookings * 100).toFixed(1)}% Rate</p>
          </div>
        </div>

        <div className="bg-lime-50 p-6 rounded-2xl border border-lime-200 flex flex-col justify-between h-[140px]">
          <span className="text-xs font-bold text-lime-800 uppercase tracking-wider">Booking Revenue</span>
          <div>
            <span className="text-2xl font-anton text-lime-700">{formatCurrency(totalRevenue)}</span>
            <p className="text-xs text-lime-600 mt-1 font-medium">Est. Income</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Sources (Pie) */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm h-[350px] flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Sources</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#84cc16]" />
              <span className="text-sm font-bold text-gray-600">Online ({((onlineCount / totalBookings) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
              <span className="text-sm font-bold text-gray-600">Walk-in ({((walkInCount / totalBookings) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Daily Acquisitions (Bar) */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm h-[350px] flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Daily Arrivals Impact</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStatsMap} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" fill="#1A1A1A" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Incoming Guests Trend</span>
          </div>
        </div>
      </div>

      {/* Transactions List (Full Width) */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 font-anton">All Transactions</h4>
            <p className="text-sm text-gray-400 font-medium">Detailed history of all bookings in selected period.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-[#1A1A1A] hover:text-white transition-colors">
            View Full History
          </button>
        </div>

        {/* Column Headers for better structure */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-100 mb-2">
          <div className="col-span-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest Details</div>
          <div className="col-span-3 hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</div>
          <div className="col-span-3 hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-wider">Origin</div>
          <div className="col-span-8 sm:col-span-5 md:col-span-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Status & Amount</div>
        </div>

        <div className="space-y-3 custom-scrollbar">
          {safeData.map((booking) => (
            <BookingCard key={booking.id} item={booking} />
          ))}
        </div>
      </div>
    </div>
  );
}
