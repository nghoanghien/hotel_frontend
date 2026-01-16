import { DataTable, ColumnDef, useNotification } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { Search, Filter, Download, X, Clock, CheckCircle, Key, LogOut, Ban, Eye, MoreVertical, UserCheck, AlertCircle, RotateCcw, ArrowLeftRight } from '@repo/ui/icons';
import { useState, useMemo, useEffect } from 'react';
import { BookingDto, BookingStatus } from '@repo/types';
import { receptionService } from '../services/receptionService';
import BookingFilterModal, { BookingFilterFields } from './BookingFilterModal';
import BookingSearchPopup from './BookingSearchPopup';
import BookingExportModal from './BookingExportModal';
import BookingActionModal from './BookingActionModal';
import BookingDetailModal from './BookingDetailModal';
import ChangeRoomModal from './ChangeRoomModal';
import CheckInModal from './CheckInModal';
import CheckOutModal from './CheckOutModal';

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const columns: ColumnDef<BookingDto>[] = [
  {
    label: 'ID',
    key: 'bookingCode',
    className: 'w-[100px]',
    formatter: (value: any, item: BookingDto) => (
      <span className="font-mono text-lg font-bold text-[#1A1A1A] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
        {item.bookingCode || item.confirmationNumber}
      </span>
    )
  },
  {
    label: 'GUEST',
    key: 'guest',
    className: 'min-w-[180px]',
    formatter: (value: any, item: BookingDto) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 text-sm">{item.guest?.fullName || item.guestName || 'Unknown'}</span>
        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
          {item.guest?.phoneNumber || item.guestPhoneNumber || ''}
        </span>
      </div>
    )
  },
  {
    label: 'ROOM',
    key: 'roomNumber',
    className: 'min-w-[120px]',
    formatter: (value: any, item: BookingDto) => (
      <div className="flex flex-col gap-1">
        {item.roomNumber ? (
          <>
            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded w-fit">
              {item.roomNumber}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {item.roomType || ''}
            </span>
          </>
        ) : (
          <>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded w-fit">
              Not Assigned
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {item.roomType} (Pending)
            </span>
          </>
        )}
      </div>
    )
  },
  {
    label: 'SCHEDULE',
    key: 'checkInDate',
    className: 'min-w-[200px]',
    formatter: (value: any, item: BookingDto) => {
      const checkIn = new Date(item.checkInDate);
      const checkOut = new Date(item.checkOutDate);
      const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

      return (
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.6)]"></div>
              <span className="text-xs font-bold text-gray-900 tracking-tight">{checkIn.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{checkIn.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <span className="text-xs font-bold text-gray-500 tracking-tight">{checkOut.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{checkOut.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100"></div>

          <div className="min-w-[50px] px-2 py-1.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center group hover:bg-[#1A1A1A] hover:border-[#1A1A1A] transition-colors duration-300">
            <span className="text-xs font-black text-[#1A1A1A] group-hover:text-white transition-colors">{nights}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-400 transition-colors">Nights</span>
          </div>
        </div>
      )
    }
  },
  {
    label: 'STATUS',
    key: 'status',
    formatter: (value: any, item: BookingDto) => {
      const config = {
        Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'Pending' },
        Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle, label: 'Confirmed' },
        CheckedIn: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: Key, label: 'Occupied' },
        CheckedOut: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: LogOut, label: 'Checked Out' },
        Cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: Ban, label: 'Cancelled' },
        NoShow: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: AlertCircle, label: 'No Show' },
        Refunded: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Refunded' },
      }[item.status as string] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: item.status };

      const Icon = config.icon;

      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </span>
      )
    }
  },
  {
    label: 'PAYMENT',
    key: 'paymentStatus',
    className: 'min-w-[140px]',
    formatter: (value: any, item: BookingDto) => (
      <div className="flex flex-col items-end">
        <span className={`text-[10px] font-bold uppercase ${item.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
          {item.paymentStatus || (item.isPaid ? 'Paid' : 'Unpaid')}
        </span>
        <span className="font-bold text-gray-900 text-sm">
          {item.totalAmount.toLocaleString()} đ
        </span>
      </div>
    )
  }
];

export default function ReceptionOperationsTable() {
  const [data, setData] = useState<BookingDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState<{ key: keyof BookingDto; direction: 'asc' | 'desc' } | null>(null);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Search State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });

  // Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<BookingFilterFields>({
    status: '',
    paymentStatus: [],
    dateRange: { from: null, to: null },
  });

  // Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Change Room Modal
  const [isChangeRoomModalOpen, setIsChangeRoomModalOpen] = useState(false);

  // Check-in Modal
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Check-out Modal
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

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

  const handleSort = (key: string) => {
    const typedKey = key as keyof BookingDto;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) setIsFilterModalOpen(false);
    setIsSearchExpanded(prev => !prev);
  };

  const openActionModal = (booking: BookingDto) => {
    setSelectedBooking(booking);
    setIsActionModalOpen(true);
  };

  const handleViewDetail = (e: React.MouseEvent, booking: BookingDto) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await receptionService.confirmBooking(bookingId);
      loadData();
      showNotification({ message: 'Booking confirmed successfully!', type: 'success', format: "Đã xác nhận đặt phòng thành công!" });
    } catch (e) {
      showNotification({ message: 'Failed to confirm booking', type: 'error', format: "Đã xác nhận đặt phòng thất bại!" });
    }
  };

  const handleCheckIn = (e: React.MouseEvent, booking: BookingDto) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsCheckInModalOpen(true);
  };

  const handleCheckOut = (e: React.MouseEvent, booking: BookingDto) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsCheckOutModalOpen(true);
  };

  const handleChangeRoom = (e: React.MouseEvent, booking: BookingDto) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsChangeRoomModalOpen(true);
  };

  const handleExport = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting ${scope} data as ${format} with columns: ${columns.join(', ')}`);
  };

  const isFiltered = useMemo(() => {
    return filterFields.status !== '' ||
      filterFields.paymentStatus.length > 0 ||
      filterFields.dateRange.from !== null;
  }, [filterFields]);

  const clearFilters = () => {
    setFilterFields({
      status: '',
      paymentStatus: [],
      dateRange: { from: null, to: null },
    });
  };

  const openFilterModal = () => {
    setIsSearchExpanded(false);
    setIsFilterModalOpen(true);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    if (searchFields.query) {
      const query = searchFields.query.toLowerCase();
      result = result.filter(item =>
        (item.bookingCode || item.confirmationNumber).toLowerCase().includes(query) ||
        (item.guest?.fullName || item.guestName || '').toLowerCase().includes(query) ||
        (item.roomNumber || '').toLowerCase().includes(query)
      );
    }

    // Apply Filters
    result = result.filter(item => {
      const statusMatch = filterFields.status === '' || item.status === filterFields.status;
      const paymentMatch = filterFields.paymentStatus.length === 0 || filterFields.paymentStatus.includes(item.paymentStatus || 'Unpaid');
      return statusMatch && paymentMatch;
    });

    // Apply Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a[sortConfig.key] ?? '') as string | number;
        const bValue = (b[sortConfig.key] ?? '') as string | number;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by booking code
      result.sort((a, b) => (a.bookingCode || '').localeCompare(b.bookingCode || ''));
    }

    return result;
  }, [data, sortConfig, searchFields, filterFields]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full"
    >
      {/* Header */}
      <div className="pb-4 p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Reception Desk</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage bookings, check-ins, and check-outs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={toggleSearch}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {isFiltered ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-xl shadow-lg shadow-lime-200/50 border border-lime-400 group transition-all animate-in fade-in zoom-in duration-200">
              <button
                onClick={openFilterModal}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <div className="w-px h-4 bg-lime-400 mx-0.5" />
              <button
                onClick={clearFilters}
                className="p-1.5 hover:bg-lime-600 text-white rounded-lg transition-colors"
                title="Clear all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openFilterModal}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95 ml-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">Export</span>
          </button>
        </div>
      </div>

      <div className="px-6 relative">
        <BookingSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(key: string, value: string) => setSearchFields(prev => ({ ...prev, [key]: value }))}
          clearSearchFields={() => setSearchFields({ query: '' })}
          placeholders={{ query: 'Search Booking Code, Guest Name, or Room...' }}
        />
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

          {filterFields.status && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Status: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors uppercase">{filterFields.status}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}

          {filterFields.paymentStatus.length > 0 && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, paymentStatus: [] }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Payment: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors">{filterFields.paymentStatus.join(', ')}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}

          {filterFields.dateRange.from && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, dateRange: { from: null, to: null } }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Date: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors">
                {new Date(filterFields.dateRange.from).toLocaleDateString('vi-VN')} {filterFields.dateRange.to ? `- ${new Date(filterFields.dateRange.to).toLocaleDateString('vi-VN')}` : ''}
              </span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}
        </div>
      )}

      <div className="p-4">
        <DataTable<BookingDto>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              {/* Quick Action by Status */}
              {item.status === 'Pending' && (
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleConfirmBooking(item.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Confirm Booking"
                >
                  <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Confirm</span>
                </motion.button>
              )}

              {item.status === 'Confirmed' && (
                <motion.button
                  onClick={(e) => handleCheckIn(e, item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 hover:bg-lime-200 shadow-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Check In"
                >
                  <Key className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Check-in</span>
                </motion.button>
              )}

              {item.status === 'CheckedIn' && (
                <motion.button
                  onClick={(e) => handleCheckOut(e, item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Check Out"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Check-out</span>
                </motion.button>
              )}

              {/* Change Room Action */}
              {item.status === 'CheckedIn' && (
                <motion.button
                  onClick={(e) => handleChangeRoom(e, item)}
                  className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 shadow-sm transition-colors"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  title="Change Room"
                >
                  <ArrowLeftRight size={18} />
                </motion.button>
              )}

              {/* View Detail Action */}
              <motion.button
                onClick={(e) => handleViewDetail(e, item)}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="View Details"
              >
                <Eye size={18} />
              </motion.button>

              {/* General Actions */}
              <motion.button
                onClick={(e) => { e.stopPropagation(); openActionModal(item); }}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="More Actions"
              >
                <MoreVertical size={18} />
              </motion.button>
            </div>
          )}
          onRowClick={(item) => openActionModal(item)}
          headerClassName="bg-gray-200 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-300 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          rowClassName="hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </div>

      <BookingFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />

      <BookingActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        booking={selectedBooking}
        onRefresh={loadData}
        onCheckIn={() => setIsCheckInModalOpen(true)}
        onCheckOut={() => setIsCheckOutModalOpen(true)}
        onChangeRoom={() => setIsChangeRoomModalOpen(true)}
      />

      <BookingExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        previewData={filteredAndSortedData}
      />

      <ChangeRoomModal
        isOpen={isChangeRoomModalOpen}
        onClose={() => setIsChangeRoomModalOpen(false)}
        booking={selectedBooking}
        onSuccess={loadData}
      />

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        booking={selectedBooking}
        onSuccess={loadData}
      />

      <CheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        booking={selectedBooking}
        onSuccess={loadData}
      />

    </motion.div>
  );
}
