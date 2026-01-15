import React, { useState, useMemo, useEffect } from 'react';
import { DataTable, ColumnDef, useNotification, LoadingSpinner } from '@repo/ui';
import { BookingDto, BookingStatus } from '../types';
import { Search, Filter, CheckCircle, Clock, LogOut, X, Key, UserCheck, MoreVertical, Ban, RefreshCw, Eye } from '@repo/ui/icons';
import { receptionService } from '../services/receptionService';
import { motion, AnimatePresence } from '@repo/ui/motion';
import CheckInModal from './CheckInModal';
import CheckOutModal from './CheckOutModal';

// Mock function for now, usually would be a util
const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function ReceptionTable() {
  const [data, setData] = useState<BookingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const { showNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await receptionService.getBookings('hotel-1');
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load bookings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<BookingStatus, { bg: string, text: string, icon: any, label: string }> = {
    Pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Clock, label: 'Pending' },
    Confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', icon: CheckCircle, label: 'Confirmed' },
    CheckedIn: { bg: 'bg-green-50', text: 'text-green-600', icon: Key, label: 'Occupied' },
    CheckedOut: { bg: 'bg-gray-100', text: 'text-gray-500', icon: LogOut, label: 'Checked Out' },
    Cancelled: { bg: 'bg-red-50', text: 'text-red-500', icon: Ban, label: 'Cancelled' }
  };

  const columns: ColumnDef<BookingDto>[] = [
    {
      label: 'ID',
      key: 'bookingCode',
      className: 'w-[100px]',
      formatter: (val, item) => <span className="font-mono font-bold text-gray-900">{item.bookingCode}</span>
    },
    {
      label: 'GUEST',
      key: 'guest',
      formatter: (val, item) => (
        <div>
          <div className="font-bold text-gray-900">{item.guest.fullName}</div>
          <div className="text-xs text-gray-500">{item.guest.phoneNumber}</div>
        </div>
      )
    },
    {
      label: 'ROOM',
      key: 'roomNumber',
      formatter: (val, item) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded w-fit">{item.roomNumber}</span>
          <span className="text-[10px] text-gray-400 mt-0.5">{item.roomType}</span>
        </div>
      )
    },
    {
      label: 'SCHEDULE',
      key: 'checkInDate',
      formatter: (val, item) => (
        <div className="text-xs">
          <div className="text-gray-600">In:  <span className="font-medium">{formatDate(item.checkInDate)}</span></div>
          <div className="text-gray-400">Out: {formatDate(item.checkOutDate)}</div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (val, item) => {
        const config = statusConfig[item.status] || statusConfig.Pending;
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-transparent ${config.bg} ${config.text}`}>
            <Icon size={12} /> {config.label}
          </span>
        )
      }
    },
    {
      label: 'PAYMENT',
      key: 'paymentStatus',
      formatter: (val, item) => (
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-bold uppercase ${item.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{item.paymentStatus}</span>
          <span className="text-sm font-bold text-gray-900">{item.totalAmount.toLocaleString()} đ</span>
        </div>
      )
    }
  ];

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter(item =>
      item.bookingCode.toLowerCase().includes(lower) ||
      item.guest.fullName.toLowerCase().includes(lower) ||
      item.roomNumber.includes(lower)
    );
  }, [data, searchQuery]);


  // Actions
  const handleCheckInClick = (item: BookingDto) => {
    setSelectedBooking(item);
    setIsCheckInOpen(true);
  };

  const handleCheckOutClick = (item: BookingDto) => {
    setSelectedBooking(item);
    setIsCheckOutOpen(true);
  };

  const handleConfirmClick = async (item: BookingDto) => {
    // Direct confirm?
    try {
      await receptionService.confirmBooking(item.id);
      showNotification({ message: 'Booking confirmed!', type: 'success' });
      loadData();
    } catch (e) {
      showNotification({ message: 'Failed to confirm', type: 'error' });
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 flex items-center gap-2">
            <UserCheck className="text-lime-500" /> Reception Desk
          </h3>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage arrivals, departures and in-house guests.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search guest, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-lime-200 transition-all w-64"
            />
          </div>
          <button onClick={loadData} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="p-4 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable<BookingDto>
            data={filteredData}
            columns={columns}
            renderActions={(item) => (
              <div className="flex items-center gap-2">
                {/* Primary Action Button Logic */}
                {item.status === 'Pending' && (
                  <button onClick={() => handleConfirmClick(item)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                    Confirm
                  </button>
                )}
                {item.status === 'Confirmed' && (
                  <button onClick={() => handleCheckInClick(item)} className="px-3 py-1.5 bg-lime-50 text-lime-700 rounded-lg text-xs font-bold hover:bg-lime-100 transition-colors flex items-center gap-1">
                    <Key size={12} /> Check-in
                  </button>
                )}
                {item.status === 'CheckedIn' && (
                  <button onClick={() => handleCheckOutClick(item)} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex items-center gap-1">
                    <LogOut size={12} /> Check-out
                  </button>
                )}

                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </div>
            )}
            headerClassName="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider py-4 border-b border-gray-100"
            rowClassName="hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors"
          />
        )}
      </div>

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        booking={selectedBooking}
        onSuccess={loadData}
      />

      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => setIsCheckOutOpen(false)}
        booking={selectedBooking}
        onSuccess={loadData}
      />

    </div>
  );
}
