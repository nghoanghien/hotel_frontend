'use client';

import { useEffect } from "react";
import {
  BadgeDollarSign,
  Users,
  BedDouble,
  Star,
  ArrowRightLeft,
  CalendarCheck,
  LogOut
} from "lucide-react";
import { useLoading } from "@repo/ui";
import { mockDashboardData, mockRevenueChartData, mockBookingChartData } from "@/data/mockDashboard";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { OccupancyGoalCard } from "@/features/dashboard/components/OccupancyGoalCard";
import { OverviewChart } from "@/features/dashboard/components/OverviewChart";
import { TopRoomsScroll } from "@/features/dashboard/components/TopRoomsScroll";
import { ModernActivityList } from "@/features/dashboard/components/ModernActivityList";
import { BookingTrendChart } from "@/features/dashboard/components/BookingTrendChart";

export default function DashboardPage() {
  const { hide } = useLoading();

  // Tắt loading overlay khi dashboard mount (sau khi login thành công)
  useEffect(() => {
    hide();
  }, [hide]);
  const data = mockDashboardData;
  const revenueChartData = mockRevenueChartData.daily;
  const bookingTrendData = mockBookingChartData.daily;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back, here's what's happening today."
          stats={{
            arrivals: data.bookings.todayCheckIns,
            departures: data.bookings.todayCheckOuts,
            inHouse: data.occupancy.occupiedRooms,
            available: data.occupancy.availableRooms
          }}
        />

        {/* Glassmorphism Dashboard Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

          {/* Left Column (1/3) - Metrics Stack */}
          <div className="space-y-6 xl:col-span-1">
            {/* Stacked Cards Effect */}
            <div className="relative h-[250px] md:h-[300px] xl:h-[220px]">
              {/* 3rd Card */}
              <div className="absolute top-8 left-0 right-0 transform scale-90 opacity-40 z-0">
                <MetricCard
                  label="Review Score"
                  value={`${data.reviews.averageRating}/5`}
                  subValue={`${data.reviews.totalReviews} reviews`}
                  trend={data.reviews.ratingGrowth}
                  color="purple"
                  icon={Star}
                />
              </div>
              {/* 2nd Card */}
              <div className="absolute top-4 left-0 right-0 transform scale-95 opacity-70 z-10 transition-transform hover:translate-y-[-10px]">
                <MetricCard
                  label="Total Bookings"
                  value={data.bookings.totalBookings.toString()}
                  subValue={`${data.bookings.todayCheckIns} check-ins`}
                  trend={data.bookings.bookingGrowth}
                  color="orange"
                  icon={CalendarCheck}
                />
              </div>
              {/* 1st Card */}
              <div className="relative z-20 transition-transform hover:translate-y-[-5px]">
                <MetricCard
                  label="Total Revenue"
                  value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: data.revenue.currency, notation: "compact" }).format(data.revenue.todayRevenue)}
                  subValue="Today's Revenue"
                  trend={data.revenue.revenueGrowth}
                  color="blue"
                  icon={BadgeDollarSign}
                />
              </div>
            </div>

            {/* Occupancy Goal */}
            <OccupancyGoalCard stats={data.occupancy} />

            {/* Booking Trend (Moved here as requested) */}
            {/* Booking Trend */}
            <BookingTrendChart data={bookingTrendData} />
          </div>

          {/* Right Column (2/3) - Charts & Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Row 1: Overview Chart (Revenue Bar Chart) */}
            <div className="h-[350px]">
              <OverviewChart data={revenueChartData} />
            </div>

            {/* Row 2: Top Rooms (Quick Transfer) */}
            <div>
              <TopRoomsScroll rooms={data.topRooms} />
            </div>

            {/* Row 3: Activity List (Full width of right column now since trend moved) */}
            <div>
              <ModernActivityList activities={data.recentActivities} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
