import { DataTable, ColumnDef, useNotification, useSwipeConfirmation } from '@repo/ui';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { RoomDto } from '@repo/types';
import { mockRooms } from '../../data/mockRooms';
import { Edit, Trash2, Search, Filter, Download, Layers, BedDouble, MapPin, AlertCircle, Settings, User, CheckCircle, X, Clock, AlertTriangle } from '@repo/ui/icons';
import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import RoomSearchPopup from '../RoomSearchPopup';
import RoomFilterModal, { RoomFilterFields } from '../RoomFilterModal';
import RoomExportModal from '../RoomExportModal';
import RoomForm from './RoomForm';

export interface RoomConfigurationTableRef {
  openCreateForm: () => void;
}

const columns: ColumnDef<RoomDto>[] = [
  {
    label: 'ROOM',
    key: 'roomNumber',
    className: 'w-[100px]',
    formatter: (val, item) => (
      <span className="font-mono text-lg font-bold text-[#1A1A1A] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
        {item.roomNumber}
      </span>
    )
  },
  {
    label: 'TYPE',
    key: 'type',
    className: 'min-w-[140px]',
    formatter: (val, item) => (
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
    formatter: (val, item) => (
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
    formatter: (val, item) => (
      <span className="font-medium text-gray-600 text-sm">
        {item.sizeInSquareMeters} m²
      </span>
    )
  },
  {
    label: 'FEATURES',
    key: 'features', // Virtual key
    className: 'min-w-[120px]',
    formatter: (val, item) => (
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.hasView && <div title={item.viewDescription} className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200"><MapPin size={12} /></div>}

        {/* Smoking Icon */}
        {item.smokingAllowed && <div title="Smoking Allowed" className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200"><AlertCircle size={12} /></div>}

        {/* Pet Friendly Icon */}
        {item.isPetFriendly && (
          <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200" title="Pet Friendly">
            <User size={12} />
          </div>
        )}

        {item.isAccessible && <div title="Accessible" className="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200"><Settings size={12} /></div>}
      </div>
    )
  },
  {
    label: 'PRICE / NIGHT',
    key: 'basePrice',
    className: 'min-w-[140px]',
    formatter: (val, item) => (
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

const RoomConfigurationTable = forwardRef<RoomConfigurationTableRef, {}>((props, ref) => {
  const [data, setData] = useState<RoomDto[]>(mockRooms);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof RoomDto; direction: 'asc' | 'desc' } | null>(null);

  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<RoomFilterFields>({
    status: '',
    type: [],
    floor: [],
    dateRange: { from: null, to: null },
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Expose methods
  useImperativeHandle(ref, () => ({
    openCreateForm: () => {
      setEditingRoom(null);
      setIsFormOpen(true);
    }
  }));

  // Derived State
  const isFiltered = useMemo(() => {
    return filterFields.status !== '' ||
      filterFields.type.length > 0 ||
      filterFields.dateRange.from !== null;
  }, [filterFields]);

  // Handlers
  const handleSort = (key: string) => {
    const typedKey = key as keyof RoomDto;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchFields.query) {
      const query = searchFields.query.toLowerCase();
      result = result.filter(r =>
        r.roomNumber.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query)
      );
    }

    // Filter
    result = result.filter(item => {
      const typeMatch = filterFields.type.length === 0 || filterFields.type.includes(item.type);
      return typeMatch;
    });

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchFields, filterFields, sortConfig]);

  const handleEdit = (room: RoomDto) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Room",
      description: "Are you sure you want to delete this room? This action cannot be undone.",
      confirmText: "Swipe to Delete",
      type: "danger",
      onConfirm: async () => {
        setData(prev => prev.filter(r => r.id !== id));
        showNotification({ message: 'Room deleted successfully', type: 'success', format: "Phòng đã được xóa thành công." });
      }
    });
  };

  const handleFormSuccess = () => {
    setData([...mockRooms]); // Mock reload
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full"
    >
      {/* Table Toolbar */}
      <div className="pb-4 p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Room List</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">Total {filteredAndSortedData.length} rooms configured</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (!isSearchExpanded) setIsFilterModalOpen(false); setIsSearchExpanded(!isSearchExpanded); }}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {isFiltered ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-xl shadow-lg shadow-lime-200/50 border border-lime-400 group transition-all animate-in fade-in zoom-in duration-200">
              <button onClick={() => { setIsSearchExpanded(false); setIsFilterModalOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <div className="w-px h-4 bg-lime-400 mx-0.5" />
              <button onClick={() => setFilterFields({ status: '', type: [], floor: [], dateRange: { from: null, to: null } })} className="p-1.5 hover:bg-lime-600 text-white rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setIsSearchExpanded(false); setIsFilterModalOpen(true); }}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
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

      {/* Search Popup Area */}
      <div className="px-6 relative">
        <RoomSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(k, v) => setSearchFields(p => ({ ...p, [k]: v }))}
          clearSearchFields={() => setSearchFields({ query: '' })}
          placeholders={{ query: 'Search by room number or type...' }}
        />
      </div>

      {/* Active Filters */}
      {isFiltered && (
        <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

          {filterFields.type.length > 0 && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, type: [] }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Type: <span className="text-lime-600 group-hover:text-red-500 transition-colors">{filterFields.type.join(', ')}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}

          {filterFields.dateRange.from && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, dateRange: { from: null, to: null } }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Date: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                {new Date(filterFields.dateRange.from).toLocaleDateString()} {filterFields.dateRange.to ? `- ${new Date(filterFields.dateRange.to).toLocaleDateString()}` : ''}
              </span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="p-4">
        <DataTable<RoomDto>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          onRowClick={handleEdit}
          headerClassName="bg-gray-200 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-300 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          rowClassName="hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </div>

      {/* Modals */}
      <RoomFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

      <RoomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={async (fmt, scope, cols) => { console.log('Export', fmt, scope, cols); }}
        previewData={filteredAndSortedData}
      />

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]" onClick={() => setIsFormOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-[90] shadow-2xl flex flex-col">
              <RoomForm initialData={editingRoom} onClose={() => setIsFormOpen(false)} onSuccess={handleFormSuccess} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default RoomConfigurationTable;
