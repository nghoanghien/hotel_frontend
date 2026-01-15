import { DataTable, ColumnDef, useNotification } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { mockRooms } from '../data/mockRooms';
import { RoomDto, RoomStatus, RoomType } from '@repo/types';
import { Search, Filter, Download, FileText, CheckCircle, AlertTriangle, X, Clock, BedDouble, Layers, MoreVertical, Settings, CheckSquare, User, MapPin, AlertCircle, Eye } from '@repo/ui/icons';
import { useState, useMemo } from 'react';
import RoomFilterModal, { RoomFilterFields } from './RoomFilterModal';
import RoomSearchPopup from './RoomSearchPopup';
import RoomExportModal from './RoomExportModal';
import RoomActionModal from './RoomActionModal';
import RoomDetailModal from './RoomDetailModal';

const columns: ColumnDef<RoomDto>[] = [
  {
    label: 'ROOM',
    key: 'roomNumber',
    className: 'w-[100px]',
    formatter: (value: any, item: RoomDto) => (
      <span className="font-mono text-lg font-bold text-[#1A1A1A] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
        {item.roomNumber}
      </span>
    )
  },
  {
    label: 'TYPE',
    key: 'type',
    className: 'min-w-[140px]',
    formatter: (value: any, item: RoomDto) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 text-sm">{item.type}</span>
        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
          <Layers size={10} /> Floor {item.floor}
        </span>
      </div>
    )
  },
  {
    label: 'CAPACITY',
    key: 'maxOccupancy',
    className: 'min-w-[120px]',
    formatter: (value: any, item: RoomDto) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.min(item.maxOccupancy, 4) }).map((_, i) => (
            <User key={i} size={14} className="text-gray-500 fill-gray-500/20" />
          ))}
          {item.maxOccupancy > 4 && <span className="text-xs text-gray-500 font-medium">+{item.maxOccupancy - 4}</span>}
        </div>
        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
          <BedDouble size={10} /> {item.numberOfBeds > 1 ? `${item.numberOfBeds}x ` : ''}{item.bedType}
        </span>
      </div>
    )
  },
  {
    label: 'SIZE',
    key: 'sizeInSquareMeters',
    className: 'w-[100px]',
    formatter: (value: any, item: RoomDto) => (
      <span className="font-medium text-gray-600 text-sm">
        {item.sizeInSquareMeters} m²
      </span>
    )
  },
  {
    label: 'FEATURES',
    key: 'features',
    className: 'min-w-[120px]',
    formatter: (value: any, item: RoomDto) => ( // Note: 'features' isn't a direct property of RoomDto, this matches conceptually
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.hasView && (
          <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200" title={`View: ${item.viewDescription}`}>
            <MapPin size={12} />
          </div>
        )}
        {/* @ts-ignore - smokingAllowed might be missing in strict type definition if not updated yet, but we updated data */}
        {item.smokingAllowed && (
          <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200" title="Smoking Allowed">
            <AlertCircle size={12} />
          </div>
        )}
        {/* @ts-ignore */}
        {item.isPetFriendly && (
          <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200" title="Pet Friendly">
            <User size={12} />
          </div>
        )}
        {item.isAccessible && (
          <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200" title="Wheelchair Accessible">
            <Settings size={12} />
          </div>
        )}
      </div>
    )
  },
  {
    label: 'PRICE / NIGHT',
    key: 'basePrice',
    className: 'min-w-[140px]',
    formatter: (value: any, item: RoomDto) => (
      <span className="font-bold text-gray-900 text-sm">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.basePrice)}
      </span>
    )
  },
  {
    label: 'STATUS',
    key: 'status',
    formatter: (value: any, item: RoomDto) => {
      const config = {
        Available: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Available' },
        Occupied: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: BedDouble, label: 'Occupied' },
        Cleaning: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: Layers, label: 'Cleaning' },
        Maintenance: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: Settings, label: 'Maintenance' },
        OutOfOrder: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: AlertTriangle, label: 'Out of Order' },
      }[item.status as string] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: item.status };

      const Icon = config.icon;

      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </span>
      )
    }
  }
];

export default function RoomOperationsTable() {
  const [data, setData] = useState<RoomDto[]>(mockRooms);
  const { showNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState<{ key: keyof RoomDto; direction: 'asc' | 'desc' } | null>(null);

  // Modals
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Search State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });

  // Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<RoomFilterFields>({
    status: '',
    type: [],
    floor: [],
    dateRange: { from: null, to: null },
  });

  const handleSort = (key: string) => {
    const typedKey = key as keyof RoomDto;
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

  const openActionModal = (room: RoomDto) => {
    setSelectedRoom(room);
    setIsActionModalOpen(true);
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = (e: React.MouseEvent, room: RoomDto) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (roomId: string, status: RoomStatus) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    showNotification({ message: 'Room status updated successfully!', type: 'success', format: "Dữ liệu cập nhật thành công." });
  };

  const handleReportMaintenance = async (roomId: string, reason: string, desc: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(prev => prev.map(r => r.id === roomId ? { ...r, status: 'Maintenance' as RoomStatus } : r));
    showNotification({ message: `Maintenance reported: ${reason}`, type: 'success', format: "Báo cáo bảo trì thành công." });
  };

  const handleMarkClean = async (e: React.MouseEvent, room: RoomDto) => {
    e.stopPropagation();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setData(prev => prev.map(r => r.id === room.id ? { ...r, status: 'Available' as RoomStatus } : r));
    showNotification({ message: `Room ${room.roomNumber} marked as clean`, type: 'success', format: "Dữ liệu cập nhật thành công." });
  }

  const handleExport = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting ${scope} data as ${format} with columns: ${columns.join(', ')}`);
  };

  const isFiltered = useMemo(() => {
    return filterFields.status !== '' ||
      filterFields.type.length > 0 ||
      filterFields.dateRange.from !== null;
  }, [filterFields]);

  const clearFilters = () => {
    setFilterFields({
      status: '',
      type: [],
      floor: [],
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
        item.roomNumber.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    }

    // Apply Filters
    result = result.filter(item => {
      const statusMatch = filterFields.status === '' || item.status === filterFields.status;
      const typeMatch = filterFields.type.length === 0 || filterFields.type.includes(item.type);
      // Date range logic would require checking booking overlap, simpler to skip for mock or assume "available" check logic 
      // For now, let's say if date range is set, we filter out occupied rooms randomly to simulate "available" check
      const dateMatch = !filterFields.dateRange.from || (item.status === 'Available');

      return statusMatch && typeMatch && dateMatch;
    });

    // Apply Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by room number
      result.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Room Operations</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage availability, status, and maintenance
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
        <RoomSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(key: string, value: string) => setSearchFields(prev => ({ ...prev, [key]: value }))}
          clearSearchFields={() => setSearchFields({ query: '' })}
          placeholders={{ query: 'Search Room Number or Type...' }}
        />
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>
          {filterFields.status && (
            <button onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))} className="bg-white border text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-500">
              Status: <span className="font-bold">{filterFields.status}</span> <X size={12} />
            </button>
          )}
          {filterFields.type.length > 0 && (
            <button onClick={() => setFilterFields(prev => ({ ...prev, type: [] }))} className="bg-white border text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-500">
              Type: <span className="font-bold">{filterFields.type.join(', ')}</span> <X size={12} />
            </button>
          )}
        </div>
      )}

      <div className="p-4">
        <DataTable<RoomDto>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              {/* Housekeeping Quick Action */}
              {item.status === 'Cleaning' && (
                <motion.button
                  onClick={(e) => handleMarkClean(e, item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Mark as Clean"
                >
                  <CheckSquare className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Mark Clean</span>
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
                title="Manage Room"
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

      <RoomFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

      <RoomDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        roomId={selectedRoom?.id || null}
      />

      <RoomActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        room={selectedRoom}
        onUpdateStatus={handleUpdateStatus}
        onReportMaintenance={handleReportMaintenance}
      />

      <RoomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        previewData={filteredAndSortedData}
      />

    </motion.div>
  );
}
