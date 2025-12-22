'use client';

import { useState, useEffect } from 'react';
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
  Percent,
  ArrowUp,
  ArrowDown,
  Activity
} from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import '@repo/ui/styles/scrollbar.css';

// Mock data types
interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
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

export default function OverviewPage() {
  const { hide } = useLoading();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Mock stats data
  const stats: StatCard[] = [
    {
      id: 'hotels',
      label: 'Tổng số khách sạn',
      value: 247,
      change: 12.5,
      changeLabel: 'so với tháng trước',
      icon: Building2,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bookings',
      label: 'Đặt phòng trong tháng',
      value: '15,842',
      change: 8.3,
      changeLabel: 'so với tháng trước',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'users',
      label: 'Người dùng hoạt động',
      value: '32,451',
      change: 15.2,
      changeLabel: 'so với tháng trước',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'revenue',
      label: 'Doanh thu',
      value: '₫12.5B',
      change: 23.1,
      changeLabel: 'so với tháng trước',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600'
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
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${stat.color} blur-2xl`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                        'bg-gray-200 text-gray-600'
                    }`}>
                    {index + 1}
                  </div>

                  {/* Hotel Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 mb-1 truncate">{hotel.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-[var(--primary)] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        {hotel.bookings.toLocaleString()} đặt phòng
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatCurrency(hotel.revenue)}
                      </div>
                    </div>
                  </div>

                  {/* Award Badge */}
                  {index === 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
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
                const colorMap = {
                  booking: 'bg-green-100 text-green-600',
                  hotel: 'bg-blue-100 text-blue-600',
                  user: 'bg-purple-100 text-purple-600'
                };

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[activity.type]}`}>
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

        {/* System Health & Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-[24px] p-6 shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="text-sm font-semibold mb-2 opacity-90">Tỷ lệ lấp đầy</div>
              <div className="text-4xl font-bold mb-1">87.5%</div>
              <div className="text-xs opacity-80">Trung bình toàn hệ thống</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-[24px] p-6 shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="text-sm font-semibold mb-2 opacity-90">Đánh giá trung bình</div>
              <div className="text-4xl font-bold mb-1 flex items-center gap-2">
                4.6 <Star className="w-8 h-8 fill-white" />
              </div>
              <div className="text-xs opacity-80">Từ 28,450 đánh giá</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[24px] p-6 shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="text-sm font-semibold mb-2 opacity-90">Khuyến mãi đang chạy</div>
              <div className="text-4xl font-bold mb-1 flex items-center gap-2">
                23 <Percent className="w-7 h-7" />
              </div>
              <div className="text-xs opacity-80">Áp dụng cho 156 khách sạn</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
