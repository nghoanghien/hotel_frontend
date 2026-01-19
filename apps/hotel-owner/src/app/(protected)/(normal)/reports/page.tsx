'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { reportService, RevenueReportItem, OccupancyReportItem, BookingReportItem, InventorySummaryDto, FullReportDto } from '@/features/reports/services/reportService';
import ReportHeader from '@/features/reports/components/ReportHeader';
import RevenueReport from '@/features/reports/components/RevenueReport';
import OccupancyReport from '@/features/reports/components/OccupancyReport';
import BookingsReport from '@/features/reports/components/BookingsReport';
import InventoryReport from '@/features/reports/components/InventoryReport';
import FullReport from '@/features/reports/components/FullReport';
import { Loader2 } from 'lucide-react';
import { useNotification } from '@repo/ui';

type ReportTab = 'full' | 'revenue' | 'occupancy' | 'bookings' | 'inventory';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('full');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  const { showNotification } = useNotification();
  const hotelId = 'hotel-kh-001'; // Vinpearl Resort & Spa Nha Trang Bay

  // Initialize dates on client mount to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setStartDate(thirtyDaysAgo);
    setEndDate(now);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !startDate || !endDate) return;
    // Reset data immediately when tab or filters change to prevent type mismatch
    setReportData(null);
    fetchReportData();
  }, [activeTab, startDate, endDate]);

  const fetchReportData = async () => {
    if (!startDate || !endDate) return; // Guard clause for null dates

    setIsLoading(true);
    try {
      let data;
      switch (activeTab) {
        case 'revenue':
          data = await reportService.getRevenueReport(hotelId, startDate, endDate);
          break;
        case 'occupancy':
          data = await reportService.getOccupancyReport(hotelId, startDate, endDate);
          break;
        case 'bookings':
          data = await reportService.getBookingsReport(hotelId, startDate, endDate);
          break;
        case 'inventory':
          data = await reportService.getInventoryReport(hotelId);
          break;
        case 'full':
        default:
          data = await reportService.getFullReport(hotelId, startDate, endDate);
          break;
      }
      setReportData(data);
    } catch (error) {
      showNotification({ message: 'Failed to load report data', type: 'error' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    // Use 'success' type with a descriptive message as 'info' is not supported
    showNotification({
      message: `Exporting ${activeTab} report to ${type.toUpperCase()}...`,
      type: 'success',
      format: 'Đang xử lý xuất báo cáo...'
    });
    // Integrate with actual export API later
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-lime-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium animate-pulse">Analyzing data...</p>
        </div>
      );
    }

    if (!reportData) return null;

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'revenue' && <RevenueReport data={reportData as RevenueReportItem[]} />}
        {activeTab === 'occupancy' && <OccupancyReport data={reportData as OccupancyReportItem[]} />}
        {activeTab === 'bookings' && <BookingsReport data={reportData as BookingReportItem[]} />}
        {activeTab === 'inventory' && <InventoryReport data={reportData as InventorySummaryDto} />}
        {activeTab === 'full' && <FullReport data={reportData as FullReportDto} />}
      </motion.div>
    );
  };

  // Don't render until client-mounted and dates initialized
  if (!isMounted || !startDate || !endDate) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-lime-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 pb-32">
      <div className="max-w-[1600px] mx-auto">
        <ReportHeader
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as ReportTab)}
          startDate={startDate}
          endDate={endDate}
          onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }}
          onExport={handleExport}
        />

        <div className="relative min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
