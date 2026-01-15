'use client';

import {
  BadgeDollarSign,
  Users,
  BedDouble,
  Star,
  ArrowRightLeft,
  CalendarCheck,
  LogOut
} from "lucide-react";
import { mockDashboardData, mockRevenueChartData, mockBookingChartData } from "@/data/mockDashboard";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
import { BookingTrendChart } from "@/features/dashboard/components/BookingTrendChart";
import { OccupancyChart } from "@/features/dashboard/components/OccupancyChart";
import { RecentActivityList } from "@/features/dashboard/components/RecentActivityList";
import { TopRoomsList } from "@/features/dashboard/components/TopRoomsList";

export default function DashboardPage() {
  const data = mockDashboardData;
  const revenueChartData = mockRevenueChartData.daily;
  const bookingTrendData = mockBookingChartData.daily;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back, here's what's happening today."
        />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: data.revenue.currency }).format(data.revenue.todayRevenue)}
            subValue="Hôm nay"
            icon={BadgeDollarSign}
            trend={{ value: data.revenue.revenueGrowth, isPositive: data.revenue.revenueGrowth > 0 }}
          />

          <StatsCard
            title="Available Rooms"
            value={`${data.occupancy.availableRooms}/${data.occupancy.totalRooms}`}
            subValue="Phòng trống"
            icon={BedDouble}
            className="border-l-4 border-l-primary"
          />

          <StatsCard
            title="Total Bookings"
            value={data.bookings.totalBookings}
            subValue={`${data.bookings.todayCheckIns} đến hôm nay`}
            icon={CalendarCheck}
            trend={{ value: data.bookings.bookingGrowth, isPositive: data.bookings.bookingGrowth > 0 }}
          />

          <StatsCard
            title="Review Score"
            value={data.reviews.averageRating}
            subValue={`/ 5.0 (${data.reviews.totalReviews} reviews)`}
            icon={Star}
            className="bg-gradient-to-br from-white to-yellow-50/50"
          />
        </div>

        {/* Real-time Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 rounded-[24px] p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-blue-100 font-medium mb-1">Arrivals</p>
              <h3 className="text-4xl font-bold font-feature mb-4">{data.bookings.todayCheckIns}</h3>
              <div className="flex items-center text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                <span>Xem chi tiết</span>
                <ArrowRightLeft size={14} className="ml-2" />
              </div>
            </div>
            <ArrowRightLeft className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-orange-500 rounded-[24px] p-6 text-white shadow-lg shadow-orange-200 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-orange-100 font-medium mb-1">Departures</p>
              <h3 className="text-4xl font-bold font-feature mb-4">{data.bookings.todayCheckOuts}</h3>
              <div className="flex items-center text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                <span>Check-out ngay</span>
                <ArrowRightLeft size={14} className="ml-2" />
              </div>
            </div>
            <LogOut className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-purple-500 rounded-[24px] p-6 text-white shadow-lg shadow-purple-200 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-purple-100 font-medium mb-1">In House</p>
              <h3 className="text-4xl font-bold font-feature mb-4">{data.occupancy.occupiedRooms}</h3>
              <div className="flex items-center text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                <span>Khách đang ở</span>
                <Users size={14} className="ml-2" />
              </div>
            </div>
            <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        {/* Charts & Content Grid */}
        <div className="space-y-8">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevenueChart data={revenueChartData} />
            <BookingTrendChart data={bookingTrendData} />
          </div>

          {/* Bottom Row: Top Rooms (Left 2/3) + Booking Status & Activity (Right 1/3) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <TopRoomsList rooms={data.topRooms} />
            </div>

            <div className="xl:col-span-1 space-y-8">
              <OccupancyChart stats={data.bookings} />
              <RecentActivityList activities={data.recentActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
