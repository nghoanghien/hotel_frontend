import { BookingStatus, RoomStatus } from '@repo/types';

// --- DTO Definitions (Simulating Data needed for Charts) ---

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
  occupancyRate: number; // %
  adr: number; // Average Daily Rate
  revPar: number; // Revenue Per Available Room
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
  roomId: string; // from RoomDto.id
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

// --- Mock Data Generator Helpers ---

const generateRevenueData = (startDate: Date, days: number): RevenueReportItem[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const roomRev = Math.floor(Math.random() * 50000000) + 20000000;
    const serviceRev = Math.floor(roomRev * 0.2);
    return {
      date: date.toISOString(),
      roomRevenue: roomRev,
      serviceRevenue: serviceRev,
      otherRevenue: Math.floor(Math.random() * 1000000),
      tax: (roomRev + serviceRev) * 0.1,
      totalRevenue: roomRev + serviceRev + (roomRev + serviceRev) * 0.1
    };
  });
};

const generateOccupancyData = (startDate: Date, days: number): OccupancyReportItem[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const totalRooms = 50;
    const soldRooms = Math.floor(Math.random() * 40) + 10;
    const revenue = Math.floor(Math.random() * 50000000) + 20000000;
    return {
      date: date.toISOString(),
      totalRooms,
      soldRooms,
      occupancyRate: (soldRooms / totalRooms) * 100,
      adr: revenue / soldRooms,
      revPar: revenue / totalRooms
    };
  });
};

const generateBookingsData = (count: number): BookingReportItem[] => {
  const statuses: BookingStatus[] = ['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'NoShow'];
  // Updated sources as requested: Only Online or Walk-in
  const sources = ['Online Booking', 'Walk-in'];

  return Array.from({ length: count }).map((_, i) => ({
    id: `bk-${i}`,
    bookingCode: `BK-${2024000 + i}`,
    guestName: ['Nguyen Van A', 'John Doe', 'Sarah Connor', 'Tran Thi B', 'Michael Smith'][i % 5],
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: statuses[i % statuses.length],
    source: sources[Math.random() > 0.4 ? 0 : 1], // 60% Online, 40% Walk-in
    totalAmount: Math.floor(Math.random() * 5000000) + 1000000,
    createdAt: new Date().toISOString()
  }));
};

// --- Service Implementation ---

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
    return generateBookingsData(25); // Increase sample size
  },

  getInventoryReport: async (hotelId: string): Promise<InventorySummaryDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const items: InventoryReportItem[] = Array.from({ length: 50 }).map((_, i) => {
      const statusRand = Math.random();
      // IMPORTANT: Must match RoomStatus type values: 'Available' | 'Occupied' | 'Dirty' | 'Cleaning' | 'Maintenance' | 'OutOfOrder'
      let status: RoomStatus = 'Available';
      if (statusRand > 0.6) status = 'Occupied';
      if (statusRand > 0.8) status = 'Dirty';
      if (statusRand > 0.9) status = 'Maintenance';

      return {
        roomId: `r-${i}`,
        roomNumber: `${100 + i}`,
        roomType: i % 2 === 0 ? 'Deluxe King' : 'Standard Twin',
        status: status,
        condition: status === 'Maintenance' ? 'Needs Maintenance' : 'Good',
        lastCleaned: new Date().toISOString(),
        amenitiesCheck: Math.random() > 0.1 ? 'Pass' : 'Fail'
      };
    });

    return {
      totalRooms: 50,
      availableRooms: items.filter(i => i.status === 'Available').length,
      occupiedRooms: items.filter(i => i.status === 'Occupied').length,
      dirtyRooms: items.filter(i => i.status === 'Dirty').length,
      maintenanceRooms: items.filter(i => i.status === 'Maintenance').length,
      items
    };
  },

  getFullReport: async (hotelId: string, startDate: Date, endDate: Date): Promise<FullReportDto> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const revenueData = generateRevenueData(startDate, 7);
    return {
      totalRevenue: revenueData.reduce((acc, curr) => acc + curr.totalRevenue, 0),
      occupancyRate: 78.5,
      totalBookings: 142,
      revenueChart: revenueData,
      topPerformingType: 'Deluxe Ocean View',
      recentFeedbackScore: 4.8
    };
  }
};
