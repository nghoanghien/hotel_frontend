'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Plus, Edit, Trash2, Search, Filter, Download, Layers, BedDouble, MapPin, AlertCircle, Settings, User, CheckCircle, X } from '@repo/ui/icons';
import { DataTable, ColumnDef, useNotification } from '@repo/ui';
import { RoomDto } from '@repo/types';
import { mockRooms } from '../../../../features/rooms/data/mockRooms';
import RoomForm from '../../../../features/rooms/components/configuration/RoomForm';
import RoomSearchPopup from '../../../../features/rooms/components/RoomSearchPopup';
import RoomFilterModal, { RoomFilterFields } from '../../../../features/rooms/components/RoomFilterModal';
import RoomExportModal from '../../../../features/rooms/components/RoomExportModal';

export default function RoomConfigurationPage() {
  const [data, setData] = useState<RoomDto[]>(mockRooms);
  const { showNotification } = useNotification();

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
  const [sortConfig, setSortConfig] = useState<{ key: keyof RoomDto; direction: 'asc' | 'desc' } | null>(null);

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
      // Note: Status/Date filter might not apply strictly to "Configuration" context (which is about static room data), 
      // but we keep logic if user wants to filter by "current status" even in config view.
      // For pure config, we mostly care about static props.
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

  const handleCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: RoomDto) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setData(prev => prev.filter(r => r.id !== id));
      showNotification({ message: 'Room deleted successfully', type: 'success' });
    }
  };

  const handleFormSuccess = () => {
    // Reload/Re-fetch
    setData([...mockRooms]); // Mock reload
  };

  // Columns Configuration (Rich Style)
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
      label: 'FEATURES',
      key: 'features', // Virtual key
      className: 'min-w-[120px]',
      formatter: (val, item) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.hasView && <div title={item.viewDescription} className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><MapPin size={12} /></div>}

          {/* @ts-ignore */}
          {item.smokingAllowed && <div title="Smoking Allowed" className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200"><AlertCircle size={12} /></div>}

          {item.isAccessible && <div title="Accessible" className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100"><Settings size={12} /></div>}
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
    }
  ];

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-anton font-bold text-[#1A1A1A] mb-2">Room Configuration</h1>
          <p className="text-gray-500 font-medium text-lg">Set up room types, pricing, and amenities.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus size={20} /> Create New Room
        </button>
      </div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full"
      >
        {/* Table Toolbar */}
        <div className="pb-4 p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-orange-400 rounded-full" />
              <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Room List</h3>
            </div>
            <p className="text-sm font-medium text-gray-400 pl-3.5">Total {filteredAndSortedData.length} rooms configured</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (!isSearchExpanded) setIsFilterModalOpen(false); setIsSearchExpanded(!isSearchExpanded); }}
              className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-orange-100 border-orange-200 text-orange-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {isFiltered ? (
              <div className="flex items-center gap-1 p-1 pr-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-200/50 border border-orange-400 group transition-all animate-in fade-in zoom-in duration-200">
                <button onClick={() => { setIsSearchExpanded(false); setIsFilterModalOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 hover:bg-orange-600 rounded-lg transition-colors">
                  <Filter className="w-4 h-4 text-white fill-current" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
                </button>
                <div className="w-px h-4 bg-orange-400 mx-0.5" />
                <button onClick={() => setFilterFields({ status: '', type: [], floor: [], dateRange: { from: null, to: null } })} className="p-1.5 hover:bg-orange-600 text-white rounded-lg transition-colors">
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
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm active:scale-95 ml-2"
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
              <button onClick={() => setFilterFields(prev => ({ ...prev, type: [] }))} className="bg-white border text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-500">
                Type: <span className="font-bold">{filterFields.type.join(', ')}</span> <X size={12} />
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
      </motion.div>

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

    </div>
  );
}
