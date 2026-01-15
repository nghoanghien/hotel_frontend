export interface RevenueStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  revenueGrowth: number;
  currency: string;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  cancelledBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  bookingGrowth: number;
}

export interface OccupancyStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  averageDailyRate: number;
  revPAR: number;
}

export interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  ratingGrowth: number;
}

export interface TopRoom {
  roomId: string;
  roomNumber: string;
  roomType: string;
  bookingCount: number;
  totalRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  guestName?: string;
  roomNumber?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RevenueChart {
  daily: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface BookingChart {
  byStatus: ChartDataPoint[];
  daily: ChartDataPoint[];
}

export interface DashboardSummary {
  revenue: RevenueStats;
  bookings: BookingStats;
  occupancy: OccupancyStats;
  reviews: ReviewStats;
  topRooms: TopRoom[];
  recentActivities: RecentActivity[];
}
