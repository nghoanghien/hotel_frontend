import { BookingStatus, RoomStatus } from '@repo/types';
import { mockBookings } from '../../reception/services/receptionService';
import { mockRooms, getRoomStatusCounts } from '../../rooms/data/mockRooms';

const HOTEL_INFO = {
  id: 'hotel-kh-001',
  name: 'Vinpearl Resort & Spa Nha Trang Bay',
};

const roomStatusCounts = getRoomStatusCounts();

// ============================================================================
// HARDCODED CONSTANTS - SINGLE SOURCE OF TRUTH FOR ALL REPORTS
// ============================================================================
const CONSTANTS = {
  // Revenue (30 days period)
  TOTAL_REVENUE_30_DAYS: 335_253_000, // 335M VND
  TOTAL_ROOM_REVENUE_30_DAYS: 268_000_000, // 268M VND (from bookings)
  TOTAL_SERVICE_REVENUE_30_DAYS: 48_240_000, // 18% of room
  TOTAL_OTHER_REVENUE_30_DAYS: 18_760_000, // 7% of room
  TOTAL_TAX_30_DAYS: 33_500_000, // 10% of subtotal

  AVG_DAILY_REVENUE: 11_166_667, // 335M / 30
  AVG_DAILY_ROOM_REVENUE: 8_933_333, // 268M / 30

  // Bookings
  TOTAL_BOOKINGS: 28,
  PENDING_BOOKINGS: 6,
  CONFIRMED_BOOKINGS: 6,
  CHECKED_IN_BOOKINGS: 9,
  CHECKED_OUT_BOOKINGS: 5,
  CANCELLED_BOOKINGS: 2,


  // Rooms & Occupancy - FROM ACTUAL ROOM DATA
  TOTAL_ROOMS: roomStatusCounts.total, // 14
  OCCUPIED_ROOMS: roomStatusCounts.occupied, // 3
  AVAILABLE_ROOMS: roomStatusCounts.available, // 9
  DIRTY_ROOMS: 0, // No Dirty status in current mock
  CLEANING_ROOMS: roomStatusCounts.cleaning, // 2
  MAINTENANCE_ROOMS: roomStatusCounts.maintenance + roomStatusCounts.outOfOrder, // 1

  OCCUPANCY_RATE: Number(((roomStatusCounts.occupied / roomStatusCounts.total) * 100).toFixed(1)), // 21.4%
  AVG_ADR: 2_233_333, // avg daily revenue / occupied rooms
  AVG_REVPAR: 797_619, // avg daily revenue / total rooms

  // Other
  AVG_RATING: 4.8,
  TOP_PERFORMING_TYPE: 'Deluxe Ocean View',
};

export interface RevenueReportItem {
  date: string;
  roomRevenue: number;
  serviceRevenue: number;
  otherRevenue: number;
  tax: number;
  totalRevenue: number;
}

export interface OccupancyReportItem {
  date: string;
  totalRooms: number;
  soldRooms: number;
  occupancyRate: number;
  adr: number;
  revPar: number;
}

export interface BookingReportItem {
  id: string;
  bookingCode: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  source: string;
  totalAmount: number;
  createdAt: string;
}

export interface InventoryReportItem {
  roomId: string;
  roomNumber: string;
  roomType: string;
  status: RoomStatus;
  condition: 'Good' | 'Needs Maintenance' | 'Renovation';
  lastCleaned: string;
  amenitiesCheck: 'Pass' | 'Fail';
}

export interface InventorySummaryDto {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  maintenanceRooms: number;
  cleaningRooms: number;
  items: InventoryReportItem[];
}

export interface FullReportDto {
  totalRevenue: number;
  occupancyRate: number;
  totalBookings: number;
  revenueChart: RevenueReportItem[];
  topPerformingType: string;
  recentFeedbackScore: number;
}

// Deterministic pattern
const getDeterministicVariation = (dayIndex: number): number => {
  return Math.sin(dayIndex * 0.5) * 0.15;
};

// GLOBAL CACHE
let globalRevenueCache: Map<string, RevenueReportItem[]> = new Map();
let globalOccupancyCache: Map<string, OccupancyReportItem[]> = new Map();
let globalInventoryCache: InventorySummaryDto | null = null;
let globalBookingsCache: BookingReportItem[] | null = null;

// Revenue data - distribute CONSTANTS.TOTAL across days
const generateRevenueData = (startDate: Date, days: number): RevenueReportItem[] => {
  const cacheKey = `${startDate.toISOString()}-${days}`;

  if (globalRevenueCache.has(cacheKey)) {
    return globalRevenueCache.get(cacheKey)!;
  }

  const data = Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Distribute total revenue with pattern
    const variation = getDeterministicVariation(i);
    const dailyRoomRevenue = (CONSTANTS.TOTAL_ROOM_REVENUE_30_DAYS / days) * (1 + variation);
    const serviceRev = (CONSTANTS.TOTAL_SERVICE_REVENUE_30_DAYS / days) * (1 + variation);
    const otherRev = (CONSTANTS.TOTAL_OTHER_REVENUE_30_DAYS / days) * (1 + variation);
    const tax = (CONSTANTS.TOTAL_TAX_30_DAYS / days) * (1 + variation);

    return {
      date: date.toISOString(),
      roomRevenue: Math.floor(dailyRoomRevenue),
      serviceRevenue: Math.floor(serviceRev),
      otherRevenue: Math.floor(otherRev),
      tax: Math.floor(tax),
      totalRevenue: Math.floor(dailyRoomRevenue + serviceRev + otherRev + tax)
    };
  });

  // Adjust last day to ensure total matches EXACTLY
  const currentTotal = data.reduce((sum, d) => sum + d.totalRevenue, 0);
  const diff = CONSTANTS.TOTAL_REVENUE_30_DAYS - currentTotal;
  if (data.length > 0) {
    data[data.length - 1].totalRevenue += diff;
  }

  globalRevenueCache.set(cacheKey, data);
  return data;
};

// Occupancy uses HARDCODED constants
const generateOccupancyData = (startDate: Date, days: number): OccupancyReportItem[] => {
  const cacheKey = `${startDate.toISOString()}-${days}`;

  if (globalOccupancyCache.has(cacheKey)) {
    return globalOccupancyCache.get(cacheKey)!;
  }

  const data = Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Small variation around hardcoded values
    const occupancyVariation = Math.floor(Math.sin(i * 0.3));
    const occupiedRooms = Math.max(1, CONSTANTS.OCCUPIED_ROOMS + occupancyVariation);

    return {
      date: date.toISOString(),
      totalRooms: CONSTANTS.TOTAL_ROOMS,
      soldRooms: occupiedRooms,
      occupancyRate: CONSTANTS.OCCUPANCY_RATE, // Hardcoded
      adr: CONSTANTS.AVG_ADR, // Hardcoded
      revPar: CONSTANTS.AVG_REVPAR // Hardcoded
    };
  });

  globalOccupancyCache.set(cacheKey, data);
  return data;
};

const generateBookingsDataFromMock = (): BookingReportItem[] => {
  if (globalBookingsCache) {
    return globalBookingsCache;
  }

  const data = mockBookings.map((booking, index) => ({
    id: booking.id,
    bookingCode: booking.bookingCode || booking.confirmationNumber || 'N/A',
    guestName: booking.guestName || 'Unknown Guest',
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    status: booking.status,
    source: index % 5 < 3 ? 'Online Booking' : 'Walk-in',
    totalAmount: booking.totalAmount,
    createdAt: booking.bookedAt || booking.createdAt
  }));

  globalBookingsCache = data;
  return data;
};

const generateInventorySummary = (): InventorySummaryDto => {
  if (globalInventoryCache) {
    return globalInventoryCache;
  }

  const items: InventoryReportItem[] = mockRooms.map((room, index) => {
    const lastCleanedDate = new Date();
    lastCleanedDate.setHours(lastCleanedDate.getHours() - (index % 24));

    return {
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      status: room.status,
      condition: room.status === 'Maintenance' ? 'Needs Maintenance' :
        room.status === 'OutOfOrder' ? 'Renovation' : 'Good',
      lastCleaned: lastCleanedDate.toISOString(),
      amenitiesCheck: index % 20 === 0 ? 'Fail' : 'Pass'
    };
  });

  const data = {
    totalRooms: CONSTANTS.TOTAL_ROOMS, // Hardcoded
    availableRooms: CONSTANTS.AVAILABLE_ROOMS, // Hardcoded
    occupiedRooms: CONSTANTS.OCCUPIED_ROOMS, // Hardcoded
    dirtyRooms: 2, // Hardcoded
    cleaningRooms: CONSTANTS.CLEANING_ROOMS, // Hardcoded
    maintenanceRooms: CONSTANTS.MAINTENANCE_ROOMS, // Hardcoded
    items
  };

  globalInventoryCache = data;
  return data;
};

export const reportService = {
  getRevenueReport: async (hotelId: string, startDate: Date, endDate: Date): Promise<RevenueReportItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return generateRevenueData(startDate, diffDays);
  },

  getOccupancyReport: async (hotelId: string, startDate: Date, endDate: Date): Promise<OccupancyReportItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return generateOccupancyData(startDate, diffDays);
  },

  getBookingsReport: async (hotelId: string, startDate: Date, endDate: Date): Promise<BookingReportItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateBookingsDataFromMock();
  },

  getInventoryReport: async (hotelId: string): Promise<InventorySummaryDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateInventorySummary();
  },

  getFullReport: async (hotelId: string, startDate: Date, endDate: Date): Promise<FullReportDto> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.min(30, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const revenueData = generateRevenueData(startDate, diffDays);

    return {
      totalRevenue: CONSTANTS.TOTAL_REVENUE_30_DAYS, // HARDCODED
      occupancyRate: CONSTANTS.OCCUPANCY_RATE, // HARDCODED
      totalBookings: CONSTANTS.TOTAL_BOOKINGS, // HARDCODED
      revenueChart: revenueData,
      topPerformingType: CONSTANTS.TOP_PERFORMING_TYPE,
      recentFeedbackScore: CONSTANTS.AVG_RATING
    };
  },

  getStats: async (hotelId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      totalRevenue: CONSTANTS.TOTAL_REVENUE_30_DAYS, // HARDCODED
      avgDailyRevenue: CONSTANTS.AVG_DAILY_REVENUE, // HARDCODED
      totalBookings: CONSTANTS.TOTAL_BOOKINGS, // HARDCODED
      totalRooms: CONSTANTS.TOTAL_ROOMS, // HARDCODED
      occupiedRooms: CONSTANTS.OCCUPIED_ROOMS, // HARDCODED
      availableRooms: CONSTANTS.AVAILABLE_ROOMS, // HARDCODED
      occupancyRate: CONSTANTS.OCCUPANCY_RATE, // HARDCODED
      avgRating: CONSTANTS.AVG_RATING, // HARDCODED
      pendingBookings: CONSTANTS.PENDING_BOOKINGS, // HARDCODED
      confirmedBookings: CONSTANTS.CONFIRMED_BOOKINGS, // HARDCODED
      checkedInToday: 2, // Static
      checkOutToday: 1 // Static
    };
  }
};
