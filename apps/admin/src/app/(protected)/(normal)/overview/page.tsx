'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from '@repo/ui/motion';
import { useLoading } from '@repo/ui';
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Award,
  MapPin,
  Star,
  Activity,
  ArrowUp,
  ArrowDown,
  ChevronDown
} from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import {
  RechartsAreaChart,
  RechartsBarChart,
  RechartsPieChart,
  Area,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from '@repo/ui';
import '@repo/ui/styles/scrollbar.css';

// Mock data types
interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: any;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'hotel' | 'user';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
}

interface TopHotel {
  id: string;
  name: string;
  location: string;
  bookings: number;
  revenue: number;
  rating: number;
  image: string;
}

interface ChartDataPoint {
  date: string;
  hotels: number;
  bookings: number;
  users: number;
  revenue: number;
}

type TimeRange = '7days' | '30days' | '3months';

export default function OverviewPage() {
  const { hide } = useLoading();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Separate states for each chart
  const [usersBookingsTimeRange, setUsersBookingsTimeRange] = useState<TimeRange>('30days');
  const [revenueTimeRange, setRevenueTimeRange] = useState<TimeRange>('30days');
  const [hotelsTimeRange, setHotelsTimeRange] = useState<TimeRange>('30days');

  const [showUsersBookingsMenu, setShowUsersBookingsMenu] = useState(false);
  const [showRevenueMenu, setShowRevenueMenu] = useState(false);
  const [showHotelsMenu, setShowHotelsMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Generate mock chart data based on time range
  const generateChartData = (range: TimeRange): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = new Date();

    let days = 0;
    switch (range) {
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case '3months':
        days = 90;
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate realistic fluctuating data
      const baseHotels = 240;
      const baseBookings = 450;
      const baseUsers = 900;
      const baseRevenue = 12;
      const variation = Math.sin(i / 7) * 50 + Math.random() * 30;

      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        hotels: Math.floor(baseHotels + variation / 10),
        bookings: Math.floor(baseBookings + variation),
        users: Math.floor(baseUsers + variation * 1.5),
        revenue: Number((baseRevenue + variation / 30).toFixed(1))
      });
    }

    return data;
  };

  // Separate data for each chart
  const usersBookingsData = useMemo(() => generateChartData(usersBookingsTimeRange), [usersBookingsTimeRange]);
  const revenueData = useMemo(() => generateChartData(revenueTimeRange), [revenueTimeRange]);
  const hotelsData = useMemo(() => generateChartData(hotelsTimeRange), [hotelsTimeRange]);

  const timeRangeOptions = [
    { value: '7days' as TimeRange, label: 'Last 7 days' },
    { value: '30days' as TimeRange, label: 'Last 30 days' },
    { value: '3months' as TimeRange, label: 'Last 3 months' }
  ];

  // Mock occupancy data for bar chart (last 6 months)
  const occupancyData = [
    { month: 'T1', rate: 78 },
    { month: 'T2', rate: 88 },
    { month: 'T3', rate: 82 },
    { month: 'T4', rate: 65 },
    { month: 'T5', rate: 85 },
    { month: 'T6', rate: 87 }
  ];

  // Mock rating distribution data for pie chart
  const ratingDistribution = [
    { stars: '5 sao', value: 12450, percentage: 55, color: 'var(--primary)' },
    { stars: '4 sao', value: 6800, percentage: 30, color: 'var(--secondary)' },
    { stars: '3 sao', value: 2270, percentage: 10, color: 'var(--warning)' },
    { stars: '2 sao', value: 680, percentage: 3, color: '#D1D5DB' },
    { stars: '1 sao', value: 450, percentage: 2, color: 'var(--danger)' }
  ];

  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.value, 0);
  const averageRating = 4.6;
  const latestOccupancy = occupancyData[occupancyData.length - 1].rate;

  // Mock stats data
  const stats: StatCard[] = [
    {
      id: 'hotels',
      label: 'Tổng số khách sạn',
      value: 247,
      change: 12.5,
      changeLabel: 'so với tháng trước',
      icon: Building2
    },
    {
      id: 'bookings',
      label: 'Đặt phòng trong tháng',
      value: '15,842',
      change: 8.3,
      changeLabel: 'so với tháng trước',
      icon: Calendar
    },
    {
      id: 'users',
      label: 'Người dùng hoạt động',
      value: '32,451',
      change: 15.2,
      changeLabel: 'so với tháng trước',
      icon: Users
    },
    {
      id: 'revenue',
      label: 'Doanh thu',
      value: '₫12.5B',
      change: 23.1,
      changeLabel: 'so với tháng trước',
      icon: DollarSign
    }
  ];

  // Mock top hotels
  const topHotels: TopHotel[] = [
    {
      id: '1',
      name: 'Grand Palace Hotel',
      location: 'Hà Nội',
      bookings: 1247,
      revenue: 2450000000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
      id: '2',
      name: 'Seaside Resort & Spa',
      location: 'Đà Nẵng',
      bookings: 1102,
      revenue: 2180000000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
    },
    {
      id: '3',
      name: 'Mountain View Lodge',
      location: 'Sapa',
      bookings: 987,
      revenue: 1920000000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
    },
    {
      id: '4',
      name: 'Luxury Central Hotel',
      location: 'TP. Hồ Chí Minh',
      bookings: 856,
      revenue: 1780000000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'
    }
  ];

  // Mock recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'hotel',
      title: 'Khách sạn mới được thêm',
      description: 'Ocean Blue Resort đã được thêm vào hệ thống',
      timestamp: '5 phút trước',
      icon: Building2
    },
    {
      id: '2',
      type: 'booking',
      title: 'Đặt phòng mới',
      description: '3 phòng tại Grand Palace Hotel',
      timestamp: '12 phút trước',
      icon: Calendar
    },
    {
      id: '3',
      type: 'user',
      title: 'Người dùng mới',
      description: '47 người dùng mới đăng ký hôm nay',
      timestamp: '1 giờ trước',
      icon: Users
    },
    {
      id: '4',
      type: 'booking',
      title: 'Thanh toán thành công',
      description: 'Booking #15842 - ₫4,500,000',
      timestamp: '2 giờ trước',
      icon: DollarSign
    },
    {
      id: '5',
      type: 'hotel',
      title: 'Cập nhật khách sạn',
      description: 'Seaside Resort thêm 5 phòng mới',
      timestamp: '3 giờ trước',
      icon: Building2
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900 mb-2 text-sm">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.dataKey === 'revenue' ? `₫${entry.value}B` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-8">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Dashboard Overview</h2>
            <p className="text-gray-600">Tổng quan hệ thống quản lý khách sạn</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
            {(['today', 'week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${selectedPeriod === period
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {period === 'today' ? 'Hôm nay' : period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={stat.id}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity bg-[var(--primary)] blur-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[var(--primary)]" strokeWidth={2} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[var(--primary)]' : 'text-[var(--danger)]'}`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.changeLabel}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Users & Bookings Chart - Full Width */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Users & Bookings</h3>
              <p className="text-xs text-gray-500">
                Showing for the last {usersBookingsTimeRange === '7days' ? '7 days' : usersBookingsTimeRange === '30days' ? '30 days' : '3 months'}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUsersBookingsMenu(!showUsersBookingsMenu)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium"
              >
                {timeRangeOptions.find(opt => opt.value === usersBookingsTimeRange)?.label}
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {showUsersBookingsMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10"
                >
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setUsersBookingsTimeRange(option.value);
                        setShowUsersBookingsMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${usersBookingsTimeRange === option.value ? 'text-[var(--primary)] font-semibold' : 'text-gray-700'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={usersBookingsData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--warning)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--warning)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Người dùng"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Đặt phòng"
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
              <span className="text-xs font-medium text-gray-700">Đặt phòng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
              <span className="text-xs font-medium text-gray-700">Người dùng</span>
            </div>
          </div>
        </div>

        {/* Revenue & Hotels Charts - 2 Columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Revenue</h3>
                <p className="text-xs text-gray-500">
                  Showing for the last {revenueTimeRange === '7days' ? '7 days' : revenueTimeRange === '30days' ? '30 days' : '3 months'}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowRevenueMenu(!showRevenueMenu)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium"
                >
                  {timeRangeOptions.find(opt => opt.value === revenueTimeRange)?.label}
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showRevenueMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10"
                  >
                    {timeRangeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setRevenueTimeRange(option.value);
                          setShowRevenueMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${revenueTimeRange === option.value ? 'text-[var(--primary)] font-semibold' : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: '10px' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '10px' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--danger)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh thu (B)"
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]" />
                <span className="text-xs font-medium text-gray-700">Doanh thu (tỷ đồng)</span>
              </div>
            </div>
          </div>

          {/* Hotels Chart */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Hotels</h3>
                <p className="text-xs text-gray-500">
                  Showing for the last {hotelsTimeRange === '7days' ? '7 days' : hotelsTimeRange === '30days' ? '30 days' : '3 months'}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowHotelsMenu(!showHotelsMenu)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium"
                >
                  {timeRangeOptions.find(opt => opt.value === hotelsTimeRange)?.label}
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showHotelsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10"
                  >
                    {timeRangeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setHotelsTimeRange(option.value);
                          setShowHotelsMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${hotelsTimeRange === option.value ? 'text-[var(--primary)] font-semibold' : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={hotelsData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHotels" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: '10px' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '10px' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hotels"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHotels)"
                    name="Khách sạn"
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                <span className="text-xs font-medium text-gray-700">Tổng số khách sạn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-[1fr_380px] gap-6">
          {/* Left Column - Top Hotels */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Top khách sạn</h3>
                <p className="text-sm text-gray-600">Theo số lượng đặt phòng</p>
              </div>
              <button className="text-sm font-semibold text-[var(--primary)] hover:underline">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {topHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[var(--primary)]/30 hover:bg-gray-50/50 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-[var(--warning)]' :
                    index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-[var(--secondary)]' :
                        'bg-gray-300'
                    }`}>
                    {index + 1}
                  </div>

                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 mb-1 truncate">{hotel.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <Star className="w-4 h-4 fill-[var(--warning)] text-[var(--warning)]" />
                      <span>{hotel.rating}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-[var(--primary)] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        {hotel.bookings.toLocaleString()} đặt phòng
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatCurrency(hotel.revenue)}
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--warning)] flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Recent Activities */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-xl font-bold text-[#1A1A1A]">Hoạt động gần đây</h3>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 mb-0.5 group-hover:text-[var(--primary)] transition-colors">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{activity.description}</div>
                      <div className="text-xs text-gray-400">{activity.timestamp}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Grid - Occupancy & Rating */}
        <div className="grid grid-cols-2 gap-6">
          {/* Occupancy Rate - Bar Chart Horizontal */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Tỷ lệ lấp đầy</h3>
              <p className="text-sm text-gray-500">Tháng 1 - Tháng 6 năm 2024</p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={occupancyData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="month"
                    type="category"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Tỷ lệ lấp đầy']}
                  />
                  <Bar
                    dataKey="rate"
                    fill="var(--primary)"
                    radius={[0, 8, 8, 0]}
                    barSize={24}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                <p className="text-sm font-semibold text-gray-900">Hiện tại {latestOccupancy}% phòng đang được đặt</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Tỷ lệ lấp đầy trung bình 6 tháng gần nhất</p>
            </div>
          </motion.div>

          {/* Rating Distribution - Pie Chart */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Phân bổ đánh giá</h3>
              <p className="text-sm text-gray-500">Tháng 1 - Tháng 6 năm 2024</p>
            </div>

            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value.toLocaleString()} đánh giá (${props.payload.percentage}%)`,
                      props.payload.stars
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Đánh giá trung bình:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  <Star className="w-5 h-5 fill-[var(--warning)] text-[var(--warning)]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                <p className="text-sm font-semibold text-gray-900">Tổng {totalReviews.toLocaleString()} đánh giá</p>
              </div>
              <p className="text-xs text-gray-500">Phân bổ đánh giá theo số sao trong 6 tháng</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
